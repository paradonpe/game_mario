// ═══════════════════════════════════════════════════════════
//  main.js  —  Game loop, input, UI messages, boot
//  This is the entry point. It ties all other modules together.
//  Edit STATE transitions here; edit visuals in draw.js, etc.
// ═══════════════════════════════════════════════════════════

// ── Main loop ────────────────────────────────────────────────
let lastTS = 0;

function loop(ts) {
  const dt = Math.min((ts - lastTS) / 16.67, 3);
  lastTS = ts;
  ctx.clearRect(0, 0, W, H);
  if (level) drawBg();

  // ── Boss intro cutscene
  if (STATE === 'bossIntro') {
    bossIntroTimer += dt;
    if (level) {
      drawTiles(); drawItems();
      level.enemies.forEach(drawEnemy);
      drawPlayer(); drawParticles(); drawFloatingTexts();
    }
    drawBossIntro();
    if (bossIntroTimer > 200) startBossBattle();

  // ── Active boss battle / boss-win cooldown
  } else if (STATE === 'boss' || STATE === 'bossWin') {
    tickTimer(ts);
    if (transformAnim > 0) transformAnim = Math.max(0, transformAnim - dt);

    if (STATE === 'boss') {
      updatePlayer(dt);
      updateEnemies(dt);
      updateItems(dt);
      updateBoss(dt);
    }
    if (STATE === 'bossWin') {
      bossWinTimer += dt;
      updatePlayer(dt); // still let the player move during victory
    }

    updateCamera();
    drawTiles(); drawItems();
    level.enemies.forEach(drawEnemy);
    drawBoss(); drawPlayer(); drawParticles(); drawFloatingTexts();

    if (STATE === 'bossWin') {
      ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#f0d000'; ctx.font = 'bold 36px Courier New';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('BOSS DEFEATED!', W / 2, H / 2 - 20);
      ctx.fillStyle = '#fff'; ctx.font = '18px Courier New';
      ctx.fillText('+5000 pts', W / 2, H / 2 + 20);
      if (bossWinTimer > 160) afterBossWin();
    }

  // ── Normal play / level-clear freeze
  } else if (STATE === 'playing' || STATE === 'levelclear') {
    tickTimer(ts);
    if (transformAnim > 0) transformAnim = Math.max(0, transformAnim - dt);

    if (STATE === 'playing') {
      updatePlayer(dt);
      updateEnemies(dt);
      updateItems(dt);
      checkFlag();
    }

    updateCamera();
    drawTiles(); drawFlag(); drawItems();
    level.enemies.forEach(drawEnemy);
    drawCoins(); drawPlayer(); drawParticles(); drawFloatingTexts();

    if (STATE === 'levelclear') {
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 36px Courier New';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('COURSE CLEAR!', W / 2, H / 2);
      ctx.fillStyle = '#f0d000'; ctx.font = '20px Courier New';
      ctx.fillText('SCORE: ' + score, W / 2, H / 2 + 50);
    }
  }

  requestAnimationFrame(loop);
}

// ── UI message helpers ───────────────────────────────────────
function showMsg(title, sub, hint) {
  const box = document.getElementById('msg-box');
  document.getElementById('msg-title').textContent = title;
  document.getElementById('msg-sub').textContent   = sub;
  document.getElementById('msg-hint').textContent  = hint;
  box.style.display = 'block';
  document.getElementById('overlay').style.pointerEvents = 'all';
}
function hideMsg() {
  document.getElementById('msg-box').style.display = 'none';
  document.getElementById('overlay').style.pointerEvents = 'none';
}

// ── Input ────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  keys[e.code] = true;

  // Start / restart from title, game-over, or win screens
  if (
    (e.code === 'Enter' || e.code === 'Space') &&
    (STATE === 'title' || STATE === 'gameover' || STATE === 'win')
  ) {
    e.preventDefault();
    score = 0; coins = 0; lives = 3; timer = 300;
    world = 1; worldLevel = 1;
    power = 'small'; prevPower = 'small'; transformAnim = 0;
    timerLastTick = 0;
    boss = null; particles = []; floatingTexts = [];
    levelClearFired = false;
    player = makePlayer(); camX = 0;
    level  = buildLevel(1, 1);
    STATE  = 'playing';
    hideMsg(); updateHUD();
  }

  // Prevent arrow/space scroll on the page
  if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))
    e.preventDefault();
});

document.addEventListener('keyup', e => { keys[e.code] = false; });

// ── Boot ─────────────────────────────────────────────────────
player = makePlayer();
level  = buildLevel(1, 1);
updateHUD();
showMsg(
  'SUPER ADVENTURE',
  '6 Levels  ·  3 Boss Battles  ·  3 Worlds',
  'PRESS ENTER OR SPACE TO START'
);
requestAnimationFrame(loop);
