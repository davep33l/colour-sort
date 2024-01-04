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

        // Minumum values for the game to function and be enjoyable
        this.BASE_STACK_AMT = 4;
        this.BASE_BLOCK_AMT = 4;
        this.BASE_EMPTY_STACK_AMT = 2;

        // Animated game title updated at the start of each level
        this.GAME_TITLE = new GameTitle();

        this.LEVEL_INCREMENTS = [2, 3, 4, 5, 6, 7, 8, 9, 10]; // Use this for testing
        // Defines how many additional stacks (by using the index that returns true) are added based on the level
        // this.LEVEL_INCREMENTS = [2, 4, 6, 9, 14, 22, 33, 51, 80];


        // ##################################
        // # GAME INITIALISATION PROPERTIES #
        // ##################################

        this.level = 1; // Current level

        this.levelStartingStackAmt = this.BASE_STACK_AMT; // Set by setLevelStartingStackAmt()
        this.levelStacksToFill = this.BASE_STACK_AMT - this.BASE_EMPTY_STACK_AMT; // Set by setLevelStacksToFill()


        this.inGameColours = []; // Stores randomly assorted colours to be populated on the gameStacks

        this.gameStacks = []; // Stores all the Stacks (with internal Blocks) for the game

        // Ids and classes associated with the HMTL and CSS
        this.STACK_ID_PREFIX = "stack-";
        this.BLOCK_ID_PREFIX = "-block-";
        this.BLOCK_CLASS = "stack__block";
        this.STACK_CLASS = "stack";

        // Targets for DOM elements
        this.domStackSection = document.getElementById('stack-section');
        this.levelText = document.getElementById('level-section__level');
        this.howToModal = document.getElementById('how-to-modal');

        // Clickable buttons on DOM
        this.undoButton = document.getElementById('undo-button');
        this.resetButton = document.getElementById('reset-button');
        this.addBlockButton = document.getElementById('add-block-button');
        this.howToButton = document.getElementById('how-to-button');
        this.closeHowToButton = document.getElementById('close-button');

        // Event listeners for clickable buttons
        this.undoButton.addEventListener('click', (event) => this.undoMove(event));
        this.resetButton.addEventListener('click', (event) => this.resetLevel(event));
        this.addBlockButton.addEventListener('click', (event) => this.addBlock(event));
        this.howToButton.addEventListener('click', (event) => this.eventHandlerOpenHowToPlay(event));
        this.closeHowToButton.addEventListener('click', (event) => this.eventHandlerCloseHowToPlay(event));


        // #####################
        // # In Game Variables #
        // #####################

        this.firstStackId = undefined; // Stores stack id of the first valid game click
        this.secondStackId = undefined; // Stores stack id of the second valid game click
        this.levelMovesArray = [];
        this.maxBonusBlockAmt = 2;
        this.currentBonusBlockAmt = 0;
        this.isBonusLevel = false;
    }

    eventHandlerOpenHowToPlay() {
        console.log("adding modal");
        this.howToModal.style.display = "block";
    }

    eventHandlerCloseHowToPlay() {
        this.howToModal.style.display = "none";
    }

    setIsBonusLevel() {
        if (this.level % 10 == 0) {
            this.isBonusLevel = true;
        } else {
            this.isBonusLevel = false;
        }
    }

    saveProgressToBrowser() {
        localStorage.setItem("level", this.level);
    }

    //1st required function to initialise the game
    setLevelStartingStackAmt() {
        let tempStartingStackAmount = 0;

        for (let i = 0; i < this.LEVEL_INCREMENTS.length; i++) {
            if (this.level < this.LEVEL_INCREMENTS[i]) {
                tempStartingStackAmount = this.BASE_STACK_AMT + i;
                break;
            } else {
                tempStartingStackAmount = this.BASE_STACK_AMT + i;
            }
        }
        this.levelStartingStackAmt = tempStartingStackAmount;
    }

    //2nd required function to initialise the game
    setLevelStacksToFill() {
        this.levelStacksToFill = this.levelStartingStackAmt - this.BASE_EMPTY_STACK_AMT;
    }

    setBlockColour() {

        let colours = [];

        for (let colour of this.inGameColours) {
            colours.push(colour);
        }

        for (let i = 0; i < this.levelStacksToFill; i++) {
            for (let j = 0; j < this.BASE_BLOCK_AMT; j++) {
                this.gameStacks.stacks[i].blocks[j].colour = colours[0];
                colours.shift();
            }
        }
    }

    setIds() {

        for (let i = 0; i < this.levelStartingStackAmt; i++) {
            this.gameStacks.stacks[i].id = this.STACK_ID_PREFIX + i;
            this.gameStacks.stacks[i].class = this.STACK_CLASS;
            for (let j = 0; j < this.BASE_BLOCK_AMT; j++) {
                this.gameStacks.stacks[i].blocks[j].id = this.STACK_ID_PREFIX + i + this.BLOCK_ID_PREFIX + j;
                this.gameStacks.stacks[i].blocks[j].class = this.BLOCK_CLASS;
            }
        }
    }

    addStackToDOM() {

        for (let i = 0; i < this.gameStacks.stacks.length; i++) {
            let stackForDOM = document.createElement('div');

            stackForDOM.id = this.gameStacks.stacks[i].id;
            stackForDOM.classList.add(this.STACK_CLASS);

            for (let j = 0; j < this.gameStacks.stacks[i].blocks.length; j++) {
                let blockForDOM = document.createElement('div');

                let newBlockInnerSpan = document.createElement('span');
                newBlockInnerSpan.classList.add(`${this.gameStacks.stacks[i].blocks[j].id}-text`);
                blockForDOM.appendChild(newBlockInnerSpan);

                // adds a concatenation of the parent stack id and the block id as the html id
                blockForDOM.id = `${this.gameStacks.stacks[i].blocks[j].id}`;
                blockForDOM.classList.add(this.BLOCK_CLASS);
                blockForDOM.style.backgroundColor = this.gameStacks.stacks[i].blocks[j].colour;
                stackForDOM.appendChild(blockForDOM);

            }
            this.domStackSection.append(stackForDOM);
        }
    }

    adjustDOMStackColoursForBonusLevel() {
        for (let i = 0; i < this.domStackSection.children.length - 2; i++) {
            for (let j = 1; j < this.domStackSection.firstChild.children.length; j++) {
                this.domStackSection.children[i].childNodes.item(j).style.backgroundColor = "";
                this.domStackSection.children[i].childNodes.item(j).firstChild.innerText = "?";
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

        for (let i = 0; i < this.gameStacks.stacks.length; i++) {
            this.domStackSection.getElementsByClassName(this.STACK_CLASS)[i].addEventListener('click', (event) => this.handleGameClicks(event));
        }
    }

    initialiseGame() {

        if (localStorage.getItem("level") !== null) {
            this.level = localStorage.getItem("level");
        }

        this.currentBonusBlockAmt = 0; // reset the currentBonusBlockAmt
        this.clearGameStacks();
        this.updateLevelText();
        this.GAME_TITLE.clearTitle();
        this.GAME_TITLE.createTitle();
        this.setLevelStartingStackAmt();
        this.setLevelStacksToFill();
        this.inGameColours = new ColourManager(this.levelStacksToFill, this.BASE_BLOCK_AMT).setInGameColours()

        this.gameStacks = new GameStacks(this.levelStartingStackAmt, this.BASE_BLOCK_AMT, 1, 0).createGameStacks()
        console.log(this.gameStacks)

        this.setBlockColour();
        this.setIds();
        this.addStackToDOM();
        this.setIsBonusLevel();

        if (this.isBonusLevel == true) {
            console.log("run bonus level");
            this.adjustDOMStackColoursForBonusLevel();
        }

        this.addEventListenersStackArea();
        console.log(this)
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
        let obj = this.gameStacks.stacks.find(item => item.id === stackId);

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

        let originStack = this.gameStacks.stacks.find(item => item.id === this.firstStackId);
        let destStack = this.gameStacks.stacks.find(item => item.id === this.secondStackId);

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

        let originStack = this.gameStacks.stacks.find(item => item.id === this.firstStackId);
        let destStack = this.gameStacks.stacks.find(item => item.id === this.secondStackId);

        let originBlock = originStack.blocks.find(item => item.id === originStack.originTopColourId);
        let destBlock = destStack.blocks.find(item => item.id === destStack.destinationAvailableSpaceId);

        // logs the move into a Game level property called moves. To be used when undoing moves or reseting level.
        let movesLogger = [[originStack.id, originStack.originTopColourId, originStack.originTopColour], [destStack.id, destStack.destinationTopColourId, destStack.destinationAvailableSpaceId]];
        this.levelMovesArray.push(movesLogger);

        if (this.isBonusLevel) {
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
        for (let i = 0; i < this.gameStacks.stacks.length; i++) {
            if (this.gameStacks.stacks[i].bonusStack == false) {
                this.gameStacks.stacks[i].updateIsFilledWithSameColour();
                winningArray.push(this.gameStacks.stacks[i].isFilledWithSameColour);
            }
        }

        let stacksToCheck = winningArray.length - this.BASE_EMPTY_STACK_AMT;
        let counter = 0;
        for (let i = 0; i < winningArray.length; i++) {
            if (winningArray[i] == true) {
                counter++;
            }
        }

        if (counter == (stacksToCheck)) {
            this.levelMovesArray = [];
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

        if (this.levelMovesArray.length == 0) {
            return;
        }

        let lastMove = this.levelMovesArray.pop();

        let originStackId = lastMove[0][0];
        let originStackTopColourId = lastMove[0][1];
        let originStackTopColour = lastMove[0][2];
        let destStackId = lastMove[1][0];
        let destAvailableSpaceId = lastMove[1][2];

        let originStack = this.gameStacks.stacks.find(item => item.id === originStackId);
        let destStack = this.gameStacks.stacks.find(item => item.id === destStackId);

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
        for (let i = this.levelMovesArray.length; i > 0; i--) {
            this.undoMove();
        }

        // removes any bonus stacks from the gameStacks array
        for (let i = 0; i < this.gameStacks.stacks.length; i++) {
            if (this.gameStacks.stacks[i].bonusStack == true) {
                this.gameStacks.stacks.pop(this.gameStacks.stacks[i]);
            }
        }

        this.currentBonusBlockAmt = 0;
        this.clearGameStacks();
        this.addStackToDOM();

        if (this.isBonusLevel == true) {
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
            if (this.gameStacks.stacks[this.gameStacks.stacks.length - 1].bonusStack == false) {

                //create a new stack
                let bonusStack = new Stack();
                bonusStack.id = this.STACK_ID_PREFIX + this.gameStacks.stacks.length;

                //create an array of blocks for the stack
                let bonusBlockArray = [];
                //create a new block
                let bonusBlock = new Block();

                //set the block id relative to the position it will be added (which is the end)
                bonusBlock.id = this.STACK_ID_PREFIX + this.gameStacks.stacks.length + this.BLOCK_ID_PREFIX + "0";

                //set the block bonusStack status to true
                bonusStack.bonusStack = true;

                //add the block to the block array
                bonusBlockArray.push(bonusBlock);
                bonusStack.blocks = bonusBlockArray;

                //add the bonus stack to the gameStacks array
                this.gameStacks.stacks.push(bonusStack);

                //increase the current bonus blocks so no more than the max amount can be added
                this.currentBonusBlockAmt++;

                //if there is already a bonus stack then only add a new block to the bonus stack
            } else {

                //create the new block
                let bonusBlock = new Block();
                //set the block id relative to the position it will be added
                bonusBlock.id = this.STACK_ID_PREFIX + [this.gameStacks.stacks.length - 1] + this.BLOCK_ID_PREFIX + this.gameStacks.stacks[this.gameStacks.stacks.length - 1].blocks.length;

                //ensures that if a colour was in the previous block, it is moved to the new block and
                //the block colour is changed to blank
                let prevBlock = this.gameStacks.stacks[this.gameStacks.stacks.length - 1].blocks[this.gameStacks.stacks[this.gameStacks.stacks.length - 1].blocks.length - 1];
                let prevColour = prevBlock.colour;
                bonusBlock.colour = prevColour;
                prevBlock.colour = "";

                //add the block to the existing blocks array on the bonus stack
                this.gameStacks.stacks[this.gameStacks.stacks.length - 1].blocks.push(bonusBlock);

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

class GameStacks {
    constructor(normalStackAmt, normalBlockAmtPerStack, bonusStackAmt, bonusBlockAmtPerBonusStack) {
        this.normalStackAmt = normalStackAmt;
        this.normalBlockAmtPerStack = normalBlockAmtPerStack;
        this.bonusStackAmt = bonusStackAmt;
        this.bonusBlockAmtPerBonusStack = bonusBlockAmtPerBonusStack;
        this.stacks = undefined;
    }

    createGameStacks() {

        let stacks = [];

        //create stacks filled with colours
        for (let i = 0; i < this.normalStackAmt; i++) {
            let newStack = new Stack();
            // adds required properties to the stack object
            newStack.bonusStack = false;
            newStack.maxBlockAmt = this.normalBlockAmtPerStack;

            let tempStack = [];
            for (let j = 0; j < this.normalBlockAmtPerStack; j++) {
                let newBlock = new Block();
                tempStack.push(newBlock);
            }
            newStack.blocks = tempStack;
            stacks.push(newStack);
        }

        this.stacks = stacks
        return this
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

class ColourManager {
    constructor(level, blockAmt) {
        this.level = level;
        this.blockAmt = blockAmt;
        this.BASE_COLOURS = [
            'red',
            'green',
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

    setInGameColours() {

        let coloursRequired = 0;
        coloursRequired = this.level * this.blockAmt;
        console.log(this.BASE_COLOURS)
        console.log(coloursRequired)
        let tempArray1 = [];
        for (let i = 0; i < this.level; i++) {
            for (let j = 0; j < this.blockAmt; j++) {
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
        return tempArray2;
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



//create stack skeleton 2 full 2 empty
// 2 full 2 empty plus bonus stack with