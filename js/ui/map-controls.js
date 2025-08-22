// Map Controls Manager - Handles map mode switching and navigation

class MapControls {
    constructor(mapManager, appController) {
        this.mapManager = mapManager;
        this.appController = appController;
        this.currentMapMode = 'base';
        
        this.init();
    }

    init() {
        this.setupMapModeControls();
        this.setupNavigationControls();
    }

    setupMapModeControls() {
        const baseMapBtn = document.getElementById('baseMapBtn');
        const satelliteBtn = document.getElementById('satelliteBtn');
        const maskBtn = document.getElementById('maskBtn');

        if (baseMapBtn) baseMapBtn.addEventListener('click', () => this.setMapMode('base'));
        if (satelliteBtn) satelliteBtn.addEventListener('click', () => this.setMapMode('satellite'));
        if (maskBtn) maskBtn.addEventListener('click', () => this.setMapMode('mask'));
        
        this.updateMapModeButtons();
    }

    setupNavigationControls() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const resetBtn = document.getElementById('resetBtn');
        const centerBtn = document.getElementById('centerBtn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.appController.previousProject());
        if (nextBtn) nextBtn.addEventListener('click', () => this.appController.nextProject());
        if (resetBtn) resetBtn.addEventListener('click', () => this.appController.resetView());
        if (centerBtn) centerBtn.addEventListener('click', () => this.appController.centerMap());
    }

    setMapMode(mode) {
        if (this.currentMapMode === mode) return;
        
        // Remove mask effect when switching away from mask mode
        if (this.currentMapMode === 'mask') {
            this.mapManager.removeMaskEffect();
        }
        
        this.currentMapMode = mode;
        this.mapManager.setMapMode(mode);
        this.updateMapModeButtons();
    }

    updateMapModeButtons() {
        // Remove active class from all buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to current mode
        const activeBtn = document.getElementById(`${this.currentMapMode}Btn`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    getCurrentMode() {
        return this.currentMapMode;
    }
}

// Export for use in other modules
window.MapControls = MapControls;
