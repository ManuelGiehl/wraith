/**
 * Wraith Physics Module - Manages player physics and movement
 * @class
 */
class WraithPhysics {
    /**
     * Creates an instance of WraithPhysics
     * @param {Game} game - The main game instance
     * @param {Object} player - Player object
     * @constructor
     */
    constructor(game, player) {
        this.game = game;
        this.player = player;
    }

    /**
     * Updates player physics and movement
     * @public
     */
    updatePlayer() {
        this.player.hurtTimer = Math.max(0, this.player.hurtTimer - 1);
        
        this.handleDeathLogic();
        if (this.player.isDying) return;
        
        this.handleHurtAnimation();
        this.updatePhysics();
        this.updatePosition();
        this.handleBossRoomBounds();
        this.handleGroundCollision();
        this.handleInput();
        this.handleIdleBlink();
        this.updateUltimateReady();
        this.updateDamageFeedback();
    }

    /**
     * Handles death logic
     * @private
     */
    handleDeathLogic() {
        if (this.player.health <= 0 && !this.player.isDying) {
            this.initiateDeath();
        }
        
        if (this.player.isDying) {
            this.updateDyingAnimation();
        }
    }

    /**
     * Initiates death process
     * @private
     */
    initiateDeath() {
        this.player.isDying = true;
        this.player.dyingFrame = 0;
        this.player.currentAnimation = 'dying';
        this.player.dyingStartTime = Date.now();
        
        this.playDeathSounds();
        this.positionPlayerOnGround();
    }

    /**
     * Plays death sounds
     * @private
     */
    playDeathSounds() {
        this.game.soundEffectsSystem.playSoundWithVolume('wraith_hurt', 0.3125);
        
        if (this.game.backgroundMusicSystem) {
            this.game.backgroundMusicSystem.stop();
        }
        
        this.game.soundEffectsSystem.playSoundWithVolume('gameover', 0.2);
    }

    /**
     * Positions player on ground
     * @private
     */
    positionPlayerOnGround() {
        let groundLevel;
        if (this.game.bossRoomSystem.inBossRoom) {
            groundLevel = 600;
        } else {
            groundLevel = 670;
        }
        this.player.y = groundLevel - this.player.height + 30;
        this.player.velocityY = 0;
    }

    /**
     * Updates dying animation
     * @private
     */
    updateDyingAnimation() {
        this.player.frameCount += 1.0;
        if (this.player.frameCount >= 1) {
            if (this.player.dyingFrame < 14) {
                this.player.dyingFrame++;
            }
            this.player.frameCount = 0;
            
            if (this.player.dyingFrame >= 14) {
                this.checkDyingDelay();
            }
        }
    }

    /**
     * Checks dying delay
     * @private
     */
    checkDyingDelay() {
        const timeSinceDying = Date.now() - this.player.dyingStartTime;
        const dyingDuration = 1500;
        
        if (timeSinceDying >= dyingDuration) {
            this.game.gameOver = true;
            this.game.showGameOver();
        }
    }

    /**
     * Handles hurt animation
     * @private
     */
    handleHurtAnimation() {
        if (this.player.isHurt) {
            this.player.currentAnimation = 'hurt';
            if (this.player.hurtTimer <= 0) {
                this.player.isHurt = false;
                this.player.currentAnimation = 'idle';
            }
        }
    }

    /**
     * Updates physics
     * @private
     */
    updatePhysics() {
        if (!this.game.bossRoomSystem.enteringBossRoom) {
            this.player.velocityY += this.player.gravity;
        }
    }

    /**
     * Updates position
     * @private
     */
    updatePosition() {
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;
    }

    /**
     * Handles boss room bounds
     * @private
     */
    handleBossRoomBounds() {
        if (this.game.bossRoomSystem.inBossRoom) {
            const margin = 20;
            this.player.x = Math.max(margin, Math.min(this.player.x, this.game.width - this.player.width - margin));
            
            if (this.player.y + this.player.height > 600) {
                this.player.y = 600 - this.player.height;
                this.player.velocityY = 0;
                this.player.isGrounded = true;
            }
        }
    }

    /**
     * Handles ground collision
     * @private
     */
    handleGroundCollision() {
        if (!this.game.bossRoomSystem.enteringBossRoom) {
            let groundLevel;
            if (this.game.bossRoomSystem.inBossRoom) {
                groundLevel = 600;
            } else {
                groundLevel = 670;
            }
            
            if (this.player.y + this.player.height >= groundLevel) {
                this.player.y = groundLevel - this.player.height;
                this.player.velocityY = 0;
                this.player.isGrounded = true;
                this.player.isJumping = false;
            } else {
                this.player.isGrounded = false;
            }
        }
    }

