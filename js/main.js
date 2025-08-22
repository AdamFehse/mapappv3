// Main entry point for Chismapa Story Map

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

  // Add this right before creating the manifest
  console.log("Current location info:");
  console.log("- href:", window.location.href);
  console.log("- origin:", window.location.origin);
  console.log("- pathname:", window.location.pathname);
  console.log("- base:", document.baseURI);

  // Create manifest.json programmatically
  const manifest = {
    "name": "Chismapa Story Map",
    "short_name": "Chismapa",
    "id": "/",
    "description": "Interactive story mapping application for Chismapa projects",
    "start_url": window.location.href,
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#2563eb",
    "icons": [
        {
            "src": window.location.href + "android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        }
    ]
  };

  // Create and inject manifest link
  const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], {
    type: "application/json",
  });
  const manifestUrl = URL.createObjectURL(manifestBlob);

  // Update the existing manifest link
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    manifestLink.href = manifestUrl;
  }

  console.log("test bro breh bruh doenst show");

  console.log("lol still says the old messege");
  // Add this after your manifest object is created
  console.log("Generated manifest:", JSON.stringify(manifest, null, 2));
});
