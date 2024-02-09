import { game } from "./game.js";
import { draw } from "./draw.js";
import { settings } from "./settings.js";

const game_canvas = document.getElementById("game");
const game_ctx = game_canvas.getContext("2d");

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

if (__touch_device__)
    game_canvas.ontouchstart = (e) => input(game_ctx, game.game_array, e.pageX, e.pageY);
else
    game_canvas.onclick = (e) => input(game_ctx, game.game_array, e.clientX, e.clientY);

window.onresize = () => draw.resize_canvas(game_ctx, score_ctx, title_ctx);

function input(ctx, array, x, y) {

    const rows = array.length;
    const columns = array[0].length;

    const x_size = ctx.canvas.width / rows;
    const y_size = ctx.canvas.height / columns;

    x = parseInt((x - settings.padding)  / x_size);
    y = parseInt((y - settings.bar_height - settings.padding * 2) / y_size);  

    game.uncover_block(x, y);

    draw.draw_game(ctx);

}