import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE_NAME = "input.txt";

const getInputLines = (file: string) => {
  const text = fs.readFileSync(path.resolve(__dirname, file)).toString();

  return text.split(" ").map((s) => Number(s));
};

const blinkStones = (stones: number[]) => {
  const result: number[] = [];

  stones.forEach((stone) => {
    if (stone === 0) {
      result.push(1);
    } else if (String(stone).length % 2 === 0) {
      const half = Math.floor(String(stone).length / 2);
      const left = Number(String(stone).slice(0, half));
      const right = Number(String(stone).slice(half));

      result.push(left);
      result.push(right);
    } else {
      result.push(stone * 2024);
    }
  });

  return result;
};

const blinkTimes = (stones: number[], i: number) => {
  let initialStones = stones;

  for (let blinkCount = 0; blinkCount < i; blinkCount++) {
    initialStones = blinkStones(initialStones);
  }

  return initialStones;
};

const compute = () => {
  // get input
  const initialStones = getInputLines(INPUT_FILE_NAME);
  const result = blinkTimes(initialStones, 25);
  console.log(result, result.length);
};

console.log(compute());
// Answer:  189167
