// ═══════════════════════════════════════════════════════════
//  physics.js  —  Collision, player, items, regular enemies
// ═══════════════════════════════════════════════════════════

// ── Tile query helpers ──────────────────────────────────────
function isSolid(t) {
  return ['groundTop', 'ground', 'brick', 'pipeBody', 'pipeTop'].includes(t.type);
}
function getTileAt(tx, ty) { return level.tiles.find(t => t.x === tx && t.y === ty); }
function getQBlockAt(tx, ty) { return level.qblocks.find(q => q.tx === tx && q.ty === ty && !q.hit); }

// Returns the first overlapping solid tile in rect (px,py,pw,ph), or null.
// Unhit Q-blocks are also solid so the player can headbutt them from below.
function solidAt(px, py, pw, ph) {
  const x1 = Math.floor(px / TILE),            y1 = Math.floor(py / TILE);
  const x2 = Math.floor((px + pw - 1) / TILE), y2 = Math.floor((py + ph - 1) / TILE);
  for (let ty = y1; ty <= y2; ty++)
    for (let tx = x1; tx <= x2; tx++) {
      // Regular solid tiles
      const t = getTileAt(tx, ty);
      if (t && isSolid(t)) return { tile: t, tx, ty };
      // Unhit Q-blocks count as solid (enables headbutting)
      const q = level.qblocks.find(q => q.tx === tx && q.ty === ty && !q.hit);
      if (q) return { tile: { type: 'qblock' }, tx, ty };
    }
  return null;
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// ── Axis-separated movement ─────────────────────────────────
// Each function moves along one axis and resolves collisions.
// Insets the perpendicular axis by 1px to prevent corner-sticking.

// Returns { px, vx }
function moveX(px, py, pw, ph, vx) {
  px += vx;
  const hit = solidAt(px, py + 1, pw, ph - 2); // inset Y
  if (hit) {
    px = vx > 0 ? hit.tx * TILE - pw : (hit.tx + 1) * TILE;
    vx = 0;
  }
  return { px, vx };
}

// Returns { py, vy, onGround, hitTile }
function moveY(px, py, pw, ph, vy) {
  py += vy;
  const hit = solidAt(px + 1, py, pw - 2, ph); // inset X
  if (hit) {
    if (vy > 0) {
      py = hit.ty * TILE - ph;
      return { py, vy: 0, onGround: true, hitTile: hit };
    } else {
      py = (hit.ty + 1) * TILE;
      return { py, vy: 1, onGround: false, hitTile: hit };
    }
  }
  return { py, vy, onGround: false, hitTile: null };
}

// ── Player helpers ──────────────────────────────────────────
function makePlayer() {
  return {
    x: 64, y: 350, w: 24, h: 24,
    vx: 0, vy: 0, onGround: false, facing: 1,
    jumpTimer: 0, invincible: 0, starTimer: 0,
    animFrame: 0, animTick: 0,
    dead: false, deadTimer: 0,
  };
}
// Current player hitbox height and Y-offset depending on power-up state
function pH()  { return power === 'small' ? 24 : 32; }
function pYO() { return power === 'small' ?  0 : -8; }

// ── Player update ───────────────────────────────────────────
function updatePlayer(dt) {
  const p = player;
  if (p.dead) { p.deadTimer += dt; if (p.deadTimer > 90) respawn(); return; }
  if (p.invincible > 0) p.invincible -= dt;
  if (p.starTimer > 0) { p.starTimer -= dt; if (p.starTimer <= 0 && power === 'star') power = 'big'; }

  // Horizontal movement
  const ms = (keys['ShiftLeft'] || keys['ShiftRight']) ? RUN_SPD : MAX_SPD;
  const left  = keys['ArrowLeft']  || keys['KeyA'];
  const right = keys['ArrowRight'] || keys['KeyD'];
  if (right)      { p.vx = Math.min(p.vx + ACCEL,  ms); p.facing =  1; }
  else if (left)  { p.vx = Math.max(p.vx - ACCEL, -ms); p.facing = -1; }
  else            { p.vx *= p.onGround ? 0.78 : 0.92; if (Math.abs(p.vx) < 0.1) p.vx = 0; }

  // Jump
  const jk = keys['Space'] || keys['ArrowUp'] || keys['KeyW'];
  if (jk && !jumpPressed && p.onGround) {
    p.vy = JUMP_FORCE; p.jumpTimer = 14; jumpPressed = true;
    addParticle(p.x + 12, p.y + p.h, '#fff', 0, -2);
  }
  if (!jk) jumpPressed = false;
  if (jk && p.jumpTimer > 0) { p.vy -= JUMP_HOLD; p.jumpTimer -= dt; } else p.jumpTimer = 0;

  p.vy = Math.min(p.vy + GRAVITY, 14);

  const pw = p.w, ph = pH(), yo = pYO();

  // X axis first (then Y) — fixes wall-sticking bugs
  const rx = moveX(p.x, p.y + yo, pw, ph, p.vx);
  p.x = rx.px; p.vx = rx.vx;
  p.x = Math.max(0, Math.min(level.width - pw, p.x));

  // Y axis
  p.onGround = false;
  const ry = moveY(p.x, p.y + yo, pw, ph, p.vy);
  p.y = ry.py - yo; p.vy = ry.vy;
  if (ry.onGround) { p.onGround = true; p.jumpTimer = 0; }

  // Head-bump: trigger Q-blocks or break/bump bricks
  if (ry.hitTile && ry.vy === 1) {
    const hx = Math.floor((p.x + pw / 2) / TILE), hy = ry.hitTile.ty;
    const qb = getQBlockAt(hx, hy);
    if (qb) hitQBlock(qb);
    else {
      const bt = getTileAt(hx, hy);
      if (bt && bt.type === 'brick' && power !== 'small') breakBrick(hx, hy);
      else if (bt && bt.type === 'brick') bumpBrick(hx, hy);
    }
  }

  if (p.y > H + 100) playerDie();

  // Walk animation
  p.animTick += dt;
  if (Math.abs(p.vx) > 0.5 && p.onGround) {
    if (p.animTick > 5) { p.animFrame = (p.animFrame + 1) % 4; p.animTick = 0; }
  } else if (!p.onGround) {
    p.animFrame = 2;
  } else {
    p.animFrame = 0;
  }

  // Item pickup
  level.items = level.items.filter(item => {
    if (rectsOverlap(p.x, p.y + yo, pw, ph, item.x, item.y, item.w || 20, item.h || 20)) {
      collectItem(item); return false;
    }
    return true;
  });
}

// ── Block interactions ──────────────────────────────────────
function hitQBlock(qb) {
  qb.hit = true; qb.anim = 8;
  spawnItem(qb.tx * TILE + TILE / 2 - 8, qb.ty * TILE - TILE, qb.item);
  addScore(100);
  addParticle(qb.tx * TILE + 12, qb.ty * TILE, '#f0b000', 0, -3, 30);
}
function breakBrick(tx, ty) {
  const i = level.tiles.findIndex(t => t.x === tx && t.y === ty);
  if (i !== -1) level.tiles.splice(i, 1);
  addScore(50);
  for (let j = 0; j < 6; j++)
    addParticle(tx * TILE + 16, ty * TILE + 8, '#c84c0c', Math.random() * 6 - 3, -Math.random() * 6, 40);
}
function bumpBrick(tx, ty) { const t = getTileAt(tx, ty); if (t) t.bumpAnim = 6; }

// ── Item spawning & collection ──────────────────────────────
function spawnItem(x, y, type) {
  if (type === 'coin') {
    addScore(200); coins++;
    addFloatText('+COIN', x, y, '#f0b000'); updateHUD(); return;
  }
  if (type === 'mushroom') level.items.push({ type: 'mushroom', x, y, w: 24, h: 24, vy: -2, vx: 1, onGround: false });
  if (type === 'star')     level.items.push({ type: 'star',     x, y, w: 24, h: 24, vy: -5, vx: 2, bouncing: true });
}

function collectItem(item) {
  if (item.type === 'mushroom') {
    if (power === 'small') { prevPower = power; power = 'big'; transformAnim = 30; }
    addScore(1000);
    addFloatText('+MUSHROOM', item.x, item.y, '#e02020');
    for (let i = 0; i < 10; i++)
      addParticle(item.x + 12, item.y, '#e02020', Math.random() * 6 - 3, -Math.random() * 4, 40);
  }
  if (item.type === 'star') {
    prevPower = power; power = 'star'; player.starTimer = 600;
    addScore(1000); addFloatText('STAR!', item.x, item.y, '#f0d000');
  }
}

function updateItems(dt) {
  level.items.forEach(item => {
    item.vy = Math.min((item.vy || 0) + GRAVITY, 12);
    const rx = moveX(item.x, item.y, item.w || 24, item.h || 24, item.vx || 0);
    item.x = rx.px; if (rx.vx === 0) item.vx = (item.vx || 1) * -1;
    const ry = moveY(item.x, item.y, item.w || 24, item.h || 24, item.vy);
    item.y = ry.py; item.vy = ry.vy;
    if (ry.onGround && item.bouncing) item.vy = -7;
    if (item.y > H + 100) item.dead = true;
  });
  level.items = level.items.filter(i => !i.dead);
}

// ── Player death & respawn ──────────────────────────────────
function playerDie() {
  if (player.invincible > 0 || player.dead) return;
  if (power !== 'small') {
    prevPower = power; power = 'small'; transformAnim = 30;
    player.invincible = 120; addFloatText('OUCH!', player.x, player.y, '#fff'); return;
  }
  player.dead = true; player.deadTimer = 0; player.vy = -10; player.vx = 0;
  lives--; updateHUD();
}
function respawn() {
  if (lives <= 0) { STATE = 'gameover'; showMsg('GAME OVER', 'You ran out of lives.', 'PRESS ENTER TO RESTART'); return; }
  player = makePlayer(); power = 'small'; transformAnim = 0; camX = 0;
  // Stay in boss state so the boss keeps rendering; go back to playing otherwise
  STATE = (level && level.isBossArena) ? 'boss' : 'playing';
}

// ── Regular enemy update ────────────────────────────────────
function updateEnemies(dt) {
  const ph = pH(), yo = pYO();
  level.enemies.forEach(e => {
    if (!e.alive) return;
    if (e.stomped) { e.stompTimer += dt; if (e.stompTimer > 30) e.alive = false; return; }
    e.animTick += dt; if (e.animTick > 8) { e.animFrame = (e.animFrame + 1) % 2; e.animTick = 0; }

    // ── Shell mode
    if (e.shell) {
      if (Math.abs(e.shellVx) < 0.1) return;
      const rx = moveX(e.x, e.y, e.w, e.h, e.shellVx);
      e.x = rx.px; if (rx.vx === 0) e.shellVx *= -1;
      // Shell kills other enemies on contact
      level.enemies.forEach(o => {
        if (o === e || !o.alive || o.stomped) return;
        if (rectsOverlap(e.x, e.y, e.w, e.h, o.x, o.y, o.w, o.h)) {
          o.alive = false; addScore(200); addParticle(o.x + 14, o.y, '#fff', 0, -4);
        }
      });
      e.vy = Math.min(e.vy + GRAVITY, 14);
      const ry = moveY(e.x, e.y, e.w, e.h, e.vy); e.y = ry.py; e.vy = ry.vy;
      if (!player.dead && player.invincible <= 0) {
        if (rectsOverlap(player.x, player.y + yo, player.w, ph, e.x, e.y, e.w, e.h)) {
          power === 'star' ? (e.alive = false, addScore(300)) : playerDie();
        }
      }
      if (e.y > H + 100) e.alive = false;
      return;
    }

    // ── Normal walking enemy
    e.vy = Math.min(e.vy + GRAVITY, 14);
    const ry = moveY(e.x, e.y, e.w, e.h, e.vy);
    e.y = ry.py; e.vy = ry.vy; e.onGround = ry.onGround;

    const rx = moveX(e.x, e.y, e.w, e.h, e.vx);
    e.x = rx.px; if (rx.vx === 0) e.vx *= -1; // wall bounce

    // Edge detection: don't walk off platforms (only when grounded)
    if (e.onGround) {
      const probeX = e.vx > 0 ? e.x + e.w + 1 : e.x - 1;
      const edge = solidAt(probeX, e.y + e.h + 2, 2, 4);
      if (!edge) e.vx *= -1;
    }

    if (e.y > H + 100) { e.alive = false; return; }

    // ── Player collision
    if (!player.dead && player.invincible <= 0) {
      if (rectsOverlap(player.x, player.y + yo, player.w, ph, e.x, e.y, e.w, e.h)) {
        const pb = player.y + yo + ph, et = e.y + 4;
        if (player.vy > 0 && pb <= et + 18 && pb >= et - 18) {
          stompEnemy(e);
        } else if (power === 'star') {
          e.alive = false; addScore(200); addParticle(e.x + 14, e.y, '#f0d000', 0, -4);
        } else {
          playerDie();
        }
      }
    }
  });
}

function stompEnemy(e) {
  if (e.type === 'koopa' && !e.shell) {
    e.shell = true; e.vx = 0; e.shellVx = 0;
    player.vy = -6; addScore(400); addFloatText('400', e.x, e.y, '#fff'); return;
  }
  if (e.type === 'koopa' && e.shell) { e.shellVx = player.facing * 9; player.vy = -6; return; }
  e.stomped = true; e.stompTimer = 0; e.h = 8;
  player.vy = -6; addScore(100); addFloatText('100', e.x, e.y, '#fff');
  addParticle(e.x + 12, e.y, '#806020', 0, -2, 20);
}