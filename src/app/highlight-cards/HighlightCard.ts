import {brandColour} from "@biggive/components/dist/types/globals/brand-colour"
import {environment} from "../../environments/environment";

export type HighlightCard = {
  campaignFamily?: campaignFamilyName | null, // SF may return null; some Donate code leaves it undefined for now
  background: {
    // colour appears 'behind' the image, only seen if image doesn't load or during loading.
    color?: brandColour;
    image: URL
  },
  // There is ambiguity in the components library about whether brand-6 is grey or turquoise. Best to avoid using brand-6 and
  // use brand-mhf-turquoise instead.
  // See https://github.com/thebiggive/donate-frontend/pull/1076#issuecomment-1523472452
  // For other colour details see https://github.com/thebiggive/components/blob/develop/src/globals/brand-colour.ts
  icon?: {color: brandColour},
  headerText: string,
  bodyText: string,
  button: {
      text: string,
      href: URL,
  },
}

export type campaignFamilyName =
  'christmasChallenge'
  |'summerGive'
  |'greenMatchFund'
  |'womenGirls'
  |'mentalHealthFund'
  |'artsforImpact'
  |'smallCharity'
  |'emergencyMatch';

export type SfApiHighlightCard = Omit<HighlightCard, 'background'|'icon'|'button'> & {
  cardStyle: 'DONATE_NOW' | 'SEE_RESULTS' | 'APPLY_NOW' | 'SAVE_THE_DATE' | 'JOIN_MAILING_LIST' | 'REGISTER_INTEREST' | 'EXPLORE',
  button: {
    text: string,
    href: string
  }
};

const replaceURLOrigin = (experienceUriPrefix: string, blogUriPrefix: string, donateUriPrefix: string, urlFromApi: string): URL => {

  const href = urlFromApi
    .replace('https://donate.biggive.org', donateUriPrefix)
    .replace('https://biggive.org', blogUriPrefix)
    .replace('https://community.biggive.org', experienceUriPrefix)
  ;

  return new URL(href);
}

export const SFAPIHighlightCardToHighlightCard = (experienceUriPrefix: string, blogUriPrefix: string, donateUriPrefix: string, sfApiHighlightCard: SfApiHighlightCard, ): HighlightCard => {

  const campaignFamilyColours: Record<campaignFamilyName, brandColour> = {
    emergencyMatch: 'brand-emf-yellow',
    christmasChallenge: 'brand-cc-red',
    summerGive: 'brand-c4c-orange',
    greenMatchFund: 'brand-gmf-green',
    womenGirls: 'brand-wgmf-purple',
    mentalHealthFund: 'brand-mhf-turquoise',
    artsforImpact: 'brand-afa-pink',
    smallCharity: 'brand-scw-magenta',
  };

  const backgroundImageUrl = backgroundImage(sfApiHighlightCard, donateUriPrefix);

  let href = replaceURLOrigin(experienceUriPrefix, blogUriPrefix, donateUriPrefix, sfApiHighlightCard.button.href);

  const color = iconColor(sfApiHighlightCard, campaignFamilyColours);
  return {
    campaignFamily: sfApiHighlightCard.campaignFamily,
    headerText: sfApiHighlightCard.headerText,
    bodyText: sfApiHighlightCard.bodyText,
    icon: {color},
    background: {image: backgroundImageUrl, color },
    button: {
      text: sfApiHighlightCard.button.text,
      href: href,
    }
  };
};

function iconColor(sfApiHighlightCard: SfApiHighlightCard, campaignFamilyColours: Record<campaignFamilyName, brandColour>) {
  const defaultColor = "primary";

  if (sfApiHighlightCard.campaignFamily == null) {
    return defaultColor;
  }

  return campaignFamilyColours[sfApiHighlightCard.campaignFamily] || defaultColor;
}

function backgroundImage(sfApiHighlightCard: SfApiHighlightCard, donateUriPrefix: string) {

  const defaultBackground = new URL('/assets/images/blue-texture.jpg', donateUriPrefix);

  if (sfApiHighlightCard.cardStyle === 'JOIN_MAILING_LIST') {
    return new URL('/assets/images/join-mailing-list.webp', donateUriPrefix);
  }

  if (sfApiHighlightCard.campaignFamily == null) {
    return defaultBackground;
  }

  const campaignFamilyBackgroundImages: Record<campaignFamilyName, URL> = {
    emergencyMatch: new URL('/assets/images/emergency-card.webp', donateUriPrefix),
    christmasChallenge: new URL('/assets/images/card-background-cc-lights.jpg', donateUriPrefix),
    summerGive:  new URL('/assets/images/colour-orange.png', donateUriPrefix),
    greenMatchFund:  new URL('/assets/images/card-background-gmf.jpg', donateUriPrefix),
    womenGirls: new URL('/assets/images/wmg-purple-texture.jpg', donateUriPrefix),
    mentalHealthFund: new URL('/assets/images/turquoise-texture.jpg', donateUriPrefix),
    artsforImpact: new URL('/assets/images/red-coral-texture.png', donateUriPrefix),
    smallCharity: new URL('/assets/images/small-charity-background.png', donateUriPrefix),
  };

  return campaignFamilyBackgroundImages[sfApiHighlightCard.campaignFamily] || defaultBackground;
}

export function SFHighlightCardsToFEHighlightCards(apiHighlightCards: SfApiHighlightCard[]): HighlightCard[] {
  const cards = apiHighlightCards.map(
    card => SFAPIHighlightCardToHighlightCard(
      environment.experienceUriPrefix,
      environment.blogUriPrefix,
      environment.donateUriPrefix,
      card
    ));

  // temp code, remove after GMF 2025
  cards.sort((cardA, cardB) =>
    (Number)(cardB.campaignFamily === 'greenMatchFund') - (Number)(cardA.campaignFamily === 'greenMatchFund')
  );

  return cards
}
