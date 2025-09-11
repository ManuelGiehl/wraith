/**
 * Moon System - Creates a floating moon animation with glow effects
 * @class
 */
class MoonSystem {
    /**
     * Creates an instance of MoonSystem
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
        this.moonFloat = 0;
        this.moonImage = null;
        this.isVisible = true;
        
        this.moonX = 0;
        this.moonY = 0;
        this.moonWidth = 0;
        this.moonHeight = 0;
        
        this.glowColor = '#4a90e2';
        this.glowBlur = 20;
        this.glowIntensity = 1.0;
        
        this.initializeMoon();
    }

    /**
     * Initializes the moon system with canvas-based positioning
     * @public
     */
    initializeMoon() {
        this.moonWidth = this.game.width;
        this.moonHeight = this.game.height;
        this.moonX = 0;
        this.moonY = 0;
    }

    /**
     * Loads the moon image at runtime
     * @public
     * @returns {Image|null} The loaded moon image or null if not found
     */
    loadMoonImage() {
        if (!this.moonImage) {
            this.moonImage = this.game.loadedImages.get('models/img/background/PNG/3_game_background/layers/9.png');
        }
        return this.moonImage;
    }

    /**
     * Updates the moon system animation
     * @public
     */
    update() {
        this.moonFloat += 0.03;
        this.glowIntensity = 0.8 + Math.sin(this.moonFloat * 0.5) * 0.2;
    }

    /**
     * Sets the moon visibility
     * @public
     * @param {boolean} visible - Whether the moon should be visible
     */
    setVisible(visible) {
        this.isVisible = visible;
    }

    /**
     * Sets the glow color
     * @public
     * @param {string} color - The glow color (CSS color string)
     */
    setGlowColor(color) {
        this.glowColor = color;
    }

    /**
     * Sets the glow intensity
     * @public
     * @param {number} intensity - The glow intensity (0-2)
     */
    setGlowIntensity(intensity) {
        this.glowIntensity = Math.max(0, Math.min(2, intensity));
    }

    /**
     * Sets the glow blur strength
     * @public
     * @param {number} blur - The blur strength (0 or higher)
     */
    setGlowBlur(blur) {
        this.glowBlur = Math.max(0, blur);
    }

    /**
     * Resets the moon system to initial state
     * @public
     */
    reset() {
        this.moonFloat = 0;
        this.glowIntensity = 1.0;
        this.isVisible = true;
    }
}
