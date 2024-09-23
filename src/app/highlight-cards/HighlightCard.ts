import { brandColour } from "@biggive/components/dist/types/globals/brand-colour"

export type HighlightCard = {
  backgroundImageUrl: URL,
  // There is ambiguity in the components library about whether brand-6 is grey or turquoise. Best to avoid using brand-6 and
  // use brand-mhf-turquoise instead.
  // See https://github.com/thebiggive/donate-frontend/pull/1076#issuecomment-1523472452
  // For other colour details see https://github.com/thebiggive/components/blob/develop/src/globals/brand-colour.ts
  iconColor: brandColour,
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
  |'emergencyMatch';

export type SfApiHighlightCard = Omit<HighlightCard, 'backgroundImageUrl'|'iconColor'|'button'> & {
  campaignFamily: campaignFamilyName | null
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
    artsforImpact: 'brand-afa-pink'
  };

  const campaignFamilyBackgroundImages: Record<campaignFamilyName, URL> = {
    emergencyMatch: new URL('/assets/images/emergency-card.png', donateUriPrefix),
    christmasChallenge: new URL('/assets/images/card-background-cc-lights.jpg', donateUriPrefix),
    summerGive:  new URL('/assets/images/colour-orange.png', donateUriPrefix),
    greenMatchFund:  new URL('/assets/images/card-background-gmf.jpg', donateUriPrefix),
    womenGirls: new URL('/assets/images/wmg-purple-texture.jpg', donateUriPrefix),
    mentalHealthFund: new URL('/assets/images/turquoise-texture.jpg', donateUriPrefix),
    artsforImpact: new URL('/assets/images/red-coral-texture.png', donateUriPrefix)
  };

  // first bit covers for the case where campaignFamily is null the second part is for catching new campaign family that hasn't defined color yet
  const iconColor = (sfApiHighlightCard.campaignFamily ? campaignFamilyColours[sfApiHighlightCard.campaignFamily] : "primary") || "primary";
  const backgroundImageUrl = (sfApiHighlightCard.campaignFamily 
  ? campaignFamilyBackgroundImages[sfApiHighlightCard.campaignFamily] 
  : new URL('/assets/images/blue-texture.jpg', donateUriPrefix))
  || new URL('/assets/images/blue-texture.jpg', donateUriPrefix);
  
  return {
    headerText: sfApiHighlightCard.headerText,
    bodyText: sfApiHighlightCard.bodyText,
    iconColor,
    backgroundImageUrl,
    button: {
      text: sfApiHighlightCard.button.text,
      href: replaceURLOrigin(experienceUriPrefix, blogUriPrefix, donateUriPrefix, sfApiHighlightCard.button.href),
    }
  };
};
