/**
 * Mobile Events Management - Handles touch and mouse events for mobile devices
 * @class
 */
class MobileEvents {
    /**
     * Creates an instance of MobileEvents
     * @param {Game} game - The main game instance
     * @param {MobileControls} mobileControls - Mobile controls instance
     * @param {MobileOrientation} mobileOrientation - Mobile orientation instance
     */
    constructor(game, mobileControls, mobileOrientation) {
        this.game = game;
        this.mobileControls = mobileControls;
        this.mobileOrientation = mobileOrientation;
        this.audioStarted = false;
        this.activeActions = new Set();
        this.actionIntervals = new Map();
    }

    /**
     * Sets up touch events
     * @public
     */
    setupTouchEvents() {
        this.setupTouchButtonEvents();
        this.setupCanvasTouchEvents();
    }

    /**
     * Sets up touch button events
     * @private
     */
    setupTouchButtonEvents() {
        const touchControls = this.mobileControls.getTouchControls();
        Object.values(touchControls).forEach(button => {
            if (!button) return;
            
            const action = button.getAttribute('data-action');
            this.setupButtonTouchEvents(button, action);
            this.setupButtonMouseEvents(button, action);
        });
    }

    /**
     * Sets up touch events for button
     * @private
     */
    setupButtonTouchEvents(button, action) {
        button.addEventListener('touchstart', (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            this.handleTouchStart(action);
        }, { passive: false });
        
        button.addEventListener('touchend', (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            this.handleTouchEnd(action);
        }, { passive: false });
    }

