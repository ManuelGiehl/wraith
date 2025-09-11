/**
 * Template Manager - Main class that coordinates all UI template functionality
 * @class
 */
class TemplateManager {
    /**
     * Draws centered text with shadow effects
     * @public
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {string} text - The text to draw
     * @param {number} x - X coordinate for text position
     * @param {number} y - Y coordinate for text position
     * @param {string} fontSize - Font size (default: '16px')
     * @param {string} fontFamily - Font family (default: 'Raleway')
     * @param {string} color - Text color (default: '#ffffff')
     * @param {string} fontWeight - Font weight (default: 'normal')
     */
    static drawCenteredText(ctx, text, x, y, fontSize = '16px', fontFamily = 'Raleway', color = '#ffffff', fontWeight = 'normal') {
        TextRenderer.drawCenteredText(ctx, text, x, y, fontSize, fontFamily, color, fontWeight);
    }

    /**
     * Draws menu options with hover and selection effects
     * @public
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {Array<string>} options - Array of menu option texts
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} selectedOption - Index of selected option
     * @param {number} hoveredOption - Index of hovered option
     * @param {number} menuAlpha - Menu alpha transparency (default: 1)
     */
    static drawMenuOptions(ctx, options, centerX, centerY, selectedOption, hoveredOption, menuAlpha = 1) {
        MenuRenderer.drawMenuOptions(ctx, options, centerX, centerY, selectedOption, hoveredOption, menuAlpha);
    }

    /**
     * Draws controls screen with key mappings
     * @public
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    static drawControls(ctx, width, height) {
        UIRenderer.drawControls(ctx, width, height);
    }

    /**
     * Draws game tooltip with instructions
     * @public
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    static drawGameTooltip(ctx, width, height) {
        UIRenderer.drawGameTooltip(ctx, width, height);
    }

    /**
     * Draws how to play screen with button
     * @public
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {boolean} hoveredStartButton - Whether start button is hovered
     */
    static drawHowToPlay(ctx, width, height, hoveredStartButton = false) {
        UIRenderer.drawHowToPlay(ctx, width, height, hoveredStartButton);
    }

    /**
     * Draws impressum screen
     * @public
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    static drawImpressum(ctx, width, height) {
        UIRenderer.drawImpressum(ctx, width, height);
    }

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
        LayerRenderer.drawLayerAnimation(ctx, game, layerAlphas, layerPositions, layerRotations, moonIntroPhase, screenShake, screenShakeIntensity, gravestoneWobble, moonFloat);
    }
}
