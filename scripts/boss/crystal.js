/**
 * Crystal System for the game
 * Manages the Crystal object and Boss Room animation
 */
class CrystalSystem {
    constructor(game) {
        this.game = game;
        this.crystal = null;
        this.crystalSpawned = false;
    
    }

    /**
     * Checks if crystal should be spawned (always visible)
     */
    checkCrystalSpawn() {
        if (!this.crystalSpawned) {
            this.spawnCrystal();
        }
    }
    
    /**
     * Spawns the crystal object
     */
    spawnCrystal() {
        const groundLevel = 670;
        this.crystal = {
            x: this.game.wraithSystem.player.x + 2560,
            y: groundLevel - 160, 
            width: 160,
            height: 180, 
            hasGlow: false 
        };
        this.crystalSpawned = true;
       
    }
    
    /**
     * Updates the crystal object
     */
    updateCrystal() {
        if (this.crystal) {
            if (this.game.score >= 5000 && !this.crystal.hasGlow) {
                this.crystal.hasGlow = true;
               
            }
        }
    }

    /**
     * Updates the boss room animation (delegates to BossRoomSystem)
     */
    updateBossRoomAnimation() {
        this.game.bossRoomSystem.updateBossRoomAnimation();
    }

    /**
     * Enters the boss room (delegates to BossRoomSystem)
     */
    enterBossRoom() {
        this.game.bossRoomSystem.enterBossRoom();
    }
    
    /**
     * Checks if player is standing on the crystal
     */
    isPlayerOnCrystal() {
        if (!this.crystal) return false;
        
        const playerCenterX = this.game.wraithSystem.player.x + this.game.wraithSystem.player.width / 2;
        const playerCenterY = this.game.wraithSystem.player.y + this.game.wraithSystem.player.height / 2;
        const crystalCenterX = this.crystal.x + this.crystal.width / 2;
        const crystalCenterY = this.crystal.y + this.crystal.height / 2;
        

        const distanceX = Math.abs(playerCenterX - crystalCenterX);
        const distanceY = Math.abs(playerCenterY - crystalCenterY);
        
        return distanceX < 100 && distanceY < 100;
    }

    /**
     * Resets the crystal system
     */
    reset() {
        this.crystal = null;
        this.crystalSpawned = false;
    }

    /**
     * Returns the crystal object
     */
    getCrystal() {
        return this.crystal;
    }

    /**
     * Checks if crystal is spawned
     */
    isCrystalSpawned() {
        return this.crystalSpawned;
    }

    /**
     * Checks if player is entering boss room (delegates to BossRoomSystem)
     */
    isEnteringBossRoom() {
        return this.game.bossRoomSystem.isEnteringBossRoom();
    }

    /**
     * Checks if player is in boss room (delegates to BossRoomSystem)
     */
    isInBossRoom() {
        return this.game.bossRoomSystem.isInBossRoom();
    }
}
