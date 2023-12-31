/**
 * Main class used to initialise the game, with startGame. 
 * It handles the adding and handling of any event listeners and 
 * the method to draw the gameStacks to the DOM. 
 */
class GameManager {
    constructor() {

        this.gameSettings = new GameSettings();
        this.gameTitle = new GameTitle();

        this.levelManager = new LevelManager();
        this.currentLevel = 1;

        this.colourInitialiser = new ColourInitialiser();
        this.initialColourArray = [];

        this.gameStacks = undefined;

        this.domStackSection = document.getElementById('stack-section');
        this.levelText = document.getElementById('level-section__level');
        this.howToModal = document.getElementById('how-to-modal');

        this.undoButton = document.getElementById('undo-button');
        this.resetButton = document.getElementById('reset-button');
        this.addBlockButton = document.getElementById('add-block-button');
        this.howToButton = document.getElementById('how-to-button');
        this.closeHowToButton = document.getElementById('close-button');

        this.undoButton.addEventListener('click', (event) => this.undoMove(event));
        this.resetButton.addEventListener('click', (event) => this.resetLevel(event));
        this.addBlockButton.addEventListener('click', (event) => this.addBlock(event));
        this.howToButton.addEventListener('click', (event) => this.eventHandlerOpenHowToPlay(event));
        this.closeHowToButton.addEventListener('click', (event) => this.eventHandlerCloseHowToPlay(event));

    }

    startGame() {

        if (localStorage.getItem("level") !== null) {
            this.currentLevel = parseInt(localStorage.getItem("level"));
        }

        this.gameTitle.clearTitle();
        this.gameTitle.createTitle();
        this.updateLevelText();
        const startingStackAmountForLevel = this.levelManager.getStartingStackAmtForLevel(this.currentLevel, this.gameSettings.stackAmt);
        this.initialColourArray = this.colourInitialiser.setInGameColours(startingStackAmountForLevel, this.gameSettings.blockAmt, this.gameSettings.emptyStackAmt);
        this.gameStacks = new GameStacks().createInitialGameStacks(startingStackAmountForLevel, this.gameSettings.blockAmt).addColoursToGameStacksBlocks(this.initialColourArray);
        this.drawGameStacksToDom();
        this.addEventListenersStackArea();

    }

    drawGameStacksToDom() {

        for (let i = 0; i < this.gameStacks.stacks.length; i++) {
            let stackForDOM = document.createElement('div');

            stackForDOM.id = this.gameStacks.stacks[i].stackId;
            stackForDOM.classList.add(this.gameStacks.stacks[i].stackClass);

            for (let j = 0; j < this.gameStacks.stacks[i].blocks.length; j++) {
                let blockForDOM = document.createElement('div');

                let newBlockInnerSpan = document.createElement('span');
                newBlockInnerSpan.id = `${this.gameStacks.stacks[i].blocks[j].blockId}-text`;
                blockForDOM.appendChild(newBlockInnerSpan);

                // adds a concatenation of the parent stack id and the block id as the html id
                blockForDOM.id = this.gameStacks.stacks[i].blocks[j].blockId;
                blockForDOM.classList.add(this.gameStacks.stacks[i].blocks[j].blockClass);
                blockForDOM.style.backgroundColor = this.gameStacks.stacks[i].blocks[j].blockColour;
                stackForDOM.appendChild(blockForDOM);

            }
            this.domStackSection.append(stackForDOM);
        }

    }

    addEventListenersStackArea() {

        let className = this.gameStacks.stacks[0].stackClass;

        for (let i = 0; i < this.gameStacks.stacks.length; i++) {
            this.domStackSection.getElementsByClassName(className)[i].addEventListener('click', (event) => this.handleGameClicks(event));
        }
    }

