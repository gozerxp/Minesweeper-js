export const game_mode = {
    0: {
        width: 9,
        height: 9,
        mines: 15,
    },
    1: {
        width: 16,
        height: 16,
        mines: 40,
    },
    2: {
        width: 30,
        height: 16,
        mines: 99,
    },

    current_mode: 1,

    change_mode: function (new_mode) {

        if (new_mode < 0 || new_mode > 2)
            return;

        this.current_mode = new_mode;
    },

    get_mode: function () {
        return this[this.current_mode];
    },

    get_mode_txt: function () {
        switch (this.current_mode) {
            case 0:
                return "Easy";
            case 1:
                return "Intermediate";
            case 2:
                return "Expert";
            default:
                return "Custom";
        }
    }
};
