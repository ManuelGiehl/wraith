/**
 * Boss attack system for the game
 * Manages all boss attack functions
 */
class BossAttacks {
    constructor(bossSystem) {
        this.bossSystem = bossSystem;
        this.game = bossSystem.game;
    }

    /**
     * Starts melee attack
     */
    startMeleeAttack() {
        this.bossSystem.boss.isAttacking = true;
        this.bossSystem.boss.currentAnimation = 'meleeAttack';
        this.bossSystem.boss.attackCooldown = 180;
        this.bossSystem.boss.meleeAttackTimer = 0;
    }

    /**
     * Executes melee attack damage
     */
    executeMeleeAttack() {
        if (!this.bossSystem.boss || this.bossSystem.boss.isDead) return;

        const distanceToPlayer = Math.abs(this.game.wraithSystem.player.x - this.bossSystem.boss.x);
        const playerInMeleeRange = distanceToPlayer <= this.bossSystem.boss.meleeRange;

        if (playerInMeleeRange) {
            this.damagePlayer();
        }
    }

    /**
     * Damages the player
     */
    damagePlayer() {
        this.game.wraithSystem.player.health -= this.bossSystem.boss.attackDamage;
        
        if (this.game.wraithSystem.player.health > 0) {
            this.game.wraithSystem.player.isHurt = true;
            this.game.wraithSystem.player.hurtTimer = 30;
            this.game.soundEffectsSystem.playSoundWithVolume('wraith_hurt', 0.1);
        }
    }

    /**
     * Plays hurt sound
     */
    playHurtSound() {
        this.game.soundEffectsSystem.playSoundWithVolume('wraith_hurt', 0.3125);
    }

    /**
     * Starts magic attack
     */
    startMagicAttack() {
        this.bossSystem.boss.isMagicAttacking = true;
        this.bossSystem.boss.currentAnimation = 'magicFire';
        this.bossSystem.boss.magicAttackCooldown = 240;
        this.bossSystem.boss.magicAttackTimer = 0;
        this.bossSystem.boss.magicFireSoundPlayed = false;
    }

    /**
     * Shoots fireball attack
     */
    shootFireball() {
        const visualWidth = 225;
        const baseY = this.bossSystem.boss.y + 125; 
        const verticalSpacing = 40;  
        
        this.createFireballs(visualWidth, baseY, verticalSpacing);
    }

    /**
     * Creates fireball projectiles
     */
    createFireballs(visualWidth, baseY, verticalSpacing) {
        const fireballPositions = [
            { x: this.bossSystem.boss.x + 70, y: baseY + verticalSpacing },
            { x: this.bossSystem.boss.x + 70, y: baseY },
            { x: this.bossSystem.boss.x + 70, y: baseY - verticalSpacing }
        ];

        fireballPositions.forEach(pos => {
            this.bossSystem.fireballs.push(this.createFireball(pos.x, pos.y));
        });
    }

    /**
     * Creates single fireball
     */
    createFireball(x, y) {
        return {
            x: x,
            y: y,
            width: 30, 
            height: 30, 
            speed: 3,
            direction: 1,
            frame: 0,
            frameTime: 3,
            frameCount: 0
        };
    }

    /**
     * Shoots lightning attack
     */
    shootLightning() {
        const lightning = {
            x: this.game.wraithSystem.player.x - 60,
            y: -150,
            width: 20,        
            height: 200,      
            spriteWidth: 120, 
            spriteHeight: 200, 
            speed: 4,         
            frame: 0,
            frameTime: 2,
            frameCount: 0
        };
        
        this.bossSystem.lightnings.push(lightning);
    }

    /**
     * Updates fireballs
     */
    updateFireballs() {
        this.bossSystem.fireballs = this.bossSystem.fireballs.filter(fireball => {
            this.moveFireball(fireball);
            this.animateFireball(fireball);
            return this.isFireballInBounds(fireball);
        });
    }

    /**
     * Moves fireball
     */
    moveFireball(fireball) {
        fireball.x += fireball.speed * fireball.direction;
    }

    /**
     * Animates fireball
     */
    animateFireball(fireball) {
        fireball.frameCount++;
        if (fireball.frameCount >= fireball.frameTime) {
            fireball.frame = (fireball.frame + 1) % 10;
            fireball.frameCount = 0;
        }
    }

    /**
     * Checks if fireball is in bounds
     */
    isFireballInBounds(fireball) {
        return fireball.x > -100 && fireball.x < this.game.width + 100;
    }

    /**
     * Updates lightnings
     */
    updateLightnings() {
        this.bossSystem.lightnings = this.bossSystem.lightnings.filter(lightning => {
            this.moveLightning(lightning);
            this.animateLightning(lightning);
            return this.isLightningInBounds(lightning);
        });
    }

    /**
     * Moves lightning
     */
    moveLightning(lightning) {
        lightning.y += lightning.speed;
    }

    /**
     * Animates lightning
     */
    animateLightning(lightning) {
        lightning.frameCount++;
        if (lightning.frameCount >= lightning.frameTime) {
            lightning.frame = (lightning.frame + 1) % 9;
            lightning.frameCount = 0;
        }
    }

    /**
     * Checks if lightning is in bounds
     */
    isLightningInBounds(lightning) {
        const wraithY = this.game.wraithSystem.player.y;
        return lightning.y < wraithY;
    }

    /**
     * Draws fireballs
     */
    drawFireballs(ctx) {
        this.bossSystem.fireballs.forEach(fireball => {
            this.drawFireball(ctx, fireball);
        });
    }

    /**
     * Draws single fireball
     */
    drawFireball(ctx, fireball) {
        const image = this.game.loadedImages.get('models/img/boss/Magic_Attacks/Magic_Attacks/fire' + (fireball.frame + 1) + '.png');
        if (image) {
            ctx.drawImage(image, fireball.x, fireball.y, fireball.width, fireball.height);
        }
    }

    /**
     * Draws lightnings
     */
    drawLightnings(ctx) {
        this.bossSystem.lightnings.forEach(lightning => {
            this.drawLightning(ctx, lightning);
        });
    }

    /**
     * Draws single lightning
     */
    drawLightning(ctx, lightning) {
        const image = this.game.loadedImages.get('models/img/boss/Magic_Attacks/Magic_Attacks/lightning' + (lightning.frame + 1) + '.png');
        if (image) {
            ctx.drawImage(image, lightning.x, lightning.y, lightning.spriteWidth, lightning.spriteHeight);
        }
    }

    /**
     * Draws fireball debug info (hitbox)
     */
    drawFireballDebugInfo(ctx, fireball) {
        if (!ctx) return;

        ctx.strokeStyle = '#ff8800';
        ctx.lineWidth = 2;
        ctx.strokeRect(fireball.x, fireball.y, fireball.width, fireball.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('FIREBALL', fireball.x, fireball.y - 5);
    }

    /**
     * Draws lightning debug info (hitbox)
     */
    drawLightningDebugInfo(ctx, lightning) {
        if (!ctx) return;
 
        const hitboxX = lightning.x + (lightning.spriteWidth - lightning.width) / 2;
        ctx.strokeStyle = '#8800ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(hitboxX, lightning.y, lightning.width, lightning.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('LIGHTNING', hitboxX, lightning.y - 5);
    }
}
