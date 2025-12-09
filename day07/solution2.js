const fs = require('fs');

const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(inputFile, 'utf8').trim().split('\n');

// Find starting position S
let timelines = new Map(); // column -> count of timelines
for (let col = 0; col < input[0].length; col++) {
  if (input[0][col] === 'S') {
    timelines.set(col, 1n); // BigInt for potentially large counts
    break;
  }
}

// Process row by row
for (let row = 1; row < input.length; row++) {
  const line = input[row];
  const newTimelines = new Map();

  for (const [col, count] of timelines) {
    if (col < 0 || col >= line.length) {
      // Exits manifold - timelines still count at end
      newTimelines.set(col, (newTimelines.get(col) || 0n) + count);
      continue;
    }

    if (line[col] === '^') {
      // Hit a splitter - each timeline splits into 2
      newTimelines.set(col - 1, (newTimelines.get(col - 1) || 0n) + count);
      newTimelines.set(col + 1, (newTimelines.get(col + 1) || 0n) + count);
    } else {
      // Continue downward
      newTimelines.set(col, (newTimelines.get(col) || 0n) + count);
    }
  }

  timelines = newTimelines;
}

// Sum all timelines that made it through
let total = 0n;
for (const count of timelines.values()) {
  total += count;
}

console.log(`Timelines: ${total}`);
