/**
 * Start Screen System - Main class coordinating all start screen functionality
 * @class
 */
class StartScreenSystem {
    /**
     * Creates an instance of StartScreenSystem
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
        this.initializeProperties();
        this.initializeModules();
    }

    /**
     * Initializes all properties
     * @private
     */
    initializeProperties() {
        this.isVisible = true;
        this.selectedOption = 0;
        this.showGameTooltip = false;
        this.showControls = false;
        this.showAudio = false;
        this.showImpressum = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.hoveredOption = -1;
        this.hoveredStartButton = false;
        this.options = ['Play Game', 'Controls', 'Audio', 'Imprint'];
        
        this.introPhase = 'black';
        this.introTimer = 0;
        this.layerIndex = 0;
        this.titleAlpha = 0;
        this.menuAlpha = 0;
        this.layerAlphas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.layerPositions = [];
        this.layerRotations = [];
        this.gravestoneWobble = 0;
        this.moonFloat = 0;
        this.moonIntroPhase = 'hidden';
        this.moonIntroTimer = 0;
        this.screenShake = 0;
        this.screenShakeIntensity = 0;
        this.screenShakeTimer = 0;
        this.moonImpactSoundPlayed = false;
        this.isFirstTime = true;
        
        this.initializeLayerPositions();
    }

    /**
     * Initializes layer positions
     * @private
     */
    initializeLayerPositions() {
        for (let i = 0; i < 9; i++) {
            if (i < 3) {
                this.layerPositions[i] = { x: 0, y: this.game.height };
            } else {
                this.layerPositions[i] = { x: 0, y: -this.game.height };
            }
            this.layerRotations[i] = 0;
        }
    }

    /**
     * Initializes all sub-modules
     * @private
     */
    initializeModules() {
        this.events = new StartScreenEvents(this);
        this.intro = new StartScreenIntro(this);
        this.renderer = new StartScreenRenderer(this);
    }

    /**
     * Handles mouse move events
     * @public
     * @param {MouseEvent} e - Mouse move event
     */
    handleMouseMove(e) {
        this.events.handleMouseMove(e);
    }

    /**
     * Handles mouse click events
     * @public
     * @param {MouseEvent} e - Mouse click event
     */
    handleMouseClick(e) {
        this.events.handleMouseClick(e);
    }

    /**
     * Handles keyboard events
     * @public
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        this.events.handleKeyDown(e);
    }

    /**
     * Selects an option
     * @public
     */
    selectOption() {
        if (this.game.audioSystem) {
            this.game.audioSystem.playSound('click');
        }
        
        switch (this.selectedOption) {
            case 0:
                this.showGameTooltip = true;
                this.selectedOption = -1;
                break;
            case 1:
                this.showControls = true;
                this.selectedOption = -1;
                break;
            case 2:
                this.showAudio = true;
                this.selectedOption = -1;
                break;
            case 3:
                this.showImpressum = true;
                this.selectedOption = -1;
                break;
        }
    }

    /**
     * Starts the game
     * @public
     */
    startGame() {
        if (this.game.audioSystem) {
            this.game.audioSystem.playSound('click');
        }
        
        this.isVisible = false;
        this.game.startGame();
    }

    /**
     * Updates the start screen
     * @public
     */
    updateIntro() {
        this.intro.updateIntro();
    }

    /**
     * Draws the start screen
     * @public
     */
    draw() {
        this.renderer.draw();
    }

    /**
     * Shows the start screen
     * @public
     */
    show() {
        this.isVisible = true;
        this.selectedOption = -1;
        this.showGameTooltip = false;
        this.showControls = false;
        this.showAudio = false;
        this.showImpressum = false;
        this.moonImpactSoundPlayed = false;
    }

    /**
     * Resets and shows the start screen
     * @public
     */
    resetAndShow() {
        this.intro.resetIntroProperties();
        this.intro.resetLayerProperties();
        this.intro.resetMoonProperties();
        this.resetGameSystems();
        this.show();
    }

    /**
     * Resets game systems
     * @private
     */
    resetGameSystems() {
        this.game.rainSystem.reset();
        this.game.moonSystem.reset();
        this.game.rainSystem.setEnabled(true);
        // WICHTIG: Bossraum-Flag zurücksetzen
        this.game.bossRoomSystem.inBossRoom = false;
        this.game.bossRoomSystem.enteringBossRoom = false;
        
        // Hide pause button on mobile when returning to start screen
        if (this.game.mobileSystem && this.game.mobileSystem.getIsMobile()) {
            this.game.mobileSystem.getMobileControls().setPauseButtonVisible(false);
        }
        this.selectedOption = 0;
    }

    /**
     * Hides the start screen
     * @public
     */
    hide() {
        this.isVisible = false;
        this.showGameTooltip = false;
        this.showControls = false;
        this.showAudio = false;
        this.showImpressum = false;
        this.selectedOption = 0;
    }
}
