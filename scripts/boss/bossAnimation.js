/**
 * Boss Animation System
 * Manages all boss animation-related functionality
 */
class BossAnimation {
    constructor(bossSystem) {
        this.bossSystem = bossSystem;
        this.game = bossSystem.game;
        this.initializeAnimations();
    }

    /**
     * Initializes boss animations
     */
    initializeAnimations() {
        this.animations = {
            idle: { frames: 3, frameTime: 8, currentFrame: 0, frameCount: 0 },
            meleeAttack: { frames: 7, frameTime: 3, currentFrame: 0, frameCount: 0 },
            magicFire: { frames: 5, frameTime: 3, currentFrame: 0, frameCount: 0 },
            magicLightning: { frames: 5, frameTime: 8, currentFrame: 0, frameCount: 0 },
            hurt: { frames: 2, frameTime: 4, currentFrame: 0, frameCount: 0 },
            dead: { frames: 6, frameTime: 3, currentFrame: 0, frameCount: 0 }
        };
    }

    /**
     * Updates boss animation frames
     */
    updateBossAnimation() {
        const animation = this.animations[this.bossSystem.boss.currentAnimation];
        if (!animation) return;
        if (this.bossSystem.boss.isDead) {
            this.updateDeathAnimation();
        } else {
            this.updateNormalAnimation(animation);
        }
    }

    /**
     * Updates death animation
     */
    updateDeathAnimation() {
        this.bossSystem.boss.frameCount += 1.0;
        if (this.bossSystem.boss.frameCount >= 1) {
            if (this.bossSystem.boss.dyingFrame < 5) {
                this.bossSystem.boss.dyingFrame++;
            }
            this.bossSystem.boss.frameCount = 0;
            this.handleDeathAnimationEnd();
        }
    }

    /**
     * Handles death animation end
     */
    handleDeathAnimationEnd() {
        if (this.bossSystem.boss.dyingFrame >= 5 && !this.bossSystem.boss.deathAnimationFinished) {
            this.bossSystem.boss.deathAnimationTimer = (this.bossSystem.boss.deathAnimationTimer || 0) + 1;
            if (this.bossSystem.boss.deathAnimationTimer >= 120) {
                this.bossSystem.boss.deathAnimationFinished = true;
            }
        }
    }

    /**
     * Updates normal animation frames
     * @param {Object} animation - Animation object
     */
    updateNormalAnimation(animation) {
        animation.frameCount++;
        if (animation.frameCount >= animation.frameTime) {
            animation.currentFrame = (animation.currentFrame + 1) % animation.frames;
            animation.frameCount = 0;
        }
    }

    /**
     * Gets boss image name for current frame
     * @param {number} frameIndex - Frame index
     * @returns {string} Image path
     */
    getBossImageName(frameIndex) {
        const animationMap = {
            'idle': 'models/img/boss/Boss3/Boss3/Idle',
            'meleeAttack': 'models/img/boss/Boss3/Boss3/Attack',
            'magicFire': 'models/img/boss/Boss3/Boss3/Magic_fire',
            'magicLightning': 'models/img/boss/Boss3/Boss3/Magic_lightning',
            'hurt': 'models/img/boss/Boss3/Boss3/Hurt',
            'dead': 'models/img/boss/Boss3/Boss3/Death'
        };
        const prefix = animationMap[this.bossSystem.boss.currentAnimation] || 'models/img/boss/Boss3/Boss3/Idle';
        return prefix + (frameIndex + 1) + '.png';
    }
}
