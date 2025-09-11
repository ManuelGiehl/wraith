/**
 * UI System - Main class that coordinates all UI modules
 * @class
 */
class UISystem {
    /**
     * Creates an instance of UISystem
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
        
        this.healthBar = document.getElementById('healthFill');
        this.scoreDisplay = document.getElementById('score');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScoreDisplay = document.getElementById('finalScore');
        this.restartBtn = document.getElementById('restartBtn');

        this.initializeModules();
    }

    /**
     * Initializes all UI modules
     * @private
     */
    initializeModules() {
        this.healthBarModule = new UIHealthBar(this.game);
        this.scoreModule = new UIScore(this.game);
        this.crystalModule = new UICrystal(this.game);
        this.feedbackModule = new UIFeedback(this.game);
    }

    /**
     * Updates the UI
     * @public
     */
    updateUI() {
        const healthPercent = (this.game.wraithSystem.player.health / this.game.wraithSystem.player.maxHealth) * 100;
        this.healthBar.style.width = `${healthPercent}%`;
        this.scoreDisplay.textContent = `Score: ${this.game.score}`;
    }

    /**
     * Shows the Game Over screen
     * @public
     */
    showGameOver() {
        this.finalScoreDisplay.textContent = this.game.score;
        this.gameOverScreen.classList.remove('hidden');
    }

    /**
     * Hides the Game Over screen
     * @public
     */
    hideGameOver() {
        this.gameOverScreen.classList.add('hidden');
    }

    /**
     * Draws all UI elements
     * @public
     */
    drawUI() {
        this.healthBarModule.drawHealthBar();
        this.scoreModule.drawScore();
        this.healthBarModule.drawUltimateBar();
        this.feedbackModule.drawUltimateReady();
        this.feedbackModule.drawDamageIncrease();
        this.feedbackModule.drawUltimateDamageIncrease();
 
        if (this.game.isPaused) {
            this.game.cameraSystem.drawPauseScreen();
        }
    }

    /**
     * Draws the crystal (delegates to crystal module)
     * @public
     */
    drawCrystal() {
        this.crystalModule.drawCrystal();
    }
}
