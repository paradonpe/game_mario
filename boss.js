// ═══════════════════════════════════════════════════════════
//  boss.js  —  Boss creation, AI, projectiles, progression
//  To change boss behaviour, edit makeBoss / updateBoss.
//  To change attack patterns, edit fireProjectile().
// ═══════════════════════════════════════════════════════════

// ── Factory ─────────────────────────────────────────────────
function makeBoss(w) {
  const cfg = BOSS_CONFIGS[w], GH = 13;
  return {
    world: w, name: cfg.name,
    x: level.width / 2 + 60, y: (GH - 3) * TILE,
    w: 56, h: 56,
    hp: cfg.hp, maxHp: cfg.hp,
    vx: -1.2, vy: 0, onGround: false,
    phase: 1,                // 1 = normal, 2 = enraged (triggers at half HP)
    attackTimer: 0, attackInterval: 180,
    projectiles: [],
    hitFlash: 0,             // frames of white-flash immunity after being hit
    stunTimer: 0,            // brief pause after taking damage
    alive: true,
    animFrame: 0, animTick: 0,
    leapCooldown: 0,         // frames until the boss may leap again
    summonCooldown: 0,       // world-3 boss: frames between goomba summons
  };
}

// ── Main update ──────────────────────────────────────────────
function updateBoss(dt) {
  if (!boss || !boss.alive) return;
  const ph = pH(), yo = pYO();

  // Animation tick
  boss.animTick += dt;
  if (boss.animTick > 10) { boss.animFrame = (boss.animFrame + 1) % 4; boss.animTick = 0; }

  // Hit-flash & stun cooldowns
  if (boss.hitFlash > 0) boss.hitFlash -= dt;
  if (boss.stunTimer > 0) { boss.stunTimer -= dt; return; }

  // Phase 2 enrage at half HP
  if (boss.hp <= Math.ceil(boss.maxHp / 2) && boss.phase === 1) {
    boss.phase = 2;
    boss.vx *= 1.6;
    boss.attackInterval = 90;
    addFloatText('ENRAGED!', boss.x + 28, boss.y - 20, '#ff2020');
  }

  // Occasional leap toward the player
  boss.leapCooldown = Math.max(0, boss.leapCooldown - dt);
  if (boss.onGround && boss.leapCooldown <= 0 && Math.random() < 0.008 * boss.phase) {
    boss.vy = JUMP_FORCE * 1.1;
    boss.vx = (player.x > boss.x ? 1 : -1) * Math.abs(boss.vx) * 1.2;
    boss.leapCooldown = 80;
  }

  // Gravity + Y collision
  boss.vy = Math.min(boss.vy + GRAVITY, 14);
  const ry = moveY(boss.x, boss.y, boss.w, boss.h, boss.vy);
  boss.y = ry.py; boss.vy = ry.vy; boss.onGround = ry.onGround;

  // Horizontal movement + arena wall bounce
  const rx = moveX(boss.x, boss.y, boss.w, boss.h, boss.vx);
  boss.x = rx.px; if (rx.vx === 0) boss.vx *= -1;
  if (boss.x < 4)                       { boss.x = 4;                         boss.vx =  Math.abs(boss.vx); }
  if (boss.x + boss.w > level.width - 4){ boss.x = level.width - boss.w - 4;  boss.vx = -Math.abs(boss.vx); }

  // Timed projectile attack
  boss.attackTimer += dt;
  if (boss.attackTimer >= boss.attackInterval) { boss.attackTimer = 0; fireProjectile(); }

  // World-3 boss summons goombas
  if (boss.world === 3) {
    boss.summonCooldown = Math.max(0, (boss.summonCooldown || 220) - dt);
    if (boss.summonCooldown <= 0) {
      boss.summonCooldown = 220;
      level.enemies.push({
        type: 'goomba', x: boss.x + 20, y: (level.groundY - 2) * TILE,
        w: 28, h: 24, vx: -0.6, vy: 0, onGround: false,
        alive: true, stomped: false, stompTimer: 0,
        shell: false, shellVx: 0, animFrame: 0, animTick: 0,
      });
    }
  }

  // ── Update projectiles
  boss.projectiles = boss.projectiles.filter(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.22; p.life -= dt;
    if (p.y > H + 40 || p.life <= 0) return false;
    const sc = solidAt(p.x, p.y, p.w, p.h);
    if (sc) { p.vx *= -0.5; p.vy *= -0.7; }
    if (!player.dead && player.invincible <= 0) {
      if (rectsOverlap(player.x, player.y + yo, player.w, ph, p.x, p.y, p.w, p.h)) {
        playerDie(); return false;
      }
    }
    return true;
  });

  // ── Player stomps boss
  if (!player.dead && player.invincible <= 0) {
    if (rectsOverlap(player.x, player.y + yo, player.w, ph, boss.x, boss.y, boss.w, boss.h)) {
      const pb = player.y + yo + ph, bt = boss.y + 8;
      if (player.vy > 0 && pb <= bt + 22 && pb >= bt - 22) {
        damageBoss(); player.vy = -7;
      } else if (power === 'star') {
        damageBoss(); damageBoss(); player.vy = -7;
      } else {
        playerDie();
      }
    }
  }
}

