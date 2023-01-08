let gfx, gfx3d, gfx2canvas, asciiInstance;
let counter = 0;
let saveFrame = true;
let newFont;
let noiseVal;
let noiseScale = 0.02;
let fontLoaded = false;
let thisReference;

const startupParameters = {
  xSize: 600,
  ySize: 600,
  asciiXSize: 40,
  asciiYSize: 40,
  fontSize: 16,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    frameRate(60);
    pixelDensity(1);

    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize, P2D); // extra 2d graphics
    gfx3d = createGraphics(startupParameters.xSize, startupParameters.ySize, WEBGL); // extra 2d graphics
    gfx2canvas = createGraphics(startupParameters.xSize, startupParameters.ySize, P2D); // graphics combinind all others and combining with ascii
    gfx2ascii = createGraphics(startupParameters.asciiXSize, startupParameters.asciiYSize, P2D); // graphics combinind all others and combining with ascii
    asciiInstance = new AsciiArt(thisReference, 'monospace', startupParameters.fontSize);
    // gfx = createGraphics(startupParameters.asciiXSize, startupParameters.asciiYSize); // extra 2d graphics
    // gfx.noStroke();
    // asciiInstance = new AsciiArt(thisReference);
    
    // asciiInstance.printWeightTable();
    // gfx.textAlign(CENTER, CENTER);
    // gfx.textStyle(NORMAL);
  }
}

const options = {
  background: '#414659',
  foreground: '#bcc986',
  asciify: true,
  noiseDetail: 8,
  noiseFallOff: 0.7,
  seed: 1,
  restart: function () {
    randomSeed(options.seed);

    gfx.reset();
    gfx.background(options.background);
  },
  save: function () {
    saveCanvas(`${new Date().getFullYear()}_Genuary05_seed-${options.seed}_date-${Date.now()}`, 'png');
  }
}

// start with a random seed
options.seed = Math.floor(Math.random() * 100000);

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var startupParameterFolder = gui.addFolder('canvas options');
gui.remember(startupParameters);
startupParameterFolder.add(startupParameters, 'xSize', 200);
startupParameterFolder.add(startupParameters, 'ySize', 200);
startupParameterFolder.add(startupParameters, 'asciiXSize', 1);
startupParameterFolder.add(startupParameters, 'asciiYSize', 1);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
folder1.add(startupParameters, 'fontSize', 0, 100, 1);
folder1.add(options, 'noiseDetail', 0, 16, 1).onChange(function() {
  options.restart();
});
folder1.add(options, 'noiseFallOff', 0, 1).onChange(function() {
  options.restart();
});
folder1.add(options, 'seed', 0, 100000, 1).onChange(function() {
  options.restart();
});

folder1.open();
gui.add(options, 'asciify');
gui.add(options, 'restart');
gui.add(options, 'save');

function preload() {
  newFont = loadFont('./../_libs/fonts/QuinqueFive.ttf', () => {
    fontLoaded = true;
  });

  newFont = loadFont('./../_libs/fonts/KenPixel Mini.ttf', () => {
    fontLoaded = true;
  });
}

function setup() {
  thisReference = this;
  startupParameters.resizeCanvas();
  options.restart();
}

function draw() {
  prepareGfxCanvas();
  prepareGfx3dCanvas();
  drawOrOverdrawAsAscii();
}

let angle = 0;
let speed = 0.05;
function prepareGfxCanvas() {
  gfx.background(options.asciify ? color(0) : options.background);
  gfx.fill(options.foreground);
  gfx.noStroke();

  let x = startupParameters.xSize/2 + cos(angle) * (startupParameters.xSize / 3);
  let y = startupParameters.ySize/2 + sin(angle) * (startupParameters.ySize / 3);
  gfx.ellipse(x, y, 100, 100);

  angle += speed;
  angle = angle % (Math.PI * 2);
}

function prepareGfx3dCanvas() {
  gfx3d.clear();
  gfx3d.fill(options.foreground);
  gfx3d.strokeWeight(0);
  gfx3d.torus(100, startupParameters.xSize / 15);
  gfx3d.rotateY(speed);
  gfx3d.rotateX(speed);
  gfx3d.rotateZ(speed);
}

function drawOrOverdrawAsAscii() {
  gfx2canvas.image(gfx, 0, 0, startupParameters.xSize, startupParameters.ySize); // copy gfx canvas to default canvas
  gfx2canvas.image(gfx3d, 0, 0, startupParameters.xSize, startupParameters.ySize); // copy 3d canvas to defaul canvas
  
  if (!options.asciify) {
    image(gfx2canvas, 0, 0, startupParameters.xSize, startupParameters.ySize); // copy 3d canvas to defaul canvas
    return;
  }
  
  gfx2canvas.image(gfx3d, 0, 0, startupParameters.xSize, startupParameters.ySize);
  // gfx2canvas.filter(THRESHOLD);
  gfx2canvas.filter(GRAY);
  // gfx2canvas.filter(POSTERIZE, 3);

  // copy full image to ascii mini canvas
  gfx2ascii.image(gfx2canvas, 0, 0, startupParameters.asciiXSize, startupParameters.asciiYSize); // copy combined image to the ascii frame to process further

  if (false) { // canvas that is used to turn into ascii art
    image(gfx2ascii, 0, 0, startupParameters.xSize, startupParameters.ySize);
  } else {
    fill(options.foreground);
    background(options.background);
    textFont('monospace', startupParameters.fontSize);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);

    ascii_arr = asciiInstance.convert(gfx2ascii);
    asciiInstance.typeArray2d(ascii_arr, this);
  }
}
