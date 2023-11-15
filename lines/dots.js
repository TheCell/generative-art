function dotLine(x1, y1, x2, y2, weight, darkness) {
    strokeWeight(1);
    stroke(0, 100, 0, darkness);
    
    var from = createVector(x1, y1);
    var to = createVector(x2, y2);
    var stepSize = 5;
    var completeLine = p5.Vector.sub(to, from)
    var step = completeLine.copy().normalize().mult(stepSize);
    
    var position = createVector(x1, y1);
    var stepLength = step.copy().mag();
    var length = completeLine.copy().mag();
    
    for (var i=0; i<length/stepLength; i++) {
      var newPosition = p5.Vector.add(position, step);
  
      dotCircle(position.x, position.y, 2 + weight * 2);
      position = newPosition; 
    }
  }
  
  function dotCircle(x, y, radius) {
    var dots = [];
    for (var i=0; i<radius * 2; i++) {
      addDistributedDotToList(dots, x-radius/2, y-radius/2, radius, radius, 10, 3);
    }
    for (var i=0; i<dots.length; i++) {
      var dot = dots[i];
      if (random(100) > 80) {
        strokeWeight(2);
      } else {
        strokeWeight(1);
      }
      point(dot.x, dot.y);
    }
  }

  function addDistributedDotToList(dots, x, y, width, height, numberOfRetries, minRadius) {
    if (numberOfRetries == 0) {
      return;
    }
  
    var randomX = random(width) + x;
    var randomY = random(height) + y;
    var newP = createVector(randomX, randomY);
  
    if (!dots.some(d => p5.Vector.sub(d, newP).mag() < minRadius)) {
      dots.push(newP);
    } else {
      addDistributedDotToList(dots, x, y, width, height, numberOfRetries - 1, minRadius);
    }
  }