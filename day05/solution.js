const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2] === 'sample' ? 'sample.txt' : 'input.txt';
const input = fs.readFileSync(path.join(__dirname, inputFile), 'utf8').trim();

function parse(input) {
  const [rangeSection, idSection] = input.split('\n\n');
  const ranges = rangeSection.split('\n').map(line => {
    const [start, end] = line.split('-').map(Number);
    return [start, end];
  });
  const ids = idSection.split('\n').map(Number);
  return { ranges, ids };
}

function mergeRanges(ranges) {
  if (ranges.length === 0) return [];
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [ranges[0]];
  for (let i = 1; i < ranges.length; i++) {
    const [start, end] = ranges[i];
    const last = merged[merged.length - 1];
    if (start <= last[1] + 1) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}

function part1({ ranges, ids }) {
  const merged = mergeRanges([...ranges]);
  const sortedIds = [...ids].sort((a, b) => a - b);

  let count = 0;
  let r = 0;
  for (const id of sortedIds) {
    while (r < merged.length && merged[r][1] < id) r++;
    if (r < merged.length && id >= merged[r][0] && id <= merged[r][1]) {
      count++;
    }
  }

  console.log(`Ranges: ${ranges.length} → ${merged.length} merged`);
  console.log(`IDs to check: ${ids.length}`);
  return count;
}

function part2({ ranges }) {
  const merged = mergeRanges([...ranges]);
  const total = merged.reduce((sum, [start, end]) => sum + (end - start + 1), 0);
  console.log(`Total fresh IDs across ${merged.length} merged ranges`);
  return total;
}

const data = parse(input);
console.log(`Day 5 (${inputFile})`);
console.log('Part 1:', part1(data));
console.log('Part 2:', part2(data));
