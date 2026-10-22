# Room to Rent

A responsive South African room-rental website prototype with independent pages and shareable URLs. It runs directly in a browser and needs no build step or package installation.

## Open the app

Open `index.html` in a modern browser. Browse the website using the header links, or open an individual page directly:

- `rooms.html` for room search and listings
- `property.html?id=1` for listing details (IDs 1–6)
- `login.html` and `register.html` for account screens
- `tenant.html` and `landlord.html` for the two dashboard views
- `sns-bachelor-rooms.html` for the SNS Mamelodi bachelor-room website and direct contact details

Room photos and brand artwork are stored locally. DM Sans and Manrope load from Google Fonts.

## Deploy on Render

This is a static site with no build step. Create a Render Static Site connected to the GitHub repository, or use the included `render.yaml` Blueprint. Set the publish directory to `.` and leave the build command empty. Render will publish the HTML pages and local assets.

## Included

- Landing page plus a separate browse/search page with room-type filters, city and budget search, and saved rooms
- Property details, tenant dashboard, landlord dashboard, login, and registration screens
- Logo, SVG favicon, app icon, and mobile splash artwork in `assets/`
- SNS Bachelor Rooms logo and standalone responsive property website
- South African sample locations and rand pricing

Authentication, enquiries, and listing management are interface prototypes; they are not connected to a backend. Saved rooms persist locally in the browser.

## Brand system

- Bright yellow: `#F4C430`; white: `#FFFEFA`; dark gray: `#252624`
- Supporting green: `#34745C`; coral accent: `#E87961`
- Display: Manrope 700/800; interface and body: DM Sans 400/500/600/700
- Corner radius: 8–16 px with restrained borders and shadows