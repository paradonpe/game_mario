// ═══════════════════════════════════════════════════════════
//  levels.js  —  Level & boss data configs + builder functions
//  Add new levels here. Each key is "world-level" (e.g. '2-1').
//  Available themes: normal | cave | paradise | night | lava
//  Boss themes are set automatically via BOSS_CONFIGS.
// ═══════════════════════════════════════════════════════════

// ── Regular level data ──────────────────────────────────────
const LEVEL_CONFIGS = {

  '1-1': {
    width: 220, theme: 'normal',
    enemies: [
      { type: 'goomba', tx: 20 }, { type: 'goomba', tx: 24 }, { type: 'goomba', tx: 38 },
      { type: 'koopa',  tx: 50 }, { type: 'goomba', tx: 60 }, { type: 'goomba', tx: 61 },
      { type: 'koopa',  tx: 75 }, { type: 'koopa',  tx: 76 }, { type: 'goomba', tx: 90 },
    ],
    qblocks: [
      { tx: 13, ty: 10, item: 'coin' },    { tx: 16, ty:  7, item: 'mushroom' },
      { tx: 20, ty: 10, item: 'coin' },    { tx: 20, ty:  7, item: 'coin' },
      { tx: 21, ty:  7, item: 'coin' },    { tx: 22, ty:  7, item: 'coin' },
      { tx: 55, ty:  7, item: 'star' },    { tx: 68, ty: 10, item: 'coin' },
      { tx: 80, ty: 10, item: 'coin' },
    ],
    platforms: [
      { tx: 10, ty: 11, len: 3 }, { tx: 17, ty:  8, len: 1 }, { tx: 23, ty:  8, len: 3 },
      { tx: 35, ty:  8, len: 2 }, { tx: 42, ty:  6, len: 2 }, { tx: 48, ty: 10, len: 2 },
      { tx: 56, ty:  7, len: 4 }, { tx: 65, ty:  9, len: 3 }, { tx: 72, ty:  7, len: 2 },
      { tx: 78, ty: 11, len: 3 }, { tx: 85, ty:  8, len: 3 },
    ],
    pipes: [
      { tx: 30, ty: 10, h: 2 }, { tx: 46, ty: 10, h: 3 },
      { tx: 62, ty: 10, h: 2 }, { tx: 88, ty: 10, h: 4 },
    ],
    flagX: 200,
  },

  '1-2': {
    width: 230, theme: 'cave',
    enemies: [
      { type: 'goomba', tx: 14 }, { type: 'goomba', tx: 15 }, { type: 'koopa',  tx: 25 },
      { type: 'goomba', tx: 36 }, { type: 'goomba', tx: 45 }, { type: 'koopa',  tx: 55 },
      { type: 'goomba', tx: 65 }, { type: 'koopa',  tx: 74 }, { type: 'goomba', tx: 82 },
      { type: 'koopa',  tx: 92 }, { type: 'goomba', tx: 101 },
    ],
    qblocks: [
      { tx: 10, ty:  9, item: 'mushroom' }, { tx: 18, ty:  7, item: 'coin' },
      { tx: 22, ty:  7, item: 'coin' },     { tx: 30, ty:  9, item: 'star' },
      { tx: 48, ty:  7, item: 'coin' },     { tx: 60, ty:  9, item: 'mushroom' },
      { tx: 78, ty:  7, item: 'coin' },     { tx: 88, ty:  9, item: 'star' },
    ],
    platforms: [
      { tx:  8, ty: 10, len: 2 }, { tx: 14, ty:  8, len: 3 }, { tx: 20, ty:  6, len: 2 },
      { tx: 26, ty:  9, len: 3 }, { tx: 36, ty:  7, len: 2 }, { tx: 42, ty: 10, len: 2 },
      { tx: 50, ty:  8, len: 3 }, { tx: 58, ty:  6, len: 2 }, { tx: 65, ty: 10, len: 3 },
      { tx: 73, ty:  8, len: 2 }, { tx: 80, ty:  6, len: 3 }, { tx: 90, ty:  9, len: 3 },
    ],
    pipes: [
      { tx: 18, ty: 10, h: 2 }, { tx: 40, ty: 10, h: 3 },
      { tx: 62, ty: 10, h: 2 }, { tx: 84, ty: 10, h: 3 },
    ],
    flagX: 213,
  },

  '2-1': {
    width: 250, theme: 'paradise',
    enemies: [
      { type: 'goomba', tx: 18 }, { type: 'goomba', tx: 19 }, { type: 'koopa',  tx: 32 },
      { type: 'goomba', tx: 47 }, { type: 'koopa',  tx: 53 }, { type: 'goomba', tx: 65 },
      { type: 'goomba', tx: 66 }, { type: 'goomba', tx: 78 }, { type: 'koopa',  tx: 88 },
      { type: 'goomba', tx: 98 }, { type: 'koopa', tx: 108 }, { type: 'goomba', tx: 118 },
    ],
    qblocks: [
      { tx: 11, ty:  7, item: 'coin' },    { tx: 13, ty:  7, item: 'mushroom' },
      { tx: 15, ty:  7, item: 'coin' },    { tx: 28, ty:  9, item: 'coin' },
      { tx: 45, ty:  7, item: 'star' },    { tx: 60, ty:  9, item: 'coin' },
      { tx: 76, ty:  7, item: 'mushroom' },{ tx: 92, ty: 10, item: 'coin' },
      { tx: 110, ty:  7, item: 'star' },
    ],
    platforms: [
      { tx:  9, ty:  8, len: 4 }, { tx: 22, ty:  7, len: 2 }, { tx: 27, ty:  9, len: 3 },
      { tx: 38, ty:  7, len: 3 }, { tx: 50, ty:  9, len: 2 }, { tx: 60, ty:  7, len: 4 },
      { tx: 72, ty:  9, len: 3 }, { tx: 82, ty:  7, len: 4 }, { tx: 95, ty:  9, len: 2 },
      { tx: 104, ty:  8, len: 3 }, { tx: 112, ty:  7, len: 4 },
    ],
    pipes: [
      { tx: 20, ty: 10, h: 2 }, { tx: 42, ty: 10, h: 3 },
      { tx: 70, ty: 10, h: 2 }, { tx: 100, ty: 10, h: 3 },
    ],
    flagX: 235,
    // Paradise-specific extras
    palms: [ 40, 80, 130, 180 ],
    coral: [
      { tx:  35, col: '#ff6090' }, { tx:  55, col: '#ff9040' },
      { tx:  90, col: '#ff6090' }, { tx: 115, col: '#ffd060' },
    ],
  },

  '2-2': {
    width: 260, theme: 'normal',
    enemies: [
      { type: 'koopa',  tx: 12 }, { type: 'goomba', tx: 20 }, { type: 'goomba', tx: 21 },
      { type: 'koopa',  tx: 30 }, { type: 'koopa',  tx: 31 }, { type: 'goomba', tx: 44 },
      { type: 'goomba', tx: 55 }, { type: 'koopa',  tx: 60 }, { type: 'goomba', tx: 70 },
      { type: 'goomba', tx: 71 }, { type: 'koopa',  tx: 82 }, { type: 'koopa',  tx: 95 },
      { type: 'goomba', tx: 108 }, { type: 'goomba', tx: 109 }, { type: 'goomba', tx: 110 },
    ],
    qblocks: [
      { tx:  8, ty:  7, item: 'mushroom' }, { tx: 18, ty:  9, item: 'coin' },
      { tx: 28, ty:  7, item: 'star' },     { tx: 40, ty:  9, item: 'coin' },
      { tx: 52, ty:  7, item: 'coin' },     { tx: 65, ty:  9, item: 'mushroom' },
      { tx: 78, ty:  7, item: 'coin' },     { tx: 90, ty:  9, item: 'star' },
      { tx: 105, ty:  7, item: 'coin' },
    ],
    platforms: [
      { tx:  6, ty:  8, len: 2 }, { tx: 15, ty:  7, len: 3 }, { tx: 22, ty:  9, len: 2 },
      { tx: 28, ty:  7, len: 4 }, { tx: 38, ty:  9, len: 2 }, { tx: 45, ty:  7, len: 3 },
      { tx: 55, ty:  9, len: 2 }, { tx: 62, ty:  7, len: 4 }, { tx: 72, ty:  9, len: 3 },
      { tx: 80, ty:  8, len: 2 }, { tx: 88, ty:  7, len: 3 }, { tx: 98, ty:  9, len: 2 },
      { tx: 107, ty:  8, len: 4 },
    ],
    pipes: [
      { tx: 10, ty: 10, h: 2 }, { tx: 25, ty: 10, h: 3 }, { tx: 50, ty: 10, h: 2 },
      { tx: 68, ty: 10, h: 4 }, { tx: 88, ty: 10, h: 3 }, { tx: 110, ty: 10, h: 2 },
    ],
    flagX: 245,
  },

  '3-1': {
    width: 270, theme: 'night',
    enemies: [
      { type: 'koopa',  tx: 15 }, { type: 'goomba', tx: 22 }, { type: 'koopa',  tx: 30 },
      { type: 'goomba', tx: 40 }, { type: 'koopa',  tx: 48 }, { type: 'goomba', tx: 57 },
      { type: 'goomba', tx: 58 }, { type: 'koopa',  tx: 68 }, { type: 'goomba', tx: 78 },
      { type: 'koopa',  tx: 85 }, { type: 'goomba', tx: 95 }, { type: 'koopa', tx: 103 },
      { type: 'goomba', tx: 113 }, { type: 'goomba', tx: 114 }, { type: 'koopa', tx: 122 },
    ],
    qblocks: [
      { tx: 10, ty:  7, item: 'star' },    { tx: 18, ty:  9, item: 'mushroom' },
      { tx: 26, ty:  7, item: 'coin' },    { tx: 38, ty:  9, item: 'coin' },
      { tx: 50, ty:  7, item: 'mushroom' },{ tx: 62, ty:  9, item: 'star' },
      { tx: 76, ty:  7, item: 'coin' },    { tx: 90, ty:  9, item: 'mushroom' },
      { tx: 106, ty:  7, item: 'coin' },
    ],
    platforms: [
      { tx:  8, ty:  9, len: 3 }, { tx: 16, ty:  7, len: 2 }, { tx: 23, ty: 10, len: 3 },
      { tx: 30, ty:  7, len: 4 }, { tx: 42, ty:  9, len: 2 }, { tx: 50, ty:  7, len: 3 },
      { tx: 60, ty: 10, len: 2 }, { tx: 68, ty:  8, len: 4 }, { tx: 80, ty:  7, len: 3 },
      { tx: 88, ty: 10, len: 2 }, { tx: 96, ty:  8, len: 3 }, { tx: 108, ty:  7, len: 4 },
    ],
    pipes: [
      { tx: 12, ty: 10, h: 3 }, { tx: 35, ty: 10, h: 2 }, { tx: 58, ty: 10, h: 4 },
      { tx: 82, ty: 10, h: 2 }, { tx: 106, ty: 10, h: 3 },
    ],
    flagX: 255,
  },

  '3-2': {
    width: 280, theme: 'lava',
    enemies: [
      { type: 'koopa',  tx: 14 }, { type: 'koopa',  tx: 15 }, { type: 'goomba', tx: 26 },
      { type: 'koopa',  tx: 34 }, { type: 'goomba', tx: 44 }, { type: 'koopa',  tx: 52 },
      { type: 'goomba', tx: 62 }, { type: 'goomba', tx: 63 }, { type: 'koopa',  tx: 72 },
      { type: 'koopa',  tx: 80 }, { type: 'goomba', tx: 90 }, { type: 'koopa',  tx: 98 },
      { type: 'goomba', tx: 108 }, { type: 'koopa', tx: 116 }, { type: 'goomba', tx: 124 },
    ],
    qblocks: [
      { tx: 10, ty:  7, item: 'mushroom' }, { tx: 20, ty:  9, item: 'coin' },
      { tx: 32, ty:  7, item: 'star' },     { tx: 46, ty:  9, item: 'mushroom' },
      { tx: 58, ty:  7, item: 'coin' },     { tx: 70, ty:  9, item: 'star' },
      { tx: 84, ty:  7, item: 'coin' },     { tx: 96, ty:  9, item: 'mushroom' },
      { tx: 110, ty:  7, item: 'star' },
    ],
    platforms: [
      { tx:  8, ty:  9, len: 2 }, { tx: 16, ty:  7, len: 3 }, { tx: 24, ty: 10, len: 2 },
      { tx: 32, ty:  7, len: 4 }, { tx: 44, ty:  9, len: 3 }, { tx: 54, ty:  7, len: 2 },
      { tx: 62, ty: 10, len: 3 }, { tx: 72, ty:  7, len: 4 }, { tx: 84, ty:  9, len: 2 },
      { tx: 92, ty:  7, len: 3 }, { tx: 102, ty: 10, len: 2 }, { tx: 112, ty:  8, len: 4 },
    ],
    pipes: [
      { tx: 12, ty: 10, h: 2 }, { tx: 40, ty: 10, h: 3 }, { tx: 66, ty: 10, h: 4 },
      { tx: 90, ty: 10, h: 2 }, { tx: 114, ty: 10, h: 3 },
    ],
    flagX: 265,
  },

};

