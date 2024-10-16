import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Campaign} from "../campaign.model";
import {ComponentsModule} from "@biggive/components-angular";
import {CampaignInfoComponent} from "../campaign-info/campaign-info.component";
import {ImageService} from "../image.service";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatIcon} from "@angular/material/icon";
import {Person} from "../person.model";
import {IdentityService} from "../identity.service";
import {RegularGivingService} from "../regularGiving.service";
import { Mandate } from '../mandate.model';
import {myRegularGivingPath} from "../app-routing";
import {requiredNotBlankValidator} from "../validators/notBlank";
import {getCurrencyMinValidator} from "../validators/currency-min";
import {getCurrencyMaxValidator} from "../validators/currency-max";

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
  protected bannerUri$: Observable<string | null>;
  mandateForm: FormGroup;
  @ViewChild('stepper') private stepper: MatStepper;
  readonly termsUrl = 'https://biggive.org/terms-and-conditions';
  readonly privacyUrl = 'https://biggive.org/privacy';
  protected donor: Person;

  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private identityService: IdentityService,
    private regularGivingService: RegularGivingService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    const donor: Person | null = this.route.snapshot.data.donor;
    if (! donor) {
      throw new Error("Must be logged in to see regular giving page");
    }
    this.donor = donor

    this.campaign = this.route.snapshot.data.campaign;
    this.bannerUri$ = this.imageService.getImageUri(this.campaign.bannerUri, 830);
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
      this.showError(errorMessage);
      return;
    }

    const donationAmountPounds = +this.mandateForm.value.donationAmount;
    const amountInPence = donationAmountPounds * 100;

    /**
     * @todo consider if we need to send this from FE - if we're not displaying it to donor better for matchbot to
     *       generate it.*/
    const dayOfMonth = Math.min(new Date().getDate(), 28);

    console.log(invalid)
    if (invalid) {
      this.showError("Form is not filled in correctly yet");
      this.showError(JSON.stringify(this.mandateForm.errors))
      return;
    }


    this.regularGivingService.startMandate({
      amountInPence,
      dayOfMonth,
      campaignId: this.campaign.id,
      currency: "GBP",
      giftAid: false
    }).subscribe({
    next: (mandate: Mandate) => {
      const prefix = "Regular giving mandate created: (todo - make 'thanks' page with polling for updates and/or make " +
        "the mandate come back activated so it will show on my regular giving page) ";

      alert(prefix + JSON.stringify(mandate));
      this.router.navigateByUrl(myRegularGivingPath);
    },
      error: (error: Error) => {
      console.error(error);
      const message = error.message
        this.showError(message);
      }
    })
  }

  private showError(message: string) {
    this.snackBar.open(
      message,
      undefined,
      {
        // formula for duration from https://ux.stackexchange.com/a/85898/7211 , as used on one-off donation page.
        // todo DRY up.
        duration: Math.min(Math.max(message.length * 50, 2_000), 7_000),
        panelClass: 'snack-bar',
      }
    );
  }
}
