# Advent of Code 2025 - Key Learnings

## Day 3: Lobby

**Problem:** Given lines of digits (1-9), form the largest possible N-digit number by picking N digits in order.

### Part 1 (N=2)
Pick two digits to form the max two-digit number.

**Approach:** Reverse single-pass, O(N) time, O(1) space.
- Scan right-to-left tracking `maxRight` (best ones digit seen)
- At each position, candidate = `digit * 10 + maxRight`
- Only compute when `maxRight > 0` (need a digit to the right)

### Part 2 (N=12)
Pick twelve digits to form the max 12-digit number.

**Approach:** Greedy selection, O(N*K) time where K=12.
- For each of the 12 positions, greedily pick the largest available digit
- Constraint: must leave enough digits to the right to complete the selection
- For position `i`, can pick from `[start, len - (12 - i)]`

**Key Insight:** When maximizing a number formed by ordered digit selection, prioritize leftmost digits (they have highest place value). The greedy approach works because picking a larger digit earlier always beats any combination with a smaller digit there.
