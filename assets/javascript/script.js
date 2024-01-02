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

        this.level = 1; // current level

        // this property is an array of numbers which will be checked against the current 
        // level. If the current level is less than the levelIncrements number, it will
        // add the index of the levelIncrements where the condition was true and add that many
        // extra stacks to the game. 
        // this.levelIncrements = [2, 3, 4, 5, 6, 7, 8, 9, 10]; // use this for testing
        this.levelIncrements = [2, 4, 6, 9, 14, 22, 33, 51, 80]; // factor of 1.55 between level increases

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

        // Property to target the level text on the DOM
        this.levelText = document.getElementById('level-section__level');

        // Property to target the undo button on the DOM
        this.undoButton = document.getElementById('undo-button');

        // Property to target the reset button on the DOM
        this.resetButton = document.getElementById('reset-button');

        // Property to target the reset button on the DOM
        this.addBlockButton = document.getElementById('add-block-button');

        this.howToButton = document.getElementById('how-to-button');
        this.howToModal = document.getElementById('how-to-modal')
        this.closeHowToModal = document.getElementById('close-button')

        this.undoButton.addEventListener('click', (event) => this.undoMove(event));
        this.resetButton.addEventListener('click', (event) => this.resetLevel(event));
        this.addBlockButton.addEventListener('click', (event) => this.addBlock(event));
        this.howToButton.addEventListener('click', (event) => this.howToPlay(event));
        this.closeHowToModal.addEventListener('click', (event) => this.closeHowToPlay(event));


        // #####################
        // # In Game Variables #
        // #####################
        this.firstStackId = undefined;
        this.secondStackId = undefined;

        // array that holds the list of moves per game
        this.moves = [];

        // the maximum amount of bonus blocks allowed per game
        this.maxBonusBlockAmt = 2;

        // count of current bonus blocks the player has
        this.currentBonusBlockAmt = 0;

        this.gameTitle = new GameTitle();

        this.bonusLevel = false;
    }

    howToPlay() {
        console.log("adding modal")
        this.howToModal.style.display = "block"
    }


    closeHowToPlay() {
        this.howToModal.style.display = "none"
    }

    setBonusLevel() {
        if (this.level % 2 == 0) {
            this.bonusLevel = true;
        } else {
            this.bonusLevel = false;
        }
    }

    saveProgressToBrowser() {
        localStorage.setItem("level", this.level)
    }

    //1st required function to initialise the game
    setStartingStackAmt() {
        let newQuantity = 0;

        for (let i = 0; i < this.levelIncrements.length; i++) {
            if (this.level < this.levelIncrements[i]) {
                newQuantity = this.baseStackAmt + i;
                break;
            } else {
                newQuantity = this.baseStackAmt + i;
            }
        }
        this.startingStackAmt = newQuantity;
    }

    //2nd required function to initialise the game
    setStacksToFill() {
        this.stacksToFill = this.startingStackAmt - this.baseEmptyStackAmt;
    }

    //3rd required function to initialise the game
    setInGameColours() {

        let coloursRequired = 0;
        coloursRequired = this.stacksToFill * this.baseBlockAmt;

        let tempArray1 = [];
        for (let i = 0; i < this.stacksToFill; i++) {
            for (let j = 0; j < this.baseBlockAmt; j++) {
                tempArray1.push(this.baseColours[i]);
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
        this.inGameColours = tempArray2;
    }

    // this uses the block and stack class to create an empty array based on the 
    // variables set in the initialisation. 
    createBaseStacks() {

        let stacks = [];

        //create stacks filled with colours
        for (let i = 0; i < this.startingStackAmt; i++) {
            let newStack = new Stack();
            // adds required properties to the stack object
            newStack.bonusStack = false;
            newStack.maxBlockAmt = this.baseBlockAmt;

            let tempStack = [];
            for (let j = 0; j < this.baseBlockAmt; j++) {
                let newBlock = new Block();
                tempStack.push(newBlock);
            }
            newStack.blocks = tempStack;
            stacks.push(newStack);
        }
        this.gameStacks = stacks;
    }

    setBlockColour() {

        let colours = []

        for (let colour of this.inGameColours) {
            colours.push(colour)
        }

        for (let i = 0; i < this.stacksToFill; i++) {
            for (let j = 0; j < this.baseBlockAmt; j++) {
                this.gameStacks[i].blocks[j].colour = colours[0];
                colours.shift();
            }
        }
    }

    setIds() {

        for (let i = 0; i < this.startingStackAmt; i++) {
            this.gameStacks[i].id = this.stackIdPrefix + i;
            this.gameStacks[i].class = this.stackClass;
            for (let j = 0; j < this.baseBlockAmt; j++) {
                this.gameStacks[i].blocks[j].id = this.stackIdPrefix + i + this.blockIdPrefix + j;
                this.gameStacks[i].blocks[j].class = this.blockClass;
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

                let newBlockInnerSpan = document.createElement('span')
                newBlockInnerSpan.classList.add(`${this.gameStacks[i].blocks[j].id}-text`)
                blockForDOM.appendChild(newBlockInnerSpan)

                // adds a concatenation of the parent stack id and the block id as the html id
                blockForDOM.id = `${this.gameStacks[i].blocks[j].id}`;
                blockForDOM.classList.add(this.blockClass);
                blockForDOM.style.backgroundColor = this.gameStacks[i].blocks[j].colour;
                stackForDOM.appendChild(blockForDOM);

            }
            this.domStackSection.append(stackForDOM);
        }
    }

    adjustDOMStackColoursForBonusLevel() {
        for (let i = 0; i < this.domStackSection.children.length - 2; i++) {
            for (let j = 1; j < this.domStackSection.firstChild.children.length; j++) {
                this.domStackSection.children[i].childNodes.item(j).style.backgroundColor = ""
                this.domStackSection.children[i].childNodes.item(j).firstChild.innerText = "?"
            }
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

    initialiseGame() {

        if (localStorage.getItem("level") !== null) {
            this.level = localStorage.getItem("level")
        }

        this.currentBonusBlockAmt = 0; // reset the currentBonusBlockAmt
        this.clearGameStacks();
        this.updateLevelText();
        this.gameTitle.clearTitle();
        this.gameTitle.createTitle();
        this.setStartingStackAmt();
        this.setStacksToFill();
        this.setInGameColours();
        this.createBaseStacks();
        this.setBlockColour();
        this.setIds();
        this.addStackToDOM();
        this.setBonusLevel();

        if (this.bonusLevel == true) {
            console.log("run bonus level")
            this.adjustDOMStackColoursForBonusLevel();
        }

        this.addEventListenersStackArea();
    }

    handleGameClicks(event) {

        // this is used to define the html node selected with the click (stack)
        let stackNode = event.currentTarget;

        // this is used to define the id of the html node selected (stack id)
        let stackId = stackNode.id;

        //find the stack object in gameStacks based on the stackId clicked
        /*
            The below solution came from the need to locate the relevant stack within the gameStacks array based
            on the result from the click event. This is due to all the property and methods for the game to
            run are on the Stack object and not directly on the html DOM element. Keeping these objects of Stack
            and Block in sync with the DOM is key to the successful running of the game. 

            I searched on google for a solution to find an object by another property on that object, to 
            return the full object and found a solution on the following link.

            Link: https://www.tutorialrepublic.com/faq/how-to-find-an-object-by-property-value-in-an-array-of-javascript-objects.php

            The only section of code used from this website was the single line referenced below with the find method (but using my 
            gameStacks array as the object to run find on).
        */
        let obj = this.gameStacks.find(item => item.id === stackId);

        obj.updateClickOrderProperties();

        /*
            Below is the main logic of the handleGameClicks method. Its purpose
            is to determine which clicks are first and which are second. As the 
            Game class level properties are set as undefined by default, this if 
            statement first checks to see if the firstStackId is undefined, meaning
            that it has not been set yet and it is therefore the first click. It will
            then check to see if that stack is empty and if it is, the statement will return
            due to not being able to click on an empty stack as the first click. At this
            point the firstStackId and secondStackId are still undefined. 

            If it is not an empty stack it will set the firstStackId. When another click
            occurs it will return false on the first check for undefined firstStackId because
            it has already been set and move on to the else clause. Here in the else clause
            it checks to see if the stack is filled (as you cannot click a filled stack for the
            second click) or if the current event stackId is equal to the firstStackId 
            Game class level property set at the first click. If either returns true it 
            resets the firstStackId and SecondStackId Game level properties so the player
            can start again. However if both of those return false it will continue to set
            the secondStackId and call the compareBlocks method.             
        */
        if (this.firstStackId == undefined) {
            if (obj.isEmpty) {
                return;
            } else {
                this.firstStackId = stackId;

                obj.updateOriginProperties();

                // add a visual change to selected stack
                document.getElementById(this.firstStackId).style.border = "2px solid white";

            }
        } else {
            if (obj.isFilled || stackId == this.firstStackId) {

                // remove the visual change to selected stack
                document.getElementById(this.firstStackId).style.border = "";

                this.firstStackId = undefined;
                this.secondStackId = undefined;

                return;
            } else {

                this.secondStackId = stackId;

                obj.updateDestinationProperties();

                // remove the visual change on selected stack
                document.getElementById(this.firstStackId).style.border = "";
                this.compareBlocks();
            }
        }
    }

    compareBlocks() {

        let originStack = this.gameStacks.find(item => item.id === this.firstStackId);
        let destStack = this.gameStacks.find(item => item.id === this.secondStackId);

        if (destStack.isEmpty) {
            this.moveBlocks();
        } else if (destStack.destinationTopColour == originStack.originTopColour) {
            this.moveBlocks();
        } else {
            this.firstStackId = undefined;
            this.secondStackId = undefined;
        }
    }

    moveBlocks() {

        let originStack = this.gameStacks.find(item => item.id === this.firstStackId);
        let destStack = this.gameStacks.find(item => item.id === this.secondStackId);

        let originBlock = originStack.blocks.find(item => item.id === originStack.originTopColourId);
        let destBlock = destStack.blocks.find(item => item.id === destStack.destinationAvailableSpaceId);

        // logs the move into a Game level property called moves. To be used when undoing moves or reseting level.
        let movesLogger = [[originStack.id, originStack.originTopColourId, originStack.originTopColour], [destStack.id, destStack.destinationTopColourId, destStack.destinationAvailableSpaceId]];
        this.moves.push(movesLogger);

        if (this.bonusLevel) {
            if (originStack.originTopFilledColourIndex == 3) {
                console.log("do nothing")
                document.getElementById(originStack.originTopColourId).style.backgroundColor = "";
                document.getElementById(destStack.destinationAvailableSpaceId).style.backgroundColor = originStack.originTopColour;

            } else {

                document.getElementById(originStack.id).children[originStack.originTopFilledColourIndex + 1].style.backgroundColor = originStack.blocks[originStack.originTopFilledColourIndex + 1].colour;
                document.getElementById(originStack.id).children[originStack.originTopFilledColourIndex + 1].innerText = "";

                document.getElementById(originStack.originTopColourId).style.backgroundColor = "";
                document.getElementById(destStack.destinationAvailableSpaceId).style.backgroundColor = originStack.originTopColour;

            }
        } else {
            document.getElementById(originStack.originTopColourId).style.backgroundColor = "";
            document.getElementById(destStack.destinationAvailableSpaceId).style.backgroundColor = originStack.originTopColour;
        }

        destBlock.colour = originBlock.colour;
        originBlock.colour = "";
        this.firstStackId = undefined;
        this.secondStackId = undefined;

        this.hasWon();
    }

    hasWon() {
        // TODO: adjust this so that it doesnt auto complete a game if there a still hidden blocks
        // maybe add a check to only run this if the count of empty background colours is the right amount. 

        let winningArray = [];
        for (let i = 0; i < this.gameStacks.length; i++) {
            if (this.gameStacks[i].bonusStack == false) {
                this.gameStacks[i].updateIsFilledWithSameColour();
                winningArray.push(this.gameStacks[i].isFilledWithSameColour);
            }
        }

        let stacksToCheck = winningArray.length - this.baseEmptyStackAmt;
        let counter = 0;
        for (let i = 0; i < winningArray.length; i++) {
            if (winningArray[i] == true) {
                counter++;
            }
        }

        if (counter == (stacksToCheck)) {
            this.moves = [];
            this.increaseLevel();
            this.updateLevelText();
            this.saveProgressToBrowser();
            this.initialiseGame();
        } else {
        }
    }

    increaseLevel() {
        this.level++;
    }

    updateLevelText() {
        this.levelText.textContent = `Level ${this.level}`;
    }

    // the below method clears the stacks from the DOM and is called at the 
    // start of the initialisation method. The reference for this method was
    // from w3schools. Link below
    //Link: https://www.w3schools.com/jsref/met_node_removechild.asp
    clearGameStacks() {
        while (this.domStackSection.hasChildNodes()) {
            this.domStackSection.removeChild(this.domStackSection.firstChild);
        }
    }

    undoMove() {

        if (this.moves.length == 0) {
            return;
        }

        let lastMove = this.moves.pop();

        let originStackId = lastMove[0][0];
        let originStackTopColourId = lastMove[0][1];
        let originStackTopColour = lastMove[0][2];
        let destStackId = lastMove[1][0];
        let destAvailableSpaceId = lastMove[1][2];

        let originStack = this.gameStacks.find(item => item.id === originStackId);
        let destStack = this.gameStacks.find(item => item.id === destStackId);

        let originBlock = originStack.blocks.find(item => item.id === originStackTopColourId);
        let destBlock = destStack.blocks.find(item => item.id === destAvailableSpaceId);

        // changes the colours in the DOM
        document.getElementById(destAvailableSpaceId).style.backgroundColor = "";
        document.getElementById(originStackTopColourId).style.backgroundColor = originStackTopColour;

        // changes the colour in the gameStacks array to keep in sync with the DOM
        destBlock.colour = "";
        originBlock.colour = originStackTopColour;


    }

    resetLevel() {

        // loops through the moves array and reverses each move 1 by one
        for (let i = this.moves.length; i > 0; i--) {
            this.undoMove();
        }

        // removes any bonus stacks from the gameStacks array
        for (let i = 0; i < this.gameStacks.length; i++) {
            if (this.gameStacks[i].bonusStack == true) {
                this.gameStacks.pop(this.gameStacks[i]);
            }
        }

        this.currentBonusBlockAmt = 0;
        this.clearGameStacks();
        this.addStackToDOM();

        if (this.bonusLevel == true) {
            this.adjustDOMStackColoursForBonusLevel();
        }

        this.addEventListenersStackArea();
    }

    /*
        The below method allows for a bonus block to be added to the game to assist the 
        player in completing a level. 
        It first checks to see if the player already has the maximum amount of blocks, if
        they already have the maximum amount the method will return with no action.
        TODO - potentially add some feedback that they have used the max amount (update of 
        a number in the button or a notification).

        If the player is eligible to add a bonus block, the method will first check to see if 
        there is already a bonus stack in play, if there isnt then it will create a stack along
        with a block. If there is a stack already in play it will only add a new block to the 
        existing bonus stack.

        Once the block/stack has been added, if there was a colour in the first bonus block, this
        is shifted down to the bottom block in the stack.

        Finally the method calls 3 existing methods to clear the stacks, re-add the stacks to the DOM
        and then re-add the event listeners. 

     */
    addBlock() {

        if (this.currentBonusBlockAmt < this.maxBonusBlockAmt) {

            //if there isnt already a bonus stack then create a stack and add a block to it
            if (this.gameStacks[this.gameStacks.length - 1].bonusStack == false) {

                //create a new stack
                let bonusStack = new Stack();
                bonusStack.id = this.stackIdPrefix + this.gameStacks.length;

                //create an array of blocks for the stack
                let bonusBlockArray = [];
                //create a new block
                let bonusBlock = new Block();

                //set the block id relative to the position it will be added (which is the end)
                bonusBlock.id = this.stackIdPrefix + this.gameStacks.length + this.blockIdPrefix + "0";

                //set the block bonusStack status to true
                bonusStack.bonusStack = true;

                //add the block to the block array
                bonusBlockArray.push(bonusBlock);
                bonusStack.blocks = bonusBlockArray;

                //add the bonus stack to the gameStacks array
                this.gameStacks.push(bonusStack);

                //increase the current bonus blocks so no more than the max amount can be added
                this.currentBonusBlockAmt++;

                //if there is already a bonus stack then only add a new block to the bonus stack
            } else {

                //create the new block
                let bonusBlock = new Block();
                //set the block id relative to the position it will be added
                bonusBlock.id = this.stackIdPrefix + [this.gameStacks.length - 1] + this.blockIdPrefix + this.gameStacks[this.gameStacks.length - 1].blocks.length;

                //ensures that if a colour was in the previous block, it is moved to the new block and
                //the block colour is changed to blank
                let prevBlock = this.gameStacks[this.gameStacks.length - 1].blocks[this.gameStacks[this.gameStacks.length - 1].blocks.length - 1];
                let prevColour = prevBlock.colour;
                bonusBlock.colour = prevColour;
                prevBlock.colour = "";

                //add the block to the existing blocks array on the bonus stack
                this.gameStacks[this.gameStacks.length - 1].blocks.push(bonusBlock);

                //increase the current bonus blocks so no more than the max amount can be added
                this.currentBonusBlockAmt++;
            }

        } else {
            return;
        }

        //clears the game stacks so they can be re-drawn on the dom and adds the event listeners
        this.clearGameStacks();
        this.addStackToDOM();
        this.addEventListenersStackArea();
    }
}

// Block class for generating a block object
class Block {
    constructor() {
        this.id = "";
        this.colour = "";
        this.blockText = "";
    }
}

// Stack class for generating a Stack object (which will contain an array of Blocks)
class Stack {
    constructor() {
        // id and blocks are set at an initialisation level so will always be accessable 
        // to the other properties in the class
        this.id = "";
        this.blocks = [];

        // this new property allows for the hasWon method on the game to identify if the stacks
        // are base stacks or they are the bonus stacks added as part of the add block method
        this.bonusStack = false;

        // this new property sets the base block amount for the stack so that when the hasWon method
        // is run, it knows which stacks should be checked for filled colours. As if this wasnt set,
        // then the hasWon method on the game object will check if a bonus stack is full with the same
        // colours and return true even if there is only 1 block in the stack, which is not what is 
        // required.
        this.maxBlockAmt = 0;

        // this property is set on the stack so that it can be referenced by the hasWon method on the game
        // and uses the maxBlockAmt in its method for setting it to ensure that it doesnt set true to the 
        // bonus stack 
        this.isFilledWithSameColour = false;

        // these are set as soon as a click is received to help determine if it was the first click (origin click) 
        // or the second click (destination click)
        this.countOfFullBlocks = 0;
        this.countOfEmptyBlocks = 0;
        this.isEmpty = undefined;
        this.isFilled = undefined;

        // first click (origin click) properties
        this.originTopFilledColourIndex = undefined;
        this.originTopColour = "";
        this.originTopColourId = "";



        // second click (destination click) properties
        this.destinationTopColourIndex = undefined;
        this.destinationTopColour = "";
        this.destinationTopColourId = "";

        this.destinationAvailableSpaceIndex = 0;
        this.destinationAvailableSpaceId = "";

    }

    // ################################
    // # Start of CLICK ORDER methods #
    // ################################

    updateClickOrderProperties() {
        this.updateCountOfFullBlocks();
        this.updateCountOfEmptyBlocks();
        this.updateIsEmpty();
        this.updateIsFilled();
    }

    //for updating the value of countOfFullBlocks based on the current state of the object/element that was clicked
    updateCountOfFullBlocks() {

        let counter = 0;
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].colour !== "") {
                counter++;
            }
        }
        this.countOfFullBlocks = counter;
    }

    //for updating the value of countOfEmptyBlocks based on the current state of the object/element that was clicked
    updateCountOfEmptyBlocks() {

        let counter = 0;
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].colour == "") {
                counter++;
            }
        }
        this.countOfEmptyBlocks = counter;
    }

    updateIsEmpty() {

        if (this.countOfEmptyBlocks == this.blocks.length) {
            this.isEmpty = true;
        } else {
            this.isEmpty = false;
        }
    }

    updateIsFilled() {

        if (this.countOfFullBlocks == this.blocks.length) {
            this.isFilled = true;
        } else {
            this.isFilled = false;
        }
    }
    // ##############################
    // # End of Click ORDER methods #
    // ##############################


    // ###############################################
    // # Start of FIRST CLICK (ORIGIN CLICK) methods #
    // ###############################################

    updateOriginProperties() {
        this.updateOriginTopFilledColourIndex();
        this.updateOriginTopColour();
        this.updateOriginTopColourId();

    }

    updateOriginTopFilledColourIndex() {
        if (this.blocks.length - this.countOfFullBlocks == this.blocks.length) { // this can be probably be replaced with isEmpty
            return;
        } else {
            let index = this.blocks.length - this.countOfFullBlocks;
            this.originTopFilledColourIndex = index;
        }
    }

    updateOriginTopColour() {
        this.originTopColour = this.blocks[this.originTopFilledColourIndex].colour;
    }

    updateOriginTopColourId() {
        this.originTopColourId = this.blocks[this.originTopFilledColourIndex].id;
    }

    // #############################################
    // # End of FIRST CLICK (ORIGIN CLICK) methods #
    // #############################################


    // #####################################################
    // # Start of SECOND CLICK (DESTINATION CLICK) methods #
    // #####################################################

    updateDestinationProperties() {
        this.updateDestinationTopColourIndex();
        this.updateDestinationTopColour();
        this.updateDestinationTopColourId();
        this.updateDestinationAvailableSpaceIndex();
        this.updateDestinationAvailableSpaceId();
    }

    updateDestinationTopColourIndex() {
        if (this.blocks.length - this.countOfEmptyBlocks == 0) { //this can be probably be replaced with getIsFull()
            return;
        } else {
            let index = this.countOfEmptyBlocks;
            this.destinationTopColourIndex = index;
        }
    }

    updateDestinationTopColour() {
        if (this.destinationTopColourIndex == undefined) {
            return;
        } else {
            let colour = this.blocks[this.destinationTopColourIndex].colour;
            this.destinationTopColour = colour;
        }
    }

    updateDestinationTopColourId() {
        if (this.destinationTopColourIndex == undefined) {
            return;
        } else {
            let id = this.blocks[this.destinationTopColourIndex].id;
            this.destinationTopColourId = id;
        }
    }

    updateDestinationAvailableSpaceIndex() {
        if (this.isEmpty) {
            this.destinationAvailableSpaceIndex = this.blocks.length - 1;
        } else {
            this.destinationAvailableSpaceIndex = this.destinationTopColourIndex - 1;
        }
    }

    updateDestinationAvailableSpaceId() {
        this.destinationAvailableSpaceId = this.blocks[this.destinationAvailableSpaceIndex].id;
    }
    // ###################################################
    // # End of SECOND CLICK (DESTINATION CLICK) methods #
    // ###################################################

    // Support method to determine if stack is filled with same colour.
    // Added 3 new properties to the stack object, maxBlockAmt, bonusStack and
    // isFilledWithSameColour 
    updateIsFilledWithSameColour() {

        let counter = 0;
        let validationColour = this.blocks[0].colour;

        for (let i = 0; i < this.maxBlockAmt; i++) {
            if (this.blocks[i].colour == validationColour) {
                counter++;
            }
        }

        if (counter == this.maxBlockAmt && validationColour !== "") {
            this.isFilledWithSameColour = true;
            return true;
        } else {
            this.isFilledWithSameColour = false;
            return false;
        }
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

    // used the following link to understand how to create a delay of a loop
    // so I could delay the colour changes on the title. 
    // LINK: https://www.tutorialspoint.com/how-to-add-delay-in-a-loop-in-javascript
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async giveTitleRandomColour() {

        for (let i = 0; i < this.heading.children.length; i++) {
            let randomNumber = Math.floor(Math.random() * (this.colours.length));
            this.heading.children[i].className = this.colours[randomNumber]
            await this.sleep(75)
        }
    }

    async checkRandom() {

        await this.giveTitleRandomColour();

        let firstChildText = this.heading.childNodes.item(0).className
        let seventhChildText = this.heading.childNodes.item(7).className

        if (firstChildText == seventhChildText) {
            console.log("WHOOOOO SPECIAL LEVEL")
        }
    }
}

// // Checks for the window to have loaded before running the game initialisation
// const newGame = new Game();
// window.onload = hasLoaded();

// // Game initialisation function which creates a new Game object, where the
// // base properties can be set. 
// function hasLoaded() {
//     newGame.initialiseGame();
// }

window.onload = new Game().initialiseGame();

