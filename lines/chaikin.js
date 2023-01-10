// https://observablehq.com/@pamacha/chaikins-algorithm
function chaikin(arr, num) {
    if (num === 0) return arr;
    const l = arr.length;
    
    const smooth = arr.map((current, i) => {
        if (i < l - 1) {
            var x = 0;
            var y = 1;
            var next = arr[(i + 1)%l];
            return [
                [0.75*current[x] + 0.25*next[x], 0.75*current[y] + 0.25*next[y]],
                [0.25*current[x] + 0.75*next[x], 0.25*current[y] + 0.75*next[y]]
            ];
        } else {
            return [];
        }
    }).flat();
    return num === 1 ? smooth : chaikin(smooth, num - 1);
}

function chaikinSpline(x1, y1, x2, y2, weight, darkness) {
    for (var i=0; i<2; i++) {
        chaikinSpline2(x1, y1, x2, y2, weight, 0.7);
    }
}
function chaikinSpline2(x1, y1, x2, y2, weight, darkness) {
    var stepSize = 5;
    var step = getStep(x1, y1, x2, y2, stepSize);
    var numberOfSegments = getNumberOfSegments(x1, y1, x2, y2, stepSize);

    var points = [];
    var position = createVector(x1, y1);    
    for (var i=0; i<numberOfSegments; i++) {
        var newPosition = p5.Vector.add(position, step);

        var upOrDown = random(100) > 50 ? 1 : -1;
        var perpendicular = step.copy().rotate(upOrDown * HALF_PI);
        var p = newPosition.copy().add(perpendicular.mult(random()));
        points.push([[p.x], [p.y]]);

        position = newPosition; 
    }
    
    var res = chaikin(points, 5);
    res.unshift([x1, y1]); // restore the first point
      
    strokeWeight(weight);
    stroke(0, 100, 0, darkness);
    noFill();
    beginShape();
    curveVertex(res[0][0], res[0][1]);
    for (var i=0; i<res.length; i++) {
        var point = res[i];
        curveVertex(point[0], point[1]);
    }
    curveVertex(res[res.length-1][0], res[res.length-1][1]);
    endShape();
}