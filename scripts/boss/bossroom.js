/**
 * Boss room system for the game
 * Manages all boss room specific functions
 */
class BossRoomSystem {
    constructor(game) {
        this.game = game;
        this.inBossRoom = false;
        this.enteringBossRoom = false;
        this.initializeBossRoomAnimation();
    }

    /**
     * Initializes boss room animation
     */
    initializeBossRoomAnimation() {
        this.bossRoomAnimation = {
            rotation: 0,
            rotationSpeed: 0.1,
            velocityY: -8,
            duration: 0,
            maxDuration: 120,
            phase: 'flying_up',
            blackScreenDuration: 0,
            blackScreenMaxDuration: 60,
            fadeAlpha: 0,
            wraithStartY: 0,
            wraithTargetY: 300
        };
    }

    /**
     * Enters the boss room
     */
    enterBossRoom() {
        this.enteringBossRoom = true;
        this.bossRoomAnimation.duration = 0;
        this.bossRoomAnimation.rotation = 0;
        this.bossRoomAnimation.phase = 'flying_up';
        this.bossRoomAnimation.fadeAlpha = 0;
        
        this.stopPlayerMovement();
    }

    /**
     * Stops player movement
     */
    stopPlayerMovement() {
        this.game.wraithSystem.player.velocityX = 0;
        this.game.wraithSystem.player.velocityY = 0;
    }

    /**
     * Updates the boss room animation
     */
    updateBossRoomAnimation() {
        if (this.enteringBossRoom) {
            this.handleAnimationPhase();
        }
    }

    /**
     * Handles animation phase
     */
    handleAnimationPhase() {
        if (this.bossRoomAnimation.phase === 'flying_up') {
            this.handleFlyingUpPhase();
        } else if (this.bossRoomAnimation.phase === 'black_screen') {
            this.handleBlackScreenPhase();
        } else if (this.bossRoomAnimation.phase === 'flying_down') {
            this.handleFlyingDownPhase();
        }
    }

    /**
     * Handles flying up phase
     */
    handleFlyingUpPhase() {
        this.bossRoomAnimation.rotation += this.bossRoomAnimation.rotationSpeed;
        this.game.wraithSystem.player.y += this.bossRoomAnimation.velocityY;
        this.bossRoomAnimation.duration++;
        
        this.updateFadeAlpha();
        this.checkFlyingUpEnd();
    }

    /**
     * Updates fade alpha
     */
    updateFadeAlpha() {
        this.bossRoomAnimation.fadeAlpha = Math.min(1, this.bossRoomAnimation.duration / this.bossRoomAnimation.maxDuration);
    }

    /**
     * Checks if flying up phase ended
     */
    checkFlyingUpEnd() {
        if (this.bossRoomAnimation.duration >= this.bossRoomAnimation.maxDuration) {
            this.bossRoomAnimation.phase = 'black_screen';
            this.bossRoomAnimation.blackScreenDuration = 0;
            this.bossRoomAnimation.fadeAlpha = 1;
        }
    }

    /**
     * Handles black screen phase
     */
    handleBlackScreenPhase() {
        this.bossRoomAnimation.blackScreenDuration++;
        
        if (this.bossRoomAnimation.blackScreenDuration >= this.bossRoomAnimation.blackScreenMaxDuration) {
            this.activateBossRoom();
        }
    }

    /**
     * Activates boss room
     */
    activateBossRoom() {
        this.inBossRoom = true;
        this.bossRoomAnimation.phase = 'flying_down';
        this.setupWraithPosition();
        this.game.bossSystem.spawnBoss();
        this.switchToBossRoomBackground();
    }

    /**
     * Sets up wraith position
     */
    setupWraithPosition() {
        this.bossRoomAnimation.wraithStartY = -200;
        this.bossRoomAnimation.wraithTargetY = 500;
        this.game.wraithSystem.player.y = this.bossRoomAnimation.wraithStartY;
        this.game.wraithSystem.player.x = this.game.width / 2 - this.game.wraithSystem.player.width / 2;
        this.bossRoomAnimation.duration = 0;
    }

