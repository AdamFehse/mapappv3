// PWA Manager - Handles Progressive Web App functionality with proper install prompt handling

class PWAManager {
    constructor() {
        this.installPrompt = null;
        this.installBtn = document.getElementById('installBtn');
        this.installModal = document.getElementById('installPopup');
        this.installConfirmBtn = document.getElementById('installConfirmBtn');
        this.installCancelBtn = document.getElementById('installCancelBtn');
        this.offlineIndicator = document.getElementById('offlineIndicator');
        
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.setupOfflineDetection();
        this.setupModalHandlers();
        this.checkInstallability();
    }

    setupInstallPrompt() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (event) => {
            console.log('👍', 'beforeinstallprompt', event);
            
            // Prevent the mini-infobar from appearing on mobile
            event.preventDefault();
            
            // Store the event so it can be triggered later
            this.installPrompt = event;
            
            // Show the install button in header
            if (this.installBtn) {
                this.installBtn.classList.remove('d-none');
                this.installBtn.addEventListener('click', () => this.showInstallModal());
            }
            
            
            //this.showInstallModal();
     
        });

        // Listen for the app being installed
        window.addEventListener('appinstalled', (event) => {
            console.log('👍', 'appinstalled', event);
            this.hideInstallUI();
            this.showInstallSuccess();
        });
    }

    setupModalHandlers() {
        // Handle install confirmation
        if (this.installConfirmBtn) {
            this.installConfirmBtn.addEventListener('click', async () => {
                await this.triggerInstall();
            });
        }

        // Handle install cancellation
        if (this.installCancelBtn) {
            this.installCancelBtn.addEventListener('click', () => {
                this.hideInstallModal();
                // Don't show the modal again for this session
                sessionStorage.setItem('installPromptDismissed', 'true');
            });
        }
        
        // Handle modal close events to ensure backdrop cleanup
        if (this.installModal) {
            this.installModal.addEventListener('hidden.bs.modal', () => {
                // Force cleanup when modal is hidden by any means (close button, ESC, backdrop click)
                setTimeout(() => {
                    const backdrops = document.querySelectorAll('.modal-backdrop');
                    backdrops.forEach(backdrop => backdrop.remove());
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }, 100);
            });
        }
    }

    async triggerInstall() {
        if (!this.installPrompt) {
            console.log('Install prompt not available');
            this.hideInstallModal();
            return;
        }

        try {
            // Hide modal first to prevent backdrop issues
            this.hideInstallModal();
            
            // Wait a moment for modal to close cleanly
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Show the install prompt
            const result = await this.installPrompt.prompt();
            console.log(`Install prompt result: ${result.outcome}`);

            // Handle the result
            if (result.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }

            // Clear the install prompt as it can only be used once
            this.installPrompt = null;
            this.hideInstallUI();

        } catch (error) {
            console.error('Error triggering install prompt:', error);
            this.hideInstallModal();
        }
    }

    showInstallModal() {
        // Don't show if user has already dismissed it this session
        if (sessionStorage.getItem('installPromptDismissed') === 'true') {
            return;
        }

        // Don't show if already installed or no install prompt available
        if (!this.installPrompt || this.isAppInstalled()) {
            return;
        }

        if (this.installModal) {
            const modal = new bootstrap.Modal(this.installModal);
            modal.show();
        }
    }

    hideInstallModal() {
        if (this.installModal) {
            const modal = bootstrap.Modal.getInstance(this.installModal);
            if (modal) {
                modal.hide();
            }
            
            // Force cleanup of backdrop and modal state
            setTimeout(() => {
                // Remove any lingering backdrops
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(backdrop => backdrop.remove());
                
                // Remove modal-open class from body
                document.body.classList.remove('modal-open');
                
                // Reset body styles that Bootstrap might have modified
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                
                // Ensure the modal is properly hidden
                this.installModal.style.display = 'none';
                this.installModal.classList.remove('show');
                this.installModal.setAttribute('aria-hidden', 'true');
            }, 300); // Wait for Bootstrap animation to complete
        }
    }

    hideInstallUI() {
        if (this.installBtn) {
            this.installBtn.classList.add('d-none');
        }
        this.hideInstallModal();
    }

    showInstallSuccess() {
        // Show a success message
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        successAlert.style.zIndex = '1050';
        successAlert.innerHTML = `
            🎉 App installed successfully!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(successAlert);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successAlert.parentNode) {
                successAlert.remove();
            }
        }, 5000);
    }

    setupOfflineDetection() {
        const updateOnlineStatus = () => {
            if (this.offlineIndicator) {
                if (navigator.onLine) {
                    this.offlineIndicator.classList.add('d-none');
                } else {
                    this.offlineIndicator.classList.remove('d-none');
                }
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus(); // Check initial status
    }

    checkInstallability() {
        // Check if app is already installed
        if (this.isAppInstalled()) {
            this.hideInstallUI();
            return;
        }

        // Check if running in standalone mode (already installed)
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            this.hideInstallUI();
            return;
        }

        // For iOS Safari, show install instructions if not installed
        if (this.isIOSDevice() && !this.isAppInstalled()) {
            // You could show iOS-specific install instructions here
            console.log('iOS device detected - install via Share > Add to Home Screen');
        }
    }

    isAppInstalled() {
        // Check if running in standalone mode
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true ||
               document.referrer.includes('android-app://');
    }

    isIOSDevice() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // Public method to manually trigger install (can be called from anywhere)
    static triggerInstallPrompt() {
        if (window.pwaManager && window.pwaManager.installPrompt) {
            window.pwaManager.showInstallModal();
        }
    }
}

// Initialize PWA Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
});

// Export for use in other modules
window.PWAManager = PWAManager;
