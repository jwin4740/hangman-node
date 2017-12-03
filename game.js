const wordArrTest = ["James", "Evgheni", "Caroline", "Faith Hill"];
let leng = wordArrTest.length;
const inquirer = require("inquirer");
const utils = require("./utils.js");
let Round = require("./roundConstruct.js");

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

            renderBoard(round);
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
    console.log(round.clue);
    console.log("\n\n")
    console.log(round.displayState.join(' '));
    console.log("GUESSES: " + round.guessesAlready.join(', '));
    console.log("\n");
    guess(round);

}









function evaluate(letter, round) {

    if (round.guessesAlready.includes(letter)) {
        // round.guessesAlready.push(letter);
        showWarning(round);
    } else {
        round.guessesAlready.push(letter);

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
    let orig = round.originalArr().join(' ');
    let disp = round.displayState.join(' ');
    orig === disp ? console.log("WINNER") : renderBoard(round);

}


function showWarning(round) {

}


// renderBoard(round);