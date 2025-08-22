// Main App Controller - Orchestrates all components

class AppController {
    constructor() {
        this.dataManager = new DataManager();
        this.mapManager = new MapManager();
        this.markerManager = new MarkerManager(this.mapManager);
        this.storyPanel = new StoryPanel(this.dataManager);
        this.detailsModal = new DetailsModal(this.dataManager);
        
        this.init();
    }

    async init() {
        // Initialize map
        this.mapManager.init('map');
        
        // Set up marker manager
        this.markerManager.setDataManager(this.dataManager);
        
        // Fetch projects
        const success = await this.dataManager.fetchProjects();
        if (!success) {
            this.storyPanel.showError('Failed to load projects');
            return;
        }
        
        // Initialize UI
        this.storyPanel.renderCategories();
        this.storyPanel.renderProjects();
        this.markerManager.addMarkersToMap();
        
        // Show first project if available
        if (this.dataManager.getProjectCount() > 0) {
            this.showProject(0);
        }
        
        // Set up global functions
        this.setupGlobalFunctions();
        
        console.log('App initialized successfully');
    }

    setupGlobalFunctions() {
        // Make functions globally available
        window.filterByCategory = (category) => this.filterByCategory(category);
        window.showProject = (index) => this.showProject(index);
        window.showProjectWithPopup = (index) => this.showProjectWithPopup(index);
        window.showProjectDetails = (index) => this.showProjectDetails(index);
        window.updateNavigation = () => this.updateNavigation();
    }

    filterByCategory(category) {
        this.dataManager.filterByCategory(category);
        this.storyPanel.renderCategories();
        this.storyPanel.renderProjects();
        this.markerManager.addMarkersToMap();
        this.updateNavigation();
        
        if (this.dataManager.getProjectCount() > 0) {
            this.showProject(0);
        }
    }

    showProject(index) {
        if (this.dataManager.setCurrentProjectIndex(index)) {
            this.storyPanel.updateActiveProject();
            this.updateNavigation();
            
            const project = this.dataManager.getCurrentProject();
            if (project && project.Latitude && project.Longitude) {
                this.mapManager.centerOnProject(project.Latitude, project.Longitude);
                this.markerManager.highlightMarker(index);
            }
        }
    }

    showProjectDetails(index) {
        const project = this.dataManager.getFilteredProjects()[index];
        if (!project) return;

        // First select the project
        this.showProject(index);
        
        // Then show details modal
        this.detailsModal.show(project);
    }

    showProjectWithPopup(index) {
        if (this.dataManager.setCurrentProjectIndex(index)) {
            this.storyPanel.updateActiveProject();
            this.updateNavigation();
            
            const project = this.dataManager.getCurrentProject();
            if (project && project.Latitude && project.Longitude) {
                this.mapManager.centerOnProject(project.Latitude, project.Longitude);
                this.markerManager.highlightMarker(index);
                
                // Open the popup for the selected marker
                const markers = this.markerManager.getMarkers();
                if (markers[index]) {
                    markers[index].openPopup();
                }
            }
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.disabled = this.dataManager.currentProjectIndex === 0;
        if (nextBtn) nextBtn.disabled = this.dataManager.currentProjectIndex === this.dataManager.getProjectCount() - 1;
    }

    // Navigation methods
    previousProject() {
        if (this.dataManager.currentProjectIndex > 0) {
            this.showProject(this.dataManager.currentProjectIndex - 1);
        }
    }

    nextProject() {
        if (this.dataManager.currentProjectIndex < this.dataManager.getProjectCount() - 1) {
            this.showProject(this.dataManager.currentProjectIndex + 1);
        }
    }

    resetView() {
        this.showProject(0);
    }

    centerMap() {
        const project = this.dataManager.getCurrentProject();
        if (project && project.Latitude && project.Longitude) {
            this.mapManager.centerOnProject(project.Latitude, project.Longitude);
        }
    }
}

// Export for use in other modules
window.AppController = AppController;
