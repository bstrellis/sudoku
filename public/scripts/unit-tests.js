///////////////
//           //
//   Tests   //
//           //
///////////////

function runTests() {
  testGenerateGridArr();
  testCreateSudokuGrid();
  testGetColumn();
  testGetRow();
  testGetSquare();
}

function testGenerateGridArr() {
  console.log(`*** testGenerateGridArr`);

  var gridArr = window.sudokuHelpers.generateGridArr();

  assertStrictEqual(gridArr.constructor, Array);

  assertStrictEqual(gridArr.length, 9);

  gridArr.forEach(row => {
    assertStrictEqual(row.constructor, Array);
    assertStrictEqual(row.length, 0);
  });
}

function testCreateSudokuGrid() {
  console.log(`*** testCreateSudokuGrid`);

  var gridArr = window.sudokuHelpers.createSudokuGrid();
  assertStrictEqual(gridArr.constructor, Array);
  assertStrictEqual(gridArr.length, 9);

  var uniquenessTestArr = window.sudokuHelpers.createSudokuGrid();
  var gridArrIsUnique = false;
  for (var rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
    for (var colIndex = 0; colIndex < gridArr.length; colIndex++) {
      if (uniquenessTestArr[rowIndex][colIndex] !== gridArr[rowIndex][colIndex]) {
        gridArrIsUnique = true;
      }
    }
  }
  assertStrictEqual(gridArrIsUnique, true);

  for (var rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
    for (var colIndex = 0; colIndex < gridArr.length; colIndex++) {
      var num = gridArr[rowIndex][colIndex];
      gridArr[rowIndex][colIndex] = undefined;
      var possibleNumbers = window.sudokuHelpers.getPossibleNumbers(gridArr, rowIndex, colIndex);
      assertStrictEqual(possibleNumbers.length, 1);
      assertStrictEqual(possibleNumbers[0], num);
      gridArr[rowIndex][colIndex] = num;
    }
  }

  for (var rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
    var row = gridArr[rowIndex];
    assertStrictEqual(row.constructor, Array);
    assertStrictEqual(row.length, 9);
  }

  for (var rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
    for (var colIndex = 0; colIndex < gridArr.length; colIndex++) {
      var num = gridArr[rowIndex][colIndex];
      assertStrictEqual(num <= 9 && num >= 1, true);
    }
  }

  // make sure that the numbers 1 - 9 are in each row
  for (var rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
    for (var possibleNum = 1; possibleNum < 9; possibleNum++) {
      assertStrictEqual(gridArr[rowIndex].indexOf(possibleNum) === -1, false);
    }
  }

  // make sure that 1 - 9 are in each column
  var testColumn = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (var colIndex = 0; colIndex < gridArr.length; colIndex++) {
    var column = window.sudokuHelpers.getColumn(gridArr, colIndex);
    for (var rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
      column.sort();
      assertStrictEqual(column[rowIndex], testColumn[rowIndex]);
    }
  }
}

function testGetColumn() {
  console.log(`*** testGetColumn`);

  var emptyGrid = window.sudokuHelpers.generateGridArr();
  var firstCol = window.sudokuHelpers.getColumn(emptyGrid, 0);
  assertStrictEqual(firstCol.length, 9);

  var grid = generate9By9TestGrid();
  firstCol = window.sudokuHelpers.getColumn(grid, 0);
  assertArraysAreSimilar(firstCol, [8,9,3,5,4,6,7,1,2]);

  // check that indices outside of the expected range throw an error
  assertErrorThrown(function () {
    window.sudokuHelpers.getColumn(grid, -1);
  });
  assertErrorThrown(function () {
    window.sudokuHelpers.getColumn(grid, 9);
  });
}

function testGetRow() {
  console.log(`*** testGetRow`);

  var emptyGrid = window.sudokuHelpers.generateGridArr();
  var firstRow = window.sudokuHelpers.getRow(emptyGrid, 0);
  assertStrictEqual(firstRow.length, 0);

  var grid = generate9By9TestGrid();
  var firstRow = window.sudokuHelpers.getRow(grid, 0);
  assertArraysAreSimilar(firstRow, [8,2,7,1,5,4,3,9,6]);
}

function testGetSquare() {
  console.log(`*** testGetSquare`);

  // check that correct squares are compiled from various starting points
  var grid = generate9By9TestGrid();
  var squareArray = window.sudokuHelpers.getSquare(grid, 2, 2);
  assertArraysAreSimilar(squareArray, [8,2,7,9,6,5,3,4,1]);

  squareArray = window.sudokuHelpers.getSquare(grid, 8, 8);
  assertArraysAreSimilar(squareArray, [9,1,4,8,2,3,5,6,7]);

  squareArray = window.sudokuHelpers.getSquare(grid, 0, 8);
  assertArraysAreSimilar(squareArray, [3,9,6,1,4,8,7,5,2]);

  squareArray = window.sudokuHelpers.getSquare(grid, 3, 3);
  assertArraysAreSimilar(squareArray, [4,6,8,5,1,3,9,7,2]);
}

function testAddEmptyCellsToGrid() {
  console.log('*** testAddEmptyCellsToGrid');

  // gridArr is Array
  // randomFCRowIndex and randomFCColIndex is Number
  //

}

//////////////////////
//                  //
//   Test Helpers   //
//                  //
//////////////////////

function generate9By9TestGrid() {
  return [[8, 2, 7, 1, 5, 4, 3, 9, 6],
          [9, 6, 5, 3, 2, 7, 1, 4, 8],
          [3, 4, 1, 6, 8, 9, 7, 5, 2],
          [5, 9, 3, 4, 6, 8, 2, 7, 1],
          [4, 7, 2, 5, 1, 3, 6, 8, 9],
          [6, 1, 8, 9, 7, 2, 4, 3, 5],
          [7, 8, 6, 2, 3, 5, 9, 1, 4],
          [1, 5, 4, 7, 9, 6, 8, 2, 3],
          [2, 3, 9, 8, 4, 1, 5, 6, 7]];
}

function printGrid(gridArr) {
  var str = '';

  for (var rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
    str += JSON.stringify(gridArr[rowIndex]) + '\n';
  }

  console.log(str);
}

////////////////////
//                //
//   Assertions   //
//                //
////////////////////

function assertStrictEqual(actualValue, expectedValue) {
  if (expectedValue === actualValue) {
    console.log(`✓ Test passed`);
  } else {
    throw new Error(`✖ expected ${expectedValue}, got ${actualValue}`);
  }
}

function assertArraysAreSimilar(actualArray, expectedArray) {
  if (expectedArray.constructor !== Array) {
    throw new Error(`✖ expectedArray must be an array`);
  }

  if (actualArray.constructor !== Array) {
    throw new Error(`✖ expected an Array, got ${actualArray.constructor}`);
  }

  if (expectedArray.length !== actualArray.length ||
      // Json.stringify used to test equivalence in case of array shenanigans
      JSON.stringify(expectedArray) !== JSON.stringify(actualArray)) {
    throw new Error(`✖ expected ${expectedValue}, got ${actualValue}`);
  }

  console.log(`✓ Test passed`);
}

function assertErrorThrown(runCustomCodeFn) {
  var errorThrown = false;
  try {
    runCustomCodeFn();
  } catch (e) {
    errorThrown = true;
  }

  if (errorThrown) {
    console.log(`✓ Test passed`);
  } else {
    throw new Error('✖ Expected error to be thrown');
  }
}
