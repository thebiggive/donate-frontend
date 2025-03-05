describe('App boot fundamentals', () => {
  beforeEach(() => {
  })

  // Now we hand over real values from the server, we can't mock callout in the same way so don't
  // assert a match against specific all-time stats.
  it('Shows our copy on the Donate home page', () => {
    cy.visit('/?noredirect');

    cy.contains('Hi. We’re Big Give');
    cy.contains('charity projects since 2008');
  })
})
