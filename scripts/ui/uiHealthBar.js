/**
 * UI Health Bar Module - Manages health and ultimate bars
 * @class
 */
class UIHealthBar {
    /**
     * Creates an instance of UIHealthBar
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Draws the HP Bar with text
     * @public
     */
    drawHealthBar() {
        const barWidth = 200;
        const barHeight = 20;
        const x = 10;
        const y = 10;
        const borderRadius = 10;
        
        this.drawHealthBarBackground(x, y, barWidth, barHeight, borderRadius);
        this.drawHealthBarProgress(x, y, barWidth, barHeight, borderRadius);
        this.drawHealthBarFrame(x, y, barWidth, barHeight, borderRadius);
        this.drawHealthBarText(x, y, barWidth, barHeight);
    }

    /**
     * Draws the background of the HP Bar
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     * @param {number} borderRadius - Border radius
     */
    drawHealthBarBackground(x, y, barWidth, barHeight, borderRadius) {
        this.game.ctx.fillStyle = '#333';
        this.game.cameraSystem.drawRoundedRect(x, y, barWidth, barHeight, borderRadius);
        this.game.ctx.fill();
    }

    /**
     * Draws the progress of the HP Bar
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     * @param {number} borderRadius - Border radius
     */
    drawHealthBarProgress(x, y, barWidth, barHeight, borderRadius) {
        const currentHP = Math.max(0, this.game.wraithSystem.player.health);
        const hpPercent = currentHP / this.game.wraithSystem.player.maxHealth;
        
        this.setHealthBarColor(hpPercent);
        
        if (hpPercent > 0) {
            this.game.cameraSystem.drawRoundedRect(x, y, barWidth * hpPercent, barHeight, borderRadius);
            this.game.ctx.fill();
        }
    }

    /**
     * Sets the color of the HP Bar based on percentage
     * @private
     * @param {number} hpPercent - Health percentage
     */
    setHealthBarColor(hpPercent) {
        if (hpPercent > 0.5) {
            this.game.ctx.fillStyle = '#00ff00';
        } else if (hpPercent > 0.25) {
            this.game.ctx.fillStyle = '#ffff00'; 
        } else {
            this.game.ctx.fillStyle = '#ff0000'; 
        }
    }

    /**
     * Draws the frame of the HP Bar
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     * @param {number} borderRadius - Border radius
     */
    drawHealthBarFrame(x, y, barWidth, barHeight, borderRadius) {
        this.game.ctx.strokeStyle = '#666';
        this.game.ctx.lineWidth = 2;
        this.game.cameraSystem.drawRoundedRect(x, y, barWidth, barHeight, borderRadius);
        this.game.ctx.stroke();
    }

    /**
     * Draws the text of the HP Bar
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     */
    drawHealthBarText(x, y, barWidth, barHeight) {
        const currentHP = Math.max(0, this.game.wraithSystem.player.health);
        
        this.game.ctx.fillStyle = '#e0e0e0';
        this.game.ctx.font = 'bold 12px Raleway';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'middle';
        this.game.ctx.fillText(`HP ${currentHP}/${this.game.wraithSystem.player.maxHealth}`, x + barWidth / 2, y + barHeight / 2);
        
        this.game.ctx.textAlign = 'left';
        this.game.ctx.textBaseline = 'alphabetic';
    }

    /**
     * Draws the Ultimate Status Bar (Mana Bar)
     * @public
     */
    drawUltimateBar() {
        const barWidth = 200;
        const barHeight = 20;
        const x = 10;
        const y = 35;
        const borderRadius = 10;
        
        this.drawUltimateBarBackground(x, y, barWidth, barHeight, borderRadius);
        this.drawUltimateBarProgress(x, y, barWidth, barHeight, borderRadius);
        this.drawUltimateBarFrame(x, y, barWidth, barHeight, borderRadius);
        this.drawUltimateBarText(x, y, barWidth, barHeight);
        this.drawDamageInfo(x, y);
        this.drawManaPotionInfo(x, y);
        this.drawManaPotionCounter(x + 200, y - 20);
    }

    /**
     * Draws the background of the Ultimate Bar
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     * @param {number} borderRadius - Border radius
     */
    drawUltimateBarBackground(x, y, barWidth, barHeight, borderRadius) {
        this.game.ctx.fillStyle = '#333';
        this.game.cameraSystem.drawRoundedRect(x, y, barWidth, barHeight, borderRadius);
        this.game.ctx.fill();
    }

    /**
     * Draws the progress of the Ultimate Bar
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     * @param {number} borderRadius - Border radius
     */
    drawUltimateBarProgress(x, y, barWidth, barHeight, borderRadius) {
        const manaPercent = Math.min(this.game.wraithSystem.player.mana / 100, 1);
        this.game.ctx.fillStyle = '#00aaff';
        if (manaPercent > 0) {
            this.game.cameraSystem.drawRoundedRect(x, y, barWidth * manaPercent, barHeight, borderRadius);
            this.game.ctx.fill();
        }
    }

