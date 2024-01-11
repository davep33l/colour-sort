/**
 * Class to define the starting stack amount per game.
 * Needs to be called within the GameManager
 */
export class LevelManager {
    constructor() {
        this.levelIncrements = [2, 4, 6, 9, 14, 22, 33, 51, 80];
    }

    // Checks the current level against the level increments and adds
    // an additional amount of stacks, based on the index it returns true
    // on the comparison
    getStartingStackAmtForLevel(level, baseStackAmt) {

        if (typeof level != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof level} of "${level}" for level`);
        }

        if (typeof baseStackAmt != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof baseStackAmt} of "${baseStackAmt}" for baseStackAmt`);
        }

        let startingStackAmount = 0;

        for (let i = 0; i < this.levelIncrements.length; i++) {
            if (level < this.levelIncrements[i]) {
                startingStackAmount = baseStackAmt + i;
                break;
            } else {
                startingStackAmount = baseStackAmt + i;
            }
        }
        return startingStackAmount;
    }
}