/**
 * Camera System for the game
 * Manages camera movement and coordinate transformation
 */
class CameraSystem {
    constructor(game) {
        this.game = game;
        this.camera = {
            x: 0, y: 0,
            width: game.width, height: game.height,
            followSpeed: 0.08,
            targetX: 0, velocityX: 0,
            acceleration: 0.12, maxSpeed: 5, 
            friction: 0.92, 
            lastUpdateTime: 0,
            deltaTime: 0
        };
    }

    /**
     * Updates the camera
     */
    updateCamera() {
        if (this.game.bossRoomSystem.inBossRoom) {
            this.handleBossRoomCamera();
            return;
        }
        this.updateDeltaTime();
        this.updateCameraTarget();
        this.updateCameraMovement();
        this.applyMicroSmoothing();
    }

    /**
     * Handles camera in boss room
     */
    handleBossRoomCamera() {
        this.camera.x = 0;
        this.camera.velocityX = 0;
    }

    /**
     * Updates delta time for consistent movement
     */
    updateDeltaTime() {
        const now = performance.now();
        this.camera.deltaTime = Math.min((now - this.camera.lastUpdateTime) / 16.67, 2);
        this.camera.lastUpdateTime = now;
    }

    /**
     * Updates camera target based on player
     */
    updateCameraTarget() {
        this.camera.targetX = this.game.wraithSystem.player.x - this.camera.width / 2;
    }

    /**
     * Updates camera movement with smooth interpolation
     */
    updateCameraMovement() {
        const distance = this.camera.targetX - this.camera.x;
        let targetVelocity = this.calculateTargetVelocity(distance);
        
        this.camera.velocityX += (targetVelocity - this.camera.velocityX) * this.camera.acceleration * this.camera.deltaTime;
        this.camera.velocityX *= Math.pow(this.camera.friction, this.camera.deltaTime);
        this.camera.x += this.camera.velocityX * this.camera.deltaTime;
    }

    /**
     * Calculates target velocity for smooth movement
     */
    calculateTargetVelocity(distance) {
        let targetVelocity = distance * this.camera.followSpeed * this.camera.deltaTime;
        const speedMultiplier = Math.min(1, Math.abs(distance) / 150);
        targetVelocity *= speedMultiplier;
        return Math.max(-this.camera.maxSpeed, Math.min(this.camera.maxSpeed, targetVelocity));
    }

    /**
     * Applies micro-smoothing for perfect precision
     */
    applyMicroSmoothing() {
        const distance = this.camera.targetX - this.camera.x;
        if (Math.abs(distance) < 0.05) {
            this.camera.x = this.camera.targetX;
            this.camera.velocityX = 0;
        }
    }

    /**
     * Converts world coordinates to screen coordinates
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.camera.x,
            y: worldY - this.camera.y
        };
    }

    /**
     * Converts screen coordinates to world coordinates
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.camera.x,
            y: screenY + this.camera.y
        };
    }

    /**
     * Sets the camera to a specific position
     */
    setCameraPosition(x, y) {
        this.camera.x = x; this.camera.y = y || this.camera.y;
        this.camera.targetX = x;
        this.camera.velocityX = 0;
    }

    /**
     * Resets the camera immediately to the Wraith
     */
    resetToPlayer() {
        this.camera.x = this.game.wraithSystem.player.x - this.camera.width / 2;
        this.camera.targetX = this.camera.x;
        this.camera.velocityX = 0;
    }

    /**
     * Checks if an object is in the viewport
     */
    isInViewport(x, y, width, height) {
        const screenPos = this.worldToScreen(x, y);
        return screenPos.x + width > 0 && 
               screenPos.x < this.camera.width && 
               screenPos.y + height > 0 && 
               screenPos.y < this.camera.height;
    }

    /**
     * Returns the current camera position
     */
    getPosition() {
        return {
            x: this.camera.x, y: this.camera.y
        };
    }

    /**
     * Returns the camera dimensions
     */
    getDimensions() {
        return {
            width: this.camera.width, height: this.camera.height
        };
    }

    /**
     * Sets the camera follow speed
     */
    setFollowSpeed(speed) {
        this.camera.followSpeed = speed;
    }

