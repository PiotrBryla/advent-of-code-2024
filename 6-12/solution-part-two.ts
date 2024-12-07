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
const ORIGINAL_OBSTACLE = "#";
const OBSTACLE_CHAR = "O";

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
    i < 4;
    i++,
      curDir =
        dirs[dirs.indexOf(curDir) + 1] ||
        dirs[dirs.indexOf(curDir) + 1 - dirs.length]
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

const isPathVisitedTwice = (visited: Map<string, number>) => {
  const values = [...visited.values()];
  // the agent can get into a loop that is a subset of the visited nodes
  // the 5th times visited is a case when the loop has a shape of a four-leaf clover with the starting node in the center
  const result =
    values.every((val) => val >= 2) || values.some((val) => val > 4);

  return result;
};

const isGraphWithLoop = (graph: string[][], staringNode: [number, number]) => {
  const queue = [staringNode];
  const visited = new Map();

  const [startY, startX] = staringNode;
  let dir = graph[startY][startX];

  graph[startY][startX] = VISITED_CHAR;

  while (queue.length) {
    const node = queue.shift();
    const [y, x] = node as [number, number];
    const nodeKey = node?.join("");

    graph[y][x] = VISITED_CHAR;
    visited.set(nodeKey, visited.has(nodeKey) ? visited.get(nodeKey) + 1 : 1);

    if (isPathVisitedTwice(visited)) {
      break;
    }

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

  // console.log("cannot move");
  return isPathVisitedTwice(visited);
};

const getStartingNode = (graph: string[][], char: string) => {
  for (let y = 0; y < graph.length; y++) {
    for (let x = 0; x < graph[0].length; x++) {
      if (graph[y][x] === char) return [y, x];
    }
  }
};

const getAllNodes = (graph: string[][]) => {
  const visited = [];

  for (let y = 0; y < graph.length; y++) {
    for (let x = 0; x < graph[0].length; x++) {
      if (graph[y][x] === VISITED_CHAR) {
        visited.push([y, x]);
      }
    }
  }

  return visited;
};

const compute = () => {
  const lines = getInputLines(INPUT_FILE_NAME);
  const _lines = JSON.parse(JSON.stringify(lines));
  const startingNode = getStartingNode(lines, STARTING_POSITION);

  const graph = bfs(_lines, startingNode as [number, number]);
  const visited = getAllNodes(graph);

  // THIS IS VERY SLOW AND UGLY BRUTE FORCE CODE THAT RUNS FOREVER
  // for each of the nodes that are not original obstacle put an obstacle
  // - traverse the graph
  // - check if in the loop by
  // - -marking visited nodes and checking if each node was visited twice OR any of the nodes was visited more than 4 times (partial loop)

  const loopsWithObstacle = visited.filter(([y, x]) => {
    if (!startingNode) return false;
    if (y === startingNode[0] && x === startingNode[1]) return false;

    // deep clone
    const _graph = JSON.parse(JSON.stringify(lines));
    _graph[y][x] = OBSTACLE_CHAR;

    console.log("Computing", y, x);
    const result = isGraphWithLoop(_graph, startingNode as [number, number]);

    return result;
  });

  return loopsWithObstacle.length;
};

console.log(compute());
// 1093 is too low
// 1304
// 1309 wrong
// 1321 wrong
// 2094 is too high

// theoretical max 130 x 130 = 16900
// answer:
