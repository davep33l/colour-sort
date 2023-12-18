
/* 
    This game utilised 3 class objects to enable the functionality of the game. Along 
    with an initialisation function after the window.onload is successful. 

    These objects will run in conjunction with the updating of the DOM and maintain
    up to date state of the game. For properties such as block id, stack id, stack 
    selected (first and second), base initialisation properties, like the amount
    of stacks and blocks to start the game with, along with methods to update and 
    retrieve those properties. Also for colours used in the game and the methods used
    to create a randomised game colour array. 

    There are also methods that create the relevant game objects (Blocks and Stacks), by 
    adding id's, class names, colours. Along with event listeners/handlers to update
    the DOM.

    A Game class:
    This houses all the relevant properties and methods to enable the game initialisation
    and the creation of the blocks and stacks using the Block and Stack classes. Also
    holds the main event handler function and supporting methods. 

    A Block class: 
    This object holds the base information of id and colour, which is the most granular level
    of information used to allow the game to function. Keeping these updated allows for 
    the DOM to updated at the same time. 

    A Stack class:
    This object holds initial information on the Stack object such as id and the blocks in the stack. 
    These are updated to the DOM to keep in sync. 
    There are also methods on this class that track pertinent inPlay game variables to help 
    determine which blocks are eligible for moving, eligible block colours and id's. 
*/

class Game {
    constructor() {

        // ######################################
        // # PRE-GAME INITIALISATION PROPERTIES #
        // ######################################

        this.baseStackAmt = 4; // the game has to start with at least 4 stacks to be playable/enjoyable
        this.baseBlockAmt = 4; // the game has to start with at least 4 blocks in each stack to be playable/enjoyable
        this.baseEmptyStackAmt = 2; // the game has to start with at least 2 empty stacks to have a chance of completing the game


        // ##################################
        // # GAME INITIALISATION PROPERTIES #
        // ##################################

        this.level = 0; // current level

        // this property is an array of numbers which will be checked against the current 
        // level. If the current level is less than the levelIncrements number, it will
        // add the index of the levelIncrements where the condition was true and add that many
        // extra stacks to the game. 
        this.levelIncrements = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 17];

        // this property is an integer denoting the starting amount of stacks for the game and is
        // updated throughout the game based on the level the player is currently at. It is updated
        // using the levelIncrements property to determine how many additional stacks to start the 
        // game with. 
        this.startingStackAmt = this.baseStackAmt;
        this.stacksToFill = 2;

        /*  
            In the interest of accessibility, I searched for colours that were unique enough, 
            but maintained a enough contrast/difference to be distinguishable. This lead me to 
            the following website with a great resource of colours trying to solve a similar problem
            but for subway map lines. I selected a list of colours from this which I deemed 
            appropriate for the game. 
        
            Link: https://sashamaps.net/docs/resources/20-colors/
        */
        // this colour array serves as the base colours for the blocks to be used throughout the game
        this.baseColours = [
            "red",
            "green",
            // '#e6194B', // Red
            // '#3cb44b', // Green
            '#ffe119', // Yellow
            '#4363d8', // Blue
            '#f58231', // Orange
            '#911eb4', // Purple
            '#42d4f4', // Cyan
            '#f032e6', // Magenta
            '#bfef45', // Lime
            '#fabed4', // Pink
            '#469990', // Teal
            '#dcbeff', // Lavender
            '#9A6324', // Brown
            '#fffac8', // Beige
            '#800000', // Maroon
            '#808000', // Olive
            '#000075', // Navy
            '#a9a9a9', // Grey
        ];

