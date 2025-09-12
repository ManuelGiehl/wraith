/**
 * Game Over Screen System for the game
 * Shows a game over screen when the player dies
 */
class GameOverScreenSystem {
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
     * Shows the game over screen
     */
    show() {
        this.isVisible = true;
        this.selectedButton = 0;
    }

    /**
     * Hides the game over screen
     */
    hide() {
        this.isVisible = false;
        this.selectedButton = 0;
    }

    /**
     * Handles key press in game over screen
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
     * Handles mouse click in game over screen
     */
    handleMouseClick(e) {
        if (!this.isVisible) return;

        const mousePos = this.getMousePosition(e);
        this.checkButtonClick(mousePos);
    }

    /**
     * Gets mouse position relative to canvas
     */
    getMousePosition(e) {
        const rect = this.game.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    /**
     * Checks if mouse clicked on any button
     */
    checkButtonClick(mousePos) {
        const centerX = this.game.width / 2;
        const centerY = this.game.height / 2;

        this.buttons.forEach((button, index) => {
            const buttonRect = this.getButtonRect(button, centerX, centerY, index);
            
            if (this.isPointInRect(mousePos, buttonRect)) {
                this.selectedButton = index;
                this.handleButtonSelect();
            }
        });
    }

    /**
     * Handles touch events for game over screen buttons
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
     * Handles button touch detection for game over screen
     * @private
     * @param {number} touchX - Touch X coordinate
     * @param {number} touchY - Touch Y coordinate
     */
    handleButtonTouch(touchX, touchY) {
        const centerX = this.game.width / 2;
        const centerY = this.game.height / 2;


        this.buttons.forEach((button, index) => {
            const buttonRect = this.getButtonRect(button, centerX, centerY, index);
            
            
            if (touchX >= buttonRect.x && touchX <= buttonRect.x + buttonRect.width &&
                touchY >= buttonRect.y && touchY <= buttonRect.y + buttonRect.height) {
                
                this.selectedButton = index;
                this.handleButtonSelect();
                return;
            }
        });
        
    }

    /**
     * Gets button rectangle for collision detection
     */
    getButtonRect(button, centerX, centerY, index) {
        const y = centerY + 100 + (index * 60);
        const textWidth = this.game.ctx.measureText(button).width;
        const padding = 60;
        
        return {
            x: centerX - textWidth/2 - padding,
            y: y - 40,
            width: textWidth + padding * 2,
            height: 80
        };
    }

    /**
     * Checks if point is inside rectangle
     */
    isPointInRect(point, rect) {
        return point.x >= rect.x && point.x <= rect.x + rect.width &&
               point.y >= rect.y && point.y <= rect.y + rect.height;
    }

    /**
     * Handles button selection
     */
    handleButtonSelect(buttonIndex = null) {
        const selected = buttonIndex !== null ? buttonIndex : this.selectedButton;
        
        switch (selected) {
            case 0:
                this.handleRestartGame();
                break;
            case 1:
                this.handleBackToMenu();
                break;
        }
    }

    /**
     * Handles restart game button
     */
    handleRestartGame() {
        this.playClickSound();
        this.stopGameOverSound();
        this.hide();
        this.game.gameOver = false;
        this.resumeBackgroundMusic();
        this.game.startGame();
    }

    /**
     * Handles back to menu button
     */
    handleBackToMenu() {
        this.playClickSound();
        this.stopGameOverSound();
        this.hide();
        this.game.gameOver = false;
        this.resumeBackgroundMusic();
        this.game.startScreenSystem.resetAndShow();
    }

    /**
     * Plays click sound
     */
    playClickSound() {
        if (this.game.audioSystem) {
            this.game.audioSystem.playSound('click');
        }
    }

    /**
     * Stops game over sound
     */
    stopGameOverSound() {
        const gameOverSound = this.game.soundEffectsSystem.soundEffects.get('gameover');
        if (gameOverSound) {
            gameOverSound.pause();
            gameOverSound.currentTime = 0;
        }
    }

    /**
     * Resumes background music
     */
    resumeBackgroundMusic() {
        if (this.game.backgroundMusicSystem) {
            this.game.backgroundMusicSystem.play();
        }
    }

    /**
     * Updates the game over screen
     */
    update() {
    }

    /**
     * Draws the game over screen
     */
    draw() {
        if (!this.isVisible) return;

        const centerX = this.game.width / 2;
        const centerY = this.game.height / 2;

        this.drawBackground();
        this.drawGameOverText(centerX, centerY);
        this.drawScore(centerX, centerY);
        this.drawButtons(centerX, centerY);
        this.resetTextAlignment();
    }

    /**
     * Draws background overlay
     */
    drawBackground() {
        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.game.ctx.fillRect(0, 0, this.game.width, this.game.height);
    }

    /**
     * Draws game over text
     */
    drawGameOverText(centerX, centerY) {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 48px Raleway';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'middle';
        
        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.game.ctx.fillText('GAME OVER!', centerX + 3, centerY - 50 + 3);
        
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.fillText('GAME OVER!', centerX, centerY - 50);
    }

    /**
     * Draws score text
     */
    drawScore(centerX, centerY) {
        this.game.ctx.font = 'bold 24px Raleway';
        this.game.ctx.fillStyle = '#cccccc';
        this.game.ctx.fillText(`Score: ${this.game.score}`, centerX, centerY + 20);
    }

    /**
     * Draws all buttons
     */
    drawButtons(centerX, centerY) {
        this.game.ctx.textAlign = 'center';
        this.buttons.forEach((button, index) => {
            this.drawButton(button, index, centerX, centerY);
        });
    }

    /**
     * Draws a single button
     */
    drawButton(button, index, centerX, centerY) {
        const y = centerY + 100 + (index * 60);
        
        if (index === this.selectedButton) {
            this.drawSelectedButton(button, centerX, y);
        } else {
            this.drawNormalButton(button, centerX, y);
        }
    }

    /**
     * Draws selected button
     */
    drawSelectedButton(button, centerX, y) {
        this.game.ctx.fillStyle = '#00aaff';
        this.game.ctx.font = 'bold 32px Raleway';
        
        const textWidth = this.game.ctx.measureText(button).width;
        const padding = 20;
        this.game.ctx.fillStyle = 'rgba(0, 170, 255, 0.2)';
        this.game.ctx.fillRect(centerX - textWidth/2 - padding, y - 25, textWidth + padding*2, 50);
        
        this.game.ctx.fillStyle = '#00aaff';
        this.game.ctx.fillText(button, centerX, y);
    }

    /**
     * Draws normal button
     */
    drawNormalButton(button, centerX, y) {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 28px Raleway';
        this.game.ctx.fillText(button, centerX, y);
    }

    /**
     * Resets text alignment
     */
    resetTextAlignment() {
        this.game.ctx.textAlign = 'left';
    }
}
