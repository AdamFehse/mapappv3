
MíTuCultura Frontera
====================

MíTuCultura Frontera is a browser-based interactive map for exploring project stories. It is built with vanilla JavaScript, Bootstrap, and Leaflet.js, and works as a Progressive Web App (PWA) with offline support.

Demo: https://adamfehse.github.io/mapappv3/

## Features
- Interactive map with project markers and popups
- Responsive mini-sidebar: On large screens, a vertical sidebar shows only icons and expands on hover to reveal labels. On small screens, the sidebar is hidden by default and can be toggled open.
- Category filters and project list integrated into the sidebar/offcanvas
- Project details modal
- Multiple map modes (base, satellite, focus)
- Works offline (PWA)

## Getting Started
1. Clone this repository
2. Run a local server (e.g. Live Server on port 5501)
3. Open `index.html` in your browser

## Project Structure
- `index.html` - Main HTML file
- `js/` - Application logic (controllers, managers, UI)
- `sw.js` - Service worker for offline support
- `.vscode/settings.json` - Live Server config

## Sidebar Integration
- The sidebar is implemented as a responsive offcanvas/mini-sidebar in `index.html`.
- Category filter buttons and project list are rendered dynamically by JavaScript into the sidebar containers.
- To add a new category button, use:
	`<button class="sidebar-icon-btn" onclick="filterByCategory('Art')">...</button>`

## Development
- No build step required; all code is ES6+ and loaded directly
- Use browser dev tools for debugging
- Project data is loaded from a remote JSON file (see `js/config.js`)

## License
See `about.txt` for icon attribution. All other code is MIT licensed.
