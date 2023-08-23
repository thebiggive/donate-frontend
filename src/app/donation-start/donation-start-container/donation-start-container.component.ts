import {Component, OnInit, ViewChild} from '@angular/core';
import {Campaign} from "../../campaign.model";
import {ActivatedRoute, Router} from "@angular/router";
import { Donation } from 'src/app/donation.model';
import {DonationStartFormComponent} from "../donation-start-form/donation-start-form.component";
import {Person} from "../../person.model";
import {IdentityService} from "../../identity.service";
import {environment} from "../../../environments/environment";
@Component({
  templateUrl: './donation-start-container.component.html',
  styleUrls: ['./donation-start-container.component.scss']
})
export class DonationStartContainerComponent implements OnInit{
  campaign: Campaign;
  campaignOpenOnLoad: boolean;
  donation: Donation | undefined = undefined;
  personId?: string;
  personIsLoginReady = false;
  loggedInEmailAddress?: string;
  useNewDesign = false;

  @ViewChild('donation_start_form') donationStartForm: DonationStartFormComponent
  public reservationExpiryDate: Date| undefined = undefined;
  public donor: Person | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private identityService: IdentityService,
  ) {
    this.useNewDesign = ! router.url.startsWith("/donate-old-stepper/");
  }

   ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
     this.campaignOpenOnLoad = this.campaignIsOpen();

     const idAndJWT = this.identityService.getIdAndJWT();
     if (idAndJWT) {
       this.loadAuthedPersonInfo(idAndJWT.id, idAndJWT.jwt);
     } else {
       if (!this.donationStartForm) {
         console.error("Donation start form not loaded");
       }
       // this.donationStartForm is undefined when we're running donation-start-login.component.spec.ts . I'm not sure
       // tbh why this class is even called from that test. Null safe call to let it pass.
       this.donationStartForm?.resumeDonationsIfPossible();
     }
   }

  /**
   * Unlike the CampaignService method which is more forgiving if the status gets stuck Active (we don't trust
   * these to be right in Salesforce yet), this check relies solely on campaign dates.
   */
  private campaignIsOpen(): boolean {
    return (
      this.campaign
        ? (new Date(this.campaign.startDate) <= new Date() && new Date(this.campaign.endDate) > new Date())
        : false
    );
  }

  updateReservationExpiryTime(): void {
    if (!this.donation?.createdTime || !this.donation.matchReservedAmount) {
      this.reservationExpiryDate = undefined;
      return;
    }

    const date = new Date(environment.reservationMinutes * 60000 + (new Date(this.donation.createdTime)).getTime());
    this.reservationExpiryDate = date;
  }

  logout = () => {
    this.donor = undefined;
    // could just pass donationStartForm.reset directly to the logout button,
    // but we may well want to do more work here very soon.
    this.donationStartForm.reset();
  }

  loadAuthedPersonInfo = (id: string, jwt: string) => {
    if (!this.identityService) {
      // This feels like an anti-pattern, but currently seems to be required. Since the "contained"
      // login component is passed this public fn and could call it any time, it is not safe to assume
      // that this page has its normal service dependencies. The current behaviour post-login seems to
      // be that this is called as a no-op once, but then there's a reload during which it works?

      return;
    }

    this.identityService.get(id, jwt).subscribe(
      (person: Person) => {
      this.donor = person; // Should mean donations are attached to the Stripe Customer.
      this.personIsLoginReady = true;
      this.loggedInEmailAddress = person.email_address;
      this.donationStartForm.loadPerson(person, id, jwt);
      this.donationStartForm.resumeDonationsIfPossible();
      },
      () => {
        this.donationStartForm.resumeDonationsIfPossible();
      },
      () => {
        this.donationStartForm.resumeDonationsIfPossible();
      }
    );
  };

  get canLogin() {
    return !this.donor?.id;
  }

  setDonation = (donation: Donation) => {
    this.donation = donation;
    this.updateReservationExpiryTime();
  }
}
