let gfx, seed;

const startupParameters = {
  xSize: 600,
  ySize: 600,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
  }
}

const options = {
  background: '#212121',
  foreground: '#ffae23',
  offset: 3,
  minArea: 140,
  stopSplitting: true,
  addSomeColor: true,
  areaThresholdForColorizing: 3000,
  invertFill: false,
  fill: false,
  restart: function () {
    seed = Math.random() * 100000;
    randomSeed(seed);
    gfx.reset();
    gfx.background(options.background);
    rects = [];
    rects.push(new Rect(createVector(0, 0), createVector(width, 0), createVector(width, height), createVector(0, height)));
  
    while (rects.some(r => r.shouldSplit())) {
      splitEmUp();
    }
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
folder1.add(options, 'offset', 1, 10, 1);
folder1.add(options, 'minArea', 10, 800, 20);
folder1.add(options, 'stopSplitting', true, false);
folder1.add(options, 'fill', true, false);
folder1.add(options, 'addSomeColor', true, false);
folder1.add(options, 'areaThresholdForColorizing', 1, 100000);
folder1.add(options, 'invertFill', true, false);
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

var rects = [];
var colors = [];

function getColor(position) {
  var x = position.x;
  var y = height - position.y;
  var maxDistance = Math.sqrt(height * height + width * width);
  var distance = Math.sqrt(x * x + y * y);
  var percentFromCorner = distance / maxDistance;
  //var percentFromTop = position.y / height;
  //var partialIndex = percentFromTop * colors.length;
  var partialIndex = percentFromCorner * colors.length;
  var maxIndex = colors.length - 1;
  var lowerIndex = Math.min(maxIndex, Math.max(0, Math.floor(partialIndex)));
  var upperIndex = Math.max(0, Math.min(maxIndex, Math.ceil(partialIndex)));
  var amt = partialIndex - lowerIndex; // map to 0 - 1
  
  var c1 = colors[lowerIndex];
  var c2 = colors[upperIndex];
  return lerpColor(c1, c2, amt);
}

class Rect {
  constructor(a1, a2, a3, a4, neverSplit = false) {
    this.a1 = a1;
    this.a2 = a2;
    this.a3 = a3;
    this.a4 = a4;
    this.neverSplit = neverSplit;
    this.offset = options.offset;
  }

  draw() {
    if (options.addSomeColor) {
      if (this.area() < options.areaThresholdForColorizing) {
        fill(getColor(this.a1));
      } else {
        fill(0, 0, 100);
      }
    } else if (options.fill) {
      if (options.invertFill) {
        fill(100, 0, 100);
      } else {
        fill(100, 100, 0);
      }
    } else {
      noFill();
    }
    beginShape();
    vertex(this.a1.x, this.a1.y);
    vertex(this.a2.x, this.a2.y);
    vertex(this.a3.x, this.a3.y);
    vertex(this.a4.x, this.a4.y);
    endShape(CLOSE);
  }

  split() {
    if (this.shouldSplitHorizontally()) {
      return this.splitHorizontally();
    }
    return this.splitVertically();
  }

  splitVertically() {    
    var hLeft = p5.Vector.sub(this.a4, this.a1);
    var hRight = p5.Vector.sub(this.a3, this.a2);
    var distanceToSplit1 = (random(20) + 40) / 100;
    var distanceToSplit2 = (random(20) + 40) / 100;
    var a1ToNewA2 = p5.Vector.mult(hRight, distanceToSplit1);
    var a4ToNewA3 = p5.Vector.mult(hLeft, distanceToSplit2);
    var a = new Rect(this.a1, this.a2, p5.Vector.add(this.a2, a1ToNewA2), p5.Vector.add(this.a1, a4ToNewA3), this.neverSplit);
    var b = new Rect(p5.Vector.add(this.a1, a4ToNewA3).add(0, this.offset), p5.Vector.add(this.a2, a1ToNewA2).add(0, this.offset), this.a3, this.a4, this.neverSplit);
    return [a, b];
  }

  splitHorizontally() {
    var wTop = p5.Vector.sub(this.a2, this.a1);
    var wBottom = p5.Vector.sub(this.a3, this.a4);
    var distanceToSplit1 = (random(20) + 40) / 100;
    var distanceToSplit2 = (random(20) + 40) / 100;
    var a1ToNewA2 = p5.Vector.mult(wTop, distanceToSplit1);
    var a4ToNewA3 = p5.Vector.mult(wBottom, distanceToSplit2);
    var a = new Rect(this.a1, p5.Vector.add(this.a1, a1ToNewA2), p5.Vector.add(this.a4, a4ToNewA3), this.a4, this.neverSplit);
    var b = new Rect(p5.Vector.add(this.a1, a1ToNewA2).add(this.offset, 0), this.a2, this.a3, p5.Vector.add(this.a4, a4ToNewA3).add(this.offset, 0), this.neverSplit);
    return [a, b];
  }

  shouldSplit() {
    if (this.neverSplit) {
      return false;
    }

    if (rects.length < 3) {
      return true;
    }

    var area = this.area();
    var stopSplitting = random(0, 100) > 80;
    if (stopSplitting) {
      this.neverSplit = true;
      return false;
    }

    var shouldSplit = area > options.minArea;
    if (!shouldSplit) {
      this.neverSplit = true;
    }
    return shouldSplit;
  }

  area() {var w = p5.Vector.sub(this.a2, this.a1);
    var h = p5.Vector.sub(this.a4, this.a1);
    var area = w.x * h.y;
    return area;
  }

  shouldSplitHorizontally() {
    var byChance = random(0, 100) > 50;
    if (byChance) {
      return random(0, 100) > 50;
    } else {
      var w = p5.Vector.sub(this.a2, this.a1);
      var h = p5.Vector.sub(this.a4, this.a1);
      return w.x > h.y;
    }

  }
}

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
  colorMode(HSB, 360, 100, 100);
  colors = [
    color(56, 19, 98),
    color(27, 18, 99),
    color(356, 19, 100),
    color(311, 20, 95),
    color(263, 23, 94),
    color(215, 33, 95),
    color(195, 41, 96), 
    color(185, 42, 96),
    color(167, 38, 96),
    color(126, 26, 98)
  ];
}

var count = 0;
function draw() {
  count++;
  if (count > 200) {
    count = 0;
    //splitEmUp();
  }
  if (options.fill) {
    if (options.invertFill) {
      background(360, 100, 0);
    } else {
      background(360, 0, 100);
    }
  } else {    
    background(360, 0, 100);
  }
  for (var i=0; i<rects.length; i++) {
    rects[i].draw();
  }
}

function splitEmUp() {  
  var newRects = [];
  for (var i=0; i<rects.length; i++) {
    if (rects[i].shouldSplit() || !options.stopSplitting) {
      var n = rects[i].split();
      newRects.push(...n);
    } else {
      newRects.push(rects[i]);
    }
  }
  rects = newRects;
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