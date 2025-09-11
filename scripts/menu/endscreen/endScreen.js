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
        this.selectedButton = 0;
        this.buttons = ['Restart Game', 'Back to Main Menu'];
    }

    /**
     * Shows the end screen
     */
    show() {
        this.isVisible = true;
        this.selectedButton = 0;
    }

    /**
     * Hides the end screen
     */
    hide() {
        this.isVisible = false;
        this.selectedButton = 0;
        // Reset background to normal when leaving boss room
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

        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.game.ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 48px Raleway';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'middle';
        
        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.game.ctx.fillText('CONGRATULATIONS!', centerX + 3, centerY - 50 + 3);
        
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.fillText('CONGRATULATIONS!', centerX, centerY - 50);
        
        this.game.ctx.font = 'bold 24px Raleway';
        this.game.ctx.fillStyle = '#cccccc';
        this.game.ctx.fillText('YOU WON!', centerX, centerY + 20);
        this.game.ctx.textAlign = 'center';
        this.buttons.forEach((button, index) => {
            const y = centerY + 100 + (index * 60);
            
            if (index === this.selectedButton) {
                this.game.ctx.fillStyle = '#00aaff';
                this.game.ctx.font = 'bold 32px Raleway';
                
                const textWidth = this.game.ctx.measureText(button).width;
                const padding = 20;
                this.game.ctx.fillStyle = 'rgba(0, 170, 255, 0.2)';
                this.game.ctx.fillRect(centerX - textWidth/2 - padding, y - 25, textWidth + padding*2, 50);
                
                this.game.ctx.fillStyle = '#00aaff';
            } else {
                this.game.ctx.fillStyle = '#ffffff';
                this.game.ctx.font = 'bold 28px Raleway';
            }
            
            this.game.ctx.fillText(button, centerX, y);
        });

        this.game.ctx.textAlign = 'left';
    }
}
