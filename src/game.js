const DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

const cell = {
    is_mine: false,
    flagged: false,
    uncovered: false,
    adjecent_mines: 0
};

const game_mode = {
    0: {
        width: 9,
        height: 9,
        mines: 15,
    },
    1: {
        width: 16,
        height: 16,
        mines: 40,
    },
    2: {
        width: 30,
        height: 16,
        mines: 99,
    },

    get_mode: function (num) {
        return this[num];
    }
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

    mode: 0,

    game_array: [],
    mines: 0,

    time: 0,
    first_move: true,
    game_over: false,

    reset: function () {

        console.clear();
        const get_mode = game_mode[this.mode];
        this.time = 0;
        this.first_move = true;
        this.game_over = false;
        this.mines = get_mode.mines;
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

        const width = array.length;
        const height = array[0].length;
        
        let planted = 0;

        do {
            //randomize placement
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);

            //make sure it's not already a mine.
            if (!array[x][y].is_mine) {
                array[x][y].is_mine = true;
                planted++;
            }

        } while (planted < max_mines)

    },

    count_adj_mines: function(array) {

        const rows = array.length;
        const columns = array[0].length;

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
            return;
        }

        const array = this.game_array;
        const rows = array.length;
        const columns = array[0].length;

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
            this.uncover_mines(array);
            console.log("Game Over!");
            return;
        }

        let flag = true;

        const rows = array.length;
        const columns = array[0].length;

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
            console.log("You win!");
            this.game_over = true;
        }


    },

    check_first_move: function(array, x, y) {

        const rows = array.length;
        const columns = array[0].length;

        //if first move is a mine, move it to the first available cell
        if (array[x][y].is_mine) {
            for (let xx = 0; xx < rows; xx++) {
                for (let yy = 0; yy < columns; yy++) {
                    if (!array[xx][yy].is_mine)
                        array[x][y].is_mine = false
                        array[xx][yy].is_mine = true;
                        break;
                }
            }
        }

        //now we can count adjacent mines
        this.count_adj_mines(this.game_array);

    },

    uncover_mines: function (array) {

        const rows = array.length;
        const columns = array[0].length;

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

            array[dir_x][dir_y].uncovered = true; 

            //if new cell is also blank then add it to the list
            if (array[dir_x][dir_y].adjecent_mines === 0 && !array[dir_x][dir_y].is_mine)
                empty_cells.push([dir_x, dir_y]);;
            
        }

    empty_cells.shift();

    }

}