/// <reference types="cypress" />

describe('SauceDemo - Cart and Checkout', () => {
  it('UI-CHECKOUT-001: Complete checkout flow for backpack', () => {
    cy.fixture('users').then(({ sauceDemo }) => {
      cy.loginSauce(sauceDemo.validUser.username, sauceDemo.validUser.password);
      cy.addBackpackToCart();
      cy.checkout(sauceDemo.checkout.firstName, sauceDemo.checkout.lastName, sauceDemo.checkout.zip);
      cy.get('.complete-header').should('contain.text', 'Thank you for your order!');
    });
  });

  it('UI-CHECKOUT-002: Missing required field shows validation', () => {
    cy.fixture('users').then(({ sauceDemo }) => {
      cy.loginSauce(sauceDemo.validUser.username, sauceDemo.validUser.password);
      cy.addBackpackToCart();
      // Intentionally omit first name to trigger validation
      cy.get('.shopping_cart_link').click();
      cy.get('[data-test="checkout"]').click();
      cy.get('[data-test="lastName"]').type(sauceDemo.checkout.lastName);
      cy.get('[data-test="postalCode"]').type(sauceDemo.checkout.zip);
      cy.get('[data-test="continue"]').click();
      cy.get('[data-test="error"]').should('be.visible').and('contain.text', 'First Name is required');
    });
  });
});

