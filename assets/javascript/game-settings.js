/**
 * Settings class which stores the minimum values for the stacks, blocks
 * and empty stacks. 
 * Needs to be called within the GameManager.
 */
export class GameSettings {
    constructor() {
        this.stackAmt = 4;
        this.blockAmt = 4;
        this.emptyStackAmt = 2;
    }
}