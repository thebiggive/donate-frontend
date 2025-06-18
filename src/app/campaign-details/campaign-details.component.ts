import { DatePipe, isPlatformBrowser, Location } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { campaignHiddenMessage, currencyPipeDigitsInfo } from '../../environments/common';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { NavigationService } from '../navigation.service';
import { PageMetaService } from '../page-meta.service';
import { TimeLeftPipe } from '../time-left.pipe';
import { Toast } from '../toast.service';

@Component({
  // https://stackoverflow.com/questions/45940965/angular-material-customize-tab
  encapsulation: ViewEncapsulation.None,
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrl: './campaign-details.component.scss',
  providers: [TimeLeftPipe, DatePipe],

  // predates use of standalone
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class CampaignDetailsComponent implements OnInit, OnDestroy {
  private datePipe = inject(DatePipe);
  private location = inject(Location);
  private navigationService = inject(NavigationService);
  private pageMeta = inject(PageMetaService);
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private toast = inject(Toast);
  timeLeftPipe = inject(TimeLeftPipe);

  campaign!: Campaign;
  campaignInPast = false;
  donateEnabled = true;
  fromFund = false;
  videoEmbedUrl?: SafeResourceUrl;

  currencyPipeDigitsInfo = currencyPipeDigitsInfo;

  private timer: number | NodeJS.Timeout | undefined; // State update setTimeout reference, for client side when donations open soon

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
    this.setSecondaryProps(this.campaign);
  }

  constructor() {
    const route = this.route;

    route.queryParams
      .forEach((params: Params) => {
        if (params.fromFund) {
          this.fromFund = true;
        }
      })
      .catch(console.error);
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.timer) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  async goBackToMetacampaign(event: Event) {
    event.preventDefault();
    const url = `/${this.campaign.parentRef}`;

    if (this.navigationService.isLastUrl(url)) {
      this.location.back();
      return;
    }

    await this.router.navigateByUrl(url);
  }

  private setSecondaryProps(campaign: Campaign) {
    this.campaignInPast = CampaignService.isInPast(campaign);
    this.donateEnabled = CampaignService.isOpenForDonations(campaign);

    // If donations open within 24 hours, set a timer to update this page's state.
    if (!this.donateEnabled && isPlatformBrowser(this.platformId)) {
      const msToLaunch = new Date(campaign.startDate).getTime() - Date.now();
      if (msToLaunch > 0 && msToLaunch < 86400000) {
        this.timer = setTimeout(() => {
          this.donateEnabled = true;
        }, msToLaunch);
      }
    }

    let summaryStart;
    if (campaign.summary) {
      // First 20 word-like things followed by …
      summaryStart = campaign.summary.replace(new RegExp('^(([\\w\',."-]+ ){20}).*$'), '$1') + '…';
    } else {
      summaryStart = `${campaign.charity.name}'s campaign, ${campaign.title}`;
    }

    this.pageMeta.setCommon(campaign.title, summaryStart, campaign.bannerUri);

    // As per https://angular.io/guide/security#bypass-security-apis constructing `SafeResourceUrl`s with these appends should be safe.
    if (campaign.video && campaign.video.provider === 'youtube') {
      this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube-nocookie.com/embed/${campaign.video.key}`,
      );
    } else if (campaign.video && campaign.video.provider === 'vimeo') {
      this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://player.vimeo.com/video/${campaign.video.key}?dnt=1`,
      ); // dnt = do not track
    }

    if (campaign.hidden) {
      this.toast.showError(campaignHiddenMessage);
    }
  }
}
