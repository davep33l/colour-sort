/**
 * Basic object to hold the required properties of a block, the 
 * Stack class checks these properties to define the Stack state throughout
 * the game play. 
 */
export class Block {
    constructor() {
        this.blockClass = undefined;
        this.blockId = undefined;
        this.blockColour = undefined;
        this.isBonusBlock = false;
    }
}

