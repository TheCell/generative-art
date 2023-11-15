class GridCell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        stroke(0, 0, 0);
        rect(this.getLeft(), this.getTop(), options.cellSize, options.cellSize);
    }

    getLeft() {
        return this.x * options.cellSize;
    }

    getRight() {
        return this.getLeft() + options.cellSize;
    }

    getTop() {
        return this.y * options.cellSize;
    }

    getBottom() {
        return this.getTop() + options.cellSize;
    }
}