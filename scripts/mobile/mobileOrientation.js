/**
 * Mobile Orientation Management - Handles orientation detection and portrait warning
 * @class
 */
class MobileOrientation {
    /**
     * Creates an instance of MobileOrientation
     * @param {Game} game - The main game instance
     */
    constructor(game) {
        this.game = game;
        this.isPortrait = false;
        this.showPortraitWarning = false;
    }

    /**
     * Sets up orientation detection
     * @public
     */
    setupOrientationDetection() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        if (isIOS && isSafari) {
            this.setupIOSOrientationDetection();
        } else {
            this.setupStandardOrientationDetection();
        }
    }

    /**
     * Sets up iOS orientation detection
     * @private
     */
    setupIOSOrientationDetection() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateOrientation(), 100);
        });
        
        window.addEventListener('resize', () => {
            setTimeout(() => this.updateOrientation(), 100);
        });
    }

    /**
     * Sets up standard orientation detection
     * @private
     */
    setupStandardOrientationDetection() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateOrientation(), 100);
        });
        
        window.addEventListener('resize', () => {
            setTimeout(() => this.updateOrientation(), 100);
        });
        
        if (screen.orientation) {
            screen.orientation.addEventListener('change', () => {
                setTimeout(() => this.updateOrientation(), 100);
            });
        }
    }

    /**
     * Updates orientation
     * @public
     */
    updateOrientation() {
        const isPortrait = this.detectPortraitOrientation();
        this.isPortrait = isPortrait;
        this.showPortraitWarning = isPortrait;
        
        if (this.game.mobileCanvas) {
            this.game.mobileCanvas.resizeCanvas();
        }
        this.updateOrientationUI();
    }

    /**
     * Detects portrait orientation
     * @private
     * @returns {boolean} True if in portrait mode
     */
    detectPortraitOrientation() {
        const windowRatio = window.innerHeight / window.innerWidth;
        const screenRatio = screen.height / screen.width;
        const orientation = window.orientation;
        
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        if (isIOS && isSafari) {
            return windowRatio > 1.0;
        } else {
            return windowRatio > 1.2 || 
                   screenRatio > 1.2 || 
                   (orientation !== undefined && (orientation === 0 || orientation === 180));
        }
    }

    /**
     * Updates UI based on orientation
     * @private
     */
    updateOrientationUI() {
        const warning = document.getElementById('portrait-warning');
        if (warning) {
            warning.style.display = this.showPortraitWarning ? 'flex' : 'none';
        }
        
        const controls = document.getElementById('mobile-controls');
        if (controls) {
            controls.style.display = this.showPortraitWarning ? 'none' : 'flex';
        }
    }

    /**
     * Updates orientation in game loop
     * @public
     */
    update() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        if (isIOS && isSafari) {
            if (this.game.frameCount % 10 === 0) {
                this.updateOrientation();
            }
        } else {
            if (this.game.frameCount % 30 === 0) {
                this.updateOrientation();
            }
        }
    }

    /**
     * Gets portrait warning status
     * @public
     * @returns {boolean} True if portrait warning should be shown
     */
    getShowPortraitWarning() {
        return this.showPortraitWarning;
    }

    /**
     * Gets portrait status
     * @public
     * @returns {boolean} True if in portrait mode
     */
    getIsPortrait() {
        return this.isPortrait;
    }
}
