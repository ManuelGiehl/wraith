/**
 * End Screen System for the game
 * Shows a victory screen when the boss is defeated
 */
class EndScreenSystem {
    constructor(game) {
        this.game = game;
        this.isVisible = false;
        this.fadeAlpha = 0;
        this.textAlpha = 0;
        this.buttonAlpha = 0;
        this.animationPhase = 'fade';
        this.animationTimer = 0;
        this.selectedButton = -1;
        this.buttons = ['Restart Game', 'Back to Main Menu'];
        this.lastTouchTime = 0;
        this.touchDebounceDelay = 300;
        this.setupTouchEvents();
    }

    /**
     * Sets up touch events for mobile devices
     * @private
     */
    setupTouchEvents() {
        this.game.canvas.addEventListener('touchstart', (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            this.handleTouchStart(e);
        }, { passive: false });
    }

    /**
     * Shows the end screen
     */
    show() {
        this.isVisible = true;
        this.selectedButton = -1;
    }

    /**
     * Hides the end screen
     */
    hide() {
        this.isVisible = false;
        this.selectedButton = -1;
       
        if (this.game.bossRoomSystem) {
            this.game.bossRoomSystem.switchToNormalBackground();
        }
    }

    /**
     * Handles key press in end screen
     */
    handleKeyDown(e) {
        if (!this.isVisible) return;

        switch (e.code) {
            case 'ArrowUp':
            case 'ArrowDown':
                this.selectedButton = (this.selectedButton + 1) % this.buttons.length;
                break;
            case 'Enter':
            case 'Space':
                this.handleButtonSelect();
                break;
            case 'Escape':
                this.handleButtonSelect(1);
                break;
        }
    }

    /**
     * Handles mouse move in end screen
     */
    handleMouseMove(e) {
        if (!this.isVisible) return;

        const rect = this.game.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const centerX = this.game.width / 2;
        const centerY = this.game.height / 2;

        this.selectedButton = -1;

        let isHovering = false;
        this.buttons.forEach((button, index) => {
            const y = centerY + 100 + (index * 60);
            const textWidth = this.game.ctx.measureText(button).width;
            const padding = 20;
            
            const buttonX = centerX - textWidth/2 - padding;
            const buttonY = y - 25;
            const buttonWidth = textWidth + padding * 2;
            const buttonHeight = 50;
            
            if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
                this.selectedButton = index;
                isHovering = true;
            }
        });
        
