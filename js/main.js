// Main entry point for Story Map

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the main app
  const app = new AppController();

  // Initialize map controls
  const mapControls = new MapControls(app.mapManager, app);

  // Initialize PWA manager
  const pwaManager = new PWAManager();

  // Add CSS animation for pulsing marker
  const style = document.createElement("style");
  style.textContent = `
        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.1);
                opacity: 0.7;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
  document.head.appendChild(style);

c manifest generation needed.
});
