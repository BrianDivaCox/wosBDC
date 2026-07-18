# WOS Public Website — Architecture & Rules for AI Agents

> **READ THIS BEFORE TOUCHING ANYTHING.** This document exists because multiple AI sessions have broken the same things repeatedly. Don't be that AI.

---

## Stack Overview

| Layer | Technology | Location |
|---|---|---|
| Frontend | Vanilla HTML + JS (ES Module) | `wos-public-website/` |
| Backend API | Google Apps Script (GAS) | `wos/` (deployed via clasp) |
| Realtime Database | Firebase Realtime Database (RTDB) | Firebase project `wos-dashboard-38d4c` |
| Sheet Data | Google Sheets (synced to Firebase) | Via `FirebaseSync.js` in GAS |
| Auth | Firebase Authentication | Client-side in `src/firebase.js` |

---

## The Single Most Important Rule

**`main.js` is an ES Module.** This means:

```js
export let nameToIdMap = {};   // NOT on window automatically
export let idToNameMap = {};   // NOT on window automatically
```

Inline HTML `onclick="..."` handlers run in the **global (window) scope**, NOT the module scope. Any function or variable used in an `onclick` attribute **MUST be explicitly assigned to `window`**:

```js
window.myFunction = () => { ... };   // accessible from onclick
window.nameToIdMap = nameToIdMap;    // accessible from onclick
```

**The symptom if you forget:** The function silently does nothing, or throws `window.X is not a function`. No obvious console error unless you open DevTools.

**CRITICAL assignments that must stay on `window`:**
- `window.nameToIdMap` — assigned at end of `refreshIdToNameMap()`
- `window.idToNameMap` — assigned at end of `refreshIdToNameMap()`
- `window.views` — the page router object
- `window.showToast` — toast notification helper
- `window.searchPlayerFull` — player profile search
- `window.adminLinkAltAccountPromptByChief` — admin alt-linking
- `window.adminUnlinkAltAccountPrompt` — admin alt-unlinking
- `window.isAdminUser` — admin check
- All other `window.xxx = ...` assignments near the top of `main.js`

---

## Data Maps — `nameToIdMap` and `idToNameMap`

These are the global lookup tables that map player names to Game IDs and back.

- **Populated by:** `refreshIdToNameMap()` in `main.js` (~line 180)
- **Data source:** Google Sheets ("Chief's List" + "giftcodebot"), fetched via the GAS API
- **Called on:** Page load, and before any view that needs name/ID resolution
- **Exposed on window:** At the end of `refreshIdToNameMap()` via `window.nameToIdMap = nameToIdMap`

---

## Firebase Security Rules — The Wall

Firebase RTDB security rules are configured so that:

- **A user can only read/write their OWN `/users/{uid}` node**
- **Admins have NO special bypass in the client-side rules**

This means: **client-side code can NEVER write to another user's Firebase node**, even if the logged-in user is an admin.

### What this breaks (and how to fix it)

| Operation | Wrong approach | Right approach |
|---|---|---|
| Admin links alt account to another player | `set(ref(db, 'users/targetUid/...'), ...)` client-side | Call GAS endpoint `adminLinkAlt` |
| Admin unlinking alts | Same client-side write | Same GAS solution |

### The GAS Backend has a master key

`FirebaseSync.js` defines:
```js
const FIREBASE_URL = "https://wos-dashboard-38d4c-default-rtdb.firebaseio.com";
const FIREBASE_SECRET = "..."; // This bypasses ALL security rules
```

GAS can read and write anything in Firebase using this secret. Route any admin write to another user's data through GAS.

---

## Google Apps Script (GAS) API

**Deployed URL (v1.24.26+):**
```
https://script.google.com/macros/s/AKfycbzYCigf08Z5uAyd_YtTfbrNgA5rEDjyZDNJISaRJr_6XwsYks3hR-KpL9erL9w-bVI/exec
```

**Stored in `main.js` as:** `API_BASE_URL` (line ~5)

