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
    game_canvas.ontouchstart = (e) => input(game.game_array, e.pageX, e.pageY);
else
    game_canvas.onclick = (e) => input(game.game_array, e.clientX, e.clientY);

window.onresize = () => draw.resize_canvas(game_ctx, score_ctx, title_ctx);

function input(array, x, y) {

}