        if (isHovering) {
            this.game.canvas.classList.remove('cursor-default');
            this.game.canvas.classList.add('cursor-pointer');
        }
    }

    /**
     * Handles mouse click in end screen
     */
    handleMouseClick(e) {
        if (!this.isVisible) return;

        const rect = this.game.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const centerX = this.game.width / 2;
        const centerY = this.game.height / 2;

        this.buttons.forEach((button, index) => {
            const y = centerY + 100 + (index * 60);
            const textWidth = this.game.ctx.measureText(button).width;
            const padding = 20;
            
            const buttonX = centerX - textWidth/2 - padding;
            const buttonY = y - 25;
            const buttonWidth = textWidth + padding * 2;
            const buttonHeight = 50;
            
            if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
                this.selectedButton = index;
                this.handleButtonSelect();
            }
        });
    }

    /**
     * Handles touch events for end screen buttons
     * @public
     * @param {TouchEvent} e - Touch event
     */
    handleTouchStart(e) {
        if (!this.isVisible) return;

        const currentTime = Date.now();
        if (currentTime - this.lastTouchTime < this.touchDebounceDelay) {
            return;
        }
        this.lastTouchTime = currentTime;

        let touchX, touchY;

        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        
        if (e.touches && e.touches[0]) {
            const touch = e.touches[0];
            touchX = touch.clientX - rect.left;
            touchY = touch.clientY - rect.top;
        } else if (e.clientX !== undefined && e.clientY !== undefined) {
            touchX = e.clientX - rect.left;
            touchY = e.clientY - rect.top;
        } else {
            console.error('Unbekanntes Touch-Event-Format:', e);
            return;
        }
 
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        touchX *= scaleX;
        touchY *= scaleY;
        
        
        this.handleButtonTouch(touchX, touchY);
    }

    /**
     * Handles button touch detection for end screen
     * @private
     * @param {number} touchX - Touch X coordinate
     * @param {number} touchY - Touch Y coordinate
     */
    handleButtonTouch(touchX, touchY) {
        const centerX = this.game.width / 2;
        const centerY = this.game.height / 2;


        this.buttons.forEach((button, index) => {
            const y = centerY + 100 + (index * 60);
            const textWidth = this.game.ctx.measureText(button).width;
            const padding = 60; 
            
            const buttonX = centerX - textWidth/2 - padding;
            const buttonY = y - 40;
            const buttonWidth = textWidth + padding * 2;
            const buttonHeight = 80;
            
            if (touchX >= buttonX && touchX <= buttonX + buttonWidth &&
                touchY >= buttonY && touchY <= buttonY + buttonHeight) {
                
                this.selectedButton = index;
                this.handleButtonSelect();
                return;
            }
        });
        
    }

    /**
     * Handles button selection
     */
    handleButtonSelect(buttonIndex = null) {
        const selected = buttonIndex !== null ? buttonIndex : this.selectedButton;
        
        switch (selected) {
            case 0:
                if (this.game.audioSystem) {
                    this.game.audioSystem.playSound('click');
                }
                this.hide();
                this.game.startGame();
                break;
            case 1:
                if (this.game.audioSystem) {
                    this.game.audioSystem.playSound('click');
                }
                this.hide();
                this.game.startScreenSystem.resetAndShow();
                break;
        }
    }

    /**
     * Updates the end screen
     */
    update() {
    }

    /**
     * Draws the end screen
     */
    draw() {
        if (!this.isVisible) return;

        const centerX = this.game.width / 2;
        const centerY = this.game.height / 2;

        this.drawBackground();
        this.drawTitle(centerX, centerY);
        this.drawSubtitle(centerX, centerY);
        this.drawButtons(centerX, centerY);
        this.resetTextAlignment();
    }

    /**
     * Draws the background overlay
     */
    drawBackground() {
        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.game.ctx.fillRect(0, 0, this.game.width, this.game.height);
    }

    /**
     * Draws the main title
     */
    drawTitle(centerX, centerY) {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 48px Raleway';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'middle';
        
        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.game.ctx.fillText('CONGRATULATIONS!', centerX + 3, centerY - 50 + 3);
        
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.fillText('CONGRATULATIONS!', centerX, centerY - 50);
    }

    /**
     * Draws the subtitle
     */
    drawSubtitle(centerX, centerY) {
        this.game.ctx.font = 'bold 24px Raleway';
        this.game.ctx.fillStyle = '#cccccc';
        this.game.ctx.fillText('YOU WON!', centerX, centerY + 20);
    }

    /**
     * Draws the buttons
     */
    drawButtons(centerX, centerY) {
        this.game.ctx.textAlign = 'center';
        this.buttons.forEach((button, index) => {
            const y = centerY + 100 + (index * 60);
            this.drawButton(button, centerX, y, index);
        });
    }

    /**
     * Draws a single button
     */
    drawButton(button, centerX, y, index) {
        if (index === this.selectedButton) {
            this.drawSelectedButton(button, centerX, y);
        } else {
            this.drawNormalButton(button, centerX, y);
        }
        this.game.ctx.fillText(button, centerX, y);
    }

    /**
     * Draws selected button styling
     */
    drawSelectedButton(button, centerX, y) {
        this.game.ctx.fillStyle = '#00aaff';
        this.game.ctx.font = 'bold 32px Raleway';
        
        const textWidth = this.game.ctx.measureText(button).width;
        const padding = 20;
        this.game.ctx.fillStyle = 'rgba(0, 170, 255, 0.2)';
        this.game.ctx.fillRect(centerX - textWidth/2 - padding, y - 25, textWidth + padding*2, 50);
        
        this.game.ctx.fillStyle = '#00aaff';
    }

    /**
     * Draws normal button styling
     */
    drawNormalButton(button, centerX, y) {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 28px Raleway';
    }

    /**
     * Resets text alignment
     */
    resetTextAlignment() {
        this.game.ctx.textAlign = 'left';
    }
}
