import sys

def main():
    input_file = 'sample.txt' if len(sys.argv) > 1 and sys.argv[1] == 'sample' else 'input.txt'

    with open(input_file) as f:
        lines = f.read().strip().split('\n')

    # Parse red tiles
    red_tiles = []
    for line in lines:
        x, y = map(int, line.split(','))
        red_tiles.append((x, y))

    print(f"Loaded {len(red_tiles)} red tiles")

    def has_vertex_strictly_inside(x1, y1, x2, y2, tiles):
        """Check if any tile is strictly inside the rectangle (not on boundary)."""
        min_x, max_x = min(x1, x2), max(x1, x2)
        min_y, max_y = min(y1, y2), max(y1, y2)

        for tx, ty in tiles:
            # Strictly inside means: min < t < max (not equal)
            if min_x < tx < max_x and min_y < ty < max_y:
                return True
        return False

    # Check all pairs
    max_valid_area = 0
    best_pair = None

    for i in range(len(red_tiles)):
        for j in range(i + 1, len(red_tiles)):
            x1, y1 = red_tiles[i]
            x2, y2 = red_tiles[j]

            # Skip if no vertex is strictly inside
            if not has_vertex_strictly_inside(x1, y1, x2, y2, red_tiles):
                area = (abs(x2 - x1) + 1) * (abs(y2 - y1) + 1)
                if area > max_valid_area:
                    max_valid_area = area
                    best_pair = ((x1, y1), (x2, y2))

    print(f"Best valid rectangle: {best_pair}")
    print(f"Part 2: {max_valid_area}")

if __name__ == '__main__':
    main()
