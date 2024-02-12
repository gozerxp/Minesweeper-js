
export const settings = {

    bar_height: 55,
    min_height: 400,
    max_width: 1200,
    padding: 4,

    title: "Minesweeper.js",

    title_font: "Sixtyfour",
    symbol_font: "NotoSans",
    font_color: "black",
    grid_color: "black",
    font_size: 34,
    offset: 3,

    block_color: "rgb(50, 125, 200)",
    hover_color: "rgb(75, 150, 225)",
    explode_color: "red",
    uncovered_mine_color: "darkorange",
    alert_color: "black",
    alpha: .75,
    corner_radius: 15,

    mine_symbol: '🕱',
    flag_symbol: '🏲',

    colors: {
        1: "blue",
        2: "green",
        3: "red",
        4: "darkblue",
        5: "brown",
        6: "cyan",
        7: "black",
        8: "gray",
        
        get_color: function (num) {
            return this[num];
        }
    }
    
};

