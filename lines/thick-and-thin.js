function thickAndThinLine(x1, y1, x2, y2, weight, darkness) {
    stroke(0, 100, 0, darkness);
    var stepSize = 5;
    var step = getStep(x1, y1, x2, y2, stepSize);
    var numberOfSegments = getNumberOfSegments(x1, y1, x2, y2, stepSize);

    var forthOrBack = random(100) > 50 ? 1 : -1;
    var firstCut = numberOfSegments / 3 * 1 + forthOrBack * random(numberOfSegments / 10);
    var secondCut = numberOfSegments / 3 * 1 + numberOfSegments / 9 * 1 + forthOrBack * random(numberOfSegments / 10);
    var thirdCut = numberOfSegments / 3 * 2 - numberOfSegments / 9 * 1 + forthOrBack * random(numberOfSegments / 10);
    var fourthCut = numberOfSegments / 3 * 2 + forthOrBack * random(numberOfSegments / 10);
    var position = createVector(x1, y1);
    var mappedWeight = map(weight, 1, 5, 0, 1);    
    strokeWeight(4 + mappedWeight * 4);
    for (var i=0; i<numberOfSegments; i++) {
        var newPosition = p5.Vector.add(position, step);

        if (i >= fourthCut) {
            strokeWeight(3 + mappedWeight * 4);
        } else if (i >= thirdCut) {
            strokeWeight(1 + mappedWeight * 2);
        } else if (i >= secondCut) {
            strokeWeight(0);
        } else if (i >= firstCut) {
            strokeWeight(1 + mappedWeight * 2);
        }

        line(position.x, position.y, newPosition.x, newPosition.y);

        position = newPosition; 
    }
}