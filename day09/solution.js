const fs = require('fs');
const path = require('path');

// Use sample.txt or input.txt based on command line arg
const inputFile = process.argv[2] === 'sample' ? 'sample.txt' : 'input.txt';
const input = fs.readFileSync(path.join(__dirname, inputFile), 'utf8').trim();
const lines = input.split('\n');

// Part 1
function part1(lines) {
  // TODO: implement
  return 0;
}

// Part 2
function part2(lines) {
  // TODO: implement
  return 0;
}

console.log(`Day 9 (${inputFile})`);
console.log('Part 1:', part1(lines));
console.log('Part 2:', part2(lines));
