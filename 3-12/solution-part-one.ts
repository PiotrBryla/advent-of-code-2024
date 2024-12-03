import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE_NAME = "input.txt";

const getInput = (file: string) => {
  return fs.readFileSync(path.resolve(__dirname, file)).toString();
};

const findValidInstructions = (text: string) => {
  const result = text.matchAll(/mul\(\d{1,3},\d{1,3}\)/g);
  return [...result].map((item) => item[0]);
};

const getInstructionsResults = (instructions: string[]) => {
  return instructions.map((item) => {
    const [a, b] = [...item.matchAll(/\d{1,3}/g)].map((match) =>
      Number(match[0])
    );
    return a * b;
  });
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const compute = () => {
  const input = getInput(INPUT_FILE_NAME);
  const instructions = findValidInstructions(input);
  const instructionResults = getInstructionsResults(instructions);

  return sum(instructionResults);
};

// The answer is 160672468
console.log(compute());
