function sandLine(x1, y1, x2, y2, weight, darkness) {
    var points = [];
    for (var i=0; i.toFixed(2)<=1; i+=0.05) {
        points.push([lerp(x1, x2, i), lerp(y1, y2, i)]);
    }
    stroke(0, 100, 0, 0.1);
    //drawPoints(points);
    var offset = map(weight, 1, 5, 1, 2);
    for (var i=0; i<darkness * 10 + weight * 4; i++) {
        adaptAndDraw(points, offset);
    }
}

function adaptAndDraw(points, offset, count = 10) {
    if (count <= 0) {
        drawPoints(points);
        return;
    }

    var newPoints = [];
    for (var i=0; i<points.length; i++) {
        var p = points[i];
        newPoints.push([
            p[0] + random() * (offset * 2) - offset,
            p[1] + random() * (offset * 2) - offset
        ]);
    }
    adaptAndDraw(newPoints, offset, count-1);
}

function drawPoints(points) {
    for (var i=0; i<points.length; i++) {
        if (i > 0) {
            var p1 = points[i-1];
            var p2 = points[i];
            for (var l=0; l.toFixed(2)<=1; l+=0.05) {
                var x = lerp(p1[0], p2[0], l);
                var y = lerp(p1[1], p2[1], l);
                point(x, y);
            }
        }
    }
}