# E2E Tests for Friend Links

We use Flarum's Cypress E2E testing framework.

## Setup
1. Ensure Flarum is running.
2. Install Cypress: `npm install -D cypress`
3. Run tests: `npx cypress open`

## Test Cases

### 1. Unauthenticated User
- **Action:** Visit homepage
- **Expectation:** The "Apply Link" button should be hidden.
- **Action:** Visit `/friend-links`
- **Expectation:** Page loads but "Apply Link" button is hidden.

### 2. Authenticated User
- **Action:** Login as normal user, visit homepage.
- **Expectation:** "Apply Link" button is visible.
- **Action:** Click "Apply Link".
- **Expectation:** Modal opens.
- **Action:** Submit invalid URL.
- **Expectation:** Error toast appears.
- **Action:** Submit valid data.
- **Expectation:** Success toast appears, modal closes, link status is `pending`.

### 3. Admin User
- **Action:** Login as admin, visit admin panel `/admin#/extension/fof-friend-links`
- **Expectation:** Settings and pending applications are visible.
- **Action:** Click "Approve" on a pending link.
- **Expectation:** Link status becomes `approved`.
- **Action:** Visit homepage.
- **Expectation:** Approved link appears in the footer.
