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

## Day 4: Printing Department

**Problem:** Grid of paper rolls (`@`). A roll is accessible by forklift if it has fewer than 4 adjacent rolls (8-directional neighbors).

### Part 1
Count accessible rolls.

**Approach:** O(rows × cols) scan, O(1) extra space.
- Parse into 2D array for clean `[row][col]` access
- For each roll, count neighbors in 8 directions
- Bounds checking: out-of-bounds treated as empty floor
- Structure returns coordinates (not just count) to support Part 2 simulation

### Part 2
Simulate removing accessible rolls until none remain. Count total removed.

**Approach:** Iterative simulation, O(R × rows × cols) where R = number of rounds.
- Copy grid (now need mutability)
- Each round: find all accessible → remove them → repeat until none
- Sum removals across all rounds

**Design choice:** Full grid rescan vs. incremental (only recheck neighbors of removed). Chose full rescan — simpler code, fast enough for 140×140 grid.

**Key Insight:** Removing rolls creates a "peeling" effect from the edges inward. Rolls with 4+ neighbors become accessible once their neighbors are removed. The process terminates when only tightly-packed cores remain (every remaining roll has 4+ neighbors).
