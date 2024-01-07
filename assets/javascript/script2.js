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

        this.domStackSection = document.getElementById('stack-section');

    }

    startGame() {
        console.log("starting new game")
        this.gameTitle.clearTitle();
        this.gameTitle.createTitle();

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
        console.log(this)
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
}

class Stack {
    constructor() {

        this.stackId = undefined;
        this.stackClass = undefined;
        this.blocks = []
        this.isBonusStack = false;

        this.isEmpty = undefined
        this.isFilled = undefined
    }

    updateStackState() {
        this.isStackEmpty()
        this.isStackFilled()
    }

    isStackEmpty() {
        const colours = this.blocks.map(currentValue => currentValue.blockColour)
        this.isEmpty = colours.every((currentValue) => currentValue == undefined)
    }

    isStackFilled() {
        const colours = this.blocks.map(currentValue => currentValue.blockColour)
        this.isFilled = colours.every((currentValue) => currentValue !== undefined)
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
