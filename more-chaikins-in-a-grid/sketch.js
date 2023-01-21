let gfx, seed, splines, backgroundSplines, grid;

var colorPalettes = [
  ['#FF5F00', '#B20600', '#00092C', '#EEEEEE'],
  ['#F0FF42', '#82CD47', '#54B435', '#379237'],
  ['#E97777', '#FF9F9F', '#FCDDB0', '#FFFAD7'],
  ['#F2FA5A', '#FFFFFF'],
  ['#72FFFF', '#C147E9'],
  ['#144272', '#205295', '#2C74B3'],
  ['#FDEEDC', '#FFD8A9', '#F1A661', '#E38B29'],
  ['#E3FDFD', '#CBF1F5', '#A6E3E9', '#71C9CE'],
  ['#F9ED69', '#F08A5D', '#B83B5E', '#6A2C70'],
  ['#2D4059', '#EA5455', '#F07B3F', '#FFD460'],
  ['#555555'],
  ['#3D1766', '#6F1AB6', '#FF0032', '#CD0404'],
  ['#F5EDCE', '#89C4E1', '#58287F', '#1A0000']
];
const startupParameters = {
  xSize: 400,//650,//600,
  ySize: 647,//900,//971,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    frameRate(60);
    pixelDensity(1);
    
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
  }
}

function createGrid() {
  // TODO: Calculate from width/height and only use cellSize config
  grid = [];
  for (var x=0; x<options.gridSizeX; x++) {
    grid[x] = [];
    for (var y=0; y<options.gridSizeY; y++) {
      grid[x].push(new GridCell(x, y));
    }
  }
}

const options = {
  background: Background.Colored,
  numberOfSplines: 20,
  numberOfPoints: 5,
  splineColorPalette: 0,
  randomColors: false,
  playColors: false,
  gridSizeX: 10,
  gridSizeY: 16,
  cellSize: 40,
  drawGrid: false,
  gridSelectionAlgorithm: 1,
  cellSelection: CellSelectionAlgorithm.EmergeFromACenter,
  restart: function () {
    seed = Math.random() * 100000;//82973.367241122;// //91726.74312319404; //40396.04204047813;
    randomSeed(seed);
    noiseSeed(seed);
    gfx.reset();

    createGrid();
    splines = [];
    backgroundSplines = []

    for (var i=0; i<50; i++) {
      backgroundSplines.push(createSpline(true));
    }
    for (var i=0; i<options.numberOfSplines; i++) {
      var previousSpline = i>0 ? splines[i-1] : undefined;
      splines.push(createSplineInGrid(previousSpline, i));
    }

    if (options.playColors) {
      frameRate(1);
      options.splineColorPalette = (options.splineColorPalette + 1) % colorPalettes.length;
    } else {
      frameRate(30);
    }

    loop();
  },
  save: function () {
    saveCanvas(`${new Date().getFullYear()}_seed-${seed}_date-${Date.now()}`, 'png');
  },
  loadImage: function() {
    document.getElementById('fileselector').click();
  }
}
updateAlgorithmDefaults();

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var startupParameterFolder = gui.addFolder('canvas options');
gui.remember(startupParameters);
startupParameterFolder.add(startupParameters, 'xSize', 200);
startupParameterFolder.add(startupParameters, 'ySize', 200);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
//folder1.add(options, 'loadImage');
folder1.add(options, 'cellSelection', Object.values(CellSelectionAlgorithm)).onChange(() => { updateAlgorithmDefaults(); options.restart(); });
folder1.add(options, 'numberOfSplines', 1, 1000, 1).listen();
folder1.add(options, 'numberOfPoints', 5, 100, 5).listen();
folder1.add(options, 'splineColorPalette', 0, colorPalettes.length-1, 1).listen();
folder1.add(options, 'randomColors');
folder1.add(options, 'playColors');
folder1.add(options, 'background', Object.values(Background)).onChange(() => { options.restart(); });
folder1.open();
var folder2 = gui.addFolder('Grid options');
folder2.add(options, 'gridSizeX', 5, 50, 1).listen();
folder2.add(options, 'gridSizeY', 5, 50, 1).listen();
folder2.add(options, 'cellSize', 5, 50, 5).listen();
folder2.add(options, 'drawGrid');
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
}

function draw() {
  noLoop();
  background(255, 255, 255);
  
  strokeWeight(1);
  if (options.background === Background.Curves) {
    for (var s=0; s<backgroundSplines.length; s++) {
      drawSpline(backgroundSplines[s], colorPalettes[1]);
    }
  } else {
    drawBackground();
  }
  
  for (var s=0; s<splines.length; s++) {
    var palette = getSplinePalette(s);
    drawSpline(splines[s], palette);
  }

  if (options.drawGrid) {
    for (var x=0; x<options.gridSizeX; x++) {
      for (var y=0; y<options.gridSizeY; y++) {
        grid[x][y].draw();
      }
    }
  }

  if (options.playColors) {
    options.restart();
  }
}

function getSplinePalette(splineIndex) {
  if (options.randomColors) {
    return colorPalettes[Math.floor(random()*colorPalettes.length)];
  } else {
    return colorPalettes[options.splineColorPalette];
  }
}

function drawSpline(spline, colorPalette, alpha = 50) {
  var points = spline.points;
  var c = color(colorPalette[Math.floor(random()*colorPalette.length)]);
  c.setAlpha(alpha);
  stroke(0, 0, 0, 50);
  fill(c);
  
  beginShape();
  curveVertex(points[0][0], points[0][1]);
  for (var i=0; i<points.length; i++) {
      var point = points[i];
      curveVertex(point[0], point[1]);
  }
  curveVertex(points[points.length-1][0], points[points.length-1][1]);
  endShape();
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