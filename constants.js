// ═══════════════════════════════════════════════════════════
//  constants.js  —  Canvas, dimensions, physics, game state
//  Edit this file to tweak speed, gravity, lives, etc.
// ═══════════════════════════════════════════════════════════

const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');
const W = 800, H = 450, TILE = 32;

// ── Physics tuning
const GRAVITY    = 0.45;
const JUMP_FORCE = -9.5;
const JUMP_HOLD  = 0.28;
const MAX_SPD    = 4.5;
const RUN_SPD    = 7;
const ACCEL      = 0.35;

// ── Game state  (mutated throughout the game)
let STATE = 'title'; // title | playing | bossIntro | boss | bossWin | levelclear | gameover | win
let score = 0, coins = 0, lives = 3, world = 1, worldLevel = 1;
let timer = 300, timerLastTick = 0;
let power = 'small', prevPower = 'small', transformAnim = 0;
let camX = 0;
let particles = [], floatingTexts = [];
let bossIntroTimer = 0, bossWinTimer = 0;
let levelClearFired = false;

// ── Input
const keys = {};
let jumpPressed = false;

// ── Active objects (assigned by level/boss builders at runtime)
let player, level, boss = null;
