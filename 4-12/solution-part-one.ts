import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NEW_LINE_SYMBOL = "\n";

const INPUT_FILE_NAME = "input.txt";
const PATTERN = "(XMAS|SAMX)";

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

const getDiagonalLines = (lines: string[]) => {
  const diagonalLines = [];

  for (let startingX = 0; startingX < lines[0].length; startingX++) {
    let diagonalLine = "";
    for (
      let x = startingX, y = 0;
      x < lines[0].length && y < lines.length;
      x++, y++
    ) {
      diagonalLine += lines[y][x];
    }

    diagonalLines.push(diagonalLine);
  }
  return diagonalLines;
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
  const diagonal = getDiagonalLines(lines);

  return {
    horizontal,
    vertical,
    diagonal,
  };
};

const compute = () => {
  const { horizontal, vertical, diagonal } = prepareInput(
    getInputLines(INPUT_FILE_NAME)
  );

  const result =
    countMatchingPattern(horizontal, PATTERN) +
    countMatchingPattern(vertical, PATTERN) +
    countMatchingPattern(diagonal, PATTERN);

  return result;
};

console.log(compute());
