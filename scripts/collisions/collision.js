/**
 * Collision system for the game
 * Manages all collisions between game objects
 */

class CollisionSystem {
    constructor(game) {
        this.game = game;
    }

    /**
     * Checks all collisions
     */
    checkCollisions() {
        this.checkSpellBossCollisions();
        this.checkSpellGolemCollisions();
        this.checkBossAttackCollisions();
        this.checkGolemPlayerCollisions();
    }

    /**
     * Checks spell vs boss collisions
     */
    checkSpellBossCollisions() {
        if (!this.game.bossRoomSystem.inBossRoom || !this.game.bossSystem.isBossActive()) return;
        
        const boss = this.game.bossSystem.getBoss();
        if (!boss) return;

        this.game.spellSystem.spells.forEach((spell, spellIndex) => {
            const spellHitbox = this.getSpellHitbox(spell);
            const bossHitbox = this.getObjectHitbox(boss);
            
            if (this.checkHitboxCollision(spellHitbox, bossHitbox) && (!spell.hasHit || spell.isUltimate)) {
                this.handleSpellBossHit(spell, spellIndex);
            }
        });
    }

    /**
     * Handles spell hitting boss
     * @param {Object} spell - Spell object
     * @param {number} spellIndex - Spell index
     */
    handleSpellBossHit(spell, spellIndex) {
        if (!spell.isLightning || !spell.isUltimate) {
            this.game.bossSystem.takeDamage(spell.damage);
            spell.hasHit = true;
            this.handleSpellExplosion(spell, spellIndex);
        } else if (spell.isBossLightning) {
            spell.hasHit = true;
        }
    }

    /**
     * Handles spell explosion
     * @param {Object} spell - Spell object
     * @param {number} spellIndex - Spell index
     */
    handleSpellExplosion(spell, spellIndex) {
        if (!spell.isUltimate) {
            this.setSpellExploding(spell);
        } else {
            this.game.spellSystem.spells.splice(spellIndex, 1);
        }
    }

    /**
     * Sets spell to exploding state
     * @param {Object} spell - Spell object
     */
    setSpellExploding(spell) {
        spell.isExploding = true;
        spell.lifetime = 30;
        spell.currentFrame = 0;
        spell.frameCount = 0;
        spell.velocityX = 0;
        spell.velocityY = 0;
    }

    /**
     * Checks spell vs golem collisions
     */
    checkSpellGolemCollisions() {
        if (this.game.bossRoomSystem.inBossRoom || this.game.bossRoomSystem.enteringBossRoom) return;

        this.game.spellSystem.spells.forEach((spell, spellIndex) => {
            this.game.golemSystem.golems.forEach((golem, golemIndex) => {
                const spellHitbox = this.getSpellHitbox(spell);
                const golemHitbox = this.getObjectHitbox(golem);
                
                if (this.checkHitboxCollision(spellHitbox, golemHitbox) && (!spell.hasHit || spell.isUltimate)) {
                    this.handleSpellGolemHit(spell, spellIndex, golem);
                }
            });
        });
    }
    
    /**
     * Gets spell hitbox for collision detection
     * @param {Object} spell - Spell object
     * @returns {Object} Spell hitbox coordinates and dimensions
     */
    getSpellHitbox(spell) {
        const hitboxSize = Math.min(spell.width, spell.height) * 0.4;
        return {
            x: spell.x + (spell.width - hitboxSize) / 2,
            y: spell.y + (spell.height - hitboxSize) / 2,
            width: hitboxSize,
            height: hitboxSize
        };
    }
    
    /**
     * Checks collision between two hitboxes
     * @param {Object} hitbox1 - First hitbox
     * @param {Object} hitbox2 - Second hitbox
     * @returns {boolean} True if collision detected
     */
    checkHitboxCollision(hitbox1, hitbox2) {
        return hitbox1.x < hitbox2.x + hitbox2.width &&
               hitbox1.x + hitbox1.width > hitbox2.x &&
               hitbox1.y < hitbox2.y + hitbox2.height &&
               hitbox1.y + hitbox1.height > hitbox2.y;
    }

