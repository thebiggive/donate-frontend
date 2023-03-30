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

  const wgfCard: HighlightCard = {
    headerText: 'Applications for Women and Girls Match Fund now open!',
    backgroundImageUrl: new URL('/assets/images/wmg-purple-texture.jpg', 'https://example.com'),
    iconColor: 'brand-2',
    bodyText: 'Deadline is 23 June 2023',
    button: {
      text: 'Apply now',
      href: new URL('/women-girls-match-fund', "https://blog.com")
    }
  };

  const gmfCard: HighlightCard = {
    headerText: 'Save the date for Green Match Fund',
    backgroundImageUrl: new URL('/assets/images/card-background-gmf.jpg', 'https://example.com'),
    iconColor: 'brand-3',
    bodyText: '20th - 27th April 2023',
    button: {
      text: 'Save the date!',
      href: new URL('/green-match-fund', "https://blog.com")
    }
  };

  it('Shows explore card when there are no meta campaigns', () => {
    const metaCampaigns: readonly MetaCampaign[] = [];

    const cards = cardsForMetaCampaigns(metaCampaigns, 'https://example.com', 'https://blog.com')

    expect(cards).toEqual([wgfCard, gmfCard, exploreCard]);
  });

  it('Shows emergency and explore when there is only emergency metacampaign', () => {
    const metaCampaigns: readonly MetaCampaign[] = [emergencyMetaCampaign];

    const cards = cardsForMetaCampaigns(metaCampaigns, 'https://example.com', 'https://blog.com')

    expect(cards).toEqual([emergencyCard, wgfCard, gmfCard, exploreCard]);
  });

  it('Shows 4 emergencies with explore card', () => {
    const metaCampaigns: readonly MetaCampaign[] = Array(4).fill(emergencyMetaCampaign);

    const cards = cardsForMetaCampaigns(metaCampaigns, 'https://example.com', 'https://blog.com')

    expect(cards).toEqual([...Array(4).fill(emergencyCard), wgfCard, gmfCard, exploreCard]);
  });

  it('Shows 5 emergencies with no explore card', () => {
    const metaCampaigns: readonly MetaCampaign[] = Array(5).fill(emergencyMetaCampaign);

    const cards = cardsForMetaCampaigns(metaCampaigns, 'https://example.com', 'https://blog.com')

    expect(cards).toEqual([...Array(5).fill(emergencyCard), wgfCard, gmfCard]);
  });
});
