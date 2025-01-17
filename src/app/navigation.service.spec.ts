import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import { SfApiHighlightCard, SFHighlightCardsToFEHighlightCards } from './highlight-cards/HighlightCard';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should indicate that nothing can redirect if no highlight cards are CC', () => {
    const sfCardList: SfApiHighlightCard[] = [
      {
        campaignFamily: 'emergencyMatch',
        cardStyle: 'DONATE_NOW',
        headerText:  "header",
        bodyText: "Emergency card body",
        button: {text: "Donate Now", href: 'https://biggive.org/some-path'}
      },
    ];

    const cards = SFHighlightCardsToFEHighlightCards(sfCardList);

    expect(service.getPotentialRedirectPath(cards)).toBeNull();
  });

  it('should indicate that nothing can redirect if no highlight cards have heading Donate...', () => {
    const sfCardList: SfApiHighlightCard[] = [
      {
        campaignFamily: 'christmasChallenge',
        cardStyle: 'SEE_RESULTS',
        headerText:  "header",
        bodyText: "Christmas card body",
        button: {text: 'See results', href: 'https://biggive.org/some-path'}
      },
    ];

    const cards = SFHighlightCardsToFEHighlightCards(sfCardList);

    expect(service.getPotentialRedirectPath(cards)).toBeNull();
  });

  it('should indicate that something can redirect if a CC highlight card has heading Donate...', () => {
    const sfCardList: SfApiHighlightCard[] = [
      // Arbitrary other card first to ensure we're not just looking at the first card
      {
        campaignFamily: 'emergencyMatch',
        cardStyle: 'DONATE_NOW',
        headerText:  "header",
        bodyText: "Emergency card body",
        button: {text: "Donate Now", href: 'https://biggive.org/some-path'}
      },
      {
        campaignFamily: 'christmasChallenge',
        cardStyle: 'DONATE_NOW',
        headerText:  "header",
        bodyText: "Christmas card body",
        button: {text: 'Donate Now', href: 'https://biggive.org/cc-path'}
      },
    ];

    const cards = SFHighlightCardsToFEHighlightCards(sfCardList);

    expect(service.getPotentialRedirectPath(cards)).toBe('/cc-path');
  });
});
