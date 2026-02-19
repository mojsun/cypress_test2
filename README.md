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

### Targets Under Test

- UI: SauceDemo (`https://www.saucedemo.com/`)
- API: ReqRes (`https://reqres.in/`)

### Getting started

1. Prereqs: Node 20+ recommended for local
2. Install dependencies: npm ci
3. Launch Cypress runner (GUI): npm run cy:open
4. Run all tests headlessly: npm run cy:run

## Test Coverage

### UI Automation (SauceDemo)

- Login & Logout
- Inventory Sorting
- Cart Management
- Product Details
- Checkout Flow
- Reset App State

Total UI Tests: 15

### API Automation (ReqRes)

- CRUD operations
- Validation scenarios
- Negative testing
- Performance delay validation

Total API Tests: 7

### Hybrid Testing

- Network interception
- Stubbed API response
- Slow network simulation

Total Hybrid Tests: 2

Grand Total: 24 Automated Test Cases

### Notes

- SauceDemo is a public demo site; occasional third‑party hiccups may occur. The Hybrid spec demonstrates how we would stabilize tests via interception/stubbing when needed.
