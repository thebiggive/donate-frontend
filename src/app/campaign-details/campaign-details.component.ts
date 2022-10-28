import { CurrencyPipe, DatePipe, isPlatformBrowser, Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { allChildComponentImports } from '../../allChildComponentImports';
import { AnalyticsService } from '../analytics.service';
import { CampaignDetailsCardComponent } from '../campaign-details-card/campaign-details-card.component';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { ImageService } from '../image.service';
import { NavigationService } from '../navigation.service';
import { PageMetaService } from '../page-meta.service';

@Component({
  standalone: true,
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
  imports: [
    ...allChildComponentImports,
    CampaignDetailsCardComponent,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
})
export class CampaignDetailsComponent implements OnInit, OnDestroy {
  additionalImageUris: Array<string|undefined> = [];
  campaign: Campaign;
  isPendingOrNotReady = false;
  campaignInFuture = false;
  donateEnabled = true;
  fromFund = false;
  percentRaised?: number;
  videoEmbedUrl?: SafeResourceUrl;

  private timer: any; // State update setTimeout reference, for client side when donations open soon

  constructor(
    private analyticsService: AnalyticsService,
    private pageMeta: PageMetaService,
    private imageService: ImageService,
    private location: Location,
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    route.queryParams.forEach((params: Params) => {
      if (params.fromFund) {
        this.fromFund = true;
      }
    });

    const campaign = route.snapshot.data.campaign;
  }

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
    this.setSecondaryProps(this.campaign);
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.timer) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  goBackToMetacampaign() {
    const url = `/${this.campaign.parentRef}`;

    if (this.navigationService.isLastUrl(url)) {
      this.location.back();
      return;
    }

    this.router.navigateByUrl(url);
  }

  private setSecondaryProps(campaign: Campaign) {
    this.campaignInFuture = CampaignService.isInFuture(campaign);
    this.donateEnabled = CampaignService.isOpenForDonations(campaign);
    this.isPendingOrNotReady = CampaignService.isPendingOrNotReady(campaign);

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

    this.pageMeta.setCommon(
      campaign.title,
      summaryStart,
      campaign.currencyCode !== 'GBP',
      campaign.bannerUri,
    );

    // As per https://angular.io/guide/security#bypass-security-apis constructing `SafeResourceUrl`s with these appends should be safe.
    if (campaign.video && campaign.video.provider === 'youtube') {
      this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${campaign.video.key}`);
    } else if (campaign.video && campaign.video.provider === 'vimeo') {
      this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${campaign.video.key}`);
    }

    this.analyticsService.logCampaignProductImpression(campaign);
    this.navigationService.saveLastSingleCampaignId(campaign.id);
  }
}
