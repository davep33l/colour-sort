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

        console.log(typeof integer)
        console.log(Number.isInteger(integer))

        /* 
            The below code is for protection against input of an incorrect data type, 
            as only an integer can be passed into the function. If an incorrect type 
            is determined, the following code will return false, which leaves the 
            baseStackAmt property set at its default value. 
        */
        if (!Number.isInteger(integer)) {
            console.log("not a number");
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

        console.log(typeof integer)
        console.log(Number.isInteger(integer))

        /* 
            The below code is for protection against input of an incorrect data type, 
            as only an integer can be passed into the function. If an incorrect type 
            is determined, the following code will return false, which leaves the 
            baseBlockAmt property set at its default value. 
        */
        if (!Number.isInteger(integer)) {
            console.log("not a number");
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

        console.log(typeof integer)
        console.log(Number.isInteger(integer))

        /* 
            The below code is for protection against input of an incorrect data type, 
            as only an integer can be passed into the function. If an incorrect type 
            is determined, the following code will return false, which leaves the 
            baseEmptyStackAmt property set at its default value. 
        */
        if (!Number.isInteger(integer)) {
            console.log("not a number");
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

    //lst required function to initialise the game
    getStartingStackAmt() {
        return this.startingStackAmt
    }

    setStartingStackAmt() {
        let newQuantity = 0;
        console.log(newQuantity)

        for (let i = 0; i < this.levelIncrements.length; i++) {
            if (this.level < this.levelIncrements[i]) {
                newQuantity = this.baseStackAmt + i;
                break;
            } else if (this.level >= this.levelIncrements[i]) {
                newQuantity = this.baseStackAmt + i;
            }
        }
        console.log(newQuantity)
        this.startingStackAmt = newQuantity
    }

    getStacksToFill() {
        return this.stacksToFill
    }

    //2nd required function to initialise the game
    setStacksToFill() {
        this.stacksToFill = this.startingStackAmt - this.baseEmptyStackAmt
    }

}

// Checks for the window to have loaded before running the game initialisation
window.onload = hasLoaded();

// Game initialisation function which creates a new Game object, where the
// base properties can be set. 
function hasLoaded() {
    console.log("The window has loaded")
    newGame = new Game();
    newGame.updateBaseStackAmt(4);
    newGame.updateBaseBlockAmt(5);
    newGame.updateBaseEmptyStackAmt(2);
}