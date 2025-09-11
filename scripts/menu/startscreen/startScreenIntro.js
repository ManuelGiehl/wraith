/**
 * Start Screen Intro - Manages intro animation and layer effects
 * @class
 */
class StartScreenIntro {
    /**
     * Creates an instance of StartScreenIntro
     * @param {StartScreenSystem} startScreen - The main start screen system
     * @constructor
     */
    constructor(startScreen) {
        this.startScreen = startScreen;
    }

    /**
     * Updates the intro animation
     * @public
     */
    updateIntro() {
        this.startScreen.introTimer++;
        
        if (this.startScreen.introPhase === 'black') {
            this.updateBlackPhase();
        } else if (this.startScreen.introPhase === 'layers') {
            this.updateLayersPhase();
        } else if (this.startScreen.introPhase === 'title') {
            this.updateTitlePhase();
        } else if (this.startScreen.introPhase === 'menu') {
            this.updateMenuPhase();
        }
    }

    /**
     * Updates the black phase
     * @private
     */
    updateBlackPhase() {
        if (this.startScreen.introTimer >= 60) {
            this.startScreen.introPhase = 'layers';
            this.startScreen.introTimer = 0;
            
            if (this.startScreen.game.backgroundMusicSystem) {
                this.startScreen.game.backgroundMusicSystem.play();
            }
        }
    }

    /**
     * Updates the layers phase
     * @private
     */
    updateLayersPhase() {
        if (this.startScreen.introTimer >= 15 && this.startScreen.layerIndex < 9) {
            this.startScreen.layerIndex++;
            if (this.startScreen.layerIndex === 8) this.startScreen.layerIndex = 9;
            this.startScreen.introTimer = 0;
        }
        
        this.updateLayerAnimations();
        
        if (this.startScreen.layerIndex >= 9 && this.startScreen.introTimer >= 20) {
            this.startScreen.introPhase = 'title';
            this.startScreen.introTimer = 0;
            this.startScreen.moonIntroPhase = 'flying';
            this.startScreen.moonIntroTimer = 0;
        }
    }

    /**
     * Updates layer animations
     * @private
     */
    updateLayerAnimations() {
        for (let i = 0; i < 9; i++) {
            if (i < this.startScreen.layerIndex) {
                this.updateActiveLayer(i);
            } else if (i === this.startScreen.layerIndex) {
                this.updateTransitionLayer(i);
            } else if (i === 8) {
                this.startScreen.layerAlphas[i] = 0;
            }
        }
    }

    /**
     * Updates an active layer
     * @private
     * @param {number} i - Layer index
     */
    updateActiveLayer(i) {
        this.startScreen.layerAlphas[i] = i === 8 ? 0 : 1;
        this.startScreen.layerPositions[i] = { x: 0, y: 0 };
        
        if (i >= 6 && this.startScreen.screenShake > 0) {
            this.startScreen.gravestoneWobble += 0.3;
            this.startScreen.layerRotations[i] = Math.sin(this.startScreen.gravestoneWobble) * 0.08;
        } else if (i >= 6) {
            this.startScreen.layerRotations[i] = 0;
        }
        
        if (i === 8 && this.startScreen.moonIntroPhase === 'floating') {
            this.startScreen.moonFloat += 0.03;
            this.startScreen.layerPositions[i].y = Math.sin(this.startScreen.moonFloat) * 8;
        }
    }

    /**
     * Updates a transition layer
     * @private
     * @param {number} i - Layer index
     */
    updateTransitionLayer(i) {
        const progress = this.startScreen.introTimer / 15;
        this.startScreen.layerAlphas[i] = i === 8 ? 0 : Math.min(1, progress);
        
        if (i < 3) {
            this.startScreen.layerPositions[i].y = this.startScreen.game.height * (1 - progress);
        } else if (i !== 8) {
            this.startScreen.layerPositions[i].y = -this.startScreen.game.height * (1 - progress);
        }
    }

