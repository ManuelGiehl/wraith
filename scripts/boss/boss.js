/**
 * Boss system for the game
 * Manages the Boss3 with melee and ranged attacks
 */
class BossSystem {
    constructor(game) {
        this.game = game;
        this.boss = null;
        this.bossSpawned = false;
        this.bossActive = false;
        this.fireballs = [];
        this.lightnings = [];
        this.attacks = new BossAttacks(this);
        this.animationSystem = new BossAnimation(this);
        this.aiSystem = new BossAI(this);
        this.stateSystem = new BossState(this);
        this.renderingSystem = new BossRendering(this);
    }

    /**
     * Spawns the boss in the boss room
     */
    spawnBoss() {
        if (this.bossSpawned || !this.game.bossRoomSystem.inBossRoom) return;
        this.createBoss();
        this.bossSpawned = true;
        this.bossActive = true;
    }
        
    /**
     * Creates the boss object with all properties
     */
    createBoss() {
        this.boss = {
            x: 100,
            y: this.game.height / 2 + 20,
            width: 100,
            height: 200,
            spriteWidth: 225,
            spriteHeight: 300,
            health: 1000,
            maxHealth: 1000,
            attackDamage: 20,
            meleeRange: 120,
            rangedRange: 850,
            attackCooldown: 0,
            magicAttackCooldown: 0,
            isAttacking: false,
            isMagicAttacking: false,
            isLightningAttacking: false,
            isHurt: false,
            isDead: false,
            currentAnimation: 'idle',
            facingRight: true,
            idleTime: 0,
            maxIdleTime: 60,
            hurtTimer: 0,
            meleeAttackTimer: 0,
            magicAttackTimer: 0,
            lightningAttackTimer: 0,
            magicFireSoundPlayed: false
        };
    }

    /**
     * Updates the boss system
     */
    updateBoss() {
        if (!this.boss || !this.bossActive) return;
        this.animationSystem.updateBossAnimation();
        this.stateSystem.handleBossDeath();
        this.stateSystem.updateBossState();
        this.aiSystem.updateBossAI();
        this.attacks.updateFireballs();
        this.attacks.updateLightnings();
    }


    /**
     * Draws the boss
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawBoss(ctx) {
        this.renderingSystem.drawBoss(ctx);
    }

    /**
     * Checks if boss is active
     * @returns {boolean} True if boss is active
     */
    isBossActive() {
        return this.bossActive && this.boss && !this.boss.isDead;
    }

    /**
     * Gets the boss object
     * @returns {Object} Boss object
     */
    getBoss() {
        return this.boss;
    }

    /**
     * Makes boss take damage
     * @param {number} damage - Damage amount
     */
    takeDamage(damage) {
        if (this.boss && !this.boss.isDead) {
            this.boss.health -= damage;
            const healthThresholds = [1000, 750, 500, 250];
            const shouldPlayHurtAnimation = healthThresholds.some(threshold => 
                this.boss.health <= threshold && this.boss.health + damage > threshold
            );
            if (shouldPlayHurtAnimation) {
                this.boss.isHurt = true;
                this.boss.hurtTimer = 30;
                this.boss.currentAnimation = 'hurt';
            }
        }
    }

    /**
     * Resets the boss system
     */
    reset() {
        this.boss = null;
        this.bossSpawned = false;
        this.bossActive = false;
        this.fireballs = [];
        this.lightnings = [];
    }

    /**
     * Draws boss health bar
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawBossHealthBar(ctx) {
        this.renderingSystem.drawBossHealthBar(ctx);
    }
}
