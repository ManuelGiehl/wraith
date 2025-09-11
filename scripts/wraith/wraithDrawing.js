/**
 * Wraith Drawing Module - Manages player rendering
 * @class
 */
class WraithDrawing {
    /**
     * Creates an instance of WraithDrawing
     * @param {Game} game - The main game instance
     * @param {Object} player - Player object
     * @constructor
     */
    constructor(game, player) {
        this.game = game;
        this.player = player;
    }

    /**
     * Draws the player
     * @public
     */
    drawPlayer() {
        const screenPos = this.game.cameraSystem.worldToScreen(this.player.x, this.player.y);
        if (!this.isPlayerInView(screenPos)) return;

        const imageData = this.getPlayerImageData();
        this.drawPlayerImage(screenPos, imageData);
    }

    /**
     * Checks if player is in view
     * @private
     * @param {Object} screenPos - Screen position
     * @returns {boolean} True if in view
     */
    isPlayerInView(screenPos) {
        return !(screenPos.x < -this.player.width || screenPos.x > this.game.width + this.player.width);
    }

    /**
     * Gets player image data
     * @private
     * @returns {Object} Image data with src and frame
     */
    getPlayerImageData() {
        if (this.player.isDying) {
            return this.getDyingImageData();
        } else if (this.player.isHurt) {
            return this.getHurtImageData();
        } else if (this.player.isCasting) {
            return this.getCastingImageData();
        } else if (this.player.isCastingUltimate) {
            return this.getUltimateCastingImageData();
        } else {
            return this.getNormalAnimationImageData();
        }
    }

    /**
     * Gets dying image data
     * @private
     * @returns {Object} Image data
     */
    getDyingImageData() {
        return {
            src: `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Dying/Wraith_01_Dying_${this.player.dyingFrame.toString().padStart(3, '0')}.png`,
            frame: this.player.dyingFrame
        };
    }

    /**
     * Gets hurt image data
     * @private
     * @returns {Object} Image data
     */
    getHurtImageData() {
        return {
            src: `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Hurt/Wraith_01_Hurt_${this.player.currentFrame.toString().padStart(3, '0')}.png`,
            frame: this.player.currentFrame
        };
    }

    /**
     * Gets casting image data
     * @private
     * @returns {Object} Image data
     */
    getCastingImageData() {
        return {
            src: `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Casting_Spells/Wraith_01_Casting_Spells_${this.player.castingFrame.toString().padStart(3, '0')}.png`,
            frame: this.player.castingFrame
        };
    }

    /**
     * Gets ultimate casting image data
     * @private
     * @returns {Object} Image data
     */
    getUltimateCastingImageData() {
        return {
            src: `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Casting_Spells/Wraith_01_Casting_Spells_${this.player.ultimateCastingFrame.toString().padStart(3, '0')}.png`,
            frame: this.player.ultimateCastingFrame
        };
    }

    /**
     * Gets normal animation image data
     * @private
     * @returns {Object} Image data
     */
    getNormalAnimationImageData() {
        const animation = this.player.currentAnimation;
        
        if (animation === 'walking') {
            return {
                src: `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Walking/Wraith_01_Moving_Forward_${this.player.currentFrame.toString().padStart(3, '0')}.png`,
                frame: this.player.currentFrame
            };
        } else if (animation === 'jumping') {
            return {
                src: `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Taunt/Wraith_01_Taunt_${this.player.jumpFrame.toString().padStart(3, '0')}.png`,
                frame: this.player.jumpFrame
            };
        } else if (animation === 'idleBlink') {
            return {
                src: `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Idle_Blink/Wraith_01_Idle_Blinking_${this.player.blinkFrame.toString().padStart(3, '0')}.png`,
                frame: this.player.blinkFrame
            };
        } else {
            return {
                src: `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Idle/Wraith_01_Idle_${this.player.currentFrame.toString().padStart(3, '0')}.png`,
                frame: this.player.currentFrame
            };
        }
    }

    /**
     * Draws player image
     * @private
     * @param {Object} screenPos - Screen position
     * @param {Object} imageData - Image data
     */
    drawPlayerImage(screenPos, imageData) {
        const image = this.game.loadedImages.get(imageData.src);
        if (image) {
            this.drawPlayerWithImage(screenPos, image);
        } else {
            this.drawPlayerFallback(screenPos);
        }
    }

    /**
     * Draws player with image
     * @private
     * @param {Object} screenPos - Screen position
     * @param {Image} image - Image
     */
    drawPlayerWithImage(screenPos, image) {
        this.game.ctx.save();
        
        if (this.game.bossRoomSystem.enteringBossRoom) {
            this.drawPlayerBossRoomAnimation(screenPos, image);
        } else {
            this.drawPlayerNormal(screenPos, image);
        }
        
        this.game.ctx.restore();
    }

