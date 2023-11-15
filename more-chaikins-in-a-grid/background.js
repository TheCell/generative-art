const Background = {
    None: 'None',
    Curves: 'Curves',
    LargeCircles: 'Large circles',
    Checked: 'Checked',
    Colored: 'Just a color'
}

function drawBackground() {
    switch (options.background) {
        case Background.LargeCircles:
            drawLargeCircles();
            break;
        case Background.Checked:
            drawCheckPattern();
            break;
        case Background.Colored:
            drawColoredBackground();
    }
}

function drawColoredBackground() {
    background(color('#FFEBD1'));
}

function drawCheckPattern() {
    strokeWeight(1);
    stroke(0, 0, 0, 10);
    
    var distance = width / 40;
    for (var x=0; x<width; x+=distance) {
        line(x, 0, x, height);
    }
    for (var y=0; y<height; y+=distance) {
        line(0, y, width, y);
    }
}

function drawLargeCircles() {
    strokeWeight(1);
    stroke(0, 0, 0, 10);
    noFill();

    var diff = width / 40;
    for (var c=0; c<2; c++) {
        var centerX = random()*width;
        var centerY = random()*height;
        var radius = 20;
        for (var i=0; i<300; i++) {
            circle(centerX, centerY, radius);
            radius += diff;
        }
    }
}