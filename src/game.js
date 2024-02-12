import { alert } from "./alert.js";
import { game_mode } from "./game_mode.js";

const DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

const cell = {
    is_mine: false,
    flagged: false,
    uncovered: false,
    adjecent_mines: 0
};

export const game = {

    size: {
        width: 0,
        height: 0,
        update: function (width, height) {
            this.width = width;
            this.height = height;
        }
    },

    game_array: [],
    mines: 0,
    mines_left: 0,

    first_move: true,
    game_over: false,
    flag_mode: false,

    // these coordinates are used to highlight 
    // the mine that lost the game.
    tripped_mine: {
                    x: null, 
                    y: null
                },

    reset: function () {

        console.clear();
        const get_mode = game_mode.get_mode();
        this.first_move = true;
        this.game_over = false;
        this.mines = get_mode.mines;
        this.mines_left = this.mines;
        this.tripped_mine.x = null;
        this.tripped_mine.y = null;
        this.size.update(get_mode.width, get_mode.height);
        this.game_array = this.reset_array(get_mode.width, get_mode.height);
        this.plant_mines(this.game_array, this.mines);

    },

    reset_array: function (width, height) {

        let rows = [];
        for (let x = 0; x < width; x++) {
            let columns = [];
            for (let y = 0; y < height; y++) {
                columns.push({...cell});
            }
            rows.push(columns);
        }

        return rows;
    },

    plant_mines: function(array, max_mines) {

        const width = this.size.width;
        const height = this.size.height;
        
        let planted = 0;

        do {
            //randomize placement
            let random_num = Math.floor(Math.random() * (width * height));

            let x = Math.floor(random_num / height);
            let y = random_num % height;

            //make sure it's not already a mine.
            if (!array[x][y].is_mine) {
                array[x][y].is_mine = true;
                planted++;
            }

        } while (planted < max_mines)

    },

    count_adj_mines: function(array) {

        const rows = this.size.width;
        const columns = this.size.height;

        let count;

        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < columns; y++) {

                //dont bother counting blocks that are already mines
                if (array[x][y].is_mine)
                    continue;

                count = 0;
                // check all adjecent blocks to see if they are mines
                for (let z = 0; z < DIRECTIONS.length; z++) {

                    let dir_x = x + DIRECTIONS[z][0];
                    let dir_y = y + DIRECTIONS[z][1];

                    if (dir_x < 0 || dir_x >= rows || dir_y < 0 || dir_y >= columns)
                        continue;

                    if (array[dir_x][dir_y].is_mine) 
                        count ++;
                }

                array[x][y].adjecent_mines = count;
            
            }
        }

    },

    uncover_cell: function(x, y) {

        if (this.game_over) {
            this.reset();
            alert.active = false;
            return;
        }

        const array = this.game_array;
        const rows = this.size.width;
        const columns = this.size.height;

        if (this.flag_mode) {

            if (array[x][y].uncovered) return;

            array[x][y].flagged = !array[x][y].flagged;
            this.mines_left += array[x][y].flagged ? -1 : 1; 
            return;
        }

        //don't uncover a flagged cell
        //flag must manually be removed first.
        if (array[x][y].flagged)
            return;

        if (array[x][y].uncovered) 
            return;

        //the first move should never be a mine.
        if (this.first_move) {
            this.check_first_move(array, x, y);
            this.first_move = false;
        }

        array[x][y].uncovered = true;

        if (array[x][y].adjecent_mines === 0 && !array[x][y].is_mine) {
            spread_empty_cells(array, x, y, rows, columns);
        }

        this.check_game_over (array, x, y);

    },

    check_game_over: function (array, x, y) {

        if (array[x][y].is_mine) {
            this.game_over = true;
            this.tripped_mine.x = x;
            this.tripped_mine.y = y;
            this.uncover_mines(array);
            alert.draw(["Game Over!"]);
            return;
        }

        let flag = true;

        const rows = this.size.width;
        const columns = this.size.height;

        for (let xx = 0; xx < rows; xx++) {
            for (let yy = 0; yy < columns; yy++) {

                //check to see if there are any remaining uncovered cells
                //that are not also mines.
                if (!array[xx][yy].uncovered && !array[xx][yy].is_mine) {
                    flag = false;
                    break;
                }
            }
        }

        if (flag) {
            alert.draw(["You win!"]);
            this.game_over = true;
        }


    },

    check_first_move: function(array, x, y) {

        const rows = this.size.width;
        const columns = this.size.height;

        //if first move is a mine, move it to the first available cell
        while (array[x][y].is_mine) {

            array[x][y].is_mine = false;
            this.plant_mines(array, 1);

        }

        //now we can count adjacent mines
        this.count_adj_mines(this.game_array);

    },

    uncover_mines: function (array) {

        const rows = this.size.width;
        const columns = this.size.height;

        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < columns; y++) {
                if (array[x][y].is_mine)
                    array[x][y].uncovered = true;
            }
        }
    }

};

function spread_empty_cells (array, x, y, rows, columns) {

    const empty_cells = [[x, y]];

    while (empty_cells.length > 0) {

        for (let z = 0; z < DIRECTIONS.length; z++) {

            let dir_x = empty_cells[0][0] + DIRECTIONS[z][0];
            let dir_y = empty_cells[0][1] + DIRECTIONS[z][1];

            if (dir_x < 0 || dir_x >= rows || dir_y < 0 || dir_y >= columns)
                continue;

            if (array[dir_x][dir_y].uncovered)
                continue;

            if (array[dir_x][dir_y].flagged)
                continue;

            array[dir_x][dir_y].uncovered = true; 

            //if new cell is also blank then add it to the list
            if (array[dir_x][dir_y].adjecent_mines === 0 
                && !array[dir_x][dir_y].is_mine
                && !array[dir_x][dir_y].flagged)
                empty_cells.push([dir_x, dir_y]);;
            
        }

    empty_cells.shift();

    }

}