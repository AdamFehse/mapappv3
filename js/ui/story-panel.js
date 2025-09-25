// Story Panel Manager - Simple implementation with toggle button visibility control

class StoryPanel {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.storyList = document.getElementById('storyList');
        this.categoryButtons = document.getElementById('categoryButtons');
        this.projectCount = document.getElementById('projectCount');
        
        // Initialize toggle button visibility control
        this.initToggleButton();
    }

    initToggleButton() {
        const offcanvasElement = document.getElementById('projectSidebar');
        const toggleButton = document.getElementById('sidebarToggleBtn');
        const navigationControls = document.getElementById('navigationControls');
        
        if (offcanvasElement && toggleButton) {
            // Show toggle button when offcanvas is hidden
            offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
                toggleButton.classList.remove('d-none');
                
                // Reset navigation controls position
                if (navigationControls) {
                    navigationControls.style.transform = 'translateX(0)';
                }
            });
            
            // Hide toggle button when offcanvas is shown
            offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
                toggleButton.classList.add('d-none');
                
                // Move navigation controls to the right when sidebar opens
                if (navigationControls) {
                    navigationControls.style.transform = 'translateX(400px)';
                    navigationControls.style.transition = 'transform 0.3s ease';
                }
            });
            
            // Since offcanvas starts closed, toggle button should be visible
            // (no need to hide it initially)
        }
    }

    renderCategories() {
        const categories = this.dataManager.getCategories();
        // Large screen mini-sidebar
        const miniSidebar = document.querySelector('.mini-sidebar');
        if (miniSidebar) {
            // Clear except for toggle button if present
            miniSidebar.innerHTML = '';
            // All categories button
            const allBtn = document.createElement('button');
            allBtn.className = 'sidebar-icon-btn' + (this.dataManager.currentCategory === '' ? ' active' : '');
            allBtn.title = 'All Categories';
            allBtn.onclick = () => filterByCategory('');
            allBtn.innerHTML = `<i class="bi bi-list"></i><span class="sidebar-label">All</span>`;
            miniSidebar.appendChild(allBtn);
            // Category buttons
            categories.forEach(category => {
                const btn = document.createElement('button');
                btn.className = 'sidebar-icon-btn' + (this.dataManager.currentCategory === category ? ' active' : '');
                btn.title = category;
                btn.onclick = () => filterByCategory(category);
                btn.innerHTML = `<i class="bi bi-tag"></i><span class="sidebar-label">${category}</span>`;
                miniSidebar.appendChild(btn);
            });
        }
        // Small screen offcanvas
        const offcanvasCat = document.getElementById('offcanvasCategoryButtons');
        if (offcanvasCat) {
            offcanvasCat.innerHTML = '';
            const allBtn = document.createElement('button');
            allBtn.className = 'btn btn-outline-primary btn-sm m-1' + (this.dataManager.currentCategory === '' ? ' active' : '');
            allBtn.onclick = () => filterByCategory('');
            allBtn.textContent = 'All Categories';
            offcanvasCat.appendChild(allBtn);
            categories.forEach(category => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline-primary btn-sm m-1' + (this.dataManager.currentCategory === category ? ' active' : '');
                btn.onclick = () => filterByCategory(category);
                btn.textContent = category;
                offcanvasCat.appendChild(btn);
            });
        }
    }

    renderProjects() {
        const projects = this.dataManager.getFilteredProjects();
        // Large screen: (optional) you can show a tooltip or modal, or skip rendering the list in the mini-sidebar
        // Small screen: render into offcanvas
        const offcanvasStoryList = document.getElementById('offcanvasStoryList');
        if (offcanvasStoryList) {
            // Update project count (optional)
            this.updateProjectCount(projects.length);
            if (projects.length === 0) {
                offcanvasStoryList.innerHTML = '<div class="text-center text-muted py-4">No projects found for this category.</div>';
                return;
            }
            offcanvasStoryList.innerHTML = projects.map((project, index) => {
                const imageUrl = this.dataManager.getProfileImageUrl(project);
                let imageHtml = '';
                if (imageUrl) {
                    imageHtml = `<img src="${imageUrl}" alt="Project Image" class="card-img-top bg-light" style="height: 180px; object-fit: contain; width: 100%;" onerror="this.style.display='none'">`;
                } else {
                    imageHtml = `<div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 150px; color: #6c757d;">📷 No Image Available</div>`;
                }
                return `
                    <div class="card mb-3 shadow-sm border-0 ${index === this.dataManager.currentProjectIndex ? 'border-primary border-2' : ''}" 
                         style="cursor: pointer; transition: all 0.2s ease;"
                         onclick="showProjectWithPopup(${index})"
                         onmouseover="this.classList.add('shadow'); this.style.transform='translateY(-2px)';"
                         onmouseout="this.classList.remove('shadow'); this.style.transform='translateY(0)';">
                        ${imageHtml}
                        <div class="card-body">
                            <h5 class="card-title text-primary fw-bold">${project.ProjectName || project.Name || 'Project'}</h5>
                            ${this.dataManager.getArtworkInfo && this.dataManager.getArtworkInfo(project) ? `<span class="badge bg-success text-white mb-2">🎨 Has Artwork</span>` : ''}
                            <p class="card-text text-muted small mb-1">📍 ${project.Location || 'Location not specified'}</p>
                            <span class="badge bg-secondary">${project.ProjectCategory || project.College || 'Uncategorized'}</span>
                            <div class="mt-2 text-center">
                                <small class="text-muted">Click to view on map →</small>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
    
    updateProjectCount(count) {
        if (!this.projectCount) return;
        
        const total = this.dataManager.getAllProjects ? this.dataManager.getAllProjects().length : count;
        if (this.dataManager.currentCategory && this.dataManager.currentCategory !== '') {
            this.projectCount.textContent = `Showing ${count} of ${total} projects in "${this.dataManager.currentCategory}"`;
        } else {
            this.projectCount.textContent = `Showing all ${count} projects`;
        }
    }

    updateActiveProject() {
        if (!this.storyList) return;
        
        const storyItems = this.storyList.querySelectorAll('.card');
        storyItems.forEach((item, index) => {
            if (index === this.dataManager.currentProjectIndex) {
                item.classList.add('border-primary', 'border-2');
                item.classList.remove('border-0');
                
                // Scroll active project into view
                setTimeout(() => {
                    item.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                    });
                }, 100);
            } else {
                item.classList.remove('border-primary', 'border-2');
                item.classList.add('border-0');
            }
        });
    }

    showError(message) {
        if (this.storyList) {
            this.storyList.innerHTML = `<div class="alert alert-danger m-3">Error loading projects: ${message}</div>`;
        }
        this.updateProjectCount(0);
    }
}

// Export for use in other modules
window.StoryPanel = StoryPanel;
