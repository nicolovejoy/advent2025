const fs = require('fs');

const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(inputFile, 'utf8').trim().split('\n');

// Find starting position S
let beams = new Set();
for (let col = 0; col < input[0].length; col++) {
  if (input[0][col] === 'S') {
    beams.add(col);
    break;
  }
}

let splits = 0;

// Process row by row
for (let row = 1; row < input.length; row++) {
  const line = input[row];
  const newBeams = new Set();

  for (const col of beams) {
    if (col < 0 || col >= line.length) {
      // Beam exits manifold
      continue;
    }

    if (line[col] === '^') {
      // Hit a splitter - emit left and right
      splits++;
      newBeams.add(col - 1);
      newBeams.add(col + 1);
    } else {
      // Continue downward
      newBeams.add(col);
    }
  }

  beams = newBeams;
}

console.log(`Splits: ${splits}`);