// ── Boss data ───────────────────────────────────────────────
// hp        — stomps needed to defeat
// color     — accent colour used for HP bar and particles
// theme     — background theme used in the arena
const BOSS_CONFIGS = {
  1: { name: 'KING GOOMBA',     hp: 5, color: '#a06018', theme: 'boss1' },
  2: { name: 'LAVA KOOPA KING', hp: 7, color: '#e03000', theme: 'boss2' },
  3: { name: 'SHADOW OVERLORD', hp: 9, color: '#5000a0', theme: 'boss3' },
};

// ── Level builder entry point ───────────────────────────────
function buildLevel(w, l) {
  const key = w + '-' + l;
  const cfg = LEVEL_CONFIGS[key];
  if (!cfg) return buildBossLevel(w);
  return buildFromConfig(cfg);
}

// ── Boss arena builder ──────────────────────────────────────
function buildBossLevel(w) {
  const LW = 40, GH = 13;
  const tiles = [];
  for (let x = 0; x < LW; x++) {
    tiles.push({ x, y: GH,     type: 'groundTop' });
    tiles.push({ x, y: GH + 1, type: 'ground' });
  }
  // Fixed platform layout for every boss arena
  [
    [4, 10, 4], [12, 8, 4], [20, 10, 4],
    [28,  8, 4], [ 4,  6, 3], [28,  6, 3],
  ].forEach(([tx, ty, len]) => {
    for (let i = 0; i < len; i++) tiles.push({ x: tx + i, y: ty, type: 'brick' });
  });
  const bcfg = BOSS_CONFIGS[w];
  return {
    tiles, qblocks: [], enemies: [], items: [],
    flagX: null, width: LW * TILE, groundY: GH,
    theme: bcfg.theme, palms: [], coral: [],
    isBossArena: true, bossWorld: w,
  };
}

