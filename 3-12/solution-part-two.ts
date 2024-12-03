import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE_NAME = "input.txt";

const getInput = (file: string) => {
  return fs.readFileSync(path.resolve(__dirname, file)).toString();
};

const getDoInstructions = (text: string) => {
  let result = "";
  const [firstInstructions, ...rest] = text.split("don't()");
  result += firstInstructions;

  // Get first and append to result
  // Split by don't() –
  // for each segment between don't():
  rest.forEach((segment) => {
    //  – split by do(),
    // remove first
    const [_, ...validInstructions] = segment.split("do()");
    // append rest to the result
    result += validInstructions;
  });

  return result;
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
  const rawDoInstructions = getDoInstructions(input);
  const instructions = findValidInstructions(rawDoInstructions);
  const instructionResults = getInstructionsResults(instructions);

  return sum(instructionResults);
};

// 75862013 – too low
// 80698289 – too low
// 84893551 – answer
console.log(compute());
