# Changelog

All notable changes to the WhiteOut Survival BDC Dashboard will be documented in this file.

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
- **Admin Alt Accordions**: The Alt grouping system in the Admin Users tab has been upgraded to a collapsible accordion! Alt accounts are now hidden by default to keep the main list clean. You can click the `▶️` arrow next to a Main account's Game ID to expand and view their linked Alts. The row also clearly displays a badge indicating `[1 Alt(s)]`.


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
- **Player Lookup Filter**: Added a new toggle in the Player Lookup (Chief's List) to only show players who have registered a user account on the dashboard. Registered players are now also marked with a checkmark (✅) in the dropdown list.


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
- **UI**: Fixed a bug where events marked as "Upcoming" (with an hourglass ⏳, like Polar Terrors early in the week) could not be edited by admins using the Quick Fix action buttons on player cards. Admins can now mark upcoming events as Participated.


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
- **Feature**: Brand new "📋 Logs" tab in the Admin Control Panel for comprehensively viewing and searching historical admin actions.
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
- **Feature**: Added a dynamic "👑 All-Time Champion" banner to the All-Time Bear Trap Leaderboard. The system automatically reads the Rank 1 player and showcases their avatar and total lifetime wins at the top of the card.

## [1.7.0] - 2026-07-10
### Added
- **Feature**: Added a new Admin tool to log Bear Trap Event Winners directly from the dashboard.
- **Enhanced**: The dashboard now syncs directly with the hidden `data` sheet in Google Sheets to update win totals in real-time.
- **Design**: Implemented a dynamic "👑 Reigning Champion" banner on the Leaderboards page that automatically displays the custom profile picture, name, and total wins of the most recent Bear Trap event winner.

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
- **Added**: Maintenance Countdown System — when enabling maintenance mode, admins now see a duration picker with preset options (15m, 30m, 1hr, 2hr) or custom minutes. A live countdown is displayed on the maintenance lockout page for all users. When the countdown expires, it shows "Should be back any moment..." (manual mode).
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
- **Dashboard Hub Renamed**: Changed the "Dashboard Hub" menu to "Settings" (with a ⚙️ icon) to improve usability and reduce confusion.
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
- Adjusted Activity badge logic to natively display ❌ for missing/false Gift Codes and "N/A" for missing Active Time.
- Updated the Vite config to support GitHub Pages base path.
