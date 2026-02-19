/// <reference types="cypress" />

// HYBRID-001: Demonstrate network control with cy.intercept using ReqRes as backend
// We stub GET /api/users?page=2 and assert our stub is used. Then we perform a quick UI
// action on SauceDemo to show end-to-end control.

describe('Hybrid - UI with Network Mocking', () => {
  it('HYBRID-001: Intercepts ReqRes GET and asserts stubbed response', () => {
    const api = Cypress.env('apiUrl') || 'https://reqres.in';

    const stubbedBody = {
      page: 2,
      per_page: 6,
      total: 12,
      total_pages: 2,
      data: [
        {
          id: 999,
          email: 'mocked.user@reqres.in',
          first_name: 'Mocked',
          last_name: 'User',
          avatar: 'https://reqres.in/img/faces/9-image.jpg',
        },
      ],
      support: {
        url: 'https://reqres.in/#support-heading',
        text: 'To keep ReqRes free, contributions towards server costs are appreciated!',
      },
    };

    // Intercept applies to browser-initiated requests (XHR/fetch), not cy.request
    cy.intercept('GET', `${api}/api/users?page=2`, (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: stubbedBody,
        delay: 50,
      });
    }).as('getUsers');

    // Trigger the network call explicitly from the browser so cy.intercept can stub it
    cy.window().then((win) =>
      win
        .fetch(`${api}/api/users?page=2`, { method: 'GET' })
        .then((r) => r.json())
        .then((data) => {
          expect(data.data[0].id).to.eq(999);
          expect(data.data[0].first_name).to.eq('Mocked');
        })
    );

    cy.wait('@getUsers').its('response.statusCode').should('eq', 200);

    // Quick UI sanity: visit SauceDemo login page and assert form is visible (stability)
    cy.visit('/');
    cy.get('[data-test="username"]').should('be.visible');
    cy.get('[data-test="password"]').should('be.visible');
    cy.get('[data-test="login-button"]').should('be.visible');
  });
});

