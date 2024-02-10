import { game } from "./game.js";
import { draw } from "./draw.js";
import { settings } from "./settings.js";
import { alert } from "./alert.js";

const game_canvas = document.getElementById("game");
export const game_ctx = game_canvas.getContext("2d");

const score_canvas = document.getElementById("score");
const score_ctx = score_canvas.getContext("2d");

const title_canvas = document.getElementById("title");
const title_ctx = title_canvas.getContext("2d");

//check for touchscreen
const __touch_device__ = window.ontouchstart !== undefined;

game.reset();

const font = new FontFace(`${settings.font_face}`, `url(./assets/${settings.font_face}.ttf)`);

font.load().then((font) => {
    document.fonts.add(font);
    draw.resize_canvas(game_ctx, score_ctx, title_ctx);
    draw.draw_game(game_ctx);
});

if (__touch_device__) {
    game_canvas.ontouchstart = (e) => input(game_ctx, game.game_array, e.pageX, e.pageY);
    score_canvas.ontouchstart = (e) => toggle_flag(score_ctx, e.pageX, e.pageY);
} else {
    game_canvas.onclick = (e) => input(game_ctx, game.game_array, e.clientX, e.clientY);
    game_canvas.onmousemove = (e) => hover(game_ctx, game.game_array, e.clientX, e.clientY);
    score_canvas.onclick = (e) => toggle_flag(score_ctx, e.clientX, e.clientY);
}

window.onresize = () => draw.resize_canvas(game_ctx, score_ctx, title_ctx);

function toggle_flag(ctx, x, y) {

    const width = 75;
    const height = ctx.canvas.height;

    if (x < 0 || x > width || y < 0)
        return;

    game.flag_mode = !game.flag_mode;
    draw.draw_flag_toggle(ctx);

}

function hover(ctx, array, x, y) {

    if (game.game_over || alert.active) 
        return;

    const mouse_position = get_mouse_coordinates(ctx, array, x, y);
    draw.draw_hover(ctx, mouse_position.x, mouse_position.y);

}

function input(ctx, array, x, y) {

    if (alert.active) {
    
        alert.active = false;
    
    } else {

        const mouse_position = get_mouse_coordinates(ctx, array, x, y);
        game.uncover_cell(mouse_position.x, mouse_position.y);

    }

    draw.draw_game(ctx);
    
    if (alert.active)
        alert.draw();

}

function get_mouse_coordinates(ctx, array, x, y) {

    const rows = array.length;
    const columns = array[0].length;

    const x_size = ctx.canvas.width / rows;
    const y_size = ctx.canvas.height / columns;

    const grid_x = parseInt((x - settings.padding)  / x_size);
    const grid_y = parseInt((y - settings.bar_height - settings.padding * 2) / y_size);  

    return {x: grid_x, y: grid_y};

}