> CRITICAL: Every time you run `clasp deploy` WITHOUT `-i <existing-id>`, a NEW URL is created. You MUST update `API_BASE_URL` in `main.js`. Always redeploy with `-i <deployment-id>`.

### Endpoint Authentication

Defined at the top of `Sidebars_and_Tools.js`:

```js
var PUBLIC_ENDPOINTS  = [...];  // No token required
var ADMIN_ENDPOINTS   = [...];  // Requires Firebase ID token AND admin role
var AUTH_ENDPOINTS    = [...];  // Requires Firebase ID token (any logged-in user)
```

### Key Endpoints

| Endpoint | Auth | What it does |
|---|---|---|
| `addDonation` | Admin | Adds a Bear Trap donation to the Sheet |
| `adminLog` | Admin | Fetches last 10 rows of the "Admin Log" sheet |
| `adminLinkAlt` | Public* | Links an alt Game ID to a player's Firebase profile via GAS secret |
| `verifyWosId` | Public | Looks up a WOS player ID via the Stove API |
| `lookupFull` | Public | Returns full player info from the Sheet |

*`adminLinkAlt` is called only from admin UI, but uses the GAS Firebase secret internally for security.

---

## Alt Account System

Alt accounts are stored in Firebase under the main account's user node:

```
/users/{uid}/linkedGameIds: ["12345", "67890"]
```

### Linking Flow (Admin)

1. Admin clicks "Add Alt Account" in the Player Database Editor
2. `window.adminLinkAltAccountPromptByChief(chiefName)` fires
3. It looks up the chief's Game ID from `window.nameToIdMap`
4. Calls `API_BASE_URL?api=adminLinkAlt&gameId=X&chiefName=Y&altGameId=Z`
5. GAS `adminLinkAlt` endpoint:
   - Fetches all `/users` via Firebase secret
   - Finds user whose `gameId` matches
   - If no user found: creates a stub at `/users/stub_{gameId}` (for unregistered players)
   - If user found: appends to their `linkedGameIds` array
6. Returns `{success: true}`

### Why Stubs Exist

Players appear in the WOS roster (Google Sheets) WITHOUT a registered website account. When an admin links an alt for such a player, there is no Firebase UID to write to. Solution: create `/users/stub_{gameId}` with `isStub: true`. If they later register, the UI merges stub alts into their real account during display.

### Displaying Alt Accounts

In `generatePlayerProfileHtml()`:
1. Fetch all `/users` from Firebase
2. Find the primary profile by matching `gameId`
3. Also find any `stub_{gameId}` profile
4. **Merge** `linkedGameIds` from BOTH profiles (real + stub)

---

## Deploying Changes

### Frontend (main.js, CSS, HTML)
```
git add .
git commit -m "vX.X.X : Description"
git push
```
GitHub Pages auto-deploys from `main` branch.

### Backend (any file in `wos/`)
```
cd wos/
npx @google/clasp push
npx @google/clasp deploy -i AKfycbzYCigf08Z5uAyd_YtTfbrNgA5rEDjyZDNJISaRJr_6XwsYks3hR-KpL9erL9w-bVI -d "vX.X.X - description"
```

`clasp push` updates the editor. The live Web App URL does NOT change until you run `clasp deploy`.

---

## Common Bugs Reference

| Symptom | Root Cause | Fix |
|---|---|---|
| "Add Alt Account" does nothing silently | `window.nameToIdMap` is undefined — module export not on window | Ensure `window.nameToIdMap = nameToIdMap` is at end of `refreshIdToNameMap()` |
| Admin alt-link "Permission denied" from Firebase | Client-side write to another user's Firebase node | Route through GAS `adminLinkAlt` endpoint |
| Admin Log shows "No activity found" | Trailing empty rows in Sheet; old loop hit hard limit | Use a loop that skips empty rows and breaks only when `limit` real entries found |
| Alt avatar upload fails silently | Code references undefined `uploadBtn` (it's a file input, not a button) | Remove `uploadBtn` refs from cropper save/cancel handlers |
| onclick handler can't find a function or map | Function/variable is in module scope, not on window | Add `window.myFn = myFn` at module level |