// ── Attack patterns ──────────────────────────────────────────
// World 1: single aimed shot
// World 2: triple spread
// World 3: 5-way spread
function fireProjectile() {
  if (!boss) return;
  const ang = Math.atan2(player.y - boss.y, player.x + 12 - boss.x - 28);
  const spd = 3.5 + (boss.phase - 1) * 1.5;
  const spreads = boss.world === 1 ? [[0]]
                : boss.world === 2 ? [[-0.3], [0], [0.3]]
                :                    [[-0.5], [-0.25], [0], [0.25], [0.5]];
  spreads.forEach(([off]) => {
    boss.projectiles.push({
      x: boss.x + boss.w / 2 - 6, y: boss.y + boss.h / 2,
      vx: Math.cos(ang + off) * spd,
      vy: Math.sin(ang + off) * spd,
      w: 12, h: 12, life: 200, world: boss.world,
    });
  });
}

// ── Damage & defeat ──────────────────────────────────────────
function damageBoss() {
  if (!boss || boss.hitFlash > 0) return;
  boss.hp--; boss.hitFlash = 12; boss.stunTimer = 8;
  addScore(500); addFloatText('-1', boss.x + 28, boss.y - 10, '#fff');
  for (let i = 0; i < 8; i++)
    addParticle(boss.x + 28, boss.y + 20, BOSS_CONFIGS[boss.world].color,
      Math.random() * 8 - 4, -Math.random() * 6, 40);
  if (boss.hp <= 0) bossDefeated();
}

function bossDefeated() {
  boss.alive = false; STATE = 'bossWin'; bossWinTimer = 0;
  addScore(5000); addFloatText('BOSS DOWN! +5000', boss.x + 28, boss.y - 30, '#f0d000');
  for (let i = 0; i < 30; i++)
    addParticle(boss.x + 28, boss.y + 28, '#f0d000', Math.random() * 12 - 6, -Math.random() * 10, 80);
}

// ── World progression ────────────────────────────────────────
function checkFlag() {
  if (!level.flagX || level.isBossArena || STATE !== 'playing') return;
  if (player.x + player.w >= level.flagX && !player.dead && !levelClearFired) {
    levelClearFired = true;
    STATE = 'levelclear';
    addScore(1000); addFloatText('GOAL! +1000', player.x, player.y - 20, '#f0d000');
    for (let i = 0; i < 20; i++)
      addParticle(player.x, player.y, '#f0d000', Math.random() * 8 - 4, -Math.random() * 8, 60);
    setTimeout(nextLevel, 2500);
  }
}

function nextLevel() {
  levelClearFired = false;
  worldLevel++;
  if (worldLevel > 2) {
    // Move to the boss level
    worldLevel = 3;
    player = makePlayer(); power = 'small'; transformAnim = 0; camX = 0; timer = 300; timerLastTick = 0;
    level = buildBossLevel(world);
    boss = null;
    STATE = 'bossIntro'; bossIntroTimer = 0;
    updateHUD(); return;
  }
  player = makePlayer(); power = 'small'; transformAnim = 0; camX = 0; timer = 300; timerLastTick = 0;
  level = buildLevel(world, worldLevel);
  STATE = 'playing'; updateHUD();
}

function startBossBattle() { boss = makeBoss(world); STATE = 'boss'; }

function afterBossWin() {
  world++; worldLevel = 1;
  if (world > 3) {
    STATE = 'win';
    showMsg('YOU WIN!', 'The kingdom is saved! All 3 bosses defeated!', 'PRESS ENTER TO PLAY AGAIN');
    return;
  }
  player = makePlayer(); power = 'small'; transformAnim = 0; camX = 0; timer = 300; timerLastTick = 0;
  level = buildLevel(world, worldLevel); boss = null;
  STATE = 'playing'; updateHUD();
}

// ── Camera, HUD, timer helpers ───────────────────────────────
function updateCamera() {
  const t = player.x - W / 3;
  camX += (t - camX) * 0.12;
  camX = Math.max(0, Math.min(level.width - W, camX));
}

function addScore(v) { score += v; updateHUD(); }
function addFloatText(t, x, y, c) { floatingTexts.push({ text: t, x, y, color: c, life: 55, vy: -1.5 }); }
function addParticle(x, y, c, vx, vy, life = 30) {
  particles.push({ x, y, color: c, vx: vx || 0, vy: vy || 0, life, maxLife: life, size: 4 });
}

function updateHUD() {
  document.getElementById('h-score').textContent = String(score).padStart(6, '0');
  document.getElementById('h-coins').textContent = 'x' + String(coins).padStart(2, '0');
  document.getElementById('h-world').textContent = worldLevel === 3 ? world + '-B' : world + '-' + worldLevel;
  document.getElementById('h-lives').textContent = 'x' + lives;
  document.getElementById('h-power').textContent = power.toUpperCase();
}

function tickTimer(ts) {
  if (ts - timerLastTick > 1000) {
    timerLastTick = ts; timer--;
    document.getElementById('h-time').textContent = timer;
    if (timer <= 0) playerDie();
  }
}
