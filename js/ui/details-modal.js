// Details Modal Manager - Handles the project details popup

class DetailsModal {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.modal = document.getElementById('detailsModal');
        this.title = document.getElementById('detailsModalTitle');
        this.body = document.getElementById('detailsModalBody');
        this.closeBtn = document.getElementById('detailsModalClose');
        
        this.init();
    }

    init() {
        this.closeBtn.onclick = () => this.hide();
        
        // Close on backdrop click
        this.modal.onclick = (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        };

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });
    }

    show(project) {
        if (!project) return;

        // Set the title
        this.title.textContent = project.ProjectName || project.Name || 'Project Details';

        // Create the modal content
        const content = this.createModalContent(project);
        this.body.innerHTML = content;
        this.modal.classList.add('show');
    }

    createModalContent(project) {
        const imageUrl = this.dataManager.getArtworkImageUrl(project);
        const artworkInfo = this.dataManager.getArtworkInfo(project);
        let imageHtml = '';
        let artworkSection = '';
        
        if (imageUrl) {
            imageHtml = `<img src="${imageUrl}" alt="Artwork Image" class="details-modal-image" onerror="this.style.display='none'">`;
        } else {
            imageHtml = `<div class="details-modal-image-placeholder">🎨 No Artwork Available</div>`;
        }

        // Add artwork information if available
        if (artworkInfo) {
            artworkSection = `
                <div class="details-section">
                    <h3>🎨 Artwork</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="label">Title</span>
                            <span class="value">${artworkInfo.Title || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Description</span>
                            <span class="value">${artworkInfo.Description || 'No description available'}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            ${imageHtml}
            
            <div class="details-section">
                <h3>Description</h3>
                <p>${project.DescriptionLong || project.DescriptionShort || 'No description available.'}</p>
            </div>

            ${artworkSection}

            <div class="details-section">
                <h3>Project Information</h3>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="label">Project Name</span>
                        <span class="value">${project.ProjectName || project.Name || 'Not specified'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Category</span>
                        <span class="value">${project.ProjectCategory || project.College || 'Uncategorized'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Location</span>
                        <span class="value">${project.Location || 'Not specified'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Coordinates</span>
                        <span class="value">${project.Latitude ? `${project.Latitude}, ${project.Longitude}` : 'Not specified'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    hide() {
        this.modal.classList.remove('show');
    }

    isVisible() {
        return this.modal.classList.contains('show');
    }
}

// Export for use in other modules
window.DetailsModal = DetailsModal;
