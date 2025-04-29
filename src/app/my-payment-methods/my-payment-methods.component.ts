import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ComponentsModule } from '@biggive/components-angular';
import { PaymentMethod } from '@stripe/stripe-js';
import { ActivatedRoute } from '@angular/router';
import { UpdateCardModalComponent } from '../update-card-modal/update-card-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Person } from '../person.model';
import { ExactCurrencyPipe } from '../exact-currency.pipe';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DonationService } from '../donation.service';
import { IdentityService } from '../identity.service';
import { MatDialog } from '@angular/material/dialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { BackendError, errorDescription, errorDetails } from '../backendError';
import { RegularGivingService } from '../regularGiving.service';
import { Toast } from '../toast.service';

@Component({
  selector: 'app-my-payment-methods',
  imports: [ComponentsModule, ExactCurrencyPipe, FaIconComponent, MatProgressSpinner],
  templateUrl: './my-payment-methods.component.html',
  styleUrl: './my-payment-methods.component.scss',
})
export class MyPaymentMethodsComponent implements OnInit, OnDestroy {
  protected paymentMethods:
    | {
        adHocMethods: PaymentMethod[];
        regularGivingPaymentMethod?: PaymentMethod;
      }
    | undefined;
  protected person!: Person;

  private savedCardsTimer: undefined | ReturnType<typeof setTimeout>; // https://stackoverflow.com/a/56239226

  protected registerErrorDescription: string | undefined;
  protected registerSuccessMessage: string | undefined;

  constructor(
    private donationService: DonationService,
    private identityService: IdentityService,
    private route: ActivatedRoute,
    private regularGivingService: RegularGivingService,
    public dialog: MatDialog,
    private toaster: Toast,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.paymentMethods = this.route.snapshot.data.paymentMethods;
    this.person = this.route.snapshot.data.person;
    if (isPlatformBrowser(this.platformId)) {
      this.savedCardsTimer = setTimeout(this.checkForPaymentCardsIfNotLoaded, 5_000);
    }
  }

  protected get hasSavedPaymentMethods() {
    return this.paymentMethods !== undefined && this.paymentMethods.adHocMethods.length > 0;
  }

  /**
   * To work around a bug where it seems sometimes new payment cards are not showing on this page, if there are none
   * loaded at this point we check again with the server.
   */
  private checkForPaymentCardsIfNotLoaded = async () => {
    if (this.paymentMethods && this.paymentMethods.adHocMethods.length > 0) {
      return;
    }

    this.paymentMethods = await this.donationService.getPaymentMethods({ cacheBust: true });
  };

  async loadPaymentMethods() {
    this.paymentMethods = await this.donationService.getPaymentMethods({ cacheBust: true });
  }

  deleteMethod(method: PaymentMethod) {
    this.paymentMethods = undefined;

    this.donationService
      .deleteStripePaymentMethod(this.person, method, this.jwtAsString())
      .subscribe(this.loadPaymentMethods.bind(this), (error: BackendError) => {
        this.loadPaymentMethods.bind(this)();
        alert(errorDetails(error));
      });
  }

  updateCard(methodId: string, card: PaymentMethod.Card, billingDetails: PaymentMethod.BillingDetails) {
    const updateCardDialog = this.dialog.open(UpdateCardModalComponent);
    updateCardDialog.componentInstance.setPaymentMethod(card, billingDetails);
    updateCardDialog.afterClosed().subscribe((data: unknown) => {
      if (data === 'null') {
        return;
      }

      const formValue = updateCardDialog.componentInstance.form.value;

      const paymentMethodsBeforeUpdate = this.paymentMethods;
      this.paymentMethods = undefined;
      this.donationService
        .updatePaymentMethod(this.person, this.jwtAsString(), methodId, {
          expiry: this.parseExpiryDate(formValue.expiryDate),
          countryCode: formValue.billingCountry,
          postalCode: formValue.postalCode,
        })
        .subscribe({
          next: () => {
            this.registerSuccessMessage = 'Saved new details for card ending ' + card.last4;
            this.registerErrorDescription = undefined;
            void this.loadPaymentMethods();
          },
          error: (resp: HttpErrorResponse) => {
            this.registerSuccessMessage = undefined;
            this.registerErrorDescription = resp.error.error
              ? `Could not update card ending ${card.last4}. ${resp.error.error}`
              : 'Sorry, update failed for card ending ' + card.last4;
            this.paymentMethods = paymentMethodsBeforeUpdate;
          },
        });
    });
  }

  private parseExpiryDate(expiryDate: string): { year: number; month: number } {
    const [month, year] = expiryDate.split('/').map((number: string) => parseInt(number));

    if (!year) {
      throw new Error('Failed to parse expiry date, missing year');
    }

    if (!month) {
      throw new Error('Failed to parse expiry date, missing month');
    }

    return { year, month };
  }

  /**
   * We only check for GBP balances for now, as we only support UK bank transfers rn
   */
  protected get hasDonationFunds() {
    return this.person.cash_balance?.gbp;
  }

  private jwtAsString() {
    return this.identityService.getJWT() as string;
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.savedCardsTimer) {
      clearTimeout(this.savedCardsTimer);
    }
  }

  protected readonly faExclamationTriangle = faExclamationTriangle;

  async removeRegularGivingMethod() {
    try {
      await this.regularGivingService.removeCard();
    } catch (error: unknown) {
      this.toaster.showError(errorDescription(error));
      return;
    }

    this.paymentMethods = await this.donationService.getPaymentMethods();

    this.toaster.showSuccess('Payment method removed');
  }
}
