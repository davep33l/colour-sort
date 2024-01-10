import { Stack } from './stack.js'
import { Block } from './block.js'

/**
 * Contains the GameStacks object for creating gameStacks, updating initialisation
 * properties, and general state management and game logic.
 * 
 * Interlinked with the Stack and Block object, due to the GameStacks generating these objects
 * within the method createInitialGameStacks().
 */
export class GameStacks {
    constructor() {
        this.stacks = undefined;
        this.maxBonusBlocks = 2;
        this.firstStackId = undefined;
        this.secondStackId = undefined;
        this.moveLog = [];
    }

    createInitialGameStacks(normStack, normBlock) {

        if (typeof normStack != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof normStack} of "${normStack}" for normStack`);
        }

        if (typeof normBlock != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof normBlock} of "${normBlock}" for normBlock`);
        }

        if (normStack == null || normBlock == null) {
            throw new Error("You did not pass in the right amount of args");
        }

        const stacks = [];

        for (let i = 0; i < normStack; i++) {

            const newStack = new Stack();
            newStack.isBonusStack = false;
            newStack.stackClass = "stack";
            newStack.stackId = `stack-${i}`;
            const tempStack = [];


            for (let j = 0; j < normBlock; j++) {

                const newBlock = new Block();
                newBlock.isBonusBlock = false;
                newBlock.blockClass = "block";
                newBlock.blockId = `stack-${i}-block-${j}`;
                tempStack.push(newBlock);

            }

            newStack.blocks = tempStack;
            stacks.push(newStack);

        }

        this.stacks = stacks;
        return this;
    }

    addColoursToGameStacksBlocks(colourArray) {

        if (!Array.isArray(colourArray)) {
            throw new Error(`Incorrect data type. Needs to be an Array. You passed in a ${typeof colourArray} of "${colourArray}" for colourArray`);
        }

        let colours = [];

        for (let colour of colourArray) {
            colours.push(colour);
        }

        for (let i = 0; i < this.stacks.length; i++) {
            for (let j = 0; j < this.stacks[i].blocks.length; j++) {
                this.stacks[i].blocks[j].blockColour = colours[0];
                colours.shift();
            }
        }
        return this;

    }

    addBonusBlockToGameStacks() {

        let blocksInLastStack = this.stacks[this.stacks.length - 1].blocks.length;

        if (blocksInLastStack >= this.maxBonusBlocks && this.stacks[this.stacks.length - 1].isBonusStack == true) {
            return this;
        }

        if (this.stacks[this.stacks.length - 1].isBonusStack == false) {

            let bonusStack = new Stack();
            bonusStack.isBonusStack = true;
            bonusStack.stackClass = "stack";
            bonusStack.stackId = `stack-${this.stacks.length}`;

            let bonusBlockArray = [];
            let bonusBlock = new Block();
            bonusBlock.isBonusBlock = true;
            bonusBlock.blockClass = "block";

            bonusBlock.blockId = `stack-${this.stacks.length}-block-${bonusStack.blocks.length}`;

            bonusBlockArray.push(bonusBlock);
            bonusStack.blocks = bonusBlockArray;
            this.stacks.push(bonusStack);

        } else {

            let bonusBlock = new Block();
            bonusBlock.isBonusBlock = true;
            bonusBlock.blockClass = "block";
            bonusBlock.blockId = `stack-${this.stacks.length - 1}-block-${this.stacks[this.stacks.length - 1].blocks.length}`;

            let prevBlock = this.stacks[this.stacks.length - 1].blocks[this.stacks[this.stacks.length - 1].blocks.length - 1];
            let prevColour = prevBlock.blockColour;
            bonusBlock.blockColour = prevColour;
            prevBlock.blockColour = undefined;


            this.stacks[this.stacks.length - 1].blocks.push(bonusBlock);

        }

        return this;
    }

    getNewGameStacksState() {
        for (let i = 0; i < this.stacks.length; i++) {
            this.stacks[i].updateStackState();
        }

        let originStack = this.stacks.find(item => item.stackId === this.firstStackId);
        let destStack = this.stacks.find(item => item.stackId === this.secondStackId);
        let originBlock = originStack.blocks.find(item => item.blockId === originStack.topColourId);
        let destBlock = destStack.blocks.find(item => item.blockId === destStack.availableSpaceId);


        //moves the blocks
        if (destStack.isEmpty) {
            let moves = [[originStack.stackId, originStack.topColourId, originStack.topColour], [destStack.stackId, destStack.topColourId, destStack.availableSpaceId]];
            this.moveLog.push(moves);
            destBlock.blockColour = originBlock.blockColour;
            originBlock.blockColour = undefined;

        } else if (originStack.topColour == destStack.topColour) {
            let moves = [[originStack.stackId, originStack.topColourId, originStack.topColour], [destStack.stackId, destStack.topColourId, destStack.availableSpaceId]];
            this.moveLog.push(moves);
            destBlock.blockColour = originBlock.blockColour;
            originBlock.blockColour = undefined;
        }

        for (let i = 0; i < this.stacks.length; i++) {
            this.stacks[i].updateStackState();
        }

        this.firstStackId = undefined;
        this.secondStackId = undefined;
        return this;
    }

    hasWon() {

        let hasWonArray = [];

        for (let i = 0; i < this.stacks.length; i++) {
            const stack = this.stacks[i];
            if (stack.isBonusStack == false && stack.isFilledWithSameColour == true) {
                hasWonArray.push(true);
            }
        }

        let countOfNoneBonusStacks = 0;

        for (let i = 0; i < this.stacks.length; i++) {
            if (this.stacks[i].isBonusStack == false) {
                countOfNoneBonusStacks++;
            }
        }


        if (hasWonArray.length == countOfNoneBonusStacks) {
            return true;
        }

        return false;
    }

    undoMove() {

        if (this.moveLog.length == 0) {
            return this;
        }

        let lastMove = this.moveLog.pop();

        let originStackId = lastMove[0][0];
        let originStackTopColourId = lastMove[0][1];
        let originStackTopColour = lastMove[0][2];
        let destStackId = lastMove[1][0];
        let destAvailableSpaceId = lastMove[1][2];

        let originStack = this.stacks.find(item => item.stackId === originStackId);
        let destStack = this.stacks.find(item => item.stackId === destStackId);

        let originBlock = originStack.blocks.find(item => item.blockId === originStackTopColourId);
        let destBlock = destStack.blocks.find(item => item.blockId === destAvailableSpaceId);

        destBlock.blockColour = undefined;
        originBlock.blockColour = originStackTopColour;

        return this;
    }

    resetLevel() {

        for (let i = this.moveLog.length; i > 0; i--) {
            this.undoMove();
        }

        // removes any bonus stacks from the gameStacks array
        for (let i = 0; i < this.stacks.length; i++) {
            if (this.stacks[i].isBonusStack == true) {
                this.stacks.pop(this.stacks[i]);
            }
        }

        return this;

    }
}