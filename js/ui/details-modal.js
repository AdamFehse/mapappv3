// Details Modal Manager - Handles the project details popup

class DetailsModal {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.modalElement = document.getElementById('detailsModal');
        this.modal = new bootstrap.Modal(this.modalElement);
        this.title = document.getElementById('detailsModalLabel');
        this.body = document.getElementById('detailsModalBody');
        this.closeBtn = document.getElementById('detailsModalClose');
        
        this.init();
    }

    init() {
        // Bootstrap handles backdrop click and escape key automatically
        // No need for custom event listeners
    }

    show(project) {
        if (!project) return;

        // Set the title
        this.title.textContent = project.ProjectName || project.Name || 'Project Details';

        // Create the modal content
        const content = this.createModalContent(project);
        this.body.innerHTML = content;
        this.modal.show();
    }

    createModalContent(project) {
        const imageUrl = this.dataManager.getArtworkImageUrl(project);
        const artworkInfo = this.dataManager.getArtworkInfo(project);
        let imageHtml = '';
        let artworkSection = '';
        
        if (imageUrl) {
            imageHtml = `<img src="${imageUrl}" alt="Artwork Image" class="img-fluid rounded mb-3" style="max-height: 250px; object-fit: cover;" onerror="this.style.display='none'">`;
        } else {
            imageHtml = `<div class="bg-light rounded mb-3 d-flex align-items-center justify-content-center" style="height: 250px; color: #6c757d;">🎨 No Artwork Available</div>`;
        }

        // Add artwork information if available
        if (artworkInfo) {
            artworkSection = `
                <div class="mb-4">
                    <h5 class="text-primary border-bottom pb-2 mb-3">🎨 Artwork</h5>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="bg-light p-3 rounded">
                                <small class="text-muted fw-bold">Title</small>
                                <div class="text-dark">${artworkInfo.Title || 'Not specified'}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="bg-light p-3 rounded">
                                <small class="text-muted fw-bold">Description</small>
                                <div class="text-dark">${artworkInfo.Description || 'No description available'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            ${imageHtml}
            
            <div class="mb-4">
                <h5 class="text-primary border-bottom pb-2 mb-3">Description</h5>
                <p class="text-muted">${project.DescriptionLong || project.DescriptionShort || 'No description available.'}</p>
            </div>

            ${artworkSection}

            <div class="mb-4">
                <h5 class="text-primary border-bottom pb-2 mb-3">Project Information</h5>
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="bg-light p-3 rounded">
                            <small class="text-muted fw-bold">Project Name</small>
                            <div class="text-dark">${project.ProjectName || project.Name || 'Not specified'}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="bg-light p-3 rounded">
                            <small class="text-muted fw-bold">Category</small>
                            <div class="text-dark">${project.ProjectCategory || project.College || 'Uncategorized'}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="bg-light p-3 rounded">
                            <small class="text-muted fw-bold">Location</small>
                            <div class="text-dark">${project.Location || 'Not specified'}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="bg-light p-3 rounded">
                            <small class="text-muted fw-bold">Coordinates</small>
                            <div class="text-dark">${project.Latitude ? `${project.Latitude}, ${project.Longitude}` : 'Not specified'}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    hide() {
        this.modal.hide();
    }

    isVisible() {
        return this.modalElement.classList.contains('show');
    }
}

// Export for use in other modules
window.DetailsModal = DetailsModal;
