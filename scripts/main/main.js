/**
 * Main game logic class that coordinates all systems and manages the game flow
 * @class
 */
class Game {
    /**
     * Creates an instance of Game and initializes all systems
     * @constructor
     */
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 1280;
        this.height = 720;
        this.scale = 1;
        
        // Game state
        this.score = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.keys = {};
        
        // FPS timing
        this.lastFrameTime = 0;
        this.frameCount = 0;
        
        // Image cache
        this.loadedImages = new Map();
        
        // Ultimate cast ID for unique hit detection
        this.ultimateCastId = 0;
        
        // Initialize all systems
        this.initializeSystems();
        this.initializeModules();
        
        this.init();
    }

    /**
     * Initializes all core game systems
     * @private
     */
    initializeSystems() {
        this.wraithSystem = new WraithSystem(this);
        this.golemSystem = new GolemSystem(this);
        this.cameraSystem = new CameraSystem(this);
        this.uiSystem = new UISystem(this);
        this.spellSystem = new SpellManager(this);
        this.collisionSystem = new CollisionSystem(this);
        this.crystalSystem = new CrystalSystem(this);
        this.bossRoomSystem = new BossRoomSystem(this);
        this.bossSystem = new BossSystem(this);
        this.potionSystem = new PotionSystem(this);
        this.startScreenSystem = new StartScreenSystem(this);
        this.endScreenSystem = new EndScreenSystem(this);
        this.gameOverScreenSystem = new GameOverScreenSystem(this);
        this.rainSystem = new RainSystem(this);
        this.moonSystem = new MoonSystem(this);
        this.backgroundMusicSystem = new BackgroundMusicSystem(this);
        this.soundEffectsSystem = new SoundEffectsSystem(this);
        this.audioSystem = new AudioSystem(this);
        this.mobileSystem = new MobileSystem(this);
    }

    /**
     * Initializes modular systems for better code organization
     * @private
     */
    initializeModules() {
        this.imageLoader = new ImageLoader(this);
        this.eventHandler = new EventHandler(this);
        this.gameRenderer = new GameRenderer(this);
        this.gameUpdater = new GameUpdater(this);
    }

    /**
     * Initializes the game by setting up event listeners and preloading images
     * @async
     * @public
     */
    async init() {
        this.eventHandler.setupEventListeners();
        await this.imageLoader.preloadImages();
        this.rainSystem.setEnabled(true);
        this.startScreenSystem.show();
        this.gameLoop();
    }

    /**
     * Loads a single image and caches it for future use
     * @param {string} src - The image source path
     * @returns {Promise<Image|null>} Promise that resolves to the loaded image or null if failed
     * @public
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.loadedImages.set(src, img);
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`✗ Image could not be loaded: ${src}`);
                resolve(null);
            };
            img.src = src;
        });
    }

    /**
     * Starts a new game by resetting all systems and game state
     * @public
     */
    startGame() {
        this.wraithSystem.startGame();
        this.golemSystem.reset();
        this.spellSystem.reset();
        this.crystalSystem.reset();
        this.bossRoomSystem.reset();
        this.bossSystem.reset();
        this.cameraSystem.reset();
        this.potionSystem.reset();
        this.rainSystem.reset();
        this.rainSystem.setEnabled(true);
        this.moonSystem.reset();
        
        this.score = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.ultimateCastId = 0;
        
        this.startScreenSystem.hide();
        this.endScreenSystem.hide();
        this.gameOverScreenSystem.hide();
        
        this.uiSystem.updateUI();
        this.uiSystem.hideGameOver();
        this.cameraSystem.resetToPlayer();
        
        if (this.mobileSystem && this.mobileSystem.getIsMobile()) {
            this.mobileSystem.getMobileControls().setPauseButtonVisible(true);
        }
    }

    /**
     * Toggles game pause state and manages background music accordingly
     * @public
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.backgroundMusicSystem) {
            if (this.isPaused) {
                this.backgroundMusicSystem.pause();
            } else {
                this.backgroundMusicSystem.resume();
            }
        }
    }

    /**
     * Main game loop with 60 FPS cap using requestAnimationFrame
     * @public
     */
    gameLoop() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;
        
        if (deltaTime >= 15) {
            if (!this.isPaused) {
                this.gameUpdater.update();
            }
            this.gameRenderer.draw();
            this.lastFrameTime = now;
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Shows the game over screen
     * @public
     */
    showGameOver() {
        this.gameOverScreenSystem.show();
    }

    /**
     * Handles mouse clicks in pause screen by delegating to EventHandler
     * @param {MouseEvent} e - The mouse event
     * @public
     */
    handlePauseScreenClick(e) {
        this.eventHandler.handlePauseScreenClick(e);
    }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
