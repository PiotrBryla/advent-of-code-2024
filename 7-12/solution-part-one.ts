import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NEW_LINE_SYMBOL = "\n";

const INPUT_FILE_NAME = "input.txt";

const getInputLines = (file: string) => {
  const text = fs.readFileSync(path.resolve(__dirname, file)).toString();
  const lines = text.split(NEW_LINE_SYMBOL);

  return lines;
};

// inspired by https://gist.github.com/p-a/aaf0ec598917c9afe7b31e9d7f865933
// recursively visit try all combinations
const isValid = (result: number, values: number[]) => {
  // @ts-ignore
  const helper = ([acc, next, ...rest]: number[]) =>
    next === undefined
      ? acc === result
      : helper([acc * next, ...rest]) || helper([acc + next, ...rest]);

  return helper(values);
};

const processLine = (line: string) => {
  const [resultString, components] = line.split(": ");
  if (!resultString || !components) return 0;

  const result = Number(resultString);
  const numbers = components.split(" ").map((val) => Number(val.trim()));

  return [result, numbers];
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const compute = () => {
  const lines = getInputLines(INPUT_FILE_NAME);
  const instructions = lines.map(processLine);

  const results = instructions
    // @ts-ignore
    .filter(([result, numbers]) => isValid(result, numbers))
    .map(([sum, ..._]) => sum);

  return sum(results);
};

console.log(compute());

// answer: 14711933466277
