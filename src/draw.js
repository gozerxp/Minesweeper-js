import { settings } from "./settings.js";
import { game } from "./game.js";

const hover_pos = {
    x: null,
    y: null
};

export const draw = {
    
    resize_canvas: function (game_ctx, score_ctx, title_ctx) {

        game_ctx.canvas.height = Math.max(window.innerHeight - settings.bar_height * 2 - settings.padding * 4, settings.min_height);
        game_ctx.canvas.width = Math.min(settings.max_width, window.innerWidth - settings.padding * 2);

        score_ctx.canvas.width = game_ctx.canvas.width;
        score_ctx.canvas.height = settings.bar_height;

        title_ctx.canvas.width = game_ctx.canvas.width;
        title_ctx.canvas.height = settings.bar_height;

        this.draw_titlebar(title_ctx);
        this.draw_flag_toggle(score_ctx);
        this.draw_game(game_ctx);

    },

    draw_titlebar: function (ctx) {

        const title = settings.title;

        const offset = 2;

        let font_size = this.reduce_font(ctx, title, settings.font_size, ctx.canvas.width / 1);

        ctx.font = `${font_size}px '${settings.font_face}'`;

        let y = (ctx.canvas.height / 2) + font_size / 3;
        let x = ctx.canvas.width / 2 - (ctx.measureText(title).width / 2);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = settings.font_color;
        ctx.fillText(title, x, y);

        ctx.fillStyle = "white";
        ctx.fillText(title, x + offset, y + offset);

    },

    draw_game: function (ctx) {

        const array = game.game_array;

        const rows = array.length;
        const columns = array[0].length;

        const x_size = ctx.canvas.width / game.size.width;
        const y_size = ctx.canvas.height / game.size.height;

        let font_size = this.reduce_font(ctx, '#', settings.font_size,  x_size / 1.5);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < columns; y++) {

                let x_pos = x * x_size + x_size / 2 - ctx.measureText('#').width / 2;
                let y_pos = y * y_size + y_size / 2 + font_size / 2;

                if (array[x][y].uncovered) {
                
                    if (array[x][y].is_mine) {
                        //draw mine
                        ctx.fillStyle = "red";
                        ctx.fillRect(x * x_size, y * y_size, x_size, y_size);
                        ctx.fillStyle = "black";
                        ctx.fillText(`B`, x_pos, y_pos);
                    }

                    if (array[x][y].adjecent_mines > 0) {
                        //draw number
                        let num = array[x][y].adjecent_mines;
                        ctx.fillStyle = settings.colors.get_color(num);
                        ctx.fillText(`${num}`, x_pos, y_pos);
                    }
                
                } else { 
                    
                    ctx.fillStyle = x !== hover_pos.x || y !== hover_pos.y ? 
                        settings.block_color : settings.hover_color;
                    ctx.fillRect(x * x_size, y * y_size, x_size, y_size);

                    if (array[x][y].flagged) {
                        //draw flag
                        this.draw_cell_flag(ctx, x, y);

                    }
                
                }

                let cell_x = x * x_size;
                let cell_y = y * y_size;

                this.draw_cell_outline(ctx, cell_x, cell_y, x_size, y_size);

            }
        }

    },

    draw_cell_flag: function (ctx, x, y) {

        const x_size = ctx.canvas.width / game.size.width;
        const y_size = ctx.canvas.height / game.size.height;

        let font_size = this.reduce_font(ctx, '#', settings.font_size,  x_size / 1.5);

        let x_pos = x * x_size + x_size / 2 - ctx.measureText('#').width / 2;
        let y_pos = y * y_size + y_size / 2 + font_size / 2;

        ctx.fillStyle = "red";
        ctx.fillText(`F`, x_pos, y_pos);

    },

    draw_flag_toggle: function (ctx) {

        const flag_color = game.flag_mode ? "red" : "black";

        let font_size = this.reduce_font(ctx, 'F', settings.font_size,  100);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = flag_color;
        ctx.fillText(`F`, 20, 45);

    },

    draw_hover: function (ctx, x, y) {

        let cell_x, cell_y;

        const array = game.game_array;

        const rows = array.length;
        const columns = array[0].length;

        const x_size = ctx.canvas.width / game.size.width;
        const y_size = ctx.canvas.height / game.size.height;

        if (hover_pos.x === null || hover_pos.y === null) {
            hover_pos.x = x;
            hover_pos.y = y;
        }

        if (x !== hover_pos.x || y !== hover_pos.y) {

            if (!array[hover_pos.x][hover_pos.y].uncovered) {

                cell_x = hover_pos.x * x_size;
                cell_y = hover_pos.y * y_size;

                ctx.fillStyle = settings.block_color;
                ctx.fillRect(cell_x, cell_y, x_size, y_size);

                if (array[hover_pos.x][hover_pos.y].flagged)
                    this.draw_cell_flag(ctx, hover_pos.x, hover_pos.y);

                this.draw_cell_outline(ctx, cell_x, cell_y, x_size, y_size);

            }

            if (!array[x][y].uncovered) {

                cell_x = x * x_size;
                cell_y = y * y_size;
                
                ctx.fillStyle = settings.hover_color;
                ctx.fillRect(cell_x, cell_y, x_size, y_size);

                if (array[x][y].flagged)
                    this.draw_cell_flag(ctx, x, y);

                this.draw_cell_outline(ctx, cell_x, cell_y, x_size, y_size);

            }

            hover_pos.x = x;
            hover_pos.y = y;


        }

    },

    draw_cell_outline: function (ctx, x, y, x_size, y_size) {

        ctx.strokeStyle = settings.grid_color;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.rect(x, y, x_size, y_size);
        ctx.stroke();

    },

    reduce_font: function (ctx, text, font_size, max_size) {

        ctx.font = `${font_size}px '${settings.font_face}'`;

        while (ctx.measureText(text).width > max_size) {
            font_size--;
            ctx.font = `${font_size}px  '${settings.font_face}'`;
        }

        return font_size;
    }

};
