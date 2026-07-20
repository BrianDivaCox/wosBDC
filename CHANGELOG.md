## [1.26.12] - 2026-07-20
- Fixed mobile responsiveness on the Staff page (added box-sizing to cards and stacked layout for small screens).

## [1.26.11] - 2026-07-20
- Fixed an issue where the root R5 admin was missing from the Staff page because they are hardcoded and not saved in the Firebase database list.

## [1.26.10] - 2026-07-20
- Staff page is now fully dynamic, pulling from the live admin list in Firebase.
- Enhanced the Staff page UI with more "pop" (glowing borders, elevated R5 prominence).

## [1.26.9] - 2026-07-20
- Added a new Staff page to showcase alliance leadership with dynamic glassmorphism trading cards.
- Added Staff navigation link to the main menu.

## [1.26.8] - 2026-07-20
- Added a dedicated Sign Out button to the user account sidebar menu.

## [1.26.7] - 2026-07-20
- Refactored Frost Clan Command Center to fetch all alliance activity tracking directly from the Frost Clan sheet instead of cross-referencing the Activity sheet.

## [1.26.5] - 2026-07-20
- Fixed an issue where the Frost Clan dashboard failed to load due to a typo in the Google Sheet name referenced by the backend API.
- Updated frontend API_BASE_URL to point to the patched Apps Script deployment.

## [1.26.4] - 2026-07-20
- Restricted Frost Clan Command Center tab visibility exclusively to the root admin account.

## [1.26.3] - 2026-07-20
- Integrated Frost Clan Command Center into the Admin Hub.
- Added secure backend endpoints to view and manage Frost Clan shields and tomes.

## [1.26.2] - 2026-07-20
- Added Forgot Password link and functionality to the auth modal.
- Replaced native datalist with a custom autocomplete dropdown in Bear Trap popup.
- Adjusted UI flex scaling for the Bear Trap popup.

# WOS Community Portal - Changelog

## v1.26.0 - 2026-07-19
- **Admin Panel Security Overhaul**: Removed the buggy OTP email system that was exhausting Google Apps Script quotas. The Admin Panel is now exclusively locked behind **Google Sign-In**. This leverages Google's built-in 2FA, brute-force protection, and session management. If an Admin signs in with an Email and Password, they will be politely asked to log out and use the "Sign in with Google" button to access the panel.

## v1.25.0 - 2026-07-19
- **Site Audit & Polish**:
  - **Custom Modals**: Replaced all native browser popups (`alert`, `confirm`, `prompt`) with premium, styled custom modals (`window.customPrompt`, `window.customAlert`, `window.customConfirm`) for a unified aesthetic experience. Most minor errors now use Toast notifications.
  - **Account Deletion Fix**: Added a direct "Delete Account" action to the Admin Users tab. This safely purges rogue users from the Firebase authentication system if they managed to register but don't exist on the main Google Sheet roster.
  - **Instant UI Reloads**: Added the instant-reload mechanism to Alt Account Linking/Unlinking, so your view refreshes immediately after connecting or disconnecting an Alt without a manual page refresh.

## v1.24.75 - 2026-07-19
- **Instant Admin UI Updates**: When an R5 grants or revokes an Admin Badge from another player's profile card, the profile card now instantaneously redraws to reflect the new badge (or removal thereof) without needing a page refresh.

## v1.24.74 - 2026-07-19
- **Admin Grant/Revoke Safety**: The confirmation popups when granting or revoking Admin Privileges now explicitly display the player's Chief Name alongside their Game ID to prevent accidental clicks on the wrong account.

## v1.24.73 - 2026-07-19
- **Admin Menu Updates**: Renamed "Admin Tools" / "Admin Control Panel" to "Admin Menu" across the dashboard to better align with its purpose. Also fixed a bug that prevented the Player Database Editor from opening after a recent security update.

## v1.24.72 - 2026-07-19
- **Time Active Polish**: The "Time Active" formatter now intelligently strips out any `0` values (e.g. `0y`, `0m`, `0d`) to keep the display as clean and minimal as possible (e.g. `4m 0d` becomes just `4m`).

## v1.24.71 - 2026-07-19
- **Time Active Formatting**: Standardized the "Time Active" display on the Account Hub for both main accounts and Alt accounts to use a short, lowercase format (e.g. `1y 1m 3d`) instead of raw verbose spreadsheet output.

## v1.24.70 - 2026-07-19
- **Player Lookup Polish**: Increased the size of the Fire Crystal icon in the Player Profile header badges to match the visual prominence of the Account Hub.

## v1.24.69 - 2026-07-19
- **Alt Account Stats Fix**: Fixed a bug on the Account Hub where Alt Accounts were correctly matching against the Master Roster, but failing to visually pull their Furnace Level and Time Active stats onto their Alt Cards.

## v1.24.68 - 2026-07-19
- **Account Hub Polish**: Increased the size and prominence of the Fire Crystal icon and Furnace Level text on the main Account Hub ID card.

## v1.24.67 - 2026-07-19
- **Premium Player Database Editor Search**: Applied the same custom-built, premium autocomplete dropdown menu from the Player Lookup tool to the Admin Player Database Editor for a consistent, seamless experience.

## v1.24.66 - 2026-07-19
- **Premium Player Lookup**: Completely replaced the generic browser dropdown on the Player Lookup search box with a custom-built, premium autocomplete dropdown menu. The list now only appears when you start typing, filtering results instantly with a modern look and feel.

## v1.24.65 - 2026-07-19
- **API Disconnect Fix**: Corrected a critical backend disconnection where the frontend was pointing to an older deployment of the API, causing the OTP code to fail with "Error: undefined".

## v1.24.64 - 2026-07-19
- **Admin Panel 2FA Lock**: The Admin Panel now correctly displays the OTP Security Check screen instead of just a blank page when a session is locked.
- **Login Bug Fix**: Fixed a critical syntax issue that caused buttons like Google Sign-In and Admin Menu to become unresponsive.

## v1.24.63 - 2026-07-19
- **Login Notification Fix**: The "Successfully signed in" alert has been updated to automatically disappear after a few seconds instead of staying stuck on the screen until manually closed.

## v1.24.61 - 2026-07-19
- **Google Sign-In Date Prompt**: New users registering via Google Sign-In are now prompted to enter the date they started playing WOS so it accurately tracks in the Account Hub.

## v1.24.60 - 2026-07-19
- **Google Sign-In**: Added a "Continue with Google" button to the login and registration screen for a seamless authentication experience. Existing users who registered using their Google email and a password can use this button to automatically merge their accounts and log in. New users will be prompted for their Game ID upon first sign-in to complete their registration.

## v1.24.59 - 2026-07-19
- **Admin 2FA Security**: The Admin Panel is now protected by an Email OTP system. Admins must enter a 6-digit code sent to their registered email to unlock their session (valid for 2 hours). This protection is enforced directly at the Firebase Rules and Google Apps Script level, making it impossible to bypass even if a password is compromised.

## v1.24.58 - 2026-07-19
- **Firebase Account Deletion**: The "Delete Player" button now additionally hunts down and permanently deletes the player's Firebase Account Profile (Avatar, Bio, etc.) and instantly removes their Player Card from the dashboard without waiting for the nightly sync.

## v1.24.57 - 2026-07-19
- **Hotfix**: Improved the ghost-row cleanup logic. The automated cleanup tool now correctly identifies empty checkboxes and formula `#N/A` errors as ghost-rows and scrubs them properly.

## v1.24.56 - 2026-07-19
- **Admin Tools Update**: Added a new "Delete Player" button to the website's Admin Panel. Admins can now securely delete a player directly from the website without opening Google Sheets.
- **Automated Ghost Row Cleanup**: Integrated a nightly silent cleanup script (`cleanUpEmptyRowsSilent`) to the 1:00 AM auto-sync. It will automatically sweep all formatted sheets and remove empty rows to keep the footers correctly positioned.

## [1.24.55] - 2026-07-19
### Fixed
- **Registration**: Fixed a typo in the internal sheet targeting logic where the "Polar Terrors" sheet was misspelled as "Polar Terror". This typo caused the script to completely skip inserting a row in that specific sheet, which in turn caused its top-level array formula to hit the bottom border/footer and crash with a `#REF!` error. The spelling has been corrected and the sheet will now receive its rows normally.

## [1.24.54] - 2026-07-19
### Fixed
- **Registration**: Fixed a severe bug where the global row insertion script would accidentally copy the physical 'FALSE' state of checkboxes or placeholder text from the row above into the new row. This blocked ArrayFormulas (like `=FILTER`) from spilling into the row, resulting in `#REF!` errors. The script now intelligently scans the newly inserted row and instantly clears any cell that does not contain a per-row formula (like `=IF` or `=RANK`), resetting checkboxes to blank and fully unblocking ArrayFormulas.

## [1.24.53] - 2026-07-19
### Fixed
- **Changelog**: Fixed a bug where the UI was still attempting to fetch `CHANGELOG.md` from the deprecated `BrianDivaCox/wosBDC` repository. Updated the fetch URL to point to the new `wosbdc/wosBDC.github.io` organization repository.

