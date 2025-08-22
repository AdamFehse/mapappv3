// Story Panel Manager - Handles the left sidebar project list

class StoryPanel {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.storyList = document.getElementById('storyList');
        this.categoryButtons = document.getElementById('categoryButtons');
    }

    renderCategories() {
        const categories = this.dataManager.getCategories();
        const allCategoriesBtn = `<button class="category-btn ${this.dataManager.currentCategory === '' ? 'active' : ''}" onclick="filterByCategory('')">All Categories</button>`;
        const categoryBtns = categories.map(category => 
            `<button class="category-btn ${this.dataManager.currentCategory === category ? 'active' : ''}" onclick="filterByCategory('${category}')">${category}</button>`
        ).join('');
        
        this.categoryButtons.innerHTML = allCategoriesBtn + categoryBtns;
    }

    renderProjects() {
        const projects = this.dataManager.getFilteredProjects();
        
        if (projects.length === 0) {
            this.storyList.innerHTML = '<div class="loading">No projects found for this category.</div>';
            return;
        }

        this.storyList.innerHTML = projects.map((project, index) => {
            const imageUrl = this.dataManager.getProfileImageUrl(project);
            let imageHtml = '';
            
            if (imageUrl) {
                imageHtml = `<img src="${imageUrl}" alt="Project Image" class="project-image" onerror="this.style.display='none'">`;
            } else {
                imageHtml = `<div class="image-placeholder">📷 No Image Available</div>`;
            }

            return `
                <div class="story-item ${index === this.dataManager.currentProjectIndex ? 'active' : ''}" 
                     onclick="showProjectWithPopup(${index})">
                    ${imageHtml}
                    <h3>${project.ProjectName || project.Name || 'Project'}</h3>
                    ${this.dataManager.getArtworkInfo(project) ? `<div class="artwork-indicator">🎨 Has Artwork</div>` : ''}
                    <div class="location">📍 ${project.Location || 'Location not specified'}</div>
                    <div class="category">${project.ProjectCategory || project.College || 'Uncategorized'}</div>
                    <div class="view-details-hint">Click to select and view on map →</div>
                </div>
            `;
        }).join('');
    }

    updateActiveProject() {
        const storyItems = this.storyList.querySelectorAll('.story-item');
        storyItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.dataManager.currentProjectIndex);
        });
    }

    showError(message) {
        this.storyList.innerHTML = `<div class="error">Error loading projects: ${message}</div>`;
    }
}

// Export for use in other modules
window.StoryPanel = StoryPanel;
