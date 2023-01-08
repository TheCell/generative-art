let canvas, gfx, gfx3d, gfx2canvas, asciiInstance;
let counter = 0;
let saveFrame = true;
let newFont;
let noiseVal;
let noiseScale = 0.02;
let fontLoaded = false;
let thisReference;
let genuaryNr = '08';

const startupParameters = {
  xSize: 600,
  ySize: 600,
  asciiXSize: 80,
  asciiYSize: 80,
  fontSize: 5,
  resizeCanvas: function() {
    canvas = createCanvas(startupParameters.xSize, startupParameters.ySize).elt;
    frameRate(60);
    pixelDensity(1);

    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize, P2D); // extra 2d graphics
    gfx3d = createGraphics(startupParameters.xSize, startupParameters.ySize, WEBGL); // extra 2d graphics
    gfx2canvas = createGraphics(startupParameters.xSize, startupParameters.ySize, P2D); // graphics combinind all others and combining with ascii
    gfx2ascii = createGraphics(startupParameters.asciiXSize, startupParameters.asciiYSize, P2D); // graphics combinind all others and combining with ascii
    asciiInstance = new AsciiArt(thisReference);
    asciiInstance.typeArray2d = typeArray2d;
  }
}

const options = {
  background: '#415765',
  foreground: '#5cb6f2',
  bordercolor: '#b5fd71',
  asciify: true,
  showPixelated: false,
  noiseDetail: 8,
  noiseFallOff: 0.7,
  seed: 1,
  restart: function () {
    randomSeed(options.seed);

    gfx.reset();
    gfx.background(options.background);
  },
  save: function () {
    saveCanvas(`${new Date().getFullYear()}_Genuary${genuaryNr}_seed-${options.seed}_date-${Date.now()}`, 'png');
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
folder1.addColor(options, 'bordercolor');
folder1.add(startupParameters, 'fontSize', 0, 50, 1).onChange(() => {
  textSize(startupParameters.fontSize);
});
folder1.add(options, 'noiseDetail', 0, 16, 1).onChange(() => {
  options.restart();
});
folder1.add(options, 'noiseFallOff', 0, 1).onChange(() => {
  options.restart();
});
folder1.add(options, 'seed', 0, 100000, 1).onChange(() => {
  options.restart();
});

folder1.open();
gui.add(options, 'asciify');
gui.add(options, 'showPixelated');
gui.add(options, 'restart');
gui.add(options, 'save');

function preload() {
  loadFont('./../_libs/fonts/QuinqueFive.ttf'); // https://ggbot.itch.io/quinquefive-font
  loadFont('./../_libs/fonts/KenPixel Mini.ttf'); // https://www.kenney.nl/assets/kenney-fonts
  loadFont('./../_libs/fonts/pocod.ttf'); // https://dezuhan.itch.io/pocod-pixel-font
}

function setup() {
  thisReference = this;
  startupParameters.resizeCanvas();
  options.restart();
  textFont('QuinqueFive', startupParameters.fontSize);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  // asciiInstance.printWeightTable();
}

function draw() {
  prepareGfxCanvas();
  // prepareGfx3dCanvas();
  drawOrOverdrawAsAscii();
  // saveAllFrames();
}

let angle = Math.PI;
let speed = Math.PI / 32;
let R = (a=1)=>Math.random()*a;
let L = (x,y)=>(x*x+y*y)**0.5; // Elements by Euclid 300 BC
function prepareGfxCanvas() {
  // gfx.background(options.asciify ? color(0) : options.background);
  // gfx.fill(options.foreground);
  // gfx.noStroke();

  // let x = startupParameters.xSize/2 + cos(angle) * (startupParameters.xSize / 3);
  // let y = startupParameters.ySize/2 + sin(angle) * (startupParameters.ySize / 3);
  // gfx.ellipse(x, y, 100, 100);

  for (let k = 0; k < 1000; k++) {
    let p = [R(2)-1, R(2)-1];
    let d = sdf(p);
    let col = options.bordercolor;
    if (d < -.01) col = options.foreground;
    if (d > .01) col = options.background;
    // if (frameCount < 2)
      // console.log(p);
    draw_circle(p, 2, col);
  }
  // angle += speed;
  // angle = angle % (Math.PI * 2);
}

function prepareGfx3dCanvas() {
  gfx3d.clear();
  gfx3d.fill(options.foreground);
  gfx3d.strokeWeight(0);
  gfx3d.torus(100, startupParameters.xSize / 15);
  gfx3d.reset();
  gfx3d.rotateY(angle);
  gfx3d.rotateX(angle);
  gfx3d.rotateZ(angle);
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

  if (options.showPixelated) { // canvas that is used to turn into ascii art
    image(gfx2ascii, 0, 0, startupParameters.xSize, startupParameters.ySize);
  } else {
    fill(options.foreground);
    background(options.background);

    ascii_arr = asciiInstance.convert(gfx2ascii);
    asciiInstance.typeArray2d(ascii_arr, this);
  }
}

let saveUntilcount = 129;
function saveAllFrames() {
  if (frameCount > saveUntilcount) {
    return;
  }

  if (frameCount > 40) {
    options.showPixelated = true;
    options.asciify = true;
  }

  if (frameCount > 80) {
    options.showPixelated = true;
    options.asciify = false;
  }

  // frameRate(5);
  // saveCanvas(`${new Date().getFullYear()}_Genuary${genuaryNr}_seed-${options.seed}_frame-${frameCount}`, 'png');
}


// see https://www.youtube.com/watch?v=KRB57wyo8_4
// and https://iquilezles.org/articles/distfunctions2d/
function draw_circle([x,y],r,c) {
  gfx.fill(c); gfx.noStroke();
  gfx.circle((x+1)*width/2, (y+1)*width/2, r/2);
}

function sdf_circle([x,y], [cx,cy], r) {
  x -= cx;
  y -= cy;
  return L(x, y) - r;
}

function sdf_box([x,y], [cx,cy], [w,h]) {
  x -= cx;
  y -= cy;
  return k(abs(x)-w, abs(y)-h);  
}

let k = (a,b) => a > 0 && b > 0 ? L(a,b) : a > b ? a : b;

function sdf_rep(x, r) {
  x/=r;
  x -= Math.floor(x)+.5;
  x*=r;
  return x;
}

function sdf([x,y]) {
  // let bal = sdf_circle([x,y], [.3,.3], .4);
  // let lin = abs(y)-.3;
  // let lin2 = abs(x)-.3;
  // bal = abs(bal) - .1;
  // bal = abs(bal) - .05;
  // x = abs(x) - .5;
  let bal = abs(sdf_rep(sdf_circle([x,y], [-.2,0], .1),.2))-.05;
  let bbl = abs(sdf_rep(sdf_circle([x,y], [.2,0], .1),.2))-.05;
  return max(bal, bbl);
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