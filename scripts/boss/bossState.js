/**
 * Boss State Management System
 * Manages boss state updates and transitions
 */
class BossState {
    constructor(bossSystem) {
        this.bossSystem = bossSystem;
        this.game = bossSystem.game;
    }

    /**
     * Updates boss state
     */
    updateBossState() {
        if (this.bossSystem.boss.isDead) return;
        this.updateHurtState();
        this.updateCooldowns();
        this.updateMagicAttack();
        this.updateLightningAttack();
        this.updateMeleeAttack();
    }

    /**
     * Updates hurt state
     */
    updateHurtState() {
        if (this.bossSystem.boss.isHurt) {
            this.bossSystem.boss.hurtTimer--;
            if (this.bossSystem.boss.hurtTimer <= 0) {
                this.bossSystem.boss.isHurt = false;
                this.bossSystem.boss.currentAnimation = 'idle';
            }
        }
    }

    /**
     * Updates attack cooldowns
     */
    updateCooldowns() {
        if (this.bossSystem.boss.attackCooldown > 0) this.bossSystem.boss.attackCooldown--;
        if (this.bossSystem.boss.magicAttackCooldown > 0) this.bossSystem.boss.magicAttackCooldown--;
    }

    /**
     * Updates magic attack
     */
    updateMagicAttack() {
        if (this.bossSystem.boss.isMagicAttacking) {
            this.bossSystem.boss.magicAttackTimer++;
            this.playMagicFireSound();
            this.handleMagicAttackEnd();
        }
    }

    /**
     * Plays magic fire sound
     */
    playMagicFireSound() {
        if (this.bossSystem.boss.magicAttackTimer === 6 && !this.bossSystem.boss.magicFireSoundPlayed) {
            this.game.soundEffectsSystem.playSoundWithVolume('boss_fire', 0.5);
            this.bossSystem.boss.magicFireSoundPlayed = true;
        }
    }

    /**
     * Handles magic attack end
     */
    handleMagicAttackEnd() {
        if (this.bossSystem.boss.magicAttackTimer >= 15) {
            this.bossSystem.attacks.shootFireball();
            this.bossSystem.boss.isMagicAttacking = false;
            this.bossSystem.boss.magicAttackTimer = 0;
            this.bossSystem.boss.isLightningAttacking = true;
            this.bossSystem.boss.currentAnimation = 'magicLightning';
        }
    }

    /**
     * Updates lightning attack
     */
    updateLightningAttack() {
        if (this.bossSystem.boss.isLightningAttacking) {
            this.bossSystem.boss.lightningAttackTimer++;
            if (this.bossSystem.boss.lightningAttackTimer >= 40) {
                this.bossSystem.attacks.shootLightning();
                this.bossSystem.boss.isLightningAttacking = false;
                this.bossSystem.boss.lightningAttackTimer = 0;
                this.bossSystem.boss.currentAnimation = 'idle';
            }
        }
    }

    /**
     * Updates melee attack
     */
    updateMeleeAttack() {
        if (this.bossSystem.boss.isAttacking) {
            this.bossSystem.boss.meleeAttackTimer++;
            if (this.bossSystem.boss.meleeAttackTimer === 20) {
                this.bossSystem.attacks.executeMeleeAttack();
            }
            if (this.bossSystem.boss.meleeAttackTimer >= 21) {
                this.bossSystem.boss.isAttacking = false;
                this.bossSystem.boss.currentAnimation = 'idle';
                this.bossSystem.boss.meleeAttackTimer = 0;
            }
        }
    }

    /**
     * Handles boss death
     */
    handleBossDeath() {
        if (this.bossSystem.boss.health <= 0 && !this.bossSystem.boss.isDead) {
            this.bossSystem.boss.isDead = true;
            this.bossSystem.boss.currentAnimation = 'dead';
            this.bossSystem.boss.dyingFrame = 0;
            this.bossSystem.boss.frameCount = 0;
            this.playDeathSound();
        }
    }

    /**
     * Plays boss death sound
     */
    playDeathSound() {
        this.game.soundEffectsSystem.playSoundWithVolume('boss_death', 0.8);
    }
}
