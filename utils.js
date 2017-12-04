let utils = {
    getRand: function (length) {
        return Math.floor(Math.random() * length);
    },
    showWarning: function (round, ...args) {

        switch (args[0]) {
            case "already guessed":
                console.log("---------------------- SORRY, " + args[1] + " HAS ALREADY BEEN GUESSED ----------------------------------------");
                break;

        }
      



    }



}

module.exports = utils;