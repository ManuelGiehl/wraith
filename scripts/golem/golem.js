/**
 * Golem System - Manages all golem-related functions
 * Handles spawning, updating, and rendering of golems in the game
 */
class GolemSystem {
    /**
     * Creates a new GolemSystem instance
     * @param {Object} game - The game instance
     */
    constructor(game) {
        this.game = game;
        this.golems = [];
        this.lastGolemSpawn = 0;
        this.golemSpawnInterval = 2000;
        this.lastEliteGolemSpawn = 0;
        this.eliteGolemSpawnInterval = 15000;
        this.golemHPMultiplier = 1.0;
    }

    /**
     * Spawns new normal golems at regular intervals
     * Only spawns if player has moved and not in boss room
     */
    spawnGolems() {
        if (!this.canSpawnGolems()) return;
        const now = Date.now();
        if (now - this.lastGolemSpawn > this.golemSpawnInterval && this.golems.length < 20) {
            this.createGolem('normal');
            this.lastGolemSpawn = now;
        }
    }

    /**
     * Spawns elite golem every 15 seconds
     * Elite golems have more HP and drop potions when killed
     */
    spawnEliteGolem() {
        if (!this.canSpawnGolems()) return;
        const now = Date.now();
        if (now - this.lastEliteGolemSpawn > this.eliteGolemSpawnInterval) {
            this.createGolem('elite');
            this.lastEliteGolemSpawn = now;
        }
    }

    /**
     * Spawns bonus golems (e.g. at 100 mana)
     * @param {number} count - Number of golems to spawn
     */
    spawnBonusGolems(count) {
        for (let i = 0; i < count; i++) this.createGolem('bonus');
    }

    /**
     * Checks if golems can be spawned
     * @returns {boolean} True if golems can be spawned
     */
    canSpawnGolems() {
        return this.game.wraithSystem.player.hasMoved && 
               !this.game.bossRoomSystem.inBossRoom && 
               !this.game.bossRoomSystem.enteringBossRoom;
    }

    /**
     * Creates a golem of specified type
     * @param {string} type - Type of golem ('normal', 'elite', 'bonus')
     */
    createGolem(type) {
        const config = this.getGolemConfig(type);
        const position = this.calculateGolemPosition(config);
        const golemData = this.createGolemData(config, position);
        this.golems.push(golemData);
    }

    /**
     * Gets golem configuration based on type
     * @param {string} type - Type of golem
     * @returns {Object} Configuration object with distance, hp, and isElite
     */
    getGolemConfig(type) {
        const configs = {
            normal: { distance: 400, hp: 90, isElite: false },
            elite: { distance: 500, hp: 150, isElite: true },
            bonus: { distance: 300 + Math.random() * 200, hp: 90, isElite: false }
        };
        return configs[type];
    }

    /**
     * Calculates golem spawn position relative to player
     * @param {Object} config - Golem configuration
     * @returns {Object} Position object with x and y coordinates
     */
    calculateGolemPosition(config) {
        const playerX = this.game.wraithSystem.player.x;
        const x = playerX + (Math.random() < 0.5 ? -config.distance : config.distance);
        return { x, y: 670 - 120 };
    }

    /**
     * Creates golem data object with all properties
     * @param {Object} config - Golem configuration
     * @param {Object} position - Golem position
     * @returns {Object} Complete golem data object
     */
    createGolemData(config, position) {
        return {
            x: position.x, y: position.y, width: 120, height: 120, velocityY: 0,
            health: Math.floor(config.hp * this.golemHPMultiplier),
            maxHealth: Math.floor(config.hp * this.golemHPMultiplier),
            damage: 20, currentAnimation: 'idle', currentFrame: 0, frameCount: 0,
            isDying: false, isHurt: false, isAttacking: false,
            hurtTimer: 0, attackTimer: 0, dyingFrame: 0, attackCooldown: 0,
            facingRight: true, hasDealtDamage: false, isElite: config.isElite,
            lastUltimateHit: -1, potionDropped: false
        };
    }

    /**
     * Updates all golems in the game
     * Handles timers, death, behavior, physics, and animation
     */
    updateGolems() {
        this.golems.forEach(golem => {
            this.updateGolemTimers(golem);
            this.handleGolemDeath(golem);
            
            if (golem.isDying) {
                this.updateDyingGolem(golem);
                return;
            }
            
            this.updateGolemBehavior(golem);
            this.updateGolemPhysics(golem);
            this.updateGolemAnimation(golem);
        });
        this.golems = this.golems.filter(golem => golem.health !== -1);
    }

    /**
     * Updates golem timers (hurt, attack, cooldown)
     * @param {Object} golem - The golem to update
     */
    updateGolemTimers(golem) {
        golem.hurtTimer = Math.max(0, golem.hurtTimer - 1);
        golem.attackTimer = Math.max(0, golem.attackTimer - 1);
        golem.attackCooldown = Math.max(0, golem.attackCooldown - 1);
    }

