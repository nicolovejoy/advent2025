# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Advent of Code 2025 solutions repository using TypeScript with ts-node.

## Commands

- Run a day's solution: `npm run dayNN` (e.g., `npm run day03`)

## Structure

- `dayNN.ts` - Solution code for each day
- `dayNN-input.txt` - Puzzle input for each day
- `dayNN-puzzle.txt` - Puzzle descriptions
- `dayNN-design.md` - Design notes and algorithm analysis

## Solution Design Process

When implementing a new puzzle solution:

1. Ask the user design questions to understand their preferred approach
2. Solutions must be efficient and scale well for large datasets
3. Let the user drive algorithm/data structure choices through Q&A before coding
4. document the user's decisions in a succinct "how we did this" kind of document to share with my friends.