    /**
     * Handles input
     * @private
     */
    handleInput() {
        if (!this.player.isCasting && !this.player.isCastingUltimate && !this.player.isHurt && !this.player.isDying && !this.game.bossRoomSystem.enteringBossRoom) {
            this.processMovementInput();
        } else {
            this.stopMovementDuringSpecialStates();
        }
    }

    /**
     * Processes movement input
     * @private
     */
    processMovementInput() {
        if (this.game.keys['ArrowLeft']) {
            this.moveLeft();
        } else if (this.game.keys['ArrowRight']) {
            this.moveRight();
        } else {
            this.applyFriction();
        }
    }

    /**
     * Moves left
     * @private
     */
    moveLeft() {
        this.player.velocityX = -this.player.speed;
        this.player.facingRight = false;
        this.player.hasMoved = true;
        if (this.player.isGrounded) {
            this.player.currentAnimation = 'walking';
        }
    }

    /**
     * Moves right
     * @private
     */
    moveRight() {
        this.player.velocityX = this.player.speed;
        this.player.facingRight = true;
        this.player.hasMoved = true;
        if (this.player.isGrounded) {
            this.player.currentAnimation = 'walking';
        }
    }

    /**
     * Applies friction
     * @private
     */
    applyFriction() {
        this.player.velocityX *= 0.8;
        if (Math.abs(this.player.velocityX) < 0.1) {
            this.player.velocityX = 0;
        }
        if (this.player.isGrounded && !this.player.isJumping && !this.player.isBlinking) {
            this.player.currentAnimation = 'idle';
        }
    }

    /**
     * Stops movement during special states
     * @private
     */
    stopMovementDuringSpecialStates() {
        if (!this.game.bossRoomSystem.enteringBossRoom) {
            this.player.velocityX = 0;
        }
    }

    /**
     * Handles idle blink logic
     * @private
     */
    handleIdleBlink() {
        if (!this.player.isHurt && !this.player.isDying) {
            if (Math.abs(this.player.velocityX) < 0.1 && this.player.isGrounded && !this.player.isJumping) {
                this.updateIdleBlinkTimer();
            } else {
                this.resetIdleBlink();
            }
        }
    }

    /**
     * Updates idle blink timer
     * @private
     */
    updateIdleBlinkTimer() {
        if (!this.player.isBlinking) {
            this.player.idleBlinkTimer++;
        }
        
        if (this.player.idleBlinkTimer >= this.player.idleBlinkThreshold && !this.player.isBlinking) {
            this.player.isBlinking = true;
            this.player.blinkFrame = 0;
            this.player.currentAnimation = 'idleBlink';
        }
        
        if (this.player.isBlinking && this.player.blinkFrame >= 11) {
            this.player.idleBlinkTimer = 0;
        }
    }

    /**
     * Resets idle blink
     * @private
     */
    resetIdleBlink() {
        this.player.idleBlinkTimer = 0;
        this.player.isBlinking = false;
        this.player.blinkFrame = 0;
    }

    /**
     * Updates ultimate ready status
     * @private
     */
    updateUltimateReady() {
        if (this.player.mana >= 100) {
            this.player.ultimateReady = true;
        } else {
            this.player.ultimateReady = false;
        }
    }

    /**
     * Updates damage feedback
     * @private
     */
    updateDamageFeedback() {
        this.updateDamageIncreaseFeedback();
        this.updateUltimateDamageIncreaseFeedback();
    }

    /**
     * Updates damage increase feedback
     * @private
     */
    updateDamageIncreaseFeedback() {
        if (this.player.showDamageIncrease) {
            this.player.damageIncreaseTimer++;
            if (this.player.damageIncreaseTimer >= this.player.damageIncreaseDuration) {
                this.player.showDamageIncrease = false;
                this.player.damageIncreaseTimer = 0;
            }
        }
    }

    /**
     * Updates ultimate damage increase feedback
     * @private
     */
    updateUltimateDamageIncreaseFeedback() {
        if (this.player.showUltimateDamageIncrease) {
            this.player.ultimateDamageIncreaseTimer++;
            if (this.player.ultimateDamageIncreaseTimer >= this.player.ultimateDamageIncreaseDuration) {
                this.player.showUltimateDamageIncrease = false;
                this.player.ultimateDamageIncreaseTimer = 0;
            }
        }
    }
}
