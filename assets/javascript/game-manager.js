import { GameSettings } from './game-settings.js'
import { LevelManager } from './level-manager.js'
import { GameTitle } from './game-title.js'
import { ColourInitialiser } from './colour-initialiser.js'
import { GameStacks } from './game-stacks.js'

/**
 * Main class used to initialise the game, with startGame. 
 * It handles the adding and handling of any event listeners and 
 * the method to draw the gameStacks to the DOM. 
 */
export class GameManager {
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

        this.storedLevel = undefined;
        this.storedColourArray = undefined;
    }

    startGame() {

        this.extractLocalStorage();
        this.gameTitle.clearTitle();
        this.gameTitle.createTitle();

        if (localStorage.getItem("levelData") !== null) {
            if (this.currentLevel <= this.storedLevel) {
                this.currentLevel = this.storedLevel;
            }
        }

        this.updateLevelText();
        const startingStackAmountForLevel = this.levelManager.getStartingStackAmtForLevel(this.currentLevel, this.gameSettings.stackAmt);

        if (this.currentLevel == 1 || this.storedColourArray == undefined) {
            this.initialColourArray = this.colourInitialiser.setInGameColours(startingStackAmountForLevel, this.gameSettings.blockAmt, this.gameSettings.emptyStackAmt);

        } else if (localStorage.getItem("levelData") !== null) {
            if (this.currentLevel <= this.storedLevel) {
                this.initialColourArray = this.storedColourArray;
            } else {
                this.initialColourArray = this.colourInitialiser.setInGameColours(startingStackAmountForLevel, this.gameSettings.blockAmt, this.gameSettings.emptyStackAmt);
            }
        }

        this.gameStacks = new GameStacks().createInitialGameStacks(startingStackAmountForLevel, this.gameSettings.blockAmt).addColoursToGameStacksBlocks(this.initialColourArray);
        this.drawGameStacksToDom();
        this.addEventListenersStackArea();
        this.saveToLocalStorage();

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


    saveToLocalStorage() {
        localStorage.setItem("levelData", [this.currentLevel, this.initialColourArray].toString());
    }

    extractLocalStorage() {

        if (localStorage.getItem("levelData") !== null) {
            let storedData = localStorage.getItem("levelData").split(',')
            this.storedLevel = parseInt(storedData.splice(0, 1))
            this.storedColourArray = storedData.map((colour) => {
                if (colour.length == 0) {
                    return undefined
                } else {
                    return colour
                }
            });
        }
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