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
        
        this.buttonCoordinates = [];
        
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

        const textMetrics = ctx.measureText(option);
        const textWidth = textMetrics.width;
        const textHeight = 40;
  
        this.buttonCoordinates.push({
            x: centerX - textWidth / 2 - 50, 
            y: y - textHeight - 10, 
            width: textWidth + 100, 
            height: textHeight + 40,
            label: option,
            index: index
        });
        
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

    /**
     * Gets button coordinates for touch detection
     * @public
     * @returns {Array} Array of button coordinate objects
     */
    static getButtonCoordinates() {
        return this.buttonCoordinates || [];
    }

    /**
     * Draws close button for modals
     * @public
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} modalX - Modal X position
     * @param {number} modalY - Modal Y position
     * @param {number} modalWidth - Modal width
     * @param {number} modalHeight - Modal height
     * @param {string} modalType - Type of modal ('controls', 'audio', 'impressum')
     */
    static drawCloseButton(ctx, modalX, modalY, modalWidth, modalHeight, modalType) {
        ctx.save();

        const buttonSize = 30;
        const margin = 20;
        const x = modalX + modalWidth - buttonSize - margin;
        const y = modalY + 20;

        this.closeButtonPosition = {
            x: x,
            y: y,
            width: buttonSize,
            height: buttonSize,
            type: modalType
        };
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + buttonSize/2, y + buttonSize/2, buttonSize/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        const centerX = x + buttonSize/2;
        const centerY = y + buttonSize/2;
        const crossSize = buttonSize * 0.4;
        
        ctx.beginPath();
        ctx.moveTo(centerX - crossSize/2, centerY - crossSize/2);
        ctx.lineTo(centerX + crossSize/2, centerY + crossSize/2);
        ctx.moveTo(centerX + crossSize/2, centerY - crossSize/2);
        ctx.lineTo(centerX - crossSize/2, centerY + crossSize/2);
        ctx.stroke();
        
        ctx.restore();
    }

    /**
     * Gets close button position for touch detection
     * @public
     * @returns {Object|null} Close button position object or null
     */
    static getCloseButtonPosition() {
        return this.closeButtonPosition || null;
    }

    /**
     * Clears close button position (call when no modal is open)
     * @public
     */
    static clearCloseButtonPosition() {
        this.closeButtonPosition = null;
    }
}
