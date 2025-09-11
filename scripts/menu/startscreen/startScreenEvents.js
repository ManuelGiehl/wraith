/**
 * Start Screen Events - Handles all user input events for the start screen
 * @class
 */
class StartScreenEvents {
    /**
     * Creates an instance of StartScreenEvents
     * @param {StartScreenSystem} startScreen - The main start screen system
     * @constructor
     */
    constructor(startScreen) {
        this.startScreen = startScreen;
        this.setupCloseButtonEvents();
    }

    /**
     * Sets up event listeners for close buttons
     * @private
     */
    setupCloseButtonEvents() {
        const closeControlsBtn = document.getElementById('closeControlsBtn');
        const closeAudioBtn = document.getElementById('closeAudioBtn');
        
        if (closeControlsBtn) {
            closeControlsBtn.addEventListener('click', () => {
                this.startScreen.closeModal('controls');
            });
        }
        
        if (closeAudioBtn) {
            closeAudioBtn.addEventListener('click', () => {
                this.startScreen.closeModal('audio');
            });
        }
    }

    /**
     * Handles mouse move events
     * @public
     * @param {MouseEvent} e - Mouse move event
     */
    handleMouseMove(e) {
        if (!this.startScreen.isVisible || this.startScreen.introPhase !== 'menu') return;
        this.updateMousePosition(e);
        this.resetHoverStates();
        
        if (this.startScreen.showGameTooltip) {
            this.handleGameTooltipHover();
        } else if (!this.startScreen.showControls && !this.startScreen.showAudio && !this.startScreen.showImpressum) {
            this.handleMenuHover();
        }
    }

    /**
     * Updates mouse position from event
     * @private
     * @param {MouseEvent} e - Mouse event
     */
    updateMousePosition(e) {
        const rect = this.startScreen.game.canvas.getBoundingClientRect();
        this.startScreen.mouseX = e.clientX - rect.left;
        this.startScreen.mouseY = e.clientY - rect.top;
    }

    /**
     * Resets hover states
     * @private
     */
    resetHoverStates() {
        this.startScreen.hoveredOption = -1;
        this.startScreen.hoveredStartButton = false;

        this.setCursor('default');
    }

    /**
     * Sets cursor style using CSS classes
     * @private
     * @param {string} cursorType - Type of cursor ('pointer' or 'default')
     */
    setCursor(cursorType) {
        const canvas = this.startScreen.game.canvas;
        canvas.classList.remove('cursor-pointer', 'cursor-default');
        canvas.classList.add(`cursor-${cursorType}`);
    }

    /**
     * Handles game tooltip hover
     * @private
     */
    handleGameTooltipHover() {
        const centerX = this.startScreen.game.width / 2;
        const centerY = this.startScreen.game.height / 2;
        const buttonY = centerY + 200;
        const buttonWidth = 200;
        const buttonHeight = 50;
        
        const isHoveringButton = this.startScreen.mouseX >= centerX - buttonWidth/2 && 
            this.startScreen.mouseX <= centerX + buttonWidth/2 && 
            this.startScreen.mouseY >= buttonY - buttonHeight/2 && 
            this.startScreen.mouseY <= buttonY + buttonHeight/2;
        
        if (isHoveringButton) {
            this.startScreen.hoveredStartButton = true;
        }

        this.setCursor(isHoveringButton ? 'pointer' : 'default');
    }

    /**
     * Handles menu hover
     * @private
     */
    handleMenuHover() {
        const centerX = this.startScreen.game.width / 2;
        const centerY = this.startScreen.game.height / 2;
        let isHoveringOption = false;
        
        this.startScreen.options.forEach((option, index) => {
            if (this.checkOptionHover(option, index, centerX, centerY)) {
                isHoveringOption = true;
            }
        });

        this.setCursor(isHoveringOption ? 'pointer' : 'default');
    }