    handleGameClicks(event) {

        for (let i = 0; i < this.gameStacks.stacks.length; i++) {
            this.gameStacks.stacks[i].updateStackState();
        }

        let stackNode = event.currentTarget;
        let stackId = stackNode.id;
        let obj = this.gameStacks.stacks.find(item => item.stackId === stackId);

        if (this.gameStacks.firstStackId == undefined) {
            if (!obj.isEmpty) {
                this.gameStacks.firstStackId = stackId;
                document.getElementById(this.gameStacks.firstStackId).style.border = "2px solid white";
            }
        } else {
            if (obj.isFilled || stackId == this.gameStacks.firstStackId) {
                document.getElementById(this.gameStacks.firstStackId).style.border = "";
                this.gameStacks.firstStackId = undefined;
                this.gameStacks.secondStackId = undefined;
                return;
            } else {
                document.getElementById(this.gameStacks.firstStackId).style.border = "";
                this.gameStacks.secondStackId = stackId;
                this.gameStacks = this.gameStacks.getNewGameStacksState();

                if (this.gameStacks.hasWon()) {
                    this.currentLevel++;
                    this.saveProgressToBrowser();
                    this.startGame();
                }

                this.clearGameStacks();
                this.drawGameStacksToDom();
                this.addEventListenersStackArea();
            }
        }
    }

    clearGameStacks() {
        while (this.domStackSection.hasChildNodes()) {
            this.domStackSection.removeChild(this.domStackSection.firstChild);
        }
    }

    saveProgressToBrowser() {
        localStorage.setItem("level", this.currentLevel);
    }

    updateLevelText() {
        this.levelText.textContent = `Level ${this.currentLevel}`;
    }

    addBlock() {
        this.gameStacks = this.gameStacks.addBonusBlockToGameStacks();
        this.clearGameStacks();
        this.drawGameStacksToDom();
        this.addEventListenersStackArea();
    }

    undoMove() {
        this.gameStacks = this.gameStacks.undoMove();
        this.clearGameStacks();
        this.drawGameStacksToDom();
        this.addEventListenersStackArea();
    }

    resetLevel() {
        this.gameStacks = this.gameStacks.resetLevel();
        this.clearGameStacks();
        this.drawGameStacksToDom();
        this.addEventListenersStackArea();
    }

    eventHandlerOpenHowToPlay() {
        this.howToModal.style.display = "block";
    }

    eventHandlerCloseHowToPlay() {
        this.howToModal.style.display = "none";
    }
}

/**
 * Settings class which stores the minimum values for the stacks, blocks
 * and empty stacks. 
 * Needs to be called within the GameManager.
 */
class GameSettings {
    constructor() {
        this.stackAmt = 4;
        this.blockAmt = 4;
        this.emptyStackAmt = 2;
    }
}

/**
 * Class to define the starting stack amount per game.
 * Needs to be called within the GameManager
 */
