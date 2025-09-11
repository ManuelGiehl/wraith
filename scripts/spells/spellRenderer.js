/**
 * Spell Renderer - Handles all spell drawing and rendering logic
 * @class
 */
class SpellRenderer {
    /**
     * Creates an instance of SpellRenderer
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Draws a single spell
     * @public
     * @param {Object} spell - The spell to draw
     */
    drawSpell(spell) {
        const screenPos = this.game.cameraSystem.worldToScreen(spell.x, spell.y);
        if (!this.isSpellInView(screenPos, spell)) return;

        const imageSrc = this.getSpellImageSource(spell);
        const image = this.game.loadedImages.get(imageSrc);
        
        if (image) {
            this.drawSpellWithImage(spell, screenPos, image);
        } else {
            this.drawSpellFallback(spell, screenPos);
        }
    }

    /**
     * Checks if spell is in view
     * @private
     * @param {Object} screenPos - Screen position of the spell
     * @param {Object} spell - The spell to check
     * @returns {boolean} True if spell is in view
     */
    isSpellInView(screenPos, spell) {
        return !(screenPos.x < -spell.width || screenPos.x > this.game.width + spell.width);
    }

    /**
     * Gets the image source for a spell
     * @private
     * @param {Object} spell - The spell to get image source for
     * @returns {string} Image source path
     */
    getSpellImageSource(spell) {
        if (spell.isLightning) {
            return this.getLightningImageSource(spell);
        } else if (spell.isExploding) {
            return this.getExplosionImageSource(spell);
        } else {
            return this.getNormalSpellImageSource(spell);
        }
    }

    /**
     * Gets lightning image source
     * @private
     * @param {Object} spell - The lightning spell
     * @returns {string} Lightning image source path
     */
    getLightningImageSource(spell) {
        return `models/img/spells/PNG/Explosion_7/1/Explosion_${spell.currentFrame + 1}.png`;
    }

    /**
     * Gets explosion image source
     * @private
     * @param {Object} spell - The exploding spell
     * @returns {string} Explosion image source path
     */
    getExplosionImageSource(spell) {
        if (spell.isUltimate) {
            return `models/img/spells/PNG/Explosion_7/1/Explosion_${spell.currentFrame + 1}.png`;
        } else {
            return `models/img/spells/PNG/Explosion_5/Explosion_${spell.currentFrame + 1}.png`;
        }
    }

    /**
     * Gets normal spell image source
     * @private
     * @param {Object} spell - The normal spell
     * @returns {string} Normal spell image source path
     */
    getNormalSpellImageSource(spell) {
        if (spell.isUltimate) {
            return 'models/img/spells/PNG/Explosion_7/1/Explosion_1.png';
        } else {
            return 'models/img/spells/PNG/Explosion_5/Explosion_1.png';
        }
    }

    /**
     * Draws spell with loaded image
     * @private
     * @param {Object} spell - The spell to draw
     * @param {Object} screenPos - Screen position of the spell
     * @param {HTMLImageElement} image - The image to draw
     */
    drawSpellWithImage(spell, screenPos, image) {
        if (spell.isLightning) {
            this.drawLightningWithImage(spell, screenPos, image);
        } else if (spell.isExploding) {
            this.drawExplosionWithImage(spell, screenPos, image);
        } else {
            this.drawNormalSpellWithImage(spell, screenPos, image);
        }
    }

    /**
     * Draws lightning spell with image
     * @private
     * @param {Object} spell - The lightning spell
     * @param {Object} screenPos - Screen position of the spell
     * @param {HTMLImageElement} image - The image to draw
     */
    drawLightningWithImage(spell, screenPos, image) {
        this.game.ctx.save();
        this.game.ctx.globalAlpha = spell.alpha || 1;
        this.game.ctx.drawImage(image, screenPos.x, screenPos.y, spell.width, spell.height);
        this.game.ctx.restore();
    }

    /**
     * Draws explosion spell with image
     * @private
     * @param {Object} spell - The exploding spell
     * @param {Object} screenPos - Screen position of the spell
     * @param {HTMLImageElement} image - The image to draw
     */
    drawExplosionWithImage(spell, screenPos, image) {
        const explosionSize = 180;
        const explosionX = screenPos.x - (explosionSize - spell.width) / 2;
        const explosionY = screenPos.y - (explosionSize - spell.height) / 2;
        this.game.ctx.drawImage(image, explosionX, explosionY, explosionSize, explosionSize);
    }

    /**
     * Draws normal spell with image
     * @private
     * @param {Object} spell - The normal spell
     * @param {Object} screenPos - Screen position of the spell
     * @param {HTMLImageElement} image - The image to draw
     */
    drawNormalSpellWithImage(spell, screenPos, image) {
        this.game.ctx.drawImage(image, screenPos.x, screenPos.y, spell.width, spell.height);
    }

    /**
     * Draws spell fallback when image is not loaded
     * @private
     * @param {Object} spell - The spell to draw
     * @param {Object} screenPos - Screen position of the spell
     */
    drawSpellFallback(spell, screenPos) {
        if (spell.isLightning) {
            this.drawLightningFallback(spell, screenPos);
        } else if (spell.isExploding) {
            this.drawExplosionFallback(spell, screenPos);
        } else {
            this.drawNormalSpellFallback(spell, screenPos);
        }
    }

    /**
     * Draws lightning spell fallback
     * @private
     * @param {Object} spell - The lightning spell
     * @param {Object} screenPos - Screen position of the spell
     */
    drawLightningFallback(spell, screenPos) {
        const color = spell.lightningPhase === 'hovering' ? '#00aaff' : '#ffaa00';
        this.game.ctx.save();
        this.game.ctx.globalAlpha = spell.alpha || 1;
        this.game.ctx.fillStyle = color;
        this.game.ctx.beginPath();
        this.game.ctx.arc(screenPos.x + spell.width/2, screenPos.y + spell.height/2, 40, 0, Math.PI * 2);
        this.game.ctx.fill();
        this.game.ctx.restore();
    }

    /**
     * Draws explosion spell fallback
     * @private
     * @param {Object} spell - The exploding spell
     * @param {Object} screenPos - Screen position of the spell
     */
    drawExplosionFallback(spell, screenPos) {
        this.game.ctx.fillStyle = '#ff6600';
        this.game.ctx.beginPath();
        this.game.ctx.arc(screenPos.x + spell.width/2, screenPos.y + spell.height/2, 60 + spell.currentFrame * 3, 0, Math.PI * 2);
        this.game.ctx.fill();
    }

    /**
     * Draws normal spell fallback
     * @private
     * @param {Object} spell - The normal spell
     * @param {Object} screenPos - Screen position of the spell
     */
    drawNormalSpellFallback(spell, screenPos) {
        this.game.ctx.fillStyle = '#ff6600';
        this.game.ctx.beginPath();
        this.game.ctx.arc(screenPos.x + spell.width/2, screenPos.y + spell.height/2, spell.width/2, 0, Math.PI * 2);
        this.game.ctx.fill();
    }
}
