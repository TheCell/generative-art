const CellSelectionAlgorithm = {
    Random: 'Random',
    CloseToPrevious: 'Close to previous',
    InACircle: 'In a circle',
    Spiraling: 'Spiraling',
    LowerRightHalf: 'Lower right half',
    EmergeFromACenter: 'Emerge from a center',
    EmergeFromCenters: 'Emerge from centers',
    EmergeFromACorner: 'Emerge from a corner',
    EmergeFromACornerButDontStopAtBorders: 'Emerge from a corner continue at borders',
    EmergeFromTwoCorners: 'Emerge from two corners'
};

function updateAlgorithmDefaults() {
    options.gridSizeX = 10;
    options.gridSizeY = 16;
    options.cellSize = 40;
    if (options.cellSelection === CellSelectionAlgorithm.EmergeFromCenters) {
        options.numberOfSplines = 57;
        options.numberOfPoints = 5;
    } else if (options.cellSelection === CellSelectionAlgorithm.EmergeFromACenter) {
        options.numberOfSplines = 20;
        options.numberOfPoints = 5;
    } else if (options.cellSelection === CellSelectionAlgorithm.InACircle ||
               options.cellSelection === CellSelectionAlgorithm.Spiraling ||
               options.cellSelection === CellSelectionAlgorithm.LowerRightHalf ||
               options.cellSelection === CellSelectionAlgorithm.EmergeFromACorner ||
               options.cellSelection === CellSelectionAlgorithm.EmergeFromACornerButDontStopAtBorders) {
        options.numberOfSplines = 20;
        options.numberOfPoints = 30;
    } else if (options.cellSelection === CellSelectionAlgorithm.EmergeFromTwoCorners) {
        options.numberOfSplines = 580;
        options.numberOfPoints = 80;
        options.gridSizeX = 26;
        options.gridSizeY = 43;
        options.cellSize = 15;
    } else {
        options.numberOfSplines = 20;
        options.numberOfPoints = 5;
    }
}

function selectRandomCell(nrOfXCells, nrOfYCells) {
    var randomGridCellX = Math.round(random(0, nrOfXCells-1));
    var randomGridCellY = Math.round(random(0, nrOfYCells-1));
    return [randomGridCellX, randomGridCellY];
}

function selectCloseToPreviousOne(nrOfXCells, nrOfYCells, previousCellX, previousCellY) {
    var randomGridCellX, randomGridCellY;
    if (previousCellX !== undefined && previousCellY !== undefined) {
        var diffX = random(100) > 50 ? 1 : -1;
        var diffY = random(100) > 50 ? 1 : -1;
        randomGridCellX = (previousCellX + diffX) % nrOfXCells;
        randomGridCellY = (previousCellY + diffY) % nrOfYCells;
    } else {
        // random if it's the first cell
        randomGridCellX = Math.round(random(0, nrOfXCells-1));
        randomGridCellY = Math.round(random(0, nrOfYCells-1));
    }
    return [randomGridCellX, randomGridCellY];
}

function selectCellInACircle(nrOfXCells, nrOfYCells, previousCellX, previousCellY, prepreviousCellX, prepreviousCellY) {
    var randomGridCellX, randomGridCellY;
    if (prepreviousCellX !== undefined && prepreviousCellY !== undefined) {
      if (previousCellY > prepreviousCellY) {
        randomGridCellX = (previousCellX - 1) % nrOfXCells;
        randomGridCellY = previousCellY;
      } else if (previousCellY < prepreviousCellY) {
        randomGridCellX = (previousCellX + 1) % nrOfXCells;
        randomGridCellY = previousCellY;
      } else if (previousCellX > prepreviousCellX) {
        randomGridCellX = previousCellX;
        randomGridCellY = (previousCellY + 1) % nrOfYCells;
      } else {
        randomGridCellX = previousCellX;
        randomGridCellY = (previousCellY - 1) % nrOfYCells;
      }
    } else if (previousCellX !== undefined && previousCellY !== undefined) {
      var diffX = random(100) > 50 ? 1 : -1;
      var diffY = random(100) > 50 ? 1 : -1;
      randomGridCellX = (previousCellX + diffX) % nrOfXCells;
      randomGridCellY = (previousCellY + diffY) % nrOfYCells;
    } else {
      randomGridCellX = Math.round(random(0, nrOfXCells-1));
      randomGridCellY = Math.round(random(0, nrOfYCells-1));
    }
    return [randomGridCellX, randomGridCellY];
}

