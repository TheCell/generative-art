class Character {
    constructor(w, h, capital) {
        this.capital = capital;
        this.w = w;
        this.h = h;
        if (capital) {
            this.numberOfPoints = Math.round(random()*3)+5;
        } else {
            this.numberOfPoints = Math.round(random()*6)+2;
        }
        this.points = [];
        for (var i=0; i<this.numberOfPoints; i++) {
            var randomX = this.getRandomX(this.capital, i, this.numberOfPoints);
            var randomY = this.getRandomY(this.capital, i, this.numberOfPoints);

            this.points.push([randomX, randomY]);
        }
        this.spline = chaikin(this.points, 3);
        this.mostLeft = w;
        this.mostRight = 0;
        for (var i=0; i<this.spline.length; i++) {
            if (this.spline[i][0] < this.mostLeft) {
                this.mostLeft = Math.round(this.spline[i][0]);
            }
            if (this.spline[i][0] > this.mostRight) {
                this.mostRight = Math.round(this.spline[i][0]);
            }
        }
    }

    draw(x, y) {
        this.drawSpline(x, y, this.spline, ['#000000']);
        //rect(x, y, this.getWidth(), this.h);
    }
    
    drawSpline(x, y, points, colorPalette) {
        var xOffset = x - this.mostLeft;
        var c = color(colorPalette[Math.floor(random()*colorPalette.length)]);
        c.setAlpha(220);
        stroke(0, 0, 0, 150);
        fill(c);
        noFill();
        beginShape();
        curveVertex(xOffset + points[0][0], y + points[0][1]);
        for (var i=0; i<points.length; i++) {
            var point = points[i];
            curveVertex(xOffset + point[0], y + point[1]);
        }
        curveVertex(xOffset + points[points.length-1][0], y + points[points.length-1][1]);
        endShape();
    }

    getRandomX(_capital, index, numberOfPoints) {
        if (index === 0) {
            return 0; // left side
        } else if (index === Math.round(numberOfPoints)-1) {
            return this.w; // right side
        } else {
            return random()*this.w;
        }
    }

    getRandomY(capital, index, numberOfPoints) {
        if (capital) {
            if (index === 0) {
                return 0;
            } else if (index === Math.floor(numberOfPoints)-1) {
                return this.h;
            }
            return random()*this.h;
        } else {
            return random()*this.h/2+this.h/2;
        }
    }

    getWidth() {
        return this.mostRight - this.mostLeft;
    }
}