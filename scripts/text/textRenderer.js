/**
 * Text Renderer - Handles all text rendering and styling functionality
 * @class
 */
class TextRenderer {
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
        ctx.save();
        this.setupTextStyle(ctx, fontSize, fontFamily, color, fontWeight);
        this.applyTextShadow(ctx);
        ctx.fillText(text, x, y);
        this.resetTextShadow(ctx);
        ctx.restore();
    }

    /**
     * Sets up text styling properties
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {string} fontSize - Font size
     * @param {string} fontFamily - Font family
     * @param {string} color - Text color
     * @param {string} fontWeight - Font weight
     */
    static setupTextStyle(ctx, fontSize, fontFamily, color, fontWeight) {
        ctx.fillStyle = color;
        ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
        ctx.textAlign = 'center';
    }

    /**
     * Applies text shadow effect
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    static applyTextShadow(ctx) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }

    /**
     * Resets text shadow properties
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    static resetTextShadow(ctx) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
}
