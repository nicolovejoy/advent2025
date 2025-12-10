# Day 8: Playground - Design Notes

## Problem Summary

3D junction boxes need to be connected by string lights. Connect closest pairs first, tracking circuit formation.

**Part 1:** Connect the 1000 closest pairs. Return product of three largest circuit sizes.

**Part 2:** Keep connecting until all points form one circuit. Return product of X coordinates of the last two points connected.

## Approach: Brute Force + Union-Find

### Distance Calculation
- N=1000 points → N×(N-1)/2 = 499,500 pairs
- Compute all pairs, sort by distance
- Use squared distance (skip sqrt — ordering preserved)

### Union-Find with Path Compression
Each point starts as its own circuit. When merging:
1. Find root of each point
2. Make one root point to the other
3. **Path compression:** When finding root, update every node along the path to point directly to root

```
Before:  5 → 3 → 7 → 2 → 1 (root)
After:   5 → 1, 3 → 1, 7 → 1, 2 → 1
```

This makes subsequent lookups O(1). Amortized cost per operation: O(α(n)) ≈ O(1).

## Alternatives Considered

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Brute force all pairs + sort** | O(N² log N) | O(N²) | Simple, fast enough for N=1000 |
| K-d tree nearest neighbor | O(N log N) avg | O(N) | Overkill for this size |
| Min-heap for top K pairs | O(N² log K) | O(K) | Saves space, same time |

Brute force wins for simplicity. 500K pairs sorts in milliseconds.

## Key Insights

1. **Squared distance preserves ordering** — avoid sqrt overhead
2. **Union-Find is the canonical data structure** for dynamic connectivity
3. **Path compression** transforms O(N) lookups into O(1) amortized
4. **N nodes need N-1 edges** to form a connected tree (Part 2 stopping condition)
5. **Part 1 vs Part 2 pattern:** Same algorithm, different stopping condition
   - Part 1: Fixed number of operations (1000)
   - Part 2: Until invariant achieved (1 circuit)

## Complexity

- Time: O(N² log N) for pair generation and sorting
- Space: O(N²) for storing all pairs
- Union-Find operations: O(α(N)) ≈ O(1) each
