import {
  campaignFamilyName,
  SfApiHighlightCard,
  SFAPIHighlightCardToHighlightCard,
  SFHighlightCardsToFEHighlightCards
} from "./HighlightCard";

describe('highlightCard', () => {
  it('should convert a highlight card from the SF API to one we can display', () => {
    const cardFromApi: SfApiHighlightCard = {
      campaignFamily: 'womenGirls',
      cardStyle: 'DONATE_NOW',
      headerText: "some header text",
      bodyText: "some body text",
      button: {text: "button text", href:'https://biggive.org/some-path'}
    } as const;

    const donatePrefixForThisEnvironment = 'https://example.com';

    const highlightCardForHomepage = SFAPIHighlightCardToHighlightCard(
      'https://irrelevant.com',
      'https://irrelevant.com',
      donatePrefixForThisEnvironment,
      cardFromApi
    );

    expect(highlightCardForHomepage.backgroundImageUrl.href).toBe('https://example.com/assets/images/wmg-purple-texture.jpg');
    expect(highlightCardForHomepage.iconColor).toBe('brand-wgmf-purple');
  });

  it('should use appropriate colour for emergency campaign', () => {
    const cardFromApi: SfApiHighlightCard = {
      campaignFamily: 'emergencyMatch',
      cardStyle: 'DONATE_NOW',
      headerText: "some header text",
      bodyText: "some body text",
      button: {text: "button text", href: 'https://biggive.org/some-path'}
    } as const;

    const donatePrefixForThisEnvironment = 'https://example.com';

    const highlightCardForHomepage = SFAPIHighlightCardToHighlightCard(
      'https://irrelevant.com',
      'https://irrelevant.com',
      donatePrefixForThisEnvironment,
      cardFromApi
    );

    // todo - check what background we had for EMF cards in the past.
    expect(highlightCardForHomepage.backgroundImageUrl.href).toBe('https://example.com/assets/images/emergency-card.webp');
    expect(highlightCardForHomepage.iconColor).toBe('brand-emf-yellow');
  });

  it('should use blue primary colour by default', () => {
    const cardFromApi: SfApiHighlightCard = {
      campaignFamily: 'some-unknown-campaign-family' as campaignFamilyName,
      cardStyle: 'DONATE_NOW',
      headerText: "some header text",
      bodyText: "some body text",
      button: {text: "button text", href: 'https://biggive.org/some-path'}
    } as const;

    const donatePrefixForThisEnvironment = 'https://example.com';

    const highlightCardForHomepage = SFAPIHighlightCardToHighlightCard(
      'https://irrelevant.com',
      'https://irrelevant.com',
      donatePrefixForThisEnvironment,
      cardFromApi
    );

    expect(highlightCardForHomepage.backgroundImageUrl.href).toBe('https://example.com/assets/images/blue-texture.jpg');
    expect(highlightCardForHomepage.iconColor).toBe('primary');
  });

  function cardLinkingTo(href: string): SfApiHighlightCard {
    return {
      button: {
        href: href,
        text: "irrelevant"
      },
      campaignFamily: 'christmasChallenge', // irrelevant
      cardStyle: 'DONATE_NOW',
      headerText: "irrelevant",
      bodyText: "irrelevant",
    } as const;
  }

  it('should replace donate origins with origin for relevant environment', () => {
    const cardFromApi = cardLinkingTo("https://donate.biggive.org/some-path");

    const highlightCardForHomepage = SFAPIHighlightCardToHighlightCard(
      'https://example-experience.com',
      'https://example-blog.com',
      'https://example-donate.com',
      cardFromApi
    );

    expect(highlightCardForHomepage.button.href.href).toBe('https://example-donate.com/some-path');
  });

  it('should replace wp origins with origin for relevant environment', () => {
    const cardFromApi = cardLinkingTo("https://biggive.org/some-path");

    const highlightCardForHomepage = SFAPIHighlightCardToHighlightCard(
      'https://example-experience.com',
      'https://example-blog.com',
      'https://example-donate.com',
      cardFromApi
    );

    expect(highlightCardForHomepage.button.href.href).toBe('https://example-blog.com/some-path');
  });

  it('should replace CC24 link with metacampaign page', () => {
    if (new Date() > new Date('2025-02-01')) {
      pending('Implementation was only made for 2024');
    }

    const cardFromApi = cardLinkingTo("https://example-blog.com/christmas-challenge/");

    const highlightCardForHomepage = SFAPIHighlightCardToHighlightCard(
      'https://example-experience.com',
      'https://example-blog.com',
      'https://example-donate.com',
      cardFromApi
    );

    expect(highlightCardForHomepage.button.href.href).toBe('https://example-donate.com/christmas-challenge-2024');
  });

  it('should replace experience origins with origin for relevant environment', () => {
    const cardFromApi = cardLinkingTo("https://community.biggive.org/some-path");

    const highlightCardForHomepage = SFAPIHighlightCardToHighlightCard(
      'https://example-experience.com',
      'https://example-blog.com',
      'https://example-donate.com',
      cardFromApi
    );

    expect(highlightCardForHomepage.button.href.href).toBe('https://example-experience.com/some-path');
  });

  it('should set the backround for Join Mailing List card', () => {
    const cardFromApi: SfApiHighlightCard = {
      campaignFamily: null,
      cardStyle: 'JOIN_MAILING_LIST',
      headerText: "some header text",
      bodyText: "some body text",
      button: {text: "button text", href: 'https://biggive.org/some-path'}
    } as const;

    const donatePrefixForThisEnvironment = 'https://example.com';

    const highlightCardForHomepage = SFAPIHighlightCardToHighlightCard(
      'https://irrelevant.com',
      'https://irrelevant.com',
      donatePrefixForThisEnvironment,
      cardFromApi
    );

    expect(highlightCardForHomepage.backgroundImageUrl.href).toBe('https://example.com/assets/images/join-mailing-list.webp');
    expect(highlightCardForHomepage.iconColor).toBe('primary');
    });
});

describe('SFHighlightCardsToFEHighlightCards', () => {
  it('Sorts Christmas to the top', () => {
    const exampleSFCardList: SfApiHighlightCard[] = [
      {
        campaignFamily: 'emergencyMatch',
        cardStyle: 'DONATE_NOW',
        headerText:  "header",
        bodyText: "Emergency card body",
        button: {text: "button text", href: 'https://biggive.org/some-path'}
      },
      {
        campaignFamily: 'christmasChallenge',
        cardStyle: 'DONATE_NOW',
        headerText:  "header",
        bodyText: "Christmas card body",
        button: {text: "button text", href: 'https://biggive.org/some-path'}
      },
      {
        campaignFamily: 'greenMatchFund',
        cardStyle: 'DONATE_NOW',
        headerText:  "header",
        bodyText: "Green card body",
        button: {text: "button text", href: 'https://biggive.org/some-path'}
      },
    ] as const;

    const FECards = SFHighlightCardsToFEHighlightCards(exampleSFCardList);

    expect(FECards.map((card) => card.bodyText)).toEqual([
      'Christmas card body',
      'Emergency card body',
      'Green card body',
    ]);
  })
});
