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
            html: `<div style="background-color: #2563eb; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);"></div>`,
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
            popupImageHtml = `<img src="${imageUrl}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 0.75rem; border: 1px solid #e2e8f0;" onerror="this.style.display='none'">`;
        }
        
        if (artworkInfo && artworkInfo.Title) {
            artworkTitleHtml = `<p style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: #7c3aed; font-style: italic;">🎨 ${artworkInfo.Title}</p>`;
        }

        return `
            <div style="min-width: 250px;">
                ${popupImageHtml}
                <h3 style="margin: 0 0 0.5rem 0; color: #2563eb; font-size: 1.1rem;">${project.ProjectName || project.Name || 'Project'}</h3>
                ${artworkTitleHtml}
                <p style="margin: 0 0 0.75rem 0; font-size: 0.9rem; color: #64748b;">${project.Location || 'Location not specified'}</p>
                <button onclick="showProjectDetails(${index})" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; width: 100%; font-weight: 500; transition: all 0.2s ease;">More Details</button>
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
                html: `<div style="background-color: ${isSelected ? '#dc2626' : '#2563eb'}; width: ${isSelected ? '20' : '16'}px; height: ${isSelected ? '20' : '16'}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(${isSelected ? '220, 38, 38' : '37, 99, 235'}, 0.4); ${isSelected ? 'animation: pulse 2s infinite;' : ''}"></div>`,
                iconSize: [isSelected ? 20 : 16, isSelected ? 20 : 16],
                iconAnchor: [isSelected ? 10 : 8, isSelected ? 10 : 8]
            });
            marker.setIcon(markerIcon);
        });
    }

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
