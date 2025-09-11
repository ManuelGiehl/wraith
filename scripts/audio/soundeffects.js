/**
 * Sound Effects System - Manages all sound effects and their playback
 * @class
 */
class SoundEffectsSystem {
    /**
     * Creates an instance of SoundEffectsSystem
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
        this.soundEffects = new Map();
        this.sfxVolume = 0.4;
        this.muted = false;
        this.initializeSoundEffects();
    }
    
    /**
     * Initializes all sound effects
     * @public
     */
    initializeSoundEffects() {
        this.loadSoundEffects();
        this.preloadSoundEffects();
    }

    /**
     * Loads all sound effect files
     * @private
     */
    loadSoundEffects() {
        this.soundEffects.set('click', new Audio('sounds/click.mp3'));
        this.soundEffects.set('moonimpact', new Audio('sounds/moonimpact.mp3'));
        this.soundEffects.set('ultimatelightning', new Audio('sounds/ultimatelightning.mp3'));
        this.soundEffects.set('boss_fire', new Audio('sounds/boss/boss_fire.mp3'));
        this.soundEffects.set('wraith_hurt', new Audio('sounds/wraith/wraith_hurt.mp3'));
        this.soundEffects.set('wraith_jump', new Audio('sounds/wraith/wraith_jump.mp3'));
        this.soundEffects.set('potion_pickup', new Audio('sounds/wraith/potion_pickup.mp3'));
        this.soundEffects.set('gameover', new Audio('sounds/gameover/gameover.mp3'));
        this.soundEffects.set('boss_death', new Audio('sounds/boss/boss_death.mp3'));
    }

    /**
     * Preloads sound effects for better performance
     * @private
     */
    preloadSoundEffects() {
        this.soundEffects.forEach(sound => {
            sound.preload = 'auto';
        });
    }
    
    /**
     * Plays a sound effect
     * @public
     * @param {string} soundName - Name of the sound effect to play
     */
    playSound(soundName) {
        if (this.muted) return;
        
        const sound = this.soundEffects.get(soundName);
        if (sound) {
            this.setSoundVolume(sound, soundName);
            this.playSoundEffect(sound);
        }
    }

    /**
     * Sets volume for a specific sound
     * @private
     * @param {HTMLAudioElement} sound - The sound element
     * @param {string} soundName - Name of the sound effect
     */
    setSoundVolume(sound, soundName) {
        const volume = typeof this.sfxVolume === 'number' && !isNaN(this.sfxVolume) && isFinite(this.sfxVolume) 
            ? this.sfxVolume 
            : 0.4;
        
        if (soundName === 'click') {
            sound.volume = volume * 0.3;
        } else if (soundName === 'ultimatelightning') {
            sound.volume = volume * 0.4;
        } else {
            sound.volume = volume;
        }
    }

    /**
     * Plays the sound effect
     * @private
     * @param {HTMLAudioElement} sound - The sound element
     */
    playSoundEffect(sound) {
        sound.currentTime = 0;
        sound.play().catch(e => {
        });
    }
    
    /**
     * Sets the sound effects volume
     * @public
     * @param {number} volume - Volume level (0-1)
     */
    setVolume(volume) {
        if (typeof volume !== 'number' || isNaN(volume) || !isFinite(volume)) {
            console.warn('Invalid volume value provided to SoundEffectsSystem:', volume);
            volume = 0.4;
        }
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * Mutes or unmutes sound effects
     * @public
     * @param {boolean} muted - Whether sound effects should be muted
     */
    setMuted(muted) {
        this.muted = muted;
    }

    /**
     * Plays a sound effect with custom volume multiplier and mute check
     * @public
     * @param {string} soundName - Name of the sound effect to play
     * @param {number} volumeMultiplier - Volume multiplier (0-1)
     */
    playSoundWithVolume(soundName, volumeMultiplier = 1.0) {
        if (this.muted) return;
        
        const sound = this.soundEffects.get(soundName);
        if (sound) {
            const baseVolume = typeof this.sfxVolume === 'number' && !isNaN(this.sfxVolume) && isFinite(this.sfxVolume) 
                ? this.sfxVolume 
                : 0.4; 
            
            let finalVolume = baseVolume;
            if (soundName === 'click') {
                finalVolume = baseVolume * 0.3;
            } else if (soundName === 'ultimatelightning') {
                finalVolume = baseVolume * 0.4; 
            }
            
            finalVolume *= volumeMultiplier;
            sound.volume = finalVolume;
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }
    }
    
    /**
     * Loads sound effects settings from local storage
     * @public
     */
    loadSettings() {
        this.loadVolumeSettings();
        this.loadMuteSettings();
    }

    /**
     * Loads volume settings from local storage
     * @private
     */
    loadVolumeSettings() {
        const savedSfxVolume = localStorage.getItem('wraith_sfx_volume');
        if (savedSfxVolume !== null) {
            this.sfxVolume = parseFloat(savedSfxVolume);
        }
    }

    /**
     * Loads mute settings from local storage
     * @private
     */
    loadMuteSettings() {
        const savedMuted = localStorage.getItem('wraith_audio_muted');
        if (savedMuted !== null) {
            this.muted = savedMuted === 'true';
        }
    }
    
    /**
     * Saves sound effects settings to local storage
     * @public
     */
    saveSettings() {
        localStorage.setItem('wraith_sfx_volume', this.sfxVolume.toString());
        localStorage.setItem('wraith_audio_muted', this.muted.toString());
    }
    
    /**
     * Updates the sound effects system
     * @public
     */
    update() {}
}
