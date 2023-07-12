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

  const now = new Date();
  let DECcard: HighlightCard;

  if (now >= new Date("2023-07-31T12:00:00+01:00")) {
    DECcard = {
      headerText: 'DEC Ukraine Humanitarian Appeal',
      backgroundImageUrl: new URL('/assets/images/emergency-card.png', donateUriPrefix),
      iconColor: 'brand-5',
      bodyText: '15 June to 31 July 2023',
      button: {
        text: 'See results',
        href: new URL('/campaign/a056900002RXrG9AAL', donateUriPrefix)
      }
    }
  }
  else {
    DECcard = {
      headerText: 'DEC Ukraine Humanitarian Appeal',
      backgroundImageUrl: new URL('/assets/images/emergency-card.png', donateUriPrefix),
      iconColor: 'brand-5',
      bodyText: '15 June to 31 July 2023',
      button: {
        text: 'Donate now',
        href: new URL('/campaign/a056900002RXrG9AAL', donateUriPrefix)
      }
    }
  }

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

  return [
      ...metaCampaignCards,
      {
        headerText: 'Applications for Christmas Challenge now open!',
        backgroundImageUrl: new URL('/assets/images/card-background-cc-lights.jpg', donateUriPrefix),
        iconColor: 'brand-1',
        bodyText: 'Deadline is 19 July 2023',
        button: {
          text: 'Apply now',
          href: new URL('/christmas-challenge', blogUriPrefix)
        }
      },
      DECcard,
      ...anyExploreCard
    ];
}


