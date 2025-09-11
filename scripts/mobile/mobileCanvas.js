/**
 * Mobile Canvas Management - Handles responsive canvas setup and iOS fullscreen
 */
class MobileCanvas {
    constructor(game) {
        this.game = game;
    }

    /**
     * Sets up responsive canvas for mobile devices
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
     */
    enableFullscreen() {
        this.setupFullscreenCSS();
        this.setupIOSFullscreen();
        this.createEnterButton();
    }

    /**
     * Sets up fullscreen CSS
     */
    setupFullscreenCSS() {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    /**
     * Sets up iOS Safari fullscreen
     */
    setupIOSFullscreen() {
        this.setupStatusBarMeta();
        this.setupWebAppMeta();
        this.setupLegacyWebAppMeta();
        this.adjustViewport();
    }

    /**
     * Sets up status bar meta tag
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
     */
    adjustViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }
    }

    /**
     * Sets up canvas styling
     */
    setupCanvasStyling(canvas) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.maxWidth = '100vw';
        canvas.style.maxHeight = '100vh';
    }

    /**
     * Sets up container styling
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
     */
    createEnterButton() {
        const enterBtn = this.createEnterButtonElement();
        this.setupEnterButtonEvents(enterBtn);
        document.body.appendChild(enterBtn);
    }

    /**
     * Creates enter button element
     */
    createEnterButtonElement() {
        const enterBtn = document.createElement('button');
        enterBtn.id = 'enter-btn';
        enterBtn.innerHTML = '↵';
        this.setupEnterButtonStyling(enterBtn);
        return enterBtn;
    }

    /**
     * Sets up enter button styling
     */
    setupEnterButtonStyling(enterBtn) {
        enterBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: rgba(42, 74, 107, 0.8);
            color: white;
            border: 2px solid #4a90e2;
            border-radius: 8px;
            width: 60px;
            height: 60px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
    }

    /**
     * Sets up enter button events
     */
    setupEnterButtonEvents(enterBtn) {
        this.setupEnterButtonClickEvent(enterBtn);
        this.setupEnterButtonTouchEvent(enterBtn);
    }

    /**
     * Sets up enter button click event
     */
    setupEnterButtonClickEvent(enterBtn) {
        enterBtn.addEventListener('click', (e) => {
            if (this.game.isPaused) {
                this.game.eventHandler.handlePauseButtonClick();
                return;
            }
            this.handleEnterPress();
        });
    }

    /**
     * Sets up enter button touch event
     */
    setupEnterButtonTouchEvent(enterBtn) {
        enterBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.game.isPaused) {
                this.game.eventHandler.handlePauseButtonClick();
                return;
            }
            e.stopPropagation();
            this.handleEnterPress();
        });
    }

    /**
     * Handles enter press
     */
    handleEnterPress() {
        const event = { code: 'Enter' };
        this.routeEnterEvent(event);
    }

    /**
     * Routes enter event to appropriate system
     */
    routeEnterEvent(event) {
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
     */
    handlePauseKeyDown(e) {
        if (e.code === 'Escape') {
            this.game.isPaused = false;
            this.game.backgroundMusicSystem.play();
        }
    }

    /**
     * Requests fullscreen mode
     */
    requestFullscreen() {
        this.attemptFullscreenRequest();
        this.hideStatusBar();
    }

    /**
     * Attempts to request fullscreen
     */
    attemptFullscreenRequest() {
        if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not available');
            });
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    }

    /**
     * Hides status bar (iOS)
     */
    hideStatusBar() {
        this.setupStatusBarForFullscreen();
        this.updateViewportForFullscreen();
    }

    /**
     * Sets up status bar for fullscreen
     */
    setupStatusBarForFullscreen() {
        let statusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!statusBar) {
            statusBar = document.createElement('meta');
            statusBar.name = 'apple-mobile-web-app-status-bar-style';
            document.head.appendChild(statusBar);
        }
        statusBar.content = 'black-translucent';
    }

    /**
     * Updates viewport for fullscreen
     */
    updateViewportForFullscreen() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }
    }

    /**
     * Resizes canvas to fit screen
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
     */
    calculateCanvasDimensions() {
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight;
        const realHeight = this.calculateRealHeight(availableHeight);
        const scale = this.calculateScale(availableWidth, realHeight);
        
        return { originalWidth: 1280, originalHeight: 720, scale };
    }

    /**
     * Calculates real height for iOS Safari
     */
    calculateRealHeight(availableHeight) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        if (isIOS && isSafari) {
            return window.screen.height;
        }
        return availableHeight;
    }

    /**
     * Calculates scale factor
     */
    calculateScale(availableWidth, realHeight) {
        const originalWidth = 1280;
        const originalHeight = 720;
        
        const scaleX = availableWidth / originalWidth;
        const scaleY = realHeight / originalHeight;
        return Math.min(scaleX, scaleY);
    }

    /**
     * Applies canvas dimensions
     */
    applyCanvasDimensions(canvas, dimensions) {
        const { originalWidth, originalHeight, scale } = dimensions;
        
        this.setCanvasSize(canvas, originalWidth, originalHeight);
        this.updateGameDimensions(originalWidth, originalHeight, scale);
        this.setCanvasStyling(canvas, originalWidth, originalHeight, scale);
    }

    /**
     * Sets canvas size
     */
    setCanvasSize(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
    }

    /**
     * Updates game dimensions
     */
    updateGameDimensions(width, height, scale) {
        this.game.width = width;
        this.game.height = height;
        this.game.scale = scale;
    }

    /**
     * Sets canvas styling
     */
    setCanvasStyling(canvas, width, height, scale) {
        canvas.style.width = `${width * scale}px`;
        canvas.style.height = `${height * scale}px`;
        canvas.style.position = 'absolute';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
        canvas.style.imageRendering = 'pixelated';
    }
}