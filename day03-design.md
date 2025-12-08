# Day 3: Battery Banks - Design Notes

## Problem
Find the maximum two-digit number formable from each line (picking two digits in order), sum all maxes.

## Algorithm Choice

We considered three approaches:

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute force (all pairs) | O(N²) | O(1) | Doesn't scale |
| Suffix array | O(N) | O(N) | Two passes, stores array |
| **Reverse single-pass** | O(N) | O(1) | ✓ Chosen |

## Why Reverse Single-Pass?

The tens digit is worth 10× the ones digit, so we want the largest possible tens digit paired with the largest ones digit to its right.

By scanning right-to-left, we always know the maximum digit we've seen so far (which would be to the right of any earlier position). For each position, we compute `digit × 10 + maxToRight` and track the best.

**Result:** O(N) time, O(1) space per line - optimal for large inputs.

## Key Insight

Precomputing "max to the right" eliminates the need for nested loops. The reverse pass naturally accumulates this information.
