import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NEW_LINE_SYMBOL = "\n";

const INPUT_FILE_NAME = "input.txt";

const getInputLines = (file: string) => {
  const text = fs.readFileSync(path.resolve(__dirname, file)).toString();
  return text.split(NEW_LINE_SYMBOL);
};

const checkIfInBounds = (grid: string[], node: [number, number]) => {
  const [y, x] = node;
  const yInBounds = y - 1 >= 0 && y + 1 < grid.length;
  const xInBounds = x - 1 >= 0 && x + 1 <= grid[0].length;
  return yInBounds && xInBounds;
};

const checkIfMas = (grid: string[], centerNode: [number, number]) => {
  const isInBounds = checkIfInBounds(grid, centerNode);

  if (!isInBounds) return false;

  const [y, x] = centerNode;
  const TL = [y - 1, x - 1];
  const TR = [y - 1, x + 1];
  const Center = centerNode;
  const BL = [y + 1, x - 1];
  const BR = [y + 1, x + 1];

  const leftToRight = [TL, Center, BR].map(([y, x]) => grid[y][x]).join("");
  const rightToLeft = [TR, Center, BL].map(([y, x]) => grid[y][x]).join("");

  const isLeftCorrect = leftToRight === "MAS" || leftToRight === "SAM";
  const isRightCorrect = rightToLeft === "MAS" || rightToLeft === "SAM";

  return isLeftCorrect && isRightCorrect;
};

const searchDiagonally = (lines: string[], sequence: string) => {
  let diagonalFindsCount = 0;

  const startingNodes = [];

  // find all starting nodes
  for (let x = 0; x < lines[0].length; x++) {
    for (let y = 0; y < lines.length; y++) {
      if (lines[x][y] === sequence[1]) {
        startingNodes.push([x, y]);
      }
    }
  }

  startingNodes.forEach((node) => {
    diagonalFindsCount += checkIfMas(lines, node as [number, number]) ? 1 : 0;
  });

  return diagonalFindsCount;
};

const compute = () => {
  const lines = getInputLines(INPUT_FILE_NAME);

  const result = searchDiagonally(lines, "MAS");

  return result;
};

// result: 1854
console.log(compute());
