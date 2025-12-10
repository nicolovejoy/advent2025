const fs = require('fs');
const path = require('path');

// Use sample.txt or input.txt based on command line arg
const inputFile = process.argv[2] === 'sample' ? 'sample.txt' : 'input.txt';
const input = fs.readFileSync(path.join(__dirname, inputFile), 'utf8').trim();
const lines = input.split('\n');

// Parse points as [x, y, z] arrays
function parsePoints(lines) {
  return lines.map(line => line.split(',').map(Number));
}

// Union-Find with path compression
function createUnionFind(n) {
  const parent = Array.from({ length: n }, (_, i) => i);

  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // path compression
    }
    return parent[x];
  }

  function union(a, b) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
      parent[rootA] = rootB;
      return true; // merged
    }
    return false; // already same circuit
  }

  return { find, union };
}

// Generate all pairs with squared distances (skip sqrt - ordering preserved)
function getAllPairs(points) {
  const pairs = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      const dz = points[i][2] - points[j][2];
      const distSq = dx * dx + dy * dy + dz * dz;
      pairs.push([distSq, i, j]);
    }
  }
  return pairs;
}

// Part 1
function part1(lines) {
  const points = parsePoints(lines);
  const n = points.length;
  console.log(`Parsed ${n} points`);

  // Generate and sort all pairs by distance
  const pairs = getAllPairs(points);
  console.log(`Generated ${pairs.length} pairs`);
  pairs.sort((a, b) => a[0] - b[0]);

  // Process closest pairs with Union-Find
  // Sample uses 10 connections, real input uses 1000
  const uf = createUnionFind(n);
  const connectCount = n === 20 ? 10 : 1000;
  let merges = 0;

  for (let i = 0; i < connectCount && i < pairs.length; i++) {
    const [distSq, a, b] = pairs[i];
    if (uf.union(a, b)) {
      merges++;
    }
  }
  console.log(`Processed ${connectCount} connections, ${merges} actual merges`);

  // Count circuit sizes
  const sizes = new Map();
  for (let i = 0; i < n; i++) {
    const root = uf.find(i);
    sizes.set(root, (sizes.get(root) || 0) + 1);
  }

  // Get top 3 circuit sizes
  const sortedSizes = [...sizes.values()].sort((a, b) => b - a);
  console.log(`Circuit count: ${sortedSizes.length}`);
  console.log(`Top 5 sizes: ${sortedSizes.slice(0, 5).join(', ')}`);

  const top3 = sortedSizes.slice(0, 3);
  const result = top3.reduce((a, b) => a * b, 1);
  console.log(`Top 3: ${top3.join(' × ')} = ${result}`);

  return result;
}

// Part 2
function part2(lines) {
  const points = parsePoints(lines);
  const n = points.length;

  const pairs = getAllPairs(points);
  pairs.sort((a, b) => a[0] - b[0]);

  const uf = createUnionFind(n);
  const targetMerges = n - 1; // need N-1 edges to connect N nodes
  let merges = 0;
  let lastA, lastB;

  for (let i = 0; i < pairs.length && merges < targetMerges; i++) {
    const [distSq, a, b] = pairs[i];
    if (uf.union(a, b)) {
      merges++;
      lastA = a;
      lastB = b;
    }
  }

  const xA = points[lastA][0];
  const xB = points[lastB][0];
  console.log(`Last merge: points ${lastA} and ${lastB}`);
  console.log(`X coords: ${xA} × ${xB} = ${xA * xB}`);

  return xA * xB;
}

console.log(`Day 8 (${inputFile})`);
console.log('Part 1:', part1(lines));
console.log('Part 2:', part2(lines));
