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
