import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NEW_LINE_SYMBOL = "\n";

const INPUT_FILE_NAME = "input.txt";

const RULES_MAP = new Map();

const getInputLines = (file: string) => {
  const text = fs.readFileSync(path.resolve(__dirname, file)).toString();
  const lines = text.split(NEW_LINE_SYMBOL);

  const rules = lines.filter((line) => line.includes("|"));
  const allInstructions = lines.filter((line) => line.includes(","));

  return { rules, allInstructions };
};

const buildRulesMap = (rules: string[][]) => {
  rules.forEach(([X, Y]) => {
    if (RULES_MAP.has(X)) {
      RULES_MAP.set(X, [...RULES_MAP.get(X), Y]);
    } else {
      RULES_MAP.set(X, [Y]);
    }
  });
};

const checkUpdateLineAgainstRules = (line: string[]) => {
  let result = true;

  line.forEach((instruction, instructionIx) => {
    if (RULES_MAP.has(instruction)) {
      const instructionsAfter = [...RULES_MAP.get(instruction)];

      instructionsAfter.forEach((rule) => {
        const shouldBeAfterIx = line.findIndex((i) => i === rule);
        if (shouldBeAfterIx > -1 && instructionIx >= shouldBeAfterIx) {
          result = false;
        }
      });
    }
  });

  return result;
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const compute = () => {
  const { allInstructions, rules } = getInputLines(INPUT_FILE_NAME);
  const parsedRules = rules.map((rule) => rule.split("|"));
  const parsedAllInstructions = allInstructions.map((ins) => ins.split(","));

  buildRulesMap(parsedRules);

  const correctResults = parsedAllInstructions.filter((ins) => {
    return checkUpdateLineAgainstRules(ins);
  });

  const middles = correctResults.map((arr) => {
    const mid = Math.ceil((arr.length - 1) / 2);
    return Number(arr[mid]);
  });

  return sum(middles);
};

console.log(compute());
// answer:
