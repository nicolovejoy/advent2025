const fs = require('fs');
const path = require('path');

// Use sample.txt or input.txt based on command line arg
const inputFile = process.argv[2] === 'sample' ? 'sample.txt' : 'input.txt';
const input = fs.readFileSync(path.join(__dirname, inputFile), 'utf8').trim();

/*
 * Day 4: Printing Department
 *
 * Warehouse grid with paper rolls (@) and empty floor (.)
 * Forklifts can access a roll if it has fewer than 4 adjacent rolls.
 *
 * Design decisions:
 * - Parse into 2D array for clean [row][col] access
 * - Immutable grid (copy if Part 2 needs simulation)
 * - Bounds checking: out-of-bounds = empty floor (not a roll)
 * - Structure supports finding accessible rolls as coordinates for Part 2
 */

const ROLL = '@';
const FLOOR = '.';

// 8 directions: N, NE, E, SE, S, SW, W, NW
const DIRECTIONS = [
  [-1, 0], [-1, 1], [0, 1], [1, 1],
  [1, 0], [1, -1], [0, -1], [-1, -1]
];

function parseWarehouse(input) {
  return input.split('\n').map(row => row.split(''));
}

function isRoll(cell) {
  return cell === ROLL;
}

function countAdjacentRolls(warehouse, row, col) {
  const numRows = warehouse.length;
  const numCols = warehouse[0].length;
  let count = 0;

  for (const [dr, dc] of DIRECTIONS) {
    const newRow = row + dr;
    const newCol = col + dc;
    // Out of bounds = floor (no roll there)
    if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
      if (isRoll(warehouse[newRow][newCol])) {
        count++;
      }
    }
  }
  return count;
}

function isAccessible(warehouse, row, col) {
  return isRoll(warehouse[row][col]) && countAdjacentRolls(warehouse, row, col) < 4;
}

function findAccessibleRolls(warehouse) {
  const accessible = [];
  for (let row = 0; row < warehouse.length; row++) {
    for (let col = 0; col < warehouse[row].length; col++) {
      if (isAccessible(warehouse, row, col)) {
        accessible.push({ row, col });
      }
    }
  }
  return accessible;
}

// Part 1: Count rolls accessible by forklifts (fewer than 4 neighbors)
function part1(warehouse) {
  return findAccessibleRolls(warehouse).length;
}

// Part 2: Simulate removing accessible rolls until none remain
function part2(warehouse) {
  // Work on a mutable copy
  const grid = warehouse.map(row => [...row]);
  let totalRemoved = 0;

  while (true) {
    const accessible = findAccessibleRolls(grid);
    if (accessible.length === 0) break;

    // Remove all accessible rolls
    for (const { row, col } of accessible) {
      grid[row][col] = FLOOR;
    }
    totalRemoved += accessible.length;
  }

  return totalRemoved;
}

const warehouse = parseWarehouse(input);
console.log(`Day 4 (${inputFile}): ${warehouse.length} rows x ${warehouse[0].length} cols`);
console.log('Part 1:', part1(warehouse));
console.log('Part 2:', part2(warehouse));
