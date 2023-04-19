import {MetaCampaign} from "../metaCampaign.model";
import {HighlightCard} from "./HighlightCard";

const campaignToCard = function (metaCampaign: MetaCampaign, donateUriPrefix: string): HighlightCard
{
  let bodyText;
  let backgroundImageUrl;

  if (metaCampaign.isEmergency) {
    bodyText = "Double the impact of your donation";
    backgroundImageUrl = new URL('/assets/images/emergency-card.png', donateUriPrefix)

    return {
      headerText: metaCampaign.campaignGivenName,
      bodyText: bodyText,
      iconColor: metaCampaign.colour,
      backgroundImageUrl: backgroundImageUrl,
      button: {
        text: "Donate now",
        href: new URL('/' + metaCampaign.slug, donateUriPrefix),
      }
    };

  } else {
    throw new Error('Dont know how to display non-emergency campaign yet');
  }
}

/**
 * Given a list of metacampaigns that exist in Salesforce, returns a list of highlight cards to display on the home page.
 *
 * There is an open question about whether this logic should live here, or in SF, or somewhere else - for now it seems
 * to make sense to put it here since we have limited SF development capacity.
 */
export const cardsForMetaCampaigns = function (
  viewingDate: Date,
  metacampaigns: readonly MetaCampaign[],
  donateUriPrefix: string,
  blogUriPrefix: string
): readonly HighlightCard[]
{
  const metaCampaignCards = metacampaigns.map((m) => campaignToCard(m, donateUriPrefix));

  let anyExploreCard: readonly HighlightCard[];

  if (metacampaigns.length < 5) {
    anyExploreCard = [{
      headerText: 'One donation. Twice the impact.',
      bodyText: "You donate.\nWe double it.",
      iconColor: "primary",
      backgroundImageUrl: new URL('/assets/images/blue-texture.jpg', donateUriPrefix),
      button: {
        text: "Explore now",
        href: new URL('/explore', donateUriPrefix),
      }
    }];
  } else {
    anyExploreCard = [];
  }

  if (viewingDate >= new Date("2023-04-20T12:00:00+01:00")) {
    return [
      ...metaCampaignCards,
      {
        headerText: 'Double your donation in the Green Match Fund',
        backgroundImageUrl: new URL('/assets/images/card-background-gmf.jpg', donateUriPrefix),
        iconColor: 'brand-3',
        bodyText: 'Donate from 20 April to 27 April 2023',
        button: {
          text: 'Donate now',
          href: new URL('/green-match-fund-2023', donateUriPrefix)
        }
      },
      {
        headerText: 'Applications for Women and Girls Match Fund now open!',
        backgroundImageUrl: new URL('/assets/images/wmg-purple-texture.jpg', donateUriPrefix),
        iconColor: 'brand-2',
        bodyText: 'Deadline is 23 June 2023',
        button: {
          text: 'Apply now',
          href: new URL('/women-girls-match-fund', blogUriPrefix)
        }
      },
      ...anyExploreCard,
    ];
  }

  return [
    ...metaCampaignCards,
    {
      headerText: 'Applications for Women and Girls Match Fund now open!',
      backgroundImageUrl: new URL('/assets/images/wmg-purple-texture.jpg', donateUriPrefix),
      iconColor: 'brand-2',
      bodyText: 'Deadline is 23 June 2023',
      button: {
        text: 'Apply now',
        href: new URL('/women-girls-match-fund', blogUriPrefix)
      }
    },
    {
      headerText: 'Save the date for Green Match Fund',
      backgroundImageUrl: new URL('/assets/images/card-background-gmf.jpg', donateUriPrefix),
      iconColor: 'brand-3',
      bodyText: '20th - 27th April 2023',
      button: {
        text: 'Save the date!',
        href: new URL('/green-match-fund-2023', donateUriPrefix)
      }
    },
    ...anyExploreCard,
  ];
}


