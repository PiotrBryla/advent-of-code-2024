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
    if (distance > maxDistance || distance < minDistance) return false;
  }

  return true;
};

const compute = (lines: number[][]) => {
  let safe = 0;

  lines.forEach((line, ix) => {
    const inOrder = isLineInOrder(line);
    const inSafeDistance = isSafeDistance(line, 1, 3);

    if (inOrder && inSafeDistance) safe++;
  });

  return safe;
};

// The answer is 224
console.log(compute(lines));
