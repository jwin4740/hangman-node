const wordArrTest = ["James", "Evgheni", "Caroline", "Faith Hill"];

const inquirer = require("inquirer");
const utils = require("./utils/utils.js");
const Round = require("./utils/roundConstruct.js");
const Table = require("tty-table");
const chalk = require('chalk');
const mongojs = require("mongojs");
let categoryArray = [];
let curCategoryQuestions;


let db = mongojs('trivia2');
let qCollection = db.collection('questions');
let cCollection = db.collection('categories');
let won = false;


cCollection.find(function (err, docs) {
    docs.forEach((val) => {
        let temp = val.category_name;

        categoryArray.push(temp);
        categoryArray.sort();

    });
    play();
});







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
            chooseCategory(guesses)


        });
}

function chooseCategory(guesses) {

    inquirer
        .prompt([{
            type: "list",
            name: "categories",
            choices: categoryArray,
            message: "Choose your category"
        }])
        .then(function (val) {
            let curCategory = val.categories;
            getCategoryQuestions(curCategory, guesses);

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

function evaluate(letter, round) {
    if (round.guessesAlready.includes(letter)) {
        // round.guessesAlready.push(letter);
        utils.showWarning(round, "already guessed", letter);
        setTimeout(function () {
            utils.renderDisplay(round);
        }, 1000);
        guess(round);
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
                    round.displayState[index] = "_";
            }
        });
        checkStatus(round);
    }
}


function checkStatus(round) {
    if (round.guessesLeft === 0) {
        console.log("YOU LOSE");
        return;
    } else {
        let orig = round.originalArr().join(' ');
        let disp = round.displayState.join(' ');

        orig === disp ? changeWinState(round) : utils.renderDisplay(round);
        if (!won) {
            guess(round);
        }
    }
}

function changeWinState(round) {
    won = true;
    utils.renderDisplay(round)
    console.log("WINNER!!!!!");
}

function getCategoryQuestions(category, guesses) {

    qCollection.find({
            category: category
        },
        function (error, data) {
            curCategoryQuestions = data;
            let leng = curCategoryQuestions.length;
            let num = utils.getRand(leng);
            let round = new Round(curCategoryQuestions[num].answer, curCategoryQuestions[num].question, guesses);
            utils.renderDisplay(round);
            guess(round);
        });

}