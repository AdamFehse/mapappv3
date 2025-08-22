// Map Manager - Handles Leaflet map initialization and management

class MapManager {
    constructor() {
        this.map = null;
        this.baseLayer = null;
        this.satelliteLayer = null;
        this.currentMapMode = 'base';
        this.markers = [];
    }

    init(containerId) {
        this.map = L.map(containerId, {
            zoomControl: false
        }).setView(CONFIG.DEFAULT_CENTER, CONFIG.DEFAULT_ZOOM);

        this.addZoomControl();
        this.createTileLayers();
        this.addBaseLayer();
    }

    addZoomControl() {
        L.control.zoom({
            position: 'topleft'
        }).addTo(this.map);
    }

    createTileLayers() {
        this.baseLayer = L.tileLayer(CONFIG.TILE_LAYERS.base.url, {
            attribution: CONFIG.TILE_LAYERS.base.attribution,
            minZoom: CONFIG.TILE_LAYERS.base.minZoom,
            maxZoom: CONFIG.TILE_LAYERS.base.maxZoom
        });

        this.satelliteLayer = L.tileLayer(CONFIG.TILE_LAYERS.satellite.url, {
            attribution: CONFIG.TILE_LAYERS.satellite.attribution,
            minZoom: CONFIG.TILE_LAYERS.satellite.minZoom,
            maxZoom: CONFIG.TILE_LAYERS.satellite.maxZoom
        });
    }

    addBaseLayer() {
        this.baseLayer.addTo(this.map);
    }

    setMapMode(mode) {
        if (this.currentMapMode === mode) return;
        
        this.currentMapMode = mode;
        
        // Remove all layers first
        if (this.map.hasLayer(this.baseLayer)) {
            this.map.removeLayer(this.baseLayer);
        }
        if (this.map.hasLayer(this.satelliteLayer)) {
            this.map.removeLayer(this.satelliteLayer);
        }
        
        // Add the appropriate layer
        switch (mode) {
            case 'base':
                this.baseLayer.addTo(this.map);
                break;
            case 'satellite':
                this.satelliteLayer.addTo(this.map);
                break;
            case 'mask':
                this.satelliteLayer.addTo(this.map);
                this.createMaskEffect();
                break;
        }
    }

    createMaskEffect() {
        const mapContainer = document.getElementById('map');
        
        // Remove any existing mask
        const existingMask = document.querySelector('.map-mask-overlay');
        if (existingMask) {
            existingMask.remove();
        }
        
        // Create mask overlay
        const maskOverlay = document.createElement('div');
        maskOverlay.className = 'map-mask-overlay';
        maskOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                transparent 0%, 
                transparent 40%, 
                rgba(0,0,0,0.8) 100%);
            pointer-events: none;
            z-index: 400;
            transition: all 0.1s ease;
        `;
        
        mapContainer.appendChild(maskOverlay);
        
        // Update mask position on mouse move
        const updateMask = (e) => {
            const rect = mapContainer.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            maskOverlay.style.setProperty('--mouse-x', x + '%');
            maskOverlay.style.setProperty('--mouse-y', y + '%');
        };
        
        mapContainer.addEventListener('mousemove', updateMask);
        
        // Store cleanup function
        maskOverlay._cleanup = () => {
            mapContainer.removeEventListener('mousemove', updateMask);
            if (maskOverlay.parentNode) {
                maskOverlay.parentNode.removeChild(maskOverlay);
            }
        };
    }

    removeMaskEffect() {
        const existingMask = document.querySelector('.map-mask-overlay');
        if (existingMask) {
            if (existingMask._cleanup) {
                existingMask._cleanup();
            }
            existingMask.remove();
        }
    }

    centerOnProject(lat, lng, zoom = 12) {
        this.map.flyTo([lat, lng], zoom, {
            duration: CONFIG.MAP_ANIMATION_DURATION,
            easeLinearity: 0.25
        });
    }

    getMap() {
        return this.map;
    }

    getCurrentMode() {
        return this.currentMapMode;
    }
}

// Export for use in other modules
window.MapManager = MapManager;
