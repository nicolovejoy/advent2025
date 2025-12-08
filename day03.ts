import { readFileSync } from "fs";

function maxJoltage(line: string): number {
  // O(N) time, O(1) space - single reverse pass
  // Track max digit seen to the right, compute best pair on the fly
  let maxToRight = 0;
  let best = 0;

  for (let i = line.length - 1; i >= 0; i--) {
    const digit = parseInt(line[i], 10);
    if (i < line.length - 1) {
      // Can form a two-digit number with this as tens place
      const candidate = digit * 10 + maxToRight;
      if (candidate > best) best = candidate;
    }
    if (digit > maxToRight) maxToRight = digit;
  }

  return best;
}

const input = readFileSync("day03-input.txt", "utf-8").trim();
const lines = input.split("\n");

const part1 = lines.reduce((sum, line) => sum + maxJoltage(line), 0);
console.log("Part 1:", part1);