        /*
            The below array will hold the in game colours. Essentially the method setInGameColours will
            create a variable called coloursRequired and calculate the amount, based on the previously 
            created stacksToFill and baseBlockAmt properties.
            Example:

            stacksToFill = 2
            baseBlockAmt = 4
            coloursRequired = 2 * 4 = 8

            It will then pull through the required amount of colours by referencing the index of the baseColours
            array. Using the example numbers above, it will take the colour in the first index and push it to 
            a tempArray1 4 times, then it will move to the next index (less than stacksToFill) and push that colour
            4 times to tempArray1. 

            The output of tempArray1 would look like this:

            tempArray1 = ["red","red","red","red","green","green","green","green"]

            There is a second part to this method, that randomises the colours in tempArray1 by creating a new tempArray2
            variable and loops through up until the coloursRequired variable.
            In the loop it will create a "multiplier" variable which represents the length of tempArray1 (note this array has items
            spliced from it later). With this multiplier a random integer is found using Math.random. This is essentially an index in
            the tempArray1 for a colour. That colour is then pushed on to tempArray2 and the colour is spliced from tempArray1.

            This will result in a shuffled tempArray2 which is used to set the inGameColours property of the Game class.

            The output of tempArray1 would look like this:

            tempArray2 = ["green","green","red","red","red","green","red","green"]

        */
        this.inGameColours = [];

        /* 
            This holds the Stack object in an array so they can be accessed throughout the game.
            The Stack object in turn will hold an array of Block objects.
            There are 3 methods associated with this.
            createBaseStacks, setBlockColour and setIds.
        */
        this.gameStacks = [];

        // Properties set for the id and class prefixes to allow for easy change if required.
        // These are used with the setIds methond when updating the gameStacks array of Stack and
        // Block objects. 
        this.blockIdPrefix = "-block-";
        this.stackIdPrefix = "stack-";
        this.blockClass = "stack__block";
        this.stackClass = "stack";