    /**
     * Draws the frame of the Ultimate Bar
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     * @param {number} borderRadius - Border radius
     */
    drawUltimateBarFrame(x, y, barWidth, barHeight, borderRadius) {
        this.game.ctx.strokeStyle = '#666';
        this.game.ctx.lineWidth = 2;
        this.game.cameraSystem.drawRoundedRect(x, y, barWidth, barHeight, borderRadius);
        this.game.ctx.stroke();
    }

    /**
     * Draws the text of the Ultimate Bar
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     */
    drawUltimateBarText(x, y, barWidth, barHeight) {
        this.game.ctx.fillStyle = '#e0e0e0';
        this.game.ctx.font = 'bold 12px Raleway';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'middle';
        this.game.ctx.fillText(`MP ${this.game.wraithSystem.player.mana}/100`, x + barWidth / 2, y + barHeight / 2);
        
        this.game.ctx.textAlign = 'left';
        this.game.ctx.textBaseline = 'alphabetic';
    }

    /**
     * Draws the Damage information
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawDamageInfo(x, y) {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 18px Raleway';
        this.game.ctx.textAlign = 'left';
        this.game.ctx.textBaseline = 'top'; 
        this.game.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.game.ctx.shadowBlur = 4;
        this.game.ctx.shadowOffsetX = 2;
        this.game.ctx.shadowOffsetY = 2;
        this.game.ctx.fillText(`Damage: ${this.game.wraithSystem.player.sSkillDamage}`, x + 5, y + 50);
        this.game.ctx.shadowColor = 'transparent';
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
    }

    /**
     * Draws the Mana Potion information
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawManaPotionInfo(x, y) {
        if (this.game.wraithSystem.player.manaPotions > 0) {
            this.drawManaPotionReady(x, y);
        } else {
            this.drawManaPotionNotAvailable(x, y);
        }
    }

    /**
     * Draws Mana Potion Ready status
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawManaPotionReady(x, y) {
        this.game.ctx.fillStyle = '#00aaff';
        this.game.ctx.font = 'bold 18px Raleway';
        
        this.game.ctx.shadowColor = '#00aaff';
        this.game.ctx.shadowBlur = 10;
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
        
        this.game.ctx.fillText(`Mana-Potion (Q): READY`, x + 5, y + 75);
        
        this.game.ctx.shadowColor = 'transparent';
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
    }

    /**
     * Draws Mana Potion Not Available status
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawManaPotionNotAvailable(x, y) {
        this.game.ctx.fillStyle = '#666666';
        this.game.ctx.font = 'bold 18px Raleway';

        this.game.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.game.ctx.shadowBlur = 4;
        this.game.ctx.shadowOffsetX = 2;
        this.game.ctx.shadowOffsetY = 2;
        
        this.game.ctx.fillText(`Mana-Potion (Q): Not available`, x + 5, y + 75);
 
        this.game.ctx.shadowColor = 'transparent';
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
    }

    /**
     * Draws the Mana Potion Counter
     * @public
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawManaPotionCounter(x, y) {
        const potionCount = this.game.wraithSystem.player.manaPotions || 0;
        
        this.drawManaPotionIcon(x, y);
        this.drawManaPotionCountText(x, y, potionCount);
    }

    /**
     * Draws the Mana Potion Icon
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawManaPotionIcon(x, y) {
        const potionImage = this.game.loadedImages.get('models/img/potion/manapotion.png');
        if (potionImage) {
            this.game.ctx.save();
            this.game.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            this.game.ctx.shadowBlur = 4;
            this.game.ctx.shadowOffsetX = 2;
            this.game.ctx.shadowOffsetY = 2;
            this.game.ctx.drawImage(potionImage, x, y, 36, 36);
            this.game.ctx.restore();
        } else {
            this.drawManaPotionFallback(x, y);
        }
    }

    /**
     * Draws the fallback icon for Mana Potion
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawManaPotionFallback(x, y) {
        this.game.ctx.save();
        this.game.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.game.ctx.shadowBlur = 4;
        this.game.ctx.shadowOffsetX = 2;
        this.game.ctx.shadowOffsetY = 2;
        this.game.ctx.fillStyle = '#0066cc';
        this.game.ctx.fillRect(x, y, 36, 36);
        this.game.ctx.restore();
        
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = '14px Arial';
        this.game.ctx.fillText('MP', x + 8, y + 24);
    }

    /**
     * Draws the Mana Potion Counter text
     * @private
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} potionCount - Number of potions
     */
    drawManaPotionCountText(x, y, potionCount) {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 18px Raleway';
        this.game.ctx.textAlign = 'left';
        this.game.ctx.textBaseline = 'middle';
        
        this.game.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.game.ctx.shadowBlur = 4;
        this.game.ctx.shadowOffsetX = 2;
        this.game.ctx.shadowOffsetY = 2;
        
        this.game.ctx.fillText(`${potionCount}`, x + 42, y + 18);
        
        this.game.ctx.shadowColor = 'transparent';
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
    }
}
