/**
 * ImageLoader - Preloads all game images including animations, sprites, and UI elements
 * @class
 */
class ImageLoader {
    /**
     * Creates an instance of ImageLoader
     * @param {Game} game - The main game instance
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Preloads all game images by category and handles loading errors gracefully
     * @async
     * @public
     */
    async preloadImages() {
        const imagePromises = [];
        
        this.loadWraithImages(imagePromises);
        this.loadGolemImages(imagePromises);
        this.loadSpellImages(imagePromises);
        this.loadBossImages(imagePromises);
        this.loadMiscImages(imagePromises);
        
        try {
            await Promise.all(imagePromises);
        } catch (error) {
            console.warn('Some images could not be loaded:', error);
        }
    }

    /**
     * Loads basic Wraith character animations (idle, walking, hurt, blinking)
     * @param {Array<Promise>} imagePromises - Array to collect image loading promises
     * @private
     */
    loadWraithImages(imagePromises) {
        for (let i = 0; i < 12; i++) {
            const idleSrc = `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Idle/Wraith_01_Idle_${i.toString().padStart(3, '0')}.png`;
            const walkingSrc = `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Walking/Wraith_01_Moving_Forward_${i.toString().padStart(3, '0')}.png`;
            const hurtSrc = `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Hurt/Wraith_01_Hurt_${i.toString().padStart(3, '0')}.png`;
            const idleBlinkSrc = `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Idle_Blink/Wraith_01_Idle_Blinking_${i.toString().padStart(3, '0')}.png`;
            
            imagePromises.push(this.game.loadImage(idleSrc));
            imagePromises.push(this.game.loadImage(walkingSrc));
            imagePromises.push(this.game.loadImage(hurtSrc));
            imagePromises.push(this.game.loadImage(idleBlinkSrc));
        }
        
        this.loadWraithSpecialAnimations(imagePromises);
    }

    /**
     * Loads special Wraith animations (dying, casting spells, taunt/jump)
     * @param {Array<Promise>} imagePromises - Array to collect image loading promises
     * @private
     */
    loadWraithSpecialAnimations(imagePromises) {
        for (let i = 0; i < 15; i++) {
            const dyingSrc = `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Dying/Wraith_01_Dying_${i.toString().padStart(3, '0')}.png`;
            imagePromises.push(this.game.loadImage(dyingSrc));
        }
        
        for (let i = 0; i < 18; i++) {
            const castingSrc = `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Casting_Spells/Wraith_01_Casting_Spells_${i.toString().padStart(3, '0')}.png`;
            imagePromises.push(this.game.loadImage(castingSrc));
        }
        
        for (let i = 0; i < 18; i++) {
            const tauntSrc = `models/img/wraith/PNG/Wraith_01/PNG_Sequences/Taunt/Wraith_01_Taunt_${i.toString().padStart(3, '0')}.png`;
            imagePromises.push(this.game.loadImage(tauntSrc));
        }
    }

    /**
     * Loads basic Golem animations and delegates to elite and dying animations
     * @param {Array<Promise>} imagePromises - Array to collect image loading promises
     * @private
     */
    loadGolemImages(imagePromises) {
        for (let i = 0; i < 12; i++) {
            const golemIdleSrc = `models/img/golem/PNG/Golem_01/PNG_Sequences/Idle/Golem_01_Idle_${i.toString().padStart(3, '0')}.png`;
            const golemWalkingSrc = `models/img/golem/PNG/Golem_01/PNG_Sequences/Walking/Golem_01_Walking_${i.toString().padStart(3, '0')}.png`;
            const golemAttackingSrc = `models/img/golem/PNG/Golem_01/PNG_Sequences/Attacking/Golem_01_Attacking_${i.toString().padStart(3, '0')}.png`;
            const golemHurtSrc = `models/img/golem/PNG/Golem_01/PNG_Sequences/Hurt/Golem_01_Hurt_${i.toString().padStart(3, '0')}.png`;
            
            imagePromises.push(this.game.loadImage(golemIdleSrc));
            imagePromises.push(this.game.loadImage(golemWalkingSrc));
            imagePromises.push(this.game.loadImage(golemAttackingSrc));
            imagePromises.push(this.game.loadImage(golemHurtSrc));
        }
        
        this.loadEliteGolemImages(imagePromises);
        this.loadGolemDyingAnimations(imagePromises);
    }

    /**
     * Loads elite Golem animations (Golem_02 variant)
     * @param {Array<Promise>} imagePromises - Array to collect image loading promises
     * @private
     */
    loadEliteGolemImages(imagePromises) {
        for (let i = 0; i < 12; i++) {
            const eliteIdleSrc = `models/img/golem/PNG/Golem_02/PNG_Sequences/Idle/Golem_02_Idle_${i.toString().padStart(3, '0')}.png`;
            const eliteWalkingSrc = `models/img/golem/PNG/Golem_02/PNG_Sequences/Walking/Golem_02_Walking_${i.toString().padStart(3, '0')}.png`;
            const eliteAttackingSrc = `models/img/golem/PNG/Golem_02/PNG_Sequences/Attacking/Golem_02_Attacking_${i.toString().padStart(3, '0')}.png`;
            const eliteHurtSrc = `models/img/golem/PNG/Golem_02/PNG_Sequences/Hurt/Golem_02_Hurt_${i.toString().padStart(3, '0')}.png`;
            
            imagePromises.push(this.game.loadImage(eliteIdleSrc));
            imagePromises.push(this.game.loadImage(eliteWalkingSrc));
            imagePromises.push(this.game.loadImage(eliteAttackingSrc));
            imagePromises.push(this.game.loadImage(eliteHurtSrc));
        }
    }

