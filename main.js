
// Import terminal-kit for enhanced terminal graphics
const term = require('terminal-kit').terminal;
const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

//fieldsize
const fSx = 4-1;
const fSy = 6-1;

class Field {
    constructor(field) {        
        this.field = field;
        this.playerRow = 0;
        this.playerCol = 0;
        this.playerChar = '*';
    }
    generateField(height, width, holePercentage) {
        this.field = new Array(height).fill().map(() => new Array(width).fill(fieldCharacter));
        this.playerRow = 0;
        this.playerCol = 0;
        this.field[0][0] = this.playerChar;

        // Place hat
        let hatRow, hatCol;
        do {
            hatRow = Math.floor(Math.random() * height);
            hatCol = Math.floor(Math.random() * width);
        } while (hatRow === 0 && hatCol === 0); // Ensure hat is not placed at the starting position
        this.field[hatRow][hatCol] = hat;

        // Place holes
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (this.field[i][j] === fieldCharacter && Math.random() < holePercentage) {
                    this.field[i][j] = hole;
                }
            }
        }
    }
    move(direction) {
        
        let newRow = this.playerRow;
        let newCol = this.playerCol;
        if (direction === 'w') newRow--;
        if (direction === 's') newRow++;
        if (direction === 'a') newCol--;
        if (direction === 'd') newCol++;
        
        // Check bounds
        if (newRow < 0 || newRow >= this.field.length || newCol < 0 || newCol >= this.field[0].length){
            term.red('Out of bounds!\n');
            return;//if the new position is outside the field, print a message and return without updating the position
        }
        
        //checks to see if new position lands on a hat
        if(this.field[newRow][newCol] === hat){
            term.green('you win\n');
            process.exit();
        }
                //checks to see if new position lands on a hole
            if(this.field[newRow][newCol] === hole){//if the new position is a hole, print a message and return without updating the position
            term.red('Hole!, your dead\n');
            process.exit();
        }

            // Update position in the array
        this.playerRow = newRow;//update the player's row and column to the new position
        this.playerCol = newCol;//update the player's row and column to the new position
        this.field[newRow][newCol] = this.playerChar;//update the field array to mark the player's new position with the player character


    }
    print(){
        for (let row of this.field) {
            for (let cell of row) {
                if (cell === this.playerChar) {
                    term.yellow(cell);
                } else if (cell === hat) {
                    term.green(cell);
                } else if (cell === hole) {
                    term.red(cell);
                } else {
                    term.cyan(cell);
                }
            }
            term('\n');
        }
    }

}
const field = new Field();
field.generateField(6, 4, 0.3);

// const field = new Field([
//     ['*', '░', '░', 'O'],
//     ['░', 'O', '░', 'O'],
//     ['░', '░', '░', 'O'],
//     ['O', '░', '░', '░'],
//     ['░', '░', 'O', '░'],
//     ['░', '^', '░', '░'],
// ]);

//raw array
//console.log(field.field);


console.log('Welcome to the game!');
console.log('You are a field explorer, and your goal is to find the hat (^) while avoiding holes (O).');
console.log('You can move up, down, left, or right by entering the corresponding commands (w, s, a, d).');
console.log('Good luck!');

field.print()

//game loop
for(let i = 0; i < 10; i++){
const input = prompt('enter direction: ');
field.move(input);
//move cursor to start of field in terminal window to overwrite previous field display
process.stdout.write('\r\x1B[7A');


field.print()

}