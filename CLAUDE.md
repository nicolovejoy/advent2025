# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Advent of Code 2025 solutions repository using JavaScript with Node.js.

## Commands

- Run a day's solution: `npm run dayNN` (e.g., `npm run day03`)

## Structure

- `dayNN/` - Each day's solution, input, and puzzle description
  - `solution.js` - Part 1 solution
  - `solution2.js` - Part 2 solution (separate script)
  - `sample.txt` and `input.txt` - Shared between parts
- `LEARNINGS.md` - Key algorithmic insights from all days

## Solution Design Process

When implementing a new puzzle solution:

1. Ask the user design questions to understand their preferred approach
2. **Efficiency is paramount** - Solutions must scale well; always prefer O(N) over O(N²), O(1) space over O(N) when practical
3. Let the user drive algorithm/data structure choices through Q&A before coding
4. Document key learnings in LEARNINGS.md - be incrementally more verbose and thorough each day
5. output from code should be reasonably verbose to assist in debugging and understanding. but no more than 30 lines of output, ideally. so be frugal.
