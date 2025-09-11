/**
 * Audio system for the game
 * Manages background music, sound effects and audio controls
 */
class AudioSystem {
    constructor(game) {
        this.game = game;
        this.musicVolume = 0.06;
        this.sfxVolume = 0.4;
        this.muted = false;
        this.backgroundMusic = null;
        
        this.STORAGE_KEYS = {
            MUSIC_VOLUME: 'wraith_music_volume',
            SFX_VOLUME: 'wraith_sfx_volume',
            MUTED: 'wraith_audio_muted'
        };
        this.loadSettings();
        this.initializeAudioElements();
    }

    /**
     * Loads audio settings from local storage
     */
    loadSettings() {
        this.loadMusicVolume();
        this.loadSfxVolume();
        this.loadMutedState();
        this.handleMobileDevices();
        this.syncAudioSystems();
    }

    /**
     * Loads music volume from storage
     */
    loadMusicVolume() {
        const saved = localStorage.getItem(this.STORAGE_KEYS.MUSIC_VOLUME);
        this.musicVolume = saved !== null ? parseFloat(saved) : 0.06;
    }

    /**
     * Loads SFX volume from storage
     */
    loadSfxVolume() {
        const saved = localStorage.getItem(this.STORAGE_KEYS.SFX_VOLUME);
        this.sfxVolume = saved !== null ? parseFloat(saved) : 0.4;
    }

    /**
     * Loads muted state from storage
     */
    loadMutedState() {
        const saved = localStorage.getItem(this.STORAGE_KEYS.MUTED);
        this.muted = saved !== null ? saved === 'true' : false;
    }

