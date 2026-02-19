## Cypress QA Automation Framework (UI + API + Hybrid)

Professional end‑to‑end test automation project showcasing UI testing against SauceDemo, API testing against ReqRes, and a Hybrid test with network interception using Cypress (JavaScript).

### What this project demonstrates
- UI automation: login, negative auth, cart + checkout on SauceDemo
- API automation: CRUD‑like flows + schema/latency checks on ReqRes
- Hybrid testing: `cy.intercept` to control the network layer for stability
- Clean structure with reusable custom commands, fixtures, and config
- CI with GitHub Actions running tests on every push/PR
- An Excel test plan (`Test_Cases.xlsx`) with 20+ cases (UI, API, Hybrid)

### Tech stack
- Cypress (latest), JavaScript (no TypeScript)
- Node + npm
- GitHub Actions for CI

### Folder structure
```
cypress/
  e2e/
    ui/
      login.cy.js
      cart_checkout.cy.js
    api/
      users_api.cy.js
    hybrid/
      ui_with_mocking.cy.js
  fixtures/
    users.json
  support/
    commands.js
    e2e.js
cypress.config.js
package.json
README.md
.github/workflows/ci.yml
Test_Cases.xlsx
```

### Targets Under Test
- UI: SauceDemo (`https://www.saucedemo.com/`)
  - Valid login: `standard_user` / `secret_sauce`
  - Invalid (example): `locked_out_user` / `secret_sauce` (should error)
- API: ReqRes (`https://reqres.in/`)

### Getting started
1) Prereqs: Node 20+ recommended for local (CI uses Node 20).
2) Install dependencies:
   ```bash
   npm ci
   ```
3) Launch Cypress runner (GUI):
   ```bash
   npm run cy:open
   ```
4) Run all tests headlessly:
   ```bash
   npm run cy:run
   ```

### Useful scripts
- `npm run cy:open` – open Cypress GUI
- `npm run cy:run` – run entire test suite headlessly
- `npm run cy:run:chrome` – run in Chrome
- `npm run cy:run:headless` – run headless (default browser)
- `npm run cy:ui` – run only UI specs
- `npm run cy:api` – run only API specs
- `npm run cy:hybrid` – run only Hybrid specs
- `npm run generate:excel` – regenerate `Test_Cases.xlsx`

### Configuration
- `cypress.config.js`:
  - `baseUrl`: `https://www.saucedemo.com`
  - `env.apiUrl`: `https://reqres.in`

### Reusable commands (highlights)
- `cy.loginSauce(username, password)` – logs into SauceDemo (uses `cy.session` when available)
- `cy.addBackpackToCart()` – adds “Sauce Labs Backpack” to cart
- `cy.checkout(firstName, lastName, zip)` – completes checkout and asserts success
- `cy.apiCreateUser(name, job)` – POST to ReqRes `/api/users`
- `cy.apiUpdateUser(id, name, job)` – PUT to ReqRes `/api/users/{id}`
- `cy.apiDeleteUser(id)` – DELETE to ReqRes `/api/users/{id}`

### CI (GitHub Actions)
On every `push` and `pull_request`:
- Install with `npm ci`
- Run `npx cypress run`
- Upload screenshots/videos as artifacts on failure

### What recruiters should know
- This project intentionally balances breadth (UI/API/Hybrid) and clarity.
- Tests avoid flakiness by using stable selectors, sensible assertions, and `cy.intercept` to control the network when needed.
- The structure, README, CI, and test plan mirror a production‑ready approach tailored for a portfolio.

### Notes
- SauceDemo is a public demo site; occasional third‑party hiccups may occur. The Hybrid spec demonstrates how we would stabilize tests via interception/stubbing when needed.

