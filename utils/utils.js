const Round = require("./roundConstruct.js");
const Table = require("tty-table");
const chalk = require('chalk');






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
    },

    renderDisplay: function (round) {
        this.renderTable(round);
        this.renderBoard(round);
    },
    renderTable: function (round) {
        let header = [{
            alias: "CLUE",
            value: "clue",
            width: 55,
            headerColor: "magenta"
        }, {
            value: "guessLeft",
            alias: "GUESSES LEFT",
            color: "red",
            width: 25,
            align: "center",
            formatter: function (value) {
                return chalk.yellow.bold(value);
            }
        }, {
            value: "guessed",
            alias: "GUESSES",
            headerColor: "cyan",
            color: "white",
            align: "center",
            width: 40,
            formatter: function (value) {
                return chalk.yellow.bold(value);
            }
        }];

        //Example with arrays as rows 
        let rows = [
            [round.clue, round.guessesLeft, round.guessesAlready],
        ];

        let t1 = Table(header, rows, {
            borderStyle: 1,
            borderColor: "green",
            paddingLeft: 2,
            headerAlign: "center",
            align: "left",
            color: "white"

        });
        let str1 = t1.render();
        console.log(str1);
    },
    renderBoard: function (round) {
        let cfonts = require('cfonts');
        cfonts.say(round.displayState.join(" "), {
            font: 'block', //define the font face 
            align: 'left', //define text alignment 
            colors: ['yellow', "magenta"], //define all colors 
            background: 'Black', //define the background color 
            letterSpacing: 0, //define letter spacing 
            lineHeight: 1, //define the line height 
            space: true, //define if the output text should have empty lines on top and on the bottom 
            maxLength: '0' //define how many character can be on one line 
        });
    },
}

module.exports = utils;