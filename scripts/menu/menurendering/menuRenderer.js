/**
 * Menu Renderer - Handles all menu rendering functionality
 * @class
 */
class MenuRenderer {
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
        ctx.save();
        ctx.globalAlpha = menuAlpha;
        ctx.textAlign = 'center';
        
        options.forEach((option, index) => {
            this.drawSingleMenuOption(ctx, option, index, centerX, centerY, selectedOption, hoveredOption);
        });
        
        ctx.restore();
    }

    /**
     * Draws a single menu option
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {string} option - The menu option text
     * @param {number} index - The option index
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} selectedOption - Index of selected option
     * @param {number} hoveredOption - Index of hovered option
     */
    static drawSingleMenuOption(ctx, option, index, centerX, centerY, selectedOption, hoveredOption) {
        const y = centerY + (index * 60) - 20;
        const isHovered = hoveredOption === index;
        const isSelected = selectedOption === index;
        
        const fontSize = this.getMenuOptionFontSize(isSelected, isHovered);
        const color = this.getMenuOptionColor(isSelected, isHovered);
        
        ctx.font = fontSize;
        ctx.fillStyle = color;
        
        TextRenderer.applyTextShadow(ctx);
        ctx.fillText(option, centerX, y);
        TextRenderer.resetTextShadow(ctx);
    }

    /**
     * Gets font size for menu option based on state
     * @private
     * @param {boolean} isSelected - Whether option is selected
     * @param {boolean} isHovered - Whether option is hovered
     * @returns {string} Font size string
     */
    static getMenuOptionFontSize(isSelected, isHovered) {
        if (isSelected) return 'bold 32px Raleway';
        if (isHovered) return 'bold 30px Raleway';
        return 'bold 28px Raleway';
    }

    /**
     * Gets color for menu option based on state
     * @private
     * @param {boolean} isSelected - Whether option is selected
     * @param {boolean} isHovered - Whether option is hovered
     * @returns {string} Color string
     */
    static getMenuOptionColor(isSelected, isHovered) {
        return (isSelected || isHovered) ? '#00aaff' : '#ffffff';
    }
}
