import {HighlightCard} from "./home/HighlightCard";
import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {environment} from "../environments/environment";
import {inject} from "@angular/core";
import {CampaignService} from "./campaign.service";

export const highlightCardsResolver: ResolveFn<readonly HighlightCard[] | null> = (route: ActivatedRouteSnapshot) => {
  const campaignService = inject(CampaignService);

  if (route.queryParams.hasOwnProperty('highlightAPIEnabled') && environment.environmentId !== 'production') {
    return campaignService.getHomePageHighlightCards();
  }

    const Jan8th = new Date('2024-01-08T00:00:00+00:00');
    const Feb9th = new Date('2024-02-09T23:59:59+00:00');
    const ArtsForImpactApplicationCloseDate = new Date('2023-12-16T00:00:00+00:00');
    const GMFApplicationCloseDate = new Date('2024-01-17T00:00:00+00:00');



    const highlightCards: readonly HighlightCard[] = [
        {
          appearAt: Jan8th,
          disappearAt: Feb9th,
          headerText: 'Applications for Kind²Mind are now open!',
          bodyText: 'Apply by February 9th 2024',
          iconColor: "brand-mhf-turquoise",
          backgroundImageUrl: new URL('/assets/images/turquoise-texture.jpg', environment.donateGlobalUriPrefix),
          button: {
            text: 'Apply now',
            href: new URL('/kind2mind/', environment.blogUriPrefix)
          }
        },
        {
          appearAt: Jan8th,
          disappearAt: Feb9th,
          headerText: 'Applications for Champions for Children by The Childhood Trust are now open!',
          bodyText: 'Apply by February 9th 2024',
          iconColor: "brand-c4c-orange",
          backgroundImageUrl: new URL('/assets/images/colour-orange.png', environment.donateGlobalUriPrefix),
          button: {
            text: 'Apply now',
            href: new URL('/champions-for-children/', environment.blogUriPrefix)
          }
        },
        {
          appearAt: 'asap',
          disappearAt: Jan8th,
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
          appearAt: 'asap',
          disappearAt: Jan8th,
          headerText: "One donation. Twice the impact.",
          bodyText: 'You donate.\nWe double it.',
          backgroundImageUrl: new URL('/assets/images/blue-texture.jpg', environment.donateGlobalUriPrefix),
          iconColor: 'primary',
          button: {
            text: "Explore now",
            href: new URL('/explore/', environment.donateGlobalUriPrefix)
          }
        },
        {
          appearAt: GMFApplicationCloseDate,
          disappearAt: 'never',
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

    return highlightCards;
}
