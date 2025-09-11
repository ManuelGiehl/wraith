/**
 * Rain System - Creates a mystical rain effect in the background
 * @class
 */
class RainSystem {
    /**
     * Creates an instance of RainSystem
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
        this.rainDrops = [];
        this.maxRainDrops = 220;
        this.rainIntensity = 0.9;
        this.windStrength = 2.0;
        this.rainAngle = 25;
        this.windVariation = 0.3;
        this.groundLevel = 450;
        
        this.dropSpeed = 4 + Math.random() * 5;
        this.dropLength = 6 + Math.random() * 10;
        this.dropWidth = 0.3 + Math.random() * 0.8;
        
        this.rainColors = [
            'rgba(100, 200, 255, 0.4)',
            'rgba(80, 180, 240, 0.5)',
            'rgba(120, 220, 255, 0.3)',
            'rgba(60, 160, 220, 0.6)',
            'rgba(140, 200, 255, 0.4)'
        ];
        
        this.initializeRain();
    }

    /**
     * Initializes the rain drops
     * @public
     */
    initializeRain() {
        this.rainDrops = [];
        
        for (let i = 0; i < this.maxRainDrops; i++) {
            this.createRainDrop();
        }
    }

    /**
     * Creates a new rain drop
     * @public
     */
    createRainDrop() {
        const angleData = this.calculateRainAngle();
        const rainDrop = this.createRainDropProperties(angleData);
        this.rainDrops.push(rainDrop);
    }

    /**
     * Calculates rain angle and wind effect
     * @private
     * @returns {Object} Object containing angle data
     */
    calculateRainAngle() {
        const baseAngle = this.rainAngle + (Math.random() - 0.5) * 15;
        const angleRad = (baseAngle * Math.PI) / 180;
        const windEffect = (Math.random() - 0.5) * this.windStrength * this.windVariation;
        
        return { baseAngle, angleRad, windEffect };
    }

    /**
     * Creates rain drop properties
     * @private
     * @param {Object} angleData - Angle calculation data
     * @returns {Object} Rain drop object with properties
     */
    createRainDropProperties(angleData) {
        const { angleRad, windEffect } = angleData;
        
        return {
            x: Math.random() * this.game.width * 2,
            y: -Math.random() * 400 - 150,
            speed: this.dropSpeed + Math.random() * 3,
            length: this.dropLength + Math.random() * 4,
            width: this.dropWidth + Math.random() * 0.3,
            color: this.rainColors[Math.floor(Math.random() * this.rainColors.length)],
            windOffset: windEffect,
            alpha: 0.3 + Math.random() * 0.4,
            velocityX: Math.sin(angleRad) * this.windStrength + windEffect,
            velocityY: Math.cos(angleRad) * (this.dropSpeed + Math.random() * 3)
        };
    }

    /**
     * Updates the rain system
     * @public
     */
    update() {
        if (this.game.bossRoomSystem.inBossRoom) {
            return;
        }
        
        this.updateRainDrops();
    }

    /**
     * Updates all rain drops
     * @private
     */
    updateRainDrops() {
        for (let i = this.rainDrops.length - 1; i >= 0; i--) {
            const drop = this.rainDrops[i];
            
            this.updateSingleDrop(drop, i);
            this.checkDropBounds(drop, i);
        }
    }

    /**
     * Updates a single rain drop
     * @private
     * @param {Object} drop - The rain drop object
     * @param {number} index - The drop index
     */
    updateSingleDrop(drop, index) {
        const windVariation = Math.sin(Date.now() * 0.002 + index * 0.1) * 0.3;
        
        drop.x += drop.velocityX + windVariation;
        drop.y += drop.velocityY;
    }

    /**
     * Checks and handles drops outside boundaries
     * @private
     * @param {Object} drop - The rain drop object
     * @param {number} index - The drop index
     */
    checkDropBounds(drop, index) {
        if (drop.y > this.groundLevel + 50) {
            this.replaceDrop(index);
        } else if (drop.x < -100 || drop.x > this.game.width * 2 + 100) {
            this.replaceDrop(index);
        }
    }

    /**
     * Replaces a drop with a new one
     * @private
     * @param {number} index - The drop index to replace
     */
    replaceDrop(index) {
        this.rainDrops.splice(index, 1);
        this.createRainDrop();
    }

