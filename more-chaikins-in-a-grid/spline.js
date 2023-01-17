class Spline {
    constructor(initialPoints, points, gridCells) {
        this.initialPoints = initialPoints;
        this.points = points;
        this.gridCells = gridCells;
    }
}

function createSpline(bg) {
    var points;
    if (bg) {
      points = [
        [random() * width*2 - width/2, random() * height*2 -height/2],
        [random() * width*2 - width/2, random() * height*2 -height/2],
        [random() * width*2 - width/2, random() * height*2 -height/2],
        [random() * width*2 - width/2, random() * height*2 -height/2]
      ];
    } else {
      points = [
        [random() * width/4 + width/4*3, random() * height/4 + height/4 * 3],
        [random() * width/2 + width/2, random() * height],
        [random() * width/2 + width/2, random() * height],
        [random() * width/4, random() * height/4]
      ];
    }
    var spline = chaikin(points, 5);
    return new Spline(points, spline, []);
  }
  
  function createSplineInGrid(previousSpline, splineIndex) {
    var points = [];
    var gridCells = [];
    var xCells = grid.length;
    var yCells = grid[0].length;
  
    var previousCellX = undefined;
    var previousCellY = undefined;
    var prepreviousCellX = undefined;
    var prepreviousCellY = undefined;
    for (var i=0; i<options.numberOfPoints; i++) {
      var randomGridCellX = 0;
      var randomGridCellY = 0;
  
      var nextCell = undefined;
      
      if (options.cellSelection === CellSelectionAlgorithm.Random) {
        nextCell = selectRandomCell(xCells, yCells);
      } else if (options.cellSelection === CellSelectionAlgorithm.CloseToPrevious) {
        nextCell = selectCloseToPreviousOne(xCells, yCells, previousCellX, previousCellY);
      } else if (options.cellSelection === CellSelectionAlgorithm.InACircle) {
        nextCell = selectCellInACircle(xCells, yCells, previousCellX, previousCellY, prepreviousCellX, prepreviousCellY);
      } else if (options.cellSelection === CellSelectionAlgorithm.Spiraling) {
        nextCell = selectSpiralingCell(xCells, yCells, previousCellX, previousCellY, prepreviousCellX, prepreviousCellY, i);
      } else if (options.cellSelection === CellSelectionAlgorithm.LowerRightHalf) {
        nextCell = selectCellInLowerRightHalf(xCells, yCells);
      } else if (options.cellSelection === CellSelectionAlgorithm.EmergeFromACenter) {
        nextCell = emergeFromACenter(xCells, yCells, previousCellX, previousCellY, previousSpline, splineIndex);
      } else if (options.cellSelection === CellSelectionAlgorithm.EmergeFromACorner) {
        nextCell = emergeFromACorner(xCells, yCells, previousCellX, previousCellY);
      } else if (options.cellSelection === CellSelectionAlgorithm.EmergeFromACornerButDontStopAtBorders) {
        nextCell = emergeFromACornerButDontStopAtBorders(xCells, yCells, previousCellX, previousCellY);
      }
  
      if (!nextCell) {
        break;
      }
      randomGridCellX = nextCell[0];
      randomGridCellY = nextCell[1];
  
      randomGridCellX = randomGridCellX < 0 ? 0 : randomGridCellX;
      randomGridCellY = randomGridCellY < 0 ? 0 : randomGridCellY;
      prepreviousCellX = previousCellX;
      prepreviousCellY = previousCellY;
      previousCellX = randomGridCellX;
      previousCellY = randomGridCellY;
  
      var cell = grid[randomGridCellX][randomGridCellY];
      gridCells.push([randomGridCellX, randomGridCellY]);
      points.push([random(cell.getLeft(), cell.getRight()), random(cell.getTop(), cell.getBottom())]);
    }
    
    if (points.length > 2) {
      var spline = chaikin(points, 5);
      return new Spline(points, spline, gridCells);
    } else {
      return createSplineInGrid(previousSpline, splineIndex);
    }
  }