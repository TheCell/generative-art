

function getStep(x1, y1, x2, y2, stepSize) {
    var from = createVector(x1, y1);
    var to = createVector(x2, y2);
    var completeLine = p5.Vector.sub(to, from)
    return completeLine.copy().normalize().mult(stepSize);
}

function getNumberOfSegments(x1, y1, x2, y2, stepSize) {
    var from = createVector(x1, y1);
    var to = createVector(x2, y2);
    var stepSize = 5;
    var completeLine = p5.Vector.sub(to, from)
    var step = completeLine.copy().normalize().mult(stepSize);
    var length = completeLine.copy().mag();
    var stepLength = step.copy().mag();
    return length/stepLength;
}