    /**
     * Draws the rain system
     * @public
     */
    draw() {
        if (this.game.bossRoomSystem.inBossRoom) {
            return;
        }
        
        if (this.rainDrops.length === 0) {
            return;
        }

        this.setupCanvasForRain();
        this.drawAllRainDrops();
        this.drawAtmosphericParticles();
        this.restoreCanvas();
    }

    /**
     * Sets up canvas for rain drawing
     * @private
     */
    setupCanvasForRain() {
        const ctx = this.game.ctx;
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
    }

    /**
     * Draws all rain drops
     * @private
     */
    drawAllRainDrops() {
        for (const drop of this.rainDrops) {
            if (this.isDropInView(drop)) {
                this.drawSingleRainDrop(drop);
            }
        }
    }

    /**
     * Checks if drop is in visible area
     * @private
     * @param {Object} drop - The rain drop object
     * @returns {boolean} True if drop is in view
     */
    isDropInView(drop) {
        return drop.x > -50 && drop.x < this.game.width + 50 && 
               drop.y > -50 && drop.y < this.groundLevel;
    }

    /**
     * Draws a single rain drop
     * @private
     * @param {Object} drop - The rain drop object
     */
    drawSingleRainDrop(drop) {
        const color = drop.color.replace(/[\d.]+\)$/g, `${drop.alpha})`);
        
        if (drop.length < 8) {
            this.drawShortDrop(drop, color);
        } else {
            this.drawLongDrop(drop, color);
        }
    }

    /**
     * Draws short drops as points
     * @private
     * @param {Object} drop - The rain drop object
     * @param {string} color - The color string
     */
    drawShortDrop(drop, color) {
        const ctx = this.game.ctx;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.width * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draws long drops as lines
     * @private
     * @param {Object} drop - The rain drop object
     * @param {string} color - The color string
     */
    drawLongDrop(drop, color) {
        const ctx = this.game.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = drop.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();
    }

    /**
     * Restores canvas state
     * @private
     */
    restoreCanvas() {
        this.game.ctx.restore();
    }

    /**
     * Draws additional atmospheric particles for background effects
     * @private
     */
    drawAtmosphericParticles() {
        const ctx = this.game.ctx;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 15; i++) {
            const particle = this.calculateParticlePosition(time, i);
            this.drawSingleParticle(ctx, particle);
        }
    }

    /**
     * Calculates particle position and properties
     * @private
     * @param {number} time - Current time in seconds
     * @param {number} index - Particle index
     * @returns {Object} Particle object with position and properties
     */
    calculateParticlePosition(time, index) {
        const x = (Math.sin(time * 0.5 + index * 0.3) * 100) + this.game.width / 2;
        const y = (Math.cos(time * 0.3 + index * 0.2) * 50) + 200 + index * 20;
        const size = 1 + Math.sin(time + index) * 0.5;
        const alpha = 0.08 + Math.sin(time * 2 + index) * 0.04;
        
        return { x, y, size, alpha };
    }

    /**
     * Draws a single atmospheric particle
     * @private
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} particle - Particle object with properties
     */
    drawSingleParticle(ctx, particle) {
        if (particle.y < this.groundLevel) {
            ctx.fillStyle = `rgba(100, 200, 255, ${particle.alpha})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * Sets the rain intensity
     * @public
     * @param {number} intensity - Rain intensity (0-1)
     */
    setIntensity(intensity) {
        this.rainIntensity = Math.max(0, Math.min(1, intensity));
        this.maxRainDrops = Math.floor(150 * this.rainIntensity);
        
        this.adjustRainDropCount();
    }

    /**
     * Adjusts rain drop count based on intensity
     * @private
     */
    adjustRainDropCount() {
        if (this.rainDrops.length > this.maxRainDrops) {
            this.rainDrops = this.rainDrops.slice(0, this.maxRainDrops);
        } else if (this.rainDrops.length < this.maxRainDrops) {
            while (this.rainDrops.length < this.maxRainDrops) {
                this.createRainDrop();
            }
        }
    }

    /**
     * Sets the wind strength
     * @public
     * @param {number} strength - Wind strength (0-2)
     */
    setWindStrength(strength) {
        this.windStrength = Math.max(0, Math.min(2, strength));
    }

    /**
     * Enables or disables the rain
     * @public
     * @param {boolean} enabled - Whether rain should be enabled
     */
    setEnabled(enabled) {
        if (enabled && this.rainDrops.length === 0) {
            this.initializeRain();
        } else if (!enabled) {
            this.rainDrops = [];
        }
    }

    /**
     * Resets the rain system
     * @public
     */
    reset() {
        this.initializeRain();
    }
}