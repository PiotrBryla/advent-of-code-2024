import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE_NAME = "input.txt";
const NEW_LINE_SYMBOL = "\n";

type GRID = string[][];
type Node = [number, number];
type Region = Node[];

const getInputLines = (file: string) => {
  const text = fs.readFileSync(path.resolve(__dirname, file)).toString();
  const lines = text.split(NEW_LINE_SYMBOL);
  return lines.map((l) => l.split(""));
};

const isValidPath = (pathChar: string, node: Node, grid: GRID) => {
  const [y, x] = node;
  const isInBounds = y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;

  if (!isInBounds) return false;

  const curChar = grid[y][x];
  return curChar === pathChar;
};

const bfs = (startingNode: Node, visited: Set<string>, grid: GRID) => {
  const [y, x] = startingNode;
  const char = grid[y][x];
  const queue: Node[] = [startingNode];
  const result: Node[] = [];
  let perimeter = 0;

  while (queue.length) {
    const [y, x] = queue.shift() as Node;

    if (!visited.has(getKey(y, x))) {
      visited.add(getKey(y, x));
      result.push([y, x]);

      const up: Node = [y - 1, x];
      const down: Node = [y + 1, x];
      const right: Node = [y, x + 1];
      const left: Node = [y, x - 1];

      const validNodes = [up, left, right, down].filter((node) =>
        isValidPath(char, node, grid)
      );
      perimeter += 4 - validNodes.length;

      queue.push(...validNodes);
    }
  }

  return perimeter * result.length;
};

const getKey = (y: number, x: number) => `${y},${x}`;

const getRegionsPrices = (grid: GRID) => {
  const visited = new Set<string>();
  const regionsMap: number[] = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const resultForNode = bfs([y, x], visited, grid);
      if (resultForNode) regionsMap.push(resultForNode);
    }
  }

  return regionsMap;
};

const getPerimeter = (region: Region) => {
  let minY = region[0][0];
  let minX = region[0][1];
  let maxY = region[0][0];
  let maxX = region[0][1];

  region.forEach(([y, x]) => {
    minY = Math.min(minY, y);
    minX = Math.min(minX, x);
    maxY = Math.max(maxY, y);
    maxX = Math.max(maxX, x);
  });

  const peremiter = (1 + (maxX - minX)) * 2 + (1 + (maxY - minY)) * 2;
  return peremiter;
};

const getRegionPrice = (region: Region) => {
  const area = region.length;
  const perimeter = getPerimeter(region);

  console.log(region, area, perimeter);
  return area * perimeter;
};
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const compute = () => {
  const input = getInputLines(INPUT_FILE_NAME);
  const regions = getRegionsPrices(input);
  const result = sum(regions);
  console.log(result);
};

console.log(compute());
// Example = 140
