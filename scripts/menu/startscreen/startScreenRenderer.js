/**
 * Start Screen Renderer - Handles all rendering for the start screen
 * @class
 */
class StartScreenRenderer {
    /**
     * Creates an instance of StartScreenRenderer
     * @param {StartScreenSystem} startScreen - The main start screen system
     * @constructor
     */
    constructor(startScreen) {
        this.startScreen = startScreen;
    }

    /**
     * Main draw function
     * @public
     */
    draw() {
        if (this.startScreen.showGameTooltip) {
            this.drawGameTooltip();
        } else if (this.startScreen.showControls) {
            this.drawControls();
        } else if (this.startScreen.showAudio) {
            this.drawAudio();
        } else if (this.startScreen.showImpressum) {
            this.drawImpressum();
        } else {
            this.drawMainMenu();
        }
    }

    /**
     * Draws the main menu
     * @private
     */
    drawMainMenu() {
        const centerX = this.startScreen.game.width / 2;
        const centerY = this.startScreen.game.height / 2;

        if (this.startScreen.introPhase === 'black') {
            this.drawBlackScreen();
            return;
        }

        if (this.startScreen.introPhase === 'layers') {
            this.drawLayerAnimation();
            return;
        }

        this.drawLayerAnimation();

        if (this.startScreen.introPhase === 'title' || this.startScreen.introPhase === 'menu') {
            this.drawTitle(centerX, centerY);
        }

        if (this.startScreen.introPhase === 'menu') {
            this.drawMenuOptions(centerX, centerY);
        }

        this.startScreen.game.ctx.textAlign = 'left';
    }

    /**
     * Draws black screen
     * @private
     */
    drawBlackScreen() {
        this.startScreen.game.ctx.fillStyle = '#000000';
        this.startScreen.game.ctx.fillRect(0, 0, this.startScreen.game.width, this.startScreen.game.height);
    }

    /**
     * Draws the title
     * @private
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    drawTitle(centerX, centerY) {
        this.startScreen.game.ctx.save();
        this.startScreen.game.ctx.globalAlpha = this.startScreen.titleAlpha;
        
        this.startScreen.game.ctx.shadowColor = '#4a90e2';
        this.startScreen.game.ctx.shadowBlur = 15;
        this.startScreen.game.ctx.shadowOffsetX = 0;
        this.startScreen.game.ctx.shadowOffsetY = 0;
        
        this.startScreen.game.ctx.fillStyle = '#ffffff';
        this.startScreen.game.ctx.font = 'bold 48px Raleway';
        this.startScreen.game.ctx.textAlign = 'center';
        this.startScreen.game.ctx.fillText('WRAITH', centerX, centerY - 120);
        
        this.startScreen.game.ctx.shadowBlur = 0;
        this.startScreen.game.ctx.shadowColor = 'transparent';
        
        this.startScreen.game.ctx.restore();
    }

    /**
     * Draws menu options
     * @private
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    drawMenuOptions(centerX, centerY) {
        TemplateManager.drawMenuOptions(this.startScreen.game.ctx, this.startScreen.options, centerX, centerY, this.startScreen.selectedOption, this.startScreen.hoveredOption, this.startScreen.menuAlpha);
    }

    /**
     * Draws layer animation
     * @private
     */
    drawLayerAnimation() {
        TemplateManager.drawLayerAnimation(this.startScreen.game.ctx, this.startScreen.game, this.startScreen.layerAlphas, this.startScreen.layerPositions, this.startScreen.layerRotations, this.startScreen.moonIntroPhase, this.startScreen.screenShake, this.startScreen.screenShakeIntensity, this.startScreen.gravestoneWobble, this.startScreen.moonFloat);
    }

    /**
     * Draws controls screen
     * @private
     */
    drawControls() {
        this.drawLayerAnimation();
        TemplateManager.drawControls(this.startScreen.game.ctx, this.startScreen.game.width, this.startScreen.game.height);
    }

    /**
     * Draws audio screen
     * @private
     */
    drawAudio() {
        this.drawLayerAnimation();
        
        if (this.startScreen.game.audioSystem) {
            this.startScreen.game.audioSystem.drawAudioControls(this.startScreen.game.ctx, this.startScreen.game.width, this.startScreen.game.height);
        }
    }

    /**
     * Draws game tooltip
     * @private
     */
    drawGameTooltip() {
        TemplateManager.drawHowToPlay(this.startScreen.game.ctx, this.startScreen.game.width, this.startScreen.game.height, this.startScreen.hoveredStartButton);
    }

    /**
     * Draws impressum screen
     * @private
     */
    drawImpressum() {
        TemplateManager.drawImpressum(this.startScreen.game.ctx, this.startScreen.game.width, this.startScreen.game.height);
    }
}