    /**
     * Sets up mouse events for button (Desktop-Testing)
     * @private
     */
    setupButtonMouseEvents(button, action) {
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleTouchStart(action);
        });
        
        button.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.handleTouchEnd(action);
        });
    }

    /**
     * Sets up canvas touch events
     * @private
     */
    setupCanvasTouchEvents() {
        this.game.canvas.addEventListener('mousedown', (e) => {
            this.handleGeneralMouseClick(e);
        });
    }

    /**
     * Handles touch start
     * @private
     */
    handleTouchStart(action) {
        if (this.mobileOrientation.getShowPortraitWarning()) return;
        
        this.startAudioOnFirstTouch();

        this.activeActions.add(action);

        if (this.isContinuousAction(action)) {
            this.startContinuousAction(action);
        } else {
            this.executeAction(action);
        }
    }

    /**
     * Handles touch end
     * @private
     */
    handleTouchEnd(action) {
        if (this.mobileOrientation.getShowPortraitWarning()) return;

        this.activeActions.delete(action);

        this.stopContinuousAction(action);

        if (this.isMovementAction(action)) {
            const event = { code: this.getKeyCode(action) };
            if (this.isInGame() && this.game.wraithSystem.handleKeyUp) {
                this.game.wraithSystem.handleKeyUp(event);
            }
        }
    }

    /**
     * Checks if in game
     * @private
     * @returns {boolean} True if in game
     */
    isInGame() {
        return !this.game.startScreenSystem.isVisible && 
               !this.game.endScreenSystem.isVisible && 
               !this.game.gameOverScreenSystem.isVisible && 
               !this.game.isPaused;
    }

    /**
     * Checks if action should be continuous
     * @private
     * @param {string} action - Action name
     * @returns {boolean} True if continuous action
     */
    isContinuousAction(action) {
        return ['left', 'right', 'up', 'down', 'jump', 'attack', 'potion', 'ultimate'].includes(action);
    }

    /**
     * Checks if action is movement
     * @private
     * @param {string} action - Action name
     * @returns {boolean} True if movement action
     */
    isMovementAction(action) {
        return ['left', 'right', 'up', 'down'].includes(action);
    }

    /**
     * Starts continuous action
     * @private
     * @param {string} action - Action name
     */
    startContinuousAction(action) {
        if (this.actionIntervals.has(action)) return;
        
        const interval = setInterval(() => {
            if (this.activeActions.has(action)) {
                this.executeAction(action);
            }
        }, 50);
        
        this.actionIntervals.set(action, interval);
    }

    /**
     * Stops continuous action
     * @private
     * @param {string} action - Action name
     */
    stopContinuousAction(action) {
        if (this.actionIntervals.has(action)) {
            clearInterval(this.actionIntervals.get(action));
            this.actionIntervals.delete(action);
        }
    }

    /**
     * Executes a single action
     * @private
     * @param {string} action - Action name
     */
    executeAction(action) {
        const event = { code: this.getKeyCode(action) };
        
        if (this.game.startScreenSystem.isVisible) {
            this.game.startScreenSystem.handleKeyDown(event);
        } else if (this.game.endScreenSystem.isVisible) {
            this.game.endScreenSystem.handleKeyDown(event);
        } else if (this.game.gameOverScreenSystem.isVisible) {
            this.game.gameOverScreenSystem.handleKeyDown(event);
        } else if (this.game.isPaused) {
            this.handlePauseKeyDown(event);
        } else {
            if (action !== 'enter') {
                this.game.wraithSystem.handleKeyDown(event);
            }
        }
    }

    /**
     * Cleans up all active intervals
     * @public
     */
    cleanup() {
        this.actionIntervals.forEach(interval => clearInterval(interval));
        this.actionIntervals.clear();
        this.activeActions.clear();
    }

    /**
     * Checks if action is movement action
     * @private
     * @param {string} action - Action name
     * @returns {boolean} True if movement action
     */
    isMovementAction(action) {
        return ['left', 'right', 'up', 'down', 'jump'].includes(action);
    }

    /**
     * Starts audio on first touch
     * @private
     */
    startAudioOnFirstTouch() {
        if (this.audioStarted) return;
        
        this.audioStarted = true;
        
        if (this.game.audioSystem) {
            this.game.audioSystem.muted = false;
            this.game.audioSystem.saveSettings();
            this.game.audioSystem.syncAudioSystems();
        }
        
        if (this.game.backgroundMusicSystem) {
            this.game.backgroundMusicSystem.userHasInteracted = true;
            this.game.backgroundMusicSystem.setMuted(false);
            this.game.backgroundMusicSystem.play();
        }
    }

    /**
     * Handles general touch
     * @private
     */
    handleGeneralTouch(e) {
        if (this.mobileOrientation.getShowPortraitWarning()) return;
        
        this.startAudioOnFirstTouch();
        
        if (!this.isMenuScreen()) return;
        
        const clickEvent = this.createClickEvent(e);
        this.handleMenuTouch(clickEvent);
    }

    /**
     * Checks if menu screen is active
     * @private
     * @returns {boolean} True if menu screen is active
     */
    isMenuScreen() {
        return this.game.startScreenSystem.isVisible || 
               this.game.endScreenSystem.isVisible || 
               this.game.gameOverScreenSystem.isVisible || 
               this.game.isPaused;
    }

    /**
     * Creates click event from touch event
     * @private
     * @param {Event} e - Touch event
     * @returns {Object} Touch event object
     */
    createClickEvent(e) {
        return {
            touches: [{
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            }],
            target: e.target,
            preventDefault: () => e.preventDefault()
        };
    }

    /**
     * Handles touch in menu screens
     * @private
     */
    handleMenuTouch(clickEvent) {
        if (this.game.startScreenSystem.isVisible) {
            // Verwende die neuen Touch-Handler für bessere Mobile-Unterstützung
            this.game.startScreenSystem.events.handleTouchStart(clickEvent);
        } else if (this.game.endScreenSystem.isVisible) {
            this.game.endScreenSystem.handleTouchStart(clickEvent);
        } else if (this.game.gameOverScreenSystem.isVisible) {
            this.game.gameOverScreenSystem.handleTouchStart(clickEvent);
        } else if (this.game.isPaused) {
            this.game.eventHandler.handlePauseScreenTouch(clickEvent);
        }
    }

    /**
     * Handles general touch end
     * @private
     */
    handleGeneralTouchEnd(e) {
        if (this.mobileOrientation.getShowPortraitWarning()) return;
    }

    /**
     * Creates click event from touch end event
     * @private
     * @param {Event} e - Touch end event
     * @returns {Object} Click event object
     */
    createTouchEndClickEvent(e) {
        return {
            clientX: e.changedTouches[0].clientX,
            clientY: e.changedTouches[0].clientY,
            preventDefault: () => e.preventDefault()
        };
    }

    /**
     * Handles general mouse click
     * @private
     */
    handleGeneralMouseClick(e) {
        if (this.mobileOrientation.getShowPortraitWarning()) return;
        
        this.startAudioOnFirstTouch();
        
        if (!this.isMenuScreen()) return;
        
        const clickEvent = this.createMouseClickEvent(e);
        this.handleMenuTouch(clickEvent);
    }

    /**
     * Creates click event from mouse event
     * @private
     * @param {Event} e - Mouse event
     * @returns {Object} Click event object
     */
    createMouseClickEvent(e) {
        return {
            clientX: e.clientX,
            clientY: e.clientY,
            preventDefault: () => e.preventDefault()
        };
    }

    /**
     * Handles pause key down
     * @private
     */
    handlePauseKeyDown(e) {
        if (e.code === 'Escape') {
            this.game.isPaused = false;
            this.game.backgroundMusicSystem.play();
        }
    }

    /**
     * Converts action to key code
     * @private
     * @param {string} action - Action name
     * @returns {string} Key code
     */
    getKeyCode(action) {
        switch (action) {
            case 'left': return 'ArrowLeft';
            case 'right': return 'ArrowRight';
            case 'up': return 'ArrowUp';
            case 'down': return 'ArrowDown';
            case 'jump': return 'Space';
            case 'attack': return 'KeyA';
            case 'potion': return 'KeyQ';
            case 'ultimate': return 'KeyR';
            case 'pause': return 'Escape';
            default: return '';
        }
    }
}
