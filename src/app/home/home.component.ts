import {isPlatformBrowser} from "@angular/common";
import {Component, Inject, OnInit, Optional, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RESPONSE} from '@nguniversal/express-engine/tokens';

import {PageMetaService} from '../page-meta.service';
import {HighlightCard} from "./HighlightCard";
import {environment} from "../../environments/environment";

const CCOpenDate = new Date('2023-11-28T12:00:00+00:00');
const CCCloseDate = new Date('2023-12-05T12:00:00+00:00')
const ArtsForImpactApplicationCloseDate = new Date('2023-12-16T00:00:00+00:00');
const GMFApplicationCloseDate = new Date('2024-01-17T00:00:00+00:00');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  mainTitle = 'Matching Donations.\nMultiplying Impact.';
  stats: {
    totalRaisedFormatted: string,
    totalCountFormatted: string
  };

  private currentTime = new Date();

  /**
   * Prevents the user seeing the content if we're about to redirect them to a different page.
   * As suggested at https://stackoverflow.com/a/58962726/2526181
   */
  protected mayBeAboutToRedirect: boolean = true;

  private highlightCards: readonly HighlightCard[] = [
    {
      appearAt: 'asap',
      disappearAt: CCOpenDate,
      headerText: 'Christmas Challenge 2023 is starting soon!',
      bodyText: 'Save the date 28th November - 5th December 2023',
      iconColor: "brand-cc-red",
      backgroundImageUrl: new URL('/assets/images/card-background-cc-lights.jpg', environment.donateGlobalUriPrefix),
      button: {
        text: 'Find out more',
        href: new URL('/christmas-challenge-2023', environment.donateGlobalUriPrefix)
      }
    },
    {
      appearAt: CCOpenDate,
      disappearAt: CCCloseDate,
      headerText: 'Double the difference - Christmas Challenge',
      bodyText: '28th November - 5th December 2023',
      iconColor: "brand-cc-red",
      backgroundImageUrl: new URL('/assets/images/card-background-cc-lights.jpg', environment.donateGlobalUriPrefix),
      button: {
        text: 'Donate now',
        href: new URL('/christmas-challenge-2023', environment.donateGlobalUriPrefix)
      }
    },
    {
      appearAt: CCCloseDate,
      disappearAt: 'never',
      headerText: 'Christmas Challenge 2023',
      bodyText: '28th November - 5th December 2023',
      iconColor: "brand-cc-red",
      backgroundImageUrl: new URL('/assets/images/card-background-cc-lights.jpg', environment.donateGlobalUriPrefix),
      button: {
        text: 'See Results',
        href: new URL('/christmas-challenge-2023', environment.donateGlobalUriPrefix)
      }
    },
    {
      appearAt: 'asap',
      disappearAt: GMFApplicationCloseDate,
      headerText: "Applications for Green Match Fund are now open!",
      bodyText: "Apply by 16th January 2024",
      iconColor: "brand-gmf-green",
      backgroundImageUrl: new URL('/assets/images/card-background-gmf.jpg', environment.donateGlobalUriPrefix),
      button: {
        text: "Apply now",
        href: new URL('/green-match-fund/', environment.blogUriPrefix),
      }
    },
    {
      appearAt: 'asap',
      disappearAt: ArtsForImpactApplicationCloseDate,
      headerText: "Applications for Arts for Impact are now open!",
      backgroundImageUrl: new URL('/assets/images/red-coral-texture.png', environment.donateGlobalUriPrefix),
      iconColor: 'brand-afa-pink',
      bodyText: 'Apply by 15th December 2023',
      button: {
        text: "Apply now",
        href: new URL('/artsforimpact/', environment.blogUriPrefix)
      }
    },
    {
      appearAt: ArtsForImpactApplicationCloseDate,
      disappearAt: "never",
      headerText: "One donation. Twice the impact.",
      bodyText: 'You donate.\nWe double it.',
      backgroundImageUrl: new URL('/assets/images/blue-texture.jpg', environment.donateGlobalUriPrefix),
      iconColor: 'primary',
      button: {
        text: "Explore now",
        href: new URL('/explore/', environment.donateGlobalUriPrefix)
      }
    },
  ];

  public constructor(
    private pageMeta: PageMetaService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(RESPONSE) private response: any,
  ) {
  }

  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );
    this.stats = this.route.snapshot.data.stats;

    const queryParams = this.route.snapshot.queryParams;

    if (environment.environmentId !== 'production') {
      if (queryParams?.simulatedDate) {
        const simulatedDate = new Date(queryParams.simulatedDate);
        if (isNaN(simulatedDate.getTime())) {
          alert("cant parse simulated date given");
          throw new Error("Invalid date");
        }
        this.currentTime = simulatedDate;
      }
    }

    // start the redirect 12 hours in advance of CC open:
    const startRedirectingToCCAt = new Date('2023-11-28T00:00:00+00:00');

    // end the redirect exactly at the time CC closes.
    if (
      !queryParams.hasOwnProperty('noredirect') &&
      this.currentTime >= startRedirectingToCCAt &&
      this.currentTime < CCCloseDate
      ) {
        const redirectSlugIncSlash = '/christmas-challenge-2023';
        if (isPlatformBrowser(this.platformId)) {
          this.router.navigate(
            [redirectSlugIncSlash],
            {
              replaceUrl: true, // As we are redirecting immediately it would be confusing to leave a page the user hasn't seen in their history.

            }
          );
        } else {
          this.response.redirect(302, redirectSlugIncSlash);
        }
    } else {
      this.mayBeAboutToRedirect = false;
    }
  }

  get highlightCardsToShow(): readonly HighlightCard[] {
    return this.highlightCards.filter((card: HighlightCard) => {
      const hasAppearDate = card.appearAt !== 'asap';
      const hasDisappearDate = card.disappearAt !== 'never';

      if (hasAppearDate && hasDisappearDate && card.appearAt >= card.disappearAt) {
        throw new Error("disappear date must be after appear date: " + card);
      }

      if (hasAppearDate && card.appearAt > this.currentTime) {
        return false;
      }

      if (hasDisappearDate && card.disappearAt <= this.currentTime) {
        return false;
      }

      return true;
    });
  }
}
