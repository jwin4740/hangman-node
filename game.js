const wordArrTest = ["James", "Evgheni", "Caroline", "Faith Hill"];
let leng = wordArrTest.length;
const inquirer = require("inquirer");
const utils = require("./utils.js");
// let wordArr;
// let wordProgess = [];



function Round(word, clue) {
    this.word = word;
    this.clue = clue;
    this.originalArr = function () {
        return this.word.toUpperCase().split('');
    };
    this.displayState = this.originalArr().map(v => {
        return v === " " ? " " : "*";

    });



}
let round = new Round(wordArrTest[utils.getRand(leng)], "this is where the clue is");



// function playAgain() {
//     inquirer
//         .prompt([{
//             type: "confirm",
//             name: "choice",
//             message: "Play Again?"
//         }])
//         .then(function (val) {

//             if (val.choice) {
//                 // call game functions
//             } else {
//                 console.log("see you later");
//             }
//         });
// }


function guess() {

    inquirer
        .prompt([{
            type: "input",
            name: "choice",
            message: "PLEASE GUESS A LETTER" + "\n"
        }])
        .then(function (val) {

            if (val.choice) {

                let upper = val.choice.toUpperCase();
                evaluate(upper, round);



                // call game functions
            } else {
                console.log("see you later");
            }
        });


}

function renderBoard(round) {
    console.log(round.clue);
    console.log("\n\n")
    console.log(round.displayState.join(' '));
    console.log("\n");
    guess();

}


function evaluate(letter, round) {
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


function checkStatus(round) {
    let orig = round.originalArr().join(' ');
    let disp = round.displayState.join(' ');

    // if (orig === disp) {
    //     console.log("YOU WIN");
    // } else {
    //     renderBoard(round);
    // }

    orig === disp ? console.log("WINNER") : renderBoard(round);

}


renderBoard(round);