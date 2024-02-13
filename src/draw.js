import { settings } from "./settings.js";
import { game } from "./game.js";
import { alert } from "./alert.js";
import { mode_select } from "./game_mode.js";

const hover_pos = {
    x: null,
    y: null
};

export const draw = {
    
    resize_canvas: function (game_ctx, score_ctx, title_ctx) {

        const aspect_ratio = game.size.width / game.size.height;

        game_ctx.canvas.height = Math.max(window.innerHeight - settings.bar_height * 2 - settings.padding * 4, settings.min_height);
        game_ctx.canvas.width = Math.min(game_ctx.canvas.height * aspect_ratio, window.innerWidth - settings.padding * 2);

        score_ctx.canvas.width = game_ctx.canvas.width;
        score_ctx.canvas.height = settings.bar_height;

        title_ctx.canvas.width = game_ctx.canvas.width;
        title_ctx.canvas.height = settings.bar_height;

        this.draw_titlebar(title_ctx);
        this.draw_flag_toggle(score_ctx);
        this.draw_mines_left(score_ctx);
        this.draw_game(game_ctx);

        if (alert.active) {
            alert.draw();
        }

        if (mode_select.active) {
            mode_select.draw(game_ctx);
        }

    },

    draw_titlebar: function (ctx) {

        const title = settings.title;

        const offset = settings.offset;

        let font_size = this.reduce_font(ctx, title, settings.font_size, settings.title_font, ctx.canvas.width / 1.5);

        let y = (ctx.canvas.height / 2) + font_size / 2;
        let x = ctx.canvas.width / 2 - (ctx.measureText(title).width / 2);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = settings.font_color;
        ctx.fillText(title, x, y);

        ctx.fillStyle = "white";
        ctx.fillText(title, x + offset, y + offset);

        font_size = this.reduce_font(ctx, settings.mode_select_symbol, settings.font_size, settings.symbol_font, 100);

        const icon_pos = {x: 15, y: ctx.canvas.height / 2 + font_size / 2.5};

        const icon = mode_select.active ? settings.mode_select_x : settings.mode_select_symbol;
        
        icon_pos.y += mode_select.active ? -3 : 0;
        
        ctx.fillStyle = settings.font_color;
        ctx.fillText(icon, icon_pos.x, icon_pos.y);

        ctx.fillStyle = mode_select.active ? "red" : "white";
        ctx.fillText(icon, icon_pos.x + offset + 1, icon_pos.y + offset + 1);

    },

    draw_game: function (ctx) {

        const array = game.game_array;

        const rows = game.size.width;
        const columns = game.size.height;

        const x_size = ctx.canvas.width / rows;
        const y_size = ctx.canvas.height / columns;

        let font_size = this.reduce_font(ctx, '#', settings.font_size, settings.title_font, x_size / 2.5);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < columns; y++) {

                ctx.font = `${font_size}px '${settings.title_font}'`
                let x_pos = x * x_size + x_size / 2 - ctx.measureText('#').width / 2;
                let y_pos = y * y_size + y_size / 2 + font_size / 2;

                if (array[x][y].uncovered) {
                
                    if (array[x][y].is_mine) {
                        //draw mine
                        ctx.fillStyle = game.tripped_mine.x === x && game.tripped_mine.y ===y ?
                                                settings.tripped_mine_color : 
                                                array[x][y].flagged ? 
                                                    settings.flagged_mine_color : settings.uncovered_mine_color;
                        ctx.fillRect(x * x_size, y * y_size, x_size, y_size);
                        
                        ctx.fillStyle = "black";

                        const font_increase = 15;
                        ctx.font = `${font_size + font_increase}px '${settings.symbol_font}'`;
                        ctx.fillText(settings.mine_symbol, x_pos - (font_increase / 2), y_pos + (font_increase / 4));

                    }

                    else if (array[x][y].adjecent_mines > 0) {
                        //draw number
                        let num = array[x][y].adjecent_mines;
                        ctx.fillStyle = settings.colors.get_color(num);
                        ctx.fillText(`${num}`, x_pos, y_pos);
                    }
                
                } else { 
                    
                    ctx.fillStyle = x !== hover_pos.x 
                                        || y !== hover_pos.y 
                                            || (array[x][y].flagged && !game.flag_mode) ? 
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

        let font_size = this.reduce_font(ctx, settings.flag_symbol, settings.font_size, settings.symbol_font, x_size / 2.5);

        let x_pos = x * x_size + x_size / 2 - ctx.measureText(settings.flag_symbol).width / 2;
        let y_pos = y * y_size + y_size / 2 + font_size / 2.5;

        ctx.fillStyle = settings.flag_color;
        ctx.fillText(settings.flag_symbol, x_pos, y_pos);

    },

    draw_flag_toggle: function (ctx) {

        const flag_color = game.flag_mode ? settings.flag_color : settings.font_color;

        const font_size = this.reduce_font(ctx, settings.flag_symbol, settings.font_size, settings.symbol_font, 100);

        ctx.clearRect(0, 0, 100, ctx.canvas.height);
        ctx.fillStyle = flag_color;
        ctx.fillText(settings.flag_symbol, 20, ctx.canvas.height / 2 + font_size / 3);

    },

    draw_mines_left (ctx) {

        const txt = `${settings.mine_symbol} ${this.generate_font_numbers(game.mines_left)}`;
        const offset = settings.offset;

        const font_size = this.reduce_font(ctx, txt, settings.font_size, settings.symbol_font, ctx.canvas.width / 2);

        const w = ctx.measureText(txt).width;
        const center_pos = ctx.canvas.width / 2 - w / 2;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = settings.font_color;
        ctx.fillText(txt, center_pos, 40);

        ctx.fillStyle = "white";
        ctx.fillText(txt, center_pos + offset, 40 + offset);

        this.draw_flag_toggle(ctx);

    },

    generate_font_numbers(num) {

        const txt_numbers = ['🯰', '🯱', '🯲', '🯳', '🯴', '🯵', '🯶', '🯷', '🯸', '🯹'];

        const num_str = num.toString();

        let new_txt = '';

        for(const char of num_str) {
            if (char === '-') {
                new_txt += '-';
            } else {
                new_txt += txt_numbers[parseInt(char)];
            }
        }

        return new_txt;

    },

    draw_cell_hover: function (ctx, x, y) {

        let cell_x, cell_y;

        const array = game.game_array;

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

            if (!array[x][y].uncovered && (!array[x][y].flagged || game.flag_mode)) {

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

    reduce_font: function (ctx, text, font_size, font_face, max_size) {

        ctx.font = `${font_size}px '${font_face}'`;

        while (ctx.measureText(text).width > max_size) {
            font_size--;
            ctx.font = `${font_size}px  '${font_face}'`;
        }

        return font_size;
    }

};
