window.sudokuHelpers = {
  createSudokuGrid(gridArr, rowIndex, colIndex) {
    if (!gridArr) {
      gridArr = this.generateGridArr();
      rowIndex = 0;
      colIndex = 0;
    }

    var possibleNumbers = this.getPossibleNumbers(gridArr, rowIndex, colIndex);
    // if there are no possibleNumbers, the grid won't work. retreat!!
    if (possibleNumbers.length === 0) {
      return false;
    }

    if (rowIndex === 8 && colIndex === 8) {
      gridArr[rowIndex][colIndex] = possibleNumbers[0];

      return gridArr;
    }

    var randomizedNumbers = this.shuffleArray(possibleNumbers);

    var nextColIndex = colIndex === 8 ? 0 : colIndex + 1;
    var nextRowIndex = colIndex === 8 ? rowIndex + 1 : rowIndex;

    for (var i = 0; i < possibleNumbers.length; i++) {
      gridArr[rowIndex][colIndex] = possibleNumbers[i];

      if (this.createSudokuGrid(gridArr, nextRowIndex, nextColIndex)) {
        return gridArr;
      } else {
        gridArr[rowIndex].splice(colIndex, 1);
      }
    }

    return false;
  },

  shuffleArray(array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },

  generateGridArr() {
    var gridArr = [];
    for (var t = 0; t < 9; t++) {
      gridArr.push([]);
    }

    return gridArr;
  },

  getPossibleNumbers(gridArr, rowIndex, colIndex) {
    var possibleNumbers = [1,2,3,4,5,6,7,8,9];

    var colArr = this.getColumn(gridArr, colIndex);
    var rowArr = this.getRow(gridArr, rowIndex);
    var squareArr = this.getSquare(gridArr, rowIndex, colIndex);
    var usedNumsArray = colArr.concat(rowArr).concat(squareArr);
    usedNumsArray.forEach(usedNum => {
      // if num has been used, remove it from possibleNumbers
      var index = possibleNumbers.indexOf(usedNum);
      if (index !== -1) {
        possibleNumbers.splice(index, 1);
      }
    });

    return possibleNumbers;
  },

  getColumn(gridArr, colIndex) {
    if (colIndex < 0) {
      throw new Error('`colIndex` must be >= 0');
    }

    if (colIndex > 8) {
      throw new Error('`colIndex` must be <= 8');
    }

    var columnArray = [];
    for (var rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
      columnArray.push(gridArr[rowIndex][colIndex]);
    }

    return columnArray;
  },

  getRow(gridArr, rowIndex) {
    if (rowIndex < 0) {
      throw new Error('`rowIndex` must be >= 0');
    }

    if (rowIndex > 8) {
      throw new Error('`rowIndex` must be <= 8');
    }

    return gridArr[rowIndex];
  },

  getSquare(gridArr, rowIndex, colIndex) {
    var squareArray = [];

    var rowStartingIndex = Math.floor(rowIndex / 3) * 3;
    var colStartingIndex = Math.floor(colIndex / 3) * 3;

    for (var rowIndex = rowStartingIndex; rowIndex <= rowStartingIndex + 2; rowIndex++) {
      for (var colIndex = colStartingIndex; colIndex <= colStartingIndex + 2; colIndex++) {
        squareArray.push(gridArr[rowIndex][colIndex]);
      }
    }

    return squareArray;
  },

  addEmptyCellsToGrid(gridArr) {
    // get a random Cell
    var randomFilledCellCoordinates = this.getCoordsOfRandomFilledCell(gridArr);
    var randomFCRowIndex = randomFilledCellCoordinates[0];
    var randomFCColIndex = randomFilledCellCoordinates[1];

    // empty that Cell
    var cellValue = gridArr[randomFCRowIndex][randomFCColIndex];
    gridArr[randomFCRowIndex][randomFCColIndex] = undefined;

    // is there only one possible solution? if yes, repeat, if not, undo change and return
    if (this.countUniqueSolutions(gridArr) === 1) {
      return this.addEmptyCellsToGrid(gridArr);
    } else {
      gridArr[randomFCRowIndex][randomFCColIndex] = cellValue;
      return gridarr;
    }
  },

  getCoordsOfRandomFilledCell(gridArr) {
    var filledCellsArr = [];
    for (var rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
      for (var colIndex = 0; colIndex < gridArr.length; colIndex++) {
        if (gridArr[rowIndex][colIndex]) {
          filledCellsArr.push([rowIndex, colIndex]);
        }
      }
    }
    // celebrate good times
    var randomCoordinates = filledCellsArr[Math.floor(Math.random() * filledCellsArr.length)];
    return randomCoordinates;
  },

  countUniqueSolutions(gridArr) {
    // find all empty cells in gridArr and push into emptyCellsArr
    var emptyCellsArr = [];
    for (var rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
      for (var colIndex = 0; colIndex < gridArr.length; colIndex++) {
        if (gridArr[rowIndex][colIndex] === undefined) {
          emptyCellsArr.push([rowIndex, colIndex]);
        }
      }
    }

    // push each cell's possibleNumbers into possibleNumbersArr
    var possibleNumbersArr = [];
    for (var q = 0; q < emptyCellsArr.length; q++) {
      var rowIndex = emptyCellsArr[q][0];
      var colIndex = emptyCellsArr[q][1];
      var possibleNumbers = this.getPossibleNumbers(gridArr[rowIndex][colIndex]);
      possibleNumbersArr.push(possibleNumbers);

      if (possibleNumbers.length === 0) {
        return 0;
      } else if (possibleNumbers.length === 1) {
        gridArr[rowIndex][colIndex] = possibleNumbers[0];
        return this.addEmptyCellsToGrid(gridArr);
      } else if (q === emptyCellsArr.length - 1) {
        // if at end of emptyCellsArr and no number placed,
        // choose a random cell and loop through its possibleNumbers
        var availableIndexes = [];
        for (var index = 0; index < emptyCellsArr.length; index++) {
          // randomize the availableIndexes you go
          if (Math.random() > 0.5) {
            availableIndexes.push(index);
          } else {
            availableIndexes.shift(index);
          }
        }

        var randomIndex = availableIndexes[0];
        var rowIndexOfRandomCell = emptyCellsArr[randomIndex][0];
        var colIndexOfRandomCell = emptyCellsArr[randomIndex][1];
        var possibleNumbersForCell = possibleNumbersArr[randomIndex];

        for (var index = 0; index < possibleNumbersForCell.length; index++) {
          gridArr[rowIndexOfRandomCell][colIndexOfRandomCell] = possibleNumbersForCell[index];
          return this.addEmptyCellsToGrid(gridArr);
        }
      }
    }

    return 0;
  },
};
