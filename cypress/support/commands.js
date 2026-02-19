// Custom Cypress Commands for UI and API interactions
// UI Commands target SauceDemo, API Commands target ReqRes (Cypress.env('apiUrl'))

function performSauceLogin(username, password) {
  cy.visit('/');
  cy.get('[data-test="username"]').clear().type(username, { log: true });
  cy.get('[data-test="password"]').clear().type(password, { log: true });
  cy.get('[data-test="login-button"]').click();
}

Cypress.Commands.add('loginSauce', (username, password, options = { useSession: true }) => {
  const key = `sauce-login-${username}`;
  const shouldUseSession = options.useSession !== false && typeof cy.session === 'function';
  if (shouldUseSession) {
    cy.session(
      [key, username, password],
      () => {
        performSauceLogin(username, password);
      },
      {
        cacheAcrossSpecs: true,
      }
    );
    // After ensuring session, navigate to inventory robustly (handles .html vs no extension)
    cy.visit('/inventory.html', { failOnStatusCode: false }).then(() => {
      cy.location('pathname', { timeout: 10000 }).then((pathname) => {
        if (!/^\/inventory(\.html)?$/.test(pathname)) {
          cy.visit('/inventory', { failOnStatusCode: false });
        }
      });
    });
    cy.get('.inventory_list', { timeout: 15000 }).should('be.visible');
  } else {
    performSauceLogin(username, password);
  }
});

Cypress.Commands.add('addBackpackToCart', () => {
  // On inventory page
  cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('be.visible').click();
  // Cart badge should increment to 1
  cy.get('.shopping_cart_badge').should('contain.text', '1');
});

Cypress.Commands.add('checkout', (firstName, lastName, zip) => {
  // From anywhere, open the cart and proceed to checkout
  cy.get('.shopping_cart_link').click();
  cy.url().should('include', '/cart.html');
  cy.get('[data-test="checkout"]').click();
  cy.url().should('include', '/checkout-step-one.html');

  if (firstName) cy.get('[data-test="firstName"]').clear().type(firstName);
  if (lastName) cy.get('[data-test="lastName"]').clear().type(lastName);
  if (zip) cy.get('[data-test="postalCode"]').clear().type(zip);
  cy.get('[data-test="continue"]').click();

  // If validation fails, error container is shown
  if (!firstName || !lastName || !zip) {
    cy.get('[data-test="error"]').should('be.visible');
    return;
  }

  cy.url().should('include', '/checkout-step-two.html');
  cy.get('[data-test="finish"]').click();
  cy.url().should('include', '/checkout-complete.html');
  cy.get('.complete-header').should('contain.text', 'Thank you for your order!');
});

// API helper
function apiUrl() {
  return Cypress.env('apiUrl') || 'https://reqres.in';
}

Cypress.Commands.add('apiCreateUser', (name, job) => {
  return cy.request({
    method: 'POST',
    url: `${apiUrl()}/api/users`,
    headers: { 'Content-Type': 'application/json' },
    body: { name, job },
  });
});

Cypress.Commands.add('apiUpdateUser', (id, name, job) => {
  return cy.request({
    method: 'PUT',
    url: `${apiUrl()}/api/users/${id}`,
    headers: { 'Content-Type': 'application/json' },
    body: { name, job },
  });
});

Cypress.Commands.add('apiDeleteUser', (id) => {
  return cy.request({
    method: 'DELETE',
    url: `${apiUrl()}/api/users/${id}`,
  });
});

