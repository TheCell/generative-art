let gfx, seed, asciiInstance;
let counter = 0;
let saveFrame = true;
let newFont;
let noiseVal;
let noiseScale = 0.02;
let randomX;
let randomY;

const startupParameters = {
  xSize: 600,
  ySize: 600,
  asciiXSize: 40,
  asciiYSize: 40,
  fontSize: 12,
  resizeCanvas: function(_sketch) {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    frameRate(60);
    pixelDensity(1);

    gfx = createGraphics(startupParameters.asciiXSize, startupParameters.asciiYSize)
    gfx.noStroke();
    asciiInstance = new AsciiArt(_sketch);
    // asciiInstance.printWeightTable();
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
  }
}

const options = {
  background: '#3b3c4a',
  foreground: '#e6494f',
  Asciify: true,
  noiseDetail: 8,
  noiseFallOff: 0.71,
  seed: 321123,
  useFixedNoise: false,
  restart: function () {
    if (options.useFixedNoise) {
      seed = options.seed;
    } else {
      seed = Math.floor(Math.random() * 100000);
    }
    randomSeed(seed);

    gfx.reset();
    gfx.background(options.background);
    randomX = random(startupParameters.asciiXSize);
    randomY = random(startupParameters.asciiYSize);
  },
  save: function () {
    saveCanvas(`${new Date().getFullYear()}_Genuary03_seed-${options.seed}_date-${Date.now()}`, 'png');
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
startupParameterFolder.add(startupParameters, 'asciiXSize', 1);
startupParameterFolder.add(startupParameters, 'asciiYSize', 1);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.add(options, 'loadImage');
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
  if (options.useFixedNoise) {
    options.restart();
  }
});
folder1.add(options, 'useFixedNoise').onChange(function() {
  if (options.useFixedNoise) {
    options.restart();
  }
});

folder1.open();
gui.add(options, 'Asciify');
gui.add(options, 'restart');
gui.add(options, 'save');

function preload() {
  newFont = loadFont('../_libs/fonts/KenPixel Mini.ttf');
  // newFont = loadFont('../_libs/fonts/QuinqueFive.ttf');
}

function setup() {
  startupParameters.resizeCanvas(this);
  options.restart();
}

function draw() {
  textFont(newFont, startupParameters.fontSize);

  if (options.Asciify) {
    background(options.background);
    gfx.background(color(0,0,0));
    gfx.fill(color(255, 255, 255));
  } else {
    gfx.background(options.background);
    gfx.fill(options.foreground);
  }
  fill(options.foreground);

  mainDrawPart();

  if (options.Asciify) {
    ascii_arr = asciiInstance.convert(gfx);
    asciiInstance.typeArray2d(ascii_arr, this);
  } else {
    image(gfx, 0, 0, startupParameters.xSize, startupParameters.ySize);
  }

  if (counter < 240 && saveFrame) {
    // saveCanvas(`${new Date().getFullYear()}_Genuary02_seed-${options.seed}_frame${counter}`, 'png');
    counter++;
  }

  saveFrame != saveFrame;
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

function mainDrawPart() {
  gfx.noiseDetail(options.noiseDetail, options.noiseFallOff);
  noiseSeed(seed);

  for (let y = 0; y < startupParameters.asciiYSize; y++) {
    for (let x = 0; x < startupParameters.asciiYSize; x++) {
      // noiseVal = noise((randomX + x) * noiseScale, (randomY + y) * noiseScale);
      noiseVal = noise(
        (randomX + x) * noiseScale,
        (randomY + y) * noiseScale
      );
      gfx.stroke(noiseVal * 255);
      gfx.point(x, y);
    }
  }
}

typeArray2d = function(_arr2d, _dst, _x, _y, _w, _h) {
  if(_arr2d === null) {
    console.log('[typeArray2d] _arr2d === null');
    return;
  }
  if(_arr2d === undefined) {
    console.log('[typeArray2d] _arr2d === undefined');
    return;
  }
  switch(arguments.length) {
    case 2: _x = 0; _y = 0; _w = width; _h = height; break;
    case 4: _w = width; _h = height; break;
    case 6: /* nothing to do */ break;
    default:
      console.log(
        '[typeArray2d] bad number of arguments: ' + arguments.length
      );
      return;
  }
  /*
    Because Safari in macOS seems to behave strangely in the case of multiple
    calls to the p5js text(_str, _x, _y) method for now I decided to refer
    directly to the mechanism for handling the canvas tag through the "pure"
    JavaScript.
  */
  if(_dst.canvas === null) {
    console.log('[typeArray2d] _dst.canvas === null');
    return;
  }
  if(_dst.canvas === undefined) {
    console.log('[typeArray2d] _dst.canvas === undefined');
    return;
  }
  var temp_ctx2d = _dst.canvas.getContext('2d');
  if(temp_ctx2d === null) {
    console.log('[typeArray2d] _dst canvas 2d context is null');
    return;
  }
  if(temp_ctx2d === undefined) {
    console.log('[typeArray2d] _dst canvas 2d context is undefined');
    return;
  }
  var dist_hor = _w / _arr2d.length;
  var dist_ver = _h / _arr2d[0].length;
  var offset_x = _x + dist_hor * 0.5;
  var offset_y = _y + dist_ver * 0.5;
  for(var temp_y = 0; temp_y < _arr2d[0].length; temp_y++)
    for(var temp_x = 0; temp_x < _arr2d.length; temp_x++)
      /*text*/temp_ctx2d.fillText(
        _arr2d[temp_x][temp_y],
        offset_x + temp_x * dist_hor,
        offset_y + temp_y * dist_ver
      );
}
