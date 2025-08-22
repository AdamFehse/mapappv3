// Main entry point for Chismapa Story Map

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main app
    const app = new AppController();
    
    // Initialize map controls
    const mapControls = new MapControls(app.mapManager, app);
    
    // Initialize PWA manager
    const pwaManager = new PWAManager();
    
    // Add CSS animation for pulsing marker
    const style = document.createElement('style');
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
    
    // Create manifest.json programmatically
    const manifest = {
        "name": "Chismapa Story Map",
        "short_name": "Chismapa",
        "description": "Interactive story mapping application for Chismapa projects",
        "start_url": "./",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#2563eb",
        "icons": [
            {
                "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🗺️</text></svg>",
                "sizes": "any",
                "type": "image/svg+xml"
            }
        ]
    };

    // Create and inject manifest link
    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    
    // Update the existing manifest link
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
        manifestLink.href = manifestUrl;
    }
    
    console.log('Chismapa Story Map initialized successfully!');
});
