describe('App boot fundamentals', () => {
  it('Shows our headline copy on the Donate home page', () => {
    cy.visit('/')
    cy.contains('Matching Donations.')
  })
})