class LevelManager {
    constructor() {
        // this.levelIncrements = [2, 3, 4, 5, 6, 7, 8, 9, 10];
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

/**
 * Contains the animation of the game title.
 * Needs to be called within the GameManager
 */
class GameTitle {
    constructor() {
        this.heading = document.getElementById('heading');

        this.colours = [
            "blue",
            "orange",
            "maroon",
            "magenta",
            "cyan",
            "olive",
            "red",
            "green",
            "yellow",
            "yellow",
            "yellow",
        ];

        this.title = "Colour Sort";
    }

    clearTitle() {
        while (this.heading.hasChildNodes()) {
            this.heading.removeChild(this.heading.firstChild);
        }
    }

    createTitle() {
        for (let i = 0; i < this.title.length; i++) {
            let letter = document.createElement('span');
            letter.innerText = this.title[i];
            this.heading.appendChild(letter);
        }

        this.giveTitleRandomColour();
    }

    async giveTitleRandomColour() {

        for (let i = 0; i < this.heading.children.length; i++) {
            let randomNumber = Math.floor(Math.random() * (this.colours.length));
            this.heading.children[i].className = this.colours[randomNumber];
            await sleep(75);
        }


        function sleep(ms) {

            if (typeof ms != "number") {
                throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof ms} of "${ms}" for ms`);
            }

            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
}

/**
 * Takes in the amount of stacks, blocks and empty stacks and returns
 * an array of colours. 
 * Example: 
 * 6 stacks, 4 blocks, 2 empty stacks would return;
 * 
 * Need 4 filled stacks of colours (from 6 stacks - 2 empty stacks)
 * Need 4 of each colour (from the 4 blocks param)
 * Need 2 empty stacks (so 4 filled stacks + 2 empty stacks = 6 total stacks)
 * 
 * It then randomises the colours making sure the empty stacks are at the end.
 * returnArray =    ["colour1", "colour2","colour2","colour3",
 *                   "colour2", "colour1", "colour4","colour4",
 *                   "colour4", "colour3","colour3", "colour2",
 *                   "colour1", "colour1", "colour4", "colour3",
 *                    undefined, undefined, undefined, undefined,
 *                    undefined, undefined, undefined, undefined]
 */
class ColourInitialiser {
    constructor() {
        this.BASE_COLOURS = [
            '#e6194B', // Red
            '#3cb44b', // Green
            '#4363d8', // Blue
            '#ffe119', // Yellow
            '#f58231', // Orange
            '#911eb4', // Purple
            '#42d4f4', // Cyan
            '#f032e6', // Magenta
            '#800000', // Maroon
            '#a9a9a9', // Grey
        ];
    }

    setInGameColours(normStack, normBlock, emptyStack) {

        if (typeof normStack != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof normStack} of "${normStack}" for normStack`);
        }

        if (typeof normBlock != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof normBlock} of "${normBlock}" for normBlock`);
        }

        if (typeof emptyStack != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof emptyStack} of "${emptyStack}" for emptyStack`);
        }

        let coloursRequired = 0;
        coloursRequired = (normStack - emptyStack) * normBlock;
        let tempArray1 = [];
        for (let i = 0; i < normStack - emptyStack; i++) {
            for (let j = 0; j < normBlock; j++) {
                tempArray1.push(this.BASE_COLOURS[i]);
            }
        }

        let tempArray2 = [];
        for (let i = 0; i < coloursRequired; i++) {
            let multiplier = 0;
            multiplier = tempArray1.length;
            let randomNumber = 0;
            randomNumber = Math.floor(Math.random() * multiplier);
            tempArray2.push(tempArray1[randomNumber]);
            tempArray1.splice(randomNumber, 1);
        }

        for (let i = 0; i < normStack - emptyStack; i++) {
            for (let j = 0; j < normBlock; j++) {
                tempArray2.push(undefined);
            }
        }

        return tempArray2;
    }
}

/**
 * Contains the GameStacks object for creating gameStacks, updating initialisation
 * properties, and general state management and game logic.
 * 
 * Interlinked with the Stack and Block object, due to the GameStacks generating these objects
 * within the method createInitialGameStacks().
 */
class GameStacks {
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

        let moves = [[originStack.stackId, originStack.topColourId, originStack.topColour], [destStack.stackId, destStack.topColourId, destStack.availableSpaceId]];
        this.moveLog.push(moves);

        //moves the blocks
        if (destStack.isEmpty) {
            destBlock.blockColour = originBlock.blockColour;
            originBlock.blockColour = undefined;

        } else if (originStack.topColour == destStack.topColour) {
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

/**
 * Class to set the state of the stacks, and hold the properties of the 
 * class and ID used for targetting the HTML, and the blocks array. 
 */
class Stack {
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

/**
 * Basic object to hold the required properties of a block, the 
 * Stack class checks these properties to define the Stack state throughout
 * the game play. 
 */
class Block {
    constructor() {
        this.blockClass = undefined;
        this.blockId = undefined;
        this.blockColour = undefined;
        this.isBonusBlock = false;
    }
}

window.onload = new GameManager().startGame();
