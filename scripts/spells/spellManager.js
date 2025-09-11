/**
 * Spell Manager - Main class that coordinates all spell-related functionality
 * @class
 */
class SpellManager {
    /**
     * Creates an instance of SpellManager
     * @param {Game} game - The main game instance
     * @constructor
     */
    constructor(game) {
        this.game = game;
        this.spells = [];
        
        this.initializeModules();
    }

    /**
     * Initializes all spell modules
     * @private
     */
    initializeModules() {
        this.spellUpdater = new SpellUpdater(this.game);
        this.spellCaster = new SpellCaster(this.game);
        this.spellRenderer = new SpellRenderer(this.game);
    }

    /**
     * Updates all spells
     * @public
     */
    updateSpells() {
        this.spells = this.spellUpdater.updateSpells(this.spells);
    }

    /**
     * Casts a normal spell
     * @public
     */
    castSpell() {
        const spellData = this.spellCaster.castSpell();
        this.spells.push(spellData);
    }

    /**
     * Casts an ultimate lightning spell
     * @public
     */
    castUltimateSpell() {
        const newSpells = this.spellCaster.castUltimateSpell();
        this.spells.push(...newSpells);
    }

    /**
     * Draws all spells
     * @public
     */
    drawSpells() {
        this.spells.forEach(spell => this.spellRenderer.drawSpell(spell));
    }

    /**
     * Resets the spell system
     * @public
     */
    reset() {
        this.spells = [];
    }

    /**
     * Gets the number of active spells
     * @public
     * @returns {number} Number of active spells
     */
    getSpellCount() {
        return this.spells.length;
    }

    /**
     * Clears all spells
     * @public
     */
    clearSpells() {
        this.spells = [];
    }

    /**
     * Adds a spell to the system
     * @public
     * @param {Object} spell - The spell to add
     */
    addSpell(spell) {
        this.spells.push(spell);
    }

    /**
     * Removes a spell from the system
     * @public
     * @param {Object} spell - The spell to remove
     */
    removeSpell(spell) {
        const index = this.spells.indexOf(spell);
        if (index > -1) {
            this.spells.splice(index, 1);
        }
    }
}
