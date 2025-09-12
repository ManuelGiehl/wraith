/**
 * EventHandler - Handles all game events including keyboard, mouse, and UI interactions
 * @class
 */
class EventHandler {
    /**
     * Creates an instance of EventHandler
     * @param {Game} game - The main game instance
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Sets up all event listeners for the game
     * @public
     */
    setupEventListeners() {
        this.setupKeyboardEvents();
        this.setupMouseEvents();
        this.setupUIEvents();
    }

    /**
     * Sets up keyboard event listeners for keydown and keyup events
     * @private
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            this.game.keys[e.code] = true;
            this.handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.game.keys[e.code] = false;
        });
    }

    /**
     * Handles keyboard key press events with screen priority system
     * @param {KeyboardEvent} e - The keyboard event
     * @private
     */
    handleKeyDown(e) {
        if (this.game.startScreenSystem.isVisible) {
            this.game.startScreenSystem.handleKeyDown(e);
            return;
        }
        if (this.game.endScreenSystem.isVisible) {
            this.game.endScreenSystem.handleKeyDown(e);
            return;
        }
        if (this.game.gameOverScreenSystem.isVisible) {
            this.game.gameOverScreenSystem.handleKeyDown(e);
            return;
        }     
        this.game.wraithSystem.handleKeyDown(e); 
        if (e.code === 'F2') {
            this.game.bossRoomSystem.spawnDirectlyInBossRoom();
        }
    }

    /**
     * Sets up mouse event listeners for mousemove, click, and mousedown events
     * @private
     */
    setupMouseEvents() {
        this.game.canvas.addEventListener('mousemove', (e) => {
            if (this.game.startScreenSystem.isVisible) {
                this.game.startScreenSystem.handleMouseMove(e);
            }
        });

        this.game.canvas.addEventListener('click', (e) => {
            this.handleMouseClick(e);
        });

        this.game.canvas.addEventListener('mousedown', (e) => {
            this.handleMouseDown(e);
        });

        this.game.canvas.addEventListener('touchstart', (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            this.handleMouseClick(e);
        });
    }

    /**
     * Handles mouse click events with screen priority system
     * @param {MouseEvent} e - The mouse event
     * @private
     */
    handleMouseClick(e) {
        if (this.game.startScreenSystem.isVisible) {
            this.game.startScreenSystem.handleMouseClick(e);
        } else if (this.game.endScreenSystem.isVisible) {
            this.game.endScreenSystem.handleMouseClick(e);
        } else if (this.game.gameOverScreenSystem.isVisible) {
            this.game.gameOverScreenSystem.handleMouseClick(e);
        } else if (this.game.isPaused) {
            this.handlePauseScreenClick(e);
        }
    }

    /**
     * Handles mouse down events for spell casting
     * @param {MouseEvent} e - The mouse event
     * @private
     */
    handleMouseDown(e) {
        if (e.button === 0 && !this.game.wraithSystem.player.isCasting && !this.game.wraithSystem.player.isCastingUltimate) {
            this.game.wraithSystem.startCasting();
        }
    }

    /**
     * Sets up UI event listeners for buttons and interface elements
     * @private
     */
    setupUIEvents() {
        this.game.uiSystem.restartBtn.addEventListener('click', () => {
            if (this.game.audioSystem) {
                this.game.audioSystem.playSound('click');
            }
            this.game.startGame();
        });
    }

    /**
     * Handles mouse clicks in the pause screen
     * @param {MouseEvent} e - The mouse event
     * @public
     */
    handlePauseScreenClick(e) {
        const mousePos = this.getMousePosition(e);
        const buttonBounds = this.getPauseButtonBounds();
        
        if (this.isClickOnPauseButton(mousePos, buttonBounds)) {
            this.handlePauseButtonClick();
        }
    }

    /**
     * Calculates mouse position relative to the canvas
     * @param {MouseEvent} e - The mouse event
     * @returns {Object} Object containing x and y coordinates
     * @private
     */
    getMousePosition(e) {
        const rect = this.game.canvas.getBoundingClientRect();
        
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }  
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    /**
     * Calculates the bounds of the pause button for click detection
     * @returns {Object} Object containing button position and dimensions
     * @private
     */
    getPauseButtonBounds() {
        const buttonY = this.game.height / 2 + 120;
        const buttonWidth = 250;
        const buttonHeight = 50;
        const buttonX = this.game.width / 2 - buttonWidth / 2;
        
        return {
            x: buttonX,
            y: buttonY - buttonHeight/2,
            width: buttonWidth,
            height: buttonHeight
        };
    }

    /**
     * Checks if a mouse click was on the pause button
     * @param {Object} mousePos - Mouse position object with x and y coordinates
     * @param {Object} buttonBounds - Button bounds object with position and dimensions
     * @returns {boolean} True if click was on button, false otherwise
     * @private
     */
    isClickOnPauseButton(mousePos, buttonBounds) {
        return mousePos.x >= buttonBounds.x && 
               mousePos.x <= buttonBounds.x + buttonBounds.width && 
               mousePos.y >= buttonBounds.y && 
               mousePos.y <= buttonBounds.y + buttonBounds.height;
    }

    /**
     * Handles click on the pause button
     * @private
     */
    handlePauseButtonClick() {
        if (this.game.audioSystem) {
            this.game.audioSystem.playSound('click');
        }
        
        this.resetToMainMenu();
    }

    /**
     * Resets the game back to the main menu
     * @private
     */
    resetToMainMenu() {
        this.game.isPaused = false;
        this.game.startScreenSystem.resetAndShow(); 
        this.game.score = 0;
        this.game.gameOver = false;
        this.game.ultimateCastId = 0;
        this.game.endScreenSystem.hide();
        this.game.gameOverScreenSystem.hide();  
        this.game.rainSystem.setEnabled(true);
        this.game.bossRoomSystem.inBossRoom = false;
        this.game.bossRoomSystem.enteringBossRoom = false;
        
        if (this.game.backgroundMusicSystem) {
            this.game.backgroundMusicSystem.play();
        }
    }
}
