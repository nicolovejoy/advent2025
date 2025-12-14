const fs = require('fs');
const path = require('path');

// Use sample.txt or input.txt based on command line arg
const inputFile = process.argv[2] === 'sample' ? 'sample.txt' : 'input.txt';
const input = fs.readFileSync(path.join(__dirname, inputFile), 'utf8').trim();
const lines = input.split('\n');

// Part 1
function part1(lines) {
  // Parse points
  const points = lines.map(line => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
  });

  console.log(`Loaded ${points.length} red tiles`);

  // Check all pairs, track maximum area
  let maxArea = 0;
  let bestPair = null;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i];
      const p2 = points[j];

      const width = Math.abs(p2.x - p1.x) + 1;
      const height = Math.abs(p2.y - p1.y) + 1;
      const area = width * height;

      if (area > maxArea) {
        maxArea = area;
        bestPair = { p1, p2, width, height };
      }
    }
  }

  console.log(`Best rectangle: (${bestPair.p1.x},${bestPair.p1.y}) to (${bestPair.p2.x},${bestPair.p2.y})`);
  console.log(`Dimensions: ${bestPair.width} x ${bestPair.height}`);

  return maxArea;
}

// Part 2
function part2(lines) {
  // TODO: implement
  return 0;
}

console.log(`Day 9 (${inputFile})`);
console.log('Part 1:', part1(lines));
console.log('Part 2:', part2(lines));
