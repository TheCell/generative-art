function reached(x1, y1, x2, y2) {
    var mag = createVector(x2, y2).sub(createVector(x1, y1)).mag();
    console.log('m', mag);
    return mag < 1;
}

function spiralLine(x1, y1, x2, y2, weight, darkness) {
  /*  var cX = 30;
    var cY = 130;
    var radius = 50;
    for (var i=0; i<10000; i++) {
        var angle = cX % 360;
        var x = cX + (radius * cos(angle));
        var y = cY + (radius * sin(angle));
        cX += 0.2;
        point(x, y);
    }
*/


    var centerX = x1;
    var centerY = y1;
    for (var dist = 0; dist.toFixed(2) <= 1.01; dist += 0.01) {
        var dx = lerp(x1, x2, dist);
        var dy = lerp(y1, y2, dist);
        console.log('dx',dx);
        console.log('dy',dy);
        console.log('dist',dist.toFixed(2));

        point(centerX, centerY);

        centerX = dx;
        centerY =  dy;
    }
}