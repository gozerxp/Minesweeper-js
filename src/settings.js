
export const settings = {

    bar_height: 55,
    min_height: 400,
    max_width: 1250,
    padding: 4,

    title: "Minesweeper.js",

    font_face: "Sixtyfour",
    font_color: "black",
    font_size: 40,

    block_color: "rgb(50, 125, 200)",

    colors: {
        1: "green",
        2: "lime",
        3: "yellow",
        4: "orange",
        5: "red",
        6: "darkred",
        7: "darkred",
        8: "darkred",
        
        get_color: function (num) {
            return this[num];
        }
    }
};