    /**
     * Handles spell hitting golem
     * @param {Object} spell - Spell object
     * @param {number} spellIndex - Spell index
     * @param {Object} golem - Golem object
     */
    handleSpellGolemHit(spell, spellIndex, golem) {
        if (!spell.isLightning || !spell.isUltimate) {
            this.damageGolem(spell, golem);
            spell.hasHit = true;
            this.handleSpellExplosion(spell, spellIndex);
            if (!spell.isUltimate) {
                this.applySplashDamage(spell, golem);
            }
        } else if (spell.isBossLightning) {
            spell.hasHit = true;
        }
    }

    /**
     * Damages golem and handles rewards
     * @param {Object} spell - Spell object
     * @param {Object} golem - Golem object
     */
    damageGolem(spell, golem) {
        const oldHealth = golem.health;
        golem.health -= spell.damage;
        
        if (golem.health <= 0 && oldHealth > 0) {
            this.game.score += 10;
            this.game.wraithSystem.player.mana = Math.min(100, this.game.wraithSystem.player.mana + 5);
        }
        
        if (golem.health > 0) {
            golem.isHurt = true;
            golem.hurtTimer = 15;
        }
    }

    /**
     * Checks boss attack collisions
     */
    checkBossAttackCollisions() {
        if (!this.game.bossRoomSystem.inBossRoom || !this.game.bossSystem.isBossActive()) return;

        this.checkBossMeleeRange();
        this.checkFireballCollisions();
        this.checkLightningCollisions();
    }

    /**
     * Checks boss melee range
     */
    checkBossMeleeRange() {
        const boss = this.game.bossSystem.getBoss();
        if (!boss) return;

        const distanceToPlayer = Math.abs(this.game.wraithSystem.player.x - boss.x);
        if (distanceToPlayer <= boss.meleeRange) {
        }
    }

    /**
     * Checks fireball collisions
     */
    checkFireballCollisions() {
        this.game.bossSystem.fireballs.forEach((fireball, fireballIndex) => {
            const wraithHitbox = this.game.wraithSystem.getWraithHitbox();
            const fireballHitbox = this.createFireballHitbox(fireball);
            
            if (this.checkHitboxCollision(fireballHitbox, wraithHitbox)) {
                this.damagePlayer(20);
                this.playWraithHurtSound();
                this.game.bossSystem.fireballs.splice(fireballIndex, 1);
            }
        });
    }
    
    /**
     * Creates fireball hitbox
     * @param {Object} fireball - Fireball object
     * @returns {Object} Fireball hitbox
     */
    createFireballHitbox(fireball) {
        const hitboxSize = Math.min(fireball.width, fireball.height) * 0.7;
        return {
            x: fireball.x + (fireball.width - hitboxSize) / 2,
            y: fireball.y + (fireball.height - hitboxSize) / 2,
            width: hitboxSize,
            height: hitboxSize
        };
    }

    /**
     * Checks lightning collisions
     */
    checkLightningCollisions() {
        this.game.bossSystem.lightnings.forEach((lightning, lightningIndex) => {
            const lightningHitbox = this.createLightningHitbox(lightning);
            const wraithHitbox = this.game.wraithSystem.getWraithHitbox();
            
            if (this.checkHitboxCollision(lightningHitbox, wraithHitbox)) {
                this.damagePlayer(30);
                this.playWraithHurtSound();
                this.game.bossSystem.lightnings.splice(lightningIndex, 1);
            }
        });
    }

    /**
     * Creates lightning hitbox
     * @param {Object} lightning - Lightning object
     * @returns {Object} Lightning hitbox
     */
    createLightningHitbox(lightning) {
        return {
            x: lightning.x + (lightning.spriteWidth - lightning.width) / 2,
            y: lightning.y,
            width: lightning.width,
            height: lightning.height
        };
    }

