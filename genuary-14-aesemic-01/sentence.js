class Sentence {
    constructor(w, h) {
        this.w = w;
        this.numberOfWords = Math.round(random()*3) + 3;
        this.words = [];
        for (var i=0; i<this.numberOfWords; i++) {
            var isNoun = random()*100 < 20;
            this.words.push(new Word(w, h, i == 0 || isNoun));
        }
    }

    draw(x, y) {
        var currentX = x;
        for (var i=0; i<this.words.length; i++) {
            this.words[i].draw(currentX, y);
            currentX += this.words[i].getWidth() + this.w;
        }
    }

    getWidth() {
        var sentenceWidth = 0;
        for (var i=0; i<this.words.length; i++) {
            sentenceWidth += this.words[i].getWidth() + this.w;
        }
        return sentenceWidth;
    }
}