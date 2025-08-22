// Data Manager - Handles fetching and managing project data

class DataManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.categories = [];
        this.currentProjectIndex = 0;
        this.currentCategory = '';
    }

    async fetchProjects() {
        try {
            const response = await fetch(CONFIG.PROJECTS_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.projects = await response.json();
            this.extractCategories();
            this.filteredProjects = [...this.projects];
            
            console.log(`Loaded ${this.projects.length} projects with ${this.categories.length} categories`);
            return true;
        } catch (error) {
            console.error('Error fetching projects:', error);
            return false;
        }
    }

    extractCategories() {
        this.categories = [...new Set(
            this.projects
                .map(project => project.ProjectCategory)
                .filter(Boolean)
        )];
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.currentProjectIndex = 0;
        
        if (category === '') {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = this.projects.filter(
                project => project.ProjectCategory === category
            );
        }
        
        return this.filteredProjects;
    }

    getCurrentProject() {
        return this.filteredProjects[this.currentProjectIndex] || null;
    }

    setCurrentProjectIndex(index) {
        if (index >= 0 && index < this.filteredProjects.length) {
            this.currentProjectIndex = index;
            return true;
        }
        return false;
    }

    getProfileImageUrl(project) {
        // Get the profile image for project list
        if (project.ImageUrl && project.ImageUrl.trim() !== '') {
            return project.ImageUrl;
        }
        return null;
    }

    getArtworkImageUrl(project) {
        // Get the first artwork image for popups and modals
        if (project.HasArtwork && project.Artworks && Array.isArray(project.Artworks) && project.Artworks.length > 0 && project.Artworks[0]) {
            return project.Artworks[0].ImageUrl;
        }
        return null;
    }

    getArtworkInfo(project) {
        if (project.HasArtwork && project.Artworks && Array.isArray(project.Artworks) && project.Artworks.length > 0) {
            return project.Artworks[0];
        }
        return null;
    }

    getProjectCount() {
        return this.filteredProjects.length;
    }

    getCategories() {
        return this.categories;
    }

    getFilteredProjects() {
        return this.filteredProjects;
    }
}

// Export for use in other modules
window.DataManager = DataManager;