    /**
     * Handles mobile device detection
     */
    handleMobileDevices() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                        ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (isMobile) this.muted = false;
    }

    /**
     * Syncs audio systems with current settings
     */
    syncAudioSystems() {
        if (this.game.backgroundMusicSystem) {
            this.game.backgroundMusicSystem.setVolume(this.musicVolume);
            this.game.backgroundMusicSystem.setMuted(this.muted);
            if (!this.muted) this.game.backgroundMusicSystem.play();
        }
        if (this.game.soundEffectsSystem) {
            this.game.soundEffectsSystem.setVolume(this.sfxVolume);
            this.game.soundEffectsSystem.setMuted(this.muted);
        }
    }

    /**
     * Saves audio settings to local storage
     */
    saveSettings() {
        localStorage.setItem(this.STORAGE_KEYS.MUSIC_VOLUME, this.musicVolume.toString());
        localStorage.setItem(this.STORAGE_KEYS.SFX_VOLUME, this.sfxVolume.toString());
        localStorage.setItem(this.STORAGE_KEYS.MUTED, this.muted.toString());
    }

    /**
     * Initializes audio elements
     */
    initializeAudioElements() {
        this.backgroundMusic = new Audio('sounds/Backgroundmusic.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.muted ? 0 : this.musicVolume;
        this.backgroundMusic.preload = 'auto';
    }

    /**
     * Sets music volume
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.muted ? 0 : this.musicVolume;
        }
        if (this.game.backgroundMusicSystem) {
            this.game.backgroundMusicSystem.setVolume(this.musicVolume);
        }
        this.saveSettings();
    }

    /**
     * Sets SFX volume
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.game.soundEffectsSystem) {
            this.game.soundEffectsSystem.setVolume(this.sfxVolume);
        }
        this.saveSettings();
    }

    /**
     * Toggles audio mute state
     */
    toggleMute() {
        this.muted = !this.muted;
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.muted ? 0 : this.musicVolume;
        }
        this.syncAudioSystems();
        this.saveSettings();
        return this.muted;
    }

    /**
     * Controls background music playback
     */
    playBackgroundMusic() {
        if (this.backgroundMusic && !this.muted) {
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.play().catch(() => {});
        }
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic) this.backgroundMusic.pause();
    }

    resumeBackgroundMusic() {
        if (this.backgroundMusic && !this.muted) {
            this.backgroundMusic.play().catch(() => {});
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    /**
     * Plays a sound effect
     */
    playSound(soundName) {
        if (this.game.soundEffectsSystem) {
            this.game.soundEffectsSystem.playSound(soundName);
        }
    }

    /**
     * Updates the audio system
     */
    update() {}

    /**
     * Draws audio controls (called by start screen)
     */
    drawAudioControls(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        this.drawAudioBackground(ctx, centerX, centerY);
        this.drawAudioTitle(ctx, centerX, centerY);
        this.drawAudioControlElements(ctx, centerX, centerY);
        this.drawAudioFooter(ctx, centerX, height);
    }

    /**
     * Draws audio background frame
     */
    drawAudioBackground(ctx, centerX, centerY) {
        ctx.save();
        ctx.fillStyle = 'rgba(10, 15, 25, 0.9)';
        ctx.fillRect(centerX - 350, centerY - 250, 700, 500);
        
        ctx.strokeStyle = '#2a4a6b';
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - 350, centerY - 250, 700, 500);
        
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - 348, centerY - 248, 696, 496);
    }

    /**
     * Draws audio title
     */
    drawAudioTitle(ctx, centerX, centerY) {
        ctx.shadowColor = '#4a90e2';
        ctx.shadowBlur = 10;
        this.drawCenteredText(ctx, 'AUDIO SETTINGS', centerX, centerY - 180, '36px', 'Raleway', '#ffffff', 'bold');
        ctx.shadowBlur = 0;
    }

    /**
     * Draws audio control elements
     */
    drawAudioControlElements(ctx, centerX, centerY) {
        this.drawMuteButton(ctx, centerX, centerY - 120);
        this.drawVolumeSlider(ctx, centerX, centerY - 30, 'Background Music', this.musicVolume, this.setMusicVolume.bind(this));
        this.drawVolumeSlider(ctx, centerX, centerY + 70, 'Sound Effects', this.sfxVolume, this.setSfxVolume.bind(this));
    }

    /**
     * Draws audio footer
     */
    drawAudioFooter(ctx, centerX, height) {
        ctx.shadowColor = '#4a90e2';
        ctx.shadowBlur = 5;
        this.drawCenteredText(ctx, 'ESC - Back to Main Menu', centerX, height - 50, '16px', 'Raleway', '#ffffff');
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    /**
     * Draws mute button with checkbox design
     */
    drawMuteButton(ctx, centerX, y) {
        const checkboxSize = 20;
        const textWidth = 80;
        const totalWidth = textWidth + 10 + checkboxSize;
        const startX = centerX - (totalWidth / 2);
        const checkboxX = startX + textWidth + 10;
        
        this.drawCenteredText(ctx, 'MUTE ALL', startX + (textWidth / 2), y + 5, '18px', 'Raleway', '#ffffff', 'bold');
        this.drawCheckbox(ctx, checkboxX, y, checkboxSize);
    }

    /**
     * Draws checkbox for mute button
     */
    drawCheckbox(ctx, checkboxX, y, checkboxSize) {
        ctx.fillStyle = this.muted ? '#4a90e2' : 'rgba(42, 74, 107, 0.8)';
        ctx.fillRect(checkboxX, y - 10, checkboxSize, checkboxSize);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(checkboxX, y - 10, checkboxSize, checkboxSize);
        
        if (this.muted) this.drawCheckmark(ctx, checkboxX, y);
    }

    /**
     * Draws checkmark in checkbox
     */
    drawCheckmark(ctx, checkboxX, y) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(checkboxX + 4, y - 2);
        ctx.lineTo(checkboxX + 8, y + 2);
        ctx.lineTo(checkboxX + 16, y - 6);
        ctx.stroke();
    }

    /**
     * Draws volume slider
     */
    drawVolumeSlider(ctx, centerX, y, label, volume, setVolume) {
        this.drawCenteredText(ctx, label, centerX, y - 30, '20px', 'Raleway', '#ffffff', 'bold');
        this.drawSliderBackground(ctx, centerX, y);
        this.drawSliderFill(ctx, centerX, y, volume);
        this.drawSliderHandle(ctx, centerX, y, volume);
        this.drawVolumeText(ctx, centerX, y, volume);
    }

    /**
     * Draws slider background
     */
    drawSliderBackground(ctx, centerX, y) {
        ctx.fillStyle = 'rgba(42, 74, 107, 0.6)';
        ctx.fillRect(centerX - 150, y - 15, 300, 30);
    }

    /**
     * Draws slider fill
     */
    drawSliderFill(ctx, centerX, y, volume) {
        const fillWidth = 300 * volume;
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(centerX - 150, y - 15, fillWidth, 30);
    }

    /**
     * Draws slider handle
     */
    drawSliderHandle(ctx, centerX, y, volume) {
        const fillWidth = 300 * volume;
        const handleX = centerX - 150 + fillWidth;
        ctx.fillStyle = '#a8d0ff';
        ctx.fillRect(handleX - 8, y - 20, 16, 40);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(handleX - 8, y - 20, 16, 40);
    }

    /**
     * Draws volume percentage text
     */
    drawVolumeText(ctx, centerX, y, volume) {
        this.drawCenteredText(ctx, Math.round(volume * 100) + '%', centerX + 180, y + 5, '16px', 'Raleway', '#ffffff');
    }

    /**
     * Helper method for centered text
     */
    drawCenteredText(ctx, text, x, y, fontSize = '16px', fontFamily = 'Raleway', color = '#ffffff', fontWeight = 'normal') {
        ctx.save();
        this.setupTextStyle(ctx, color, fontSize, fontFamily, fontWeight);
        this.setupTextShadow(ctx);
        ctx.fillText(text, x, y);
        this.resetTextShadow(ctx);
        ctx.restore();
    }

    /**
     * Sets up text style
     */
    setupTextStyle(ctx, color, fontSize, fontFamily, fontWeight) {
        ctx.fillStyle = color;
        ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    }

    /**
     * Sets up text shadow
     */
    setupTextShadow(ctx) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }

    /**
     * Resets text shadow
     */
    resetTextShadow(ctx) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Handles mouse clicks on audio controls
     */
    handleAudioClick(mouseX, mouseY) {
        const centerX = this.game.width / 2;
        const centerY = this.game.height / 2;
        
        if (this.checkMuteButtonClick(mouseX, mouseY, centerX, centerY - 120)) {
            this.toggleMute();
            return true;
        }
        if (this.checkSliderClick(mouseX, mouseY, centerX, centerY - 30, this.setMusicVolume.bind(this))) {
            return true;
        } 
        if (this.checkSliderClick(mouseX, mouseY, centerX, centerY + 70, this.setSfxVolume.bind(this))) {
            return true;
        }
        return false;
    }

    /**
     * Checks if mute button was clicked
     */
    checkMuteButtonClick(mouseX, mouseY, centerX, y) {
        const checkboxSize = 20;
        const textWidth = 80;
        const totalWidth = textWidth + 10 + checkboxSize;
        const startX = centerX - (totalWidth / 2);
        const checkboxX = startX + textWidth + 10; 
        return mouseX >= checkboxX && mouseX <= checkboxX + checkboxSize && 
               mouseY >= y - 10 && mouseY <= y + 10;
    }

    /**
     * Checks if volume slider was clicked
     */
    checkSliderClick(mouseX, mouseY, centerX, y, setVolume) {
        if (mouseX >= centerX - 150 && mouseX <= centerX + 150 && 
            mouseY >= y - 15 && mouseY <= y + 15) {
            const sliderStart = centerX - 150;
            const sliderEnd = centerX + 150;
            const sliderWidth = sliderEnd - sliderStart;
            const relativeX = mouseX - sliderStart;
            const volume = Math.max(0, Math.min(1, relativeX / sliderWidth));
            setVolume(volume);
            return true;
        }
        return false;
    }
}