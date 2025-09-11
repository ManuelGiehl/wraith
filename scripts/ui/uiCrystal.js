/**
 * UI Crystal Module - Manages crystal display and progress bar
 * @class
 */
class UICrystal {
    /**
     * Creates an instance of UICrystal
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Draws the crystal object with high resolution
     * @public
     */
    drawCrystal() {
        if (!this.game.crystalSystem.crystal) return;
        
        const screenPos = this.getCrystalScreenPosition();
        if (!this.isCrystalInView(screenPos)) return;

        this.drawCrystalProgressBar(screenPos);
        this.drawCrystalImage(screenPos);
    }

    /**
     * Gets the screen position of the crystal
     * @private
     * @returns {Object} Screen position coordinates
     */
    getCrystalScreenPosition() {
        return this.game.cameraSystem.worldToScreen(this.game.crystalSystem.crystal.x, this.game.crystalSystem.crystal.y);
    }

    /**
     * Checks if the crystal is in view
     * @private
     * @param {Object} screenPos - Screen position coordinates
     * @returns {boolean} True if crystal is in view
     */
    isCrystalInView(screenPos) {
        return !(screenPos.x < -this.game.crystalSystem.crystal.width || screenPos.x > this.game.width + this.game.crystalSystem.crystal.width);
    }

    /**
     * Draws the crystal image
     * @private
     * @param {Object} screenPos - Screen position coordinates
     */
    drawCrystalImage(screenPos) {
        const image = this.game.loadedImages.get('models/img/boss/white_crystal_light_shadow1.png');
        
        if (image) {
            this.drawCrystalWithImage(image, screenPos);
        } else {
            this.drawCrystalFallback(screenPos);
        }
    }

    /**
     * Draws the crystal with image
     * @private
     * @param {Image} image - Crystal image
     * @param {Object} screenPos - Screen position coordinates
     */
    drawCrystalWithImage(image, screenPos) {
        this.game.ctx.save();
        
        this.setupCrystalGlow();
        this.setupCrystalImageQuality();
        this.drawCrystalImageOnCanvas(image, screenPos);
        
        this.game.ctx.restore();
    }

    /**
     * Sets up the glow effect for the crystal
     * @private
     */
    setupCrystalGlow() {
        if (this.game.crystalSystem.crystal.hasGlow) {
            this.game.ctx.shadowColor = '#ffffff';
            this.game.ctx.shadowBlur = 20;
            this.game.ctx.shadowOffsetX = 0;
            this.game.ctx.shadowOffsetY = 0;
        }
    }

    /**
     * Sets up the image quality for the crystal
     * @private
     */
    setupCrystalImageQuality() {
        this.game.ctx.imageSmoothingEnabled = true;
        this.game.ctx.imageSmoothingQuality = 'high';
    }

    /**
     * Draws the crystal image on canvas
     * @private
     * @param {Image} image - Crystal image
     * @param {Object} screenPos - Screen position coordinates
     */
    drawCrystalImageOnCanvas(image, screenPos) {
        this.game.ctx.drawImage(
            image, 
            screenPos.x, 
            screenPos.y, 
            this.game.crystalSystem.crystal.width, 
            this.game.crystalSystem.crystal.height
        );
    }

    /**
     * Draws the crystal fallback
     * @private
     * @param {Object} screenPos - Screen position coordinates
     */
    drawCrystalFallback(screenPos) {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.fillRect(screenPos.x, screenPos.y, this.game.crystalSystem.crystal.width, this.game.crystalSystem.crystal.height);
    }

    /**
     * Draws the progress bar above the crystal
     * @public
     * @param {Object} screenPos - Screen position coordinates
     */
    drawCrystalProgressBar(screenPos) {
        const barWidth = 200;
        const barHeight = 20;
        const barX = screenPos.x + (this.game.crystalSystem.crystal.width - barWidth) / 2;
        const barY = screenPos.y - 40;
        
        if (this.game.score < 5000) {
            this.drawCrystalProgressBarUnder5000(barX, barY, barWidth, barHeight);
        } else {
            this.drawCrystalProgressBarOver5000(barX, barY, barWidth, barHeight);
        }
        
        this.game.ctx.textAlign = 'left';
        this.game.ctx.textBaseline = 'alphabetic';
    }