    /**
     * Updates the title phase
     * @private
     */
    updateTitlePhase() {
        this.startScreen.titleAlpha = Math.min(1, this.startScreen.titleAlpha + 0.05);
        
        if (this.startScreen.isFirstTime && this.startScreen.moonIntroPhase === 'flying') {
            this.updateMoonFlyingAnimation();
        } else if (this.startScreen.moonIntroPhase === 'floating') {
            this.updateMoonFloatingAnimation();
        }
        
        this.updateScreenShake();
        
        if (this.startScreen.titleAlpha >= 1 && this.startScreen.introTimer >= 60) {
            this.startScreen.introPhase = 'menu';
            this.startScreen.introTimer = 0;
        }
    }

    /**
     * Updates the menu phase
     * @private
     */
    updateMenuPhase() {
        this.startScreen.menuAlpha = Math.min(1, this.startScreen.menuAlpha + 0.05);
        
        if (this.startScreen.isFirstTime && this.startScreen.moonIntroPhase === 'flying') {
            this.updateMoonFlyingAnimation();
        } else if (this.startScreen.moonIntroPhase === 'floating') {
            this.updateMoonFloatingAnimation();
        }
        
        this.updateScreenShake();
    }

    /**
     * Updates moon flying animation
     * @private
     */
    updateMoonFlyingAnimation() {
        this.startScreen.moonIntroTimer++;
        const progress = Math.min(1, this.startScreen.moonIntroTimer / 90);
        this.startScreen.layerPositions[8].y = -this.startScreen.game.height * (1 - progress);
        this.startScreen.layerAlphas[8] = Math.min(1, progress * 2);
        
        if (progress >= 0.5 && !this.startScreen.moonImpactSoundPlayed) {
            this.playMoonImpactSound();
        }
        
        if (progress >= 1) {
            this.completeMoonFlyingAnimation();
        }
    }

    /**
     * Updates moon floating animation
     * @private
     */
    updateMoonFloatingAnimation() {
        this.startScreen.moonFloat += 0.03;
        this.startScreen.layerPositions[8].y = Math.sin(this.startScreen.moonFloat) * 8;
    }

    /**
     * Plays moon impact sound
     * @private
     */
    playMoonImpactSound() {
        this.startScreen.game.soundEffectsSystem.playSoundWithVolume('moonimpact', 0.025);
        this.startScreen.moonImpactSoundPlayed = true;
    }

    /**
     * Completes moon flying animation
     * @private
     */
    completeMoonFlyingAnimation() {
        this.startScreen.moonIntroPhase = 'floating';
        this.startScreen.moonIntroTimer = 0;
        this.startScreen.layerAlphas[8] = 1;
        this.startScreen.screenShake = 1;
        this.startScreen.screenShakeIntensity = 6;
        this.startScreen.screenShakeTimer = 0;
        this.startScreen.isFirstTime = false;
    }

    /**
     * Updates screen shake effect
     * @private
     */
    updateScreenShake() {
        if (this.startScreen.screenShake > 0) {
            this.startScreen.screenShakeTimer++;
            if (this.startScreen.screenShakeTimer >= 60) {
                this.startScreen.screenShake = 0;
                this.startScreen.screenShakeIntensity = 0;
            } else {
                this.startScreen.screenShakeIntensity = 6 * (1 - this.startScreen.screenShakeTimer / 60);
            }
        }
    }

    /**
     * Resets intro properties
     * @public
     */
    resetIntroProperties() {
        this.startScreen.introPhase = 'title';
        this.startScreen.titleAlpha = 0;
        this.startScreen.moonIntroPhase = 'floating';
        this.startScreen.moonIntroTimer = 0;
        this.startScreen.moonFloat = 0;
        this.startScreen.screenShake = 0;
        this.startScreen.screenShakeIntensity = 0;
        this.startScreen.screenShakeTimer = 0;
        this.startScreen.gravestoneWobble = 0;
    }

    /**
     * Resets layer properties
     * @public
     */
    resetLayerProperties() {
        for (let i = 0; i < 9; i++) {
            this.startScreen.layerPositions[i] = { x: 0, y: 0 };
            this.startScreen.layerAlphas[i] = 1;
            this.startScreen.layerRotations[i] = 0;
        }
    }

    /**
     * Resets moon properties
     * @public
     */
    resetMoonProperties() {
        this.startScreen.layerPositions[8].y = 0;
        this.startScreen.layerAlphas[8] = 1;
        this.startScreen.moonFloat = 0;
    }
}
