
export const settings = {

    bar_height: 55,
    min_height: 400,
    max_width: 1250,
    padding: 4,

    title: "Minesweeper.js",

    font_face: "Sixtyfour",
    font_color: "black",
    grid_color: "black",
    font_size: 40,

    block_color: "rgb(50, 125, 200)",
    hover_color: "rgb(75, 150, 225)",

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