## [1.24.52] - 2026-07-19
### Fixed
- **Registration**: Fixed a bug where registering an existing player failed silently. The system now accurately detects duplicates and repurposes the registration flow as a "Level Updater", cleanly overwriting the player's old Furnace Level in Column C of `Chief's List` with the newly verified API level. Also fixed a bug where brand new players were missing their Furnace Level.

## [1.24.51] - 2026-07-19
### Changed
- **Registration**: Implemented global row insertion across all 10 major Google Sheets. When the table becomes full, the system automatically inserts a new row strictly 2 rows from the bottom (pushing the footer down) and cleanly inherits all complex visual formatting, data validation, and array formulas.

## [1.24.50] - 2026-07-19
### Fixed
- **UI Alerts**: Reprogrammed Toast notifications to allow auto-dismiss logic (5s timeout) for generic tasks. Critical data-mutating tasks (Bear Trap additions, crowning champions, editing player stats) correctly persist on screen and must be manually dismissed, ensuring no important changes are missed.

## [1.24.49] - 2026-07-19
### Fixed
- **Registration**: Implemented dynamic capacity bounds-checking during registration. If `giftcodebot` lacks physical rows to store new players, the system will programmatically expand the sheet via `getMaxRows()` tracking to prevent silent out-of-bounds `insertRow()` errors.

## [1.24.48] - 2026-07-19
### Changed
- **API Migration**: Fully migrated frontend endpoints to hit the newly deployed Google Apps Script (v81) to pick up the registration bug fixes.
- **Frontend Build Pipeline**: Reconfigured Vite to deploy `index.html` assets directly to the root domain (`wosbdc.github.io`) instead of forcing the `/wosBDC/` sub-path.
- **Hosting**: Successfully migrated the repository and Github Pages live hosting exclusively over to the `wosbdc` Github organization.

## [1.24.47] - 2026-07-18
### Fixed
- **Admin Panel**: Fixed incorrect Vercel Usage Dashboard URL.

## [1.24.46] - 2026-07-18
### Added
- **Admin Panel**: New ⚡ System tab (R5 only) with two sections: (1) A live proxy status card showing online/offline state, self-tracked request count since last cold start, and response latency. (2) Direct one-click buttons to the Vercel Usage Dashboard, Project page, and Live Logs.
- **Vercel Proxy**: Added `/api/stats` endpoint that returns self-tracked invocation count and links to official dashboards.

## [1.24.45] - 2026-07-18
### Changed
- **Infrastructure**: Migrated all Century Games Game ID verification calls off Google Apps Script and onto a dedicated free Vercel proxy (`wos-vercel-proxy.vercel.app`). Google Apps Script now exclusively handles Google Sheets operations. This completely separates concerns and eliminates any possibility of ID verification hitting Google's daily quota limits.

## [1.24.44] - 2026-07-18
### Added
- **Frontend**: Added a manual fallback override for Game ID verification. If your Google Account exhausts its daily 20,000 API requests limit (or if the Century Games API goes down), the "Verify" button will now gracefully fail and display manual input fields so you can still type in your Chief Name and Furnace Level by hand to successfully register!

## [1.24.43] - 2026-07-18
### Fixed
- **Frontend**: Removed the native up/down spinner arrows that some browsers added to the Game ID input box on the signup form, which are useless and confusing for typing an ID.

## [1.24.42] - 2026-07-18
### Changed
- **Frontend**: Added a manual "Verify" button next to the Game ID input on the signup form. The website will no longer try to verify the Game ID while you are typing; it will only connect to the Century Games API when you explicitly click the Verify button. This completely eliminates all rate limiting and typing lag.

## [1.24.41] - 2026-07-18
### Fixed
- **Frontend**: Greatly reduced the chance of exhausting the Century Games API rate limit by only attempting to look up Game IDs that are at least 7 digits long. This prevents the website from pinging the game servers for invalid partial numbers while you are still typing your ID.

## [1.24.40] - 2026-07-18
### Fixed
- **Frontend**: Fixed an asynchronous race condition on the signup form where typing your Game ID too quickly could cause an older API request for a partial/invalid ID to overwrite the successful response of your full ID.

## [1.24.39] - 2026-07-18
### Changed
- **Backend API**: The new signup flow will now ONLY insert the Chief Name into the `Chief's List` sheet, leaving all other columns blank so that your Google Sheet formulas can safely pull the data from `giftcodebot` without being permanently overwritten by hardcoded values.

## [1.24.38] - 2026-07-18
### Fixed
- **Backend API**: Completely replaced the `appendRow` Google Sheets function with an intelligent search that finds the true first empty row in the list to prevent Google Sheets from inserting new signups thousands of rows down the page if there are blank formatted rows.

## [1.24.37] - 2026-07-18
### Fixed
- **Frontend**: Fixed a CORS network error that caused new signups to fail to write to the Google Sheets.

## [1.24.36] - 2026-07-18
### Fixed
- **Frontend**: Fixed a case sensitivity bug that caused the Account Hub to fail to pull Furnace Level and Time Active stats if the casing of the user's name on Century Games API didn't exactly match the casing in the Google Sheet.

## [1.24.35] - 2026-07-18
### Fixed
- **Backend API**: Fixed a bug where registering a new account or enrolling an alt account was placing the Date Started into the Gift Codes column on the Google Sheet.
- **Backend API**: Fixed an issue where duplicate checks on the GiftCodeBot sheet prevented new signups from properly updating the Chief's List in Google Sheets.
- **Frontend**: Updated API_BASE_URL to point to the newly deployed backend script.

## [1.24.34] - 2026-07-18
### Changed
- **Registration**: Removed the manual "Chief Name" input box during signup. The system now fully relies on the verified Chief Name pulled directly from the Game ID validation API.
- **Registration**: Added a clear "Date You Started Playing" label above the date picker to improve clarity on iOS and desktop browsers.

## [1.24.33] - 2026-07-18
### Changed
- **Navigation**: Removed the calendar emoji from the Schedule link in the navigation bar for a cleaner look.

## [1.24.32] - 2026-07-18
### Changed
- **Schedule**: Merged the "Calendar View" and "Today's Schedule" pages into a single unified "Event Schedule" page.
- **Schedule**: Added a toggle pill button at the top to instantly switch between "Today's View" and "Calendar View" without reloading the page.
- **Schedule**: The site now remembers your preferred schedule view tab and automatically loads it next time you visit.
- **Navigation**: Removed the dropdown submenu for Schedule since everything is now available from a single page.

## [1.24.31] - 2026-07-18
### Added
- **Privacy - Root Admin Alt Accounts**: R4 admins can no longer see the root admin's (BrianDCox) linked alt accounts in the Player Database Editor. The alt accounts section is silently hidden when an R4 views the root admin's profile — the data is never even sent to the HTML renderer. R5 (root admin) can still see all alt accounts as normal.

## [1.24.30] - 2026-07-18
### Added
- **Global Timers - Inte Reset**: Added new ⚡ Inte Reset countdown timer (resets at UTC 00:00, 08:00, 16:00). Shows time remaining until next reset with a sub-line displaying the next reset time in the user's local timezone — works correctly for every timezone automatically.
- **Global Timers - Daily Reset**: Added matching "Next: [date] [time] local" sub-line to the Daily Reset timer for consistency.
### Changed
- **Global Timers Widget**: Redesigned the entire Global Timers sidebar widget to use flexbox (no more `float:right`) for correct rendering on smartphones. Timer cards now use colored accent borders (blue for Daily Reset, orange for Inte Reset) with monospace font for the countdowns.

## [1.24.29] - 2026-07-18
### Fixed
- **Account Hub - Alt Cards**: Removed the fire emoji 🔥 and "Lv" text from the furnace level display — now shows just the FC icon image (for Fire Crystal levels) or the plain number (for lower levels).
- **Account Hub - Alt Cards**: Time Active now uses the short format (e.g. `8M 3D`) instead of the raw full string (e.g. `8 months, 3 days`).

## [1.24.28] - 2026-07-18
### Changed
- **Account Hub - Alt Accounts**: Upgraded the Linked Alt Accounts section to use the same premium dark glassmorphism card design as the Player Database Editor. Cards now feature a 70px cyan-glowing avatar, bold white name/ID text, furnace flame icon with label, timer icon with Time Active label, and properly styled Enable Perks / UNLINK buttons. Layout changed from a single-column flex list to a responsive grid.

## [1.24.27] - 2026-07-17
### Fixed
- **CRITICAL - Add Alt Account root cause**: `window.nameToIdMap` was never actually assigned to the `window` object. Since `main.js` is an ES Module, all `export let` variables live in module scope — invisible to inline `onclick` handlers. `adminLinkAltAccountPromptByChief` was silently bailing immediately because `window.nameToIdMap[chiefName]` was always `undefined`. Fixed by assigning `window.nameToIdMap = nameToIdMap` and `window.idToNameMap = idToNameMap` at the end of `refreshIdToNameMap()`.
### Added
- `ARCHITECTURE.md` — comprehensive documentation of the full stack, ES module gotchas, Firebase security rules and the GAS bypass pattern, alt account linking flow, deployment instructions, and a common bugs reference table.

