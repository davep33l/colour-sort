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
            '#e6194B', // Red
            '#3cb44b', // Green
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

    getStartingStackAmt() {
        return this.startingStackAmt
    }

    //1st required function to initialise the game
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
    newGame.setInGameColours();
}