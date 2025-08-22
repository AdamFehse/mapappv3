// PWA Manager - Handles installation and offline functionality

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.installBtn = document.getElementById('installBtn');
        this.offlineIndicator = document.getElementById('offlineIndicator');
        this.installPopup = document.getElementById('installPopup');
        
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.setupInstallPopup();
        this.setupOfflineDetection();
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            if (this.installBtn) {
                this.installBtn.style.display = 'block';
            }
        });

        if (this.installBtn) {
            this.installBtn.addEventListener('click', () => {
                this.showInstallPopup();
            });
        }
    }

    setupInstallPopup() {
        const confirmBtn = document.getElementById('installConfirmBtn');
        const cancelBtn = document.getElementById('installCancelBtn');

        if (confirmBtn) {
            confirmBtn.addEventListener('click', async () => {
                await this.installApp();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideInstallPopup();
            });
        }

        if (this.installPopup) {
            this.installPopup.addEventListener('click', (e) => {
                if (e.target === this.installPopup) {
                    this.hideInstallPopup();
                }
            });
        }
    }

    setupOfflineDetection() {
        const updateOnlineStatus = () => {
            if (!navigator.onLine) {
                this.offlineIndicator.classList.add('show');
            } else {
                this.offlineIndicator.classList.remove('show');
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();
    }

    showInstallPopup() {
        if (this.installPopup) {
            this.installPopup.classList.add('show');
        }
    }

    hideInstallPopup() {
        if (this.installPopup) {
            this.installPopup.classList.remove('show');
        }
    }

    async installApp() {
        if (this.deferredPrompt) {
            this.hideInstallPopup();
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('PWA installed successfully');
                if (this.installBtn) {
                    this.installBtn.style.display = 'none';
                }
                this.showInstallSuccess();
            }
            this.deferredPrompt = null;
        }
    }

    showInstallSuccess() {
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
        `;
        successMessage.innerHTML = '✅ App installed successfully!';
        document.body.appendChild(successMessage);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }
}

// Export for use in other modules
window.PWAManager = PWAManager;
