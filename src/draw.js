import { settings } from "./settings.js";
import { game } from "./game.js";

export const draw ={
    
    resize_canvas: function (game_ctx, score_ctx, title_ctx) {

        game_ctx.canvas.height = Math.max(window.innerHeight - settings.bar_height * 2 - settings.padding * 4, settings.min_height);
        game_ctx.canvas.width = Math.min(settings.max_width, window.innerWidth - settings.padding * 2);

        score_ctx.canvas.width = game_ctx.canvas.width;
        score_ctx.canvas.height = settings.bar_height;

        title_ctx.canvas.width = game_ctx.canvas.width;
        title_ctx.canvas.height = settings.bar_height;

        this.draw_titlebar(title_ctx);
        this.draw_game(game_ctx);

    },

    draw_titlebar: function (ctx) {

        const title = settings.title;

        let font_size = 40;
        const offset = 2;

        font_size = this.reduce_font(ctx, title, font_size, ctx.canvas.width / 1.25);

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

        const rows = array[0].length;
        const columns = array.length;

        const x_size = ctx.canvas.width / game.size.width;
        const y_size = ctx.canvas.height / game.size.height;

        let font_size = 40;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.font = `${font_size}px '${settings.font_face}'`;

        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < columns; y++) {

                let x_pos = x * x_size + x_size / 3;
                let y_pos = y * y_size + y_size / 1.5;

                if (!array[x][y].uncovered) {
                
                    if (array[x][y].is_mine) {
                        //draw mine
                        ctx.fillStyle = "black";
                        ctx.fillText(`B`, x_pos, y_pos);
                        continue;
                    }

                    if (array[x][y].adjecent_mines > 0) {
                        //draw number
                        let num = array[x][y].adjecent_mines;
                        ctx.fillStyle = settings.colors.get_color(num);
                        ctx.fillText(`${num}`, x_pos, y_pos);
                        continue;
                    }
                
                } else { 

                    if (array[x][y].flag) {
                        //draw flag
                        ctx.fillStyle = "red";
                        ctx.fillText(`F`, x_pos, y_pos);
                        continue;
                    }
                
                }
            }
        }

        this.draw_grid(ctx, x_size, y_size);

    },

    draw_grid: function (ctx, x_size, y_size) {

        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;

        ctx.beginPath();

        for(let x = x_size; x <= ctx.canvas.width - x_size; x += x_size) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ctx.canvas.height);
        }

        for (let y = y_size; y <= ctx.canvas.height; y += y_size) {
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
        }
        
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
