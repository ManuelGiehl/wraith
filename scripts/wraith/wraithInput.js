/**
 * Wraith Input Module - Manages player input handling
 * @class
 */
class WraithInput {
    /**
     * Creates an instance of WraithInput
     * @param {Game} game - The main game instance
     * @param {Object} player - Player object
     * @constructor
     */
    constructor(game, player) {
        this.game = game;
        this.player = player;
    }

    /**
     * Handles key press events
     * @public
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        if (this.game.gameOver) return;

        switch (e.code) {
            case 'ArrowLeft':
                this.handleLeftArrow();
                break;
            case 'ArrowRight':
                this.handleRightArrow();
                break;
            case 'KeyA':
                this.handleAutoAttack();
                break;
            case 'Space':
                this.handleJump();
                break;
            case 'KeyQ':
                this.handleManaPotion();
                break;
            case 'KeyR':
                this.handleUltimate();
                break;
            case 'KeyE':
                this.handleBossRoomEntry();
                break;
            case 'Escape':
                this.game.togglePause();
                break;
        }
    }

    /**
     * Handles left arrow key
     * @private
     */
    handleLeftArrow() {
        if (!this.player.isCasting) {
            this.player.velocityX = -this.player.speed;
            this.player.facingRight = false;
            this.player.currentAnimation = 'walking';
        }
    }

    /**
     * Handles right arrow key
     * @private
     */
    handleRightArrow() {
        if (!this.player.isCasting) {
            this.player.velocityX = this.player.speed;
            this.player.facingRight = true;
            this.player.currentAnimation = 'walking';
        }
    }

    /**
     * Handles auto attack
     * @private
     */
    handleAutoAttack() {
        if (!this.player.isCasting && !this.player.isCastingUltimate && !this.player.isHurt && !this.player.isDying) {
            this.startCasting();
        }
    }

    /**
     * Handles jump
     * @private
     */
    handleJump() {
        if (!this.player.isCasting && !this.player.isCastingUltimate && !this.player.isHurt && !this.player.isDying && this.player.isGrounded) {
            this.playJumpSound();
            this.executeJump();
        }
    }

    /**
     * Plays jump sound
     * @private
     */
    playJumpSound() {
        this.game.soundEffectsSystem.playSoundWithVolume('wraith_jump', 0.525);
    }

    /**
     * Executes jump
     * @private
     */
    executeJump() {
        this.player.velocityY = -this.player.jumpPower;
        this.player.isGrounded = false;
        this.player.isJumping = true;
        this.player.jumpFrame = 0;
        this.player.currentAnimation = 'jumping';
        this.player.hasMoved = true;
    }

    /**
     * Handles mana potion
     * @private
     */
    handleManaPotion() {
        if (this.player.manaPotions > 0) {
            this.player.mana = this.player.maxMana;
            this.player.manaPotions--;
            this.player.ultimateReady = true;
        }
    }

    /**
     * Handles ultimate
     * @private
     */
    handleUltimate() {
        if (!this.player.isCasting && !this.player.isCastingUltimate && this.player.mana >= 100) {
            this.startUltimateCasting();
        }
    }

    /**
     * Handles boss room entry
     * @private
     */
    handleBossRoomEntry() {
        if (this.game.score >= 5000 && this.game.crystalSystem.isPlayerOnCrystal()) {
            this.game.crystalSystem.enterBossRoom();
        }
    }

    /**
     * Starts casting
     * @public
     */
    startCasting() {
        if (this.game.spellSystem.spells.length >= 15) return;
        
        this.player.isCasting = true;
        this.player.currentAnimation = 'casting';
        this.player.castingFrame = 0;
        this.player.castingProgress = 0;
        this.player.velocityX = 0;
    }

    /**
     * Finishes casting and throws spell
     * @public
     */
    finishCasting() {
        this.player.isCasting = false;
        this.player.currentAnimation = 'idle';
        this.player.castingFrame = 0;
        this.player.castingProgress = 0;
        
        this.game.spellSystem.castSpell();
    }

    /**
     * Starts ultimate casting
     * @public
     */
    startUltimateCasting() {
        this.player.isCastingUltimate = true;
        this.player.currentAnimation = 'casting';
        this.player.ultimateCastingFrame = 0;
        this.player.velocityX = 0;
    }
}
