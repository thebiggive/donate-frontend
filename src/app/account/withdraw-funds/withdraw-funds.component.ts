import { Component, PLATFORM_ID, inject, OnInit } from '@angular/core';
import { BiggiveButton, BiggiveHeading, BiggivePageSection } from '@biggive/components-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { flags } from '../../featureFlags';
import { PageMetaService } from '../../page-meta.service';
import { ExactCurrencyPipe } from '../../exact-currency.pipe';
import { KeyValuePipe } from '@angular/common';
import { DonorAccountService } from '../../donor-account.service';
import { Toast } from '../../toast.service';

@Component({
  selector: 'app-register',
  imports: [
    BiggiveButton,
    BiggiveHeading,
    BiggivePageSection,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    ExactCurrencyPipe,
    KeyValuePipe,
  ],
  templateUrl: './withdraw-funds.component.html',
  styleUrl: 'withdraw-funds.component.scss',
})
export class WithdrawFundsComponent implements OnInit {
  private readonly pageMeta = inject(PageMetaService);
  private platformId = inject(PLATFORM_ID);

  protected processing = false;
  protected error?: string;
  private route = inject(ActivatedRoute);
  protected person = this.route.snapshot.data.person;
  protected proccessing = false;

  protected readonly flags = flags;
  protected hasDonationFunds = true;
  private donorAccountService = inject(DonorAccountService);
  private toaster = inject(Toast);

  ngOnInit() {
    this.pageMeta.setCommon('Withdraw Funds', 'Register for a Big Give account', null);
  }

  protected async withdrawFunds() {
    this.processing = true;
    try {
      await this.donorAccountService.withdrawAllFunds();
      this.toaster.showSuccess(
        'Your withdrawal request has been processed. You should have an email from Stripe to confirm this within the next hour',
      );
      // @ts-expect-error - treating the error as BackendError instead of unknown.
    } catch (e: BackendError) {
      this.toaster.showError('Failed to withdraw funds: ' + e.message);
      console.error(e);
    }
    this.processing = false;
  }
}
