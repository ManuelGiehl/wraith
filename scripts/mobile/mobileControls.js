/**
 * Mobile Controls Management - Handles touch controls, D-Pad, and button creation
 * @class
 */
class MobileControls {
    /**
     * Creates an instance of MobileControls
     * @param {Game} game - The main game instance
     */
    constructor(game) {
        this.game = game;
        this.touchControls = {
            left: null,
            right: null,
            jump: null,
            attack: null,
            ultimate: null,
            pause: null
        };
    }

    /**
     * Creates touch controls
     * @public
     */
    createTouchControls() {
        const controlsContainer = this.createControlsContainer();
        this.setupDpadAndUltimate(controlsContainer);
        this.setupActionButtons(controlsContainer);
        this.setupPauseButton(controlsContainer);
        this.createPortraitWarning();
    }

    /**
     * Creates controls container
     * @private
     */
    createControlsContainer() {
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'mobile-controls';
        controlsContainer.className = 'mobile-controls';
        controlsContainer.style.display = 'none';
        document.body.appendChild(controlsContainer);
        return controlsContainer;
    }

    /**
     * Sets up D-Pad and Ultimate button
     * @private
     */
    setupDpadAndUltimate(container) {
        this.createDpad(container);
        
        this.touchControls.ultimate = this.createTouchButton('ultimate', 'R', 'ultimate');
        this.touchControls.ultimate.style.backgroundColor = 'rgba(255, 193, 7, 0.8)';
        container.appendChild(this.touchControls.ultimate);
    }

    /**
     * Sets up action buttons
     * @private
     */
    setupActionButtons(container) {
        const spacer = document.createElement('div');
        spacer.style.flex = '1';
        container.appendChild(spacer);
        
        this.touchControls.jump = this.createTouchButton('jump', 'J', 'jump');
        this.touchControls.jump.style.backgroundColor = 'rgba(0, 123, 255, 0.8)';
        container.appendChild(this.touchControls.jump);
        
        this.touchControls.attack = this.createTouchButton('attack', 'A', 'attack');
        container.appendChild(this.touchControls.attack);
        
        this.touchControls.potion = this.createTouchButton('potion', 'Q', 'potion');
        container.appendChild(this.touchControls.potion);
    }

    /**
     * Creates D-Pad
     * @private
     */
    createDpad(container) {
        const dpadContainer = this.createDpadContainer();
        this.createDpadButtons(dpadContainer);
        container.appendChild(dpadContainer);
    }

    /**
     * Creates D-Pad container
     * @private
     */
    createDpadContainer() {
        const dpadContainer = document.createElement('div');
        dpadContainer.id = 'mobile-dpad';
        dpadContainer.className = 'mobile-dpad';
        dpadContainer.style.cssText = `
            position: relative;
            width: 120px;
            height: 120px;
            pointer-events: auto;
        `;
        
        const centerButton = document.createElement('div');
        centerButton.className = 'dpad-center';
        centerButton.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            pointer-events: none;
        `;
        dpadContainer.appendChild(centerButton);
        
        return dpadContainer;
    }

    /**
     * Creates D-Pad buttons
     * @private
     */
    createDpadButtons(dpadContainer) {
        this.touchControls.up = this.createDpadButton('up', '↑', 'up', 'top: 0; left: 50%; transform: translateX(-50%);');
        dpadContainer.appendChild(this.touchControls.up);
        
        this.touchControls.down = this.createDpadButton('down', '↓', 'down', 'bottom: 0; left: 50%; transform: translateX(-50%);');
        dpadContainer.appendChild(this.touchControls.down);
        
        this.touchControls.left = this.createDpadButton('left', '←', 'left', 'top: 50%; left: 0; transform: translateY(-50%);');
        dpadContainer.appendChild(this.touchControls.left);
        
        this.touchControls.right = this.createDpadButton('right', '→', 'right', 'top: 50%; right: 0; transform: translateY(-50%);');
        dpadContainer.appendChild(this.touchControls.right);
    }

    /**
     * Creates D-Pad button
     * @private
     */
    createDpadButton(id, text, action, positionStyle) {
        const button = this.createDpadButtonElement(id, text, action);
        this.applyDpadButtonStyling(button, positionStyle);
        this.setupDpadButtonEvents(button);
        return button;
    }

    /**
     * Creates D-Pad button element
     * @private
     */
    createDpadButtonElement(id, text, action) {
        const button = document.createElement('button');
        button.id = `mobile-${id}`;
        button.className = `mobile-button mobile-${action} dpad-button`;
        button.textContent = text;
        button.setAttribute('data-action', action);
        return button;
    }

    /**
     * Applies D-Pad button styling
     * @private
     */
    applyDpadButtonStyling(button, positionStyle) {
        button.style.cssText = `
            position: absolute;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            color: white;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            pointer-events: auto;
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
            transition: all 0.2s ease;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            ${positionStyle}
        `;
    }

    /**
     * Sets up D-Pad button events
     * @private
     */
    setupDpadButtonEvents(button) {
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }

    /**
     * Creates touch button
     * @private
     */
    createTouchButton(id, text, action) {
        const button = document.createElement('button');
        button.id = `mobile-${id}`;
        button.className = `mobile-button mobile-${action}`;
        button.textContent = text;
        button.setAttribute('data-action', action);
        
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        
        return button;
    }

    /**
     * Sets up pause button (top left)
     * @private
     */
    setupPauseButton(container) {
        this.touchControls.pause = this.createTouchButton('pause', '⏸', 'pause');
        this.touchControls.pause.style.backgroundColor = 'rgba(42, 74, 107, 0.8)';
        this.touchControls.pause.style.position = 'fixed';
        this.touchControls.pause.style.top = '20px';
        this.touchControls.pause.style.left = '20px';
        this.touchControls.pause.style.width = '60px';
        this.touchControls.pause.style.height = '60px';
        this.touchControls.pause.style.fontSize = '24px';
        this.touchControls.pause.style.border = '2px solid #4a90e2';
        this.touchControls.pause.style.borderRadius = '8px';
        this.touchControls.pause.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        this.touchControls.pause.style.display = 'none';
        this.touchControls.pause.style.zIndex = '1001'; 
        document.body.appendChild(this.touchControls.pause);
    }

    /**
     * Creates portrait warning
     * @private
     */
    createPortraitWarning() {
        const warning = document.createElement('div');
        warning.id = 'portrait-warning';
        warning.className = 'portrait-warning';
        warning.innerHTML = `
            <div class="portrait-warning-content">
                <div class="portrait-icon">📱</div>
                <h2>Rotate Device</h2>
                <p>Please rotate your device to landscape mode to play the game.</p>
            </div>
        `;
        document.body.appendChild(warning);
    }


    /**
     * Gets touch controls
     * @public
     * @returns {Object} Touch controls object
     */
    getTouchControls() {
        return this.touchControls;
    }

    /**
     * Destroys mobile controls
     * @public
     */
    destroy() {
        const controls = document.getElementById('mobile-controls');
        if (controls) {
            controls.remove();
        }
        
        const warning = document.getElementById('portrait-warning');
        if (warning) {
            warning.remove();
        }
    }
}
