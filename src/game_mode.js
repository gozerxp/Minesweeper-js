import { settings } from "./settings.js";
import { draw } from "./draw.js";

export const game_mode = {
    0: {
        txt: "Easy",
        width: 9,
        height: 9,
        mines: 15,
    },
    1: {
        txt: "Intermediate",
        width: 16,
        height: 16,
        mines: 40,
    },
    2: {
        txt: "Expert",
        width: 30,
        height: 16,
        mines: 99,
    },

    current_mode: Number(localStorage.getItem("mode")) || 0,

    change_mode: function(new_mode) {

        if (new_mode < 0 || new_mode > 2)
            return false;

        if (this.current_mode !== new_mode) {

            this.current_mode = new_mode;

            //save mode for future games
            localStorage.setItem("mode", this.current_mode);
            return true;
        }

        return false;
    },

    get_mode: function(mode = this.current_mode) {
        return this[mode];
    },
};

export const mode_select = {

    active: false,
    mode_change: false,

    selected: game_mode.current_mode,
    hover: -1,
    categories: [],

    draw: function(ctx) {

        if(!this.active)
            return;

        this.categories = [];
        for (let i = 0; i < 3; i++) {
            this.categories.push({text: game_mode.get_mode(i).txt});
        }

        const margin = settings.margin;
    
        const font_size = draw.reduce_font(ctx, this.categories[1].text, settings.font_size, settings.title_font, ctx.canvas.width * 0.8);

        const w = ctx.measureText(this.categories[1].text).width;
        const h = font_size * this.categories.length + margin * this.categories.length;

        const size = [w + margin * 2,
                        h + margin * 3];
        const position = [ctx.canvas.width / 2 - (size[0] / 2),
                ctx.canvas.height / 2 - size[1] / 2];

        ctx.globalAlpha = settings.alpha;
        ctx.fillStyle = settings.alert_color;
        ctx.beginPath();
        ctx.roundRect(...position, ...size, settings.corner_radius);
        ctx.fill();
        ctx.globalAlpha = 1;

        for(let i = 0; i < this.categories.length; i++) {

            const text_size = ctx.measureText(this.categories[i].text).width;
            const text_pos = [ctx.canvas.width / 2 - text_size / 2,
                                position[1] + margin * 2.5];
            text_pos[1] += i * (font_size / 2 + margin * 2);

            this.categories[i].size = {
                w: w, 
                h: font_size
            };

            this.categories[i].pos = {
                x: position[0],
                y: text_pos[1]
            };

            let text_color = '';

            if (this.selected === i) {
                text_color = settings.select_mode_color;
            } else if(this.hover === i) {
                text_color = settings.select_mode_hover_color;
            } else {
                text_color = "white";
            }

            ctx.fillStyle = text_color

            ctx.fillText(this.categories[i].text, ...text_pos);
        }

    },

    hover_text: function(ctx, x, y) {

        if (!this.active)
            return;

        const previous_hover = this.hover    

        this.hover = -1

        for(let i = 0; i < this.categories.length; i++) {
        
            const e = this.categories[i];

            if (x >= e.pos.x && x <= e.pos.x + e.size.w 
                    && y >= e.pos.y && y <= e.pos.y + e.size.h) {
                    //
                    this.hover = i;
                    break;
                
            } 
        }

        if (this.hover !== previous_hover) {
            draw.draw_game(ctx);
            this.draw(ctx);
        }

    },

    confirm_select: function(x, y) {

        if (!this.active)
            return;

        for(let i = 0; i < this.categories.length; i++) {

            if(this.selected === i)
                continue;

            const e = this.categories[i];

            if (x >= e.pos.x && x <= e.pos.x + e.size.w 
                && y >= e.pos.y && y <= e.pos.y + e.size.h) {
                
                this.selected = i;
                this.mode_change = game_mode.change_mode(i);

                return;
                //
            }
        }

    }

};