    /**
     * Loads Golem dying animations for both regular and elite variants
     * @param {Array<Promise>} imagePromises - Array to collect image loading promises
     * @private
     */
    loadGolemDyingAnimations(imagePromises) {
        for (let i = 0; i < 15; i++) {
            const golemDyingSrc = `models/img/golem/PNG/Golem_01/PNG_Sequences/Dying/Golem_01_Dying_${i.toString().padStart(3, '0')}.png`;
            imagePromises.push(this.game.loadImage(golemDyingSrc));
        }
        
        for (let i = 0; i < 15; i++) {
            const eliteDyingSrc = `models/img/golem/PNG/Golem_02/PNG_Sequences/Dying/Golem_02_Dying_${i.toString().padStart(3, '0')}.png`;
            imagePromises.push(this.game.loadImage(eliteDyingSrc));
        }
    }

    /**
     * Loads spell effect animations including explosions and lightning
     * @param {Array<Promise>} imagePromises - Array to collect image loading promises
     * @private
     */
    loadSpellImages(imagePromises) {
        for (let i = 1; i <= 10; i++) {
            const explosionSrc = `models/img/spells/PNG/Explosion_5/Explosion_${i}.png`;
            imagePromises.push(this.game.loadImage(explosionSrc));
        }
        
        for (let i = 1; i <= 5; i++) {
            const blitzSrc = `models/img/spells/PNG/Explosion_7/1/Explosion_${i}.png`;
            imagePromises.push(this.game.loadImage(blitzSrc));
        }
    }

    /**
     * Loads boss-related images including crystal, background, and boss animations
     * @param {Array<Promise>} imagePromises - Array to collect image loading promises
     * @private
     */
    loadBossImages(imagePromises) {
        const crystalSrc = 'models/img/boss/white_crystal_light_shadow1.png';
        imagePromises.push(this.game.loadImage(crystalSrc));
        
        const bossBackgroundSrc = 'models/img/bossbackground/bossroom.png';
        imagePromises.push(this.game.loadImage(bossBackgroundSrc));
        
        this.loadBoss3Images(imagePromises);
        this.loadBossAttackParticles(imagePromises);
    }

    /**
     * Loads Boss3 character animations including idle, attack, magic, hurt, and death animations
     * @param {Array<Promise>} imagePromises - Array to collect image loading promises
     * @private
     */
    loadBoss3Images(imagePromises) {
        const boss3Images = [
            'models/img/boss/Boss3/Boss3/Idle1.png',
            'models/img/boss/Boss3/Boss3/Idle2.png',
            'models/img/boss/Boss3/Boss3/Idle3.png',
            'models/img/boss/Boss3/Boss3/Attack1.png',
            'models/img/boss/Boss3/Boss3/Attack2.png',
            'models/img/boss/Boss3/Boss3/Attack3.png',
            'models/img/boss/Boss3/Boss3/Attack4.png',
            'models/img/boss/Boss3/Boss3/Attack5.png',
            'models/img/boss/Boss3/Boss3/Attack6.png',
            'models/img/boss/Boss3/Boss3/Attack7.png',
            'models/img/boss/Boss3/Boss3/Magic_fire1.png',
            'models/img/boss/Boss3/Boss3/Magic_fire2.png',
            'models/img/boss/Boss3/Boss3/Magic_fire3.png',
            'models/img/boss/Boss3/Boss3/Magic_fire4.png',
            'models/img/boss/Boss3/Boss3/Magic_fire5.png',
            'models/img/boss/Boss3/Boss3/Hurt1.png',
            'models/img/boss/Boss3/Boss3/Hurt2.png',
            'models/img/boss/Boss3/Boss3/Death1.png',
            'models/img/boss/Boss3/Boss3/Death2.png',
            'models/img/boss/Boss3/Boss3/Death3.png',
            'models/img/boss/Boss3/Boss3/Death4.png',
            'models/img/boss/Boss3/Boss3/Death5.png',
            'models/img/boss/Boss3/Boss3/Death6.png',
            'models/img/boss/Boss3/Boss3/Magic_lightning1.png',
            'models/img/boss/Boss3/Boss3/Magic_lightning2.png',
            'models/img/boss/Boss3/Boss3/Magic_lightning3.png',
            'models/img/boss/Boss3/Boss3/Magic_lightning4.png',
            'models/img/boss/Boss3/Boss3/Magic_lightning5.png'
        ];
        boss3Images.forEach(src => imagePromises.push(this.game.loadImage(src)));
    }

    /**
     * Loads boss attack particle effects for fire and lightning attacks
     * @param {Array<Promise>} imagePromises - Array to collect image loading promises
     * @private
     */
    loadBossAttackParticles(imagePromises) {
        for (let i = 1; i <= 10; i++) {
            const fireSrc = `models/img/boss/Magic_Attacks/Magic_Attacks/fire${i}.png`;
            imagePromises.push(this.game.loadImage(fireSrc));
        }
        
        for (let i = 1; i <= 9; i++) {
            const lightningSrc = `models/img/boss/Magic_Attacks/Magic_Attacks/lightning${i}.png`;
            imagePromises.push(this.game.loadImage(lightningSrc));
        }
    }

    /**
     * Loads miscellaneous images including potions and background layers
     * @param {Array<Promise>} imagePromises - Array to collect image loading promises
     * @private
     */
    loadMiscImages(imagePromises) {
        imagePromises.push(this.game.loadImage('models/img/potion/manapotion.png'));
        
        for (let i = 1; i <= 9; i++) {
            const layerSrc = `models/img/background/PNG/3_game_background/layers/${i}.png`;
            imagePromises.push(this.game.loadImage(layerSrc));
        }
    }
}
