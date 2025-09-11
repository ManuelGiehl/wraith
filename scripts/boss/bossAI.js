/**
 * Boss AI System
 * Manages boss AI behavior and decision making
 */
class BossAI {
    constructor(bossSystem) {
        this.bossSystem = bossSystem;
        this.game = bossSystem.game;
    }

    /**
     * Updates boss AI behavior
     */
    updateBossAI() {
        if (this.bossSystem.boss.isHurt || this.bossSystem.boss.isAttacking || 
            this.bossSystem.boss.isMagicAttacking || this.bossSystem.boss.isDead) return;
        
        this.updateBossFacing();
        this.updateBossIdle();
        this.checkAttackConditions();
    }

    /**
     * Updates boss facing direction
     */
    updateBossFacing() {
        this.bossSystem.boss.facingRight = this.game.wraithSystem.player.x > this.bossSystem.boss.x;
    }

    /**
     * Updates boss idle state
     */
    updateBossIdle() {
        if (this.bossSystem.boss.idleTime < this.bossSystem.boss.maxIdleTime) {
            this.bossSystem.boss.idleTime++;
            this.bossSystem.boss.currentAnimation = 'idle';
            return;
        }
    }

    /**
     * Checks attack conditions
     */
    checkAttackConditions() {
        const distanceToPlayer = Math.abs(this.game.wraithSystem.player.x - this.bossSystem.boss.x);
        const playerInMeleeRange = distanceToPlayer <= this.bossSystem.boss.meleeRange;
        
        if (playerInMeleeRange && this.bossSystem.boss.attackCooldown <= 0) {
            this.bossSystem.attacks.startMeleeAttack();
        } else if (distanceToPlayer > this.bossSystem.boss.meleeRange && 
                   distanceToPlayer <= this.bossSystem.boss.rangedRange && 
                   this.bossSystem.boss.magicAttackCooldown <= 0) {
            this.bossSystem.attacks.startMagicAttack();
        }
    }
}