    /**
     * Draws boss room animation
     * @private
     * @param {Object} screenPos - Screen position
     * @param {Image} image - Image
     */
    drawPlayerBossRoomAnimation(screenPos, image) {
        this.game.ctx.translate(screenPos.x + this.player.width / 2, screenPos.y + this.player.height / 2);
        this.game.ctx.rotate(this.game.bossRoomSystem.getBossRoomAnimation().rotation);
        this.game.ctx.translate(-this.player.width / 2, -this.player.height / 2);
        
        this.game.ctx.drawImage(image, 0, 0, this.player.width, this.player.height);
    }

    /**
     * Draws normal player representation
     * @private
     * @param {Object} screenPos - Screen position
     * @param {Image} image - Image
     */
    drawPlayerNormal(screenPos, image) {
        if (!this.player.facingRight) {
            this.game.ctx.scale(-1, 1);
            this.game.ctx.drawImage(image, -(screenPos.x + this.player.width), screenPos.y, this.player.width, this.player.height);
        } else {
            this.game.ctx.drawImage(image, screenPos.x, screenPos.y, this.player.width, this.player.height);
        }
    }

    /**
     * Draws fallback representation
     * @private
     * @param {Object} screenPos - Screen position
     */
    drawPlayerFallback(screenPos) {
        this.drawPlayerFallbackBody(screenPos);
        this.drawPlayerFallbackFace(screenPos);
        this.drawPlayerCastingEffect(screenPos);
    }

    /**
     * Draws fallback body
     * @private
     * @param {Object} screenPos - Screen position
     */
    drawPlayerFallbackBody(screenPos) {
        let color = '#4a90e2';
        if (this.player.isDying) color = '#666666';
        else if (this.player.isHurt) color = '#ff6666';
        else if (this.player.isCasting) color = '#ff6600';
        
        this.game.ctx.fillStyle = color;
        this.game.ctx.fillRect(screenPos.x, screenPos.y, this.player.width, this.player.height);
    }

    /**
     * Draws fallback face
     * @private
     * @param {Object} screenPos - Screen position
     */
    drawPlayerFallbackFace(screenPos) {
        this.game.ctx.fillStyle = this.player.isDying ? '#333333' : '#ffffff';
        this.game.ctx.fillRect(screenPos.x + 20, screenPos.y + 20, 12, 12);
        this.game.ctx.fillRect(screenPos.x + 50, screenPos.y + 20, 12, 12);
        
        this.game.ctx.fillStyle = this.player.isDying ? '#333333' : '#ffffff';
        this.game.ctx.fillRect(screenPos.x + 30, screenPos.y + 50, 20, 6);
    }

    /**
     * Draws casting effect
     * @private
     * @param {Object} screenPos - Screen position
     */
    drawPlayerCastingEffect(screenPos) {
        if (this.player.isCasting) {
            this.game.ctx.fillStyle = '#ffaa00';
            this.game.ctx.beginPath();
            this.game.ctx.arc(screenPos.x + this.player.width/2, screenPos.y + this.player.height/2, 30 + this.player.castingProgress, 0, Math.PI * 2);
            this.game.ctx.fill();
            
            this.game.ctx.fillText(`Casting: ${this.player.castingProgress}/${this.player.castingDuration}`, screenPos.x + 10, screenPos.y + this.player.height + 45);
        }
    }

    /**
     * Gets wraith hitbox for collision detection
     * @public
     * @returns {Object} Hitbox coordinates
     */
    getWraithHitbox() {
        const hitboxWidth = this.player.hitboxWidth || 30;
        const hitboxHeight = this.player.hitboxHeight || 40;
        
        return {
            x: this.player.x + (this.player.width - hitboxWidth) / 2,
            y: this.player.y + (this.player.height - hitboxHeight) / 2,
            width: hitboxWidth,
            height: hitboxHeight
        };
    }

    /**
     * Draws wraith debug info (hitbox)
     * @public
     * @param {Object} screenPos - Screen position
     */
    drawWraithDebugInfo(screenPos) {
        const hitboxWidth = this.player.hitboxWidth || 30;
        const hitboxHeight = this.player.hitboxHeight || 40;
        
        const hitboxX = screenPos.x + (this.player.width - hitboxWidth) / 2;
        const hitboxY = screenPos.y + (this.player.height - hitboxHeight) / 2;
        
        this.game.ctx.strokeStyle = '#00ffff';
        this.game.ctx.lineWidth = 4;
        this.game.ctx.setLineDash([8, 4]);
        this.game.ctx.strokeRect(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
        this.game.ctx.setLineDash([]);
        
        this.game.ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
        this.game.ctx.fillRect(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
        
        this.game.ctx.fillStyle = '#00ffff';
        this.game.ctx.font = 'bold 14px Arial';
        this.game.ctx.strokeStyle = '#000000';
        this.game.ctx.lineWidth = 2;
        this.game.ctx.strokeText('WRAITH HITBOX', hitboxX, hitboxY - 8);
        this.game.ctx.fillText('WRAITH HITBOX', hitboxX, hitboxY - 8);
    }
}
