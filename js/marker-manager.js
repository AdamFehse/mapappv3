// Marker Manager - Handles map markers and popups

class MarkerManager {
    constructor(mapManager) {
        this.mapManager = mapManager;
        this.markers = [];
        this.dataManager = null;
    }

    setDataManager(dataManager) {
        this.dataManager = dataManager;
    }

    addMarkersToMap() {
        this.clearMarkers();
        
        const projects = this.dataManager.getFilteredProjects();
        
        projects.forEach((project, index) => {
            if (project.Latitude && project.Longitude) {
                const marker = this.createMarker(project, index);
                this.markers.push(marker);
            }
        });
    }

    createMarker(project, index) {
        const markerIcon = this.createMarkerIcon();
        
        const marker = L.marker([project.Latitude, project.Longitude], {
            icon: markerIcon
        })
        .addTo(this.mapManager.getMap())
        .bindPopup(this.createPopupContent(project, index));
        
        marker.on('click', () => this.onMarkerClick(index));
        
        return marker;
    }

    createMarkerIcon() {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="bg-primary rounded-circle border border-white shadow" style="width: 16px; height: 16px;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
    }

    createPopupContent(project, index) {
        const imageUrl = this.dataManager.getArtworkImageUrl(project);
        const artworkInfo = this.dataManager.getArtworkInfo(project);
        let popupImageHtml = '';
        let artworkTitleHtml = '';
        
        if (imageUrl) {
            popupImageHtml = `<img src="${imageUrl}" class="w-100 rounded mb-3 border" style="height: 120px; object-fit: cover;" onerror="this.style.display='none'">`;
        }
        
        if (artworkInfo && artworkInfo.Title) {
            artworkTitleHtml = `<p class="mb-2 fst-italic text-primary-emphasis small">🎨 ${artworkInfo.Title}</p>`;
        }

        return `
            <div style="min-width: 250px;">
                ${popupImageHtml}
                <h3 class="mb-2 text-primary fs-5 fw-bold">${project.ProjectName || project.Name || 'Project'}</h3>
                ${artworkTitleHtml}
                <p class="mb-3 text-secondary small">${project.Location || 'Location not specified'}</p>
                <button onclick="showProjectDetails(${index})" class="btn btn-success w-100 fw-medium">More Details</button>
            </div>
        `;
    }

    onMarkerClick(index) {
        if (window.showProject) {
            window.showProject(index);
        }
    }

    highlightMarker(index) {
        this.markers.forEach((marker, i) => {
            const isSelected = i === index;
            const markerIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="${isSelected ? 'bg-danger' : 'bg-primary'} rounded-circle border border-white shadow" style="width: ${isSelected ? '20' : '16'}px; height: ${isSelected ? '20' : '16'}px;"></div>`,
                iconSize: [isSelected ? 20 : 16, isSelected ? 20 : 16],
                iconAnchor: [isSelected ? 10 : 8, isSelected ? 10 : 8]
            });
            marker.setIcon(markerIcon);
        });
    }

    clearHighlights() {
    this.markers.forEach((marker) => {
        // Close any open popups
        marker.closePopup();
        
        // Reset marker icon to default
        const markerIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="bg-primary rounded-circle border border-white shadow" style="width: 16px; height: 16px;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        marker.setIcon(markerIcon);
    });
}s

    clearMarkers() {
        this.markers.forEach(marker => {
            this.mapManager.getMap().removeLayer(marker);
        });
        this.markers = [];
    }

    getMarkers() {
        return this.markers;
    }
}

// Export for use in other modules
window.MarkerManager = MarkerManager;
