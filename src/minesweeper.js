const game_canvas = document.getElementById("game");
const game_ctx = game_canvas.getContext("2d");

const score_canvas = document.getElementById("score");
const score_ctx = score_canvas.getContext("2d");

const title_canvas = document.getElementById("title");
const title_ctx = title_canvas.getContext("2d");

const block = {
    is_mine: false,
    uncovered: false,
    adjecent_mines: 0
};

const DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

const settings = {
    font: "verdana",
    colors: {
        1: "black",
        2: "black",
        3: "yellow",
        4: "yellow",
        5: "orange",
        6: "orange",
        7: "red",
        8: "red",
        get_color: function(num) {
            return this[num];
        }
    }
};

const game_mode = {

    0: { // easy mode
        width: 10,
        height: 10,
        mines: 10,
    },
    1: { // intermediate
        width: 15,
        height: 15,
        mines: 15,
    },
    2: { // expert
        width: 25,
        height: 25,
        mines: 20,
    },

    get_mode: function(num) {
        return this[num];
    }

};

const current_game = {

    size: {
        width: 0,
        height: 0,
        update: function(width, height) {
            this.width = width;
            this.height = height;
        }
    },

    mode: 0,

    game_array: [],
    mines: 0,

    found: 0,
    time: 0,

    reset: function() {

        const get_mode = game_mode[this.mode];

        this.time = 0;
        this.found = 0;
        this.mines = get_mode.mines;
        this.size.update(get_mode.width, get_mode.height);
        this.game_array = generate_grid(get_mode.width, get_mode.height);

    }
}

current_game.reset();

function generate_grid(width, height) {

    let new_grid = [];
    return new_grid;

}

function randomize_mines(array) {

}

function count_adjecent_mines(array) {

}

function uncover_block(array) {

}

function update(array, x, y) {

}

function draw(array) {

}

function draw_grid(width, height) {

}

function input(array, x, y) {

}