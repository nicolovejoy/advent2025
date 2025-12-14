import sys
from collections import deque

def main():
    input_file = 'sample.txt' if len(sys.argv) > 1 and sys.argv[1] == 'sample' else 'input.txt'

    with open(input_file) as f:
        lines = f.read().strip().split('\n')

    # ==========================================================================
    # Step 1: Parse input
    # ==========================================================================
    # Each line is "x,y" - coordinates of a red tile
    # The red tiles form vertices of a closed polygon (last connects to first)
    red_tiles = []
    for line in lines:
        x, y = map(int, line.split(','))
        red_tiles.append((x, y))

    print(f"Loaded {len(red_tiles)} red tiles")

    # ==========================================================================
    # Step 2: Coordinate compression
    # ==========================================================================
    # Problem: Original coordinates can be huge (e.g., 85000 x 85000)
    # Solution: Only the unique X and Y values matter for our polygon
    #
    # Example: If red tiles have X values [2, 7, 9, 11], we map:
    #   2 -> 0, 7 -> 1, 9 -> 2, 11 -> 3
    # Now we work in a 4-wide grid instead of an 11-wide grid

    unique_x = sorted(set(x for x, y in red_tiles))
    unique_y = sorted(set(y for x, y in red_tiles))

    # Maps: original coordinate -> compressed index
    x_to_compressed = {x: i for i, x in enumerate(unique_x)}
    y_to_compressed = {y: i for i, y in enumerate(unique_y)}

    # Maps: compressed index -> original coordinate (just use the list directly)
    compressed_to_x = unique_x
    compressed_to_y = unique_y

    grid_width = len(unique_x)
    grid_height = len(unique_y)

    print(f"Compressed grid: {grid_width} x {grid_height}")

    # ==========================================================================
    # Step 3: Build polygon boundary on compressed grid
    # ==========================================================================
    # The polygon edges connect consecutive red tiles
    # Each edge is axis-aligned (same X or same Y) per puzzle rules
    # We mark all cells along each edge as "boundary"

    is_boundary = set()  # Set of (cx, cy) compressed coordinates

    for i in range(len(red_tiles)):
        # Get current tile and next tile (wrapping to first at the end)
        x1, y1 = red_tiles[i]
        x2, y2 = red_tiles[(i + 1) % len(red_tiles)]

        # Convert to compressed coordinates
        cx1, cy1 = x_to_compressed[x1], y_to_compressed[y1]
        cx2, cy2 = x_to_compressed[x2], y_to_compressed[y2]

        # Mark all cells along this edge
        if cy1 == cy2:
            # Horizontal edge: same Y, varying X
            for cx in range(min(cx1, cx2), max(cx1, cx2) + 1):
                is_boundary.add((cx, cy1))
        else:
            # Vertical edge: same X, varying Y
            for cy in range(min(cy1, cy2), max(cy1, cy2) + 1):
                is_boundary.add((cx1, cy))

    print(f"Boundary cells: {len(is_boundary)}")

    # ==========================================================================
    # Step 4: Flood fill from outside to find all "outside" cells
    # ==========================================================================
    # Goal: Identify which compressed cells are OUTSIDE the polygon
    #
    # Problem: The polygon might touch the edge of our compressed grid,
    # leaving no obvious "outside" starting point
    #
    # Solution: Add a 1-cell border (padding) around the entire grid
    #   - Original grid: (0, 0) to (width-1, height-1)
    #   - Padded grid: (0, 0) to (width+1, height+1)
    #   - Shift all boundary cells by +1 in both dimensions
    #   - Now (0, 0) is guaranteed to be outside the polygon
    #
    # Visual example (4x4 grid -> 6x6 padded):
    #
    #   Original:          Padded (boundary shifted +1):
    #   . # # .            . . . . . .
    #   . # # .     ->     . . # # . .
    #   . . . .            . . # # . .
    #   . . . .            . . . . . .
    #                      . . . . . .
    #                      . . . . . .
    #
    #   BFS from (0,0) fills the entire border and any outside regions

    padded_width = grid_width + 2
    padded_height = grid_height + 2

    # Shift boundary cells into padded coordinate space
    padded_boundary = set((cx + 1, cy + 1) for cx, cy in is_boundary)

    # BFS flood fill starting from (0, 0) - guaranteed outside
    is_outside_padded = set()
    queue = deque([(0, 0)])
    is_outside_padded.add((0, 0))

    while queue:
        px, py = queue.popleft()
        # Try all 4 neighbors (up, down, left, right)
        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nx, ny = px + dx, py + dy
            # Check bounds
            if 0 <= nx < padded_width and 0 <= ny < padded_height:
                # If not already visited AND not a boundary cell, it's reachable from outside
                if (nx, ny) not in is_outside_padded and (nx, ny) not in padded_boundary:
                    is_outside_padded.add((nx, ny))
                    queue.append((nx, ny))

    # Convert back from padded coordinates to original compressed coordinates
    # Only keep cells that fall within the original grid bounds
    is_outside = set()
    for px, py in is_outside_padded:
        cx, cy = px - 1, py - 1  # Undo the +1 shift
        if 0 <= cx < grid_width and 0 <= cy < grid_height:
            is_outside.add((cx, cy))

    print(f"Outside cells: {len(is_outside)}")
    print(f"Inside cells: {grid_width * grid_height - len(is_outside)}")

    # ==========================================================================
    # Step 5: Build 2D prefix sum for fast rectangle queries
    # ==========================================================================
    # Goal: Quickly answer "how many outside cells are in rectangle (x1,y1)-(x2,y2)?"
    #
    # Prefix sum: prefix[y][x] = count of outside cells in rectangle (0,0) to (x-1,y-1)
    # We use 1-based indexing to simplify boundary handling
    #
    # To query rectangle (x1,y1) to (x2,y2) inclusive:
    #   count = prefix[y2+1][x2+1] - prefix[y1][x2+1] - prefix[y2+1][x1] + prefix[y1][x1]
    #
    # Visual (inclusion-exclusion principle):
    #   +---+---+
    #   | A | B |   We want D
    #   +---+---+   prefix[y2+1][x2+1] = A + B + C + D
    #   | C | D |   Subtract prefix[y1][x2+1] = A + B
    #   +---+---+   Subtract prefix[y2+1][x1] = A + C
    #               Add back prefix[y1][x1] = A (was subtracted twice)

    prefix = [[0] * (grid_width + 1) for _ in range(grid_height + 1)]

    for cy in range(grid_height):
        for cx in range(grid_width):
            is_out = 1 if (cx, cy) in is_outside else 0
            # Build prefix sum using recurrence relation
            prefix[cy + 1][cx + 1] = (is_out
                                      + prefix[cy][cx + 1]      # cell above
                                      + prefix[cy + 1][cx]      # cell to left
                                      - prefix[cy][cx])         # subtract double-counted corner

    def count_outside_in_rect(cx1, cy1, cx2, cy2):
        """Count outside cells in rectangle (cx1,cy1) to (cx2,cy2) inclusive."""
        return (prefix[cy2 + 1][cx2 + 1]
                - prefix[cy1][cx2 + 1]
                - prefix[cy2 + 1][cx1]
                + prefix[cy1][cx1])

    # ==========================================================================
    # Step 6: Check all pairs of red tiles
    # ==========================================================================
    # For each pair of red tiles:
    #   1. Map to compressed coordinates
    #   2. Use prefix sum to check if rectangle contains any outside cells
    #   3. If valid (no outside cells), compute area using ORIGINAL coordinates
    #
    # Note: Area must use original coordinates because compressed coordinates
    # don't preserve distances. Tiles at compressed (0,1) might be 1000 apart
    # in original space.

    max_valid_area = 0
    best_pair = None

    for i in range(len(red_tiles)):
        for j in range(i + 1, len(red_tiles)):
            x1, y1 = red_tiles[i]
            x2, y2 = red_tiles[j]

            # Map to compressed coordinates
            cx1 = x_to_compressed[x1]
            cy1 = y_to_compressed[y1]
            cx2 = x_to_compressed[x2]
            cy2 = y_to_compressed[y2]

            # Normalize so cx1 <= cx2, cy1 <= cy2 (prefix sum needs ordered coords)
            if cx1 > cx2:
                cx1, cx2 = cx2, cx1
            if cy1 > cy2:
                cy1, cy2 = cy2, cy1

            # Check if rectangle is fully inside (no outside cells)
            outside_count = count_outside_in_rect(cx1, cy1, cx2, cy2)

            if outside_count == 0:
                # Valid rectangle - compute area in ORIGINAL coordinates
                orig_x1, orig_x2 = compressed_to_x[cx1], compressed_to_x[cx2]
                orig_y1, orig_y2 = compressed_to_y[cy1], compressed_to_y[cy2]
                # Area formula: (width + 1) * (height + 1) for inclusive tile count
                area = (abs(orig_x2 - orig_x1) + 1) * (abs(orig_y2 - orig_y1) + 1)

                if area > max_valid_area:
                    max_valid_area = area
                    best_pair = ((x1, y1), (x2, y2))

    print(f"Best valid rectangle: {best_pair}")
    print(f"Part 2: {max_valid_area}")

if __name__ == '__main__':
    main()
