# Changelog

All notable changes to the WhiteOut Survival BDC Dashboard will be documented in this file.

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