    /**
     * Sets the camera acceleration
     */
    setAcceleration(acceleration) {
        this.camera.acceleration = acceleration;
    }

    /**
     * Sets the maximum camera speed
     */
    setMaxSpeed(maxSpeed) {
        this.camera.maxSpeed = maxSpeed;
    }

    /**
     * Sets the camera friction
     */
    setFriction(friction) {
        this.camera.friction = friction;
    }

    /**
     * Draws the background with camera offset
     */
    drawBackground() {
        if (this.game.bossRoomSystem.inBossRoom) {
            this.game.bossRoomSystem.drawBossBackground();
            return;
        }
        this.drawLayeredBackground();
    }

    /**
     * Draws the background with individual layer images
     */
    drawLayeredBackground() {
        const bgWidth = this.camera.width; 
        const bgHeight = this.camera.height;
        const drawOrder = [0, 1, 8, 2, 3, 4, 5, 6, 7];
        
        this.setupBackgroundRendering();
        const backgroundRange = this.calculateBackgroundRange(bgWidth);
        const moonFloatY = this.getMoonFloatY();
        
        this.drawBackgroundLayers(drawOrder, bgWidth, bgHeight, backgroundRange, moonFloatY);
    }

    /**
     * Sets up background rendering settings
     */
    setupBackgroundRendering() {
        this.game.ctx.imageSmoothingEnabled = true;
        this.game.ctx.imageSmoothingQuality = 'high';
    }

    /**
     * Calculates start and end position for seamless repetition
     */
    calculateBackgroundRange(bgWidth) {
        const startX = Math.floor(this.camera.x / bgWidth) * bgWidth;
        const endX = startX + bgWidth * 4;
        return { startX, endX };
    }

    /**
     * Calculates moon float value
     */
    getMoonFloatY() {
        const moonFloat = (this.game.moonSystem ? this.game.moonSystem.moonFloat : 0);
        return Math.sin(moonFloat) * 8;
    }

    /**
     * Draws all background layers
     */
    drawBackgroundLayers(drawOrder, bgWidth, bgHeight, backgroundRange, moonFloatY) {
        for (let i = 0; i < drawOrder.length; i++) {
            const layerIndex = drawOrder[i];
            const layerImage = this.game.loadedImages.get(`models/img/background/PNG/3_game_background/layers/${layerIndex + 1}.png`);
            
            if (!layerImage) continue;
            
            this.drawSingleLayer(layerIndex, layerImage, bgWidth, bgHeight, backgroundRange, moonFloatY);
        }
    }

    /**
     * Draws a single layer
     */
    drawSingleLayer(layerIndex, layerImage, bgWidth, bgHeight, backgroundRange, moonFloatY) {
        if (layerIndex === 8) {
            this.game.ctx.save();
            this.setupMoonGlow();
        }
        this.drawLayerInstances(layerIndex, layerImage, bgWidth, bgHeight, backgroundRange, moonFloatY);
        if (layerIndex === 8) {
            this.game.ctx.restore();
        }
    }

    /**
     * Sets up moon glow effect
     */
    setupMoonGlow() {
        this.game.ctx.shadowColor = '#4a90e2';
        this.game.ctx.shadowBlur = 20;
        this.game.ctx.shadowOffsetX = 0; this.game.ctx.shadowOffsetY = 0;
    }

    /**
     * Draws layer instances for visible areas
     */
    drawLayerInstances(layerIndex, layerImage, bgWidth, bgHeight, backgroundRange, moonFloatY) {
        for (let x = backgroundRange.startX; x < backgroundRange.endX; x += bgWidth) {
            const screenX = x - this.camera.x;
            if (screenX + bgWidth > 0 && screenX < this.camera.width) {
                const exactX = Math.floor(screenX);
                const drawY = layerIndex === 8 ? moonFloatY : 0;
                this.game.ctx.drawImage(layerImage, exactX, drawY, bgWidth, bgHeight);
            }
        }
    }

