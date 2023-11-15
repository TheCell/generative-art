let gfx, seed;

const startupParameters = {
  xSize: 1200,
  ySize: 675,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    frameRate(60);
    pixelDensity(1);
    
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
  }
}

var sentences = [];
var signature;
const options = {
  background: '#212121',
  foreground: '#ffae23',
  restart: function () {
    seed = Math.random() * 100000;
    randomSeed(seed);
    gfx.reset();
    gfx.background(options.background);
    sentences = [];
    for (var i=0; i<10; i++) {
      sentences.push(new Sentence(38, 38));
    }
    signature = new Word(38, 38, true);
    loop();
  },
  save: function () {
    saveCanvas(`${new Date().getFullYear()}_seed-${seed}_date-${Date.now()}`, 'png');
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
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
}

function drawBorder() {
  sandLine(10, 10, width-10, 10, 1, 1);
  sandLine(10, 10, 10, 665, 1, 1);
  sandLine(10, 665, width-10, 665, 1, 1);
  sandLine(width-10, 10, width-10, 665, 1, 1);
}

function draw() {
  noLoop();
  background(255, 255, 255);
  
  drawBorder();
  
  strokeWeight(2);
  
  var currentX = 20;
  var currentY = 20;
  for (var i=0; i<sentences.length; i++) {
    sentences[i].draw(currentX, currentY);
    currentY += 38;
    if (i % 4 === 0) {
      currentY += 38;
    }
  }
  strokeWeight(4);
  signature.draw(width - signature.getWidth() - 50, currentY + 50);
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