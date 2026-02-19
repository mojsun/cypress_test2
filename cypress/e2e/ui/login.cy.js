/// <reference types="cypress" />

describe('SauceDemo - Login and Logout', () => {
  beforeEach(() => {
    // Ensure no saved sessions bleed between tests
    if (Cypress.session && Cypress.session.clearAllSavedSessions) {
      Cypress.session.clearAllSavedSessions();
    }
    // Start from login page each test
    cy.visit('/');
  });

  it('UI-LOGIN-001: Valid login redirects to inventory', () => {
    cy.fixture('users').then(({ sauceDemo }) => {
      cy.loginSauce(sauceDemo.validUser.username, sauceDemo.validUser.password);
      cy.url().should('include', '/inventory');
      cy.get('.app_logo').should('contain.text', 'Swag Labs');
    });
  });

  it('UI-LOGIN-002: Locked out user shows error message', () => {
    cy.fixture('users').then(({ sauceDemo }) => {
      cy.loginSauce(sauceDemo.lockedUser.username, sauceDemo.lockedUser.password, { useSession: false });
      cy.get('[data-test="error"]').should('be.visible').and('contain.text', 'locked out');
      cy.url().should('not.include', '/inventory.html');
    });
  });

  it('UI-LOGIN-003: Logout returns to login page', () => {
    cy.fixture('users').then(({ sauceDemo }) => {
      cy.loginSauce(sauceDemo.validUser.username, sauceDemo.validUser.password);
      // Ensure we are on inventory before interacting with menu
      cy.url().should('include', '/inventory');
      cy.get('.app_logo').should('contain.text', 'Swag Labs');
      // Open side menu and logout
      cy.get('#react-burger-menu-btn', { timeout: 10000 }).should('be.visible').click();
      cy.get('#logout_sidebar_link').should('be.visible').click();
      // Assert pathname is either "/" or "/index.html" (avoid complex URL regex)
      cy.location('pathname').should('match', /^\/(index\.html)?$/);
      cy.get('[data-test="login-button"]').should('be.visible');
    });
  });
});