        // Property to target the stack-section on the DOM
        this.domStackSection = document.getElementById('stack-section');

    }
    // ###################################
    // # PRE-GAME INITIALISATION METHODS #
    // ###################################
    getBaseStackAmt() {
        return this.baseStackAmt;
    }

    setBaseStackAmt(integer) {
        this.baseStackAmt = integer;
    }

    updateBaseStackAmt(integer) {

        /* 
            The below code is for protection against input of an incorrect data type, 
            as only an integer can be passed into the function. If an incorrect type 
            is determined, the following code will return false, which leaves the 
            baseStackAmt property set at its default value. 
        */
        if (!Number.isInteger(integer)) {
            return;
        }

        /*
             When initialising the game you can set the baseStackAmt, the below
             checks the input value is a minimum of the default baseStackAmt and 
             only updates to the value passed in if it is greater than the baseStackAmt.
        */
        if (integer < this.baseStackAmt) {
            this.setBaseStackAmt(this.baseStackAmt);
        } else {
            this.setBaseStackAmt(integer);
        }
    }

    getBaseBlockAmt() {
        return this.baseBlockAmt;
    }

    setBaseBlockAmt(integer) {
        this.baseBlockAmt = integer;
    }

    updateBaseBlockAmt(integer) {

        /* 
            The below code is for protection against input of an incorrect data type, 
            as only an integer can be passed into the function. If an incorrect type 
            is determined, the following code will return false, which leaves the 
            baseBlockAmt property set at its default value. 
        */
        if (!Number.isInteger(integer)) {
            return;
        }

        /*
             When initialising the game you can set the baseBlockAmt, the below
             checks the input value is a minimum of the default baseBlockAmt and 
             only updates to the value passed in if it is greater than the baseBlockAmt.
        */
        if (integer < this.baseBlockAmt) {
            this.setBaseBlockAmt(this.baseBlockAmt);
        } else {
            this.setBaseBlockAmt(integer);
        }
    }

    getBaseEmptyStackAmt() {
        return this.baseEmptyStackAmt;
    }

    setBaseEmptyStackAmt(integer) {
        this.baseEmptyStackAmt;
    }

    updateBaseEmptyStackAmt(integer) {

        /* 
            The below code is for protection against input of an incorrect data type, 
            as only an integer can be passed into the function. If an incorrect type 
            is determined, the following code will return false, which leaves the 
            baseEmptyStackAmt property set at its default value. 
        */
        if (!Number.isInteger(integer)) {
            return;
        }

        /*
             When initialising the game you can set the baseEmptyStackAmt, the below
             checks the input value is a minimum of the default baseEmptyStackAmt and 
             only updates to the value passed in if it is greater than the baseEmptyStackAmt.
        */
        if (integer < this.baseEmptyStackAmt) {
            this.setBaseEmptyStackAmt(this.baseEmptyStackAmt);
        } else {
            this.setBaseEmptyStackAmt(integer);
        }
    }

    getLevel() {
        return this.level;
    }

    setLevel(integer) {
        if (integer <= 0) {
            return;
        }
        this.level = integer;
    }

    getLevelIncrements() {
        return this.levelIncrements
    }

    setLevelIncrements(array) {
        this.levelIncrements = array
    }

    getStartingStackAmt() {
        return this.startingStackAmt
    }

    //1st required function to initialise the game
    setStartingStackAmt() {
        let newQuantity = 0;

        for (let i = 0; i < this.levelIncrements.length; i++) {
            if (this.level < this.levelIncrements[i]) {
                newQuantity = this.baseStackAmt + i;
                break;
            } else if (this.level >= this.levelIncrements[i]) {
                newQuantity = this.baseStackAmt + i;
            }
        }
        this.startingStackAmt = newQuantity
    }

    getStacksToFill() {
        return this.stacksToFill
    }

    //2nd required function to initialise the game
    setStacksToFill() {
        this.stacksToFill = this.startingStackAmt - this.baseEmptyStackAmt
    }

    getBaseColours() {
        return this.baseColours;
    }

    setBaseColours(array) {
        this.baseColours = array;
    }

    getInGameColours() {
        return this.inGameColours
    }

    //3rd required function to initialise the game
    setInGameColours() {

        let coloursRequired = 0;
        coloursRequired = this.stacksToFill * this.baseBlockAmt

        let tempArray1 = [];
        for (let i = 0; i < this.stacksToFill; i++) {
            for (let j = 0; j < this.baseBlockAmt; j++) {
                tempArray1.push(this.baseColours[i]);
            }
        }

        let tempArray2 = []
        for (let i = 0; i < coloursRequired; i++) {
            let multiplier = 0;
            multiplier = tempArray1.length;
            let randomNumber = 0;
            randomNumber = Math.floor(Math.random() * multiplier)
            tempArray2.push(tempArray1[randomNumber]);
            tempArray1.splice(randomNumber, 1);
        }
        this.inGameColours = tempArray2
    }

    // this uses the block and stack class to create an empty array based on the 
    // variables set in the initialisation. 
    createBaseStacks() {

        let stacks = []

        //create stacks filled with colours
        for (let i = 0; i < this.startingStackAmt; i++) {
            let newStack = new Stack();
            let tempStack = []
            for (let j = 0; j < this.baseBlockAmt; j++) {
                let newBlock = new Block()
                tempStack.push(newBlock);
            }
            newStack.blocks = tempStack;
            stacks.push(newStack)
        }
        return this.gameStacks = stacks;
    }

    setBlockColour() {
        for (let i = 0; i < this.stacksToFill; i++) {
            for (let j = 0; j < this.baseBlockAmt; j++) {
                this.gameStacks[i].blocks[j].colour = this.inGameColours[0]
                this.inGameColours.shift();
            }
        }
    }

    setIds() {

        for (let i = 0; i < this.startingStackAmt; i++) {

            this.gameStacks[i].id = this.stackIdPrefix + i
            this.gameStacks[i].class = this.stackClass

            for (let j = 0; j < this.baseBlockAmt; j++) {

                this.gameStacks[i].blocks[j].id = this.stackIdPrefix + i + this.blockIdPrefix + j
                this.gameStacks[i].blocks[j].class = this.blockClass

            }
        }
    }

    addStackToDOM() {

        for (let i = 0; i < this.gameStacks.length; i++) {
            let stackForDOM = document.createElement('div');

            stackForDOM.id = this.gameStacks[i].id;
            stackForDOM.classList.add(this.stackClass);

            for (let j = 0; j < this.gameStacks[i].blocks.length; j++) {
                let blockForDOM = document.createElement('div');

                // adds a concatenation of the parent stack id and the block id as the html id
                blockForDOM.id = `${this.gameStacks[i].blocks[j].id}`;
                blockForDOM.classList.add(this.blockClass);
                blockForDOM.style.backgroundColor = this.gameStacks[i].blocks[j].colour;
                stackForDOM.appendChild(blockForDOM);

            }
            this.domStackSection.append(stackForDOM);
        }
    }

    /* 
        The below function adds event listeners to the Stack elements in the DOM.
        The usage of the arrow function for the event listener was to maintain the context of the
        for this to the class whilst also having access to the event itself. The resources I 
        used to do this were as follows:

        Specific solution.
        Link: https://stackoverflow.com/questions/44606399/typescript-how-to-access-the-class-instance-from-event-handler-method

        Reference and back up information to support the decision. 
        Link: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_value_of_this_within_the_handler

    */

    addEventListenersStackArea() {

        for (let i = 0; i < this.gameStacks.length; i++) {
            this.domStackSection.getElementsByClassName(this.stackClass)[i].addEventListener('click', (event) => this.handleGameClicks(event));
        }
    }

    handleGameClicks(event) {
        console.log("click received")
        // logging to check the clicks scope
        console.log(this)
        console.log(event.currentTarget)
        console.log(event.currentTarget === this)


        //result from this method is sent to compareBlocks method
    }

    compareBlocks() {
        //placeholder that is called from handleGameClicks


        //result from this method is sent to moveBlocks method
    }

    moveBlocks() {
        //placeholder that is called from moveBlocks method



        //always calls a hasWon method after moving the blocks
    }

    hasWon() {
        //checks to see if game has won and resarts the game if it has
    }

    increaseLevel() {
        //placeholder
    }

    clearGameStacks() {
        //placeholder
    }

}

