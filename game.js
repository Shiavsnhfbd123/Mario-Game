const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const coinsValue = document.getElementById("coins-value");
const livesValue = document.getElementById("lives-value");
const timeValue = document.getElementById("time-value");
const restartButton = document.getElementById("restart-button");
const messagePanel = document.getElementById("message-panel");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const messageButton = document.getElementById("message-button");

const touchButtons = document.querySelectorAll(".touch-button");

const TILE = 48;
const GRAVITY = 1700;
const MAX_FALL = 900;
const MOVE_SPEED = 260;
const JUMP_SPEED = 620;
const LEVEL_TIME = 90;
const VIEW_WIDTH = canvas.width;
const VIEW_HEIGHT = canvas.height;

const keys = {
  left: false,
  right: false,
  jump: false,
};

const clouds = [
  { x: 160, y: 82, size: 32, speed: 0.16 },
  { x: 500, y: 118, size: 26, speed: 0.22 },
  { x: 870, y: 92, size: 30, speed: 0.1 },
  { x: 1280, y: 132, size: 38, speed: 0.18 },
  { x: 1770, y: 78, size: 28, speed: 0.14 },
];

const baseLevel = [
  "................................................................................",
  "................................................................................",
  "................................................................................",
  "................................................................................",
  "..............C.........?.......................................................",
  "...........BBB......C..........BBB..............................C...............",
  "....C.................................C...................BBB....................",
  "..............G.............C..............G....................................",
  "..........BBB...................BBB..............C......................F.......",
  "...P............................................................BBB......F.......",
  "XXXXXXXXXXXXXXX...XXXXXX....XXXXXXXX....XXXXXX....XXXXXXX....XXXXXXXXXX..F......",
  "XXXXXXXXXXXXXXX...XXXXXX....XXXXXXXX....XXXXXX....XXXXXXX....XXXXXXXXXX..FXXXXXX"
];

let world;
let player;
let cameraX = 0;
let score = 0;
let lives = 3;
let timer = LEVEL_TIME;
let state = "menu";
let lastTime = 0;

function cloneLevel() {
  return baseLevel.map((row) => row.split(""));
}

function resetWorld(resetLives = false) {
  if (resetLives) {
    lives = 3;
    score = 0;
  }

  const map = cloneLevel();
  const solids = [];
  const coins = [];
  const enemies = [];
  let start = { x: TILE * 2, y: TILE * 8 };
  let flag = { x: TILE * 72, y: TILE * 7 };

  for (let row = 0; row < map.length; row += 1) {
    for (let col = 0; col < map[row].length; col += 1) {
      const tile = map[row][col];
      const x = col * TILE;
      const y = row * TILE;

      if (tile === "X" || tile === "B" || tile === "?") {
        solids.push({ x, y, type: tile });
      }

      if (tile === "C") {
        coins.push({
          x: x + TILE * 0.25,
          y: y + TILE * 0.2,
          width: TILE * 0.5,
          height: TILE * 0.5,
          bob: (row + col) * 0.4,
          collected: false,
        });
      }

      if (tile === "G") {
