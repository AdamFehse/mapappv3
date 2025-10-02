// Main entry point for Story Map

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the main app
  const app = new AppController();

  // Initialize map controls
  new MapControls(app.mapManager, app);

  // Initialize PWA manager
  new PWAManager();
});
