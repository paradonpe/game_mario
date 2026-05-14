// ═══════════════════════════════════════════════════════════
//  draw.js  —  All rendering functions
//  Background themes: normal | cave | paradise | night | lava | boss1 | boss2 | boss3
// ═══════════════════════════════════════════════════════════

// ── Background dispatcher ────────────────────────────────────
function drawBg() {
  const th = level.theme;
  if      (th === 'paradise') drawBgParadise();
  else if (th === 'cave')     drawBgCave();
  else if (th === 'night')    drawBgNight();
  else if (th === 'lava')     drawBgLava();
  else if (th === 'boss1')    drawBgBoss1();
  else if (th === 'boss2')    drawBgBoss2();
  else if (th === 'boss3')    drawBgBoss3();
  else                        drawBgNormal();
}

// ── Background themes ────────────────────────────────────────
function drawBgNormal() {
  ctx.fillStyle = '#5c94fc'; ctx.fillRect(0, 0, W, H);
  const cx = [80,260,480,650,900,1100,1400,1700];
  const sz = [80,100, 70, 90, 80, 110, 85, 95];
  const cy = [60, 45, 70, 50, 65,  48, 60, 52];
  cx.forEach((x, i) => drawCloud(x - camX * 0.2, cy[i], sz[i]));
  [120, 350, 600, 900, 1200].forEach((x, i) => drawHill(x - camX * 0.5, H - TILE * 2, [80, 60, 90, 70, 85][i]));
  [200, 420, 680].forEach(x => drawBush(x - camX * 0.7, H - TILE * 2 - 10));
}

function drawBgCave() {
  ctx.fillStyle = '#1a1020'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#3a2050';
  for (let i = 0; i < 16; i++) {
    const x = (i * 90 - camX * 0.1 + 400) % (W + 120) - 60;
    const h = 20 + Math.sin(i * 1.7) * 15;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 14, h); ctx.lineTo(x + 28, 0); ctx.fill();
  }
  const t = Date.now() / 1200;
  for (let i = 0; i < 18; i++) {
    const cx = (i * 130 + 50 - camX * 0.15) % (W + 200) - 100;
    const cy = H * 0.3 + Math.sin(i * 0.9 + t) * 60;
    ctx.globalAlpha = 0.3 + Math.sin(t + i) * 0.2;
    ctx.fillStyle = i % 3 === 0 ? '#a060ff' : i % 3 === 1 ? '#00d8ff' : '#ff60d0';
    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawBgNight() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#05002a'); g.addColorStop(1, '#1a0850');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const t = Date.now() / 3000;
  for (let i = 0; i < 50; i++) {
    const sx = ((i * 173 + 40) - camX * 0.05) % (W + 200) - 100;
    const sy = (i * 71) % 130 + 10;
    ctx.globalAlpha = 0.4 + Math.sin(t * 2 + i) * 0.3;
    ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#ffffd0'; ctx.beginPath(); ctx.arc(W * 0.8 - camX * 0.02, 60, 32, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a0850'; ctx.beginPath(); ctx.arc(W * 0.8 - camX * 0.02 + 10, 56, 26, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0a0438';
  [100, 300, 550, 800, 1050].forEach((x, i) => {
    const r = [80, 60, 100, 70, 90][i];
    ctx.beginPath(); ctx.arc(x - camX * 0.4, H - TILE * 2, r, Math.PI, 0); ctx.fill();
  });
}

function drawBgLava() {
  ctx.fillStyle = '#180800'; ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, 0, 60);
  g.addColorStop(0, 'rgba(255,80,0,0.4)'); g.addColorStop(1, 'rgba(255,80,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 60);
  const t = Date.now() / 800;
  for (let i = 0; i < 12; i++) {
    const bx = ((i * 120 + 60 - camX * 0.3) + W + 200) % (W + 200) - 100;
    const by = H - TILE * 1.8 + Math.sin(t + i) * 8;
    ctx.globalAlpha = 0.6 + Math.sin(t * 1.5 + i) * 0.2;
    ctx.fillStyle = i % 2 === 0 ? '#ff4000' : '#ff8000';
    ctx.beginPath(); ctx.arc(bx, by, 14 + Math.sin(t + i * 0.5) * 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#2a0a00';
  [80, 240, 460, 680, 920].forEach((x, i) => {
    const r = [50, 40, 65, 45, 55][i % 5];
    ctx.beginPath(); ctx.arc(x - camX * 0.45, H - TILE * 2, r, Math.PI, 0); ctx.fill();
  });
}

function drawBgBoss1() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#001a00'); g.addColorStop(1, '#003800');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (Math.floor(Date.now() / 400) % 7 === 0) { ctx.fillStyle = 'rgba(255,255,200,0.04)'; ctx.fillRect(0, 0, W, H); }
  for (let i = 0; i < W / 32 + 2; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,200,0,0.07)' : 'transparent';
    ctx.fillRect(i * 32, H - 80, 32, 80);
  }
}

function drawBgBoss2() {
  ctx.fillStyle = '#200000'; ctx.fillRect(0, 0, W, H);
  const t = Date.now() / 500;
  const g = ctx.createRadialGradient(W / 2, H, 20, W / 2, H, 300);
  g.addColorStop(0, 'rgba(255,' + (60 + Math.sin(t) * 20 | 0) + ',0,0.4)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 20; i++) {
    const ex = ((i * 97 + Date.now() / 30) % (W + 100)) - 50;
    const ey = H - 80 - ((Date.now() / 10 + i * 40) % H);
    ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 300 + i) * 0.3;
    ctx.fillStyle = i % 2 === 0 ? '#ff6000' : '#ffcc00'; ctx.fillRect(ex, ey, 3, 3);
  }
  ctx.globalAlpha = 1;
}

