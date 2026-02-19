/// <reference types="cypress" />

// Extended UI tests for SauceDemo inventory/cart flows
// Reuses cy.loginSauce and keeps tests independent

const selectors = {
  sort: '.product_sort_container',
  itemName: '.inventory_item_name',
  itemPrice: '.inventory_item_price',
  cartBadge: '.shopping_cart_badge',
  cartLink: '.shopping_cart_link',
  cartItem: '.cart_item',
  menuBtn: '#react-burger-menu-btn',
  resetLink: '#reset_sidebar_link',
  backToProducts: '[data-test="back-to-products"]',
};

function getTexts(selector) {
  return cy.get(selector).then(($els) => Cypress._.map($els, 'innerText'));
}

function parsePrices(texts) {
  return texts.map((t) => Number(t.replace('$', '').trim()));
}

function isSortedAsc(arr) {
  return arr.every((v, i) => i === 0 || arr[i - 1] <= v);
}
function isSortedDesc(arr) {
  return arr.every((v, i) => i === 0 || arr[i - 1] >= v);
}

describe('SauceDemo - Inventory sorting and cart behaviors', () => {
  beforeEach(() => {
    // Start clean and login
    if (Cypress.session && Cypress.session.clearAllSavedSessions) {
      Cypress.session.clearAllSavedSessions();
    }
    cy.fixture('users').then(({ sauceDemo }) => {
      cy.loginSauce(sauceDemo.validUser.username, sauceDemo.validUser.password);
    });
    cy.get('.inventory_list', { timeout: 15000 }).should('be.visible');
  });

  it('UI-SORT-001: Default sorting is Name (A→Z)', () => {
    cy.get(selectors.sort).should('have.value', 'az');
    getTexts(selectors.itemName).then((names) => {
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      expect(names, 'names A→Z').to.deep.equal(sorted);
    });
  });

  it('UI-SORT-002: Sort by Name (Z→A) works', () => {
    cy.get(selectors.sort).select('za');
    getTexts(selectors.itemName).then((names) => {
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      expect(names, 'names Z→A').to.deep.equal(sorted);
    });
  });

  it('UI-SORT-003: Sort by Price (low→high) works', () => {
    cy.get(selectors.sort).select('lohi');
    getTexts(selectors.itemPrice).then((pricesText) => {
      const prices = parsePrices(pricesText);
      expect(isSortedAsc(prices), 'prices ascending').to.eq(true);
    });
  });

  it('UI-SORT-004: Sort by Price (high→low) works', () => {
    cy.get(selectors.sort).select('hilo');
    getTexts(selectors.itemPrice).then((pricesText) => {
      const prices = parsePrices(pricesText);
      expect(isSortedDesc(prices), 'prices descending').to.eq(true);
    });
  });

  it('UI-CART-003: Add multiple items shows correct cart badge count', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    cy.get(selectors.cartBadge).should('have.text', '3');
    cy.get(selectors.cartLink).click();
    cy.url().should('include', '/cart');
    cy.get(selectors.cartItem).should('have.length', 3);
  });

  it('UI-CART-004: Remove item from inventory updates badge + button state', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get(selectors.cartBadge).should('have.text', '2');
    // Remove one item from inventory
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    cy.get(selectors.cartBadge).should('have.text', '1');
    // Button toggles back to "Add to cart"
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('be.visible');
  });

  it('UI-CART-005: Remove item from cart updates badge + removes line item', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get(selectors.cartBadge).should('have.text', '2');
    cy.get(selectors.cartLink).click();
    cy.url().should('include', '/cart');
    cy.get(selectors.cartItem).should('have.length', 2);
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    cy.get(selectors.cartItem).should('have.length', 1);
    cy.get(selectors.cartBadge).should('have.text', '1');
  });

  it('UI-PRODUCT-001: Product details shows info and preserves cart state', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get(selectors.cartBadge).should('have.text', '1');
    cy.contains(selectors.itemName, 'Sauce Labs Backpack').click();
    cy.url().should('include', '/inventory-item');
    cy.get('.inventory_details_name').should('contain.text', 'Sauce Labs Backpack');
    cy.get('.inventory_details_price').should('be.visible');
    cy.get('.inventory_details_desc').should('be.visible');
    cy.get('.inventory_details_img').should('be.visible');
    cy.get(selectors.backToProducts).click();
    cy.url().should('include', '/inventory');
    cy.get(selectors.cartBadge).should('have.text', '1');
  });

  it('UI-CART-006: Continue Shopping from cart returns to inventory', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get(selectors.cartLink).click();
    cy.url().should('include', '/cart');
    cy.get('[data-test="continue-shopping"]').click();
    cy.url().should('include', '/inventory');
    cy.get('.inventory_list').should('be.visible');
  });

  it('UI-MENU-001: Reset App State clears cart and resets UI', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get(selectors.cartBadge).should('have.text', '2');
    cy.get(selectors.menuBtn).click();
    cy.get(selectors.resetLink, { timeout: 10000 }).should('be.visible').click();
    // Badge disappears
    cy.get(selectors.cartBadge).should('not.exist');
    // Buttons back to add state
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('be.visible');
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').should('be.visible');
    // Optional: cart page empty
    cy.get(selectors.cartLink).click();
    cy.get(selectors.cartItem).should('have.length.at.most', 0);
  });
});

