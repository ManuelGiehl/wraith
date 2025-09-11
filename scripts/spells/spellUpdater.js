/**
 * Spell Updater - Handles all spell update logic and animations
 * @class
 */
class SpellUpdater {
    /**
     * Creates an instance of SpellUpdater
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
        this.ultimateLightningDuration = 96;
        this.ultimateLightningFadeStart = 91;
    }

    /**
     * Updates all spells
     * @public
     * @param {Array} spells - Array of spells to update
     * @returns {Array} Updated spells array
     */
    updateSpells(spells) {
        spells.forEach(spell => {
            if (spell.isLightning) {
                this.updateLightningSpell(spell);
            } else {
                this.updateNormalSpell(spell);
            }
        });

        return this.removeExpiredSpells(spells);
    }

    /**
     * Updates lightning spell animation
     * @private
     * @param {Object} spell - The lightning spell to update
     */
    updateLightningSpell(spell) {
        spell.lifetime--;
        spell.strikeDelay--;
        
        this.updateLightningAlpha(spell);
        this.updateLightningAnimation(spell);
    }

    /**
     * Updates lightning spell alpha for fade effect
     * @private
     * @param {Object} spell - The lightning spell to update
     */
    updateLightningAlpha(spell) {
        if (spell.lifetime <= this.ultimateLightningFadeStart) {
            const fadeProgress = (this.ultimateLightningFadeStart - spell.lifetime) / (this.ultimateLightningFadeStart - 0);
            spell.alpha = Math.max(0, 1 - fadeProgress);
        } else {
            spell.alpha = 1;
        }
    }

    /**
     * Updates lightning spell animation phases
     * @private
     * @param {Object} spell - The lightning spell to update
     */
    updateLightningAnimation(spell) {
        if (spell.lightningPhase === 'hovering') {
            this.updateHoveringPhase(spell);
        } else if (spell.lightningPhase === 'striking') {
            this.updateStrikingPhase(spell);
        }
    }

    /**
     * Updates hovering phase of lightning spell
     * @private
     * @param {Object} spell - The lightning spell to update
     */
    updateHoveringPhase(spell) {
        spell.frameCount += 0.5;
        if (spell.frameCount >= 1) {
            spell.currentFrame = (spell.currentFrame + 1) % 5;
            spell.frameCount = 0;
        }
        
        if (spell.strikeDelay <= 0) {
            spell.lightningPhase = 'striking';
            spell.currentFrame = 0;
            spell.frameCount = 0;
            spell.lifetime = this.ultimateLightningDuration;
        }
    }

    /**
     * Updates striking phase of lightning spell
     * @private
     * @param {Object} spell - The lightning spell to update
     */
    updateStrikingPhase(spell) {
        spell.frameCount += 0.5;
        if (spell.frameCount >= 1) {
            spell.currentFrame = (spell.currentFrame + 1) % 5;
            spell.frameCount = 0;
        }
    }

    /**
     * Updates normal spell movement and animation
     * @private
     * @param {Object} spell - The normal spell to update
     */
    updateNormalSpell(spell) {
        spell.x += spell.velocityX;
        spell.y += spell.velocityY;
        spell.lifetime--;
        
        if (spell.isExploding) {
            this.updateExplosionAnimation(spell);
        }
    }

    /**
     * Updates explosion animation for normal spells
     * @private
     * @param {Object} spell - The spell to update
     */
    updateExplosionAnimation(spell) {
        spell.frameCount += 1.0;
        if (spell.frameCount >= 1) {
            spell.currentFrame = (spell.currentFrame + 1) % 10;
            spell.frameCount = 0;
        }
    }

    /**
     * Removes spells with expired lifetime
     * @private
     * @param {Array} spells - Array of spells to filter
     * @returns {Array} Filtered spells array
     */
    removeExpiredSpells(spells) {
        return spells.filter(spell => spell.lifetime > 0);
    }
}
