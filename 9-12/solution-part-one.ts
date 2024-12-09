import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE_NAME = "input.txt";

const getInputLines = (file: string) => {
  const text = fs.readFileSync(path.resolve(__dirname, file)).toString();
  return text;
};

const getFilesWithFreeSpaces = (input: string) => {
  const inputWithSpaces = [];

  for (let i = 0, fileIx = 0; i < input.length; i += 2, fileIx++) {
    // [fileId, fileLength, spaceLength]
    inputWithSpaces.push([
      fileIx,
      Number(input[i]),
      Number(input[i + 1] || "0"),
    ]);
  }

  return inputWithSpaces;
};

const createDefragmentedString = (discmap: number[][]) => {
  let defragmentedDisc: (string | number)[] = [];

  discmap.forEach(([fileId, fileLength, spaceLength]) => {
    for (let i = 0; i < fileLength; i++) {
      defragmentedDisc.push(String(fileId));
    }

    for (let i = 0; i < spaceLength; i++) {
      defragmentedDisc.push(".");
    }
  });

  return defragmentedDisc;
};

const discFragmentation = (defragmentedString: (string | number)[]) => {
  let result = [...defragmentedString];
  let l = 0;
  let r = defragmentedString.length - 1;

  while (l < r) {
    if (result[l] === ".") {
      // get r
      while (result[r] === ".") {
        r--;
      }

      result[l] = result[r];
      result[r] = ".";
    }

    l++;
  }

  return result;
};

const calculateChecksum = (discMap: number[]) => {
  let result = 0;

  for (let i = 0; i < discMap.length; i++) {
    result += i * discMap[i];
  }

  return result;
};

const compute = () => {
  const input = getInputLines(INPUT_FILE_NAME);
  const diskMap = getFilesWithFreeSpaces(input);
  const defragmentedDisc = createDefragmentedString(diskMap);
  const fragmentedDisc = discFragmentation(defragmentedDisc)
    .map(Number)
    .filter((v) => !Number.isNaN(v));

  return calculateChecksum(fragmentedDisc);
};

console.log(compute());
// answer: 6332189866718
