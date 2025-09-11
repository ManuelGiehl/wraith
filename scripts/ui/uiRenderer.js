/**
 * UI Renderer - Handles all UI rendering functionality including controls, tooltips, and screens
 * @class
 */
class UIRenderer {
    /**
     * Draws controls screen with key mappings
     * @public
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    static drawControls(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        this.drawControlsBackground(ctx, centerX, centerY);
        this.drawControlsTitle(ctx, centerX, centerY);
        this.drawControlsList(ctx, centerX, centerY);
        this.drawControlsBackText(ctx, centerX, height);
        ctx.restore();
    }

    /**
     * Draws controls background and frames
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    static drawControlsBackground(ctx, centerX, centerY) {
        ctx.fillStyle = 'rgba(10, 15, 25, 0.9)';
        ctx.fillRect(centerX - 350, centerY - 250, 700, 500);
        
        ctx.strokeStyle = '#2a4a6b';
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - 350, centerY - 250, 700, 500);
        
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - 348, centerY - 248, 696, 496);
    }

    /**
     * Draws controls title with glow effect
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    static drawControlsTitle(ctx, centerX, centerY) {
        ctx.shadowColor = '#4a90e2';
        ctx.shadowBlur = 10;
        TextRenderer.drawCenteredText(ctx, 'CONTROLS', centerX, centerY - 180, '36px', 'Raleway', '#ffffff', 'bold');
        ctx.shadowBlur = 0;
    }

    /**
     * Draws controls list
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    static drawControlsList(ctx, centerX, centerY) {
        const controls = [
            { key: '← →', action: 'Movement' },
            { key: 'SPACEBAR', action: 'Jump' },
            { key: 'A', action: 'Auto-Attack' },
            { key: 'Q', action: 'Use Mana Potion' },
            { key: 'R', action: 'Ultimate Lightning' },
            { key: 'E', action: 'Enter Boss Room' }
        ];
        
        let currentY = centerY - 100;
        controls.forEach((control, index) => {
            this.drawSingleControl(ctx, control, centerX, currentY);
            currentY += 55;
        });
    }

    /**
     * Draws a single control item
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {Object} control - Control object with key and action
     * @param {number} centerX - Center X coordinate
     * @param {number} currentY - Current Y position
     */
    static drawSingleControl(ctx, control, centerX, currentY) {
        const keyWidth = 120;
        const keyHeight = 35;
        const keyX = centerX - 200;
        const keyY = currentY - keyHeight/2;
        
        this.drawControlKeyBox(ctx, keyX, keyY, keyWidth, keyHeight);
        this.drawControlKeyText(ctx, control.key, keyX, keyY, keyWidth, keyHeight);
        this.drawControlActionText(ctx, control.action, keyX, keyY, keyWidth);
    }

    /**
     * Draws control key box background
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} keyX - Key X position
     * @param {number} keyY - Key Y position
     * @param {number} keyWidth - Key width
     * @param {number} keyHeight - Key height
     */
    static drawControlKeyBox(ctx, keyX, keyY, keyWidth, keyHeight) {
        ctx.fillStyle = 'rgba(42, 74, 107, 0.8)';
        ctx.fillRect(keyX, keyY, keyWidth, keyHeight);
        
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2;
        ctx.strokeRect(keyX, keyY, keyWidth, keyHeight);
    }

