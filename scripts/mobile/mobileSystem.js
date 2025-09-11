/**
 * Mobile System - Main mobile management class that coordinates all mobile modules
 * @class
 */
class MobileSystem {
    /**
     * Creates an instance of MobileSystem
     * @param {Game} game - The main game instance
     */
    constructor(game) {
        this.game = game;
        this.isMobile = this.detectMobile();
        
        this.initializeModules();
        
        if (this.isMobile) {
            this.init();
        } else {
            this.checkAndShowMobileControls();
        }
    }

    /**
     * Detects if device is mobile
     * @public
     * @returns {boolean} True if mobile device
     */
    detectMobile() {
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        const isTablet = /iPad|Android/i.test(navigator.userAgent) || 
                        (hasTouch && window.innerWidth >= 768 && window.innerWidth <= 1600);

        const isTouchScreen = hasTouch;
        
        const isSmallTouchScreen = window.innerWidth <= 1600 && hasTouch;
        
        const isMobile = isMobileDevice || isTouchScreen || isTablet || isSmallTouchScreen;
        
        return isMobile;
    }

    /**
     * Initializes mobile modules
     * @private
     */
    initializeModules() {
        this.mobileCanvas = new MobileCanvas(this.game);
        this.mobileControls = new MobileControls(this.game);
        this.mobileOrientation = new MobileOrientation(this.game);
        this.mobileEvents = new MobileEvents(this.game, this.mobileControls, this.mobileOrientation);
        
        this.game.mobileCanvas = this.mobileCanvas;
        this.game.mobileControls = this.mobileControls;
        this.game.mobileOrientation = this.mobileOrientation;
        this.game.mobileEvents = this.mobileEvents;
    }

    /**
     * Initializes mobile system
     * @public
     */
    init() {
        if (!this.isMobile) return;
        
        this.mobileCanvas.setupResponsiveCanvas();
        this.mobileOrientation.setupOrientationDetection();
        this.mobileOrientation.updateOrientation();
        this.mobileControls.createTouchControls();
        this.mobileEvents.setupTouchEvents();
    }

    /**
     * Checks if mobile controls should be shown based on screen size
     * @private
     */
    checkAndShowMobileControls() {
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isTabletSize = window.innerWidth >= 768 && window.innerWidth <= 1600;
        const isSmallScreen = window.innerWidth <= 1600;
        
        if (hasTouch && (isTabletSize || isSmallScreen)) {
            this.mobileControls.createTouchControls();
            this.mobileEvents.setupTouchEvents();
        }
    }

    /**
     * Updates mobile system
     * @public
     */
    update() {
        if (!this.isMobile) return;
        
        this.mobileOrientation.update();
    }

    /**
     * Draws mobile-specific elements
     * @public
     */
    draw() {
        // Mobile-specific drawing can be implemented here
        // e.g. Touch feedback, etc.
    }

    /**
     * Destroys mobile system
     * @public
     */
    destroy() {
        if (this.mobileControls) {
            this.mobileControls.destroy();
        }
        
        const enterBtn = document.getElementById('enter-btn');
        if (enterBtn) {
            enterBtn.remove();
        }
    }

    /**
     * Gets mobile status
     * @public
     * @returns {boolean} True if mobile device
     */
    getIsMobile() {
        return this.isMobile;
    }

    /**
     * Gets mobile canvas instance
     * @public
     * @returns {MobileCanvas} Mobile canvas instance
     */
    getMobileCanvas() {
        return this.mobileCanvas;
    }

    /**
     * Gets mobile controls instance
     * @public
     * @returns {MobileControls} Mobile controls instance
     */
    getMobileControls() {
        return this.mobileControls;
    }

    /**
     * Gets mobile orientation instance
     * @public
     * @returns {MobileOrientation} Mobile orientation instance
     */
    getMobileOrientation() {
        return this.mobileOrientation;
    }

    /**
     * Gets mobile events instance
     * @public
     * @returns {MobileEvents} Mobile events instance
     */
    getMobileEvents() {
        return this.mobileEvents;
    }
}
