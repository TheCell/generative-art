let gfx, seed, asciiInstance, system;
let counter = 0;
let saveFrame = true;

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
    textFont('monospace', startupParameters.fontSize);
    textStyle(NORMAL);
  }
}

const options = {
  background: '#3b3c4a',
  foreground: '#e6494f',
  Asciify: true,
  restart: function () {
    seed = Math.random() * 100000;
    randomSeed(seed);
    gfx.reset();
    gfx.background(options.background);
    system = new ParticleSystem(createVector(startupParameters.asciiXSize / 2, 10));
  },
  save: function () {
    saveCanvas(`${new Date().getFullYear()}_Genuary02_seed-${seed}_date-${Date.now()}`, 'png');
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
folder1.open();
gui.add(options, 'Asciify');
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas(this);
  options.restart();
}

let angle = 0;
let speed = 0.05;

function draw() {
  textFont('monospace', startupParameters.fontSize);

  if (options.Asciify) {
    background(options.background);
    gfx.background(color(0,0,0));
    gfx.fill(color(255, 255, 255));
  } else {
    gfx.background(options.background);
    gfx.fill(options.foreground);
  }
  fill(options.foreground);

  system.addParticle();
  system.run(gfx);
  
  if (options.Asciify) {
    ascii_arr = asciiInstance.convert(gfx);
    asciiInstance.typeArray2d(ascii_arr, this);
  } else {
    image(gfx, 0, 0, startupParameters.xSize, startupParameters.ySize);
  }

  if (counter < 240 && saveFrame) {
    // saveCanvas(`${new Date().getFullYear()}_Genuary02_seed-${seed}_frame${counter}`, 'png');
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


// A simple Particle class
let Particle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.size = Math.random() * 5;
  this.position = position.copy();
  this.lifespan = 255;
};

Particle.prototype.run = function(graphics) {
  this.update();
  this.display(graphics);
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function(graphics) {
  graphics.noStroke();
  graphics.fill(255, this.lifespan);
  graphics.ellipse(this.position.x, this.position.y, this.size , this.size);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  return this.lifespan < 0;
};

let ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function(graphics) {
  for (let i = this.particles.length-1; i >= 0; i--) {
    let p = this.particles[i];
    p.run(graphics);
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};