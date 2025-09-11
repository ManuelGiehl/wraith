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
        
        if (this.isMobile) {
            this.initializeModules();
            this.init();
        }
    }

    /**
     * Detects if device is mobile
     * @public
     * @returns {boolean} True if mobile device
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
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
        
        // Make modules available to game instance
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
