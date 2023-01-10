let gfx, seed;

const startupParameters = {
  xSize: 900,
  ySize: 2000,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
  }
}

const options = {
  background: '#212121',
  foreground: '#ffae23',
  borderPoints: false,
  restart: function () {
    seed = Math.random() * 100000;
    randomSeed(seed);
    noiseSeed(seed);
    gfx.reset();
    colorMode(HSB);
    background(0, 0, 100);
    loop();
  },
  save: function () {
    saveCanvas('Example_seed-' + seed + '_date-' + Date.now(), 'png');
  },
  loadImage: function() {
    document.getElementById('fileselector').click();
  }
}

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var startupParameterFolder = gui.addFolder('canvas options');
gui.remember(startupParameters);
startupParameterFolder.add(startupParameters, 'xSize', 200);
startupParameterFolder.add(startupParameters, 'ySize', 200);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.add(options, 'loadImage');
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
folder1.add(options, 'borderPoints');
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function drawStartAndEndPoint(x1, y1, x2, y2) {
  strokeWeight(4);
  stroke(335, 100, 100);
  point(x1, y1);
  point(x2, y2);
}

function randomLine(x1, y1, x2, y2, weight, darkness) {
  strokeWeight(weight);
  stroke(0, 100, 0, darkness);

  var from = createVector(x1, y1);
  var to = createVector(x2, y2);
  var stepSize = 5;
  var completeLine = p5.Vector.sub(to, from)
  var step = completeLine.copy().normalize().mult(stepSize);
  var length = completeLine.copy().mag();
  var stepLength = step.copy().mag();
  var position = createVector(x1, y1);
  for (var i=0; i<length/stepLength; i++) {
    var newPosition = p5.Vector.add(position, step);
    var variance = createVector(random(width), random(height)).normalize().mult(weight * 4);
    line(position.x, position.y, newPosition.x + variance.x, newPosition.y + variance.y);
    position = newPosition; 
  }
}

function defaultLine(x1, y1, x2, y2, weight, darkness) {
  strokeWeight(weight);
  stroke(0, 100, 0, darkness);
  line(x1, y1, x2, y2);
}

function aline(mode, x1, y1, x2, y2, weight = 1, darkness = 1) {
  switch (mode) {
    case 'default':
      defaultLine(x1, y1, x2, y2, weight, darkness);
      break;
    case 'random':
      randomLine(x1, y1, x2, y2, weight, darkness);
      break;
    case 'scribble':
      scribbleLine(x1, y1, x2, y2, weight, darkness);
      break;
    case 'scribble2':
      scribble2Line(x1, y1, x2, y2, weight, darkness);
      break;
    case 'dots':
      dotLine(x1, y1, x2, y2, weight, darkness);
      break;
    case 'chaikin-spline':
      chaikinSpline(x1, y1, x2, y2, weight, darkness);
      break;
    case 'thick-and-thin':
      thickAndThinLine(x1, y1, x2, y2, weight, darkness);
      break;
    case 'spiral':
      spiralLine(x1, y1, x2, y2, weight, darkness);
      break;
    case 'sand':
      sandLine(x1, y1, x2, y2, weight, darkness);
      break;
  }
  if (options.borderPoints) {
    drawStartAndEndPoint(x1, y1, x2, y2);
  }
}

function drawMode(m) {
  var w = 70;
  var h = 200;
  var borderY = 40;
  for (var darkness=0; darkness<1; darkness++) {
    for (var i=0; i<10; i++) {
      // use m*1*(h+borderY) for every y coordinate to add lanes per mode (e.g. two darkness lanes)
      aline(modes[m], 
        40 + i*w,
        200 + borderY + m*borderY + m*h + darkness*(h+borderY),// + m*1*(h+borderY),
        240 + i*w,
        borderY + m*borderY + m*h + darkness*(h+borderY) /*+ m*1*(h+borderY)*/, 1+i, 1-darkness*0.5);
    }
    strokeWeight(0.5);
    stroke(0, 100, 0, 0.5);
    line(
      20,
      200 + borderY + m*borderY + m*h + darkness*(h+borderY),// + m*1*(h+borderY),
      240+9*w,
      200 + borderY + m*borderY + m*h + darkness*(h+borderY)),// + m*1*(h+borderY));
    line(
      20,
      borderY + m*borderY + m*h + darkness*(h+borderY),// + m*1*(h+borderY),
      240+9*w,
      borderY + m*borderY + m*h + darkness*(h+borderY));// + m*1*(h+borderY));
  }
}

var modes = [
  'sand', 'chaikin-spline', 'scribble2', 'dots', 'thick-and-thin'
];

// scribble: hübsch, aber verschiebt sich zu stark nach y
// random: nur mit weight 1 akzeptabel


function setup() {
  startupParameters.resizeCanvas();
  options.restart();
  noLoop();
}

function draw() {
  noLoop();
  for (var m=0; m<modes.length; m++) {
    drawMode(m);
  }
}

function onFileSelected() {
  const input = document.getElementById('fileselector');
  const files = input.files;
  for (const file of files) {
    loadImage(URL.createObjectURL(file), onImageLoaded);
  };
}

function onImageLoaded(image) {
  // now do stuff
  gfx.image(image, 0, 0);
}