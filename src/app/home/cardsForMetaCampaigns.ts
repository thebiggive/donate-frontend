import {MetaCampaign} from "../metaCampaign.model";
import {HighlightCard} from "./HilightCard";

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
export const cardsForMetaCampaigns = function (metacampaigns: readonly MetaCampaign[], donateUriPrefix: string): readonly HighlightCard[]
{
  const exploreCard: HighlightCard = {
    headerText: 'One donation. Twice the impact.',
    bodyText: "You donate.\nWe double it.",
    iconColor: "primary",
    backgroundImageUrl: new URL('/assets/images/blue-texture.jpg', donateUriPrefix),
    button: {
      text: "Explore now",
      href: new URL('/explore', donateUriPrefix),
    }
  };

  const metaCampaignCards = metacampaigns.map((m) => campaignToCard(m, donateUriPrefix));

  return [
    ...metaCampaignCards,
    exploreCard,
  ];
}


