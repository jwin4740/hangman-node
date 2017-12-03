function Round(word, clue, guessesLeft) {
    this.word = word;
    this.clue = clue;
    this.guessesLeft = guessesLeft;
    this.guessesAlready = [];
    this.displayState = this.originalArr().map(v => {
        return v === " " ? " " : "*";

    });
}

Round.prototype.originalArr = function () {
    return this.word.toUpperCase().split('');
};

module.exports = Round;