import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NEW_LINE_SYMBOL = "\n";

const INPUT_FILE_NAME = "input.txt";
const VISITED_CHAR = "X";
const PATH_CHARS = [".", VISITED_CHAR];
const STARTING_POSITION = "^";

const getInputLines = (file: string) => {
  const text = fs.readFileSync(path.resolve(__dirname, file)).toString();
  const lines = text.split(NEW_LINE_SYMBOL);

  return lines.map((line) => line.split(""));
};

const getNextNode = (
  graph: string[][],
  dir: string,
  curPos: [number, number]
) => {
  const dirs = ["^", ">", "v", "<"];

  const dirFn: Record<string, (y: number, x: number) => [number, number]> = {
    "<": (y: number, x: number) => [y, x - 1],
    ">": (y: number, x: number) => [y, x + 1],
    "^": (y: number, x: number) => [y - 1, x],
    v: (y: number, x: number) => [y + 1, x],
  };

  const isInBounds = ([y, x]: [number, number]) => {
    return y >= 0 && y < graph.length && x >= 0 && x < graph[0].length;
  };

  const isPathChar = ([y, x]: [number, number]) =>
    PATH_CHARS.includes(graph[y][x]);

  for (
    let curDir = dir, i = 0;
    i < 2;
    i++, curDir = dirs[dirs.indexOf(curDir) + 1] || dirs[i - dir.length]
  ) {
    const [y, x] = curPos;
    const nextNodeCandidate = dirFn[curDir](y, x);

    if (!isInBounds(nextNodeCandidate)) {
      return "end";
    }

    if (isInBounds(nextNodeCandidate) && isPathChar(nextNodeCandidate)) {
      return { dir: curDir, nextNode: nextNodeCandidate };
    }
  }

  return false;
};

const bfs = (graph: string[][], staringNode: [number, number]) => {
  const queue = [staringNode];

  const [startY, startX] = staringNode;
  let dir = graph[startY][startX];

  graph[startY][startX] = VISITED_CHAR;

  while (queue.length) {
    const node = queue.shift();
    const [y, x] = node as [number, number];

    graph[y][x] = VISITED_CHAR;

    const nextNodeData = getNextNode(graph, dir, [y, x]);

    if (nextNodeData === "end") {
      break;
    }

    if (nextNodeData) {
      const { dir: newDir, nextNode } = nextNodeData;
      dir = newDir;
      queue.push(nextNode);
    }
  }

  return graph;
};

const getStartingNode = (graph: string[][], char: string) => {
  for (let y = 0; y < graph.length; y++) {
    for (let x = 0; x < graph[0].length; x++) {
      if (graph[y][x] === char) return [y, x];
    }
  }
};

const compute = () => {
  const lines = getInputLines(INPUT_FILE_NAME);
  const startingNode = getStartingNode(lines, STARTING_POSITION);

  const graph = bfs(lines, startingNode as [number, number]);

  return graph.flat().filter((X) => X === VISITED_CHAR).length;
};

console.log(compute());
// answer: 5651
