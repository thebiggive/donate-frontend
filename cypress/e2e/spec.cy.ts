describe('App boot fundamentals', () => {
  it('Shows our headline copy on the Donate home page', () => {
    cy.visit('/')
    cy.contains('Matching Donations.')
  })

  it('Mentions exploration on the explore page', () => {
    // test we know will fail, just to check how cyprus failures look and to see that we can see the screenshot as a circle artefact.
    cy.visit('/explore')
    cy.contains('exploration')
  })
})
