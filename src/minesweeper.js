import { settings } from "./settings.js";

const game_canvas = document.getElementById("game");
const game_ctx = game_canvas.getContext("2d");

const score_canvas = document.getElementById("score");
const score_ctx = score_canvas.getContext("2d");

const title_canvas = document.getElementById("title");
const title_ctx = title_canvas.getContext("2d");

//check for touchscreen
const __touch_device__ = window.ontouchstart !== undefined;

const block = {
    is_mine: false,
    uncovered: false,
    adjecent_mines: 0
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
const font = new FontFace(`${settings.font_face}`, `url(./assets/${settings.font_face}.ttf)`);

font.load().then((font) => {
    document.fonts.add(font);
    resize_canvas(game_ctx, score_ctx, title_ctx);
    
});

if (__touch_device__)
    game_canvas.ontouchstart = (e) => input(current_game.game_array, e.pageX, e.pageY);
else
    game_canvas.onclick = (e) => input(current_game.game_array, e.clientX, e.clientY);

window.onresize = () => resize_canvas(game_ctx, score_ctx, title_ctx);

function resize_canvas(game_ctx, score_ctx, title_ctx) {

    game_ctx.canvas.height = Math.max(window.innerHeight - settings.bar_height * 2 - settings.padding * 4, settings.min_height);
    game_ctx.canvas.width = Math.min(Math.max(settings.max_width, game_ctx.canvas.height), window.innerWidth - settings.padding * 2);

    score_ctx.canvas.width = game_ctx.canvas.width;
    score_ctx.canvas.height = settings.bar_height;

    title_ctx.canvas.width = game_ctx.canvas.width;
    title_ctx.canvas.height = settings.bar_height;

    draw_titlebar(title_ctx);

}

function draw_titlebar(ctx) {

    const title = settings.title;

    let font_size = 40;
    const offset = 2;
    
    font_size = reduce_font(ctx, title, font_size, ctx.canvas.width / 1.75);

    ctx.font = `${font_size}px '${settings.font_face}'`;

    let y = (ctx.canvas.height / 2) + font_size / 4;
    let x = ctx.canvas.width / 2 - (ctx.measureText(title).width / 2);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = settings.font_color;
    ctx.fillText(title, x, y);

    ctx.fillStyle = "white";
    ctx.fillText(title, x + offset, y + offset);

}

function reduce_font (ctx, text, font_size, max_size) {

    ctx.font = `${font_size}px '${settings.font_face}'`;
    while(ctx.measureText(text).width > max_size) {
        font_size--;
        ctx.font = `${font_size}px  '${settings.font_face}'`;
    }
    return font_size;
}

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