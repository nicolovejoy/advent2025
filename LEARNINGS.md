# Advent of Code 2025 - Key Learnings

## Day 3: Lobby

Pick N digits in order to form max number.

**Part 1 (N=2):** Reverse scan, track best ones digit. O(N), O(1).

**Part 2 (N=12):** Greedy — pick largest digit that leaves room for remaining picks.

**Insight:** Leftmost digits dominate; greedy works.

## Day 4: Printing Department

Grid of rolls (`@`). Accessible if <4 neighbors (8-directional).

**Part 1:** Count accessible. O(rows × cols) scan.

**Part 2:** Remove accessible repeatedly until none remain. Full rescan each round — simple, fast enough.

**Insight:** Peeling effect from edges inward. Terminates when all remaining rolls have 4+ neighbors.

## Day 5: Cafeteria

Given ID ranges and a list of IDs, count matches.

**Part 1:** Merge overlapping ranges, sort IDs, two-pointer sweep. O((R+I) log(R+I)).

**Part 2:** Count all unique IDs in ranges. Sum merged interval sizes — never enumerate.

**Insight:** Interval merging handles astronomical ranges (350T+ IDs) via arithmetic, not enumeration.

## Day 6: Trash Compactor

Parse vertically-stacked math problems with operator at bottom.

**Part 1:** Split on whitespace, group tokens by position. Standard row-wise reading.

**Part 2:** Column-wise reading — each character column is a digit (top=MSD). Parse as 2D character grid to preserve alignment.

**Insight:** When alignment matters, use character grid instead of whitespace splitting. Splitting loses positional information.

## Day 7: Laboratories (Tachyon Manifold)

Beam moves down from `S`, splits left/right at `^` splitters.

**Part 1:** Count splitter hits. Row-by-row with `Set<column>`. Set dedupes merged beams.

**Part 2:** Count timelines (many-worlds). Row-by-row with `Map<column, count>`. N timelines hitting splitter → N left + N right. Used BigInt (~6T timelines).

**Insight:** Set → Map is classic Part 1 → Part 2 pattern. Existence vs cardinality — same algorithm, different data structure. Unidirectional movement means sweep beats graph traversal.

## Day 8: Playground (Junction Boxes)

Connect 3D points by shortest distances, track circuit formation.

**Part 1:** Connect 1000 closest pairs, return product of 3 largest circuit sizes.

**Part 2:** Connect until one circuit, return product of X coords of last pair merged.

**Approach:** Brute force all N×(N-1)/2 pairs (499,500 for N=1000), sort by distance, Union-Find to track circuits.

**Key techniques:**

1. **Squared distance** — skip sqrt, ordering preserved. Faster comparison.

2. **Union-Find with path compression** — canonical data structure for dynamic connectivity. Each node tracks its parent; find() walks to root. Path compression: when finding root, update every node along the path to point directly to root. Transforms O(N) chains into O(1) lookups. Amortized O(α(N)) per operation where α is inverse Ackermann (effectively constant).

3. **Min-heap alternative** — could track only K smallest pairs as we iterate, saving O(N²) → O(K) space. Same time complexity. For this problem size, full sort is simpler and fast enough.

4. **Tree connectivity** — N nodes require exactly N-1 edges to form connected tree. Part 2 stopping condition: count successful merges until reaching N-1.

**Insight:** Part 1 vs Part 2 used identical algorithm with different stopping conditions — fixed count (1000 operations) vs invariant (single circuit). Union-Find is the go-to for "are these connected?" and "merge these groups" operations. When N is small enough (here ~500K pairs), brute force + sort beats clever spatial data structures in simplicity and often in raw speed.

## Day 9: Movie Theater (Rectilinear Polygon)

Given red tile coordinates forming vertices of a closed rectilinear polygon. Find largest rectangle with red tiles at opposite corners.

**Part 1:** Brute force all pairs, compute area. O(N²).

**Part 2:** Rectangle must lie entirely inside the polygon (red + green tiles only). Green tiles = edges between consecutive vertices + polygon interior.

**Approach:** Coordinate compression + flood fill + 2D prefix sums.

1. **Coordinate compression** — With N=496 vertices, only 247 unique X and 248 unique Y values. Work in compressed ~250×250 grid instead of 85K×85K original space.

2. **Polygon boundary** — Mark all cells along edges between consecutive vertices (they share X or Y, so edges are axis-aligned).

3. **Flood fill with padding** — Add 1-cell border around compressed grid, shift boundary by +1. Now (0,0) is guaranteed outside. BFS from there finds all outside cells.

4. **2D prefix sums** — Precompute cumulative "outside cell" counts. Query any rectangle for outside cells in O(1) using inclusion-exclusion.

5. **Validate pairs** — For each red tile pair, check if their rectangle contains any outside cells. If not, compute area using original (uncompressed) coordinates.

**Failed simplification:** Tried checking if any vertex lies strictly inside the candidate rectangle. Doesn't work — concave polygons can have "bites" (outside regions) that contain no vertices.

**Key techniques:**

1. **Coordinate compression** — When only relative positions matter, map sparse coordinates to dense indices. Reduces 85K² space to 250².

2. **Flood fill from outside** — Padding trick ensures a known-outside starting point. Everything reachable from border without crossing boundary is outside; rest is inside.

3. **2D prefix sums** — Classic technique for O(1) rectangle queries. Build in O(N²), query with inclusion-exclusion: `prefix[y2][x2] - prefix[y1][x2] - prefix[y2][x1] + prefix[y1][x1]`.

**Insight:** For rectilinear polygons, coordinate compression is powerful because the polygon's structure only changes at vertex coordinates. Flood fill correctly handles arbitrary concave shapes where simpler vertex-checking heuristics fail.
