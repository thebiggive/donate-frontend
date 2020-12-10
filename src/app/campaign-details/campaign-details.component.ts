import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, makeStateKey, SafeResourceUrl, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';

import { AnalyticsService } from '../analytics.service';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { ImageService } from '../image.service';
import { PageMetaService } from '../page-meta.service';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
})
export class CampaignDetailsComponent implements OnInit, OnDestroy {
  additionalImageUris: string[] = [];
  campaign?: Campaign;
  campaignId: string;
  inPreview = false;
  campaignInFuture = false;
  donateEnabled = true;
  fromFund = false;
  percentRaised?: number;
  videoEmbedUrl?: SafeResourceUrl;

  private timer: any; // State update setTimeout reference, for client side when donations open soon

  constructor(
    private analyticsService: AnalyticsService,
    private campaignService: CampaignService,
    private pageMeta: PageMetaService,
    private imageService: ImageService,
    // tslint:disable-next-line:ban-types Angular types this ID as `Object` so we must follow suit.
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private state: TransferState,
  ) {
    route.params.pipe().subscribe(params => this.campaignId = params.campaignId);
    route.queryParams.forEach((params: Params) => {
      if (params.fromFund) {
        this.fromFund = true;
      }
    });
  }

  ngOnInit() {
    const campaignKey = makeStateKey<Campaign>(`campaign-${this.campaignId}`);
    this.campaign = this.state.get(campaignKey, undefined);

    if (this.campaign) {
      this.setSecondaryProps(this.campaign);
    } else {
      this.campaignService.getOneById(this.campaignId).subscribe(campaign => {
        this.state.set(campaignKey, campaign);
        this.campaign = campaign;
        this.setSecondaryProps(campaign);
      });
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.timer) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  private setSecondaryProps(campaign: Campaign) {
    this.campaignInFuture = CampaignService.isInFuture(campaign);
    this.donateEnabled = CampaignService.isOpenForDonations(campaign);
    this.inPreview = CampaignService.inPreview(campaign);

    for (const originalUri of campaign.additionalImageUris) {
      this.imageService.getImageUri(originalUri.uri, 850).subscribe(uri => this.additionalImageUris.push(uri));
    }

    // If donations open within 24 hours, set a timer to update this page's state.
    if (!this.donateEnabled && isPlatformBrowser(this.platformId)) {
      const msToLaunch = new Date(campaign.startDate).getTime() - Date.now();
      if (msToLaunch > 0 && msToLaunch < 86400000) {
        this.timer = setTimeout(() => {
          this.campaignInFuture = false;
          this.donateEnabled = true;
         }, msToLaunch);
      }
    }

    this.percentRaised = CampaignService.percentRaised(campaign);

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
      this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${campaign.video.key}`);
    } else if (campaign.video && campaign.video.provider === 'vimeo') {
      this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${campaign.video.key}`);
    }

    this.analyticsService.logCampaignProductImpression(campaign);
  }
}
