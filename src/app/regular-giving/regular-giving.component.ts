import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Campaign} from "../campaign.model";
import {ComponentsModule} from "@biggive/components-angular";
import {CampaignInfoComponent} from "../campaign-info/campaign-info.component";
import {ImageService} from "../image.service";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatIcon} from "@angular/material/icon";
import {Person} from "../person.model";
import {IdentityService} from "../identity.service";

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
    this.mandateForm = this.formBuilder.group([]);
  }

  interceptSubmitAndProceedInstead(event: Event) {
    event.preventDefault();
    this.next();
  }

  next() {
    this.stepper.next();
  }

  async stepChanged(_event: StepperSelectionEvent) {
  }

  logout() {
    this.identityService.logout();
    this.router.navigate(['']);
  }

  submit() {
    const message = "Sorry we haven't built the system for you to actually start a regular donation just yet. Try again later";
    this.snackBar.open(
      message,
      undefined,
      {
        // formula for duration from https://ux.stackexchange.com/a/85898/7211
        duration: Math.min(Math.max(message.length * 50, 2_000), 7_000),
        panelClass: 'snack-bar',
      }
    );
  }
}
