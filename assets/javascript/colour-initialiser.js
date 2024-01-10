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
export class ColourInitialiser {
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