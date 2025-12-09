# Day 7: Laboratories (Tachyon Manifold)

Beam enters at `S`, moves down, splits left/right at `^`.

**Part 1:** Count splitter hits. **Part 2:** Count timelines (many-worlds).

## Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Row-by-row + Set | O(rows×width) | O(width) | Part 1 — dedupes beams |
| Row-by-row + Map | O(rows×width) | O(width) | Part 2 — tracks counts |
| Graph of splitters | O(S²) | O(S) | Overkill here |

## Why Row-by-Row
Unidirectional movement → single pass, no graph needed.

## Key Insights
- Set → Map: existence → cardinality
- BigInt needed (~6T timelines)
