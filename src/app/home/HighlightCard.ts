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
