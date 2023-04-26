import { MetaCampaign } from "../metaCampaign.model";
import {cardsForMetaCampaigns} from "./cardsForMetaCampaigns";
import {HighlightCard} from "./HighlightCard";

describe('cardsForMetaCampaigns', () => {
  const emergencyCard: HighlightCard = {
    headerText: 'Emergency Campaign Name',
    bodyText: "Double the impact of your donation",
    iconColor: "brand-4",
    backgroundImageUrl: new URL('/assets/images/emergency-card.png', 'https://donate.example.com'),
    button: {
      text: "Donate now",
      href: new URL('/slug-of-the-emergency', 'https://donate.example.com'),
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
    backgroundImageUrl: new URL('/assets/images/blue-texture.jpg', 'https://donate.example.com'),
    button: {
      text: "Explore now",
      href: new URL('/explore', 'https://donate.example.com'),
    }
  };

  const wgfCard: HighlightCard = {
    headerText: 'Applications for Women and Girls Match Fund now open!',
    backgroundImageUrl: new URL('/assets/images/wmg-purple-texture.jpg', 'https://donate.example.com'),
    iconColor: 'brand-2',
    bodyText: 'Deadline is 23 June 2023',
    button: {
      text: 'Apply now',
      href: new URL('/women-girls-match-fund', "https://blog.com")
    }
  };

  const k2mCard: HighlightCard = {
    headerText: 'Save the Date for Kind²Mind',
    backgroundImageUrl: new URL('/assets/images/turquoise-texture.jpg', 'https://donate.example.com'),
    iconColor: 'brand-mhf-turquoise',
    bodyText: '15 May to 22 May 2023',
    button: {
      text: 'Find out more',
      href: new URL('/kind-2-mind-2023', "https://donate.example.com")
    }
  };

  const oldGmfCard: HighlightCard = {
    headerText: 'Save the date for Green Match Fund',
    backgroundImageUrl: new URL('/assets/images/card-background-gmf.jpg', 'https://donate.example.com'),
    iconColor: 'brand-3',
    bodyText: '20th - 27th April 2023',
    button: {
      text: 'Save the date!',
      href: new URL('/green-match-fund-2023', "https://donate.example.com")
    }
  };

  const afterGMFLaunch = new Date("2023-04-20T12:00:00+01:00");

  it('Shows explore card when there are no meta campaigns', () => {
    const metaCampaigns: readonly MetaCampaign[] = [];

    const cards = cardsForMetaCampaigns(afterGMFLaunch, metaCampaigns, 'https://donate.example.com', 'https://blog.com')

    expect(cards).toEqual([k2mCard, wgfCard, exploreCard]);
  });

  it('Shows emergency and explore when there is only emergency metacampaign', () => {
    const metaCampaigns: readonly MetaCampaign[] = [emergencyMetaCampaign];

    const cards = cardsForMetaCampaigns(afterGMFLaunch, metaCampaigns, 'https://donate.example.com', 'https://blog.com')

    expect(cards).toEqual([emergencyCard, k2mCard,  wgfCard,exploreCard]);
  });

  it('Shows 4 emergencies with explore card', () => {
    const metaCampaigns: readonly MetaCampaign[] = Array(4).fill(emergencyMetaCampaign);

    const cards = cardsForMetaCampaigns(afterGMFLaunch, metaCampaigns, 'https://donate.example.com', 'https://blog.com')

    expect(cards).toEqual([...Array(4).fill(emergencyCard), k2mCard, wgfCard, exploreCard]);
  });

  it('Shows old GMF card before Noon on Thursday', () => {
    const metaCampaigns: readonly MetaCampaign[] = Array(4).fill(emergencyMetaCampaign);

    const beforeGMFLaunch = new Date("2023-04-20T11:59:59+01:00");

    const cards = cardsForMetaCampaigns(beforeGMFLaunch, metaCampaigns, 'https://donate.example.com', 'https://blog.com')

    expect(cards).toEqual([...Array(4).fill(emergencyCard), wgfCard,  oldGmfCard, exploreCard]);
  });

  it('Shows 5 emergencies with no explore card', () => {
    const metaCampaigns: readonly MetaCampaign[] = Array(5).fill(emergencyMetaCampaign);

    const cards = cardsForMetaCampaigns(afterGMFLaunch, metaCampaigns, 'https://donate.example.com', 'https://blog.com')

    expect(cards).toEqual([...Array(5).fill(emergencyCard), k2mCard, wgfCard]);
  });
});
