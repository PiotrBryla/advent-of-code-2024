import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NEW_LINE_SYMBOL = "\n";

const ANTENNA_PATTERN = /[a-zA-Z0-9]/;
const ANTINODE_CHAR = "#";

const INPUT_FILE_NAME = "input.txt";

const ANTENNAS_MAP = new Map();

const getInputLines = (file: string) => {
  const text = fs.readFileSync(path.resolve(__dirname, file)).toString();
  const lines = text.split(NEW_LINE_SYMBOL);

  return lines;
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

// find all the antennas
// for each antenna:
// find all pairs
// for each unique pair
// // set an two antinode in the same distance what other antenna
// // count unique antinodes

const getUniqueAntinodesSum = (maxY: number, maxX: number) => {
  const uniqueAntennas = [...ANTENNAS_MAP.values()];
  const uniqueAntiNodes = new Set();

  // for each antenna char
  for (let i = 0; i < uniqueAntennas.length; i++) {
    for (let entry = 0; entry < uniqueAntennas[i].length; entry++) {
      for (
        let entryPair = 0;
        entryPair < uniqueAntennas[i].length;
        entryPair++
      ) {
        if (entry !== entryPair) {
          const [Ya, Xa] = uniqueAntennas[i][entry];
          const [Yb, Xb] = uniqueAntennas[i][entryPair];

          const diffY = Ya - Yb;
          const diffX = Xa - Xb;

          const antinodeA = [Ya + diffY, Xa + diffX];
          const antinodeB = [Yb - diffY, Xb - diffX];

          const [aAY, aAX] = antinodeA;
          const [aBY, aBX] = antinodeB;

          if (aAY >= 0 && aAY <= maxY && aAX >= 0 && aAX <= maxX)
            uniqueAntiNodes.add(antinodeA.join(","));

          if (aBY >= 0 && aBY <= maxY && aBX >= 0 && aBX <= maxX)
            uniqueAntiNodes.add(antinodeB.join(","));
        }
      }
    }
  }

  return uniqueAntiNodes.size;
};

const buildAntennasMap = (lines: string[]) => {
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      const char = lines[y][x];

      if (char.match(ANTENNA_PATTERN)) {
        ANTENNAS_MAP.set(char, [...(ANTENNAS_MAP.get(char) || []), [y, x]]);
      }
    }
  }
};

const compute = () => {
  // Find all antennas
  const lines = getInputLines(INPUT_FILE_NAME);
  buildAntennasMap(lines);
  const result = getUniqueAntinodesSum(lines.length - 1, lines[0].length - 1);

  return result;
};

console.log(compute());
// answer: 256