    /**
     * Handles golem death when health reaches 0
     * @param {Object} golem - The golem to check for death
     */
    handleGolemDeath(golem) {
        if (golem.health <= 0 && !golem.isDying) {
            golem.isDying = true;
            golem.dyingFrame = 0;
            golem.currentAnimation = 'dying';
            this.game.score += 100;
        }
    }

    /**
     * Updates dying golem animation and handles death completion
     * @param {Object} golem - The dying golem
     */
    updateDyingGolem(golem) {
        golem.frameCount += 0.5;
        if (golem.frameCount >= 1) {
            golem.dyingFrame++;
            golem.frameCount = 0;
            if (golem.dyingFrame >= 15) {
                golem.dyingFrame = 14;
                this.handleEliteGolemDeath(golem);
                golem.health = -1;
            }
        }
    }

    /**
     * Handles elite golem death (drops potion)
     * @param {Object} golem - The elite golem
     */
    handleEliteGolemDeath(golem) {
        if (golem.isElite && !golem.potionDropped) {
            this.game.potionSystem.spawnManaPotion(golem.x + golem.width/2, 638);
            golem.potionDropped = true;
        }
    }

    /**
     * Updates golem behavior based on state
     * @param {Object} golem - The golem to update
     */
    updateGolemBehavior(golem) {
        if (golem.isHurt) {
            this.handleHurtGolem(golem);
        } else {
            this.handleActiveGolem(golem);
        }
    }

    /**
     * Handles hurt golem state
     * @param {Object} golem - The hurt golem
     */
    handleHurtGolem(golem) {
        golem.currentAnimation = 'hurt';
        if (golem.hurtTimer <= 0) {
            golem.isHurt = false;
            golem.currentAnimation = 'idle';
        }
    }

    /**
     * Handles active golem behavior (movement, attacks)
     * @param {Object} golem - The active golem
     */
    handleActiveGolem(golem) {
        const distanceToPlayer = Math.abs(this.game.wraithSystem.player.x - golem.x);
        golem.facingRight = this.game.wraithSystem.player.x > golem.x;
        const isInRange = distanceToPlayer < 60;
        
        this.handleGolemAttack(golem, isInRange);
        this.handleGolemMovement(golem, distanceToPlayer, isInRange);
        this.finishGolemAttack(golem);
    }

    /**
     * Handles golem attack logic
     * @param {Object} golem - The golem
     * @param {boolean} isInRange - Whether golem is in attack range
     */
    handleGolemAttack(golem, isInRange) {
        if (isInRange && golem.attackCooldown <= 0 && !golem.isAttacking) {
            golem.isAttacking = true;
            golem.attackTimer = 20;
            golem.attackCooldown = 72;
            golem.hasDealtDamage = false;
        }
    }

    /**
     * Handles golem movement and animation
     * @param {Object} golem - The golem
     * @param {number} distanceToPlayer - Distance to player
     * @param {boolean} isInRange - Whether in attack range
     */
    handleGolemMovement(golem, distanceToPlayer, isInRange) {
        if (golem.isAttacking) golem.currentAnimation = 'attacking';
        else if (isInRange) golem.currentAnimation = 'idle';
        else if (distanceToPlayer > 60) {
            golem.x += (this.game.wraithSystem.player.x > golem.x ? 1 : -1) * 1.5;
            golem.currentAnimation = 'walking';
        } else golem.currentAnimation = 'idle';
    }

    /**
     * Finishes golem attack when timer expires
     * @param {Object} golem - The attacking golem
     */
    finishGolemAttack(golem) {
        if (golem.isAttacking && golem.attackTimer <= 0) {
            golem.isAttacking = false;
            golem.currentAnimation = 'idle';
            golem.currentFrame = 0;
            golem.frameCount = 0;
        }
    }

    /**
     * Updates golem physics (gravity, ground collision)
     * @param {Object} golem - The golem to update
     */
    updateGolemPhysics(golem) {
        golem.velocityY += 0.3;
        golem.y += golem.velocityY;
        if (golem.y + golem.height >= 670) {
            golem.y = 670 - golem.height;
            golem.velocityY = 0;
        }
    }

    /**
     * Updates golem animation frames
     * @param {Object} golem - The golem to animate
     */
    updateGolemAnimation(golem) {
        const speed = golem.currentAnimation === 'walking' ? 0.6 : golem.isAttacking ? 0.9 : 0.8;
        golem.frameCount += speed;
        if (golem.frameCount >= 1) {
            if (golem.currentAnimation !== 'dying') golem.currentFrame = (golem.currentFrame + 1) % 12;
            golem.frameCount = 0;
        }
    }

    /**
     * Increases HP of all golems by 25% (up to 100% maximum)
     * Maintains current HP ratio when updating max HP
     */
    increaseGolemHP() {
        this.golemHPMultiplier = Math.min(this.golemHPMultiplier + 0.25, 2.0);
        this.golems.forEach(golem => {
            if (golem.health > 0) {
                const originalMaxHP = golem.isElite ? 150 : 90;
                const newMaxHP = Math.floor(originalMaxHP * this.golemHPMultiplier);
                const hpRatio = golem.health / golem.maxHealth;
                golem.health = Math.floor(newMaxHP * hpRatio);
                golem.maxHealth = newMaxHP;
            }
        });
    }

