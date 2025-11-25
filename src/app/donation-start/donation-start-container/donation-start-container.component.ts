import { AfterViewInit, Component, OnInit, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Campaign } from '../../campaign.model';
import { CampaignService } from '../../campaign.service';
import { Donation } from '../../donation.model';
import { Person } from '../../person.model';
import { IdentityService } from '../../identity.service';
import { environment } from '../../../environments/environment';
import { DonationStartFormComponent } from '../donation-start-form/donation-start-form.component';
import { ImageService } from '../../image.service';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser, AsyncPipe, DatePipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DonationStartLoginComponent } from '../donation-start-login/donation-start-login.component';
import { CampaignInfoComponent } from '../../campaign-info/campaign-info.component';
import { TimeLeftPipe } from '../../time-left.pipe';

@Component({
  templateUrl: './donation-start-container.component.html',
  styleUrl: './donation-start-container.component.scss',
  imports: [
    MatIconButton,
    RouterLink,
    MatIcon,
    DonationStartLoginComponent,
    DonationStartFormComponent,
    CampaignInfoComponent,
    AsyncPipe,
    DatePipe,
    TimeLeftPipe,
  ],
})
export class DonationStartContainerComponent implements AfterViewInit, OnInit {
  identityService = inject(IdentityService);
  private imageService = inject(ImageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  campaign!: Campaign;
  campaignOpenOnLoad!: boolean;
  donation: Donation | undefined = undefined;
  personId?: string;
  loggedInEmailAddress?: string;

  @ViewChild('donation_start_form') donationStartForm!: DonationStartFormComponent;
  public reservationExpiryDate: Date | undefined = undefined;
  public donor: Person | undefined;
  public bannerUri!: string | null;
  protected readonly environment = environment;

  isOffline$: Observable<boolean>;
  showDebugInfo = environment.showDebugInfo;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.isOffline$ = merge(of(null), fromEvent(window, 'online'), fromEvent(window, 'offline')).pipe(
        map(() => !navigator.onLine),
      );
    } else {
      this.isOffline$ = of(false);
    }
  }

  async ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;

    // auto redirect back to campaign page if donations not open according to date *or* status.
    if (!CampaignService.isOpenForDonations(this.campaign)) {
      await this.router.navigateByUrl(`/campaign/${this.campaign.id}`, { replaceUrl: true });
      return;
    }

    if (this.campaign.isRegularGiving) {
      // No reason for people to be on this ad-hoc donations page in that case - redirect to campaign page so
      // they can follow the link to login and donate monthly.
      await this.router.navigateByUrl(`/campaign/${this.campaign.id}`, { replaceUrl: true });
      return;
    }

    this.campaignOpenOnLoad = CampaignService.campaignIsOpenLessForgiving(this.campaign);
    const bannerUri = this.campaign.banner?.uri || this.campaign.bannerUri;
    this.imageService.getImageUri(bannerUri!, 830).subscribe((uri) => (this.bannerUri = uri));
  }

  ngAfterViewInit() {
    const idAndJWT = this.identityService.getIdAndJWT();
    if (idAndJWT) {
      // Callback will `resumeDonationsIfPossible()` after loading the person.
      this.loadAuthedPersonInfo(idAndJWT.id, idAndJWT.jwt);
      return;
    }
  }

  updateReservationExpiryTime(): void {
    if (!this.donation?.createdTime || !this.donation.matchReservedAmount) {
      this.reservationExpiryDate = undefined;
      return;
    }

    const date = new Date(environment.reservationMinutes * 60000 + new Date(this.donation.createdTime).getTime());
    this.reservationExpiryDate = date;
  }

  loadAuthedPersonInfo = (id: string, jwt: string) => {
    if (!this.identityService) {
      // This feels like an anti-pattern, but currently seems to be required. Since the "contained"
      // login component is passed this public fn and could call it any time, it is not safe to assume
      // that this page has its normal service dependencies. The current behaviour post-login seems to
      // be that this is called as a no-op once, but then there's a reload during which it works?

      return;
    }

    this.donationStartForm.hideCaptcha();
    this.identityService.get(id, jwt).subscribe({
      next: async (person: Person) => {
        this.donor = person; // Should mean donations are attached to the Stripe Customer.
        this.loggedInEmailAddress = person.email_address;
        // `await` to ensure that credit balance is set before checking for resumable donations.
        await this.donationStartForm.loadPerson(person, jwt);
        this.donationStartForm.resumeDonationsIfPossible();

        if (this.identityService.isTokenForFinalisedUser(jwt)) {
          this.identityService.loginStatusChanged.emit(true);
        }
      },
      error: (err) => {
        console.log('Could not load Person info: ', err);
        this.donationStartForm.showCaptcha();
      },
    });
  };

  get loggedInWithPassword(): boolean {
    return this.identityService.probablyHaveLoggedInPerson();
  }

  setDonation = (donation?: Donation) => {
    this.donation = donation;
    this.updateReservationExpiryTime();
  };

  hideDebugInfo(event: Event) {
    event.preventDefault();

    this.showDebugInfo = false;
  }
}