function drawBgBoss3() {
  ctx.fillStyle = '#000010'; ctx.fillRect(0, 0, W, H);
  const t = Date.now() / 2000;
  for (let r = 0; r < 5; r++) {
    ctx.strokeStyle = 'rgba(' + (80 + r * 30) + ',0,' + (160 + r * 20) + ',' + (0.15 + r * 0.04) + ')';
    ctx.lineWidth = 3; ctx.beginPath();
    for (let a = 0, first = true; a < Math.PI * 2; a += 0.05) {
      const rad = 50 + r * 40 + Math.sin(a * 3 + t) * 20;
      const x = W / 2 + rad * Math.cos(a + t * (r % 2 === 0 ? 1 : -1));
      const y = H / 2 + rad * Math.sin(a + t * (r % 2 === 0 ? 1 : -1)) * 0.4;
      first ? (ctx.moveTo(x, y), first = false) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.lineWidth = 1;
}

// ── Background decoration helpers ────────────────────────────
function drawCloud(x, y, sz) {
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(x,        y,          sz / 2,   sz / 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x - sz/4, y + sz/8,   sz / 3.5, sz / 4.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + sz/4, y + sz/8,   sz / 3.5, sz / 4.5, 0, 0, Math.PI * 2); ctx.fill();
}
function drawHill(x, y, r) {
  ctx.fillStyle = '#00a000'; ctx.beginPath(); ctx.arc(x, y, r, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#00b800'; ctx.beginPath(); ctx.arc(x, y - r + 12, r / 3, 0, Math.PI * 2); ctx.fill();
}
function drawBush(x, y) {
  ctx.fillStyle = '#00a000';
  ctx.beginPath(); ctx.ellipse(x,      y,   28, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x - 22, y+4, 18, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 22, y+4, 18, 14, 0, 0, Math.PI * 2); ctx.fill();
}

// ── Paradise background ───────────────────────────────────────
function drawBgParadise() {
  const g = ctx.createLinearGradient(0, 0, 0, H * 0.65);
  g.addColorStop(0, '#00b4ff'); g.addColorStop(0.5, '#40d8ff'); g.addColorStop(1, '#ffe090');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  const waterY = H - TILE * 3.5;
  const wg = ctx.createLinearGradient(0, waterY, 0, H - TILE * 2);
  wg.addColorStop(0, 'rgba(0,180,255,0.55)'); wg.addColorStop(1, 'rgba(0,120,200,0.3)');
  ctx.fillStyle = wg; ctx.fillRect(0, waterY, W, TILE * 1.5);
  const t = Date.now() / 600;
  for (let i = 0; i < 12; i++) {
    const wx = ((i * 120 - camX * 0.15 + Math.sin(t + i) * 20) % (W + 200)) - 100;
    ctx.globalAlpha = 0.35 + Math.sin(t * 1.5 + i) * 0.15;
    ctx.fillStyle = '#fff'; ctx.fillRect(wx, waterY + 6 + Math.sin(t + i * 0.8) * 3, 40, 3);
  }
  ctx.globalAlpha = 1;

  [100, 340, 600, 900, 1200, 1600].forEach((x, i) => {
    const sz = [90, 110, 75, 95, 85, 100][i];
    const cy = [55,  40, 65, 50, 60,  45][i];
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.ellipse(x - camX * 0.18, cy, sz / 2, sz / 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,230,220,0.7)';
    ctx.beginPath(); ctx.ellipse(x - camX * 0.18 - sz/4, cy + sz/8, sz/3.5, sz/4.5, 0, 0, Math.PI * 2); ctx.fill();
  });

  level.palms.forEach(px => drawPalmTree(px * TILE - camX * 0.6, H - TILE * 2 - 30));

  ctx.fillStyle = '#f0c060';
  [150, 450, 750, 1100].forEach((x, i) => {
    ctx.beginPath();
    ctx.ellipse(x - camX * 0.5, H - TILE * 2 + 10, [80,100,70,90][i], [30,25,28,22][i], 0, Math.PI, 0);
    ctx.fill();
  });
}

function drawPalmTree(x, baseY) {
  ctx.strokeStyle = '#8b5e1a'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(x, baseY); ctx.quadraticCurveTo(x + 10, baseY - 40, x + 5, baseY - 80); ctx.stroke();
  ctx.lineWidth = 1; ctx.fillStyle = '#a06a20';
  for (let i = 0; i < 5; i++) ctx.fillRect(x - 1 + i * 2.5 - 4, baseY - 15 - i * 15, 6, 4);
  const lx = x + 5, ly = baseY - 80;
  ctx.strokeStyle = '#1a8a00'; ctx.lineWidth = 5;
  [[-40,-18,35,-30],[30,-20,40,-32],[-15,-38,10,-55],[20,-35,-10,-54],[-30,-10,-50,-5]]
    .forEach(([dx1,dy1,dx2,dy2]) => {
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.quadraticCurveTo(lx+dx1, ly+dy1, lx+dx2, ly+dy2); ctx.stroke();
    });
  ctx.lineWidth = 1; ctx.fillStyle = '#a05010';
  ctx.beginPath(); ctx.arc(lx - 5, ly + 4, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(lx + 6, ly + 6, 5, 0, Math.PI * 2); ctx.fill();
}

// ── Tiles & Q-blocks ─────────────────────────────────────────
function drawTiles() {
  level.tiles.forEach(t => {
    const sx = t.x * TILE - camX, sy = t.y * TILE;
    if (sx < -TILE || sx > W + TILE) return;
    const bump = t.bumpAnim > 0 ? -(t.bumpAnim * 1.5) : 0;
    if (t.bumpAnim > 0) t.bumpAnim--;
    ctx.save(); ctx.translate(sx, sy + bump); drawTileGfx(t); ctx.restore();
  });

  level.qblocks.forEach(q => {
    const sx = q.tx * TILE - camX, sy = q.ty * TILE;
    if (sx < -TILE || sx > W + TILE) return;
    const bump = q.anim > 0 ? -q.anim * 2 : 0;
    if (q.anim > 0) q.anim--;
    ctx.save(); ctx.translate(sx, sy + bump); drawQBlock(q.hit, q.item); ctx.restore();
  });

  // Box-heading badges above every unhit Q-block
  level.qblocks.filter(q => !q.hit).forEach(q => {
    const sx = q.tx * TILE - camX + TILE / 2, sy = q.ty * TILE - 22;
    if (sx < -32 || sx > W + 32) return;
    ctx.save();
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath(); ctx.roundRect(sx - 14, sy - 10, 28, 20, 4); ctx.fill();
    ctx.globalAlpha = 1;
    if (q.item === 'coin') {
      ctx.fillStyle = '#f0b000'; ctx.beginPath(); ctx.arc(sx, sy + 1, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd060'; ctx.beginPath(); ctx.arc(sx - 1, sy, 3, 0, Math.PI * 2); ctx.fill();
    } else if (q.item === 'mushroom') {
      ctx.fillStyle = '#e02020'; ctx.beginPath(); ctx.arc(sx, sy - 1, 7, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#fca044'; ctx.fillRect(sx - 5, sy + 3, 10, 6);
    } else if (q.item === 'star') {
      ctx.fillStyle = 'hsl(' + (Date.now() / 60 % 360) + ',100%,60%)';
      ctx.font = '13px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('★', sx, sy + 1);
    }
    ctx.restore();
  });

  // Paradise coral accents
  if (level.theme === 'paradise') {
    level.coral.forEach(c => {
      const sx = c.tx * TILE - camX;
      if (sx < -TILE || sx > W + TILE) return;
      drawCoral(sx + TILE / 2, level.groundY * TILE, c.col);
    });
  }
}

function drawTileGfx(t) {
  const th  = level.theme;
  const par = th === 'paradise', lav = th === 'lava', cav = th === 'cave', nit = th === 'night';

  if (t.type === 'groundTop') {
    const col  = par ? '#f0c060' : lav ? '#5a1500' : cav ? '#3a2860' : nit ? '#1a3a70' : '#e8783c';
    const dark = par ? '#d8a040' : lav ? '#8a2000' : cav ? '#2a1840' : nit ? '#102860' : '#c84c0c';
    const lite = par ? '#ffe090' : lav ? '#c03000' : cav ? '#5040a0' : nit ? '#304090' : '#a03808';
    ctx.fillStyle = col;  ctx.fillRect(0, 0, TILE, TILE);
    ctx.fillStyle = dark; ctx.fillRect(0, 10, TILE, TILE - 10);
    ctx.fillStyle = lite; for (let i = 0; i < 4; i++) ctx.fillRect(4 + i * 8, 4, 4, 3);

  } else if (t.type === 'ground') {
    const col  = par ? '#d8a040' : lav ? '#3a0800' : cav ? '#2a1840' : nit ? '#0e2050' : '#c84c0c';
    const dark = par ? '#b88020' : lav ? '#1a0400' : cav ? '#1a0c30' : nit ? '#081840' : '#a03808';
    ctx.fillStyle = col;  ctx.fillRect(0, 0, TILE, TILE);
    ctx.fillStyle = dark; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) ctx.fillRect(4 + i*8, 3 + j*8, 3, 2);

  } else if (t.type === 'brick') {
    const col  = par ? '#ff8860' : lav ? '#8a1800' : cav ? '#4a3880' : nit ? '#2a4888' : '#c84c0c';
    const dark = par ? '#cc5030' : lav ? '#5a0800' : cav ? '#2a1850' : nit ? '#183060' : '#7a2800';
    const lite = par ? '#ffb090' : lav ? '#c04020' : cav ? '#7060c0' : nit ? '#4060b0' : '#e07040';
    ctx.fillStyle = col; ctx.fillRect(0, 0, TILE, TILE);
    ctx.fillStyle = dark;
    ctx.fillRect(0, TILE/2-1, TILE, 2);   ctx.fillRect(TILE/2-1, 0, 2, TILE/2-1);
    ctx.fillRect(TILE/4-1, TILE/2+1, 2, TILE/2-1); ctx.fillRect(3*TILE/4-1, TILE/2+1, 2, TILE/2-1);
    ctx.fillStyle = lite;
    ctx.fillRect(1, 1, TILE/2-4, TILE/2-3); ctx.fillRect(TILE/2+2, 1, TILE/2-4, TILE/2-3);

  } else if (t.type === 'pipeTop' && t.left) {
    ctx.fillStyle = '#00a800'; ctx.fillRect(-2, 0, TILE + 2, TILE);
    ctx.fillStyle = '#006000'; ctx.fillRect(-2, 0, 4, TILE);
    ctx.fillStyle = '#00d000'; ctx.fillRect( 8, 4, 6, TILE - 8);
    ctx.fillStyle = '#004800'; ctx.fillRect(TILE - 2, 0, 4, TILE);

  } else if (t.type === 'pipeBody' && t.left) {
    ctx.fillStyle = '#00a800'; ctx.fillRect(-2, 0, TILE + 2, TILE);
    ctx.fillStyle = '#006000'; ctx.fillRect(-2, 0, 3, TILE);
    ctx.fillStyle = '#00d000'; ctx.fillRect( 8, 4, 5, TILE - 8);
    ctx.fillStyle = '#004800'; ctx.fillRect(TILE - 2, 0, 3, TILE);
  }
}

function drawQBlock(hit, item) {
  const par = level.theme === 'paradise';
  if (hit) {
    ctx.fillStyle = par ? '#607060' : '#806020'; ctx.fillRect(0, 0, TILE, TILE);
    ctx.fillStyle = par ? '#405040' : '#604000'; ctx.fillRect(2, 2, TILE - 4, TILE - 4);
    return;
  }
  if (par) {
    ctx.fillStyle = '#00c8b8'; ctx.fillRect(0, 0, TILE, TILE);
    ctx.fillStyle = '#60ffe8'; ctx.fillRect(2, 2, TILE - 4, 6);
    ctx.fillStyle = '#008878'; ctx.fillRect(2, TILE - 8, TILE - 4, 6);
  } else {
    ctx.fillStyle = '#e8a000'; ctx.fillRect(0, 0, TILE, TILE);
    ctx.fillStyle = '#ffd060'; ctx.fillRect(2, 2, TILE - 4, 6);
    ctx.fillStyle = '#a06000'; ctx.fillRect(2, TILE - 8, TILE - 4, 6);
  }
  ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Courier New';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('?', TILE / 2, TILE / 2 + 1);
}

function drawCoral(cx, baseY, color) {
  const t = Date.now() / 1800;
  ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, baseY); ctx.lineTo(cx, baseY - 18); ctx.stroke();
  [[cx, baseY-10, cx-9, baseY-22, cx-14, baseY-30],
   [cx, baseY-13, cx+8, baseY-24, cx+13, baseY-31]].forEach(([x1,y1,x2,y2,x3,y3]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 + Math.sin(t) * 1.5, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2 + Math.sin(t) * 1.5, y2); ctx.lineTo(x3, y3); ctx.stroke();
  });
  ctx.fillStyle = color;
  [[cx, baseY-18],[cx-14, baseY-30],[cx+13, baseY-31]].forEach(([x, y]) => {
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });
  ctx.lineWidth = 1; ctx.lineCap = 'butt';
}

// ── Goal flag ────────────────────────────────────────────────
function drawFlag() {
  if (!level.flagX) return;
  const fx = level.flagX - camX;
  if (fx < -20 || fx > W + 20) return;
  if (level.theme === 'paradise') {
    ctx.fillStyle = '#d0d0d0'; ctx.fillRect(fx, H - TILE * 13, 4, TILE * 12);
    ctx.fillStyle = '#ff3060';
    ctx.beginPath(); ctx.moveTo(fx+4,H-TILE*13); ctx.lineTo(fx+28,H-TILE*12.4); ctx.lineTo(fx+4,H-TILE*11.8); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(fx+4,H-TILE*12.6); ctx.lineTo(fx+28,H-TILE*12.0); ctx.lineTo(fx+4,H-TILE*11.4); ctx.fill();
    ctx.fillStyle = '#f0b000'; ctx.beginPath(); ctx.arc(fx + 2, H - TILE * 13, 6, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = '#888'; ctx.fillRect(fx, H - TILE * 13, 4, TILE * 12);
    ctx.fillStyle = '#00a000'; ctx.fillRect(fx + 4, H - TILE * 13, 22, 15);
    ctx.fillStyle = '#00c000'; ctx.fillRect(fx + 4, H - TILE * 13, 22,  7);
    ctx.fillStyle = '#f0b000'; ctx.beginPath(); ctx.arc(fx + 2, H - TILE * 13, 6, 0, Math.PI * 2); ctx.fill();
  }
}

// ── Enemies ──────────────────────────────────────────────────
function drawEnemy(e) {
  if (!e.alive) return;
  const sx = e.x - camX, sy = e.y;
  if (sx < -TILE * 2 || sx > W + TILE * 2) return;
  if (e.type === 'goomba') drawGoomba(sx, sy, e);
  if (e.type === 'koopa')  drawKoopa(sx, sy, e);
}
function drawGoomba(sx, sy, e) {
  const h = e.stomped ? 8 : e.h;
  ctx.fillStyle = '#c07020'; ctx.fillRect(sx, sy + e.h - h, e.w, h);
  if (e.stomped) return;
  ctx.fillStyle = '#fff'; ctx.fillRect(sx+4,sy+4,8,8); ctx.fillRect(sx+16,sy+4,8,8);
  ctx.fillStyle = '#000'; ctx.fillRect(sx+5,sy+6,4,4); ctx.fillRect(sx+17,sy+6,4,4);
  ctx.fillRect(sx+3,sy+3,8,2); ctx.fillRect(sx+17,sy+3,8,2);
  const f = e.animFrame;
  ctx.fillStyle = '#7a2800';
  ctx.fillRect(sx+(f?2:6),sy+e.h-8,10,8); ctx.fillRect(sx+(f?16:12),sy+e.h-8,10,8);
}
function drawKoopa(sx, sy, e) {
  if (e.shell) {
    ctx.fillStyle = '#f0b000'; ctx.fillRect(sx, sy+4, 28, 24);
    ctx.fillStyle = '#c09000'; ctx.fillRect(sx+4, sy+8, 20, 16);
    ctx.fillStyle = '#008000'; ctx.fillRect(sx+12,sy+4,4,24); ctx.fillRect(sx,sy+16,28,4);
    return;
  }
  ctx.fillStyle = '#00a000'; ctx.fillRect(sx+2,sy+8,24,20);
  ctx.fillStyle = '#f0b000'; ctx.fillRect(sx+4,sy+10,20,16);
  ctx.fillStyle = '#00c000'; ctx.fillRect(sx+6,sy,16,16);
  ctx.fillStyle = '#fff'; ctx.fillRect(sx+8,sy+4,8,6); ctx.fillRect(sx+18,sy+4,5,6);
  ctx.fillStyle = '#000'; ctx.fillRect(sx+10,sy+6,4,4); ctx.fillRect(sx+19,sy+6,3,4);
  const f = e.animFrame;
  ctx.fillStyle = '#008000';
  ctx.fillRect(sx+(f?0:4),sy+26,10,10); ctx.fillRect(sx+(f?18:14),sy+26,10,10);
}

// ── Items ────────────────────────────────────────────────────
function drawItems() {
  level.items.forEach(item => {
    const sx = item.x - camX;
    if (item.type === 'mushroom') drawMushroom(sx, item.y);
    if (item.type === 'star')     drawStar(sx, item.y);
  });
}
function drawMushroom(sx, sy) {
  ctx.fillStyle = '#e02020'; ctx.beginPath(); ctx.arc(sx+12, sy+8, 14, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#fff';    ctx.fillRect(sx+3,sy+4,6,6); ctx.fillRect(sx+15,sy+4,6,6);
  ctx.fillStyle = '#fca044'; ctx.fillRect(sx+2,sy+12,20,12);
  ctx.fillStyle = '#d08030'; ctx.fillRect(sx+2,sy+20,8,4); ctx.fillRect(sx+14,sy+20,8,4);
}
function drawStar(sx, sy) {
  ctx.fillStyle = 'hsl(' + (Date.now() / 200 * 30 % 360) + ',100%,60%)';
  ctx.font = '28px serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText('★', sx, sy);
}

// ── Player ───────────────────────────────────────────────────
function drawPlayer() {
  const p = player;
  const ph = pH(), yo = pYO();
  const sx = p.x - camX, sy = p.y + yo;

  if (p.dead) { ctx.save(); ctx.translate(sx+12, sy+12); ctx.rotate(Date.now()/200); ctx.translate(-12,-12); }
  if (p.invincible > 0 && Math.floor(Date.now() / 80) % 2 === 0 && !p.dead) return;

  ctx.save();
  // Mushroom transform scale animation
  if (transformAnim > 0) {
    const prog = transformAnim / 30, growing = power === 'big' || power === 'star';
    const pulse = 1 + Math.sin(prog * Math.PI * 4) * 0.18 * prog;
    const sY = growing ? (0.6 + 0.4 * (1-prog)) * pulse : (1.4 - 0.4 * (1-prog)) * pulse;
    const sX = growing ? (1.4 - 0.4 * (1-prog)) * pulse : (0.6 + 0.4 * (1-prog)) * pulse;
    const cx = sx + p.w / 2, cy = sy + ph / 2;
    ctx.translate(cx, cy); ctx.scale(sX, sY); ctx.translate(-cx, -cy);
  }
  if (p.facing === -1) { ctx.translate(sx + p.w, sy); ctx.scale(-1, 1); } else ctx.translate(sx, sy);
  if (power === 'small') drawMarioSmall(p.animFrame, p.starTimer > 0);
  else                   drawMarioBig(p.animFrame, p.starTimer > 0);
  ctx.restore();
  if (p.dead) ctx.restore();
}
function drawMarioSmall(frame, star) {
  const col = star ? 'hsl(' + (Date.now()/50%360) + ',100%,55%)' : '#e04000';
  ctx.fillStyle = col; ctx.fillRect(4,0,18,7); ctx.fillRect(0,5,24,4);
  ctx.fillStyle = '#fca044'; ctx.fillRect(2,8,20,10);
  ctx.fillStyle = '#000';    ctx.fillRect(14,9,4,4);
  ctx.fillStyle = '#5a3010'; ctx.fillRect(6,14,14,3);
  ctx.fillStyle = '#2040c0'; ctx.fillRect(2,17,20,10);
  ctx.fillStyle = col;       ctx.fillRect(6,16,12,4);
  ctx.fillStyle = '#3a2000';
  if (frame===1||frame===3) { ctx.fillRect(0,25,12,6); ctx.fillRect(12,23,10,8); }
  else if (frame===2)       { ctx.fillRect(4,25,14,6); }
  else                      { ctx.fillRect(2,25,10,6); ctx.fillRect(14,24,10,7); }
}
function drawMarioBig(frame, star) {
  const col = star ? 'hsl(' + (Date.now()/50%360) + ',100%,55%)' : '#e04000';
  ctx.fillStyle = col; ctx.fillRect(4,0,18,8); ctx.fillRect(0,6,24,4);
  ctx.fillStyle = '#fca044'; ctx.fillRect(2,9,20,12);
  ctx.fillStyle = '#000';    ctx.fillRect(14,11,4,4);
  ctx.fillStyle = '#5a3010'; ctx.fillRect(6,17,14,3);
  ctx.fillStyle = '#2040c0'; ctx.fillRect(2,21,20,13);
  ctx.fillStyle = col;       ctx.fillRect(6,20,12,5);
  ctx.fillStyle = '#fff';    ctx.fillRect(10,24,4,4); ctx.fillRect(10,29,4,4);
  ctx.fillStyle = '#3a2000';
  if (frame===1||frame===3) { ctx.fillRect(0,32,12,8); ctx.fillRect(14,30,10,10); }
  else if (frame===2)       { ctx.fillRect(4,32,14,8); }
  else                      { ctx.fillRect(2,32,10,8); ctx.fillRect(14,31,10,9); }
}

// ── Boss rendering ───────────────────────────────────────────
function drawBoss() {
  if (!boss) return;
  const sx = boss.x - camX, sy = boss.y;

  // White flash on hit
  if (boss.hitFlash > 0 && Math.floor(boss.hitFlash) % 2 === 0) {
    ctx.globalAlpha = 0.6; ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, boss.w, boss.h); ctx.globalAlpha = 1; return;
  }

  if      (boss.world === 1) drawBossKingGoomba(sx, sy);
  else if (boss.world === 2) drawBossLavaKoopa(sx, sy);
  else                       drawBossShadow(sx, sy);

  // Projectiles
  boss.projectiles.forEach(p => {
    const px = p.x - camX, py = p.y;
    if (p.world === 1) {
      ctx.fillStyle = '#806020'; ctx.beginPath(); ctx.arc(px+6,py+6,6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#c09030'; ctx.beginPath(); ctx.arc(px+4,py+4,3,0,Math.PI*2); ctx.fill();
    } else if (p.world === 2) {
      ctx.fillStyle = '#ff4000'; ctx.beginPath(); ctx.arc(px+6,py+6,6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffcc00'; ctx.beginPath(); ctx.arc(px+4,py+4,3,0,Math.PI*2); ctx.fill();
    } else {
      ctx.fillStyle = 'hsl(' + (Date.now()/100*30%360) + ',100%,50%)';
      ctx.beginPath(); ctx.arc(px+6,py+6,6,0,Math.PI*2); ctx.fill();
    }
  });

  // HP bar
  const bw = 220, bx = (W - bw) / 2, by = 12;
  ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(bx - 4, by - 4, bw + 8, 22);
  ctx.fillStyle = '#500'; ctx.fillRect(bx, by, bw, 14);
  const hf = boss.hp / boss.maxHp;
  ctx.fillStyle = hf > 0.5 ? '#00e000' : hf > 0.25 ? '#e0e000' : '#e00000';
  ctx.fillRect(bx, by, bw * hf, 14);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Courier New';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(boss.name + '  ' + boss.hp + '/' + boss.maxHp, bx + bw / 2, by + 7);
}

function drawBossKingGoomba(sx, sy) {
  const f = boss.animFrame % 2;
  ctx.fillStyle = '#a06018'; ctx.fillRect(sx+2,sy+16,52,36);
  ctx.fillStyle = '#7a2800';
  ctx.fillRect(sx+(f?2:8),sy+46,18,12); ctx.fillRect(sx+(f?32:26),sy+46,18,12);
  ctx.fillStyle = '#fff';  ctx.fillRect(sx+6,sy+18,14,14); ctx.fillRect(sx+34,sy+18,14,14);
  ctx.fillStyle = '#000';  ctx.fillRect(sx+8,sy+21,8,8);   ctx.fillRect(sx+36,sy+21,8,8);
  ctx.fillStyle = '#000';  ctx.fillRect(sx+4,sy+16,16,3);   ctx.fillRect(sx+34,sy+16,16,3);
  ctx.fillStyle = '#f0c000'; ctx.fillRect(sx+8,sy+4,38,10);
  ctx.fillRect(sx+8,sy,8,8); ctx.fillRect(sx+22,sy-4,10,12); ctx.fillRect(sx+38,sy,8,8);
  ctx.fillStyle = '#ff4060'; ctx.beginPath(); ctx.arc(sx+12,sy+8,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#40c0ff'; ctx.beginPath(); ctx.arc(sx+27,sy+4,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ff4060'; ctx.beginPath(); ctx.arc(sx+42,sy+8,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#400'; ctx.fillRect(sx+14,sy+34,24,6);
  ctx.fillStyle = '#fff'; ctx.fillRect(sx+15,sy+34,5,6); ctx.fillRect(sx+32,sy+34,5,6);
}

function drawBossLavaKoopa(sx, sy) {
  const f = boss.animFrame % 2;
  ctx.fillStyle = '#cc2200'; ctx.fillRect(sx+2,sy+14,52,34);
  ctx.fillStyle = '#882000'; ctx.fillRect(sx+6,sy+18,44,26);
  ctx.strokeStyle = '#ff4400'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(sx+28,sy+14); ctx.lineTo(sx+28,sy+48); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx+2,sy+31);  ctx.lineTo(sx+54,sy+31); ctx.stroke();
  ctx.lineWidth = 1;
  ctx.fillStyle = '#006000'; ctx.fillRect(sx+14,sy,28,20);
  ctx.fillStyle = '#ffcc00'; ctx.fillRect(sx+16,sy+4,8,8); ctx.fillRect(sx+32,sy+4,8,8);
  ctx.fillStyle = '#ff0000'; ctx.fillRect(sx+18,sy+6,5,5); ctx.fillRect(sx+34,sy+6,5,5);
  ctx.fillStyle = '#ff6000';
  ctx.beginPath(); ctx.moveTo(sx+16,sy); ctx.lineTo(sx+11,sy-14); ctx.lineTo(sx+21,sy-2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(sx+40,sy); ctx.lineTo(sx+35,sy-2); ctx.lineTo(sx+45,sy-14); ctx.fill();
  ctx.fillStyle = '#004800';
  ctx.fillRect(sx+(f?2:8),sy+44,16,12); ctx.fillRect(sx+(f?36:30),sy+44,16,12);
}

function drawBossShadow(sx, sy) {
  const t = Date.now() / 300;
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = '#3000a0';
  ctx.beginPath(); ctx.ellipse(sx+28,sy+36,28+Math.sin(t)*4,20+Math.cos(t*0.7)*3,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#200060';
  ctx.beginPath(); ctx.moveTo(sx+4,sy+56); ctx.lineTo(sx+10,sy+20); ctx.lineTo(sx+28,sy+8); ctx.lineTo(sx+46,sy+20); ctx.lineTo(sx+52,sy+56); ctx.fill();
  ctx.fillStyle = '#1a0050'; ctx.fillRect(sx+12,sy+10,32,24);
  const ec = 'hsl(' + (t * 60 % 360) + ',100%,60%)';
  ctx.fillStyle = ec; ctx.globalAlpha = 0.85 + Math.sin(t * 3) * 0.15;
  ctx.beginPath(); ctx.arc(sx+20,sy+20,6,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(sx+36,sy+20,6,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(sx+20,sy+20,3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(sx+36,sy+20,3,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#6000ff';
  for (let i = 0; i < 5; i++) {
    const h = 6 + Math.sin(t + i) * 4;
    ctx.beginPath(); ctx.moveTo(sx+10+i*8,sy+8); ctx.lineTo(sx+14+i*8,sy+8-h); ctx.lineTo(sx+18+i*8,sy+8); ctx.fill();
  }
  ctx.strokeStyle = '#5000c8'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  [[-1.0,-0.5,0],[-1.2,0.3,1],[1.0,-0.4,2],[1.1,0.5,3]].forEach(([dx,dy,i]) => {
    ctx.beginPath(); ctx.moveTo(sx+28,sy+40);
    ctx.quadraticCurveTo(sx+28+dx*20+Math.sin(t+i)*8, sy+44+dy*20, sx+28+dx*38+Math.sin(t+i)*12, sy+52+dy*16);
    ctx.stroke();
  });
  ctx.lineWidth = 1; ctx.lineCap = 'butt';
}

// ── Particles & floating score text ──────────────────────────
function drawParticles() {
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--;
    ctx.globalAlpha = p.life / p.maxLife; ctx.fillStyle = p.color;
    ctx.fillRect(p.x - camX, p.y, p.size * (p.life/p.maxLife), p.size * (p.life/p.maxLife));
  });
  ctx.globalAlpha = 1;
  particles = particles.filter(p => p.life > 0);
}
function drawFloatingTexts() {
  floatingTexts.forEach(ft => {
    ft.y += ft.vy; ft.life--;
    ctx.globalAlpha = ft.life / 55; ctx.fillStyle = ft.color;
    ctx.font = 'bold 13px Courier New'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(ft.text, ft.x - camX, ft.y);
  });
  ctx.globalAlpha = 1;
  floatingTexts = floatingTexts.filter(f => f.life > 0);
}
function drawCoins() {
  level.qblocks.filter(q => !q.hit).forEach(q => {
    const sx = q.tx * TILE - camX + 16, sy = q.ty * TILE - 8;
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
    }
  });
}

// ── Boss intro overlay ────────────────────────────────────────
function drawBossIntro() {
  ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fillRect(0, 0, W, H);
  const prog = Math.min(bossIntroTimer / 120, 1), alpha = prog < 0.5 ? prog * 2 : 1;
  ctx.globalAlpha = alpha;
  const bc = BOSS_CONFIGS[world];
  ctx.fillStyle = bc.color; ctx.font = 'bold 42px Courier New'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('⚔ BOSS BATTLE ⚔', W / 2, H / 2 - 44);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 28px Courier New'; ctx.fillText(bc.name, W / 2, H / 2 + 6);
  ctx.fillStyle = '#ffd700'; ctx.font = '16px Courier New';
  ctx.fillText('HP: ' + bc.hp + '  ·  World ' + world + ' Boss', W / 2, H / 2 + 44);
  ctx.globalAlpha = 1;
}