## [1.24.26] - 2026-07-17
### Fixed
- **Admin Log**: Fixed an issue where the Multi-BT Donations Admin Log would display "No activity found" if the Google Sheet had trailing empty rows.
- **Alt Account UI**: Fixed a bug where uploading a profile picture for an Alt Account would fail silently because it was referencing an undefined upload button.

## [1.24.25] - 2026-07-17
### Fixed
- **Admin Panel Bug**: Fixed a core "Permission denied" error when an Admin tried linking an Alt Account to another user. Firebase Security Rules completely blocked Admins from writing to other users' profiles, so the linkage was failing silently or throwing a red alert. I built a custom Google Apps Script endpoint to securely bypass these rules, allowing Admins to link Alts seamlessly.

## [1.24.24] - 2026-07-17
### Fixed
- **Alt Account UI**: Fixed a bug where Alt Accounts would stop showing up if an admin linked an Alt Account to a "stub" profile, and then the user later registered a real account on the website. The UI now intelligently merges Alts across all profiles matching the user's Game ID to ensure no data is lost.

## [1.24.23] - 2026-07-17
### Changed
- **Admin Panel**: Allowed Admins to link Alt Accounts to players who have not yet registered a website profile by automatically generating a "stub" profile for them in the Firebase database.

## [1.24.22] - 2026-07-17
### Fixed
- **Admin Panel Bug**: Fixed a crash in the Player Database Editor where the "Add Alt Account" button in the Action Menu would fail due to calling a global window function that was only imported locally.

## [1.24.21] - 2026-07-17
### Fixed
- **Personal Hub UI**: Changed the text color of the "Time Active" stats on Personal Hub Alt Cards from muted gray to bright white (`var(--text-main)`) with bold weighting to match the Furnace Level display.

## [1.24.20] - 2026-07-17
### Fixed
- **Personal Hub UI**: Reverted the shorthand "Time Active" formatter (e.g. 8M 3D) in the Personal Hub's Alt Accounts section back to the long form, keeping the shorthand format strictly isolated to the Admin Player Database Editor as requested.

## [1.24.19] - 2026-07-17
### Changed
- **Alt Account UI**: Formatted "Time Active" stats on Alt Cards into short-hand (e.g., "8 months, 3 days" to "8M 3D") to save horizontal space and create a cleaner look.

## [1.24.18] - 2026-07-17
### Changed
- **Fire Crystal Icons**: Globally hid the redundant text number for players above Furnace Level 30 (Fire Crystal levels), allowing the official 3D FC game icons to stand alone.

## [1.24.17] - 2026-07-17
### Changed
- **Alt Account UI**: Stripped the redundant fire emoji ("🔥") and the "Lv" text from the Furnace Level display on Alt Cards to make it cleaner, since the orange furnace icon is already present.
- **Alt Account UI**: Updated the green Enrolled badge text to say "Code Enrolled".

## [1.24.16] - 2026-07-17
### Fixed
- **Alt Account Stats Bug**: Fixed a bug where Alt Cards in the Player Database Editor were not displaying Furnace Level or Time Active due to a broken map lookup. Alt Cards now properly query the Chief's List for data, and dynamically fetch Furnace Levels straight from the Century Games API if the alt account hasn't been synced to the roster yet.

## [1.24.15] - 2026-07-17
### Added
- **Alt Account Management UI**: Completely redesigned the Alt Accounts section within the Player Database Editor to use a stunning glassmorphism card design based on the recent mockup.
- **Unlink Alt Account Feature**: Added a fully functional "Unlink" button to the new Alt Cards that allows admins to permanently sever the link between a main account and an alt account in the database.

## [1.24.14] - 2026-07-17
### Changed
- **Admin Panel UI Cleanup**: Restyled the Daily Tools tab in the Admin Panel to neatly stack the "Open Multi-BT Donations" and "Open Player Database Editor" buttons into a cleaner vertical layout, removing unnecessary descriptive text.
- **Alt Accounts Privacy**: The Alt Accounts list/badge is now hidden on the main public Chief's List. It is now exclusively visible within the Player Database Editor in the Admin Panel.

## [1.24.13] - 2026-07-17
### Fixed
- **Admin Panel & Firebase Database Crashes**: Fixed a critical bug where replacing `db` with `window.firebaseDb` across the codebase resulted in an undefined reference error (`Cannot read properties of undefined (reading '_checkNotDeleted')`), completely breaking the Admin Panel and Database Editor. Reverted all calls to use the properly scoped `db` module import.

## [1.24.12] - 2026-07-17
### Added
- **Dedicated Player Database Editor View**: Extracted the Player Database Editor from the Admin Panel dashboard into its own spacious, full-screen view (similar to the Multi-BT Donations feature). This provides significantly more room for managing player profiles and alt accounts.
### Fixed
- **Player Editor Search Checkmarks**: Fixed a bug where the green checkmarks (`✅`) were not properly displaying next to registered users in the Player Database Editor's dropdown menu.

## [1.24.11] - 2026-07-17
### Fixed
- **Roster Page Crash**: Hotfixed a JavaScript reference error (`window.idToNameMap` undefined) that broke the public Roster page when attempting to render Alt Account badges.

## [1.24.10] - 2026-07-17
### Changed
- **Alt Account Management Refactored**:
  - Removed the `+ Add Alt` button and collapsible Alt Account rows from the Admin Panel's "Users" list to significantly reduce clutter.
  - The "Users" list still displays the total number of linked Alt Accounts (e.g., `3 Alt(s)`) next to the chief's name.
  - Moved the `➕ Add Alt Account` button to the `⚙️ Actions` dropdown menu in the Universal Player Editor.
  - The Universal Player Editor's profile card now explicitly lists the total number of Alt Accounts and their names underneath the main badges.
  - The "Search Chief Name" dropdown in the Player Database Editor now displays a green checkmark (`✅`) next to chiefs who are already registered in the system.

## [1.24.9] - 2026-07-17
### Fixed
- **Admin Permissions Bug**: Fixed an issue where Firebase Database Security Rules were blocking Admins from adding Alt accounts to other players. Admins now have the proper database write access to modify user profiles and delete avatars.

## [1.24.8] - 2026-07-17
### Added
- **Admin User List**: Added the requested `Furnace Level`, `Giftcode Enrolled` tag, and `Time Active` (years in service) stats directly to the Users tab in the Admin Panel. These badges now appear next to the Chief Name for both Main and Alt accounts!

## [1.24.7] - 2026-07-17
### Changed
- **Account Hub Styling**: Changed the text color for Furnace Level and Time Active values from pink to white to match the styling of the Game ID.

## [1.24.6] - 2026-07-17
### Fixed
- **Admin Panel UI**: Fixed an issue in the Multi-Bear Donations form where the Amount box was being pushed off the screen on smaller smartphones.

## [1.24.5] - 2026-07-17
### Fixed
- **Alt Account Stats Bug**: Fixed a severe typo where the website was looking for Alt Account stats in a non-existent database tab called "Roster", rather than the actual "Chief's List" tab. Alt stats will now pull perfectly from the database again!

## [1.24.4] - 2026-07-17
### Added
- **Dynamic Alt Stats Fetching**: If an Alt Account is not actively tracked on the Master Roster spreadsheet, the Account Hub will now dynamically reach out to the official White Out Survival servers and fetch their live Furnace Level on the fly!

## [1.24.3] - 2026-07-17
### Fixed
- **Alt Account Stats Lookup**: Fixed an issue where Furnace Level and Time Active showed as "N/A" for Alt Accounts because the name matching occasionally failed. Rebuilt the system to look up stats using the bulletproof Game ID numeric identifier instead.

## [1.24.1] - 2026-07-17
### Fixed
- **Account Hub Crash**: Fixed a critical bug where the Account Hub would fail to load if it couldn't correctly reference the Roster data map.

