import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PaymentMethod } from '@stripe/stripe-js';
import { DonationStartLoginDialogComponent } from '../donation-start/donation-start-login-dialog.component';
import { DonationService } from '../donation.service';
import { IdentityService } from '../identity.service';
import { Person } from '../person.model';
import { ValidateCreditMin } from '../validators/credit-min';

@Component({
  selector: 'app-buy-credits',
  templateUrl: './buy-credits.component.html',
  styleUrls: ['./buy-credits.component.scss']
})
export class BuyCreditsComponent implements OnInit {

  isLoggedIn: boolean = false;
  userFullName: string;
  donationForm: FormGroup;
  amountsGroup: FormGroup;
  giftAidGroup: FormGroup;
  isLinear = false;
  private initialTipSuggestedPercentage = 15;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private donationService: DonationService,
    private identityService: IdentityService,
    ) { }

  ngOnInit(): void {
    const formGroups: {
      amounts: FormGroup,
      giftAid: FormGroup
    } = {
      amounts: this.formBuilder.group({
        donationAmount: [null, [
          Validators.required,
          ValidateCreditMin,
          //ValidateCreditMax,
          Validators.pattern('^[£$]?[0-9]+?(\\.00)?$'),
        ]],
        tipPercentage: [this.initialTipSuggestedPercentage],
      }),
      giftAid: this.formBuilder.group({
        giftAid: [null],
        homeAddress: [null],
        homeBuildingNumber: [null],
        homeOutsideUK: [null],
        homePostcode: [null],
      }),
      // T&Cs agreement is implicit through submitting the form.
    };

    this.donationForm = this.formBuilder.group(formGroups);

    const amountsGroup: any = this.donationForm.get('amounts');
    if (amountsGroup != null) {
      this.amountsGroup = amountsGroup;
    }

    const giftAidGroup: any = this.donationForm.get('giftAid');
    if (giftAidGroup != null) {
      this.giftAidGroup = giftAidGroup;
    }

    if (!this.isLoggedIn) {
      const loginDialog = this.dialog.open(DonationStartLoginDialogComponent);
      loginDialog.afterClosed().subscribe((data?: {id: string, jwt: string}) => {
        if (data && data.id) {
          this.loadAuthedPersonInfo(data.id, data.jwt);
        }
      });
    }
  }

  buyCredits(): void {
    console.log('POST /credits');
  }

  giftAidToggle(e: Event) {
    
  }

  private loadAuthedPersonInfo(id: string, jwt: string) {
    this.identityService.get(id, jwt).subscribe((person: Person) => {
      this.isLoggedIn = true;
      this.userFullName = person.first_name + ' ' + person.last_name;
      console.log('Login success: ' + JSON.stringify(person));

      // this.personId = person.id; // Should mean donations are attached to the Stripe Customer.
      // this.personIsLoginReady = true;

      // // Pre-fill rarely-changing form values from the Person.
      // this.giftAidGroup.patchValue({
      //   homeAddress: person.home_address_line_1,
      //   homeOutsideUK: person.home_country_code !== 'GB',
      //   homePostcode: person.home_postcode,
      // });

      // this.paymentGroup.patchValue({
      //   firstName: person.first_name,
      //   lastName: person.last_name,
      //   emailAddress: person.email_address,
      // });

      // Load first saved Stripe card, if there are any.
      this.donationService.getPaymentMethods(id, jwt).subscribe((response: { data: PaymentMethod[] }) => {
        if (response.data.length > 0) {

          console.log('Payment details: ' + JSON.stringify(response.data[0]));
          // this.stripePaymentMethodReady = true;
          // this.stripeFirstSavedMethod = response.data[0];

          // this.updateFormWithSavedCard();
        }
      });
    });
  }

}
