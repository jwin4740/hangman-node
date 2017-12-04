const wordArrTest = ["James", "Evgheni", "Caroline", "Faith Hill"];
let leng = wordArrTest.length;
const inquirer = require("inquirer");
const utils = require("./utils/utils.js");
const Round = require("./utils/roundConstruct.js");
const Table = require("tty-table");
const chalk = require('chalk');
// let wordArr;
// let wordProgess = [];




play();

function play() {
    let guesses;
    inquirer
        .prompt([{
            type: "list",
            name: "intro",
            choices: ["PLAY EASY", "PLAY HARD"],
            message: "Wanna Play a game"
        }])
        .then(function (val) {
            console.log(val.intro);
            if (val.intro == "PLAY EASY") {
                guesses = 10;
            } else {
                guesses = 5;
            }
            let round = new Round(wordArrTest[utils.getRand(leng)], "this is where the clue will be", guesses);
            utils.renderTable(round)
            // renderBoard(round);
        });
}


function guess(round) {

    inquirer
        .prompt([{
            type: "input",
            name: "choice",
            message: "PLEASE GUESS A LETTER" + "\n"
        }])
        .then(function (val) {

            if (val.choice) {
                // if it is letter 
                let upper = val.choice.toUpperCase();

                evaluate(upper, round);
            } else {
                console.log("see you later");
            }
        });


}


function renderBoard(round) {
    console.log("\n\n");
    console.log(round.clue);
    console.log("GUESSES LEFT: " + round.guessesLeft);
    console.log("GUESSES: " + round.guessesAlready.join(', '));
    console.log("\n\n")
    console.log(round.displayState.join(' '));

    console.log("\n");



    guess(round);

}









function evaluate(letter, round) {

    if (round.guessesAlready.includes(letter)) {
        // round.guessesAlready.push(letter);
        utils.showWarning(round, "already guessed", letter);
        setTimeout(function () {
            renderBoard(round);
        }, 1000);
    } else {
        round.guessesAlready.push(letter);
        round.guessesLeft--;



        round.originalArr().forEach(function (v, index) {
            switch (v) {
                case round.displayState[index]:
                    return;
                    break;
                case letter:
                    round.displayState[index] = letter;
                    break;
                case " ":
                    round.displayState[index] = " ";
                    break;
                default:
                    round.displayState[index] = "*";
            }
        });
        checkStatus(round);

    }
}


function checkStatus(round) {
    if (round.guessesLeft === 0) {
        console.log("YOU LOSE");
    } else {
        let orig = round.originalArr().join(' ');
        let disp = round.displayState.join(' ');
        orig === disp ? console.log("WINNER") : renderBoard(round);
    }

}