## [1.24.0] - 2026-07-17
### Added
- **Alt Account Stats**: Alt accounts now beautifully display their Furnace Level and Time Active (pulled directly from the Chief's Roster) directly within the Account Hub.
- **Alt Cards UI**: Upgraded the linked Alt accounts list from simple rows into sleek, two-tier "Cards". This prevents stats and buttons from smashing together on smaller screens.

## [1.23.0] - 2026-07-17
### Added
- **Admin Alt Linking**: Added a convenient "+ Add Alt" button to the Universal Player Editor, allowing admins to manually pair Alt Game IDs directly to a player's main profile.
- **Smart Sync Logs**: The Live Database Sync Status panel now filters out old archive sheets and only displays syncs that occurred today, keeping the log clean and relevant.

### Changed
- **Main Avatar UI Refactor**: Removed the bulky "Profile Picture" section from the Account Hub to save vertical space. The main account avatar now uses the same sleek, clickable hover-to-edit interface as the alt accounts.

## [1.22.0] - 2026-07-17
### Added
- **Alt Account Custom Avatars**: Users can now upload custom profile pictures specifically for their linked alt accounts! Added a smooth hover edit icon over alt avatars in the Account Hub.
- **Smart Image Routing**: The avatar upload system now tracks which account (Main or Alt) is being targeted and seamlessly routes the new picture to the correct database profile while instantly live-updating the UI.

## [1.21.0] - 2026-07-17
### Added
- **Multiple Alt Accounts Support**: Completely removed the restriction of linking only 1 alt account. Users can now link an unlimited number of alt accounts to their main profile.
- **Smart Alt Selection**: Streamlined the alt account linking process by replacing the manual Game ID textbox with a searchable dropdown. Users can now simply type their alt's name to link it instantly.
- **Account Hub Revamp**: The Linked Alt Accounts section in the Account Hub now properly scales to display all linked alt accounts neatly, complete with avatars, individual status badges, and management options.

## [1.20.14] - 2026-07-17
### Changed
- **UI Notifications**: Routine success toasts (like Schedule Refreshed, Enrolled, Added Donation) will now auto-dismiss after a few seconds instead of requiring a manual click. Critical notifications like "Updates complete!" remain sticky.

## [1.20.13] - 2026-07-17
### Fixed
- **Calendar Schedule Header Bug**: Fixed a persistent crash in the Calendar View where custom text in the date headers (like "Today Thu 7/16") caused the date parser to fail and throw a "Could not find dates" error.

## [1.20.12] - 2026-07-17
### Fixed
- **Calendar Schedule View**: Fixed a bug where the full calendar view would fail to render and show a "Could not find dates" error due to the new compressed `M/D` date format deployed in the Firebase sync.

## [1.20.11] - 2026-07-17
### Changed
- **Countdown Formatting**: The home page countdown widget now cleanly omits unnecessary leading zeros (e.g. `5h 06m` instead of `05h 06m`) and will hide the hours entirely when it drops below 1 hour.

## [1.20.10] - 2026-07-17
### Changed
- **Home Widget Countdown Styling**: Styled the home page countdown widget so the numbers pop in the accent color, while the letters (h, m, s) seamlessly blend in using the active theme's text color.

## [1.20.9] - 2026-07-17
### Added
- **Site Favicon**: Replaced the default browser tab icon with a snowflake emoji (❄️) to match the dashboard navbar logo and improve brand recognition.

## [1.20.8] - 2026-07-17
### Added
- **Popup Color Coding**: The search results in the Rewards Editor popup are now color-coded for quick identification: Green (Active/Upcoming), Red (Expired), and Yellow (No dates set).

## [1.20.7] - 2026-07-17
### Changed
- **Popup UI Polish**: The Rewards Editor popup now hides the massive list of events entirely when it first opens, presenting a cleaner interface. The list only appears once you begin typing in the search box.

## [1.20.6] - 2026-07-17
### Added
- **Set Today Buttons**: Added clickable "TODAY" buttons above the start and end date inputs in the Rewards Editor popup for instant date assignment.

## [1.20.5] - 2026-07-17
### Added
- **Search-As-You-Type**: The new Rewards & Events Editor popup now has a live search box at the top, allowing you to instantly filter through all events and rewards without scrolling through the Google Sheet.
- **Auto-Date Fill**: When you click an event or reward in the popup that doesn't have dates set yet, it will now automatically pre-fill the start and end boxes with today's date for you.

## [1.20.4] - 2026-07-17
### Added
- **Admin Rewards Popup**: Converted the Google Sheets "Rewards & Events Editor" from a narrow side panel into a spacious 750x650 popup Modal Dialog to give admins much more screen real estate when editing events.
### Changed
- **Script Cleanup**: Combined old one-off data migration scripts into a single `Archived_Scripts.js` file to declutter the Google Apps Script project.

## [1.20.3] - 2026-07-17
### Fixed
- **Home Page Upcoming Widget missing**: The same date-format parsing bug that affected the main schedule view also caused the home page countdown widget to silently skip all events (it was only looking for ISO timestamps instead of the new `M/D` plain text format). Upgraded the `upcomingEvents` parser in the `home` view to handle both formats.

## [1.20.2] - 2026-07-17
### Fixed
- **Schedule displaying nothing**: Firebase changed how it syncs the WhiteOut Survival sheet — dates shifted from ISO timestamp format (`2026-07-17T07:00:00.000Z`) to plain text (`7/17`) and times from ISO to `16:00`. The event parser was checking for ISO timestamps exclusively, so every row was silently skipped. Rewrote the parser to handle both formats: `M/D` dates, `HH:MM` UTC times, and legacy ISO timestamps for backward compatibility.

## [1.20.1] - 2026-07-17
### Fixed
- **Coming Up This Week missing**: The event parsing loop was breaking immediately on the first row because it contained the header text "Event's" in column F. Changed `break` → `continue` for blank/header rows so they are skipped instead of stopping the loop entirely. Only the "Rewards" row now triggers a `break` (correctly marking the end of the events section).
- **Refresh button loaded calendar view**: The Refresh button was calling `window.refreshSchedule` which belongs to the weekly Event Schedule (calendar) view, not Today's Schedule. Fixed by defining a dedicated `window.refreshTodaysSchedule` function inside the `todays_schedule` view that properly clears the WhiteOut Survival cache and reloads the card.

## [1.20.0] - 2026-07-17
### Added / Redesigned
- **Today's Schedule — Full Redesign**: Replaced the old two-table layout with a single unified premium card.
  - **⏰ Events Today**: Timed events for today shown as styled rows with UTC time, your local time, and a live countdown timer (e.g. "in 2h 15m" → "Now" → "Done").
  - **🎁 Rewards**: Active rewards for the week (Hero Rally, Journey Treasures, Lucky Wheel, etc.) shown as a bullet list — only rendered if data exists.
  - **📋 Sign-Ups**: Events requiring sign-up (Alliance Championship, Fortress Battle, etc.) — only rendered if data exists.
  - **📆 All Week**: All-week events shown as pill badges — only rendered if data exists.
  - **🎉 Holidays**: In-game holiday events — only rendered if data exists and value is not "No Events".
  - **📅 Coming Up This Week**: Future timed events with date, UTC, and local time — always visible when upcoming events exist.
  - **Rest Day message**: If no timed events are scheduled today, shows "🎉 Rest day — no timed events today!" instead of an empty section.
  - **Empty sections hidden**: Any section with no data (or only "No Events" text) is completely hidden from the UI.
  - **Live countdown timers**: Update every 30 seconds automatically without page reload.
  - **Card design**: Single glassmorphism card with accent top border, color-coded section pills, and smooth fade-in animation.

## [1.19.4] - 2026-07-16
### Improved
- **Sticky Toast Notifications**: Success and error toasts now stay on screen until you click the ✕ button. Previously they auto-dismissed after 3 seconds, which could cause you to miss important confirmations (e.g. "Player updated", "Donation added", "Bear Trap winner crowned"). Loading/status toasts (info/accent type) still auto-dismiss after 5 seconds.
- **Fade-out Animation**: Auto-dismissing toasts now fade out smoothly instead of instantly disappearing.
- **Auto-dismiss timer**: Bumped from 3s → 5s for status toasts.

## [1.19.3] - 2026-07-16
### Fixed
- **Bear Trap Winner Crowning**: Fixed error "Player X not found in Bear Trap column" when crowning a winner who isn't already in the data sheet. The `addBearTrapEventWin` function now automatically adds the player to the next available slot in the data sheet before awarding the win — no manual pre-population needed.

## [1.19.2] - 2026-07-16
### Security
- **Tightened Firebase Database Rules**: The `config` node (admins list, maintenance mode, roster filter toggle) is now exclusively writable by the root admin account (Game ID 318843189). Previously any logged-in user could write to this node if they knew the database path.
- **Avatar Protection**: Users can now only write to their own Game ID's avatar slot — they can no longer overwrite another player's avatar.
- Rules validated and deployed to Firebase RTDB.

## [1.19.1] - 2026-07-15
### Fixed
- **Critical Auth Fix**: The Firebase ID Token verification in Google Apps Script was using the wrong Google API endpoint (`oauth2.googleapis.com/tokeninfo` is for Google OAuth2 tokens, not Firebase Auth tokens). Fixed to use the correct Firebase Identity Toolkit endpoint (`identitytoolkit.googleapis.com/v1/accounts:lookup`). All admin actions (add donation, update player, etc.) now work correctly for logged-in admins.
- **Frontend Auth Fix**: Replaced the unreliable dynamic `import('firebase/auth')` in `getAuthToken()` with a direct import of the `auth` instance exported from `firebase.js`, ensuring the token is always fetched from the correct initialized auth instance.

## [1.19.0] - 2026-07-15
### Security
- **A+ Security Upgrade: Removed hardcoded APP_SECRET from frontend code.** The secret key is no longer visible to anyone inspecting the website's source code.
- **Firebase ID Token Authentication**: All admin-only API calls (add donation, update player, update event, award Bear Trap win, view admin log) now require a valid Firebase Auth ID Token. Google Apps Script verifies the token against Google's Identity Toolkit and checks the caller's Game ID against the admin list in Firebase — all in real time, for free.
- **Role-Based Access Control**: Endpoints are now grouped into three tiers:
  - **Public** (no auth): `lookup`, `verifyWosId`, `lookupFull`
  - **Authenticated** (logged-in user required): `registerNewPlayer`
  - **Admin-only** (valid token + admin Game ID): `addDonation`, `updateFull`, `updateEvent`, `addBearTrapEventWin`, `adminLog`, `getSheetData`
- **GAS Redeployment**: Google Apps Script redeployed as version @69 with new secure `doGet` logic.

## [1.18.1] - 2026-07-15
### Fixed
- **Firebase Lockout Bug**: Fixed a critical issue where the new strict Firebase database rules unintentionally locked the dashboard frontend out of reading the Chief List, Schedules, and Admin data. Restored global read access to essential dashboard collections (`sheets`, `users`, `config`, etc.) while maintaining strict write protections.

## [1.18.0] - 2026-07-15
### Security
- Locked down Google Apps Script API endpoints by requiring a secret key for all GET and POST requests.
- Injected the secret key into all frontend fetch requests.
- Deployed strict Firebase Realtime Database security rules to prevent unauthorized data access.

## [1.16.6] - 2026-07-14
### Added
- Added a convenient red '✖' clear button to both the Main Site's Player Lookup search input and the Admin Panel's Player Database Editor search input. Clicking it instantly clears the search field, improving usability especially on mobile devices.




- Added visual 'R5' and 'R4' tier indicators next to the names of players in the Staff Roles list.

evokeAdmin where the application crashed with an "update is not defined" error when trying to remove admin privileges from a user.
- **UI Upgrade**: Replaced all native browser lert() and confirm() dialogs (which showed the ugly "briansdivacox.github.io says..." prefix) with a custom, beautifully styled animated modal matching the site's dark/glassmorphic aesthetic.

  - **R5 (Super Admin)**: Retains full access to Maintenance Mode, Global Alerts, Dev Mode, the Staff Roles list, and the Registered Users Database. R5s can now selectively grant other players R5 or R4 status.
  - **R4 (Event Admin)**: Granted access to the Universal Player Editor for daily chores (events, bear trap), but cannot access Maintenance Mode, push Global Alerts, view the registered users database, or grant/revoke admin status to others.
- **Admin Log Date Filters**: Added a new dropdown to the Admin Log to easily filter activity by 'Today', 'Yesterday', 'Last 7 Days', and 'All Time'.



## [1.15.40] - 2026-07-13
### Fixed
- **Fixed**: Resolved \"Service invoked too many times\" quota error for Firebase sync by implementing an emergency backend API fallback logic.
- **Fixed**: Leaderboard values appearing as \ \ due to Google Sheets formulas failing to evaluate before Firebase sync. Fixed by injecting \SpreadsheetApp.flush()\ in the GAS backend.
- **Fixed**: Admin Bear Trap UI dropdown arrow getting permanently deleted after clicking the Refresh button. Fixed by targeting the \content-area\ instead of the parent container when rendering refreshed activity logs.
- **Fixed**: Polar Terrors Activity showing old data from previous days by pointing it towards live API endpoint.
- **Added**: Added comprehensive \manual_sync.cjs\ Node.js script for admins to manually bypass Apps Script constraints and dump live Sheets data into Firebase instantly. 
- **Added**: Added a simple double-clickable \Emergency_Firebase_Sync.bat\ script for quick manual syncing, and mapped \
pm run emergency-sync\ in package.json.
- **Changed**: Lifted the API fallback mechanism and fully restored native Firebase Realtime syncing for the new day.


## [1.15.38] - 2026-07-13
### Added
- **Real-Time Log Fetching**: Added a direct API bridge to bypass Firebase entirely for admin tools. The "Admin Log" in the Admin Hub and the "Today's Activity" widget on the homepage now feature a manual "Refresh" button that fetches the absolute freshest data directly from the Google Sheet.

## [1.15.37] - 2026-07-13
### Fixed
- **API Endpoint Quota Limits**: Fixed an issue where the website's Admin Hub was throwing "Service invoked too many times" errors when editing player activity. The backend API endpoints were updated to use the new Batched Sync queue instead of instantaneous pushes, bypassing the daily API quota completely.

## [1.15.36] - 2026-07-13
### Fixed
- **Theme Menu Readability**: Fixed an issue where the text on the theme selection cards became unreadable depending on the currently active global theme. Each theme card now has a permanent, hardcoded background and text color that acts as a mini-preview of the theme it represents.

## [1.15.35] - 2026-07-13
### Removed
- **Unused Themes**: Removed OLED, Mermaid, Forest, and Beta themes to streamline the settings menu. Only Light, Midnight, and Diva themes remain.

## [1.15.34] - 2026-07-13
### Changed
- **UI Tweaks**: Changed the Account Hub nav button text to "[Chief Name]'s Profile" instead of just the chief's name, making it clearer that the button is a clickable menu for accessing the Account Hub.

## [1.15.33] - 2026-07-13
### Fixed
- **All-Time BT Donations Fallback**: Fixed an issue where players who were not in the Top 4 All-Time Bear Donations leaderboard showed as having 0 All-Time donations. A new Google Apps Script was deployed to inject an automatic summing formula into the Google Sheet to calculate the true All-Time total from Activity History, and the frontend logic was updated to use this new column as a fallback.

## [1.15.32] - 2026-07-13
### Fixed
- **BT Donations Parsing**: Fixed an issue where the All-Time Bear Trap Donations rank/score showed up as 0. The leaderboard parser was strictly looking for the phrase "bear donations", but the tab in the spreadsheet is named "Bear Trap Donations" (or "BT Donations"), causing the text-match to fail. It now intelligently matches any variation of Bear Trap/BT Donations.

## [1.15.31] - 2026-07-13
### Fixed
- **Account Hub Mobile Overflow**: Added missing `box-sizing: border-box` rule to the Player ID Card to prevent it from horizontally overflowing the screen boundaries on mobile devices. The card now perfectly respects the smartphone viewport boundaries just like the Upcoming Event widgets.

## [1.15.30] - 2026-07-13
### Changed
- **Account Hub Polish**: Shrunk the overall padding, avatar size, and gap spacing inside the Player ID Card so it looks like a sleek, compact badge rather than an oversized bulky box.

## [1.15.29] - 2026-07-13
### Changed
- **Mobile Responsiveness**: Adjusted the new Player ID Card in the Account Hub to elegantly resize and wrap elements on small smartphones, preventing layout breakage or text clipping.

## [1.15.28] - 2026-07-13
### Changed
- **Account Hub Redesign**: Transformed the Account Hub into a premium "Player ID Card". It now displays the player's Avatar, Game ID, Joined Date, Time Active tag, and Giftcode Bot link status in a sleek, glassmorphic layout.

## [1.15.27] - 2026-07-13
### Fixed
- **Backend Firebase Sync**: Fixed a core backend issue where Google Apps Script was correctly updating event sheets but failing to push the recalculated `activity` master sheet to Firebase. The website Player Cards will now correctly show the updated statuses without relying on the daily 1 AM scheduled sync.

## [1.15.26] - 2026-07-13
### Fixed
- **Admin Panel UI Sync Bug**: Fixed an issue in the Admin Panel where clicking to update a player's missed event (or Bear Trap donation) would instantly refresh their UI card *before* the backend had finished syncing the new data to Firebase. The UI now intelligently waits 3 seconds for the cloud database to finish synchronizing before reloading the player's card, guaranteeing the new changes are visible.


## [1.15.25] - 2026-07-13
### Changed
- **Player Lookup**: Upgraded the Player Lookup tool (in the Admin panel and User Roster). Replaced the slow, clunky dropdown menu with a lightning-fast Autocomplete Search bar. The UI now filters players instantly as you type and automatically loads their profile when selected.


## [1.15.24] - 2026-07-13
### Changed
- **Enrollment UI Polish**: Cleaned up the Main Account "Already Enrolled" confirmation view. Removed the giant redundant green checkmark emoji and replaced the Game ID display with the Chief's name for a cleaner, more personalized aesthetic.


## [1.15.23] - 2026-07-13
### Fixed
- **UI Race Condition**: Fixed a bug where fast-loading browsers would render the Account Hub page *before* the enrollment data finished downloading from Firebase, causing the "Enable Perks" button to appear instead of the "Enrolled" badge. The UI now dynamically re-checks the live database cache when rendering.


## [1.15.22] - 2026-07-13
### Fixed
- **Enrolled Badge UI Bug**: Fixed a frontend UI bug introduced in `v1.15.20` where the logic to hide the "Enable Perks" button and display the "Enrolled" badge failed to apply correctly due to a string escaping error during deployment.


## [1.15.21] - 2026-07-13
### Fixed
- **GAS Firebase Sync Bug**: Fixed a backend bug where the Google Apps Script was correctly inserting players into the `giftcodebot` spreadsheet, but failing to push those updates to the Firebase cache. This caused the website to temporarily think players weren't enrolled until a manual spreadsheet edit occurred. The backend now instantly syncs to Firebase.


## [1.15.20] - 2026-07-13
### Changed
- **Auto-Detect Enrolled Status**: The Account Hub and the main Perks page now automatically scan the `giftcodebot` spreadsheet when the Dashboard loads. If a player (or their Linked Alt Account) is already actively enrolled in Auto Redeem, the system will completely hide the "Enable Perks" buttons and replace them with a permanent green "Enrolled &#x2705;" badge. This guarantees players never get confused about their enrollment status.


## [1.15.19] - 2026-07-13
### Added
- **Alt Account Perks Enrollment**: Players can now instantly enroll their Linked Alt Accounts into the Auto Redeem bot directly from their Account Hub! Next to each linked Alt Account, there is a new "&#x1F381; Enable Perks" button. Clicking it opens a mini-modal that securely grabs their Alt's locked Game ID, asks for the Date Started, and fires it straight to the backend Deduplication Engine.


## [1.15.17] - 2026-07-13
### Changed
- **Native Perks Auto-Redeem Opt-in**: Completely removed the embedded Google Form from the "Perks" page. It has been replaced by a sleek, native 1-Click Opt-In button. If a player is logged into the dashboard, they just click one button and the system instantly grabs their canonical ID, bounces it off the backend Deduplication Engine, and enrolls them into the `giftcodebot` spreadsheet silently. No double data-entry required!


## [1.15.16] - 2026-07-13
### Added
- **Registration Deduplication Engine**: The backend Google Apps Script now actively scans the `giftcodebot` spreadsheet before adding a new player. If a veteran player (who is already on the sheet) creates a website account, the system will silently skip them rather than appending a duplicate row, preserving their historical join date and canonical name!


## [1.15.15] - 2026-07-13
### Added
- **Unified Registration System**: The website registration has been completely overhauled to eliminate double-data entry. The signup form now includes "Chief Name" and "Date Started". Upon successful registration, the dashboard automatically creates a Firebase Auth account AND secretly routes the data directly into the `giftcodebot` spreadsheet via a new Google Apps Script endpoint!


## [1.15.14] - 2026-07-13
### Added
- **Cache-Busting Matrix**: Added aggressive `Cache-Control`, `Pragma`, and `Expires` meta tags directly into the root `index.html`. This creates a master hard-reset protocol to force all player browsers to bypass local caching and instantly pull the newest version of the site upon every reload!


## [1.15.13] - 2026-07-13
### Fixed
- **Hotfix: Admin Panel Crash**: Fixed a fatal UI crash in the Admin Panel caused by a misplacement of the `escapeHTML` helper function during the previous XSS hardening deployment. The function was inserted below the render lifecycle instead of at the top of the file, causing a `ReferenceError` when the Admin panel tried to sanitize inputs.


## [1.15.12] - 2026-07-13
### Changed
- **Audit Cleanup**: Conducted a massive ESLint sweep of the monolithic `main.js` file, removing 10+ unused variables, dead code paths, and fixing error-swallowing bugs in `catch` blocks.
- **Security Hardening**: Implemented a global `escapeHTML` helper and deployed XSS protection across all user-generated data injections (Admin Panel, Roster Datalist, and Leaderboards) to ensure malformed names don't break the UI.


## [1.15.11] - 2026-07-13
### Fixed
- **Admin Panel Refresh Fix**: The dynamic `giftcodebot` ID mapping logic has been successfully patched to actually execute when rendering the Admin Panel and Roster tables, and the "Refresh User List" button now correctly flushes the `giftcodebot` API cache as well to pull fresh data!


## [1.15.10] - 2026-07-13
### Fixed
- **API Fallback Bug**: Fixed a fatal flaw in the `fetchSheet` caching engine where fetching a sheet that exists in Google Sheets but has *not yet been synced* to Firebase (like `giftcodebot`) would silently return an empty dataset instead of triggering the fallback to pull the live Google Apps Script data.


## [1.15.9] - 2026-07-13
### Added
- **GiftCodeBot ID Mapping**: The global GameID-to-Name mapping engine now automatically pulls data from the `giftcodebot` spreadsheet directly via API and merges it with the Master Chief's List. This means that even if a formula on the master sheet breaks, delays, or evaluates to an empty string, the website will still successfully find and map the player's name using the raw `giftcodebot` logs! (Solves the issue where valid Game IDs like 738952586 were saying "Not Found").


## [1.15.8] - 2026-07-13
### Changed
- **Admin Panel Nomenclature**: Replaced instances of "Unknown" with "Not Found" for Chief Names that cannot be successfully mapped to a Game ID from the master database.


## [1.15.7] - 2026-07-13
### Fixed
- **Admin Panel Unknown Chiefs Fix**: The global GameID-to-Name mapping engine is now forcefully repopulated whenever the Admin Users list or Player Lookup is generated. This instantly fixes the issue where players appeared as "Unknown" in the Admin Panel even after they were added to the Master Chief List, ensuring names are always pulled live.


## [1.15.6] - 2026-07-13
### Changed
- **Admin Alt Accordions**: The Alt grouping system in the Admin Users tab has been upgraded to a collapsible accordion! Alt accounts are now hidden by default to keep the main list clean. You can click the `â–¶ï¸` arrow next to a Main account's Game ID to expand and view their linked Alts. The row also clearly displays a badge indicating `[1 Alt(s)]`.


## [1.15.5] - 2026-07-13
### Added
- **Admin Refresh**: Added a "Refresh User List" button inside the Admin Panel -> Users tab to instantly pull down new Chief Names from the master database if players updated their info.
- **Admin Alt Grouping**: The Admin Users list now beautifully indents and groups Linked Alt Accounts directly underneath their Main Account, complete with an `[ALT]` tag and connection details!


## [1.15.4] - 2026-07-12
### Changed
- **Account Linking Limit**: Changed the maximum allowed Alt Accounts per email from 2 to 1 based on feedback.


## [1.15.3] - 2026-07-12
### Changed
- **Account Linking UX**: Replaced the native browser prompt and confirm dialogs ("BrianDivaCox.github.io says...") with a seamless inline form inside the Account Hub. When a user clicks "+ Link Alt Account", an input field dynamically appears. Typing a Game ID instantly looks up the Chief Name on the master list and displays "Is your Chief Name: [Name]?" before allowing them to link.


## [1.15.2] - 2026-07-12
### Added
- **Account Linking**: The "Link Alt Account" prompt will now automatically cross-reference the entered Game ID with the master Chief List and ask "Is your Chief Name: [Name]?" to confirm before linking, just like the initial registration flow.


## [1.15.0] - 2026-07-12
### Added
- **Account Linking**: Users can now link up to 2 "Alt" Game IDs to their primary Firebase account via the Account Hub.
- **Chief List Bypass**: All linked Alt accounts are now automatically flagged as "Registered Accounts" and will bypass the Admin Global Filter on the Player Lookup page.


## [1.14.17] - 2026-07-12
### Fixed
- **Player Lookup**: Re-applied the strict-typing Game ID matching fix (which silently failed to apply in the previous update). The `gameId` lookups are now properly verified as Strings on both ends.


## [1.14.16] - 2026-07-12
### Fixed
- **Player Lookup**: Fixed a strict-typing mismatch bug where Game IDs stored as Numbers in Firebase were failing to match Game IDs formatted as Strings in Google Sheets, causing valid registered users to be filtered out.


## [1.14.15] - 2026-07-12
### Fixed
- **Admin Panel**: Corrected a bug where the Global Chief List Filter button failed to inject into the Users Tab during the previous update. The toggle should now visibly appear for Admins.


## [1.14.14] - 2026-07-12
### Changed
- **Player Lookup**: Removed the local "Show Registered Accounts Only" UI toggle from the public Chief List. This behavior is now strictly controlled globally by Admins via the Users Tab in the Admin Control Panel.


## [1.14.13] - 2026-07-12
### Fixed
- **Global Chief List Filter**: Corrected multiple UI insertion and Firebase permission bugs that prevented the toggle from appearing in the Admin Control Panel and caused the Chief's List to fail loading.
- Moved the **Global Chief List Filter** toggle from the Settings Tab to the Users Tab.


## [1.14.12] - 2026-07-12
### Added
- **Global Chief List Filter**: Added a new setting to the Admin Control Panel (Settings Tab) to permanently hide unregistered users from the Chief's List for all users. When this Admin setting is turned ON, the local UI filter is automatically hidden and the list forces only registered accounts to show globally.


## [1.14.11] - 2026-07-12
### Added
- **Player Lookup Filter**: Added a new toggle in the Player Lookup (Chief's List) to only show players who have registered a user account on the dashboard. Registered players are now also marked with a checkmark (âœ…) in the dropdown list.


## [1.14.10] - 2026-07-12
### Fixed
- **BT Donations Display**: Fixed an issue where players ranked 5th or below for current week Bear Trap Donations would display "0 Current" because the official Leaderboard only tracks the top 4. The badge will now dynamically fallback to the player's Activity sheet data to correctly display their total (e.g., "(22) Current") even if they aren't in the top 4.


## [1.14.9] - 2026-07-12
### Fixed
- **Backend Sync**: Added forced Firebase sync for `LeaderBoards` and `WhiteOut Survival` sheets whenever a Bear Trap Donation is added via the Admin API. This fixes the issue where the "BT Donations" badge in player cards wouldn't update with the latest rankings until the nightly 1 AM sync.


## [1.14.8] - 2026-07-12
### Changed
- **UI**: Renamed the sidebar title from "WhiteOut Dashboard" to "WOS Dashboard".


## [1.14.7] - 2026-07-12
### Fixed
- **UI**: Fixed a bug where events marked as "Upcoming" (with an hourglass â³, like Polar Terrors early in the week) could not be edited by admins using the Quick Fix action buttons on player cards. Admins can now mark upcoming events as Participated.


## [1.14.6] - 2026-07-12
### Changed
- **UI**: Replaced native browser `alert()` pop-ups for "no supported missing events" with the custom Toast Notification system to avoid confusing browser domain prompts.


## [1.14.5] - 2026-07-12
### Changed
- **Frontend**: Reverted the Bear Trap "Today's Activity" date logic back to using the admin's local timezone (instead of UTC) so that the activity logs align with the admin's local day, making it easier to hold admins accountable based on standard local time.


## [1.14.4] - 2026-07-12
### Fixed
- **Backend**: Updated Google Sheets trigger so that whenever an Admin makes a manual Bear Trap donation edit directly in the Google Sheet, the live Activity widget on the Dashboard gets accurately updated in real-time. 
- **Frontend**: Modified the Bear Trap "Today's Activity" date logic to use the strict game server reset time (00:00 UTC). "Today" now properly aligns with the game day, instead of the admin's personal local timezone in their browser.


## [1.14.3] - 2026-07-12
### Changed
- **UI**: Updated the toast alert notifications to feature a colored border that wraps entirely around the pop-up, rather than just a stripe on the left side, making them much more visible and distinct.


## [1.14.2] - 2026-07-11
### Added
- **UI**: Created a new "sticky" success alert system. Important success notifications (like refreshing the calendar, adding donations, or updating player cards) will now stay on the screen until you manually close them so you don't miss them.


## [1.14.1] - 2026-07-11
### Fixed
- **UI**: Fixed the Refresh button on the Calendar tab so it now properly clears the local cache, shows a loading animation/notification, and genuinely forces a fresh data pull from Firebase.


## [1.14.0] - 2026-07-11
### Added
- **Feature**: Added a "Live Database Sync Status" widget to the Settings tab in the Admin Control Panel. It securely reads from Firebase to display exactly when each individual Google Sheet tab was last fully synchronized.


## [1.13.3] - 2026-07-11
### Fixed
- **UI**: Fixed a timezone parsing bug in the Calendar view that caused dates (like the 12th) to improperly display as the previous day (the 11th) due to UTC time offsets.


## [1.13.2] - 2026-07-11
### Fixed
- **Backend**: Fixed a bug where `BrianDivaCox` was improperly resolved as the admin name when logging actions from the Google Sheets sidebar. It now properly maps to `BrianDCox`.


## [1.13.1] - 2026-07-11
### Added
- **UI**: Added a dropdown menu to the Admin Logs tab to easily filter logs by specific admins.



## [1.13.0] - 2026-07-11
### Added
- **Feature**: Brand new "ðŸ“‹ Logs" tab in the Admin Control Panel for comprehensively viewing and searching historical admin actions.
- **Backend**: Synced the entire "Admin Log" sheet directly to Firebase to enable instantaneous loading and frictionless frontend searching of the entire history.


## [1.12.1] - 2026-07-11
### Fixed
- **UI**: Fixed an issue where the Daily Digest collapsible arrow wouldn't hide the log due to a missing `.hidden` CSS utility class.


## [1.12.0] - 2026-07-11
### Added
- **Feature**: Live Bear Trap Activity Log. A sleek, collapsible "Daily Digest" banner now appears under the Bear Trap Donations leaderboards, dynamically displaying all donations made today in real-time.
- **Backend**: Integrated `bearTrapLog` Firebase endpoint to maintain a rolling list of the last 20 donations for instantaneous frontend updates.

## [1.11.1] - 2026-07-11
### Fixed
- **UI**: Removed the thick pink left border on the Upcoming Event countdown widget to match the standard card styling across the dashboard.

## [1.11.0] - 2026-07-11
### Added
- **Feature**: Broadcast Push Notifications Tool. Admins can now instantly send push notifications to all registered devices directly from the Admin Panel.
- **Backend**: Added secure, on-the-fly OAuth2 token generation in Google Apps Script to authenticate with the modern FCM HTTP v1 API.

## [1.10.0] - 2026-07-11
### Added
- **Feature**: Browser Push Notifications. Users can now opt-in to receive push alerts directly to their device using Firebase Cloud Messaging.
- **UI**: Added a "Push Alerts" toggle to the Settings Sidebar.

## [1.9.0] - 2026-07-11
### Added
- **Feature**: Live Event Countdowns on the Home page. A dynamic widget now calculates the exact start time of the next upcoming event from the Google Sheets schedule and displays a live, ticking clock.
- **Feature**: Event Rotation. If multiple events start at the exact same time, the countdown widget will smoothly cycle through all event names every few seconds.

## [1.8.6] - 2026-07-11
### Changed
- **UI**: Temporarily removed the "Analytics" page from the main navigation menu while we determine which charts and data visualizations are most useful for the Alliance.

## [1.8.5] - 2026-07-10
### Changed
- **Content**: Updated the "Join Discord" button on the Contact Support page to point to the official BDC Alliance Discord server link.

## [1.8.4] - 2026-07-10
### Changed
- **UI**: Removed the dynamic Card View and Table View toggle from the Home page News section. Announcements will now permanently display in Table View format.

## [1.8.3] - 2026-07-10
### Changed
- **UX**: Moved the "Contact Support" button into the Settings Sidebar (under User Account) to reduce navigation menu clutter, but it now perfectly renders the beautiful full-screen dashboard page layout instead of a cramped popup modal.

## [1.8.2] - 2026-07-10
### Changed
- **UX**: Reverted Contact Support page back to a dedicated full-screen page in the main navigation menu, matching the sleek layout of the Perks Auto Redeem page.

## [1.8.1] - 2026-07-10
### Changed
- **UX**: Moved the Contact Support page out of the main navigation menu and embedded it directly into a popup modal that launches from the Settings Sidebar to reduce navigation clutter.

## [1.8.0] - 2026-07-10
### Added
- **Feature**: Added a dedicated "Contact Support" page containing a direct invite link to the BDC Alliance Discord server and an embedded Google Form for submitting bug reports, feature requests, and support tickets directly from the dashboard.

## [1.7.4] - 2026-07-10
### Changed
- **UI**: Reverted the Today's Schedule redesign completely back to its original state.

## [1.7.3] - 2026-07-10
### Changed
- **UI**: Merged all upcoming dates into a single "Looking Ahead" card instead of creating a separate card per date to reduce visual clutter.

## [1.7.2] - 2026-07-10
### Changed
- **Chore**: Bumped version and pushed to bust cache.

## [1.7.1] - 2026-07-10
### Added
- **Feature**: Added a dynamic "ðŸ‘‘ All-Time Champion" banner to the All-Time Bear Trap Leaderboard. The system automatically reads the Rank 1 player and showcases their avatar and total lifetime wins at the top of the card.

## [1.7.0] - 2026-07-10
### Added
- **Feature**: Added a new Admin tool to log Bear Trap Event Winners directly from the dashboard.
- **Enhanced**: The dashboard now syncs directly with the hidden `data` sheet in Google Sheets to update win totals in real-time.
- **Design**: Implemented a dynamic "ðŸ‘‘ Reigning Champion" banner on the Leaderboards page that automatically displays the custom profile picture, name, and total wins of the most recent Bear Trap event winner.

## [1.6.0] - 2026-07-10
### Added
- **Feature**: Integrated `Cropper.js` for an interactive Profile Picture upload experience. Users can now zoom, pan, and precisely crop their avatars to a perfect 1:1 square before saving.
- **Enhanced**: Added dynamic image size checking to prevent uploads of images smaller than 100x100px or larger than 10MB to maintain dashboard quality and performance.

## [1.5.2] - 2026-07-10
### Changed
- **Changed**: Moved the detailed "Deployment Status" tracker out of the public settings sidebar and properly integrated it into the Admin Panel's Settings tab, directly beneath the Dev Mode toggle.

## [1.5.1] - 2026-07-10
### Added
- **Feature**: Refactored the Admin Dashboard into a Tabbed Layout (Daily Tools, Users, Settings) to improve organization and reduce clutter on mobile devices.

## [1.5.0] - 2026-07-10
### Added
- **Feature**: Introduced Dynamic Admin Management system. Admins can now grant or revoke admin access to other players directly from their profile cards.
- **Feature**: Added "Staff Roles" management section to the Admin Dashboard to track and revoke access for all current admins.

## [1.4.13] - 2026-07-10
### Fixed
- **Fixed**: Maintenance mode Date & Time picker not opening calendar popups on certain browsers. Replaced unified datetime input with separate native Date and Time inputs for maximum cross-browser compatibility.

## [1.4.12] - 2026-07-10
### Changed
- **Enhanced**: Improved the Maintenance Mode duration picker. Admins can now input a custom duration in hours (instead of minutes) and use a Date/Time picker to set an exact maintenance end time.
- **Enhanced**: The maintenance countdown timer shown to users now properly calculates and displays remaining days (e.g., `1d 2h 30m 10s`) for durations longer than 24 hours.

## [1.4.11] - 2026-07-10
### Changed
- **Changed**: Renamed "Bear Trap Donations" admin panel button and page title to "Multi-BT Donations".
- **Fixed**: Admin panel "Multi-BT Donations" datalist dropdown now fetches and syncs with the entire Chief's List roster from Google Sheets, ensuring all players (like Dwarf) are available for quick selection, even if they haven't registered an account yet.

## [1.17.5] - 2026-07-14
### Fixed
- **Bug**: Fixed a bug where the Admin Panel "Universal Player Editor" card was missing the Gift Codes, Time Active, and Furnace Level badges due to misaligned data column indices.

## [1.17.4] - 2026-07-14
### Changed
- **UI**: Increased size of Furnace Level icons to 36px and added image sharpening to prevent them from looking blurry on the Player Cards.

## [1.17.3] - 2026-07-14
### Changed
- **UI**: Displayed exact Century Games icons for Furnace & Fire Crystal levels (e.g. `stove_lv_7.png`) dynamically instead of a generic emoji, matching the user's level exactly without hitting API rate limits.

## [1.17.2] - 2026-07-14
### Fixed
- **Bug**: Fixed a redeclaration error in the frontend that caused the web app build to fail when loading the Account Hub.

## [1.17.1] - 2026-07-14
### Added
- **UI**: Displayed Furnace Level (with a 🔥 icon) inside the Account Hub and Player Profile Cards!

## [1.17.0] - 2026-07-14
### Added
- **Live WOS Profile Lookup**: Integrated official Whiteout Survival API into the Web App. When users type their Game ID during registration, the app will securely fetch their official Chief Name and Furnace Level live from Century Game servers.
- **Master List Sync**: Upgraded the account creation flow to automatically save new signups to both the `giftcodebot` sheet and the `Chief's List` sheet, complete with their verified Furnace Level and Join Date.

## [1.4.10] - 2026-07-10
### Changed
- **Changed**: Restructured admin controls on player profiles. Added a new "Admin Action Bar" at the top right of the card.
- **Added**: New "Edit Events" modal for admins. Clicking it opens a popup with checkboxes to mark multiple missed events as Participated at once.
- **Changed**: Removed the `+ Add Donation` button from the badges list and moved it to the new Admin Action Bar.
- **Changed**: Event metric boxes in the checklist are no longer clickable for admins to prevent accidental clicks. Use the "Edit Events" button instead.

## [1.4.9] - 2026-07-10
### Changed
- **Changed**: Simplified Bear Trap Wins format to display as `#1 (65) All-Time | (T1: #1 (50) | T2: #2 (15))`.

## [1.4.8] - 2026-07-10
### Changed
- **Changed**: Merged "All-Time Bear Trap Wins" and current Bear Trap Wins into a single styled tag on the player profile. The combined tag now displays leaderboard rankings alongside scores for both all-time and current data.

## [1.4.7] - 2026-07-10
### Fixed
- **Fixed**: "+ Add Donation" button in the Player Database Editor now properly shows up for admins on all player cards, even if the player has 0 previous Bear Trap donations.

## [1.4.6] - 2026-07-10
### Added
- **Added**: Maintenance Countdown System â€” when enabling maintenance mode, admins now see a duration picker with preset options (15m, 30m, 1hr, 2hr) or custom minutes. A live countdown is displayed on the maintenance lockout page for all users. When the countdown expires, it shows "Should be back any moment..." (manual mode).
- **Added**: "No Countdown" option for maintenance without a timer.

## [1.4.5] - 2026-07-09
### Fixed
- **Fixed**: Schedule (Calendar View) and Today's Schedule pages now handle missing or null data gracefully instead of crashing with "Cannot read properties of null (reading 'length')".

## [1.4.4] - 2026-07-09
### Changed
- **Changed**: Redesigned the Theme Engine in the settings sidebar from unlabeled color circles to labeled mini-cards in a 2-column grid. Theme names are now always visible, including on mobile.
- **Removed**: Removed the "Deep Ocean" theme. Removed obsolete Google Translate CSS overrides.

## [1.4.3] - 2026-07-09
### Added
- **Added**: 12hr / 24hr clock format toggle in the Global Timers settings section. Both UTC and Local clocks now display AM/PM in 12hr mode. Preference is saved to localStorage.

## [1.4.2] - 2026-07-09
### Changed
- **Removed**: Removed the Google Translate language translator widget from the navbar and the Language picker from the settings sidebar. The `formatPlayerName` translation-guard utility was also removed.

## [1.4.1] - 2026-07-09
### Added
- **Added**: `formatPlayerName` utility to protect English player names from being auto-translated.

## [1.4.0] - 2026-07-07
### Changed
- **Infrastructure**: Migrated the primary database read architecture to Firebase Realtime Database to eliminate rate limits and HTML parsing crashes.
- **Performance**: Reduced data fetching times from 2-3 seconds down to ~50 milliseconds.
- **Admin**: Introduced hybrid Google Sheets / Firebase sync architecture.

## [1.3.1] - 2026-07-07
### Added
- **Dev Mode Tracker**: Added a "Developer Settings" section in the settings sidebar with a "Dev Mode" toggle. When enabled, this tracks active GitHub deployments using the GitHub REST API.
- **Smart Auto-Refresh**: If a deployment is in progress, an alert banner will appear at the top of the page. Once the deployment succeeds, the page will automatically refresh to instantly load the newest live version.

## [1.3.0] - 2026-07-07
### Added
- **Visual Events Checklist Editor**: Upgraded the Universal Player Editor to visually match the user-facing Player Card! Admins can now view a player's complete profile and click directly on "Action Required" (❌) cells in the checklist grid to mark events as Participated.
- **Bear Trap Quick Editing**: Added a convenient "+ Add Donation" button directly into the Player Card header in Admin Mode, allowing for lightning-fast Bear Trap updates.
### Fixed
- **Mobile Hamburger Menu UX**: Rewrote the mobile navigation dropdown logic to behave as an accordion. Expanding a submenu (like Leaderboards) will now correctly collapse other submenus. Fixed an issue where menus wouldn't reliably close when tapping their arrows.

## [1.2.0] - 2026-07-07
### Added
- **Universal Player Editor (Admin)**: Built a massive new feature in the Admin Control Panel. Admins can now search for any Chief by username and instantly pull up a unified "Player Card".
- **Cross-Sheet Editing**: From the Universal Player Editor, Admins can directly edit a player's `Polar Terrors` status (Yes/No), `Alliance Championship` status (Yes/No), and add `Bear Trap Donations`.
- **Intelligent Formula Protection**: The editor securely updates the *source* event sheets via a new backend API, ensuring the `Activity` sheet's formulas are perfectly protected and automatically updated.

## [1.1.0] - 2026-07-07
### Added
- **Maintenance Mode**: Engineered a global Maintenance Mode toggle switch within the Admin Control Panel.
- **Maintenance Overlay**: Standard users are now safely locked out of the site with a full-screen "Site Under Maintenance" overlay when maintenance mode is active.
- **Admin Warning Banner**: Added a persistent red banner at the top of the screen for Admins to remind them that the site is currently locked in Maintenance Mode.

## [1.0.3] - 2026-07-07
### Fixed
- **Mobile Menu Scrolling**: Fixed a critical CSS issue where the main mobile navigation menu (hamburger menu) failed to trigger a scrollbar on smartphones due to box-sizing and dynamic viewport height clipping.

## [1.0.2] - 2026-07-07
### Changed
- **Dashboard Hub Renamed**: Changed the "Dashboard Hub" menu to "Settings" (with a âš™ï¸ icon) to improve usability and reduce confusion.
- **Persistent Login Indicator**: Added a permanent, dynamic pill to the top Navigation Bar that displays the user's name when logged in.
- **Toast Notifications**: Overhauled Toast notifications to slide down from the top of the screen to prevent mobile soft-keyboards and Safari navbars from obscuring them.

## [1.0.1] - 2026-07-07
### Added
- **Version Badge**: Added a dynamic version badge to the top navigation bar.
### Changed
- **Bear Trap UI**: Decoupled "Quick Lookup" from the Bear Trap dashboard and moved it into a sleek modal overlay.
- **Theme Engine UI**: Redesigned the theme engine in the Dashboard Hub into a compact, horizontal grid of color circles to save vertical space.
- **Mobile Navigation**: Improved the mobile menu (`.mobile-menu`) layout to function better on small screens.
### Fixed
- **Mobile Scrolling**: Fixed an issue where overflowing content in the mobile menu and settings sidebar could not be scrolled.

## [1.0.0] - 2026-07-05
### Added
- **Dashboard Hub**: Created a new slide-out sidebar menu to house the Global Timers and Theme Engine.
- **Auto Redeem Integration**: Embedded a Google Form directly into the dashboard under the new "Perks" dropdown for automated gift code redemption.
- **Smart URL Parser**: The News tab automatically detects Google Forms links and transforms them into customized, themed buttons.
- **News Toggle Layout**: Added a toggle on the Home page to dynamically switch between Card View and Table View for announcements.
- **Player Lookup Cards**: Transformed the Activity roster into a beautiful, searchable dropdown card system featuring automatic checkmarks for Gift Codes and Active Time.
- **GitHub Actions Integration**: Set up an automated `deploy.yml` pipeline to host the Vite compiled dashboard freely on GitHub Pages.
### Changed
- Reorganized the top navigation bar to reduce clutter by moving timers and settings into the Dashboard Hub.
- Adjusted Activity badge logic to natively display â Œ for missing/false Gift Codes and "N/A" for missing Active Time.
- Updated the Vite config to support GitHub Pages base path.