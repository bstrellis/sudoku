window.sudokuHelpers = {
  createSudokuGrid(gridArr, rowIndex, colIndex) {
    if (!gridArr) {
      gridArr = this.generateGridArr();
      rowIndex = 0;
      colIndex = 0;
    }

    var possibleNumbers = this.getPossibleNumbers(gridArr, rowIndex, colIndex);
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
      var index = possibleNumbers.indexOf(usedNum);
      if (index !== -1) {
        possibleNumbers.splice(index, 1);
      }
    });

    return possibleNumbers;
  },

  getColumn(gridArray, colIndex) {
    if (colIndex < 0) {
      throw new Error('`colIndex` must be >= 0');
    }

    if (colIndex > 8) {
      throw new Error('`colIndex` must be <= 8');
    }

    var columnArray = [];
    for (var rowIndex = 0; rowIndex < gridArray.length; rowIndex++) {
      columnArray.push(gridArray[rowIndex][colIndex]);
    }

    return columnArray;
  },

  getRow(gridArray, rowIndex) {
    return gridArray[rowIndex];
  },

  getSquare(gridArray, rowIndex, colIndex) {
    var squareArray = [];

    var rowStartingIndex = Math.floor(rowIndex / 3) * 3;
    var colStartingIndex = Math.floor(colIndex / 3) * 3;

    for (var rowIndex = rowStartingIndex; rowIndex <= rowStartingIndex + 2; rowIndex++) {
      for (var colIndex = colStartingIndex; colIndex <= colStartingIndex + 2; colIndex++) {
        squareArray.push(gridArray[rowIndex][colIndex]);
      }
    }

    return squareArray;
  },
};
