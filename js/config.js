// Configuration and constants for Chismapa Story Map

const CONFIG = {
    // Map settings
    DEFAULT_CENTER: [31.313354, -110.945987],
    DEFAULT_ZOOM: 7,
    
    // API endpoints
    PROJECTS_URL: 'https://raw.githubusercontent.com/AdamFehse/map-app/gh-pages/storymapdata_db_ready_v2.json',
    
    // Map tile layers
    TILE_LAYERS: {
        base: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 0,
            maxZoom: 16
        },
        satellite: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            minZoom: 0,
            maxZoom: 18
        }
    },
    
    // UI settings
    STORY_PANEL_WIDTH: 350,
    DETAILS_MODAL_MAX_WIDTH: 600,
    
    // Animation durations
    MAP_ANIMATION_DURATION: 0.5,
    
    // Z-index values
    Z_INDEX: {
        OFFLINE_INDICATOR: 1001,
        MAP_CONTROLS: 1000,
        DETAILS_MODAL: 10000,
        INSTALL_POPUP: 10000
    }
};

// Export for use in other modules
window.CONFIG = CONFIG;