    /**
     * Draws control key text
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {string} key - The key text
     * @param {number} keyX - Key X position
     * @param {number} keyY - Key Y position
     * @param {number} keyWidth - Key width
     * @param {number} keyHeight - Key height
     */
    static drawControlKeyText(ctx, key, keyX, keyY, keyWidth, keyHeight) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Raleway';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        TextRenderer.applyTextShadow(ctx);
        const keyCenterX = keyX + keyWidth / 2;
        const keyCenterY = keyY + keyHeight / 2;
        ctx.fillText(key, keyCenterX, keyCenterY);
        TextRenderer.resetTextShadow(ctx);
    }

    /**
     * Draws control action text
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {string} action - The action text
     * @param {number} keyX - Key X position
     * @param {number} keyY - Key Y position
     * @param {number} keyWidth - Key width
     */
    static drawControlActionText(ctx, action, keyX, keyY, keyWidth) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Raleway';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        TextRenderer.applyTextShadow(ctx);
        const actionX = keyX + keyWidth + 20;
        const keyCenterY = keyY + 35/2;
        ctx.fillText(action, actionX, keyCenterY);
        TextRenderer.resetTextShadow(ctx);
    }

    /**
     * Draws controls back text
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} height - Canvas height
     */
    static drawControlsBackText(ctx, centerX, height) {
        ctx.shadowColor = '#4a90e2';
        ctx.shadowBlur = 5;
        TextRenderer.drawCenteredText(ctx, 'ESC - Back to Main Menu', centerX, height - 50, '16px', 'Raleway', '#ffffff');
        ctx.shadowBlur = 0;
    }

    /**
     * Draws game tooltip with instructions
     * @public
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    static drawGameTooltip(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.textBaseline = 'middle';
        
        this.drawTooltipBackground(ctx, centerX, centerY);
        this.drawTooltipTitle(ctx, centerX, centerY);
        this.drawTooltipGoal(ctx, centerX, centerY);
        this.drawTooltipTips(ctx, centerX, centerY);
        this.drawTooltipStartInfo(ctx, centerX, centerY, height);
        
        ctx.restore();
    }

    /**
     * Draws tooltip background with blue border
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    static drawTooltipBackground(ctx, centerX, centerY) {
        const contentWidth = 700;
        const contentHeight = 550;
        const x = centerX - contentWidth / 2;
        const y = centerY - contentHeight / 2;
 
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(x, y, contentWidth, contentHeight);
        
        ctx.strokeStyle = '#00aaff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, contentWidth, contentHeight);
    }

    /**
     * Draws tooltip title
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    static drawTooltipTitle(ctx, centerX, centerY) {
        TextRenderer.drawCenteredText(ctx, 'HOW TO PLAY', centerX, centerY - 180, '36px', 'Raleway', '#00aaff', 'bold');
    }

    /**
     * Draws tooltip goal section
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    static drawTooltipGoal(ctx, centerX, centerY) {
        TextRenderer.drawCenteredText(ctx, 'MAIN GOAL:', centerX, centerY - 120, '24px', 'Raleway', '#ffffff', 'bold');
        TextRenderer.drawCenteredText(ctx, 'REACH 5000 POINTS, ENTER THE BOSS PORTAL AND KILL THE BOSS', centerX, centerY - 80, '20px', 'Arial, sans-serif', '#ffffff', 'bold');
    }

    /**
     * Draws tooltip tips section
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    static drawTooltipTips(ctx, centerX, centerY) {
        TextRenderer.drawCenteredText(ctx, 'TIPS:', centerX, centerY - 20, '24px', 'Raleway', '#ffffff', 'bold');
        TextRenderer.drawCenteredText(ctx, '1 GOLEM KILL GIVES 100 POINTS', centerX, centerY + 20, '20px', 'Arial, sans-serif', '#ffffff', 'bold');
        TextRenderer.drawCenteredText(ctx, '1 GOLEM KILL GIVES 5 MANA', centerX, centerY + 50, '20px', 'Arial, sans-serif', '#ffffff', 'bold');
        TextRenderer.drawCenteredText(ctx, 'IF YOU REACH 100 MANA YOU CAN CAST ULTIMATE LIGHTNING (R)', centerX, centerY + 80, '20px', 'Arial, sans-serif', '#ffffff', 'bold');
        TextRenderer.drawCenteredText(ctx, 'ELITE GOLEMS DROP MANA POTIONS', centerX, centerY + 110, '20px', 'Arial, sans-serif', '#ffffff', 'bold');
    }

    /**
     * Draws tooltip start information
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} height - Canvas height
     */
    static drawTooltipStartInfo(ctx, centerX, centerY, height) {
        TextRenderer.drawCenteredText(ctx, 'START GAME', centerX, centerY + 170, '24px', 'Raleway', '#00aaff', 'bold');
        TextRenderer.drawCenteredText(ctx, 'PRESS ENTER OR SPACE TO START', centerX, centerY + 210, '18px', 'Raleway', '#cccccc', 'bold');
        TextRenderer.drawCenteredText(ctx, 'ESC - BACK TO MAIN MENU', centerX, height - 50, '18px', 'Raleway', '#cccccc', 'bold');
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
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        this.drawHowToPlayFrame(ctx, centerX, centerY);
        this.drawHowToPlayTitle(ctx, centerX, centerY);
        this.drawHowToPlayGoal(ctx, centerX, centerY);
        this.drawHowToPlayTips(ctx, centerX, centerY);
        this.drawHowToPlayButton(ctx, centerX, centerY, hoveredStartButton);
        ctx.restore();
    }

    /**
     * Draws how to play frame borders
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    static drawHowToPlayFrame(ctx, centerX, centerY) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(centerX - 400, centerY - 280, 800, 560);
 
        ctx.strokeStyle = '#00aaff';
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - 400, centerY - 280, 800, 560);
        
        // Innerer hellerer Rahmen
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - 398, centerY - 278, 796, 556);
    }

    /**
     * Draws how to play title with glow
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    static drawHowToPlayTitle(ctx, centerX, centerY) {
        ctx.shadowColor = '#4a90e2';
        ctx.shadowBlur = 10;
        TextRenderer.drawCenteredText(ctx, 'HOW TO PLAY', centerX, centerY - 220, '36px', 'Raleway', '#ffffff', 'bold');
        ctx.shadowBlur = 0;
    }

    /**
     * Draws how to play goal section
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    static drawHowToPlayGoal(ctx, centerX, centerY) {
        TextRenderer.drawCenteredText(ctx, 'MAIN GOAL:', centerX, centerY - 160, '24px', 'Raleway', '#4a90e2', 'bold');
        TextRenderer.drawCenteredText(ctx, 'REACH 5000 POINTS, ENTER THE BOSS PORTAL AND KILL THE BOSS', centerX, centerY - 110, '18px', 'Arial, sans-serif', '#ffffff', 'bold');
    }

    /**
     * Draws how to play tips section
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    static drawHowToPlayTips(ctx, centerX, centerY) {
        TextRenderer.drawCenteredText(ctx, 'TIPS:', centerX, centerY - 60, '24px', 'Raleway', '#4a90e2', 'bold');
        
        const tips = [
            '1 GOLEM KILL GIVES 100 POINTS',
            '1 GOLEM KILL GIVES 5 MANA',
            'IF YOU REACH 100 MANA YOU CAN CAST ULTIMATE LIGHTNING (R)',
            'ELITE GOLEMS DROP MANA POTIONS'
        ];
        
        let currentY = centerY - 20;
        tips.forEach((tip, index) => {
            TextRenderer.drawCenteredText(ctx, tip, centerX, currentY, '16px', 'Arial, sans-serif', '#ffffff', 'bold');
            currentY += 40;
        });
    }

    /**
     * Draws how to play start button
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {boolean} hoveredStartButton - Whether button is hovered
     */
    static drawHowToPlayButton(ctx, centerX, centerY, hoveredStartButton) {
        const buttonY = centerY + 200;
        const buttonWidth = 200;
        const buttonHeight = 50;
        
        this.drawButtonBackground(ctx, centerX, buttonY, buttonWidth, buttonHeight, hoveredStartButton);
        this.drawButtonFrame(ctx, centerX, buttonY, buttonWidth, buttonHeight, hoveredStartButton);
        this.drawButtonText(ctx, centerX, buttonY);
    }

    /**
     * Draws button background with hover effect
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} buttonY - Button Y position
     * @param {number} buttonWidth - Button width
     * @param {number} buttonHeight - Button height
     * @param {boolean} hoveredStartButton - Whether button is hovered
     */
    static drawButtonBackground(ctx, centerX, buttonY, buttonWidth, buttonHeight, hoveredStartButton) {
        if (hoveredStartButton) {
            ctx.fillStyle = 'rgba(74, 144, 226, 0.6)';
            ctx.shadowColor = '#4a90e2';
            ctx.shadowBlur = 15;
        } else {
            ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
            ctx.shadowBlur = 0;
        }
        ctx.fillRect(centerX - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight);
    }

    /**
     * Draws button frame
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} buttonY - Button Y position
     * @param {number} buttonWidth - Button width
     * @param {number} buttonHeight - Button height
     * @param {boolean} hoveredStartButton - Whether button is hovered
     */
    static drawButtonFrame(ctx, centerX, buttonY, buttonWidth, buttonHeight, hoveredStartButton) {
        ctx.strokeStyle = hoveredStartButton ? '#ffffff' : '#4a90e2';
        ctx.lineWidth = hoveredStartButton ? 3 : 2;
        ctx.strokeRect(centerX - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight);
    }

    /**
     * Draws button text
     * @private
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} centerX - Center X coordinate
     * @param {number} buttonY - Button Y position
     */
    static drawButtonText(ctx, centerX, buttonY) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Raleway';
        ctx.fillText('START GAME', centerX, buttonY);
    }

    /**
     * Draws impressum screen
     * @public
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    static drawImpressum(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        TextRenderer.drawCenteredText(ctx, 'IMPRINT', centerX, centerY - 150, '36px', 'Raleway', '#ffffff', 'bold');
        TextRenderer.drawCenteredText(ctx, 'Wraith - A 2D Action Game', centerX, centerY - 100, '20px', 'Raleway', '#ffffff', 'bold');
        TextRenderer.drawCenteredText(ctx, 'Developed with JavaScript & HTML5 Canvas', centerX, centerY - 70, '16px');
        TextRenderer.drawCenteredText(ctx, 'Graphics: Free Assets', centerX, centerY - 50, '16px');
        TextRenderer.drawCenteredText(ctx, 'Music: Free Sounds', centerX, centerY - 30, '16px');
        TextRenderer.drawCenteredText(ctx, '© 2025 - Developed for the Developerakademie', centerX, centerY - 10, '16px');
        TextRenderer.drawCenteredText(ctx, 'Version 1.0', centerX, centerY + 20, '18px', 'Raleway', '#ffffff', 'bold');
        TextRenderer.drawCenteredText(ctx, 'Build: 2025.01', centerX, centerY + 45, '18px', 'Raleway', '#ffffff', 'bold');
        TextRenderer.drawCenteredText(ctx, 'ESC - Back to Main Menu', centerX, height - 50, '16px', 'Raleway', '#cccccc');
    }
}
