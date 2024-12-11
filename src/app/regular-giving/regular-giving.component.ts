import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Campaign} from "../campaign.model";
import {ComponentsModule} from "@biggive/components-angular";
import {CampaignInfoComponent} from "../campaign-info/campaign-info.component";
import {AsyncPipe} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Person} from "../person.model";
import {RegularGivingService} from "../regularGiving.service";
import { Mandate } from '../mandate.model';
import {myRegularGivingPath} from "../app-routing";
import {requiredNotBlankValidator} from "../validators/notBlank";
import {getCurrencyMinValidator} from "../validators/currency-min";
import {getCurrencyMaxValidator} from "../validators/currency-max";
import {Toast} from "../toast.service";

@Component({
  selector: 'app-regular-giving',
  standalone: true,
  imports: [
    ComponentsModule,
    CampaignInfoComponent,
    AsyncPipe,
    FormsModule,
    MatStep,
    MatStepper,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatIcon
  ],
  templateUrl: './regular-giving.component.html',
  styleUrl: './regular-giving.component.scss'
})
export class RegularGivingComponent implements OnInit {
  protected campaign: Campaign;
  mandateForm: FormGroup;
  @ViewChild('stepper') private stepper: MatStepper;
  readonly termsUrl = 'https://biggive.org/terms-and-conditions';
  readonly privacyUrl = 'https://biggive.org/privacy';
  protected donor: Person;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toast: Toast,
    private regularGivingService: RegularGivingService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    const donor: Person | null = this.route.snapshot.data.donor;
    if (! donor) {
      throw new Error("Must be logged in to see regular giving page");
    }
    this.donor = donor;

    if ( !this.campaign.isRegularGiving ) {
      console.error("Campaign " + this.campaign.id + " is not a regular giving campaign");
    }

    this.campaign = this.route.snapshot.data.campaign;

    this.mandateForm = this.formBuilder.group({
        donationAmount: ['', [
          requiredNotBlankValidator,
          getCurrencyMinValidator(1), // for now min & max are hard-coded, will change to be based on a field on
                                      // the campaign.
          getCurrencyMaxValidator(500),
          Validators.pattern('^\\s*[£$]?[0-9]+?(\\.00)?\\s*$'),
        ]],
      }
    );
  }

  interceptSubmitAndProceedInstead(event: Event) {
    event.preventDefault();
    this.next();
  }

  stepChanged(_event: StepperSelectionEvent) {
    // no-op for now.
  }

  next() {
    this.stepper.next();
  }

  submit() {
    const invalid = this.mandateForm.invalid;
    if (invalid) {
      let errorMessage = 'Form error: ';
      if (this.mandateForm.get('donationAmount')?.hasError('required')) {
        errorMessage += "Monthly donation amount is required";
      }
      this.toast.showError(errorMessage);
      return;
    }

    const donationAmountPounds = +this.mandateForm.value.donationAmount;
    const amountInPence = donationAmountPounds * 100;

    /**
     * @todo consider if we need to send this from FE - if we're not displaying it to donor better for matchbot to
     *       generate it.*/
    const dayOfMonth = Math.min(new Date().getDate(), 28);

    this.regularGivingService.startMandate({
      amountInPence,
      dayOfMonth,
      campaignId: this.campaign.id,
      currency: "GBP",
      giftAid: false
    }).subscribe({
    next: async (mandate: Mandate) => {
      const prefix = "Regular giving mandate created: (todo - make 'thanks' page with polling for updates and/or make " +
        "the mandate come back activated so it will show on my regular giving page) ";

      alert(prefix + JSON.stringify(mandate));
      await this.router.navigateByUrl(myRegularGivingPath);
    },
      error: (error: Error) => {
      console.error(error);
      const message = error.message
        this.toast.showError(message);
      }
    })
  }
}
