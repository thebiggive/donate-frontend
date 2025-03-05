import {CampaignStats} from "../../src/app/campaign-stats.model";

describe('App boot fundamentals', () => {
  beforeEach(() => {
    cy.intercept(
      {url: "https://sf-api-staging.thebiggivetest.org.uk/campaigns/services/apexrest/v1.0/campaigns/stats"},
      {
        body: {totalRaised: 500_000, totalCampaignCount: 123_456} as CampaignStats
      }
    )
  })

  it('Shows our copy on the Donate home page', () => {
    cy.visit('/?noredirect');

    cy.contains('Hi. We’re Big Give');
    cy.contains('£500,000');
    cy.contains('raised for over 123,456 charity projects since 2008');
  })
})
