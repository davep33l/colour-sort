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

    }

    startGame() {
        console.log("starting new game")
        this.gameTitle.clearTitle();
        this.gameTitle.createTitle();

        const startingStackAmountForLevel = this.levelManager.getStartingStackAmtForLevel(this.currentLevel, this.gameSettings.stackAmt)
        console.log(startingStackAmountForLevel)

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

    }
}

class GameStacks {
    constructor() {

    }
}

class Stack {
    constructor() {

    }
}

class Block {
    constructor() {
        this.blockClass = undefined;
        this.blockId = undefined;
        this.blockColour = undefined;
    }
}

window.onload = new GameManager().startGame()