    /**
     * Draws a rectangle with rounded corners
     */
    drawRoundedRect(x, y, width, height, radius) {
        this.game.ctx.beginPath();
        this.game.ctx.moveTo(x + radius, y);
        this.game.ctx.lineTo(x + width - radius, y);
        this.game.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.game.ctx.lineTo(x + width, y + height - radius);
        this.game.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.game.ctx.lineTo(x + radius, y + height);
        this.game.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.game.ctx.lineTo(x, y + radius);
        this.game.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.game.ctx.closePath();
    }

    /**
     * Draws the pause screen
     */
    drawPauseScreen() {
        this.drawPauseOverlay();
        this.drawPauseText();
        this.drawPauseButton();
        this.resetTextSettings();
    }

    /**
     * Draws semi-transparent overlay
     */
    drawPauseOverlay() {
        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.game.ctx.fillRect(0, 0, this.camera.width, this.camera.height);
    }

    /**
     * Draws pause text with shadow
     */
    drawPauseText() {
        this.setupPauseTextStyle();
        this.drawPauseTitle();
        this.drawPauseInstruction();
    }

    /**
     * Sets up text style for pause text
     */
    setupPauseTextStyle() {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 48px Cossette Texte';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'middle';
    }

    /**
     * Draws "Game Paused" title
     */
    drawPauseTitle() {
        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.game.ctx.fillText('Game Paused', this.camera.width / 2 + 3, this.camera.height / 2 + 3);
        
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.fillText('Game Paused', this.camera.width / 2, this.camera.height / 2);
    }

    /**
     * Draws instruction text
     */
    drawPauseInstruction() {
        this.game.ctx.font = '24px Raleway';
        this.game.ctx.fillStyle = '#cccccc';
        this.game.ctx.fillText('Press ESC to continue', this.camera.width / 2, this.camera.height / 2 + 60);
    }

    /**
     * Draws Back to Main Menu button
     */
    drawPauseButton() {
        const buttonY = this.camera.height / 2 + 120;
        const buttonWidth = 250; const buttonHeight = 50;
        const buttonX = this.camera.width / 2 - buttonWidth / 2;
        
        this.drawButtonBackground(buttonX, buttonY, buttonWidth, buttonHeight);
        this.drawButtonBorder(buttonX, buttonY, buttonWidth, buttonHeight);
        this.drawButtonText(buttonX, buttonY, buttonWidth, buttonHeight);
    }

    /**
     * Draws button background
     */
    drawButtonBackground(buttonX, buttonY, buttonWidth, buttonHeight) {
        this.game.ctx.fillStyle = 'rgba(42, 74, 107, 0.8)';
        this.game.ctx.fillRect(buttonX, buttonY - buttonHeight/2, buttonWidth, buttonHeight);
    }

    /**
     * Draws button border
     */
    drawButtonBorder(buttonX, buttonY, buttonWidth, buttonHeight) {
        this.game.ctx.strokeStyle = '#4a90e2';
        this.game.ctx.lineWidth = 2;
        this.game.ctx.strokeRect(buttonX, buttonY - buttonHeight/2, buttonWidth, buttonHeight);
    }

    /**
     * Draws button text with shadow
     */
    drawButtonText(buttonX, buttonY, buttonWidth, buttonHeight) {
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = 'bold 18px Raleway';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.textBaseline = 'middle';
        
        this.game.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.game.ctx.shadowBlur = 4;
        this.game.ctx.shadowOffsetX = 2; this.game.ctx.shadowOffsetY = 2;
        
        this.game.ctx.fillText('Back to Main Menu', this.camera.width / 2, buttonY);
    }

    /**
     * Resets text settings
     */
    resetTextSettings() {
        this.game.ctx.shadowColor = 'transparent';
        this.game.ctx.shadowBlur = 0;
        this.game.ctx.shadowOffsetX = 0; this.game.ctx.shadowOffsetY = 0;
        this.game.ctx.textAlign = 'left';
        this.game.ctx.textBaseline = 'alphabetic';
    }

    /**
     * Resets the camera system
     */
    reset() {
        this.camera.x = 0; this.camera.y = 0;
        this.camera.targetX = 0; this.camera.velocityX = 0;
        this.camera.lastUpdateTime = 0;
        this.camera.deltaTime = 0;
    }
}