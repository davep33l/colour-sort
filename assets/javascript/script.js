class GameSettings {
    constructor() {
        this.maxBonusBlocks = 4
        this.stackAmt = 4;
        this.blockAmt = 4;
        this.emptyStackAmt = 2;
    }
}

class LevelManager {
    constructor() {
        // this.levelIncrements = [2, 3, 4, 5, 6, 7, 8, 9, 10]
        this.levelIncrements = [2, 4, 6, 9, 14, 22, 33, 51, 80];
    }

    getStartingStackAmtForLevel(level, baseStackAmt) {

        if (typeof level != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof level} of "${level}" for level`)
        }

        if (typeof baseStackAmt != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof baseStackAmt} of "${baseStackAmt}" for baseStackAmt`)
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

class GameManager {
    constructor() {

        this.gameSettings = new GameSettings()
        this.gameTitle = new GameTitle()

        this.levelManager = new LevelManager();
        this.currentLevel = 1;

        this.colourInitialiser = new ColourInitialiser();
        this.initialColourArray = []

        this.gameStacks = undefined

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
        console.log("starting new game")

        if (localStorage.getItem("level") !== null) {
            this.currentLevel = parseInt(localStorage.getItem("level"));
        }

        this.gameTitle.clearTitle();
        this.gameTitle.createTitle();
        this.updateLevelText();

        const startingStackAmountForLevel = this.levelManager.getStartingStackAmtForLevel(this.currentLevel, this.gameSettings.stackAmt)

        this.initialColourArray = this.colourInitialiser.setInGameColours(startingStackAmountForLevel, this.gameSettings.blockAmt, this.gameSettings.emptyStackAmt)

        this.gameStacks = new GameStacks().createInitialGameStacks(startingStackAmountForLevel, this.gameSettings.blockAmt).addColoursToGameStacksBlocks(this.initialColourArray)

        console.log(this.gameStacks)

        this.drawGameStacksToDom();
        this.addEventListenersStackArea();

        console.log(this)

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

        let className = this.gameStacks.stacks[0].stackClass

        for (let i = 0; i < this.gameStacks.stacks.length; i++) {
            this.domStackSection.getElementsByClassName(className)[i].addEventListener('click', (event) => this.handleGameClicks(event));
        }
    }

    handleGameClicks(event) {
        console.log("click received")

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
                this.gameStacks.secondStackId = stackId
                this.gameStacks = this.gameStacks.getNewGameStacksState();

                if (this.gameStacks.hasWon()) {
                    console.log("you have won")
                    this.currentLevel++;
                    this.startGame()
                }

                this.clearGameStacks();
                this.drawGameStacksToDom();
                this.addEventListenersStackArea();
            }
        }

        console.log(this)
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
        this.gameStacks = this.gameStacks.addBonusBlockToGameStacks()
        this.clearGameStacks()
        this.drawGameStacksToDom()
        this.addEventListenersStackArea()
    }

    undoMove() {
        this.gameStacks = this.gameStacks.undoMove();
        this.clearGameStacks();
        this.drawGameStacksToDom();
        this.addEventListenersStackArea();
    }

    resetLevel() {
        console.log("resetting level")
        this.gameStacks = this.gameStacks.resetLevel()
        this.clearGameStacks();
        this.drawGameStacksToDom();
        this.addEventListenersStackArea();
    }

    eventHandlerOpenHowToPlay() {
        console.log("adding modal");
        this.howToModal.style.display = "block";
    }

    eventHandlerCloseHowToPlay() {
        this.howToModal.style.display = "none";
    }
}

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
        ]

        this.title = "Colour Sort"
    }

    clearTitle() {
        while (this.heading.hasChildNodes()) {
            this.heading.removeChild(this.heading.firstChild);
        }
    }

    createTitle() {
        for (let i = 0; i < this.title.length; i++) {
            let letter = document.createElement('span')
            letter.innerText = this.title[i]
            this.heading.appendChild(letter)
        }

        this.giveTitleRandomColour();
    }

    async giveTitleRandomColour() {

        for (let i = 0; i < this.heading.children.length; i++) {
            let randomNumber = Math.floor(Math.random() * (this.colours.length));
            this.heading.children[i].className = this.colours[randomNumber]
            await sleep(75)
        }


        function sleep(ms) {

            if (typeof ms != "number") {
                throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof ms} of "${ms}" for ms`)
            }

            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
}

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
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof normStack} of "${normStack}" for normStack`)
        }

        if (typeof normBlock != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof normBlock} of "${normBlock}" for normBlock`)
        }

        if (typeof emptyStack != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof emptyStack} of "${emptyStack}" for emptyStack`)
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

class GameStacks {
    constructor() {
        this.stacks = undefined;
        this.maxBonusBlocks = 2
        this.firstStackId = undefined
        this.secondStackId = undefined
        this.moveLog = []
    }