    /**
     * Switches to boss room background
     */
    switchToBossRoomBackground() {
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.classList.add('boss-room');
        }
    }

    /**
     * Switches back to normal background
     */
    switchToNormalBackground() {
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.classList.remove('boss-room');
        }
    }

    /**
     * Handles flying down phase
     */
    handleFlyingDownPhase() {
        const progress = Math.min(1, this.bossRoomAnimation.duration / 60);
        this.updateWraithPosition(progress);
        this.stopPlayerMovement();
        this.bossRoomAnimation.duration++;
        this.updateFadeAlphaDown(progress);
        this.checkFlyingDownEnd(progress);
    }

    /**
     * Updates wraith position
     */
    updateWraithPosition(progress) {
        this.game.wraithSystem.player.y = this.bossRoomAnimation.wraithStartY + 
            (this.bossRoomAnimation.wraithTargetY - this.bossRoomAnimation.wraithStartY) * progress;
    }

    /**
     * Updates fade alpha for flying down
     */
    updateFadeAlphaDown(progress) {
        this.bossRoomAnimation.fadeAlpha = Math.max(0, 1 - progress);
    }

    /**
     * Checks if flying down phase ended
     */
    checkFlyingDownEnd(progress) {
        if (progress >= 1) {
            this.enteringBossRoom = false;
            this.bossRoomAnimation.fadeAlpha = 0;
            this.landWraith();
        }
    }

    /**
     * Lands wraith on ground
     */
    landWraith() {
        this.game.wraithSystem.player.y = this.bossRoomAnimation.wraithTargetY;
        this.game.wraithSystem.player.isGrounded = true;
        this.game.wraithSystem.player.velocityY = 0;
    }

    /**
     * Draws the boss background
     */
    drawBossBackground() {
        const bossBackgroundImage = this.game.loadedImages.get('models/img/bossbackground/bossroom.png');
        if (bossBackgroundImage) {
            this.drawBossBackgroundImage(bossBackgroundImage);
        } else {
            this.drawFallbackBackground();
        }
    }

    /**
     * Draws boss background image
     */
    drawBossBackgroundImage(bossBackgroundImage) {
        const bgWidth = this.game.width;
        const bgHeight = this.game.height;
        
        this.game.ctx.imageSmoothingEnabled = true;
        this.game.ctx.imageSmoothingQuality = 'high';
        this.game.ctx.drawImage(bossBackgroundImage, 0, 0, bgWidth, bgHeight);
    }

    /**
     * Draws fallback background
     */
    drawFallbackBackground() {
        const gradient = this.game.ctx.createLinearGradient(0, 0, 0, this.game.height);
        gradient.addColorStop(0, '#1a0a0a');
        gradient.addColorStop(0.5, '#2d0f0f');
        gradient.addColorStop(1, '#0f0000');
        this.game.ctx.fillStyle = gradient;
        this.game.ctx.fillRect(0, 0, this.game.width, this.game.height);
    }

    /**
     * Draws the black transition
     */
    drawBossTransition() {
        if (this.bossRoomAnimation.fadeAlpha > 0) {
            this.game.ctx.fillStyle = `rgba(0, 0, 0, ${this.bossRoomAnimation.fadeAlpha})`;
            this.game.ctx.fillRect(0, 0, this.game.width, this.game.height);
        }
    }

    /**
     * Checks if player is in boss room
     */
    isInBossRoom() {
        return this.inBossRoom;
    }

    /**
     * Checks if player is entering boss room
     */
    isEnteringBossRoom() {
        return this.enteringBossRoom;
    }

    /**
     * Sets the boss room status
     */
    setEnteringBossRoom(entering) {
        this.enteringBossRoom = entering;
    }

    /**
     * Resets the boss room system
     */
    reset() {
        this.inBossRoom = false;
        this.enteringBossRoom = false;
        this.initializeBossRoomAnimation();
        this.switchToNormalBackground();
    }

    /**
     * Returns the boss room animation
     */
    getBossRoomAnimation() {
        return this.bossRoomAnimation;
    }

    /**
     * Resets the boss room system
     */
    reset() {
        this.inBossRoom = false;
        this.enteringBossRoom = false;
        this.initializeBossRoomAnimation();
    }

    /**
     * Spawns directly in boss room (for testing)
     */
    spawnDirectlyInBossRoom() {
        this.inBossRoom = true;
        this.enteringBossRoom = false;
        
        this.positionPlayerInBossRoom();
        this.game.bossSystem.spawnBoss();
    }

    /**
     * Positions player in boss room
     */
    positionPlayerInBossRoom() {
        this.game.wraithSystem.player.x = 800;
        this.game.wraithSystem.player.y = 500;
        this.game.wraithSystem.player.isGrounded = true;
        this.game.wraithSystem.player.velocityY = 0;
    }

    /**
     * Draws all boss room elements
     */
    drawBossRoom() {
        this.drawBossBackground();
        this.drawBossTransition();
    }
}