    /**
     * Checks if option is hovered
     * @private
     * @param {string} option - Option text
     * @param {number} index - Option index
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @returns {boolean} Whether the option is hovered
     */
    checkOptionHover(option, index, centerX, centerY) {
        const y = centerY + (index * 60) - 20;
        const textHeight = 26;
        const halfHeight = textHeight / 2;
        const isHovered = this.startScreen.mouseY >= y - halfHeight && this.startScreen.mouseY <= y + halfHeight && 
            this.startScreen.mouseX >= centerX - 100 && this.startScreen.mouseX <= centerX + 100;
        
        if (isHovered) {
            this.startScreen.hoveredOption = index;
        }
        
        return isHovered;
    }

    /**
     * Handles mouse click events
     * @public
     * @param {MouseEvent} e - Mouse click event
     */
    handleMouseClick(e) {
        if (!this.startScreen.isVisible || this.startScreen.introPhase !== 'menu') return;
        
        const rect = this.startScreen.game.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        if (this.startScreen.showGameTooltip) {
            this.handleGameTooltipClick(mouseX, mouseY);
            return;
        } 
        if (this.startScreen.showAudio && this.startScreen.game.audioSystem) {
            if (this.startScreen.game.audioSystem.handleAudioClick(mouseX, mouseY)) {
                return;
            }
        }
        if (!this.startScreen.showControls && !this.startScreen.showAudio && !this.startScreen.showImpressum && !this.startScreen.showGameTooltip) {
            this.handleMenuClick();
        }
    }

    /**
     * Handles game tooltip click
     * @private
     * @param {number} mouseX - Mouse X coordinate
     * @param {number} mouseY - Mouse Y coordinate
     */
    handleGameTooltipClick(mouseX, mouseY) {
        const centerX = this.startScreen.game.width / 2;
        const centerY = this.startScreen.game.height / 2;
        const buttonY = centerY + 200;
        const buttonWidth = 200;
        const buttonHeight = 50;
        
        if (mouseX >= centerX - buttonWidth/2 && 
            mouseX <= centerX + buttonWidth/2 && 
            mouseY >= buttonY - buttonHeight/2 && 
            mouseY <= buttonY + buttonHeight/2) {
            this.startScreen.startGame();
        }
    }

    /**
     * Handles menu click
     * @private
     */
    handleMenuClick() {
        if (this.startScreen.hoveredOption >= 0) {
            this.startScreen.selectedOption = this.startScreen.hoveredOption;
            this.startScreen.selectOption();
        }
    }

    /**
     * Handles keyboard events
     * @public
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        if (!this.startScreen.isVisible) return;
        
        if (this.startScreen.showGameTooltip) {
            this.handleGameTooltipKeyDown(e);
            return;
        }
        
        if (this.startScreen.showControls || this.startScreen.showAudio || this.startScreen.showImpressum) {
            this.handleModalKeyDown(e);
            return;
        }
        
        if (this.startScreen.introPhase === 'menu') {
            this.handleMenuKeyDown(e);
        }
    }

    /**
     * Handles game tooltip keyboard input
     * @private
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleGameTooltipKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ' || e.code === 'Enter') {
            this.startScreen.startGame();
        } else if (e.key === 'Escape' || e.code === 'Escape') {
            this.startScreen.showGameTooltip = false;
        }
    }

    /**
     * Handles modal keyboard input
     * @private
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleModalKeyDown(e) {
        if (e.key === 'Escape' || e.code === 'Escape') {
            this.startScreen.showControls = false;
            this.startScreen.showAudio = false;
            this.startScreen.showImpressum = false;
            this.startScreen.selectedOption = -1;
            this.startScreen.hideAllCloseButtons();
        }
    }

    /**
     * Handles menu keyboard input
     * @private
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleMenuKeyDown(e) {
        if (e.key === 'ArrowUp' || e.code === 'ArrowUp') {
            this.startScreen.selectedOption = this.startScreen.selectedOption === 0 ? this.startScreen.options.length - 1 : this.startScreen.selectedOption - 1;
        } else if (e.key === 'ArrowDown' || e.code === 'ArrowDown') {
            this.startScreen.selectedOption = (this.startScreen.selectedOption + 1) % this.startScreen.options.length;
        } else if (e.key === 'Enter' || e.key === ' ' || e.code === 'Enter') {
            this.startScreen.selectOption();
        }
    }
}
