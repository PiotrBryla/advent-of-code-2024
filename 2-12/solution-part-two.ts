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

const prepareInput = (lines: string[]) => {
  return lines.map((line) => line.split(" ").map(Number));
};

const lines = prepareInput(getInputLines(INPUT_FILE_NAME));

const isLineInOrder = (line: number[]) => {
  const orderDirection = Boolean(line[0] - line[1] < 0);

  for (let i = 0; i < line.length - 1; i++) {
    if (Boolean(line[i] - line[i + 1] < 0) !== orderDirection) {
      return false;
    }
  }
  return true;
};

const isSafeDistance = (
  line: number[],
  minDistance: number,
  maxDistance: number
) => {
  for (let i = 0; i < line.length - 1; i++) {
    const a = line[i];
    const b = line[i + 1];
    const distance = Math.abs(a - b);
    const isSafeDistance = distance <= maxDistance && distance >= minDistance;

    if (!isSafeDistance) return false;
  }
  return true;
};

const compute = (lines: number[][]) => {
  let safe = 0;

  lines.forEach((line, ix) => {
    const allCombinations: number[][] = [];

    line.forEach((_, ix) => {
      const arr = [...line];
      arr.splice(ix, 1);
      allCombinations.push(arr);
    });

    const combinationResults = [];

    // check if there is a combination for the line that meets all the rules
    allCombinations.forEach((line) => {
      const inOrder = isLineInOrder(line);
      const inSafeDistance = isSafeDistance(line, 1, 3);

      if (inOrder && inSafeDistance) combinationResults.push(true);
    });

    if (combinationResults.length) safe++;
  });

  return safe;
};

console.log(compute(lines));
// answer is 293
