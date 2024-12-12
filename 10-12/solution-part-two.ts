import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE_NAME = "input.txt";
const NEW_LINE_SYMBOL = "\n";
const STARTING_NODE = 0;
const FINISH_NODE = 9;

type Node = [number, number];

let GRAPH: number[][] = [];
const resultMap = new Map();

const getInputLines = (file: string) => {
  const text = fs.readFileSync(path.resolve(__dirname, file)).toString();

  return text
    .split(NEW_LINE_SYMBOL)
    .map((line) => line.split("").map((s) => Number(s)));
};

const getStartingNodes = (grid: number[][]) => {
  const result = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === STARTING_NODE) {
        result.push([y, x] as Node);
      }
    }
  }

  return result;
};

const isValidNode = (node: [number, number], currentHeight: number) => {
  const [y, x] = node;
  const isInbounds =
    y < GRAPH.length && y >= 0 && x >= 0 && x < GRAPH[0].length;
  if (!isInbounds) return false;

  const nodeHeight = GRAPH[y][x];
  return nodeHeight - currentHeight === 1;
};

const exploreFromNode = (node: [number, number], visited = new Set()) => {
  const [y, x] = node as Node;
  const currentHeight = GRAPH[y][x];
  const nodeKey = node.join(",");
  visited.add(node);

  console.log(node, currentHeight);
  if (currentHeight === FINISH_NODE) {
    resultMap.set(nodeKey, (resultMap.get(nodeKey) || 0) + 1);
  } else {
    const up: Node = [y - 1, x];
    const down: Node = [y + 1, x];
    const left: Node = [y, x - 1];
    const right: Node = [y, x + 1];

    const validNodes = [up, down, left, right].filter(
      (node) =>
        isValidNode(node as Node, currentHeight) && !visited.has(node.join(","))
    );

    validNodes.forEach((node) => {
      exploreFromNode(node, visited);
    });
  }

  return [...resultMap.values()];
};

const findAllPaths = (staringNodes: Node[]) => {
  staringNodes.forEach((node) => {
    exploreFromNode(node);
  });
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const compute = () => {
  // get input
  GRAPH = getInputLines(INPUT_FILE_NAME);
  // find all starting nodes "0"
  const staringNodes = getStartingNodes(GRAPH);
  // for each starting node
  // try every possible path
  // if path ends on "9" – add it to the result
  findAllPaths(staringNodes);

  console.log(sum([...resultMap.values()]));
};

console.log(compute());
// answer: 1541