    /**
     * Draws a single golem on the canvas
     * @param {Object} golem - The golem object to draw
     */
    drawGolem(golem) {
        const screenPos = this.game.cameraSystem.worldToScreen(golem.x, golem.y);
        if (this.isGolemOffScreen(golem, screenPos)) return;

        const imageSrc = this.getGolemImageSrc(golem);
        const image = this.game.loadedImages.get(imageSrc);
        
        if (image) {
            this.drawGolemImage(golem, screenPos, image);
        } else {
            this.drawGolemFallback(golem, screenPos);
        }
    }

    /**
     * Checks if golem is off screen (culling optimization)
     * @param {Object} golem - The golem to check
     * @param {Object} screenPos - Screen position of golem
     * @returns {boolean} True if golem is off screen
     */
    isGolemOffScreen(golem, screenPos) {
        return screenPos.x < -golem.width || screenPos.x > this.game.width + golem.width;
    }

    /**
     * Gets the image source path for golem based on state
     * @param {Object} golem - The golem to get image for
     * @returns {string} Image source path
     */
    getGolemImageSrc(golem) {
        const golemType = golem.isElite ? 'Golem_02' : 'Golem_01';
        const frame = golem.isDying ? golem.dyingFrame : golem.currentFrame;
        const anim = golem.isDying ? 'Dying' : golem.isHurt ? 'Hurt' : 
                    golem.isAttacking ? 'Attacking' : golem.currentAnimation === 'walking' ? 'Walking' : 'Idle';
        return `models/img/golem/PNG/${golemType}/PNG_Sequences/${anim}/${golemType}_${anim}_${frame.toString().padStart(3, '0')}.png`;
    }

    /**
     * Draws golem image with proper orientation
     * @param {Object} golem - The golem to draw
     * @param {Object} screenPos - Screen position
     * @param {Image} image - The image to draw
     */
    drawGolemImage(golem, screenPos, image) {
        if (!golem.facingRight) {
            this.game.ctx.save();
            this.game.ctx.scale(-1, 1);
            this.game.ctx.drawImage(image, -(screenPos.x + golem.width), screenPos.y, golem.width, golem.height);
            this.game.ctx.restore();
        } else {
            this.game.ctx.drawImage(image, screenPos.x, screenPos.y, golem.width, golem.height);
        }
    }

    /**
     * Draws golem fallback when image is not loaded
     * @param {Object} golem - The golem to draw
     * @param {Object} screenPos - Screen position
     */
    drawGolemFallback(golem, screenPos) {
        const color = golem.isDying ? '#666666' : golem.isHurt ? '#ff6666' : golem.isAttacking ? '#ff0000' : '#8B4513';
        this.game.ctx.fillStyle = color;
        this.game.ctx.fillRect(screenPos.x, screenPos.y, golem.width, golem.height);
        this.drawGolemFallbackDetails(golem, screenPos);
    }

    /**
     * Draws golem fallback details (eyes and mouth)
     * @param {Object} golem - The golem to draw
     * @param {Object} screenPos - Screen position
     */
    drawGolemFallbackDetails(golem, screenPos) {
        this.game.ctx.fillStyle = golem.isDying ? '#333333' : '#ff0000';
        this.game.ctx.fillRect(screenPos.x + 20, screenPos.y + 20, 15, 15);
        this.game.ctx.fillRect(screenPos.x + 60, screenPos.y + 20, 15, 15);
        this.game.ctx.fillRect(screenPos.x + 30, screenPos.y + 60, 40, 10);
    }

    /**
     * Draws all golems in the game
     */
    drawGolems() {
        this.golems.forEach(golem => this.drawGolem(golem));
    }

    /**
     * Draws golem debug hitbox for collision testing
     * @param {Object} golem - The golem object
     * @param {Object} screenPos - Screen position of golem
     */
    drawGolemDebugHitbox(golem, screenPos) {
        const hitboxWidth = golem.width * 0.3;
        const hitboxHeight = golem.height * 0.2;
        const hitboxX = screenPos.x + (golem.width - hitboxWidth) / 2;
        const hitboxY = screenPos.y + (golem.height - hitboxHeight) / 2;
        
        this.game.ctx.strokeStyle = '#ff0000';
        this.game.ctx.lineWidth = 2;
        this.game.ctx.setLineDash([5, 5]);
        this.game.ctx.strokeRect(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
        this.game.ctx.setLineDash([]);
        this.game.ctx.fillStyle = '#ff0000';
        this.game.ctx.font = '12px Arial';
        this.game.ctx.fillText('GOLEM HITBOX', hitboxX, hitboxY - 5);
    }

    /**
     * Resets the golem system to initial state
     * Clears all golems and resets spawn timers
     */
    reset() {
        this.golems = [];
        this.lastGolemSpawn = Date.now();
        this.golemSpawnInterval = 2000;
        this.golemHPMultiplier = 1.0;
    }
}
