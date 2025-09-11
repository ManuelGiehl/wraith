/**
 * Wraith Animation Module - Manages player animations
 * @class
 */
class WraithAnimation {
    /**
     * Creates an instance of WraithAnimation
     * @param {Game} game - The main game instance
     * @param {Object} player - Player object
     * @constructor
     */
    constructor(game, player) {
        this.game = game;
        this.player = player;
    }

    /**
     * Updates player animations
     * @public
     */
    updatePlayerAnimation() {
        if (this.player.isDying) {
            return;
        } else if (this.player.isCasting) {
            this.updateCastingAnimation();
        } else if (this.player.isCastingUltimate) {
            this.updateUltimateCastingAnimation();
        } else {
            this.updateNormalAnimations();
        }
    }

    /**
     * Updates casting animation
     * @private
     */
    updateCastingAnimation() {
        this.player.frameCount += 1.0;
        
        if (this.player.frameCount >= 1) {
            this.player.castingFrame++;
            this.player.castingProgress++;
            this.player.frameCount = 0;
            
            if (this.player.castingFrame >= this.player.castingDuration) {
                this.finishCasting();
            }
        }
    }

    /**
     * Updates ultimate casting animation
     * @private
     */
    updateUltimateCastingAnimation() {
        this.player.frameCount += 1.0;
        
        if (this.player.frameCount >= 1) {
            this.player.ultimateCastingFrame++;
            this.player.frameCount = 0;
            
            if (this.player.ultimateCastingFrame >= this.player.ultimateCastingDuration) {
                this.finishUltimateCasting();
            }
        }
    }

    /**
     * Updates normal animations
     * @private
     */
    updateNormalAnimations() {
        this.updateAnimationFrameRate();
        this.updateAnimationFrames();
    }

    /**
     * Updates animation frame rate
     * @private
     */
    updateAnimationFrameRate() {
        if (this.player.currentAnimation === 'walking') {
            this.player.frameCount += 1.0;
        } else if (this.player.currentAnimation === 'jumping') {
            this.player.frameCount += 1.0;
        } else if (this.player.currentAnimation === 'idleBlink') {
            this.player.frameCount += 1.0;
        } else {
            this.player.frameCount += 0.8;
        }
    }

    /**
     * Updates animation frames
     * @private
     */
    updateAnimationFrames() {
        if (this.player.frameCount >= 1) {
            if (this.player.currentAnimation === 'jumping') {
                this.updateJumpAnimation();
            } else if (this.player.currentAnimation === 'idleBlink') {
                this.updateIdleBlinkAnimation();
            } else {
                this.updateStandardAnimation();
            }
            this.player.frameCount = 0;
        }
    }

    /**
     * Updates jump animation
     * @private
     */
    updateJumpAnimation() {
        this.player.jumpFrame = (this.player.jumpFrame + 1) % 18;
    }

    /**
     * Updates idle blink animation
     * @private
     */
    updateIdleBlinkAnimation() {
        if (this.player.blinkFrame < 11) {
            this.player.blinkFrame++;
        } else {
            this.player.blinkFrame = 11;
        }
    }

    /**
     * Updates standard animation
     * @private
     */
    updateStandardAnimation() {
        this.player.currentFrame = (this.player.currentFrame + 1) % 12;
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
     * Finishes ultimate casting and throws lightning
     * @public
     */
    finishUltimateCasting() {
        this.resetUltimateState();
        this.incrementUltimateCastCount();
        this.increaseDamage();
        this.checkUltimateDamageIncrease();
        this.updateSpawnInterval();
        this.spawnBonusGolems();
        this.increaseGolemHP();
        this.generateUltimateCastId();
        this.playUltimateLightningSound();
        this.castUltimateSpell();
        this.endUltimateCasting();
    }

    /**
     * Resets ultimate state
     * @private
     */
    resetUltimateState() {
        this.player.mana = 0;
        this.player.ultimateReady = false;
    }

    /**
     * Increments ultimate cast count
     * @private
     */
    incrementUltimateCastCount() {
        this.player.ultimateCastCount++;
    }

    /**
     * Increases damage
     * @private
     */
    increaseDamage() {
        this.player.oldDamage = this.player.sSkillDamage;
        this.player.sSkillDamage += 15;
        this.player.newDamage = this.player.sSkillDamage;
        
        this.player.showDamageIncrease = true;
        this.player.damageIncreaseTimer = 0;
    }

    /**
     * Checks ultimate damage increase
     * @private
     */
    checkUltimateDamageIncrease() {
        if (this.player.ultimateCastCount % 5 === 0) {
            this.player.oldUltimateDamage = this.player.ultimateDamage;
            this.player.ultimateDamage += 100;
            this.player.newUltimateDamage = this.player.ultimateDamage;
            
            this.player.showUltimateDamageIncrease = true;
            this.player.ultimateDamageIncreaseTimer = 0;
        }
    }

    /**
     * Updates spawn interval
     * @private
     */
    updateSpawnInterval() {
        const currentInterval = this.game.golemSystem.golemSpawnInterval;
        let newInterval;
        if (currentInterval === 2000) {
            newInterval = 1750;
        } else if (currentInterval === 1750) {
            newInterval = 1500;
        } else {
            newInterval = 1500;
        }
        this.game.golemSystem.golemSpawnInterval = newInterval;
    }

    /**
     * Spawns bonus golems
     * @private
     */
    spawnBonusGolems() {
        this.game.golemSystem.spawnBonusGolems(3);
    }

    /**
     * Increases golem HP
     * @private
     */
    increaseGolemHP() {
        this.game.golemSystem.increaseGolemHP();
    }

    /**
     * Generates new ultimate cast ID
     * @private
     */
    generateUltimateCastId() {
        this.game.ultimateCastId++;
    }

    /**
     * Plays ultimate lightning sound
     * @private
     */
    playUltimateLightningSound() {
        this.game.soundEffectsSystem.playSoundWithVolume('ultimatelightning', 0.4);
    }

    /**
     * Casts ultimate spell
     * @private
     */
    castUltimateSpell() {
        this.game.spellSystem.castUltimateSpell();
    }

    /**
     * Ends ultimate casting
     * @private
     */
    endUltimateCasting() {
        this.player.isCastingUltimate = false;
        this.player.currentAnimation = 'idle';
        this.player.ultimateCastingFrame = 0;
    }
}