    /**
     * Draws the progress bar under 5000 points
     * @private
     * @param {number} barX - Bar X position
     * @param {number} barY - Bar Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     */
    drawCrystalProgressBarUnder5000(barX, barY, barWidth, barHeight) {
        this.drawCrystalProgressBarBackground(barX, barY, barWidth, barHeight);
        this.drawCrystalProgressBarFill(barX, barY, barWidth, barHeight);
        this.drawCrystalProgressBarFrame(barX, barY, barWidth, barHeight);
        this.drawCrystalProgressBarText(barX, barY, barWidth, barHeight);
    }

    /**
     * Draws the progress bar over 5000 points
     * @private
     * @param {number} barX - Bar X position
     * @param {number} barY - Bar Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     */
    drawCrystalProgressBarOver5000(barX, barY, barWidth, barHeight) {
        const isOnCrystal = this.game.crystalSystem.isPlayerOnCrystal();
        
        this.setupCrystalTextStyle();
        this.drawCrystalPortalText(barX, barY, barWidth, barHeight, isOnCrystal);
        this.resetCrystalTextShadow();
    }

    /**
     * Draws the background of the crystal progress bar
     * @private
     * @param {number} barX - Bar X position
     * @param {number} barY - Bar Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     */
    drawCrystalProgressBarBackground(barX, barY, barWidth, barHeight) {
        this.game.ctx.fillStyle = '#333';
        this.game.ctx.fillRect(barX, barY, barWidth, barHeight);
    }

    /**
     * Draws the fill of the crystal progress bar
     * @private
     * @param {number} barX - Bar X position
     * @param {number} barY - Bar Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     */
    drawCrystalProgressBarFill(barX, barY, barWidth, barHeight) {
        const progress = this.game.score / 5000;
        const progressWidth = barWidth * progress;
        
        this.game.ctx.fillStyle = '#00aaff';
        this.game.ctx.fillRect(barX, barY, progressWidth, barHeight);
    }

    /**
     * Draws the frame of the crystal progress bar
     * @private
     * @param {number} barX - Bar X position
     * @param {number} barY - Bar Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     */
    drawCrystalProgressBarFrame(barX, barY, barWidth, barHeight) {
        this.game.ctx.strokeStyle = '#666';
        this.game.ctx.lineWidth = 2;
        this.game.ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    /**
     * Draws the text of the crystal progress bar
     * @private
     * @param {number} barX - Bar X position
     * @param {number} barY - Bar Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     */
    drawCrystalProgressBarText(barX, barY, barWidth, barHeight) {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 12px Raleway';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'middle';
        this.game.ctx.fillText(`${this.game.score}/5000`, barX + barWidth / 2, barY + barHeight / 2);
    }

    /**
     * Sets up the text style for crystal text
     * @private
     */
    setupCrystalTextStyle() {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 14px Raleway';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'middle';
        
        this.game.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.game.ctx.shadowBlur = 4;
        this.game.ctx.shadowOffsetX = 2;
        this.game.ctx.shadowOffsetY = 2;
    }

    /**
     * Draws the crystal portal text
     * @private
     * @param {number} barX - Bar X position
     * @param {number} barY - Bar Y position
     * @param {number} barWidth - Bar width
     * @param {number} barHeight - Bar height
     * @param {boolean} isOnCrystal - Whether player is on crystal
     */
    drawCrystalPortalText(barX, barY, barWidth, barHeight, isOnCrystal) {
        if (isOnCrystal) {
            this.game.ctx.fillStyle = '#00ff00';
            this.game.ctx.fillText('Press E to Enter Boss Room', barX + barWidth / 2, barY + barHeight / 2);
        } else {
            this.game.ctx.fillStyle = '#ffaa00';
            this.game.ctx.fillText('Stand on Portal to Enter', barX + barWidth / 2, barY + barHeight / 2);
        }
    }

    /**
     * Resets the crystal text shadow
     * @private
     */
    resetCrystalTextShadow() {
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.shadowColor = 'transparent';
        this.game.ctx.shadowOffsetX = 0;
        this.game.ctx.shadowOffsetY = 0;
    }
}
