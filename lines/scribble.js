

function scribbleLine(x1, y1, x2, y2, weight, darkness) {
    strokeWeight(weight);
    stroke(0, 100, 0, darkness);
  console.log('aline');
    var from = createVector(x1, y1);
    var to = createVector(x2, y2);
    var stepSize = 5;
    var completeLine = p5.Vector.sub(to, from)
    var step = completeLine.copy().normalize().mult(stepSize);
    var length = completeLine.copy().mag();
    var stepLength = step.copy().mag();
    var position = createVector(x1, y1);
    var previousVariance = createVector(random(400), random(800)).normalize().mult(weight * 6);
    console.log('start at', position.x + previousVariance?.x, position.y + previousVariance?.y);
    for (var i=0; i<length/stepLength; i++) {
      var newPosition = p5.Vector.add(position, step);
      //var variance = createVector(random(width*2)-width, random(height*2)-height).normalize().mult(weight);
      var variance = createVector(random(400), random(800)).normalize().mult(weight * 6);
      var previousX = position.x + (previousVariance ? previousVariance.x : 0);
      var previousY = position.y + (previousVariance ? previousVariance.y : 0);
      console.log('v', variance.x, variance.y);
      line(previousX, previousY, newPosition.x + variance.x, newPosition.y + variance.y);
      position = newPosition; 
      previousVariance = variance;
    }
  }
  
  function scribble2Line(x1, y1, x2, y2, weight, darkness) {
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
    var previousVariance = createVector(random(900), random(5200)).normalize().mult(weight);
    
    for (var i=0; i<length/stepLength; i++) {
      var newPosition = p5.Vector.add(position, step);
      var variance = createVector(random(900*2)-900, random(5200*2)-5200).normalize().mult(weight);
      
      var previousX = position.x + (previousVariance ? previousVariance.x : 0);
      var previousY = position.y + (previousVariance ? previousVariance.y : 0);
      
      line(previousX, previousY, newPosition.x + variance.x, newPosition.y + variance.y);
      position = newPosition; 
      previousVariance = variance;
    }
  }