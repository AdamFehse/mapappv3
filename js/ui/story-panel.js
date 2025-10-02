// Story Panel Manager - Handles sidebar content and navigation controls

class StoryPanel {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.storyList = document.getElementById('storyList');
        this.categoryButtons = document.getElementById('categoryButtons');
        this.projectCount = document.getElementById('projectCount');
        
        // Initialize navigation controls positioning
        this.initNavigationControls();
    }

    initNavigationControls() {
        const sidebarElement = document.getElementById('projectSidebar');
        const navigationControls = document.getElementById('navigationControls');
        const SIDEBAR_WIDTH = 400;
        const TOGGLE_WIDTH = 56;

        if (sidebarElement && navigationControls) {
            // Listen for sidebar collapse/expand events
            sidebarElement.addEventListener('shown.bs.collapse', () => {
                // Sidebar is now open - shift nav controls to the right
                navigationControls.style.left = `${SIDEBAR_WIDTH + TOGGLE_WIDTH}px`;
            });

            sidebarElement.addEventListener('hidden.bs.collapse', () => {
                // Sidebar is now closed - move nav controls back
                navigationControls.style.left = `${TOGGLE_WIDTH}px`;
            });

            // Initialize position (sidebar starts open with 'show' class)
            const isOpen = sidebarElement.classList.contains('show');
            navigationControls.style.left = isOpen ? `${SIDEBAR_WIDTH + TOGGLE_WIDTH}px` : `${TOGGLE_WIDTH}px`;
        }
    }

    renderCategoryWordCloud() {
        const categories = this.dataManager.getCategories();
        const wordCloud = document.getElementById('categoryWordCloud');
        if (!wordCloud) return;
        
        wordCloud.innerHTML = '';
        
        if (!categories || categories.length === 0) {
            wordCloud.innerHTML = '<p class="text-muted text-center py-3">No categories available</p>';
            return;
        }

        // Get counts for each category - match the actual field name
        const allProjects = this.dataManager.projects || [];
        const categoryCounts = {};
        
        categories.forEach(category => {
            categoryCounts[category] = allProjects.filter(p => 
                p.ProjectCategory === category
            ).length;
        });

        // Sort by count (most popular first) for better visual hierarchy
        const sortedCategories = [...categories].sort((a, b) => 
            categoryCounts[b] - categoryCounts[a]
        );

        // Calculate font sizes based on actual counts
        const maxCount = Math.max(...Object.values(categoryCounts));
        const minCount = Math.min(...Object.values(categoryCounts));
        
        // Create a title/header
        const header = document.createElement('div');
        header.className = 'd-flex justify-content-between align-items-center mb-2';
        header.innerHTML = `
            <small class="text-muted fw-bold">BROWSE BY CATEGORY</small>
            <small class="text-muted">${categories.length} categories</small>
        `;
        wordCloud.appendChild(header);

        // Create word cloud container
        const cloudContainer = document.createElement('div');
        cloudContainer.className = 'd-flex flex-wrap gap-2 align-items-center justify-content-center py-2';
        
        sortedCategories.forEach(category => {
            const count = categoryCounts[category];
            const percentage = maxCount > minCount ? (count - minCount) / (maxCount - minCount) : 0.5;
            
            // Scale font size between 0.85rem and 1.5rem based on count
            const fontSize = 0.85 + (percentage * 0.65);
            
            // Create button instead of span for better interaction
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm position-relative';
            btn.style.fontSize = `${fontSize}rem`;
            btn.style.fontWeight = percentage > 0.6 ? '700' : '600';
            btn.style.transition = 'all 0.2s ease';
            btn.style.padding = '0.25rem 0.75rem';
            btn.style.border = '2px solid transparent';
            
            // Color based on selection state
            const isActive = this.dataManager.currentCategory === category;
            if (isActive) {
                btn.className += ' btn-primary';
            } else {
                btn.className += ' btn-outline-secondary';
                btn.style.color = '#6c757d';
            }
            
            btn.innerHTML = `
                ${category}
                <span class="badge bg-light text-dark ms-1" style="font-size: 0.65rem;">${count}</span>
            `;
            
            // Hover effects
            btn.onmouseenter = () => {
                if (!isActive) {
                    btn.style.transform = 'scale(1.1)';
                    btn.style.borderColor = '#0d6efd';
                    btn.style.color = '#0d6efd';
                }
            };
            
            btn.onmouseleave = () => {
                if (!isActive) {
                    btn.style.transform = 'scale(1)';
                    btn.style.borderColor = 'transparent';
                    btn.style.color = '#6c757d';
                }
            };
            
            btn.onclick = () => filterByCategory(category);
            
            cloudContainer.appendChild(btn);
        });
        
        wordCloud.appendChild(cloudContainer);

        // Add "Show All" button at the bottom
        const showAllBtn = document.createElement('button');
        showAllBtn.className = 'btn btn-sm btn-link text-muted w-100 mt-2';
        showAllBtn.textContent = this.dataManager.currentCategory ? 'Show All Categories' : 'All categories shown';
        showAllBtn.disabled = !this.dataManager.currentCategory;
        showAllBtn.onclick = () => filterByCategory('');
        wordCloud.appendChild(showAllBtn);
    }

    renderCategories() {
        // Just render the word cloud (removed duplicate legacy code)
        this.renderCategoryWordCloud();
    }

    renderProjects() {
        const projects = this.dataManager.getFilteredProjects();
        const storyList = document.getElementById('storyList');
        
        if (!storyList) return;

        this.updateProjectCount(projects.length);
        
        if (projects.length === 0) {
            storyList.innerHTML = '<div class="text-center text-muted py-4">No projects found for this category.</div>';
            return;
        }
        
        storyList.innerHTML = projects.map((project, index) => {
            const imageUrl = this.dataManager.getProfileImageUrl(project);
            let imageHtml = '';
            
            if (imageUrl) {
                imageHtml = `<img src="${imageUrl}" alt="Project Image" class="card-img-top bg-light w-100 rounded mb-3 border" style="height: 180px; object-fit: contain;" onerror="this.style.display='none'">`;
            } else {
                imageHtml = `<div class="card-img-top bg-light d-flex align-items-center justify-content-center text-secondary" style="height: 150px;">📷 No Image Available</div>`;
            }
            
            const isActive = index === this.dataManager.currentProjectIndex;
            
            return `
                <div class="card mb-3 shadow-sm ${isActive ? 'border-primary border-2' : 'border-0'}" 
                     style="cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;"
                     onclick="showProjectWithPopup(${index})"
                     onmouseenter="this.style.transform='translateY(-4px)'; this.classList.add('shadow');"
                     onmouseleave="this.style.transform='translateY(0)'; this.classList.remove('shadow');">
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