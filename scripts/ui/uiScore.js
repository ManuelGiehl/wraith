/**
 * UI Score Module - Manages score and spawn interval display
 * @class
 */
class UIScore {
    /**
     * Creates an instance of UIScore
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Draws the score in the top right
     * @public
     */
    drawScore() {
        this.setupScoreTextStyle();
        this.drawScoreText();
        this.drawSpawnIntervalText();
        this.resetTextStyle();
    }

    /**
     * Sets the text style for score
     * @private
     */
    setupScoreTextStyle() {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 18px Raleway';
        this.game.ctx.textAlign = 'right';
        this.game.ctx.textBaseline = 'top';
        
        this.game.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.game.ctx.shadowBlur = 4;
        this.game.ctx.shadowOffsetX = 2;
        this.game.ctx.shadowOffsetY = 2;
    }

    /**
     * Draws the score text
     * @private
     */
    drawScoreText() {
        this.game.ctx.fillText(`Score: ${this.game.score}`, this.game.width - 10, 10);
    }

    /**
     * Draws the spawn interval text
     * @private
     */
    drawSpawnIntervalText() {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 16px Raleway';
        this.game.ctx.fillText(`Spawn: ${(this.game.golemSystem.golemSpawnInterval / 1000).toFixed(1)}s`, this.game.width - 10, 35);
    }

    /**
     * Resets the text style
     * @private
     */
    resetTextStyle() {
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.shadowColor = 'transparent';
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
        
        this.game.ctx.textAlign = 'left';
        this.game.ctx.textBaseline = 'alphabetic';
    }
}