function selectSpiralingCell(nrOfXCells, nrOfYCells, previousCellX, previousCellY, prepreviousCellX, prepreviousCellY, i) {
    var randomGridCellX, randomGridCellY;
    var offset = Math.floor((i/options.numberOfPoints) * 7) + 1;

    if (prepreviousCellX !== undefined && prepreviousCellY !== undefined) {
      if (previousCellY > prepreviousCellY) {
        randomGridCellX = (previousCellX - offset) % nrOfXCells;
        randomGridCellY = previousCellY;
      } else if (previousCellY < prepreviousCellY) {
        randomGridCellX = (previousCellX + offset) % nrOfXCells;
        randomGridCellY = previousCellY;
      } else if (previousCellX > prepreviousCellX) {
        randomGridCellX = previousCellX;
        randomGridCellY = (previousCellY + offset) % nrOfYCells;
      } else {// if (previousCellX < prepreviousCellX) {
        randomGridCellX = previousCellX;
        randomGridCellY = (previousCellY - offset) % nrOfYCells;
      }
    } else if (previousCellX !== undefined && previousCellY !== undefined) {
      var diffX = random(100) > 50 ? 1 : -1;
      var diffY = random(100) > 50 ? 1 : -1;
      randomGridCellX = (previousCellX + diffX) % nrOfXCells;
      randomGridCellY = (previousCellY + diffY) % nrOfYCells;
    } else {
      randomGridCellX = Math.round(random(0, nrOfXCells-1));
      randomGridCellY = Math.round(random(0, nrOfYCells-1));
    }
    return [randomGridCellX, randomGridCellY];
}

function selectCellInLowerRightHalf(nrOfXCells, nrOfYCells) {
    var randomGridCellX, randomGridCellY;
    
    randomGridCellY = Math.round(random(0, nrOfYCells-1));
    
    var yPart = (1 - (randomGridCellY / nrOfYCells));
    var minX = yPart * nrOfXCells;
    var randX = random(minX, nrOfXCells-1);
    randomGridCellX = Math.floor(randX);

    return [randomGridCellX, randomGridCellY];
}

function emergeFromACenter(nrOfXCells, nrOfYCells, previousCellX, previousCellY, previousSpline, splineIndex) {
    var randomGridCellX, randomGridCellY;
    
    if (previousCellX === undefined && previousCellY === undefined) {
        if (!previousSpline || splineIndex % 20 === 0) {
            randomGridCellX = Math.round(random(0, nrOfXCells-1));
            randomGridCellY = Math.round(random(0, nrOfYCells-1));
        } else {
            randomGridCellX = previousSpline.gridCells[0][0];
            randomGridCellY = previousSpline.gridCells[0][1];
        }
    } else {
        var diffX = random(100) > 50 ? 1 : -1;
        var diffY = random(100) > 50 ? 1 : -1;
        randomGridCellX = (previousCellX + diffX);
        randomGridCellY = (previousCellY + diffY);
    }
    if (randomGridCellX >= nrOfXCells || randomGridCellX < 0 ||
        randomGridCellY >= nrOfYCells || randomGridCellY < 0) {
        // if we get to a border, stop this spline
        return;
    }

    return [randomGridCellX, randomGridCellY];
}

function emergeFromACorner(nrOfXCells, nrOfYCells, previousCellX, previousCellY, left = false, top = false) {
    var randomGridCellX, randomGridCellY;
    
    if (previousCellX === undefined && previousCellY === undefined) {
        randomGridCellX = left ? 0 : grid.length-1; // TODO Randomize but same as previous spline
        randomGridCellY = top ? 0 : grid[0].length-1;
    } else {
        var diffX = random(100) > 50 ? 1 : -1;
        var diffY = random(100) > 50 ? 1 : -1;
        randomGridCellX = (previousCellX + diffX);
        randomGridCellY = (previousCellY + diffY);
        if (randomGridCellX >= nrOfXCells || randomGridCellX < 0 ||
            randomGridCellY >= nrOfYCells || randomGridCellY < 0) {
            // if we get to a border, stop this spline
            return;
        }
    }

    return [randomGridCellX, randomGridCellY];
}

function emergeFromACornerButDontStopAtBorders(nrOfXCells, nrOfYCells, previousCellX, previousCellY) {
    var next = undefined;
    while (!next) {
        next = emergeFromACorner(nrOfXCells, nrOfYCells, previousCellX, previousCellY);
    }
    return next;
}