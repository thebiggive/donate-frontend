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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    anyExploreCard = [];
  }

  return [
      ...metaCampaignCards,
      {
        headerText: 'Save the date for Champions for Children',
        backgroundImageUrl: new URL('/assets/images/cfc-plain-orange.png', donateUriPrefix),
        iconColor: 'brand-5',
        bodyText: '6 June to 20 June 2023',
        button: {
          text: 'Find out more',
          href: new URL('/champions-for-children-2023', donateUriPrefix)
        }
      },
      {
        headerText: 'Applications for Christmas Challenge now open!',
        backgroundImageUrl: new URL('/assets/images/card-background-cc-lights.jpg', donateUriPrefix),
        iconColor: 'brand-1',
        bodyText: 'Deadline is 7 July 2023',
        button: {
          text: 'Apply now',
          href: new URL('/christmas-challenge', blogUriPrefix)
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
    ];
}


