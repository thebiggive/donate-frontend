import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RESPONSE } from '../../express.tokens';
import { Response } from 'express';

import { PageMetaService } from '../page-meta.service';
import { HighlightCard } from '../highlight-cards/HighlightCard';
import { environment } from '../../environments/environment';
import { NavigationService } from '../navigation.service';
import { bigGiveName, tagLine } from '../../environments/common';
import {
  BiggivePageSection,
  BiggiveCallToAction,
  BiggiveHeading,
  BiggiveButton,
  BiggiveVideoFeature,
  BiggiveHeadingBanner,
} from '@biggive/components-angular';
import { HighlightCardsComponent } from '../highlight-cards/highlight-cards.component';
import { flags } from '../featureFlags';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: 'home.component.scss',
  imports: [
    HighlightCardsComponent,
    BiggivePageSection,
    BiggiveCallToAction,
    BiggiveHeading,
    BiggiveButton,
    BiggiveVideoFeature,
    BiggiveHeadingBanner,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // for swiper
})
export class HomeComponent implements OnInit {
  flags = flags;
  private navigationService = inject(NavigationService);
  private pageMeta = inject(PageMetaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private response = inject<Response>(RESPONSE, { optional: true });

  stats!: {
    totalRaisedFormatted: string;
    totalCountFormatted: string;
  };

  /**
   * Prevents the user seeing the content if we're about to redirect them to a different page.
   * As suggested at https://stackoverflow.com/a/58962726/2526181
   */
  protected mayBeAboutToRedirect: boolean = true;

  protected highlightCards!: HighlightCard[];

  ngOnInit() {
    this.pageMeta.setCommon(bigGiveName, `${bigGiveName} – ${tagLine}`, '/assets/images/social-banner.png');
    this.stats = this.route.snapshot.data['stats'];
    this.highlightCards = this.route.snapshot.data['highlights'];
    const queryParams = this.route.snapshot.queryParams;
    const redirectPath = this.navigationService.getPotentialRedirectPathAndUpdateSignal(this.highlightCards);

    if (
      environment.environmentId !== 'regression' &&
      !Object.prototype.hasOwnProperty.call(queryParams, 'noredirect') &&
      redirectPath !== null
    ) {
      if (isPlatformBrowser(this.platformId)) {
        void this.router.navigate([redirectPath], {
          replaceUrl: true, // As we are redirecting immediately it would be confusing to leave a page the user hasn't seen in their history.
        });
      } else {
        this.response?.redirect(302, redirectPath);
      }
    } else {
      this.mayBeAboutToRedirect = false;
    }
  }
}
