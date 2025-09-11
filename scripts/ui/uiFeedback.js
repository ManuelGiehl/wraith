/**
 * UI Feedback Module - Manages damage increase and ultimate ready feedback
 * @class
 */
class UIFeedback {
    /**
     * Creates an instance of UIFeedback
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Draws the Ultimate Ready (R) above the Wraith
     * @public
     */
    drawUltimateReady() {
        if (!this.game.wraithSystem.player.ultimateReady) return;
        
        const player = this.game.wraithSystem.player;
        const screenPos = this.game.cameraSystem.worldToScreen(player.x, player.y);
        const textX = screenPos.x + player.width / 2;
        const textY = screenPos.y - 20;
        
        this.setupUltimateReadyStyle();
        this.game.ctx.fillText('Ultimate Ready (R)', textX, textY);
        this.resetUltimateReadyGlow();
    }

    /**
     * Sets up the style for Ultimate Ready text
     * @private
     */
    setupUltimateReadyStyle() {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 18px Raleway';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'bottom';
        
        this.game.ctx.shadowColor = '#4a90e2';
        this.game.ctx.shadowBlur = 15;
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
    }

    /**
     * Resets the Ultimate Ready glow
     * @private
     */
    resetUltimateReadyGlow() {
        this.game.ctx.shadowColor = 'transparent';
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
    }

    /**
     * Draws the Damage Increase feedback above the Wraith
     * @public
     */
    drawDamageIncrease() {
        if (!this.game.wraithSystem.player.showDamageIncrease) return;

        const player = this.game.wraithSystem.player;
        const screenPos = this.game.cameraSystem.worldToScreen(player.x, player.y);
        const textX = screenPos.x + player.width / 2;
        const textY = screenPos.y - 50;

        const alpha = this.calculateDamageIncreaseAlpha(player);
        this.setupDamageIncreaseStyle(alpha);
        
        const damageText = `Damage increased (${player.oldDamage} → ${player.newDamage})`;
        this.game.ctx.fillText(damageText, textX, textY);
        
        this.resetDamageIncreaseGlow();
    }

    /**
     * Calculates the alpha value for Damage Increase fade-out
     * @private
     * @param {Object} player - Player object
     * @returns {number} Alpha value
     */
    calculateDamageIncreaseAlpha(player) {
        const fadeStart = player.damageIncreaseDuration - 30;
        let alpha = 1.0;
        if (player.damageIncreaseTimer > fadeStart) {
            const fadeProgress = (player.damageIncreaseTimer - fadeStart) / 30;
            alpha = 1.0 - fadeProgress;
        }
        return alpha;
    }

    /**
     * Sets up the style for Damage Increase text
     * @private
     * @param {number} alpha - Alpha value
     */
    setupDamageIncreaseStyle(alpha) {
        this.game.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.game.ctx.font = 'bold 18px Raleway';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'bottom';

        this.game.ctx.shadowColor = `rgba(74, 144, 226, ${alpha})`;
        this.game.ctx.shadowBlur = 15;
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
    }

    /**
     * Resets the Damage Increase glow
     * @private
     */
    resetDamageIncreaseGlow() {
        this.game.ctx.shadowColor = 'transparent';
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
    }

    /**
     * Draws the Ultimate Damage Increase feedback above the Wraith
     * @public
     */
    drawUltimateDamageIncrease() {
        if (!this.game.wraithSystem.player.showUltimateDamageIncrease) return;

        const player = this.game.wraithSystem.player;
        const screenPos = this.game.cameraSystem.worldToScreen(player.x, player.y);
        const textX = screenPos.x + player.width / 2;
        const textY = screenPos.y - 80;

        const alpha = this.calculateUltimateDamageIncreaseAlpha(player);
        this.setupUltimateDamageIncreaseStyle(alpha);
        
        const ultimateDamageText = `Ultimate Damage increased (${player.oldUltimateDamage} → ${player.newUltimateDamage})`;
        this.game.ctx.fillText(ultimateDamageText, textX, textY);
        
        this.resetUltimateDamageIncreaseGlow();
    }

    /**
     * Calculates the alpha value for Ultimate Damage Increase fade-out
     * @private
     * @param {Object} player - Player object
     * @returns {number} Alpha value
     */
    calculateUltimateDamageIncreaseAlpha(player) {
        const fadeStart = player.ultimateDamageIncreaseDuration - 30;
        let alpha = 1.0;
        if (player.ultimateDamageIncreaseTimer > fadeStart) {
            const fadeProgress = (player.ultimateDamageIncreaseTimer - fadeStart) / 30;
            alpha = 1.0 - fadeProgress;
        }
        return alpha;
    }

    /**
     * Sets up the style for Ultimate Damage Increase text
     * @private
     * @param {number} alpha - Alpha value
     */
    setupUltimateDamageIncreaseStyle(alpha) {
        this.game.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.game.ctx.font = 'bold 18px Raleway';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'bottom';

        this.game.ctx.shadowColor = `rgba(74, 144, 226, ${alpha})`;
        this.game.ctx.shadowBlur = 15;
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
    }

    /**
     * Resets the Ultimate Damage Increase glow
     * @private
     */
    resetUltimateDamageIncreaseGlow() {
        this.game.ctx.shadowColor = 'transparent';
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
    }
}
