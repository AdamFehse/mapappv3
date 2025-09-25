
# Copilot Instructions for MíTuCultura Frontera

## Project Overview
- **MíTuCultura Frontera** is a browser-based, interactive map application for exploring project stories, built with vanilla JavaScript, Bootstrap, and Leaflet.js.
- The app is structured as a Progressive Web App (PWA) with offline support via a service worker (`sw.js`).
- The main entry point is `js/main.js`, which initializes the app and injects a dynamic manifest.

## Architecture & Key Components
- **AppController (`js/app-controller.js`)**: Orchestrates all major modules, manages global state, and exposes UI actions globally (e.g., `window.showProject`).
- **DataManager (`js/data-manager.js`)**: Fetches and filters project data from a remote JSON endpoint (see `CONFIG.PROJECTS_URL` in `js/config.js`).
- **MapManager (`js/map-manager.js`)**: Handles Leaflet map setup, tile layers, custom controls, and map mode switching (base, satellite, mask/focus).
- **MarkerManager (`js/marker-manager.js`)**: Manages map markers, popups, and marker highlighting.
- **UI Modules**: 
  - `js/ui/story-panel.js`: Sidebar project list and category filters.
  - `js/ui/details-modal.js`: Bootstrap modal for project details.
  - `js/ui/map-controls.js`: Map mode and navigation controls.
  - `js/ui/pwa-manager.js`: Handles install prompt, offline detection, and PWA UX.

## Data Flow
- Project data is loaded asynchronously on startup and filtered by category or user actions.
- UI updates (sidebar, map, modals) are triggered by AppController methods, which coordinate between DataManager, MapManager, and MarkerManager.
- Most UI actions are exposed globally for use in HTML event handlers (e.g., `onclick="showProjectWithPopup(index)"`).

## Developer Workflows
- **Local Development**: Use Live Server (see `.vscode/settings.json`, port 5501) for local testing. No build step is required.
- **Testing**: No automated tests are present; manual browser testing is standard.
- **Debugging**: Use browser dev tools. Console logs are present in startup and install flows.
- **PWA**: Service worker (`sw.js`) caches all JS, HTML, and remote Leaflet assets for offline use. Manifest is generated at runtime in `main.js`.

## Project Conventions & Patterns
- All major classes are attached to `window` for global access.
- UI event handlers are often set via global functions (see `AppController.setupGlobalFunctions`).
- Category and project navigation is managed by index, not by ID.
- Map modes: 'base', 'satellite', and 'mask' (focus effect overlay).
- Bootstrap modals and offcanvas are used for dialogs and sidebars.
- No module bundler or transpiler; all code is ES6+ and loaded directly in the browser.

## Integration Points & External Dependencies
- **Leaflet.js**: For map rendering and marker management (see CDN in `index.html`).
- **Bootstrap 5**: For UI components and modals (see CDN in `index.html`).
- **Remote Data**: Project data is fetched from a public GitHub-hosted JSON file (see `js/config.js`).

## Key Files & Directories
- `index.html`: Main HTML, includes all scripts and sets up UI containers.
- `js/`: All application logic, organized by component.
- `sw.js`: Service worker for offline support.
- `.vscode/settings.json`: Live Server port config.

## Special Notes
- The manifest is generated dynamically at runtime; do not edit `site.webmanifest` directly.
- All UI and map state is managed in-memory; there is no backend or persistent storage beyond the service worker cache.
- To add new map modes or UI panels, follow the class-based pattern and register with AppController if global access is needed.
