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
    //cy.contains('£327,737,108'); // Real Staging figure at 17:48 on 5 March 2025.
    cy.contains('charity projects since 2008');
  })
})
