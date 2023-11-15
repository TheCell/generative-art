class Word {
    constructor(w, h, capital) {
        this.numberOfCharacters = random()*7 + 3;
        this.characters = [];
        for (var i=0; i<this.numberOfCharacters; i++) {
            this.characters.push(new Character(w, h, capital && i==0));
        }
    }

    draw(x, y) {
        var currentX = x;
        for (var i=0; i<this.characters.length; i++) {
            this.characters[i].draw(currentX, y);
            currentX += 2 + this.characters[i].getWidth();
        }
    }

    getWidth() {
        var wordWidth = 0;
        for (var i=0; i<this.numberOfCharacters; i++) {
            wordWidth += 2 + this.characters[i].getWidth();
        }
        return wordWidth;
    }
}