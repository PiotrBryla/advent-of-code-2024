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

const blinkStones = (stones: number[], runs: number) => {
  const getN = (n: number) => cache.get(n) || 0;

  let cache = new Map();

  stones.forEach((stone) => {
    cache.set(stone, 1);
  });

  let currentStones = [...cache.entries()];

  // crate new results for each run
  for (let run = 0; run < runs; run++) {
    cache = new Map();

    currentStones.forEach(([key, times]) => {
      const stone = key;

      if (stone === 0) {
        cache.set(1, getN(1) + times);
      } else if (String(stone).length % 2 === 0) {
        const half = Math.floor(String(stone).length / 2);

        const left = Number(String(stone).slice(0, half));
        const right = Number(String(stone).slice(half));

        cache.set(left, getN(left) + times);
        cache.set(right, getN(right) + times);
      } else {
        const stoneKey = stone * 2024;
        cache.set(stoneKey, getN(stoneKey) + times);
      }
    });

    currentStones = [...cache.entries()];
  }

  return sum([...cache.values()]);
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const compute = () => {
  // get input
  const initialStones = getInputLines(INPUT_FILE_NAME);
  const result = blinkStones(initialStones, 75);
  console.log(result);
};

console.log(compute());
// Answer:  225253278506288
