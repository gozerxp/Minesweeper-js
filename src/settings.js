export const settings = {
    bar_height: 55,
    min_height: 400,
    max_width: 800,
    padding: 4,

    title: "Minesweeper.js",

    font_face: "Sixtyfour",
    font_color: "black",

    colors: {
        1: "black",
        2: "black",
        3: "yellow",
        4: "yellow",
        5: "orange",
        6: "orange",
        7: "red",
        8: "red",
        get_color: function (num) {
            return this[num];
        }
    }
};
