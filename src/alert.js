import { draw } from './draw.js';
import { settings } from './settings.js';
import { game_ctx } from "./minesweeper.js";

export const alert = {

    active: false,
    text: '',

    draw: function (txt = this.text) {

        const ctx = game_ctx;

        this.active = true;
        this.text = txt;

        if (!this.text.length)
            this.text = "sloane is leet";

        const margin = settings.margin;

        let font_size = draw.reduce_font(ctx, txt, settings.font_size, settings.title_font, ctx.canvas.width / 1.2 - margin);

        const w = ctx.measureText(`${txt}`).width;
        let h = font_size;

        const size = [w + margin * 2, h + margin * 2];
        const position = [ctx.canvas.width / 2 - (size[0] / 2),
                ctx.canvas.height / 2 - size[1] / 2];

        const txt_position = [ctx.canvas.width / 2 - w / 2,
                ctx.canvas.height / 2 + h / 2];

        ctx.globalAlpha = settings.alpha;
        ctx.fillStyle = settings.alert_color;
        ctx.beginPath();
        ctx.roundRect(...position, ...size, settings.corner_radius);
        ctx.fill();
        ctx.globalAlpha = 1;

        const offset = settings.offset;
        ctx.fillStyle = "black";
        ctx.fillText(`${txt}`, txt_position[0] + offset, txt_position[1] + offset);

        ctx.fillStyle = "white";
        ctx.fillText(`${txt}`, ...txt_position);

    }
    
};