    createInitialGameStacks(normStack, normBlock) {

        if (typeof normStack != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof normStack} of "${normStack}" for normStack`)
        }

        if (typeof normBlock != "number") {
            throw new Error(`Incorrect data type. Needs to be a number. You passed in a ${typeof normBlock} of "${normBlock}" for normBlock`)
        }


        if (normStack == null || normBlock == null) {
            throw new Error("You did not pass in the right amount of args")
        }

        const stacks = [];

        for (let i = 0; i < normStack; i++) {

            const newStack = new Stack();
            newStack.isBonusStack = false;
            newStack.stackClass = "stack"
            newStack.stackId = `stack-${i}`
            const tempStack = [];


            for (let j = 0; j < normBlock; j++) {

                const newBlock = new Block();
                newBlock.isBonusBlock = false;
                newBlock.blockClass = "block"
                newBlock.blockId = `stack-${i}-block-${j}`
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
            throw new Error(`Incorrect data type. Needs to be an Array. You passed in a ${typeof colourArray} of "${colourArray}" for colourArray`)
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
        return this

    }

    addBonusBlockToGameStacks() {

        let blocksInLastStack = this.stacks[this.stacks.length - 1].blocks.length

        if (blocksInLastStack >= this.maxBonusBlocks && this.stacks[this.stacks.length - 1].isBonusStack == true) {
            return this;
        }

        if (this.stacks[this.stacks.length - 1].isBonusStack == false) {

            let bonusStack = new Stack();
            bonusStack.isBonusStack = true;
            bonusStack.stackClass = "stack"
            bonusStack.stackId = `stack-${this.stacks.length}`

            let bonusBlockArray = [];
            let bonusBlock = new Block();
            bonusBlock.isBonusBlock = true
            bonusBlock.blockClass = "block"

            bonusBlock.blockId = `stack-${this.stacks.length}-block-${bonusStack.blocks.length}`

            bonusBlockArray.push(bonusBlock);
            bonusStack.blocks = bonusBlockArray;
            this.stacks.push(bonusStack);

        } else {

            let bonusBlock = new Block();
            bonusBlock.isBonusBlock = true
            bonusBlock.blockClass = "block"
            bonusBlock.blockId = `stack-${this.stacks.length - 1}-block-${this.stacks[this.stacks.length - 1].blocks.length}`

            let prevBlock = this.stacks[this.stacks.length - 1].blocks[this.stacks[this.stacks.length - 1].blocks.length - 1];
            let prevColour = prevBlock.blockColour;
            bonusBlock.blockColour = prevColour;
            prevBlock.blockColour = undefined;


            this.stacks[this.stacks.length - 1].blocks.push(bonusBlock);

        }

        return this;
    }

    getNewGameStacksState() {
        console.log("checking state")
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
        return this
    }

    hasWon() {

        console.log("checking for win")
        console.log(this)

        let hasWonArray = []

        for (let i = 0; i < this.stacks.length; i++) {
            const stack = this.stacks[i];
            if (stack.isBonusStack == false && stack.isFilledWithSameColour == true) {
                hasWonArray.push(true);
            }
        }

        let countOfNoneBonusStacks = 0

        for (let i = 0; i < this.stacks.length; i++) {
            if (this.stacks[i].isBonusStack == false) {
                countOfNoneBonusStacks++
            }
        }


        if (hasWonArray.length == countOfNoneBonusStacks) {
            return true
        }

        return false
    }

    undoMove() {

        if (this.moveLog.length == 0) {
            console.log("cannot undo anymore")
            return this
        }

        let lastMove = this.moveLog.pop();

        console.log(lastMove)

        let originStackId = lastMove[0][0];
        let originStackTopColourId = lastMove[0][1];
        let originStackTopColour = lastMove[0][2];
        let destStackId = lastMove[1][0];
        let destAvailableSpaceId = lastMove[1][2];

        let originStack = this.stacks.find(item => item.stackId === originStackId);
        console.log(originStack)
        let destStack = this.stacks.find(item => item.stackId === destStackId);
        console.log(destStack)

        let originBlock = originStack.blocks.find(item => item.blockId === originStackTopColourId);
        console.log(originBlock)
        let destBlock = destStack.blocks.find(item => item.blockId === destAvailableSpaceId);
        console.log(destBlock)

        destBlock.blockColour = undefined;
        originBlock.blockColour = originStackTopColour;

        return this
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

        return this

    }
}

class Stack {
    constructor() {

        this.stackId = undefined;
        this.stackClass = undefined;
        this.blocks = []
        this.isBonusStack = false;

        this.isEmpty = undefined
        this.isFilled = undefined
        this.topColourId = undefined;
        this.topColour = undefined;
        this.availableSpaceId = undefined;
        this.isFilledWithSameColour = undefined

    }

    updateStackState() {
        this.isStackEmpty()
        this.isStackFilled()
        this.topColourAndId()
        this.getAvailableSpaceId()
        this.updateIsFilledWithSameColour();
    }

    isStackEmpty() {
        const colours = this.blocks.map(currentValue => currentValue.blockColour)
        this.isEmpty = colours.every((currentValue) => currentValue == undefined)
    }

    isStackFilled() {
        const colours = this.blocks.map(currentValue => currentValue.blockColour)
        this.isFilled = colours.every((currentValue) => currentValue !== undefined)
    }

    topColourAndId() {
        if (this.isEmpty) {
            this.topColourId = undefined;
            this.topColour = undefined;
        } else {
            let index = this.blocks.findIndex((element) => element.blockColour !== undefined)
            this.topColour = this.blocks[index].blockColour
            this.topColourId = this.blocks[index].blockId
        }
    }

    getAvailableSpaceId() {
        if (this.isFilled) {
            this.availableSpaceId = undefined;

        } else if (this.isEmpty) {
            this.availableSpaceId = this.blocks[this.blocks.length - 1].blockId
        } else {
            let index = this.blocks.findIndex((element) => element.blockColour !== undefined)
            this.availableSpaceId = this.blocks[index - 1].blockId
        }
    }

    updateIsFilledWithSameColour() {

        const colours = this.blocks.map(currentValue => currentValue.blockColour)
        this.isFilledWithSameColour = colours.every((currentValue) => currentValue == this.blocks[0].blockColour)
    }

}

class Block {
    constructor() {
        this.blockClass = undefined;
        this.blockId = undefined;
        this.blockColour = undefined;
        this.isBonusBlock = false;
    }
}

window.onload = new GameManager().startGame()
