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
  - Valid login: `standard_user` / `secret_sauce`
  - Invalid (example): `locked_out_user` / `secret_sauce` (should error)
- API: ReqRes (`https://reqres.in/`)

### Getting started

1. Prereqs: Node 20+ recommended for local (CI uses Node 20).
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Launch Cypress runner (GUI):
   ```bash
   npm run cy:open
   ```
4. Run all tests headlessly:
   ```bash
   npm run cy:run
   ```

### Notes

- SauceDemo is a public demo site; occasional third‑party hiccups may occur. The Hybrid spec demonstrates how we would stabilize tests via interception/stubbing when needed.
