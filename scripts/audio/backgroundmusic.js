/**
 * Background Music System for the game
 * Manages background music with loop functionality
 */
class BackgroundMusicSystem {
    constructor(game) {
        this.game = game;
        this.backgroundMusic = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.volume = 0.06; 
        this.muted = false;
        this.userHasInteracted = false; 
        this.pendingPlay = false; 
        this.autoplayBlocked = false; 
        
        this.initializeMusic();
        this.setupUserInteractionListener();
    }
    
    /**
     * Initializes the background music
     */
    initializeMusic() {
        this.backgroundMusic = new Audio('sounds/Backgroundmusic.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0; 
        this.backgroundMusic.preload = 'auto';
        
        this.backgroundMusic.addEventListener('ended', () => {
            this.restartMusic();
        });
        
        this.backgroundMusic.addEventListener('error', (e) => {
        });
    }
    
    /**
     * Sets up event listeners for user interactions
     */
    setupUserInteractionListener() {
        const events = ['click', 'keydown', 'touchstart', 'mousedown'];
        const handleUserInteraction = () => {
            if (!this.userHasInteracted) {
                this.userHasInteracted = true;
                
                if (this.pendingPlay && !this.muted) {
                    this.executePlay();
                }
                
                events.forEach(event => {
                    document.removeEventListener(event, handleUserInteraction);
                });
            }
        };
        
        events.forEach(event => {
            document.addEventListener(event, handleUserInteraction, { once: true });
        });
    }
    
    /**
     * Starts the background music
     */
    play() {
        if (this.backgroundMusic && !this.muted && !this.isPlaying) {
            this.backgroundMusic.currentTime = 0;
            
            if (this.userHasInteracted) {
                this.executePlay();
                return;
            }

            this.backgroundMusic.muted = true;
            const playPromise = this.backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlaying = true;
                    this.isPaused = false;
                    this.autoplayBlocked = false;
                    this.backgroundMusic.muted = false;
                }).catch(e => {
                    this.autoplayBlocked = true;
                    this.pendingPlay = true;
                    this.backgroundMusic.muted = false;
                });
            }
        }
    }
    
    /**
     * Executes the actual play call
     */
    executePlay() {
        if (this.backgroundMusic && !this.muted && !this.isPlaying) {
            this.backgroundMusic.currentTime = 0;
            
            const playPromise = this.backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlaying = true;
                    this.isPaused = false;
                    this.pendingPlay = false;
                    this.autoplayBlocked = false;
                }).catch(e => {
                    this.pendingPlay = false;
                });
            }
        }
    }
    
    /**
     * Pauses the background music
     */
    pause() {
        if (this.backgroundMusic && this.isPlaying) {
            this.backgroundMusic.pause();
            this.isPaused = true;
            this.isPlaying = false;
        }
    }
    
    /**
     * Resumes the background music
     */
    resume() {
        if (this.backgroundMusic && this.isPaused && !this.muted) {
            this.backgroundMusic.play().then(() => {
                this.isPlaying = true;
                this.isPaused = false;
            }).catch(e => {
            });
        }
    }
    
    /**
     * Stops the background music
     */
    stop() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.isPlaying = false;
            this.isPaused = false;
        }
    }
    
    /**
     * Restarts the music (at loop end)
     */
    restartMusic() {
        if (this.backgroundMusic && !this.muted) {
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.play().then(() => {
                this.isPlaying = true;
                this.isPaused = false;
            }).catch(e => {
            });
        }
    }
    
    /**
     * Sets the volume
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            const actualVolume = (this.volume < 0.01) ? 0 : this.volume;
            this.backgroundMusic.volume = this.muted ? 0 : actualVolume;
        }
    }
    
    /**
     * Mutes/unmutes the music
     */
    setMuted(muted) {
        this.muted = muted;
        if (this.backgroundMusic) {
            const actualVolume = (this.volume < 0.01) ? 0 : this.volume;
            this.backgroundMusic.volume = this.muted ? 0 : actualVolume;
            this.backgroundMusic.muted = this.muted;
        }
        
        if (muted && this.isPlaying) {
            this.pause();
        }
        else if (!muted) {
            if (this.isPaused) {
                this.resume();
            } else if (!this.isPlaying) {
                this.play();
            }
        }
 
        if (muted) {
            this.pendingPlay = false;
        }
    }
    
    /**
     * Checks if autoplay is blocked
     */
    isAutoplayBlocked() {
        return this.autoplayBlocked && !this.userHasInteracted;
    }
    
    /**
     * Returns a user-friendly message about the music status
     */
    getMusicStatusMessage() {
        if (this.isPlaying) {
            return "Music is playing";
        } else if (this.isAutoplayBlocked()) {
            return "Click anywhere to start the music";
        } else if (this.isPaused) {
            return "Music paused";
        } else if (this.muted) {
            return "Music muted";
        } else {
            return "Music ready";
        }
    }
    
    /**
     * Returns the current status
     */
    getStatus() {
        return {
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            volume: this.volume,
            muted: this.muted,
            userHasInteracted: this.userHasInteracted,
            pendingPlay: this.pendingPlay,
            autoplayBlocked: this.autoplayBlocked,
            statusMessage: this.getMusicStatusMessage()
        };
    }
    
    /**
     * Updates the background music system
     */
    update() {
    }
}
