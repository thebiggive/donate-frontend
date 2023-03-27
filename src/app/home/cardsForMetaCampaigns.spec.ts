import { MetaCampaign } from "../metaCampaign.model";
import {cardsForMetaCampaigns} from "./cardsForMetaCampaigns";
import {HighlightCard} from "./HilightCard";

describe('cardsForMetaCampaigns', () => {
  const emergencyCard: HighlightCard = {
    headerText: 'Emergency Campaign Name',
    bodyText: "Double the impact of your donation",
    iconColor: "brand-4",
    backgroundImageUrl: new URL('/assets/images/emergency-card.png', 'https://example.com'),
    button: {
      text: "Donate now",
      href: new URL('/slug-of-the-emergency', 'https://example.com'),
    }
  };

  const emergencyMetaCampaign = new MetaCampaign(
    'Emergency Campaign Name',
    true,
    'slug-of-the-emergency',
    'brand-4'
  );

  const exploreCard: HighlightCard = {
    headerText: 'One donation. Twice the impact.',
    bodyText: "You donate.\nWe double it.",
    iconColor: "primary",
    backgroundImageUrl: new URL('/assets/images/blue-texture.jpg', 'https://example.com'),
    button: {
      text: "Explore now",
      href: new URL('/explore', 'https://example.com'),
    }
  };

  it('Shows only explore card when there are no meta campaigns', () => {
    const metaCampaigns: readonly MetaCampaign[] = [];

    const cards = cardsForMetaCampaigns(metaCampaigns, 'https://example.com')

    expect(cards).toEqual([
      {
        headerText: 'One donation. Twice the impact.',
        bodyText: "You donate.\nWe double it.",
        iconColor: "primary",
        backgroundImageUrl: new URL('/assets/images/blue-texture.jpg', 'https://example.com'),
        button: {
          text: "Explore now",
          href: new URL('/explore', 'https://example.com'),
        }
      },
    ]);
  });

  it('Shows emergency and explore when there is only emergency metacampaign', () => {
    const metaCampaigns: readonly MetaCampaign[] = [emergencyMetaCampaign];

    const cards = cardsForMetaCampaigns(metaCampaigns, 'https://example.com')

    expect(cards).toEqual([
      {
        headerText: 'Emergency Campaign Name',
        bodyText: "Double the impact of your donation",
        iconColor: "brand-4",
        backgroundImageUrl: new URL('/assets/images/emergency-card.png', 'https://example.com'),
        button: {
          text: "Donate now",
          href: new URL('/slug-of-the-emergency', 'https://example.com'),
        }
      },
      exploreCard,
    ]);
  });

  it('Shows 5 emergencies with nothing else', () => {
    const metaCampaigns: readonly MetaCampaign[] = Array(5).fill(emergencyMetaCampaign);

    const cards = cardsForMetaCampaigns(metaCampaigns, 'https://example.com')

    expect(cards).toEqual(Array(5).fill(emergencyCard));
  });

  it('Shows 4 emergencies with explore card', () => {
    const metaCampaigns: readonly MetaCampaign[] = Array(4).fill(emergencyMetaCampaign);

    const cards = cardsForMetaCampaigns(metaCampaigns, 'https://example.com')

    expect(cards).toEqual([...Array(4).fill(emergencyCard), exploreCard]);
  });

});
