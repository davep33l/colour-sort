/**
 * Class to set the state of the stacks, and hold the properties of the 
 * class and ID used for targetting the HTML, and the blocks array. 
 */
export class Stack {
    constructor() {

        this.stackId = undefined;
        this.stackClass = undefined;
        this.blocks = [];
        this.isBonusStack = false;

        this.isEmpty = undefined;
        this.isFilled = undefined;
        this.topColourId = undefined;
        this.topColour = undefined;
        this.availableSpaceId = undefined;
        this.isFilledWithSameColour = undefined;

    }

    // consolidation of all Stack state update methods, for one simple call
    updateStackState() {
        this.isStackEmpty();
        this.isStackFilled();
        this.topColourAndId();
        this.getAvailableSpaceId();
        this.updateIsFilledWithSameColour();
    }

    isStackEmpty() {
        const colours = this.blocks.map(currentValue => currentValue.blockColour);
        this.isEmpty = colours.every((currentValue) => currentValue == undefined);
    }

    isStackFilled() {
        const colours = this.blocks.map(currentValue => currentValue.blockColour);
        this.isFilled = colours.every((currentValue) => currentValue !== undefined);
    }

    topColourAndId() {
        if (this.isEmpty) {
            this.topColourId = undefined;
            this.topColour = undefined;
        } else {
            let index = this.blocks.findIndex((element) => element.blockColour !== undefined);
            this.topColour = this.blocks[index].blockColour;
            this.topColourId = this.blocks[index].blockId;
        }
    }

    getAvailableSpaceId() {
        if (this.isFilled) {
            this.availableSpaceId = undefined;

        } else if (this.isEmpty) {
            this.availableSpaceId = this.blocks[this.blocks.length - 1].blockId;
        } else {
            let index = this.blocks.findIndex((element) => element.blockColour !== undefined);
            this.availableSpaceId = this.blocks[index - 1].blockId;
        }
    }

    updateIsFilledWithSameColour() {

        const colours = this.blocks.map(currentValue => currentValue.blockColour);
        this.isFilledWithSameColour = colours.every((currentValue) => currentValue == this.blocks[0].blockColour);
    }

}