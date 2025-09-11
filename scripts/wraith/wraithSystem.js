/**
 * Wraith System - Main class that coordinates all wraith modules
 * @class
 */
class WraithSystem {
    /**
     * Creates an instance of WraithSystem
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
        this.player = this.createPlayerObject();
        this.initializeModules();
    }

    /**
     * Creates the player object with all properties
     * @private
     * @returns {Object} Player object
     */
    createPlayerObject() {
        return {
            x: 100,
            y: 250,
            width: 96,
            height: 96,
            hitboxWidth: 30,
            hitboxHeight: 40,
            velocityX: 0,
            velocityY: 0,
            speed: 4,
            jumpPower: 12,
            isGrounded: false,
            gravity: 0.5,
            health: 100,
            maxHealth: 100,
            facingRight: true,
            currentAnimation: 'idle',
            currentFrame: 0,
            frameCount: 0,
            idleTimer: 0,
            idleThreshold: 120,
            isCasting: false,
            castingFrame: 0,
            castingDuration: 18,
            castingProgress: 0,
            mana: 0,
            maxMana: 100,
            ultimateReady: false,
            isCastingUltimate: false,
            ultimateCastingFrame: 0,
            ultimateCastingDuration: 6,
            manaPotions: 0,
            isHurt: false,
            isDying: false,
            hurtTimer: 0,
            dyingFrame: 0,
            dyingStartTime: 0,
            isJumping: false,
            jumpFrame: 0,
            sSkillDamage: 30,
            hasMoved: false,
            isBlinking: false,
            blinkFrame: 0,
            idleBlinkTimer: 0,
            idleBlinkThreshold: 180,
            showDamageIncrease: false,
            damageIncreaseTimer: 0,
            damageIncreaseDuration: 150,
            oldDamage: 0,
            newDamage: 0,
            ultimateDamage: 100,
            ultimateCastCount: 0,
            showUltimateDamageIncrease: false,
            ultimateDamageIncreaseTimer: 0,
            ultimateDamageIncreaseDuration: 150,
            oldUltimateDamage: 0,
            newUltimateDamage: 0
        };
    }

    /**
     * Initializes all wraith modules
     * @private
     */
    initializeModules() {
        this.inputModule = new WraithInput(this.game, this.player);
        this.animationModule = new WraithAnimation(this.game, this.player);
        this.drawingModule = new WraithDrawing(this.game, this.player);
        this.physicsModule = new WraithPhysics(this.game, this.player);
    }

    /**
     * Starts a new game
     * @public
     */
    startGame() {
        this.player = this.createPlayerObject();
        this.initializeModules();
    }

    /**
     * Handles key press events
     * @public
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        this.inputModule.handleKeyDown(e);
    }

    /**
     * Updates the player
     * @public
     */
    updatePlayer() {
        this.physicsModule.updatePlayer();
        this.animationModule.updatePlayerAnimation();
    }

    /**
     * Draws the player
     * @public
     */
    drawPlayer() {
        this.drawingModule.drawPlayer();
    }

    /**
     * Gets wraith hitbox for collision detection
     * @public
     * @returns {Object} Hitbox coordinates
     */
    getWraithHitbox() {
        return this.drawingModule.getWraithHitbox();
    }

    /**
     * Draws wraith debug info
     * @public
     * @param {Object} screenPos - Screen position
     */
    drawWraithDebugInfo(screenPos) {
        this.drawingModule.drawWraithDebugInfo(screenPos);
    }

    /**
     * Starts casting
     * @public
     */
    startCasting() {
        this.inputModule.startCasting();
    }

    /**
     * Finishes casting
     * @public
     */
    finishCasting() {
        this.animationModule.finishCasting();
    }

    /**
     * Starts ultimate casting
     * @public
     */
    startUltimateCasting() {
        this.inputModule.startUltimateCasting();
    }

    /**
     * Finishes ultimate casting
     * @public
     */
    finishUltimateCasting() {
        this.animationModule.finishUltimateCasting();
    }
}
