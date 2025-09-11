/**
 * Potion System - Manages mana potions with drop, glow effects and auto-pickup
 * @class
 */
class PotionSystem {
    /**
     * Creates an instance of PotionSystem
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
        this.manaPotions = [];
        this.pickupRange = 80;
    }

    /**
     * Spawns a mana potion at the specified position
     * @public
     * @param {number} x - X coordinate for potion spawn
     * @param {number} y - Y coordinate for potion spawn
     */
    spawnManaPotion(x, y) {
        const potion = {
            x: x,
            y: y,
            width: 32,
            height: 32,
            glowPhase: 0,
            glowSpeed: 0.1,
            collected: false
        };
        
        this.manaPotions.push(potion);
    }

    /**
     * Updates all mana potions
     * @public
     */
    updateManaPotions() {
        this.manaPotions.forEach((potion, index) => {
            if (potion.collected) {
                this.manaPotions.splice(index, 1);
                return;
            }

            this.updatePotionAnimation(potion);
            this.checkPotionPickup(potion);
        });
    }

    /**
     * Updates potion glow animation
     * @private
     * @param {Object} potion - The potion object to update
     */
    updatePotionAnimation(potion) {
        potion.glowPhase += potion.glowSpeed;
        if (potion.glowPhase > Math.PI * 2) {
            potion.glowPhase = 0;
        }
    }

    /**
     * Checks if player can pick up a mana potion
     * @private
     * @param {Object} potion - The potion object to check
     */
    checkPotionPickup(potion) {
        const player = this.game.wraithSystem.player;
        const distance = this.calculateDistanceToPlayer(potion, player);

        if (distance <= this.pickupRange) {
            this.collectPotion(potion, player);
        }
    }

    /**
     * Calculates distance between potion and player
     * @private
     * @param {Object} potion - The potion object
     * @param {Object} player - The player object
     * @returns {number} Distance between potion and player
     */
    calculateDistanceToPlayer(potion, player) {
        return Math.sqrt(
            Math.pow(player.x + player.width/2 - (potion.x + potion.width/2), 2) +
            Math.pow(player.y + player.height/2 - (potion.y + potion.height/2), 2)
        );
    }

    /**
     * Collects a potion and plays pickup sound
     * @private
     * @param {Object} potion - The potion object to collect
     * @param {Object} player - The player object
     */
    collectPotion(potion, player) {
        player.manaPotions++;
        potion.collected = true;
        
        this.playPotionPickupSound();
    }

    /**
     * Plays potion pickup sound effect
     * @private
     */
    playPotionPickupSound() {
        this.game.soundEffectsSystem.playSoundWithVolume('potion_pickup', 0.5);
    }

    /**
     * Draws all mana potions
     * @public
     */
    drawManaPotions() {
        this.manaPotions.forEach(potion => {
            if (potion.collected) return;

            const screenPos = this.game.cameraSystem.worldToScreen(potion.x, potion.y);
            
            if (!this.isPotionInView(potion, screenPos)) return;

            this.drawPotionGlow(potion, screenPos);
            this.drawPotionImage(potion, screenPos);
        });
    }

    /**
     * Checks if potion is in view
     * @private
     * @param {Object} potion - The potion object
     * @param {Object} screenPos - Screen position coordinates
     * @returns {boolean} True if potion is in view
     */
    isPotionInView(potion, screenPos) {
        return !(screenPos.x < -potion.width || screenPos.x > this.game.width + potion.width ||
                 screenPos.y < -potion.height || screenPos.y > this.game.height + potion.height);
    }

    /**
     * Draws the glow effect of the potion
     * @private
     * @param {Object} potion - The potion object
     * @param {Object} screenPos - Screen position coordinates
     */
    drawPotionGlow(potion, screenPos) {
        const glowIntensity = (Math.sin(potion.glowPhase) + 1) / 2;
        const glowSize = 8 + glowIntensity * 12;
        
        this.game.ctx.save();
        this.game.ctx.globalAlpha = 0.3 + glowIntensity * 0.4;
        this.game.ctx.fillStyle = '#00aaff';
        this.game.ctx.beginPath();
        this.game.ctx.arc(
            screenPos.x + potion.width/2, 
            screenPos.y + potion.height/2, 
            glowSize, 
            0, 
            Math.PI * 2
        );
        this.game.ctx.fill();
        this.game.ctx.restore();
    }

    /**
     * Draws the potion image or fallback
     * @private
     * @param {Object} potion - The potion object
     * @param {Object} screenPos - Screen position coordinates
     */
    drawPotionImage(potion, screenPos) {
        const potionImage = this.game.loadedImages.get('models/img/potion/manapotion.png');
        if (potionImage) {
            this.drawPotionSprite(potion, screenPos, potionImage);
        } else {
            this.drawPotionFallback(potion, screenPos);
        }
    }

    /**
     * Draws the potion sprite
     * @private
     * @param {Object} potion - The potion object
     * @param {Object} screenPos - Screen position coordinates
     * @param {Image} potionImage - The potion image to draw
     */
    drawPotionSprite(potion, screenPos, potionImage) {
        this.game.ctx.drawImage(
            potionImage, 
            screenPos.x, 
            screenPos.y, 
            potion.width, 
            potion.height
        );
    }

    /**
     * Draws fallback potion (blue bottle)
     * @private
     * @param {Object} potion - The potion object
     * @param {Object} screenPos - Screen position coordinates
     */
    drawPotionFallback(potion, screenPos) {
        this.game.ctx.fillStyle = '#0066cc';
        this.game.ctx.fillRect(screenPos.x, screenPos.y, potion.width, potion.height);
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = '12px Arial';
        this.game.ctx.fillText('MP', screenPos.x + 8, screenPos.y + 20);
    }

    /**
     * Resets the potion system
     * @public
     */
    reset() {
        this.manaPotions = [];
    }
}
