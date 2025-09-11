/**
 * GameRenderer - Renders all game content including screens, backgrounds, objects, and UI elements
 * @class
 */
class GameRenderer {
    /**
     * Creates an instance of GameRenderer
     * @param {Game} game - The main game instance
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Main draw method that determines which screen to render based on game state
     * @public
     */
    draw() {
        if (this.game.startScreenSystem.isVisible) {
            this.drawStartScreen();
            return;
        }

        if (this.game.endScreenSystem.isVisible) {
            this.drawEndScreen();
            return;
        }

        if (this.game.gameOverScreenSystem.isVisible && !this.game.startScreenSystem.isVisible) {
            this.drawGameOverScreen();
            return;
        }

        this.drawNormalGame();
    }

    /**
     * Renders the start screen with optional rain effect
     * @private
     */
    drawStartScreen() {
        this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);
        
        this.game.startScreenSystem.draw();
        
        if (this.shouldDrawRainOnStartScreen()) {
            this.game.rainSystem.draw();
        }
    }

    /**
     * Determines if rain should be drawn on the start screen based on modal visibility and moon phase
     * @returns {boolean} True if rain should be drawn, false otherwise
     * @private
     */
    shouldDrawRainOnStartScreen() {
        return !this.game.startScreenSystem.showGameTooltip && 
               !this.game.startScreenSystem.showControls && 
               !this.game.startScreenSystem.showAudio && 
               !this.game.startScreenSystem.showImpressum &&
               (this.game.startScreenSystem.moonIntroPhase === 'flying' || 
                this.game.startScreenSystem.moonIntroPhase === 'floating');
    }

    /**
     * Renders the end screen with game background and congratulations overlay
     * @private
     */
    drawEndScreen() {
        this.game.cameraSystem.drawBackground();
        
        this.drawGameBackground();
        this.drawGameObjects();
        this.drawUIElements();
        
        this.game.endScreenSystem.draw();
    }

    /**
     * Renders the game over screen with game background and game over overlay
     * @private
     */
    drawGameOverScreen() {
        this.game.cameraSystem.drawBackground();
        
        this.drawGameBackground();
        this.drawGameObjects();
        this.drawUIElements();
        
        if (!this.game.startScreenSystem.isVisible) {
            this.game.gameOverScreenSystem.draw();
        }
    }

    /**
     * Renders the normal game state with all game elements
     * @private
     */
    drawNormalGame() {
        this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);
        
        this.game.cameraSystem.drawBackground();
        this.drawGameBackground();
        this.drawGameObjects();
        this.drawUIElements();
        this.game.mobileSystem.draw();
    }

    /**
     * Renders the game background including rain and crystal effects
     * @private
     */
    drawGameBackground() {
        if (!this.game.bossRoomSystem.inBossRoom) {
            this.game.rainSystem.draw();
            this.game.uiSystem.drawCrystal();
        }
    }

    /**
     * Renders all game objects including player, enemies, spells, and boss
     * @private
     */
    drawGameObjects() {
        this.game.wraithSystem.drawPlayer();
        
        if (!this.game.bossRoomSystem.inBossRoom) {
            this.game.golemSystem.drawGolems();
            this.game.potionSystem.drawManaPotions();
        }
        
        if (this.game.bossRoomSystem.inBossRoom) {
            this.game.bossSystem.drawBoss(this.game.ctx);
        }
        
        this.game.spellSystem.drawSpells();
        this.game.bossRoomSystem.drawBossTransition();
    }

    /**
     * Renders UI elements including health bars and boss health bar
     * @private
     */
    drawUIElements() {
        this.game.uiSystem.drawUI();
        
        if (this.game.bossRoomSystem.inBossRoom) {
            this.game.bossSystem.drawBossHealthBar(this.game.ctx);
        }
    }
}
