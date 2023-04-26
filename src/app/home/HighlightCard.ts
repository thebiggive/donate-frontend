export type HighlightCard = {
  backgroundImageUrl: URL,
  // There is ambiguity in the components library about whether brand-6 is grey or turquoise. Best to avoid using brand-6 and
  // use brand-mhf-turquoise instead.
  // See https://github.com/thebiggive/donate-frontend/pull/1076#issuecomment-1523472452
  iconColor: 'primary' | 'brand-1' | 'brand-2' | 'brand-3' | 'brand-4' | 'brand-5' | 'brand-6' | 'brand-mhf-turquoise',
  headerText: string,
  bodyText: string,
  button: {
      text: string,
      href: URL,
  },
}
