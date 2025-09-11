/**
 * Boss Rendering System
 * Manages all boss rendering functionality
 */
class BossRendering {
    constructor(bossSystem) {
        this.bossSystem = bossSystem;
        this.game = bossSystem.game;
    }

    /**
     * Draws the boss
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawBoss(ctx) {
        if (!this.bossSystem.boss || !this.bossSystem.bossActive) return;
        this.drawBossSprite(ctx);
        this.bossSystem.attacks.drawFireballs(ctx);
        this.bossSystem.attacks.drawLightnings(ctx);
    }

    /**
     * Draws boss sprite
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawBossSprite(ctx) {
        if (!ctx) return;
        const animation = this.bossSystem.animationSystem.animations[this.bossSystem.boss.currentAnimation];
        if (!animation) return;
        let frameIndex = animation.currentFrame;
        if (this.bossSystem.boss.isDead) {
            frameIndex = this.bossSystem.boss.dyingFrame;
        }
        const imageName = this.bossSystem.animationSystem.getBossImageName(frameIndex);
        const image = this.game.loadedImages.get(imageName);
        if (image) {
            this.drawBossImage(ctx, image);
        }
    }

    /**
     * Draws boss image with proper orientation
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {HTMLImageElement} image - Image to draw
     */
    drawBossImage(ctx, image) {
        if (this.bossSystem.boss.facingRight) {
            ctx.drawImage(image, this.bossSystem.boss.x, this.bossSystem.boss.y, 
                         this.bossSystem.boss.spriteWidth, this.bossSystem.boss.spriteHeight);
        } else {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(image, -this.bossSystem.boss.x - this.bossSystem.boss.spriteWidth, 
                         this.bossSystem.boss.y, this.bossSystem.boss.spriteWidth, 
                         this.bossSystem.boss.spriteHeight);
            ctx.restore();
        }
    }

    /**
     * Draws boss health bar
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawBossHealthBar(ctx) {
        if (!this.bossSystem.boss || this.bossSystem.boss.isDead || !ctx) return;
        const barWidth = 300; 
        const barHeight = 20;
        const x = this.game.width / 2 - barWidth / 2;
        const y = 20;
        
        ctx.fillStyle = '#2a2a2a';
        this.drawRoundedRect(ctx, x, y, barWidth, barHeight, 3);
        ctx.fill();
        
        const healthPercent = this.bossSystem.boss.health / this.bossSystem.boss.maxHealth;
        ctx.fillStyle = '#ff0000';
        this.drawRoundedRect(ctx, x, y, barWidth * healthPercent, barHeight, 3);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Raleway';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`BOSS: ${Math.ceil(this.bossSystem.boss.health)}/${this.bossSystem.boss.maxHealth}`, 
                    this.game.width / 2, y + barHeight / 2);
    }

    /**
     * Draws rounded rectangle
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {number} radius - Corner radius
     */
    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}
