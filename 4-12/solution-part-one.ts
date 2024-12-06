import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NEW_LINE_SYMBOL = "\n";

const INPUT_FILE_NAME = "input.txt";
const XMAS_PATTERN = /XMAS/g;
const SMAX_PATTERN = /SAMX/g;

const getInputLines = (file: string) => {
  const text = fs.readFileSync(path.resolve(__dirname, file)).toString();
  return text.split(NEW_LINE_SYMBOL);
};

const getVerticalLines = (lines: string[]) => {
  const verticalLines = [];
  for (let x = 0; x < lines.length; x++) {
    for (let y = 0; y < lines[x].length; y++) {
      if (!verticalLines[y]) {
        verticalLines[y] = "";
      }

      verticalLines[y] += lines[x][y];
    }
  }

  return verticalLines;
};

const bfs = (
  graph: string[],
  staringNode: [number, number],
  path: string,
  dir: "L" | "R"
) => {
  const queue = [staringNode];
  let result = "";

  while (queue.length && result !== path) {
    const node = queue.shift();
    const [y, x] = node as [number, number];
    const letter = path[result.length];

    if (graph[y][x] === letter) {
      result += letter;
      if (result === path) return true;

      const nextNode: [number, number] =
        dir === "L" ? [y + 1, x - 1] : [y + 1, x + 1];

      const [nY, nX] = nextNode;
      // check if is in bound
      if (nX >= 0 && nX < graph[0].length && nY >= 0 && nY < graph.length) {
        queue.push(nextNode);
      }
    } else {
      break;
    }
  }

  return result === path;
};

const searchDiagonally = (lines: string[], sequence: string) => {
  let diagonalFindsCount = 0;

  const startingNodes = [];

  // find all starting nodes
  for (let x = 0; x < lines[0].length; x++) {
    for (let y = 0; y < lines.length; y++) {
      if (lines[x][y] === sequence[0]) {
        startingNodes.push([x, y]);
      }
    }
  }

  // for all starting nodes
  startingNodes.forEach((node) => {
    // left to right down
    // right to left down

    const L = bfs(lines, node as [number, number], sequence, "L") ? 1 : 0;
    const R = bfs(lines, node as [number, number], sequence, "R") ? 1 : 0;

    diagonalFindsCount += L + R;
  });

  return diagonalFindsCount;
};

const countMatchingPattern = (lines: string[], pattern: RegExp) => {
  let result = 0;

  lines.forEach((line) => {
    result += [...line.matchAll(pattern)]?.length || 0;
  });

  return result;
};

const prepareInput = (lines: string[]) => {
  const horizontal = lines;
  const vertical = getVerticalLines(lines);

  return {
    horizontal,
    vertical,
  };
};

const compute = () => {
  const { horizontal, vertical } = prepareInput(getInputLines(INPUT_FILE_NAME));

  const result =
    countMatchingPattern(horizontal, XMAS_PATTERN) +
    countMatchingPattern(horizontal, SMAX_PATTERN) +
    countMatchingPattern(vertical, XMAS_PATTERN) +
    countMatchingPattern(vertical, SMAX_PATTERN) +
    searchDiagonally(horizontal, "XMAS") +
    searchDiagonally(horizontal, "SAMX");

  return result;
};

console.log(compute());
// answer: 2557