const DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

const block = {
    is_mine: false,
    flag: false,
    uncovered: false,
    adjecent_mines: 0
};

const game_mode = {
    0: {
        width: 8,
        height: 8,
        mines: 20,
    },
    1: {
        width: 15,
        height: 15,
        mines: 25,
    },
    2: {
        width: 25,
        height: 25,
        mines: 50,
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

    uncovered_count: 0,
    flag_count: 0,
    time: 0,

    reset: function () {

        const get_mode = game_mode[this.mode];

        this.time = 0;
        this.uncovered_count = 0;
        this.mines = get_mode.mines;
        this.size.update(get_mode.width, get_mode.height);
        this.game_array = this.reset_array(get_mode.width, get_mode.height);
        this.plant_mines(this.game_array, this.mines);
        this.count_adj_mines(this.game_array);

        //console.log(this.game_array);

    },

    reset_array: function (width, height) {

        let rows = [];
        for (let x = 0; x < width; x++) {
            let columns = [];
            for (let y = 0; y < height; y++) {
                columns.push({...block});
            }
            rows.push(columns);
        }

        return rows;
    },

    plant_mines: function(array, max_mines) {

        const width = array[0].length;
        const height = array.length;
        
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

        const rows = array[0].length;
        const columns = array.length;

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

    game_over: function() {
        
    },

    uncover_block: function(x, y) {

        if (this.game_array[x][y].uncovered) return;

        this.game_array[x][y].uncovered = true;
        this.uncovered_count++;

        //tripped mine
        if (this.game_array[x][y].is_mine) {
            this.game_over();
            return;
        }

    }
};
