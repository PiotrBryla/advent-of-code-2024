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

const countSame = (arr: (string | number)[], ix: number) => {
  let char = arr[ix];
  let count = 0;
  let i = ix;

  while (arr[i] === char && i >= 0) {
    count++;
    i--;
  }

  return count;
};

const findSpace = (arr: (string | number)[], size: number, max: number) => {
  let i = 0;
  let result = -1;

  while (i < arr.length && i < max && result === -1) {
    let j = i;
    let count = 0;

    while (arr[j] === ".") {
      count++;
      j++;

      if (count === size) {
        result = i;
      }
    }

    i = count > 0 ? j : i + 1;
  }

  return result;
};

const discFragmentation = (defragmentedString: (string | number)[]) => {
  let result = [...defragmentedString];

  let r = defragmentedString.length - 1;

  // start from right, get count of the same
  // replace first large enough space from left

  while (r > 0) {
    if (result[r] !== ".") {
      const char = result[r];
      const fileLength = countSame(result, r);
      const spaceIndex = findSpace(result, fileLength, r - fileLength);

      if (spaceIndex > 0) {
        for (let filechunks = fileLength; filechunks > 0; filechunks--) {
          const ix = spaceIndex + (fileLength - filechunks);
          const rIx = r - (fileLength - filechunks);
          result[ix] = char;
          result[rIx] = ".";
        }
      }
      r = r - fileLength;
    } else {
      r--;
    }
  }

  return result;
};

const calculateChecksum = (discMap: number[]) => {
  let result = 0;

  for (let i = 0; i < discMap.length; i++) {
    if (!Number.isNaN(discMap[i])) {
      result += i * discMap[i];
    }
  }

  return result;
};

const compute = () => {
  const input = getInputLines(INPUT_FILE_NAME);
  const diskMap = getFilesWithFreeSpaces(input);
  const defragmentedDisc = createDefragmentedString(diskMap);

  const fragmentedDisc = discFragmentation(defragmentedDisc).map(Number);

  return calculateChecksum(fragmentedDisc);
};

console.log(compute());
// answer: 6353648390778
