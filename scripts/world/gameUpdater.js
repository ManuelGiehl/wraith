/**
 * GameUpdater - Updates all game systems including screens, objects, physics, and game logic
 * @class
 */
class GameUpdater {
    /**
     * Creates an instance of GameUpdater
     * @param {Game} game - The main game instance
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Main update method that coordinates all game system updates
     * @public
     */
    update() {
        this.game.frameCount++;
        
        this.updateScreens();
        this.updateBackgroundSystems();
        
        if (this.game.startScreenSystem.isVisible) return;
        if (this.game.gameOver) return;

        this.updateGameSystems();
        this.updateBossLogic();
        this.updateCollisionsAndSpawning();
        this.updateScoreAndCleanup();
    }

    /**
     * Updates all screen systems including start, end, and game over screens
     * @private
     */
    updateScreens() {
        if (this.game.startScreenSystem.isVisible) {
            this.game.startScreenSystem.updateIntro();
        }
        
        this.game.endScreenSystem.update();
        
        if (!this.game.startScreenSystem.isVisible) {
            this.game.gameOverScreenSystem.update();
        }
    }

    /**
     * Updates background systems that run regardless of game state
     * @private
     */
    updateBackgroundSystems() {
        this.game.rainSystem.update();
        this.game.moonSystem.update();
        this.game.mobileSystem.update();
    }

    /**
     * Updates core game systems including player, enemies, spells, and audio
     * @private
     */
    updateGameSystems() {
        this.game.cameraSystem.updateCamera();
        this.game.wraithSystem.updatePlayer();
        this.game.golemSystem.updateGolems();
        this.game.spellSystem.updateSpells();
        this.game.crystalSystem.updateCrystal();
        this.game.potionSystem.updateManaPotions();
        this.game.bossRoomSystem.updateBossRoomAnimation();
        this.game.bossSystem.updateBoss();
        this.game.soundEffectsSystem.update();
        this.game.audioSystem.update();
        this.game.backgroundMusicSystem.update();
    }

    /**
     * Updates boss-specific logic including death detection and end screen triggering
     * @private
     */
    updateBossLogic() {
        if (this.game.bossRoomSystem.inBossRoom && 
            this.game.bossSystem.boss.isDead && 
            this.game.bossSystem.boss.deathAnimationFinished && 
            !this.game.endScreenSystem.isVisible) {
            this.game.endScreenSystem.show();
        }
    }

    /**
     * Updates collision detection, enemy spawning, and crystal spawning
     * @private
     */
    updateCollisionsAndSpawning() {
        this.game.collisionSystem.checkCollisions();
        this.game.golemSystem.spawnGolems();
        this.game.golemSystem.spawnEliteGolem();
        this.game.crystalSystem.checkCrystalSpawn();
        this.game.uiSystem.updateUI();
    }

    /**
     * Updates score system and cleans up dead enemies
     * @private
     */
    updateScoreAndCleanup() {
        this.game.golemSystem.golems = this.game.golemSystem.golems.filter(golem => {
            if (golem.health === -1) {
                this.game.score += 100;
                return false;
            }
            return true;
        });
    }
}
