const fs = require('fs');
const path = require('path');

// Use sample.txt or input.txt based on command line arg
const inputFile = process.argv[2] === 'sample' ? 'sample.txt' : 'input.txt';
const input = fs.readFileSync(path.join(__dirname, inputFile), 'utf8').trim();
const lines = input.split('\n');

// Part 2: Cephalopod math (right-to-left, column-wise numbers)
function part2(lines) {
  // Parse as character grid
  const maxLen = Math.max(...lines.map(l => l.length));
  const grid = lines.map(l => l.padEnd(maxLen, ' '));
  const numRows = grid.length;
  const numCols = maxLen;
  const opRow = numRows - 1;

  // Separator column = all spaces in number rows
  const isSeparator = (col) => {
    for (let row = 0; row < opRow; row++) {
      if (grid[row][col] !== ' ') return false;
    }
    return true;
  };

  // Group character columns into problem blocks
  // problems[p][charCol][row] = character
  const problems = []; // each = { cols: [col indices], op }
  let currentCols = [];
  let currentOp = null;

  for (let col = 0; col < numCols; col++) {
    if (isSeparator(col)) {
      if (currentCols.length > 0) {
        problems.push({ cols: currentCols, op: currentOp });
        currentCols = [];
        currentOp = null;
      }
    } else {
      currentCols.push(col);
      const ch = grid[opRow][col];
      if (ch === '+' || ch === '*') currentOp = ch;
    }
  }
  if (currentCols.length > 0) {
    problems.push({ cols: currentCols, op: currentOp });
  }

  // Process problems right-to-left
  let grandTotal = 0;
  for (let p = problems.length - 1; p >= 0; p--) {
    const { cols, op } = problems[p];
    // Read columns right-to-left; each column = one number (top-to-bottom digits)
    const nums = [];
    for (let c = cols.length - 1; c >= 0; c--) {
      const col = cols[c];
      let numStr = '';
      for (let row = 0; row < opRow; row++) {
        const ch = grid[row][col];
        if (ch >= '0' && ch <= '9') numStr += ch;
      }
      if (numStr.length > 0) {
        nums.push(parseInt(numStr, 10));
      }
    }
    const result = op === '+'
      ? nums.reduce((a, b) => a + b, 0)
      : nums.reduce((a, b) => a * b, 1);
    grandTotal += result;
  }

  console.log(`  ${problems.length} problems solved (cephalopod style)`);
  return grandTotal;
}

console.log(`Day 6 Part 2 (${inputFile})`);
console.log('Part 2:', part2(lines));