// ── Regular level builder ───────────────────────────────────
function buildFromConfig(cfg) {
  const LW = cfg.width, GH = 13;
  const tiles = [];

  // Ground row
  for (let x = 0; x < LW; x++) {
    tiles.push({ x, y: GH,     type: 'groundTop' });
    tiles.push({ x, y: GH + 1, type: 'ground' });
  }

  // Brick platforms
  cfg.platforms.forEach(p => {
    for (let i = 0; i < p.len; i++) tiles.push({ x: p.tx + i, y: p.ty, type: 'brick' });
  });

  // Q-blocks
  const qblocks = cfg.qblocks.map(q => ({ ...q, hit: false, anim: 0 }));

  // Pipes (two tiles wide)
  cfg.pipes.forEach(p => {
    for (let h = 0; h < p.h; h++) {
      tiles.push({ x: p.tx,     y: GH - h, type: 'pipeBody', left: true  });
      tiles.push({ x: p.tx + 1, y: GH - h, type: 'pipeBody', left: false });
    }
    tiles.push({ x: p.tx,     y: GH - p.h, type: 'pipeTop', left: true  });
    tiles.push({ x: p.tx + 1, y: GH - p.h, type: 'pipeTop', left: false });
  });

  // Enemies
  const enemies = cfg.enemies.map(e => ({
    type: e.type,
    x: e.tx * TILE, y: (GH - 2) * TILE,
    w: 28, h: e.type === 'koopa' ? 32 : 24,
    vx: e.type === 'koopa' ? -0.8 : -0.6, vy: 0,
    onGround: false,
    alive: true, stomped: false, stompTimer: 0,
    shell: false, shellVx: 0,
    animFrame: 0, animTick: 0,
  }));

  return {
    tiles, qblocks, enemies, items: [],
    flagX: cfg.flagX * TILE, width: LW * TILE, groundY: GH,
    theme: cfg.theme || 'normal',
    palms:  cfg.palms  || [],
    coral:  cfg.coral  || [],
    isBossArena: false,
  };
}
