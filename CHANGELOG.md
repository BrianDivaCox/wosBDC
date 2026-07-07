# Changelog

All notable changes to the WhiteOut Survival BDC Dashboard will be documented in this file.

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
- **Schedule Strikethrough**: Fixed a bug where "Today's" events were crossed out prematurely at midnight, regardless of the actual UTC event time.
- **Polar Terrors Auto-Reset**: Patched the backend logic in Google Apps Script (`Resets.js`) so Polar Terrors correctly auto-schedule their next run instead of failing.
- **Bear Trap Admin Log**: Fixed the API router in Google Apps Script so the Admin Log feed populates correctly in the Bear Trap screen.

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
