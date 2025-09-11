/**
 * Layer Renderer - Handles all background layer animation and rendering functionality
 * @class
 */
class LayerRenderer {
    /**
     * Draws animated background layers with effects
     * @public
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {Game} game - The main game instance
     * @param {Array<number>} layerAlphas - Array of layer alpha values
     * @param {Array<Object>} layerPositions - Array of layer position objects
     * @param {Array<number>} layerRotations - Array of layer rotation values
     * @param {string} moonIntroPhase - Current moon introduction phase
     * @param {number} screenShake - Screen shake intensity
     * @param {number} screenShakeIntensity - Screen shake intensity multiplier
     * @param {number} gravestoneWobble - Gravestone wobble effect
     * @param {number} moonFloat - Moon floating animation value
     */
    static drawLayerAnimation(ctx, game, layerAlphas, layerPositions, layerRotations, moonIntroPhase, screenShake, screenShakeIntensity, gravestoneWobble, moonFloat) {
        const bgWidth = game.width;
        const bgHeight = game.height;
        const drawOrder = [0, 1, 8, 2, 3, 4, 5, 6, 7];
        
        for (let i = 0; i < drawOrder.length; i++) {
            const layerIndex = drawOrder[i];
            if (this.shouldSkipLayer(layerIndex, moonIntroPhase, layerAlphas)) continue;
            
            const layerImage = game.loadedImages.get(`models/img/background/PNG/3_game_background/layers/${layerIndex + 1}.png`);
            if (!layerImage) continue;
            
            this.drawSingleLayer(ctx, game, layerIndex, layerAlphas, layerPositions, layerRotations, moonIntroPhase, screenShake, screenShakeIntensity, moonFloat, bgWidth, bgHeight);
        }
    }

    /**
     * Checks if a layer should be skipped
     * @private
     * @param {number} layerIndex - The layer index to check
     * @param {string} moonIntroPhase - Current moon introduction phase
     * @param {Array<number>} layerAlphas - Array of layer alpha values
     * @returns {boolean} True if layer should be skipped
     */
    static shouldSkipLayer(layerIndex, moonIntroPhase, layerAlphas) {
        if (layerIndex === 8 && (moonIntroPhase !== 'flying' && moonIntroPhase !== 'floating')) return true;
        if (layerAlphas[layerIndex] <= 0) return true;
        return false;
    }

    /**
     * Draws a single background layer
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {Game} game - The main game instance
     * @param {number} layerIndex - The layer index to draw
     * @param {Array<number>} layerAlphas - Array of layer alpha values
     * @param {Array<Object>} layerPositions - Array of layer position objects
     * @param {Array<number>} layerRotations - Array of layer rotation values
     * @param {string} moonIntroPhase - Current moon introduction phase
     * @param {number} screenShake - Screen shake intensity
     * @param {number} screenShakeIntensity - Screen shake intensity multiplier
     * @param {number} moonFloat - Moon floating animation value
     * @param {number} bgWidth - Background width
     * @param {number} bgHeight - Background height
     */
    static drawSingleLayer(ctx, game, layerIndex, layerAlphas, layerPositions, layerRotations, moonIntroPhase, screenShake, screenShakeIntensity, moonFloat, bgWidth, bgHeight) {
        ctx.save();
        ctx.globalAlpha = layerAlphas[layerIndex];
        
        this.applyLayerTransformations(ctx, layerIndex, layerRotations, screenShake, screenShakeIntensity, bgWidth, bgHeight);
        
        const drawY = this.calculateLayerY(layerIndex, layerPositions, moonIntroPhase, moonFloat);
        this.applyMoonGlow(ctx, layerIndex, moonIntroPhase);
        
        ctx.drawImage(game.loadedImages.get(`models/img/background/PNG/3_game_background/layers/${layerIndex + 1}.png`), layerPositions[layerIndex].x, drawY, bgWidth, bgHeight);
        
        if (layerIndex === 8) ctx.restore();
        ctx.restore();
    }

    /**
     * Applies layer transformations (rotation and screen shake)
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} layerIndex - The layer index
     * @param {Array<number>} layerRotations - Array of layer rotation values
     * @param {number} screenShake - Screen shake intensity
     * @param {number} screenShakeIntensity - Screen shake intensity multiplier
     * @param {number} bgWidth - Background width
     * @param {number} bgHeight - Background height
     */
    static applyLayerTransformations(ctx, layerIndex, layerRotations, screenShake, screenShakeIntensity, bgWidth, bgHeight) {
        if (layerIndex >= 6 && layerRotations[layerIndex] !== 0 && screenShake > 0) {
            ctx.translate(bgWidth / 2, bgHeight / 2);
            ctx.rotate(layerRotations[layerIndex]);
            ctx.translate(-bgWidth / 2, -bgHeight / 2);
        }
        
        if (screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * screenShakeIntensity;
            const shakeY = (Math.random() - 0.5) * screenShakeIntensity;
            ctx.translate(shakeX, shakeY);
        }
    }

    /**
     * Calculates layer Y position with moon floating effect
     * @private
     * @param {number} layerIndex - The layer index
     * @param {Array<Object>} layerPositions - Array of layer position objects
     * @param {string} moonIntroPhase - Current moon introduction phase
     * @param {number} moonFloat - Moon floating animation value
     * @returns {number} Calculated Y position
     */
    static calculateLayerY(layerIndex, layerPositions, moonIntroPhase, moonFloat) {
        let drawY = layerPositions[layerIndex].y;
        if (layerIndex === 8 && (moonIntroPhase === 'flying' || moonIntroPhase === 'floating')) {
            drawY += Math.sin(moonFloat) * 8;
        }
        return drawY;
    }

    /**
     * Applies moon glow effect for moon layer
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} layerIndex - The layer index
     * @param {string} moonIntroPhase - Current moon introduction phase
     */
    static applyMoonGlow(ctx, layerIndex, moonIntroPhase) {
        if (layerIndex === 8 && (moonIntroPhase === 'flying' || moonIntroPhase === 'floating')) {
            ctx.save();
            ctx.shadowColor = '#4a90e2';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
    }
}
