const { readFileSync } = require("fs");

function maxNDigits(line, n) {
  let result = '';
  let start = 0;

  for (let i = 0; i < n; i++) {
    const end = line.length - (n - i);
    let maxPos = start;
    for (let j = start; j <= end; j++) {
      if (line[j] > line[maxPos]) maxPos = j;
    }
    result += line[maxPos];
    start = maxPos + 1;
  }

  return result;
}

const lines = readFileSync(__dirname + "/input.txt", "utf-8").trim().split("\n");
const results = lines.map(line => maxNDigits(line, 12));
const total = results.reduce((sum, r) => sum + BigInt(r), 0n);

console.log(`Processed ${lines.length} banks`);
console.log(`First: ${results[0]}, Last: ${results.at(-1)}`);
console.log(`Total: ${total}`);