// Block class for generating a block object
class Block {
    constructor() {
        this.id = "";
        this.colour = "";
    }

    // Start of BLOCK INITIALISATION methods
    getBlockColour() {
        return this.colour;
    }

    setBlockColour(newColour) {
        this.colour = newColour
    }

    getBlockId() {
        return this.id;
    }

    setBlockId(newId) {
        this.id = newId;
    }
    // End of of BLOCK INITIALISATION methods
}

// Stack class for generating a Stack object (which will contain an array of Blocks)
class Stack {
    constructor() {
        // id and blocks are set at an initialisation level so will always be accessable 
        // to the other properties in the class
        this.id = "";
        this.blocks = [];
    }

    // Start of STACK INITIALISATION methods
    getStackId() {
        return this.id;
    }

    setStackId(newId) {
        this.id = newId;
    }

    getStackBlocks() {
        return this.blocks;
    }

    setStackBlocks(blockArray) {
        this.blocks = blockArray;
    }
    // End of of STACK INITIALISATION methods
}


// Checks for the window to have loaded before running the game initialisation
window.onload = hasLoaded();

// Game initialisation function which creates a new Game object, where the
// base properties can be set. 
function hasLoaded() {
    console.log("The window has loaded")
    newGame = new Game();
    newGame.setStartingStackAmt();
    newGame.setStacksToFill();
    newGame.setInGameColours();
    newGame.createBaseStacks();
    newGame.createBaseStacks();
    newGame.setBlockColour();
    newGame.setIds();
    newGame.addStackToDOM();
    newGame.addEventListenersStackArea();
}