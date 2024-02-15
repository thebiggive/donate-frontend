import { brandColour } from "@biggive/components/dist/types/globals/brand-colour"

export type HighlightCard = {
  /**
   * If not 'asap', the card should not be displayed until the date given.
   * Remember to set the timezone appropriately when creating these date objects.
   */
  appearAt: Date | 'asap',

  /**
   * If not 'never', the card should disappear at this date.
   */
  disappearAt: Date | 'never',

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
  campaignFamily: campaignFamilyName
  button: {
    text: string,
    href: string
  }
};

const replaceURLOrigin = (experienceUriPrefix: string, blogUriPrefix: string, donateGlobalUriPrefix: string, urlFromApi: string): URL => {

  const href = urlFromApi
    .replace('https://donate.biggive.org', donateGlobalUriPrefix)
    .replace('https://biggive.org', blogUriPrefix)
    .replace('https://community.biggive.org', experienceUriPrefix)
  ;

  return new URL(href);
}

export const SFAPIHighlightCardToHighlightCard = (experienceUriPrefix: string, blogUriPrefix: string, donateGlobalUriPrefix: string, sfApiHighlightCard: SfApiHighlightCard, ): HighlightCard => {

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
    emergencyMatch: new URL('/assets/images/emergency-card.png', donateGlobalUriPrefix),
    christmasChallenge: new URL('/assets/images/card-background-cc-lights.jpg', donateGlobalUriPrefix),
    summerGive:  new URL('/assets/images/colour-orange.png', donateGlobalUriPrefix),
    greenMatchFund:  new URL('/assets/images/card-background-gmf.jpg', donateGlobalUriPrefix),
    womenGirls: new URL('/assets/images/wmg-purple-texture.jpg', donateGlobalUriPrefix),
    mentalHealthFund: new URL('/assets/images/turquoise-texture.jpg', donateGlobalUriPrefix),
    artsforImpact: new URL('/assets/images/red-coral-texture.png', donateGlobalUriPrefix)
  };

  return {
    appearAt: sfApiHighlightCard.appearAt,
    disappearAt: sfApiHighlightCard.disappearAt,
    headerText: sfApiHighlightCard.headerText,
    bodyText: sfApiHighlightCard.bodyText,
    iconColor: campaignFamilyColours[sfApiHighlightCard.campaignFamily] || "primary",
    backgroundImageUrl: campaignFamilyBackgroundImages[sfApiHighlightCard.campaignFamily] || new URL('/assets/images/blue-texture.jpg', donateGlobalUriPrefix),
    button: {
      text: sfApiHighlightCard.button.text,
      href: replaceURLOrigin(experienceUriPrefix, blogUriPrefix, donateGlobalUriPrefix, sfApiHighlightCard.button.href),
    }
  };
};
