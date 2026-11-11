import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  it('should mount', () => {
    cy.mount(LoginComponent);
  });

  it('should not repeat password input ID', () => {
    cy.mount(LoginComponent);
    cy.find('#loginPassword').its('length').should('eq', 1);
  });
});