    /**
     * Checks golem vs player collisions
     */
    checkGolemPlayerCollisions() {
        if (this.game.bossRoomSystem.inBossRoom || this.game.bossRoomSystem.enteringBossRoom) return;

        this.game.golemSystem.golems.forEach(golem => {
            const wraithHitbox = this.game.wraithSystem.getWraithHitbox();
            const golemHitbox = this.getObjectHitbox(golem);
            
            const collision = this.checkHitboxCollision(wraithHitbox, golemHitbox);
            
            const isWraithGrounded = this.game.wraithSystem.player.isGrounded;
        
            const isGolemAttacking = golem.isAttacking && golem.attackTimer > 0 && golem.attackTimer <= 5;
            
            if (collision && isGolemAttacking && !golem.hasDealtDamage && isWraithGrounded) {
                this.damagePlayer(20);
                this.playWraithHurtSound();
                golem.hasDealtDamage = true;
            }
            
            if (!collision || !isGolemAttacking) {
                golem.hasDealtDamage = false;
            }
        });
    }

    /**
     * Damages player
     * @param {number} damage - Damage amount
     */
    damagePlayer(damage) {
        this.game.wraithSystem.player.isHurt = true;
        this.game.wraithSystem.player.hurtTimer = 30;
        this.game.wraithSystem.player.health -= damage;
    }

    /**
     * Plays wraith hurt sound
     */
    playWraithHurtSound() {
        this.game.soundEffectsSystem.playSoundWithVolume('wraith_hurt', 0.1);
    }

    /**
     * Applies splash damage to nearby golems
     * @param {Object} spell - Spell object
     * @param {Object} hitGolem - Hit golem object
     */
    applySplashDamage(spell, hitGolem) {
        const splashRadius = 80;
        const splashDamage = Math.floor(spell.damage * 0.5);
        
        this.game.golemSystem.golems.forEach(golem => {
            if (golem === hitGolem) return;
            
            const distance = this.calculateDistance(spell, golem);
            if (distance <= splashRadius) {
                this.applySplashDamageToGolem(golem, splashDamage);
            }
        });
    }

    /**
     * Calculates distance between two objects
     * @param {Object} obj1 - First object
     * @param {Object} obj2 - Second object
     * @returns {number} Distance
     */
    calculateDistance(obj1, obj2) {
        return Math.sqrt(
            Math.pow(obj1.x - obj2.x, 2) +  Math.pow(obj1.y - obj2.y, 2)
        );
    }

    /**
     * Applies splash damage to golem
     * @param {Object} golem - Golem object
     * @param {number} splashDamage - Splash damage amount
     */
    applySplashDamageToGolem(golem, splashDamage) {
        const oldHealth = golem.health;
        golem.health -= splashDamage;
        
        if (golem.health <= 0 && oldHealth > 0) {
            this.game.wraithSystem.player.mana = Math.min(100, this.game.wraithSystem.player.mana + 3);
        }
        if (golem.health > 0) {
            golem.isHurt = true;
            golem.hurtTimer = 15;
        }
    }

    /**
     * Checks collision between two objects
     * @param {Object} obj1 - First object
     * @param {Object} obj2 - Second object
     * @returns {boolean} True if collision detected
     */
    checkCollision(obj1, obj2) {
        const hitbox1 = this.getObjectHitbox(obj1);
        const hitbox2 = this.getObjectHitbox(obj2);
        
        return hitbox1.x < hitbox2.x + hitbox2.width &&
               hitbox1.x + hitbox1.width > hitbox2.x &&
               hitbox1.y < hitbox2.y + hitbox2.height &&
               hitbox1.y + hitbox1.height > hitbox2.y;
    }
    
    /**
     * Gets object hitbox for collision detection
     * @param {Object} obj - Object to get hitbox for
     * @returns {Object} Hitbox coordinates and dimensions
     */
    getObjectHitbox(obj) {
        if (obj.type === 'golem') {
            const hitboxWidth = obj.width * 0.35;
            const hitboxHeight = obj.height * 0.25;
            return {
                x: obj.x + (obj.width - hitboxWidth) / 2,
                y: obj.y + (obj.height - hitboxHeight) / 2 + 5,
                width: hitboxWidth,
                height: hitboxHeight
            };
        } else if (obj.hitboxWidth && obj.hitboxHeight) {
            return {
                x: obj.x + (obj.width - obj.hitboxWidth) / 2,
                y: obj.y + (obj.height - obj.hitboxHeight) / 2,
                width: obj.hitboxWidth,
                height: obj.hitboxHeight
            };
        } else {
            return {
                x: obj.x, y: obj.y,
                width: obj.width, height: obj.height
            };
        }
    }
}