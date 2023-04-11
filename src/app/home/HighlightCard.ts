export type HighlightCard = {
  backgroundImageUrl: URL,
  iconColor: 'primary' | 'brand-1' | 'brand-2' | 'brand-3' | 'brand-4' | 'brand-5' | 'brand-6',
  headerText: string,
  bodyText: string,
  button: {
      text: string,
      href: URL,
  },
}
