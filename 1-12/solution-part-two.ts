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
  return lines.reduce(
    ({ left, right }: { left: string[]; right: string[] }, currentLine) => {
      const [l, r] = currentLine.split("   ");
      left.push(l);
      right.push(r);

      return { left, right };
    },
    { left: [], right: [] }
  );
};

const lines = getInputLines(INPUT_FILE_NAME);
const { left, right } = prepareInput(lines);

const compute = (left: string[], right: string[]) => {
  const leftData = left.map(Number);
  const rightData = right.map(Number);
  const multipliers = new Map<number, number>();

  const getMultipliers = (num: number, list: number[]) => {
    if (multipliers.has(num)) return multipliers.get(num);
    const multiplier = list.filter((item) => item === num).length;
    multipliers.set(num, multiplier);
  };

  leftData.forEach((item) => getMultipliers(item, rightData));

  const solution = leftData
    .map((leftItem) => leftItem * (multipliers.get(leftItem) || 0))
    .reduce((a, b) => a + b, 0);

  return solution;
};

console.log(compute(left, right));
