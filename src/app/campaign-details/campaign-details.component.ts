import { DatePipe, isPlatformBrowser, Location, AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation, inject, input, effect } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { campaignHiddenMessage, currencyPipeDigitsInfo } from '../../environments/common';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { NavigationService } from '../navigation.service';
import { PageMetaService } from '../page-meta.service';
import { TimeLeftPipe } from '../time-left.pipe';
import { Toast } from '../toast.service';
import {
  BiggivePageSection,
  BiggiveCallToAction,
  BiggiveFormattedText,
  BiggiveBrandedImage,
  BiggiveHeading,
  BiggiveSocialIcon,
  BiggiveButton,
  BiggiveQuote,
} from '@biggive/components-angular';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CampaignInfoComponent } from '../campaign-info/campaign-info.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { OptimisedImagePipe } from '../optimised-image.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  // https://stackoverflow.com/questions/45940965/angular-material-customize-tab
  encapsulation: ViewEncapsulation.None,
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrl: './campaign-details.component.scss',
  providers: [TimeLeftPipe, DatePipe],
  imports: [
    BiggivePageSection,
    BiggiveCallToAction,
    BiggiveFormattedText,
    MatIconButton,
    RouterLink,
    MatIcon,
    BiggiveBrandedImage,
    BiggiveHeading,
    BiggiveSocialIcon,
    BiggiveButton,
    CampaignInfoComponent,
    MatTabGroup,
    MatTab,
    BiggiveQuote,
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    OptimisedImagePipe,
  ],
})
export class CampaignDetailsComponent implements OnInit, OnDestroy {
  isEarlyPreview = input(false);
  private datePipe = inject(DatePipe);
  private location = inject(Location);
  private navigationService = inject(NavigationService);
  private pageMeta = inject(PageMetaService);
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private toast = inject(Toast);
  private snackBar = inject(MatSnackBar);
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

    effect(() => {
      if (this.isEarlyPreview()) {
        // would have ideally had a dismissable toast but that doesn't seem to be offered by snackbar - we have
        // to call a function to dismiss it instead of just passing an option to make it user dismissable. I think
        // non-dismissable is OK. It appears no the bottom of the screen so the user can still take a screenshot of the
        // top of the page and crop it out if they want that.

        const message = this.campaign.isMatched
          ? 'This is a private preview of your campaign page (your campaign page URL will be different if your application has been approved). Do not share this page with the general public.'
          : 'This is a private preview of your campaign page. Do not share this page with the general public.';

        this.snackBar.open(message, undefined, {
          panelClass: 'success-bar',
        });
      }
    });
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

    if (this.isEarlyPreview()) {
      this.pageMeta.setCommon('PREVIEW: ' + campaign.title, summaryStart, campaign.bannerUri, true);
    } else {
      this.pageMeta.setCommon(campaign.title, summaryStart, campaign.bannerUri);
    }

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
