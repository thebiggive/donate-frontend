describe('App boot fundamentals', () => {
  it('Sees our headline copy on the Donate home page', () => {
    cy.visit('/')
    cy.get('biggive-hero-image').shadow().contains('Matching Donations.')
  })
})
