/**
 * Spell Caster - Handles all spell casting logic
 * @class
 */
class SpellCaster {
    /**
     * Creates an instance of SpellCaster
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
        this.ultimateLightningDuration = 96;
    }

    /**
     * Casts a normal spell
     * @public
     * @returns {Object} Normal spell data object
     */
    castSpell() {
        const direction = this.game.wraithSystem.player.facingRight ? 1 : -1;
        return this.createNormalSpellData(direction);
    }

    /**
     * Creates normal spell data
     * @private
     * @param {number} direction - Direction of the spell (1 or -1)
     * @returns {Object} Normal spell data object
     */
    createNormalSpellData(direction) {
        return {
            x: this.game.wraithSystem.player.x + (this.game.wraithSystem.player.facingRight ? this.game.wraithSystem.player.width - 20 : -70),
            y: this.game.wraithSystem.player.y + this.game.wraithSystem.player.height / 2 - 50,
            width: 90,
            height: 90,
            velocityX: direction * 8,
            velocityY: 0,
            lifetime: 60,
            damage: this.game.wraithSystem.player.sSkillDamage,
            isExploding: false,
            currentFrame: 0,
            frameCount: 0,
            isUltimate: false,
            hasHit: false
        };
    }

    /**
     * Casts an ultimate lightning spell
     * @public
     * @returns {Array} Array of created lightning spells
     */
    castUltimateSpell() {
        const wraithX = this.game.wraithSystem.player.x;
        const spellRange = 550;
        
        const golemSpells = this.hitGolemsWithUltimate(wraithX, spellRange);
        const bossSpells = this.hitBossWithUltimate();
        
        this.game.score += 2500;
        
        return [...golemSpells, ...bossSpells];
    }

    /**
     * Hits golems with ultimate lightning spell
     * @private
     * @param {number} wraithX - X position of the wraith
     * @param {number} spellRange - Range of the ultimate spell
     * @returns {Array} Array of created golem lightning spells
     */
    hitGolemsWithUltimate(wraithX, spellRange) {
        if (this.game.bossRoomSystem.inBossRoom) return [];
        
        const spells = [];
        this.game.golemSystem.golems.forEach(golem => {
            const distance = Math.abs(golem.x - wraithX);
            if (distance <= spellRange && golem.lastUltimateHit !== this.game.ultimateCastId) {
                this.damageGolemWithUltimate(golem);
                spells.push(this.createGolemLightning(golem));
            }
        });
        return spells;
    }

    /**
     * Damages a golem with ultimate spell
     * @private
     * @param {Object} golem - The golem to damage
     */
    damageGolemWithUltimate(golem) {
        golem.health -= this.game.wraithSystem.player.ultimateDamage;
        golem.lastUltimateHit = this.game.ultimateCastId;
        
        if (golem.health > 0) {
            golem.isHurt = true;
            golem.hurtTimer = 20;
        }
    }

    /**
     * Creates lightning effect over a golem
     * @private
     * @param {Object} golem - The golem to create lightning over
     * @returns {Object} Golem lightning spell data
     */
    createGolemLightning(golem) {
        return {
            x: golem.x + golem.width / 2 - 75,
            y: golem.y - 20,
            width: 150,
            height: 150,
            velocityX: 0,
            velocityY: 0,
            lifetime: this.ultimateLightningDuration,
            damage: this.game.wraithSystem.player.ultimateDamage,
            isExploding: false,
            currentFrame: 0,
            frameCount: 0,
            isUltimate: true,
            isLightning: true,
            isGolemLightning: true,
            targetX: golem.x + golem.width / 2,
            targetY: golem.y - 20,
            lightningPhase: 'hovering',
            strikeDelay: 20,
            hasHit: false,
            alpha: 1
        };
    }

    /**
     * Hits boss with ultimate lightning spell
     * @private
     * @returns {Array} Array containing boss lightning spell or empty array
     */
    hitBossWithUltimate() {
        if (!this.game.bossRoomSystem.inBossRoom || !this.game.bossSystem.boss) return [];
        if (this.game.bossSystem.boss.lastUltimateHit === this.game.ultimateCastId) return [];
        
        this.damageBossWithUltimate();
        return [this.createBossLightning()];
    }

    /**
     * Damages boss with ultimate spell
     * @private
     */
    damageBossWithUltimate() {
        this.game.bossSystem.boss.health -= this.game.wraithSystem.player.ultimateDamage;
        this.game.bossSystem.boss.lastUltimateHit = this.game.ultimateCastId;
        
        if (this.game.bossSystem.boss.health > 0) {
            this.game.bossSystem.boss.isHurt = true;
            this.game.bossSystem.boss.hurtTimer = 20;
        }
    }

    /**
     * Creates lightning effect over the boss
     * @private
     * @returns {Object} Boss lightning spell data
     */
    createBossLightning() {
        const bossY = this.game.bossSystem.boss.y;
        
        return {
            x: 200,
            y: bossY + 50,
            width: 150,
            height: 100,
            velocityX: 0,
            velocityY: 0,
            lifetime: this.ultimateLightningDuration,
            damage: this.game.wraithSystem.player.ultimateDamage,
            isExploding: false,
            currentFrame: 0,
            frameCount: 0,
            isUltimate: true,
            isLightning: true,
            isBossLightning: true,
            zIndex: 1000,
            targetX: 200,
            targetY: bossY + 50,
            lightningPhase: 'hovering',
            strikeDelay: 20,
            hasHit: false,
            alpha: 1
        };
    }
}
