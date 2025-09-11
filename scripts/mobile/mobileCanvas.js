/**
 * Mobile Canvas Management - Handles responsive canvas setup and iOS fullscreen
 * @class
 */
class MobileCanvas {
    /**
     * Creates an instance of MobileCanvas
     * @param {Game} game - The main game instance
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Sets up responsive canvas for mobile devices
     * @public
     */
    setupResponsiveCanvas() {
        const canvas = this.game.canvas;
        const container = document.getElementById('gameContainer');
        
        this.enableFullscreen();
        this.setupCanvasStyling(canvas);
        this.setupContainerStyling(container);
        this.ensureViewportMeta();
    }

    /**
     * Enables fullscreen mode
     * @public
     */
    enableFullscreen() {
        this.setupFullscreenCSS();
        this.setupIOSFullscreen();
        this.createEnterButton();
    }

    /**
     * Sets up fullscreen CSS
     * @private
     */
    setupFullscreenCSS() {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    /**
     * Sets up iOS Safari fullscreen
     * @private
     */
    setupIOSFullscreen() {
        this.setupStatusBarMeta();
        this.setupWebAppMeta();
        this.setupLegacyWebAppMeta();
        this.adjustViewport();
    }

    /**
     * Sets up status bar meta tag
     * @private
     */
    setupStatusBarMeta() {
        let statusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!statusBar) {
            statusBar = document.createElement('meta');
            statusBar.name = 'apple-mobile-web-app-status-bar-style';
            document.head.appendChild(statusBar);
        }
        statusBar.content = 'black-translucent';
    }

    /**
     * Sets up web app meta tag
     * @private
     */
    setupWebAppMeta() {
        let webApp = document.querySelector('meta[name="mobile-web-app-capable"]');
        if (!webApp) {
            webApp = document.createElement('meta');
            webApp.name = 'mobile-web-app-capable';
            document.head.appendChild(webApp);
        }
        webApp.content = 'yes';
    }

    /**
     * Sets up legacy web app meta tag
     * @private
     */
    setupLegacyWebAppMeta() {
        let legacyWebApp = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
        if (!legacyWebApp) {
            legacyWebApp = document.createElement('meta');
            legacyWebApp.name = 'apple-mobile-web-app-capable';
            document.head.appendChild(legacyWebApp);
        }
        legacyWebApp.content = 'yes';
    }

    /**
     * Adjusts viewport meta tag
     * @private
     */
    adjustViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }
    }

    /**
     * Sets up canvas styling
     * @private
     */
    setupCanvasStyling(canvas) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.maxWidth = '100vw';
        canvas.style.maxHeight = '100vh';
    }

    /**
     * Sets up container styling
     * @private
     */
    setupContainerStyling(container) {
        if (container) {
            container.style.width = '100vw';
            container.style.height = '100vh';
            container.style.overflow = 'hidden';
        }
    }

    /**
     * Ensures viewport meta tag exists
     * @private
     */
    ensureViewportMeta() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    }

    /**
     * Creates enter button
     * @private
     */
    createEnterButton() {
        const enterBtn = this.createEnterButtonElement();
        this.setupEnterButtonEvents(enterBtn);
        document.body.appendChild(enterBtn);
    }

    /**
     * Creates enter button element
     * @private
     */
    createEnterButtonElement() {
        const enterBtn = document.createElement('button');
        enterBtn.id = 'enter-btn';
        enterBtn.innerHTML = '↵ Enter';
        enterBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid white;
            border-radius: 10px;
            padding: 15px 20px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        `;
        return enterBtn;
    }

    /**
     * Sets up enter button events
     * @private
     */
    setupEnterButtonEvents(enterBtn) {
        enterBtn.addEventListener('click', () => {
            this.handleEnterPress();
        });
        
        enterBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleEnterPress();
        });
    }

    /**
     * Handles enter press
     * @private
     */
    handleEnterPress() {
        const event = { code: 'Enter' };
        
        if (this.game.startScreenSystem.isVisible) {
            this.game.startScreenSystem.handleKeyDown(event);
        } else if (this.game.endScreenSystem.isVisible) {
            this.game.endScreenSystem.handleKeyDown(event);
        } else if (this.game.gameOverScreenSystem.isVisible) {
            this.game.gameOverScreenSystem.handleKeyDown(event);
        } else if (this.game.isPaused) {
            this.handlePauseKeyDown(event);
        }
    }

    /**
     * Handles pause key down
     * @private
     */
    handlePauseKeyDown(e) {
        if (e.code === 'Escape') {
            this.game.isPaused = false;
            this.game.backgroundMusicSystem.play();
        }
    }

    /**
     * Requests fullscreen mode
     * @public
     */
    requestFullscreen() {
        if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not available');
            });
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        
        this.hideStatusBar();
    }

    /**
     * Hides status bar (iOS)
     * @private
     */
    hideStatusBar() {
        let statusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!statusBar) {
            statusBar = document.createElement('meta');
            statusBar.name = 'apple-mobile-web-app-status-bar-style';
            document.head.appendChild(statusBar);
        }
        statusBar.content = 'black-translucent';
        
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }
    }

    /**
     * Resizes canvas to fit screen
     * @public
     */
    resizeCanvas() {
        const canvas = this.game.canvas;
        const container = document.getElementById('gameContainer');
        
        if (!container) return;
        
        const dimensions = this.calculateCanvasDimensions();
        this.applyCanvasDimensions(canvas, dimensions);
    }

    /**
     * Calculates canvas dimensions
     * @private
     */
    calculateCanvasDimensions() {
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight;
        
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        let realHeight = availableHeight;
        if (isIOS && isSafari) {
            realHeight = window.screen.height;
        }
        
        const originalWidth = 1280;
        const originalHeight = 720;
        
        const scaleX = availableWidth / originalWidth;
        const scaleY = realHeight / originalHeight;
        const scale = Math.min(scaleX, scaleY);
        
        return { originalWidth, originalHeight, scale };
    }

    /**
     * Applies canvas dimensions
     * @private
     */
    applyCanvasDimensions(canvas, dimensions) {
        const { originalWidth, originalHeight, scale } = dimensions;
        
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        
        this.game.width = originalWidth;
        this.game.height = originalHeight;
        this.game.scale = scale;
        
        canvas.style.width = `${originalWidth * scale}px`;
        canvas.style.height = `${originalHeight * scale}px`;
        canvas.style.position = 'absolute';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
        canvas.style.imageRendering = 'pixelated';
    }
}
