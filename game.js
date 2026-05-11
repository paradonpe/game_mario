// ═══════════════════════════════════════════════════════════
//  SUPER ADVENTURE  —  game.js
//  Worlds 1-3, each with 2 regular levels + 1 boss level
// ═══════════════════════════════════════════════════════════
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');
const W = 800, H = 450, TILE = 32;

// ── GAME STATE ────────────────────────────────────────────────
let STATE = 'title';
let score=0, coins=0, lives=3, world=1, worldLevel=1;
let timer=300, timerLastTick=0;
let power='small', prevPower='small', transformAnim=0;
let camX=0;
let particles=[], floatingTexts=[];
let bossIntroTimer=0, bossWinTimer=0;
let levelClearFired=false;

const keys={};
let jumpPressed=false;

let player, level, boss=null;

// ══════════════════════════════════════════════════════════════
//  LEVEL CONFIGS
// ══════════════════════════════════════════════════════════════
const LEVEL_CONFIGS = {
  '1-1': {
    width:220, theme:'normal',
    enemies:[
      {type:'goomba',tx:20},{type:'goomba',tx:24},{type:'goomba',tx:38},
      {type:'koopa',tx:50},{type:'goomba',tx:60},{type:'goomba',tx:61},
      {type:'koopa',tx:75},{type:'koopa',tx:76},{type:'goomba',tx:90},
    ],
    qblocks:[
      {tx:13,ty:10,item:'coin'},{tx:16,ty:7,item:'mushroom'},{tx:20,ty:10,item:'coin'},
      {tx:20,ty:7,item:'coin'},{tx:21,ty:7,item:'coin'},{tx:22,ty:7,item:'coin'},
      {tx:55,ty:7,item:'star'},{tx:68,ty:10,item:'coin'},{tx:80,ty:10,item:'coin'},
    ],
    platforms:[
      {tx:10,ty:11,len:3},{tx:17,ty:8,len:1},{tx:23,ty:8,len:3},
      {tx:35,ty:8,len:2},{tx:42,ty:6,len:2},{tx:48,ty:10,len:2},
      {tx:56,ty:7,len:4},{tx:65,ty:9,len:3},{tx:72,ty:7,len:2},
      {tx:78,ty:11,len:3},{tx:85,ty:8,len:3},
    ],
    pipes:[{tx:30,ty:10,h:2},{tx:46,ty:10,h:3},{tx:62,ty:10,h:2},{tx:88,ty:10,h:4}],
    flagX:200,
  },
  '1-2': {
    width:230, theme:'cave',
    enemies:[
      {type:'goomba',tx:14},{type:'goomba',tx:15},{type:'koopa',tx:25},
      {type:'goomba',tx:36},{type:'goomba',tx:45},{type:'koopa',tx:55},
      {type:'goomba',tx:65},{type:'koopa',tx:74},{type:'goomba',tx:82},
      {type:'koopa',tx:92},{type:'goomba',tx:101},
    ],
    qblocks:[
      {tx:10,ty:9,item:'mushroom'},{tx:18,ty:7,item:'coin'},{tx:22,ty:7,item:'coin'},
      {tx:30,ty:9,item:'star'},{tx:48,ty:7,item:'coin'},{tx:60,ty:9,item:'mushroom'},
      {tx:78,ty:7,item:'coin'},{tx:88,ty:9,item:'star'},
    ],
    platforms:[
      {tx:8,ty:10,len:2},{tx:14,ty:8,len:3},{tx:20,ty:6,len:2},{tx:26,ty:9,len:3},
      {tx:36,ty:7,len:2},{tx:42,ty:10,len:2},{tx:50,ty:8,len:3},{tx:58,ty:6,len:2},
      {tx:65,ty:10,len:3},{tx:73,ty:8,len:2},{tx:80,ty:6,len:3},{tx:90,ty:9,len:3},
    ],
    pipes:[{tx:18,ty:10,h:2},{tx:40,ty:10,h:3},{tx:62,ty:10,h:2},{tx:84,ty:10,h:3}],
    flagX:213,
  },
  '2-1': {
    width:250, theme:'paradise',
    enemies:[
      {type:'goomba',tx:18},{type:'goomba',tx:19},{type:'koopa',tx:32},
      {type:'goomba',tx:47},{type:'koopa',tx:53},{type:'goomba',tx:65},
      {type:'goomba',tx:66},{type:'goomba',tx:78},{type:'koopa',tx:88},
      {type:'goomba',tx:98},{type:'koopa',tx:108},{type:'goomba',tx:118},
    ],
    qblocks:[
      {tx:11,ty:7,item:'coin'},{tx:13,ty:7,item:'mushroom'},{tx:15,ty:7,item:'coin'},
      {tx:28,ty:9,item:'coin'},{tx:45,ty:7,item:'star'},{tx:60,ty:9,item:'coin'},
      {tx:76,ty:7,item:'mushroom'},{tx:92,ty:10,item:'coin'},{tx:110,ty:7,item:'star'},
    ],
    platforms:[
      {tx:9,ty:8,len:4},{tx:22,ty:7,len:2},{tx:27,ty:9,len:3},
      {tx:38,ty:7,len:3},{tx:50,ty:9,len:2},{tx:60,ty:7,len:4},
      {tx:72,ty:9,len:3},{tx:82,ty:7,len:4},{tx:95,ty:9,len:2},
      {tx:104,ty:8,len:3},{tx:112,ty:7,len:4},
    ],
    pipes:[{tx:20,ty:10,h:2},{tx:42,ty:10,h:3},{tx:70,ty:10,h:2},{tx:100,ty:10,h:3}],
    flagX:235,
    palms:[40,80,130,180],
    coral:[{tx:35,col:'#ff6090'},{tx:55,col:'#ff9040'},{tx:90,col:'#ff6090'},{tx:115,col:'#ffd060'}],
  },
  '2-2': {
    width:260, theme:'normal',
    enemies:[
      {type:'koopa',tx:12},{type:'goomba',tx:20},{type:'goomba',tx:21},
      {type:'koopa',tx:30},{type:'koopa',tx:31},{type:'goomba',tx:44},
      {type:'goomba',tx:55},{type:'koopa',tx:60},{type:'goomba',tx:70},
      {type:'goomba',tx:71},{type:'koopa',tx:82},{type:'koopa',tx:95},
      {type:'goomba',tx:108},{type:'goomba',tx:109},{type:'goomba',tx:110},
    ],
    qblocks:[
      {tx:8,ty:7,item:'mushroom'},{tx:18,ty:9,item:'coin'},{tx:28,ty:7,item:'star'},
      {tx:40,ty:9,item:'coin'},{tx:52,ty:7,item:'coin'},{tx:65,ty:9,item:'mushroom'},
      {tx:78,ty:7,item:'coin'},{tx:90,ty:9,item:'star'},{tx:105,ty:7,item:'coin'},
    ],
    platforms:[
      {tx:6,ty:8,len:2},{tx:15,ty:7,len:3},{tx:22,ty:9,len:2},{tx:28,ty:7,len:4},
      {tx:38,ty:9,len:2},{tx:45,ty:7,len:3},{tx:55,ty:9,len:2},{tx:62,ty:7,len:4},
      {tx:72,ty:9,len:3},{tx:80,ty:8,len:2},{tx:88,ty:7,len:3},{tx:98,ty:9,len:2},
      {tx:107,ty:8,len:4},
    ],
    pipes:[{tx:10,ty:10,h:2},{tx:25,ty:10,h:3},{tx:50,ty:10,h:2},{tx:68,ty:10,h:4},{tx:88,ty:10,h:3},{tx:110,ty:10,h:2}],
    flagX:245,
  },
  '3-1': {
    width:270, theme:'night',
    enemies:[
      {type:'koopa',tx:15},{type:'goomba',tx:22},{type:'koopa',tx:30},
      {type:'goomba',tx:40},{type:'koopa',tx:48},{type:'goomba',tx:57},
      {type:'goomba',tx:58},{type:'koopa',tx:68},{type:'goomba',tx:78},
      {type:'koopa',tx:85},{type:'goomba',tx:95},{type:'koopa',tx:103},
      {type:'goomba',tx:113},{type:'goomba',tx:114},{type:'koopa',tx:122},
    ],
    qblocks:[
      {tx:10,ty:7,item:'star'},{tx:18,ty:9,item:'mushroom'},{tx:26,ty:7,item:'coin'},
      {tx:38,ty:9,item:'coin'},{tx:50,ty:7,item:'mushroom'},{tx:62,ty:9,item:'star'},
      {tx:76,ty:7,item:'coin'},{tx:90,ty:9,item:'mushroom'},{tx:106,ty:7,item:'coin'},
    ],
    platforms:[
      {tx:8,ty:9,len:3},{tx:16,ty:7,len:2},{tx:23,ty:10,len:3},{tx:30,ty:7,len:4},
      {tx:42,ty:9,len:2},{tx:50,ty:7,len:3},{tx:60,ty:10,len:2},{tx:68,ty:8,len:4},
      {tx:80,ty:7,len:3},{tx:88,ty:10,len:2},{tx:96,ty:8,len:3},{tx:108,ty:7,len:4},
    ],
    pipes:[{tx:12,ty:10,h:3},{tx:35,ty:10,h:2},{tx:58,ty:10,h:4},{tx:82,ty:10,h:2},{tx:106,ty:10,h:3}],
    flagX:255,
  },
  '3-2': {
    width:280, theme:'lava',
    enemies:[
      {type:'koopa',tx:14},{type:'koopa',tx:15},{type:'goomba',tx:26},
      {type:'koopa',tx:34},{type:'goomba',tx:44},{type:'koopa',tx:52},
      {type:'goomba',tx:62},{type:'goomba',tx:63},{type:'koopa',tx:72},
      {type:'koopa',tx:80},{type:'goomba',tx:90},{type:'koopa',tx:98},
      {type:'goomba',tx:108},{type:'koopa',tx:116},{type:'goomba',tx:124},
    ],
    qblocks:[
      {tx:10,ty:7,item:'mushroom'},{tx:20,ty:9,item:'coin'},{tx:32,ty:7,item:'star'},
      {tx:46,ty:9,item:'mushroom'},{tx:58,ty:7,item:'coin'},{tx:70,ty:9,item:'star'},
      {tx:84,ty:7,item:'coin'},{tx:96,ty:9,item:'mushroom'},{tx:110,ty:7,item:'star'},
    ],
    platforms:[
      {tx:8,ty:9,len:2},{tx:16,ty:7,len:3},{tx:24,ty:10,len:2},{tx:32,ty:7,len:4},
      {tx:44,ty:9,len:3},{tx:54,ty:7,len:2},{tx:62,ty:10,len:3},{tx:72,ty:7,len:4},
      {tx:84,ty:9,len:2},{tx:92,ty:7,len:3},{tx:102,ty:10,len:2},{tx:112,ty:8,len:4},
    ],
    pipes:[{tx:12,ty:10,h:2},{tx:40,ty:10,h:3},{tx:66,ty:10,h:4},{tx:90,ty:10,h:2},{tx:114,ty:10,h:3}],
    flagX:265,
  },
};

const BOSS_CONFIGS = {
  1:{ name:'KING GOOMBA',     hp:5, color:'#a06018', theme:'boss1' },
  2:{ name:'LAVA KOOPA KING', hp:7, color:'#e03000', theme:'boss2' },
  3:{ name:'SHADOW OVERLORD', hp:9, color:'#5000a0', theme:'boss3' },
};

// ══════════════════════════════════════════════════════════════
//  LEVEL BUILDER
// ══════════════════════════════════════════════════════════════
function buildLevel(w, l) {
  const key = w+'-'+l;
  const cfg = LEVEL_CONFIGS[key];
  if (!cfg) return buildBossLevel(w);
  return buildFromConfig(cfg);
}

function buildBossLevel(w) {
  const LW=40, GH=13;
  const tiles=[];
  for(let x=0;x<LW;x++){
    tiles.push({x,y:GH,   type:'groundTop'});
    tiles.push({x,y:GH+1, type:'ground'});
  }
  // Arena platforms
  [[4,10,4],[12,8,4],[20,10,4],[28,8,4],[4,6,3],[28,6,3]].forEach(([tx,ty,len])=>{
    for(let i=0;i<len;i++) tiles.push({x:tx+i,y:ty,type:'brick'});
  });
  const bcfg=BOSS_CONFIGS[w];
  return {
    tiles,qblocks:[],enemies:[],items:[],
    flagX:null,width:LW*TILE,groundY:GH,
    theme:bcfg.theme,palms:[],coral:[],
    isBossArena:true,bossWorld:w,
  };
}

function buildFromConfig(cfg) {
  const LW=cfg.width, GH=13;
  const tiles=[];
  for(let x=0;x<LW;x++){
    tiles.push({x,y:GH,   type:'groundTop'});
    tiles.push({x,y:GH+1, type:'ground'});
  }
  cfg.platforms.forEach(p=>{
    for(let i=0;i<p.len;i++) tiles.push({x:p.tx+i,y:p.ty,type:'brick'});
  });
  const qblocks=cfg.qblocks.map(q=>({...q,hit:false,anim:0}));
  cfg.pipes.forEach(p=>{
    for(let h=0;h<p.h;h++){
      tiles.push({x:p.tx,   y:GH-h,type:'pipeBody',left:true});
      tiles.push({x:p.tx+1, y:GH-h,type:'pipeBody',left:false});
    }
    tiles.push({x:p.tx,   y:GH-p.h,type:'pipeTop',left:true});
    tiles.push({x:p.tx+1, y:GH-p.h,type:'pipeTop',left:false});
  });
  const enemies=cfg.enemies.map(e=>({
    type:e.type,
    x:e.tx*TILE, y:(GH-2)*TILE,
    w:28, h:e.type==='koopa'?32:24,
    vx:e.type==='koopa'?-0.8:-0.6, vy:0,
    onGround:false,
    alive:true,stomped:false,stompTimer:0,
    shell:false,shellVx:0,
    animFrame:0,animTick:0,
  }));
  return {
    tiles,qblocks,enemies,items:[],
    flagX:cfg.flagX*TILE,width:LW*TILE,groundY:GH,
    theme:cfg.theme||'normal',
    palms:cfg.palms||[],coral:cfg.coral||[],
    isBossArena:false,
  };
}

// ══════════════════════════════════════════════════════════════
//  PHYSICS (axis-separated, corner-safe)
// ══════════════════════════════════════════════════════════════
const GRAVITY=0.45, JUMP_FORCE=-9.5, JUMP_HOLD=0.28;
const MAX_SPD=4.5, RUN_SPD=7, ACCEL=0.35;

function isSolid(t){ return ['groundTop','ground','brick','pipeBody','pipeTop'].includes(t.type); }
function getTileAt(tx,ty){ return level.tiles.find(t=>t.x===tx&&t.y===ty); }
function getQBlockAt(tx,ty){ return level.qblocks.find(q=>q.tx===tx&&q.ty===ty&&!q.hit); }

function solidAt(px,py,pw,ph){
  const x1=Math.floor(px/TILE),        y1=Math.floor(py/TILE);
  const x2=Math.floor((px+pw-1)/TILE), y2=Math.floor((py+ph-1)/TILE);
  for(let ty=y1;ty<=y2;ty++)
    for(let tx=x1;tx<=x2;tx++){
      const t=getTileAt(tx,ty);
      if(t&&isSolid(t)) return {tile:t,tx,ty};
    }
  return null;
}

function rectsOverlap(ax,ay,aw,ah,bx,by,bw,bh){
  return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by;
}

// Move along X, resolve wall collisions. Returns {px,vx}
function moveX(px,py,pw,ph,vx){
  px+=vx;
  // Inset Y by 1 to avoid corner-sticking on edges
  const hit=solidAt(px,py+1,pw,ph-2);
  if(hit){
    px=vx>0?hit.tx*TILE-pw:(hit.tx+1)*TILE;
    vx=0;
  }
  return {px,vx};
}

// Move along Y, resolve floor/ceiling. Returns {py,vy,onGround,hitTile}
function moveY(px,py,pw,ph,vy){
  py+=vy;
  // Inset X by 1 to avoid corner-sticking on edges
  const hit=solidAt(px+1,py,pw-2,ph);
  if(hit){
    if(vy>0){
      py=hit.ty*TILE-ph;
      return {py,vy:0,onGround:true,hitTile:hit};
    } else {
      py=(hit.ty+1)*TILE;
      return {py,vy:1,onGround:false,hitTile:hit};
    }
  }
  return {py,vy,onGround:false,hitTile:null};
}

// ══════════════════════════════════════════════════════════════
//  PLAYER
// ══════════════════════════════════════════════════════════════
function makePlayer(){
  return {
    x:64,y:350,w:24,h:24,
    vx:0,vy:0,onGround:false,facing:1,
    jumpTimer:0,invincible:0,starTimer:0,
    animFrame:0,animTick:0,
    dead:false,deadTimer:0,
  };
}
function pH(){ return power==='small'?24:32; }
function pYO(){ return power==='small'?0:-8; }

function updatePlayer(dt){
  const p=player;
  if(p.dead){ p.deadTimer+=dt; if(p.deadTimer>90) respawn(); return; }
  if(p.invincible>0) p.invincible-=dt;
  if(p.starTimer>0){ p.starTimer-=dt; if(p.starTimer<=0&&power==='star') power='big'; }

  // Horizontal
  const ms=(keys['ShiftLeft']||keys['ShiftRight'])?RUN_SPD:MAX_SPD;
  const left=keys['ArrowLeft']||keys['KeyA'];
  const right=keys['ArrowRight']||keys['KeyD'];
  if(right)     { p.vx=Math.min(p.vx+ACCEL,ms); p.facing=1; }
  else if(left) { p.vx=Math.max(p.vx-ACCEL,-ms); p.facing=-1; }
  else          { p.vx*=p.onGround?0.78:0.92; if(Math.abs(p.vx)<0.1) p.vx=0; }

  // Jump
  const jk=keys['Space']||keys['ArrowUp']||keys['KeyW'];
  if(jk&&!jumpPressed&&p.onGround){ p.vy=JUMP_FORCE; p.jumpTimer=14; jumpPressed=true; addParticle(p.x+12,p.y+p.h,'#fff',0,-2); }
  if(!jk) jumpPressed=false;
  if(jk&&p.jumpTimer>0){ p.vy-=JUMP_HOLD; p.jumpTimer-=dt; } else p.jumpTimer=0;

  p.vy=Math.min(p.vy+GRAVITY,14);

  const pw=p.w, ph=pH(), yo=pYO();

  // X resolve first
  const rx=moveX(p.x,p.y+yo,pw,ph,p.vx);
  p.x=rx.px; p.vx=rx.vx;
  p.x=Math.max(0,Math.min(level.width-pw,p.x));

  // Y resolve
  p.onGround=false;
  const ry=moveY(p.x,p.y+yo,pw,ph,p.vy);
  p.y=ry.py-yo; p.vy=ry.vy;
  if(ry.onGround){ p.onGround=true; p.jumpTimer=0; }

  // Head-bump
  if(ry.hitTile&&ry.vy===1){
    const hx=Math.floor((p.x+pw/2)/TILE), hy=ry.hitTile.ty;
    const qb=getQBlockAt(hx,hy);
    if(qb) hitQBlock(qb);
    else{
      const bt=getTileAt(hx,hy);
      if(bt&&bt.type==='brick'&&power!=='small') breakBrick(hx,hy);
      else if(bt&&bt.type==='brick') bumpBrick(hx,hy);
    }
  }

  if(p.y>H+100) playerDie();

  // Anim
  p.animTick+=dt;
  if(Math.abs(p.vx)>0.5&&p.onGround){ if(p.animTick>5){p.animFrame=(p.animFrame+1)%4;p.animTick=0;} }
  else if(!p.onGround) p.animFrame=2;
  else p.animFrame=0;

  // Item pickup
  level.items=level.items.filter(item=>{
    if(rectsOverlap(p.x,p.y+yo,pw,ph,item.x,item.y,item.w||20,item.h||20)){
      collectItem(item); return false;
    }
    return true;
  });
}

// ── Blocks
function hitQBlock(qb){
  qb.hit=true; qb.anim=8;
  spawnItem(qb.tx*TILE+TILE/2-8,qb.ty*TILE-TILE,qb.item);
  addScore(100);
  addParticle(qb.tx*TILE+12,qb.ty*TILE,'#f0b000',0,-3,30);
}
function breakBrick(tx,ty){
  const i=level.tiles.findIndex(t=>t.x===tx&&t.y===ty);
  if(i!==-1) level.tiles.splice(i,1);
  addScore(50);
  for(let j=0;j<6;j++) addParticle(tx*TILE+16,ty*TILE+8,'#c84c0c',Math.random()*6-3,-Math.random()*6,40);
}
function bumpBrick(tx,ty){ const t=getTileAt(tx,ty); if(t) t.bumpAnim=6; }

// ── Items
function spawnItem(x,y,type){
  if(type==='coin'){ addScore(200); coins++; addFloatText('+COIN',x,y,'#f0b000'); updateHUD(); return; }
  if(type==='mushroom') level.items.push({type:'mushroom',x,y,w:24,h:24,vy:-2,vx:1,onGround:false});
  if(type==='star')     level.items.push({type:'star',    x,y,w:24,h:24,vy:-5,vx:2,bouncing:true});
}
function collectItem(item){
  if(item.type==='mushroom'){
    if(power==='small'){ prevPower=power; power='big'; transformAnim=30; }
    addScore(1000);
    addFloatText('+MUSHROOM',item.x,item.y,'#e02020');
    for(let i=0;i<10;i++) addParticle(item.x+12,item.y,'#e02020',Math.random()*6-3,-Math.random()*4,40);
  }
  if(item.type==='star'){
    prevPower=power; power='star'; player.starTimer=600;
    addScore(1000); addFloatText('STAR!',item.x,item.y,'#f0d000');
  }
}
function updateItems(dt){
  level.items.forEach(item=>{
    item.vy=Math.min((item.vy||0)+GRAVITY,12);
    const rx=moveX(item.x,item.y,item.w||24,item.h||24,item.vx||0);
    item.x=rx.px; if(rx.vx===0) item.vx=(item.vx||1)*-1;
    const ry=moveY(item.x,item.y,item.w||24,item.h||24,item.vy);
    item.y=ry.py; item.vy=ry.vy;
    if(ry.onGround&&item.bouncing) item.vy=-7;
    if(item.y>H+100) item.dead=true;
  });
  level.items=level.items.filter(i=>!i.dead);
}

// ── Player die / respawn
function playerDie(){
  if(player.invincible>0||player.dead) return;
  if(power!=='small'){
    prevPower=power; power='small'; transformAnim=30;
    player.invincible=120; addFloatText('OUCH!',player.x,player.y,'#fff'); return;
  }
  player.dead=true; player.deadTimer=0; player.vy=-10; player.vx=0;
  lives--; updateHUD();
}
function respawn(){
  if(lives<=0){ STATE='gameover'; showMsg('GAME OVER','You ran out of lives.','PRESS ENTER TO RESTART'); return; }
  player=makePlayer(); power='small'; transformAnim=0; camX=0; STATE='playing';
}

// ══════════════════════════════════════════════════════════════
//  REGULAR ENEMIES
// ══════════════════════════════════════════════════════════════
function updateEnemies(dt){
  const ph=pH(), yo=pYO();
  level.enemies.forEach(e=>{
    if(!e.alive) return;
    if(e.stomped){ e.stompTimer+=dt; if(e.stompTimer>30) e.alive=false; return; }
    e.animTick+=dt; if(e.animTick>8){e.animFrame=(e.animFrame+1)%2;e.animTick=0;}

    if(e.shell){
      if(Math.abs(e.shellVx)<0.1) return;
      const rx=moveX(e.x,e.y,e.w,e.h,e.shellVx);
      e.x=rx.px; if(rx.vx===0) e.shellVx*=-1;
      level.enemies.forEach(o=>{
        if(o===e||!o.alive||o.stomped) return;
        if(rectsOverlap(e.x,e.y,e.w,e.h,o.x,o.y,o.w,o.h)){
          o.alive=false; addScore(200); addParticle(o.x+14,o.y,'#fff',0,-4);
        }
      });
      e.vy=Math.min(e.vy+GRAVITY,14);
      const ry=moveY(e.x,e.y,e.w,e.h,e.vy); e.y=ry.py; e.vy=ry.vy;
      if(!player.dead&&player.invincible<=0){
        if(rectsOverlap(player.x,player.y+yo,player.w,ph,e.x,e.y,e.w,e.h)){
          if(power==='star'){ e.alive=false; addScore(300); } else playerDie();
        }
      }
      if(e.y>H+100) e.alive=false;
      return;
    }

    // Gravity first
    e.vy=Math.min(e.vy+GRAVITY,14);
    const ry=moveY(e.x,e.y,e.w,e.h,e.vy);
    e.y=ry.py; e.vy=ry.vy; e.onGround=ry.onGround;

    // Horizontal + wall bounce
    const rx=moveX(e.x,e.y,e.w,e.h,e.vx);
    e.x=rx.px; if(rx.vx===0) e.vx*=-1;

    // Edge detection (only when on ground)
    if(e.onGround){
      const probeX=e.vx>0?e.x+e.w+1:e.x-1;
      const edge=solidAt(probeX,e.y+e.h+2,2,4);
      if(!edge) e.vx*=-1;
    }

    if(e.y>H+100){ e.alive=false; return; }

    // Player collision
    if(!player.dead&&player.invincible<=0){
      if(rectsOverlap(player.x,player.y+yo,player.w,ph,e.x,e.y,e.w,e.h)){
        const pb=player.y+yo+ph, et=e.y+4;
        if(player.vy>0&&pb<=et+18&&pb>=et-18) stompEnemy(e);
        else if(power==='star'){ e.alive=false; addScore(200); addParticle(e.x+14,e.y,'#f0d000',0,-4); }
        else playerDie();
      }
    }
  });
}

function stompEnemy(e){
  if(e.type==='koopa'&&!e.shell){ e.shell=true; e.vx=0; e.shellVx=0; player.vy=-6; addScore(400); addFloatText('400',e.x,e.y,'#fff'); return; }
  if(e.type==='koopa'&&e.shell){ e.shellVx=player.facing*9; player.vy=-6; return; }
  e.stomped=true; e.stompTimer=0; e.h=8;
  player.vy=-6; addScore(100); addFloatText('100',e.x,e.y,'#fff');
  addParticle(e.x+12,e.y,'#806020',0,-2,20);
}

// ══════════════════════════════════════════════════════════════
//  BOSS SYSTEM
// ══════════════════════════════════════════════════════════════
function makeBoss(w){
  const cfg=BOSS_CONFIGS[w], GH=13;
  return {
    world:w,name:cfg.name,
    x:level.width/2+60,y:(GH-3)*TILE,
    w:56,h:56,
    hp:cfg.hp,maxHp:cfg.hp,
    vx:-1.2,vy:0,onGround:false,
    phase:1,attackTimer:0,attackInterval:180,
    projectiles:[],
    hitFlash:0,stunTimer:0,alive:true,
    animFrame:0,animTick:0,
    leapCooldown:0,summonCooldown:0,
  };
}

function updateBoss(dt){
  if(!boss||!boss.alive) return;
  const ph=pH(), yo=pYO();
  boss.animTick+=dt; if(boss.animTick>10){boss.animFrame=(boss.animFrame+1)%4;boss.animTick=0;}
  if(boss.hitFlash>0) boss.hitFlash-=dt;
  if(boss.stunTimer>0){ boss.stunTimer-=dt; return; }

  if(boss.hp<=Math.ceil(boss.maxHp/2)&&boss.phase===1){
    boss.phase=2; boss.vx*=1.6; boss.attackInterval=90;
    addFloatText('ENRAGED!',boss.x+28,boss.y-20,'#ff2020');
  }

  boss.leapCooldown=Math.max(0,boss.leapCooldown-dt);
  if(boss.onGround&&boss.leapCooldown<=0&&Math.random()<0.008*boss.phase){
    boss.vy=JUMP_FORCE*1.1;
    boss.vx=(player.x>boss.x?1:-1)*Math.abs(boss.vx)*1.2;
    boss.leapCooldown=80;
  }

  boss.vy=Math.min(boss.vy+GRAVITY,14);
  const ry=moveY(boss.x,boss.y,boss.w,boss.h,boss.vy);
  boss.y=ry.py; boss.vy=ry.vy; boss.onGround=ry.onGround;

  const rx=moveX(boss.x,boss.y,boss.w,boss.h,boss.vx);
  boss.x=rx.px; if(rx.vx===0) boss.vx*=-1;
  if(boss.x<4){ boss.x=4; boss.vx=Math.abs(boss.vx); }
  if(boss.x+boss.w>level.width-4){ boss.x=level.width-boss.w-4; boss.vx=-Math.abs(boss.vx); }

  boss.attackTimer+=dt;
  if(boss.attackTimer>=boss.attackInterval){ boss.attackTimer=0; fireProjectile(); }

  // World-3 boss summons goombas
  if(boss.world===3){
    boss.summonCooldown=Math.max(0,(boss.summonCooldown||220)-dt);
    if(boss.summonCooldown<=0){
      boss.summonCooldown=220;
      const GH=level.groundY;
      level.enemies.push({
        type:'goomba',x:boss.x+20,y:(GH-2)*TILE,
        w:28,h:24,vx:-0.6,vy:0,onGround:false,
        alive:true,stomped:false,stompTimer:0,
        shell:false,shellVx:0,animFrame:0,animTick:0,
      });
    }
  }

  // Projectile update
  boss.projectiles=boss.projectiles.filter(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.22; p.life-=dt;
    if(p.y>H+40||p.life<=0) return false;
    const sc=solidAt(p.x,p.y,p.w,p.h);
    if(sc){ p.vx*=-0.5; p.vy*=-0.7; }
    if(!player.dead&&player.invincible<=0){
      if(rectsOverlap(player.x,player.y+yo,player.w,ph,p.x,p.y,p.w,p.h)){ playerDie(); return false; }
    }
    return true;
  });

  // Player stomps boss
  if(!player.dead&&player.invincible<=0){
    if(rectsOverlap(player.x,player.y+yo,player.w,ph,boss.x,boss.y,boss.w,boss.h)){
      const pb=player.y+yo+ph, bt=boss.y+8;
      if(player.vy>0&&pb<=bt+22&&pb>=bt-22){
        damageBoss(); player.vy=-7;
      } else if(power==='star'){
        damageBoss(); damageBoss(); player.vy=-7;
      } else {
        playerDie();
      }
    }
  }
}

function fireProjectile(){
  if(!boss) return;
  const ang=Math.atan2((player.y-boss.y),(player.x+12-boss.x-28));
  const spd=3.5+(boss.phase-1)*1.5;
  const spreads=boss.world===1?[[0]]:boss.world===2?[[-0.3],[0],[0.3]]:[[-0.5],[-0.25],[0],[0.25],[0.5]];
  spreads.forEach(([off])=>{
    boss.projectiles.push({
      x:boss.x+boss.w/2-6,y:boss.y+boss.h/2,
      vx:Math.cos(ang+off)*spd, vy:Math.sin(ang+off)*spd,
      w:12,h:12,life:200,world:boss.world,
    });
  });
}

function damageBoss(){
  if(!boss||boss.hitFlash>0) return;
  boss.hp--; boss.hitFlash=12; boss.stunTimer=8;
  addScore(500); addFloatText('-1',boss.x+28,boss.y-10,'#fff');
  for(let i=0;i<8;i++) addParticle(boss.x+28,boss.y+20,BOSS_CONFIGS[boss.world].color,Math.random()*8-4,-Math.random()*6,40);
  if(boss.hp<=0) bossDefeated();
}

function bossDefeated(){
  boss.alive=false; STATE='bossWin'; bossWinTimer=0;
  addScore(5000); addFloatText('BOSS DOWN! +5000',boss.x+28,boss.y-30,'#f0d000');
  for(let i=0;i<30;i++) addParticle(boss.x+28,boss.y+28,'#f0d000',Math.random()*12-6,-Math.random()*10,80);
}

// ══════════════════════════════════════════════════════════════
//  PROGRESSION
// ══════════════════════════════════════════════════════════════
function checkFlag(){
  if(!level.flagX||level.isBossArena||STATE!=='playing') return;
  if(player.x+player.w>=level.flagX&&!player.dead&&!levelClearFired){
    levelClearFired=true;
    STATE='levelclear';
    addScore(1000); addFloatText('GOAL! +1000',player.x,player.y-20,'#f0d000');
    for(let i=0;i<20;i++) addParticle(player.x,player.y,'#f0d000',Math.random()*8-4,-Math.random()*8,60);
    setTimeout(nextLevel,2500);
  }
}

function nextLevel(){
  levelClearFired=false;
  worldLevel++;
  if(worldLevel>2){
    worldLevel=3;
    player=makePlayer(); power='small'; transformAnim=0; camX=0; timer=300; timerLastTick=0;
    level=buildBossLevel(world);
    boss=null;
    STATE='bossIntro'; bossIntroTimer=0;
    updateHUD(); return;
  }
  player=makePlayer(); power='small'; transformAnim=0; camX=0; timer=300; timerLastTick=0;
  level=buildLevel(world,worldLevel);
  STATE='playing'; updateHUD();
}

function startBossBattle(){ boss=makeBoss(world); STATE='boss'; }

function afterBossWin(){
  world++; worldLevel=1;
  if(world>3){ STATE='win'; showMsg('YOU WIN!','The kingdom is saved! All 3 bosses defeated!','PRESS ENTER TO PLAY AGAIN'); return; }
  player=makePlayer(); power='small'; transformAnim=0; camX=0; timer=300; timerLastTick=0;
  level=buildLevel(world,worldLevel); boss=null;
  STATE='playing'; updateHUD();
}

// ══════════════════════════════════════════════════════════════
//  CAMERA / HUD
// ══════════════════════════════════════════════════════════════
function updateCamera(){
  const t=player.x-W/3;
  camX+=(t-camX)*0.12;
  camX=Math.max(0,Math.min(level.width-W,camX));
}
function addScore(v){ score+=v; updateHUD(); }
function addFloatText(t,x,y,c){ floatingTexts.push({text:t,x,y,color:c,life:55,vy:-1.5}); }
function addParticle(x,y,c,vx,vy,life=30){ particles.push({x,y,color:c,vx:vx||0,vy:vy||0,life,maxLife:life,size:4}); }
function updateHUD(){
  document.getElementById('h-score').textContent=String(score).padStart(6,'0');
  document.getElementById('h-coins').textContent='x'+String(coins).padStart(2,'0');
  document.getElementById('h-world').textContent=worldLevel===3?world+'-B':world+'-'+worldLevel;
  document.getElementById('h-lives').textContent='x'+lives;
  document.getElementById('h-power').textContent=power.toUpperCase();
}
function tickTimer(ts){
  if(ts-timerLastTick>1000){ timerLastTick=ts; timer--; document.getElementById('h-time').textContent=timer; if(timer<=0) playerDie(); }
}

// ══════════════════════════════════════════════════════════════
//  ████  DRAWING  ████
// ══════════════════════════════════════════════════════════════
function drawBg(){
  const th=level.theme;
  if(th==='paradise')    drawBgParadise();
  else if(th==='cave')   drawBgCave();
  else if(th==='night')  drawBgNight();
  else if(th==='lava')   drawBgLava();
  else if(th==='boss1')  drawBgBoss1();
  else if(th==='boss2')  drawBgBoss2();
  else if(th==='boss3')  drawBgBoss3();
  else                   drawBgNormal();
}

function drawBgNormal(){
  ctx.fillStyle='#5c94fc'; ctx.fillRect(0,0,W,H);
  const cx=[80,260,480,650,900,1100,1400,1700], sz=[80,100,70,90,80,110,85,95], cy=[60,45,70,50,65,48,60,52];
  cx.forEach((x,i)=>drawCloud(x-camX*0.2,cy[i],sz[i]));
  [120,350,600,900,1200].forEach((x,i)=>drawHill(x-camX*0.5,H-TILE*2,[80,60,90,70,85][i]));
  [200,420,680].forEach(x=>drawBush(x-camX*0.7,H-TILE*2-10));
}
function drawBgCave(){
  ctx.fillStyle='#1a1020'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#3a2050';
  for(let i=0;i<16;i++){
    const x=(i*90-camX*0.1+400)%(W+120)-60, h=20+Math.sin(i*1.7)*15;
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x+14,h); ctx.lineTo(x+28,0); ctx.fill();
  }
  const t=Date.now()/1200;
  for(let i=0;i<18;i++){
    const cx=(i*130+50-camX*0.15)%(W+200)-100, cy2=H*0.3+Math.sin(i*0.9+t)*60;
    ctx.globalAlpha=0.3+Math.sin(t+i)*0.2;
    ctx.fillStyle=i%3===0?'#a060ff':i%3===1?'#00d8ff':'#ff60d0';
    ctx.beginPath(); ctx.arc(cx,cy2,3,0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha=1;
}
function drawBgNight(){
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#05002a'); g.addColorStop(1,'#1a0850');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  const t=Date.now()/3000;
  for(let i=0;i<50;i++){
    const sx=((i*173+40)-camX*0.05)%(W+200)-100, sy=(i*71)%130+10;
    ctx.globalAlpha=0.4+Math.sin(t*2+i)*0.3;
    ctx.fillStyle='#fff'; ctx.fillRect(sx,sy,2,2);
  }
  ctx.globalAlpha=1;
  ctx.fillStyle='#ffffd0'; ctx.beginPath(); ctx.arc(W*0.8-camX*0.02,60,32,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#1a0850'; ctx.beginPath(); ctx.arc(W*0.8-camX*0.02+10,56,26,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#0a0438';
  [100,300,550,800,1050].forEach((x,i)=>{ const r=[80,60,100,70,90][i]; ctx.beginPath(); ctx.arc(x-camX*0.4,H-TILE*2,r,Math.PI,0); ctx.fill(); });
}
function drawBgLava(){
  ctx.fillStyle='#180800'; ctx.fillRect(0,0,W,H);
  const g=ctx.createLinearGradient(0,0,0,60);
  g.addColorStop(0,'rgba(255,80,0,0.4)'); g.addColorStop(1,'rgba(255,80,0,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,60);
  const t=Date.now()/800;
  for(let i=0;i<12;i++){
    const bx=((i*120+60-camX*0.3)+W+200)%(W+200)-100;
    const by=H-TILE*1.8+Math.sin(t+i)*8;
    ctx.globalAlpha=0.6+Math.sin(t*1.5+i)*0.2;
    ctx.fillStyle=i%2===0?'#ff4000':'#ff8000';
    ctx.beginPath(); ctx.arc(bx,by,14+Math.sin(t+i*0.5)*4,0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha=1;
  ctx.fillStyle='#2a0a00';
  [80,240,460,680,920].forEach((x,i)=>{ const r=[50,40,65,45,55][i%5]; ctx.beginPath(); ctx.arc(x-camX*0.45,H-TILE*2,r,Math.PI,0); ctx.fill(); });
}
function drawBgBoss1(){
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#001a00'); g.addColorStop(1,'#003800');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  if(Math.floor(Date.now()/400)%7===0){ ctx.fillStyle='rgba(255,255,200,0.04)'; ctx.fillRect(0,0,W,H); }
  for(let i=0;i<W/32+2;i++){
    ctx.fillStyle=i%2===0?'rgba(255,200,0,0.07)':'transparent';
    ctx.fillRect(i*32,H-80,32,80);
  }
}
function drawBgBoss2(){
  ctx.fillStyle='#200000'; ctx.fillRect(0,0,W,H);
  const t=Date.now()/500;
  const g=ctx.createRadialGradient(W/2,H,20,W/2,H,300);
  g.addColorStop(0,'rgba(255,'+(60+Math.sin(t)*20|0)+',0,0.4)'); g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<20;i++){
    const ex=((i*97+Date.now()/30)%(W+100))-50;
    const ey=H-80-((Date.now()/10+i*40)%H);
    ctx.globalAlpha=0.5+Math.sin(Date.now()/300+i)*0.3;
    ctx.fillStyle=i%2===0?'#ff6000':'#ffcc00'; ctx.fillRect(ex,ey,3,3);
  }
  ctx.globalAlpha=1;
}
function drawBgBoss3(){
  ctx.fillStyle='#000010'; ctx.fillRect(0,0,W,H);
  const t=Date.now()/2000;
  for(let r=0;r<5;r++){
    ctx.strokeStyle='rgba('+(80+r*30)+',0,'+(160+r*20)+','+(0.15+r*0.04)+')';
    ctx.lineWidth=3; ctx.beginPath();
    for(let a=0,first=true;a<Math.PI*2;a+=0.05){
      const rad=50+r*40+Math.sin(a*3+t)*20;
      const x=W/2+rad*Math.cos(a+t*(r%2===0?1:-1));
      const y=H/2+rad*Math.sin(a+t*(r%2===0?1:-1))*0.4;
      first?(ctx.moveTo(x,y),first=false):ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  ctx.lineWidth=1;
}

function drawCloud(x,y,sz){
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.ellipse(x,y,sz/2,sz/3.5,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x-sz/4,y+sz/8,sz/3.5,sz/4.5,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+sz/4,y+sz/8,sz/3.5,sz/4.5,0,0,Math.PI*2); ctx.fill();
}
function drawHill(x,y,r){
  ctx.fillStyle='#00a000'; ctx.beginPath(); ctx.arc(x,y,r,Math.PI,0); ctx.fill();
  ctx.fillStyle='#00b800'; ctx.beginPath(); ctx.arc(x,y-r+12,r/3,0,Math.PI*2); ctx.fill();
}
function drawBush(x,y){
  ctx.fillStyle='#00a000';
  ctx.beginPath(); ctx.ellipse(x,y,28,18,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x-22,y+4,18,14,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+22,y+4,18,14,0,0,Math.PI*2); ctx.fill();
}
function drawBgParadise(){
  const g=ctx.createLinearGradient(0,0,0,H*0.65);
  g.addColorStop(0,'#00b4ff'); g.addColorStop(0.5,'#40d8ff'); g.addColorStop(1,'#ffe090');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  const waterY=H-TILE*3.5;
  const wg=ctx.createLinearGradient(0,waterY,0,H-TILE*2);
  wg.addColorStop(0,'rgba(0,180,255,0.55)'); wg.addColorStop(1,'rgba(0,120,200,0.3)');
  ctx.fillStyle=wg; ctx.fillRect(0,waterY,W,TILE*1.5);
  const t=Date.now()/600;
  for(let i=0;i<12;i++){
    const wx=((i*120-camX*0.15+Math.sin(t+i)*20)%(W+200))-100;
    ctx.globalAlpha=0.35+Math.sin(t*1.5+i)*0.15;
    ctx.fillStyle='#fff'; ctx.fillRect(wx,waterY+6+Math.sin(t+i*0.8)*3,40,3);
  }
  ctx.globalAlpha=1;
  [100,340,600,900,1200,1600].forEach((x,i)=>{
    const sz=[90,110,75,95,85,100][i];
    const cy=[55,40,65,50,60,45][i];
    ctx.fillStyle='rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.ellipse(x-camX*0.18,cy,sz/2,sz/3.5,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,230,220,0.7)';
    ctx.beginPath(); ctx.ellipse(x-camX*0.18-sz/4,cy+sz/8,sz/3.5,sz/4.5,0,0,Math.PI*2); ctx.fill();
  });
  level.palms.forEach(px=>drawPalmTree(px*TILE-camX*0.6,H-TILE*2-30));
  ctx.fillStyle='#f0c060';
  [150,450,750,1100].forEach((x,i)=>{
    ctx.beginPath(); ctx.ellipse(x-camX*0.5,H-TILE*2+10,[80,100,70,90][i],[30,25,28,22][i],0,Math.PI,0); ctx.fill();
  });
}
function drawPalmTree(x,baseY){
  ctx.strokeStyle='#8b5e1a'; ctx.lineWidth=8;
  ctx.beginPath(); ctx.moveTo(x,baseY); ctx.quadraticCurveTo(x+10,baseY-40,x+5,baseY-80); ctx.stroke();
  ctx.lineWidth=1; ctx.fillStyle='#a06a20';
  for(let i=0;i<5;i++) ctx.fillRect(x-1+i*2.5-4,baseY-15-i*15,6,4);
  const lx=x+5,ly=baseY-80;
  ctx.strokeStyle='#1a8a00'; ctx.lineWidth=5;
  [[-40,-18,35,-30],[30,-20,40,-32],[-15,-38,10,-55],[20,-35,-10,-54],[-30,-10,-50,-5]].forEach(([dx1,dy1,dx2,dy2])=>{
    ctx.beginPath(); ctx.moveTo(lx,ly); ctx.quadraticCurveTo(lx+dx1,ly+dy1,lx+dx2,ly+dy2); ctx.stroke();
  });
  ctx.lineWidth=1; ctx.fillStyle='#a05010';
  ctx.beginPath(); ctx.arc(lx-5,ly+4,5,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(lx+6,ly+6,5,0,Math.PI*2); ctx.fill();
}

// ── TILES
function drawTiles(){
  level.tiles.forEach(t=>{
    const sx=t.x*TILE-camX, sy=t.y*TILE;
    if(sx<-TILE||sx>W+TILE) return;
    const bump=t.bumpAnim>0?-(t.bumpAnim*1.5):0;
    if(t.bumpAnim>0) t.bumpAnim--;
    ctx.save(); ctx.translate(sx,sy+bump); drawTileGfx(t); ctx.restore();
  });
  level.qblocks.forEach(q=>{
    const sx=q.tx*TILE-camX, sy=q.ty*TILE;
    if(sx<-TILE||sx>W+TILE) return;
    const bump=q.anim>0?-q.anim*2:0;
    if(q.anim>0) q.anim--;
    ctx.save(); ctx.translate(sx,sy+bump); drawQBlock(q.hit,q.item); ctx.restore();
  });
  // Box headings
  level.qblocks.filter(q=>!q.hit).forEach(q=>{
    const sx=q.tx*TILE-camX+TILE/2, sy=q.ty*TILE-22;
    if(sx<-32||sx>W+32) return;
    ctx.save();
    ctx.globalAlpha=0.82; ctx.fillStyle='rgba(0,0,0,0.55)';
    ctx.beginPath(); ctx.roundRect(sx-14,sy-10,28,20,4); ctx.fill();
    ctx.globalAlpha=1;
    if(q.item==='coin'){
      ctx.fillStyle='#f0b000'; ctx.beginPath(); ctx.arc(sx,sy+1,6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ffd060'; ctx.beginPath(); ctx.arc(sx-1,sy,3,0,Math.PI*2); ctx.fill();
    } else if(q.item==='mushroom'){
      ctx.fillStyle='#e02020'; ctx.beginPath(); ctx.arc(sx,sy-1,7,Math.PI,0); ctx.fill();
      ctx.fillStyle='#fca044'; ctx.fillRect(sx-5,sy+3,10,6);
    } else if(q.item==='star'){
      ctx.fillStyle='hsl('+(Date.now()/60%360)+',100%,60%)';
      ctx.font='13px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('★',sx,sy+1);
    }
    ctx.restore();
  });
  // Paradise coral
  if(level.theme==='paradise'){
    level.coral.forEach(c=>{
      const sx=c.tx*TILE-camX;
      if(sx<-TILE||sx>W+TILE) return;
      drawCoral(sx+TILE/2,level.groundY*TILE,c.col);
    });
  }
}

function drawTileGfx(t){
  const th=level.theme;
  const par=th==='paradise', lav=th==='lava', cav=th==='cave', nit=th==='night';
  if(t.type==='groundTop'){
    const col=par?'#f0c060':lav?'#5a1500':cav?'#3a2860':nit?'#1a3a70':'#e8783c';
    const dark=par?'#d8a040':lav?'#8a2000':cav?'#2a1840':nit?'#102860':'#c84c0c';
    const lite=par?'#ffe090':lav?'#c03000':cav?'#5040a0':nit?'#304090':'#a03808';
    ctx.fillStyle=col; ctx.fillRect(0,0,TILE,TILE);
    ctx.fillStyle=dark; ctx.fillRect(0,10,TILE,TILE-10);
    ctx.fillStyle=lite; for(let i=0;i<4;i++) ctx.fillRect(4+i*8,4,4,3);
  } else if(t.type==='ground'){
    const col=par?'#d8a040':lav?'#3a0800':cav?'#2a1840':nit?'#0e2050':'#c84c0c';
    const dark=par?'#b88020':lav?'#1a0400':cav?'#1a0c30':nit?'#081840':'#a03808';
    ctx.fillStyle=col; ctx.fillRect(0,0,TILE,TILE);
    ctx.fillStyle=dark; for(let i=0;i<4;i++) for(let j=0;j<4;j++) ctx.fillRect(4+i*8,3+j*8,3,2);
  } else if(t.type==='brick'){
    const col=par?'#ff8860':lav?'#8a1800':cav?'#4a3880':nit?'#2a4888':'#c84c0c';
    const dark=par?'#cc5030':lav?'#5a0800':cav?'#2a1850':nit?'#183060':'#7a2800';
    const lite=par?'#ffb090':lav?'#c04020':cav?'#7060c0':nit?'#4060b0':'#e07040';
    ctx.fillStyle=col; ctx.fillRect(0,0,TILE,TILE);
    ctx.fillStyle=dark;
    ctx.fillRect(0,TILE/2-1,TILE,2); ctx.fillRect(TILE/2-1,0,2,TILE/2-1);
    ctx.fillRect(TILE/4-1,TILE/2+1,2,TILE/2-1); ctx.fillRect(3*TILE/4-1,TILE/2+1,2,TILE/2-1);
    ctx.fillStyle=lite;
    ctx.fillRect(1,1,TILE/2-4,TILE/2-3); ctx.fillRect(TILE/2+2,1,TILE/2-4,TILE/2-3);
  } else if(t.type==='pipeTop'&&t.left){
    ctx.fillStyle='#00a800'; ctx.fillRect(-2,0,TILE+2,TILE);
    ctx.fillStyle='#006000'; ctx.fillRect(-2,0,4,TILE);
    ctx.fillStyle='#00d000'; ctx.fillRect(8,4,6,TILE-8);
    ctx.fillStyle='#004800'; ctx.fillRect(TILE-2,0,4,TILE);
  } else if(t.type==='pipeBody'&&t.left){
    ctx.fillStyle='#00a800'; ctx.fillRect(-2,0,TILE+2,TILE);
    ctx.fillStyle='#006000'; ctx.fillRect(-2,0,3,TILE);
    ctx.fillStyle='#00d000'; ctx.fillRect(8,4,5,TILE-8);
    ctx.fillStyle='#004800'; ctx.fillRect(TILE-2,0,3,TILE);
  }
}

function drawQBlock(hit,item){
  const par=level.theme==='paradise';
  if(hit){
    ctx.fillStyle=par?'#607060':'#806020'; ctx.fillRect(0,0,TILE,TILE);
    ctx.fillStyle=par?'#405040':'#604000'; ctx.fillRect(2,2,TILE-4,TILE-4);
    return;
  }
  if(par){ ctx.fillStyle='#00c8b8'; ctx.fillRect(0,0,TILE,TILE); ctx.fillStyle='#60ffe8'; ctx.fillRect(2,2,TILE-4,6); ctx.fillStyle='#008878'; ctx.fillRect(2,TILE-8,TILE-4,6); }
  else   { ctx.fillStyle='#e8a000'; ctx.fillRect(0,0,TILE,TILE); ctx.fillStyle='#ffd060'; ctx.fillRect(2,2,TILE-4,6); ctx.fillStyle='#a06000'; ctx.fillRect(2,TILE-8,TILE-4,6); }
  ctx.fillStyle='#fff'; ctx.font='bold 18px Courier New';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('?',TILE/2,TILE/2+1);
}

function drawCoral(cx,baseY,color){
  const t=Date.now()/1800;
  ctx.strokeStyle=color; ctx.lineWidth=4; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(cx,baseY); ctx.lineTo(cx,baseY-18); ctx.stroke();
  [[cx,baseY-10,cx-9,baseY-22,cx-14,baseY-30],[cx,baseY-13,cx+8,baseY-24,cx+13,baseY-31]].forEach(([x1,y1,x2,y2,x3,y3])=>{
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2+Math.sin(t)*1.5,y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2+Math.sin(t)*1.5,y2); ctx.lineTo(x3,y3); ctx.stroke();
  });
  ctx.fillStyle=color;
  [[cx,baseY-18],[cx-14,baseY-30],[cx+13,baseY-31]].forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();});
  ctx.lineWidth=1; ctx.lineCap='butt';
}

function drawFlag(){
  if(!level.flagX) return;
  const fx=level.flagX-camX;
  if(fx<-20||fx>W+20) return;
  if(level.theme==='paradise'){
    ctx.fillStyle='#d0d0d0'; ctx.fillRect(fx,H-TILE*13,4,TILE*12);
    ctx.fillStyle='#ff3060';
    ctx.beginPath(); ctx.moveTo(fx+4,H-TILE*13); ctx.lineTo(fx+28,H-TILE*12.4); ctx.lineTo(fx+4,H-TILE*11.8); ctx.fill();
    ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.moveTo(fx+4,H-TILE*12.6); ctx.lineTo(fx+28,H-TILE*12.0); ctx.lineTo(fx+4,H-TILE*11.4); ctx.fill();
    ctx.fillStyle='#f0b000'; ctx.beginPath(); ctx.arc(fx+2,H-TILE*13,6,0,Math.PI*2); ctx.fill();
  } else {
    ctx.fillStyle='#888'; ctx.fillRect(fx,H-TILE*13,4,TILE*12);
    ctx.fillStyle='#00a000'; ctx.fillRect(fx+4,H-TILE*13,22,15);
    ctx.fillStyle='#00c000'; ctx.fillRect(fx+4,H-TILE*13,22,7);
    ctx.fillStyle='#f0b000'; ctx.beginPath(); ctx.arc(fx+2,H-TILE*13,6,0,Math.PI*2); ctx.fill();
  }
}

function drawEnemy(e){
  if(!e.alive) return;
  const sx=e.x-camX, sy=e.y;
  if(sx<-TILE*2||sx>W+TILE*2) return;
  if(e.type==='goomba') drawGoomba(sx,sy,e);
  if(e.type==='koopa')  drawKoopa(sx,sy,e);
}
function drawGoomba(sx,sy,e){
  const h=e.stomped?8:e.h;
  ctx.fillStyle='#c07020'; ctx.fillRect(sx,sy+e.h-h,e.w,h);
  if(e.stomped) return;
  ctx.fillStyle='#fff'; ctx.fillRect(sx+4,sy+4,8,8); ctx.fillRect(sx+16,sy+4,8,8);
  ctx.fillStyle='#000'; ctx.fillRect(sx+5,sy+6,4,4); ctx.fillRect(sx+17,sy+6,4,4);
  ctx.fillRect(sx+3,sy+3,8,2); ctx.fillRect(sx+17,sy+3,8,2);
  const f=e.animFrame;
  ctx.fillStyle='#7a2800';
  ctx.fillRect(sx+(f?2:6),sy+e.h-8,10,8); ctx.fillRect(sx+(f?16:12),sy+e.h-8,10,8);
}
function drawKoopa(sx,sy,e){
  if(e.shell){
    ctx.fillStyle='#f0b000'; ctx.fillRect(sx,sy+4,28,24);
    ctx.fillStyle='#c09000'; ctx.fillRect(sx+4,sy+8,20,16);
    ctx.fillStyle='#008000'; ctx.fillRect(sx+12,sy+4,4,24); ctx.fillRect(sx,sy+16,28,4);
    return;
  }
  ctx.fillStyle='#00a000'; ctx.fillRect(sx+2,sy+8,24,20);
  ctx.fillStyle='#f0b000'; ctx.fillRect(sx+4,sy+10,20,16);
  ctx.fillStyle='#00c000'; ctx.fillRect(sx+6,sy,16,16);
  ctx.fillStyle='#fff'; ctx.fillRect(sx+8,sy+4,8,6); ctx.fillRect(sx+18,sy+4,5,6);
  ctx.fillStyle='#000'; ctx.fillRect(sx+10,sy+6,4,4); ctx.fillRect(sx+19,sy+6,3,4);
  const f=e.animFrame;
  ctx.fillStyle='#008000';
  ctx.fillRect(sx+(f?0:4),sy+26,10,10); ctx.fillRect(sx+(f?18:14),sy+26,10,10);
}

function drawItems(){
  level.items.forEach(item=>{
    const sx=item.x-camX;
    if(item.type==='mushroom') drawMushroom(sx,item.y);
    if(item.type==='star')     drawStar(sx,item.y);
  });
}
function drawMushroom(sx,sy){
  ctx.fillStyle='#e02020'; ctx.beginPath(); ctx.arc(sx+12,sy+8,14,Math.PI,0); ctx.fill();
  ctx.fillStyle='#fff'; ctx.fillRect(sx+3,sy+4,6,6); ctx.fillRect(sx+15,sy+4,6,6);
  ctx.fillStyle='#fca044'; ctx.fillRect(sx+2,sy+12,20,12);
  ctx.fillStyle='#d08030'; ctx.fillRect(sx+2,sy+20,8,4); ctx.fillRect(sx+14,sy+20,8,4);
}
function drawStar(sx,sy){
  ctx.fillStyle='hsl('+(Date.now()/200*30%360)+',100%,60%)';
  ctx.font='28px serif'; ctx.textAlign='left'; ctx.textBaseline='top';
  ctx.fillText('★',sx,sy);
}

function drawPlayer(){
  const p=player;
  const ph=pH(), yo=pYO();
  const sx=p.x-camX, sy=p.y+yo;

  if(p.dead){ ctx.save(); ctx.translate(sx+12,sy+12); ctx.rotate(Date.now()/200); ctx.translate(-12,-12); }
  if(p.invincible>0&&Math.floor(Date.now()/80)%2===0&&!p.dead) return;

  ctx.save();
  if(transformAnim>0){
    const prog=transformAnim/30, growing=power==='big'||power==='star';
    const pulse=1+Math.sin(prog*Math.PI*4)*0.18*prog;
    const sY=growing?(0.6+0.4*(1-prog))*pulse:(1.4-0.4*(1-prog))*pulse;
    const sX=growing?(1.4-0.4*(1-prog))*pulse:(0.6+0.4*(1-prog))*pulse;
    const cx=sx+p.w/2, cy=sy+ph/2;
    ctx.translate(cx,cy); ctx.scale(sX,sY); ctx.translate(-cx,-cy);
  }
  if(p.facing===-1){ ctx.translate(sx+p.w,sy); ctx.scale(-1,1); } else ctx.translate(sx,sy);
  if(power==='small') drawMarioSmall(p.animFrame,p.starTimer>0);
  else                drawMarioBig(p.animFrame,p.starTimer>0);
  ctx.restore();
  if(p.dead) ctx.restore();
}
function drawMarioSmall(frame,star){
  const col=star?'hsl('+(Date.now()/50%360)+',100%,55%)':'#e04000';
  ctx.fillStyle=col; ctx.fillRect(4,0,18,7); ctx.fillRect(0,5,24,4);
  ctx.fillStyle='#fca044'; ctx.fillRect(2,8,20,10);
  ctx.fillStyle='#000'; ctx.fillRect(14,9,4,4);
  ctx.fillStyle='#5a3010'; ctx.fillRect(6,14,14,3);
  ctx.fillStyle='#2040c0'; ctx.fillRect(2,17,20,10);
  ctx.fillStyle=col; ctx.fillRect(6,16,12,4);
  ctx.fillStyle='#3a2000';
  if(frame===1||frame===3){ctx.fillRect(0,25,12,6);ctx.fillRect(12,23,10,8);}
  else if(frame===2){ctx.fillRect(4,25,14,6);}
  else{ctx.fillRect(2,25,10,6);ctx.fillRect(14,24,10,7);}
}
function drawMarioBig(frame,star){
  const col=star?'hsl('+(Date.now()/50%360)+',100%,55%)':'#e04000';
  ctx.fillStyle=col; ctx.fillRect(4,0,18,8); ctx.fillRect(0,6,24,4);
  ctx.fillStyle='#fca044'; ctx.fillRect(2,9,20,12);
  ctx.fillStyle='#000'; ctx.fillRect(14,11,4,4);
  ctx.fillStyle='#5a3010'; ctx.fillRect(6,17,14,3);
  ctx.fillStyle='#2040c0'; ctx.fillRect(2,21,20,13);
  ctx.fillStyle=col; ctx.fillRect(6,20,12,5);
  ctx.fillStyle='#fff'; ctx.fillRect(10,24,4,4); ctx.fillRect(10,29,4,4);
  ctx.fillStyle='#3a2000';
  if(frame===1||frame===3){ctx.fillRect(0,32,12,8);ctx.fillRect(14,30,10,10);}
  else if(frame===2){ctx.fillRect(4,32,14,8);}
  else{ctx.fillRect(2,32,10,8);ctx.fillRect(14,31,10,9);}
}

// ── BOSS DRAWING
function drawBoss(){
  if(!boss) return;
  const sx=boss.x-camX, sy=boss.y;
  if(boss.hitFlash>0&&Math.floor(boss.hitFlash)%2===0){
    ctx.globalAlpha=0.6; ctx.fillStyle='#fff'; ctx.fillRect(sx,sy,boss.w,boss.h); ctx.globalAlpha=1; return;
  }
  if(boss.world===1)      drawBossKingGoomba(sx,sy);
  else if(boss.world===2) drawBossLavaKoopa(sx,sy);
  else                    drawBossShadow(sx,sy);

  // Projectiles
  boss.projectiles.forEach(p=>{
    const px=p.x-camX, py=p.y;
    if(p.world===1){
      ctx.fillStyle='#806020'; ctx.beginPath(); ctx.arc(px+6,py+6,6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#c09030'; ctx.beginPath(); ctx.arc(px+4,py+4,3,0,Math.PI*2); ctx.fill();
    } else if(p.world===2){
      ctx.fillStyle='#ff4000'; ctx.beginPath(); ctx.arc(px+6,py+6,6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ffcc00'; ctx.beginPath(); ctx.arc(px+4,py+4,3,0,Math.PI*2); ctx.fill();
    } else {
      ctx.fillStyle='hsl('+(Date.now()/100*30%360)+',100%,50%)';
      ctx.beginPath(); ctx.arc(px+6,py+6,6,0,Math.PI*2); ctx.fill();
    }
  });

  // HP bar
  const bw=220, bx=(W-bw)/2, by=12;
  ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(bx-4,by-4,bw+8,22);
  ctx.fillStyle='#500'; ctx.fillRect(bx,by,bw,14);
  const hf=boss.hp/boss.maxHp;
  ctx.fillStyle=hf>0.5?'#00e000':hf>0.25?'#e0e000':'#e00000';
  ctx.fillRect(bx,by,bw*hf,14);
  ctx.fillStyle='#fff'; ctx.font='bold 11px Courier New'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(boss.name+'  '+boss.hp+'/'+boss.maxHp,bx+bw/2,by+7);
}

function drawBossKingGoomba(sx,sy){
  const f=boss.animFrame%2;
  ctx.fillStyle='#a06018'; ctx.fillRect(sx+2,sy+16,52,36);
  ctx.fillStyle='#7a2800';
  ctx.fillRect(sx+(f?2:8),sy+46,18,12); ctx.fillRect(sx+(f?32:26),sy+46,18,12);
  ctx.fillStyle='#fff'; ctx.fillRect(sx+6,sy+18,14,14); ctx.fillRect(sx+34,sy+18,14,14);
  ctx.fillStyle='#000'; ctx.fillRect(sx+8,sy+21,8,8); ctx.fillRect(sx+36,sy+21,8,8);
  ctx.fillStyle='#000'; ctx.fillRect(sx+4,sy+16,16,3); ctx.fillRect(sx+34,sy+16,16,3);
  ctx.fillStyle='#f0c000'; ctx.fillRect(sx+8,sy+4,38,10);
  ctx.fillRect(sx+8,sy,8,8); ctx.fillRect(sx+22,sy-4,10,12); ctx.fillRect(sx+38,sy,8,8);
  ctx.fillStyle='#ff4060'; ctx.beginPath(); ctx.arc(sx+12,sy+8,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#40c0ff'; ctx.beginPath(); ctx.arc(sx+27,sy+4,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#ff4060'; ctx.beginPath(); ctx.arc(sx+42,sy+8,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#400'; ctx.fillRect(sx+14,sy+34,24,6);
  ctx.fillStyle='#fff'; ctx.fillRect(sx+15,sy+34,5,6); ctx.fillRect(sx+32,sy+34,5,6);
}

function drawBossLavaKoopa(sx,sy){
  const f=boss.animFrame%2;
  ctx.fillStyle='#cc2200'; ctx.fillRect(sx+2,sy+14,52,34);
  ctx.fillStyle='#882000'; ctx.fillRect(sx+6,sy+18,44,26);
  ctx.strokeStyle='#ff4400'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(sx+28,sy+14); ctx.lineTo(sx+28,sy+48); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx+2,sy+31);  ctx.lineTo(sx+54,sy+31); ctx.stroke();
  ctx.lineWidth=1;
  ctx.fillStyle='#006000'; ctx.fillRect(sx+14,sy,28,20);
  ctx.fillStyle='#ffcc00'; ctx.fillRect(sx+16,sy+4,8,8); ctx.fillRect(sx+32,sy+4,8,8);
  ctx.fillStyle='#ff0000'; ctx.fillRect(sx+18,sy+6,5,5); ctx.fillRect(sx+34,sy+6,5,5);
  ctx.fillStyle='#ff6000';
  ctx.beginPath(); ctx.moveTo(sx+16,sy); ctx.lineTo(sx+11,sy-14); ctx.lineTo(sx+21,sy-2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(sx+40,sy); ctx.lineTo(sx+35,sy-2); ctx.lineTo(sx+45,sy-14); ctx.fill();
  ctx.fillStyle='#004800';
  ctx.fillRect(sx+(f?2:8),sy+44,16,12); ctx.fillRect(sx+(f?36:30),sy+44,16,12);
}

function drawBossShadow(sx,sy){
  const t=Date.now()/300;
  ctx.globalAlpha=0.92;
  ctx.fillStyle='#3000a0';
  ctx.beginPath(); ctx.ellipse(sx+28,sy+36,28+Math.sin(t)*4,20+Math.cos(t*0.7)*3,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#200060';
  ctx.beginPath(); ctx.moveTo(sx+4,sy+56); ctx.lineTo(sx+10,sy+20); ctx.lineTo(sx+28,sy+8); ctx.lineTo(sx+46,sy+20); ctx.lineTo(sx+52,sy+56); ctx.fill();
  ctx.fillStyle='#1a0050'; ctx.fillRect(sx+12,sy+10,32,24);
  const ec='hsl('+(t*60%360)+',100%,60%)';
  ctx.fillStyle=ec; ctx.globalAlpha=0.85+Math.sin(t*3)*0.15;
  ctx.beginPath(); ctx.arc(sx+20,sy+20,6,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(sx+36,sy+20,6,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha=1;
  ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(sx+20,sy+20,3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(sx+36,sy+20,3,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#6000ff';
  for(let i=0;i<5;i++){
    const h=6+Math.sin(t+i)*4;
    ctx.beginPath(); ctx.moveTo(sx+10+i*8,sy+8); ctx.lineTo(sx+14+i*8,sy+8-h); ctx.lineTo(sx+18+i*8,sy+8); ctx.fill();
  }
  ctx.strokeStyle='#5000c8'; ctx.lineWidth=4; ctx.lineCap='round';
  [[-1.0,-0.5,0],[-1.2,0.3,1],[1.0,-0.4,2],[1.1,0.5,3]].forEach(([dx,dy,i])=>{
    ctx.beginPath(); ctx.moveTo(sx+28,sy+40);
    ctx.quadraticCurveTo(sx+28+dx*20+Math.sin(t+i)*8,sy+44+dy*20,sx+28+dx*38+Math.sin(t+i)*12,sy+52+dy*16);
    ctx.stroke();
  });
  ctx.lineWidth=1; ctx.lineCap='butt';
}

function drawParticles(){
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.15; p.life--;
    ctx.globalAlpha=p.life/p.maxLife; ctx.fillStyle=p.color;
    ctx.fillRect(p.x-camX,p.y,p.size*(p.life/p.maxLife),p.size*(p.life/p.maxLife));
  });
  ctx.globalAlpha=1; particles=particles.filter(p=>p.life>0);
}
function drawFloatingTexts(){
  floatingTexts.forEach(ft=>{ ft.y+=ft.vy; ft.life--; ctx.globalAlpha=ft.life/55; ctx.fillStyle=ft.color; ctx.font='bold 13px Courier New'; ctx.textAlign='center'; ctx.textBaseline='top'; ctx.fillText(ft.text,ft.x-camX,ft.y); });
  ctx.globalAlpha=1; floatingTexts=floatingTexts.filter(f=>f.life>0);
}
function drawCoins(){
  level.qblocks.filter(q=>!q.hit).forEach(q=>{
    const sx=q.tx*TILE-camX+16, sy=q.ty*TILE-8;
    if(Math.floor(Date.now()/500)%2===0){ ctx.fillStyle='#ffd700'; ctx.beginPath(); ctx.arc(sx,sy,3,0,Math.PI*2); ctx.fill(); }
  });
}

function drawBossIntro(){
  ctx.fillStyle='rgba(0,0,0,0.72)'; ctx.fillRect(0,0,W,H);
  const prog=Math.min(bossIntroTimer/120,1), alpha=prog<0.5?prog*2:1;
  ctx.globalAlpha=alpha;
  const bc=BOSS_CONFIGS[world];
  ctx.fillStyle=bc.color; ctx.font='bold 42px Courier New'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('⚔ BOSS BATTLE ⚔',W/2,H/2-44);
  ctx.fillStyle='#fff'; ctx.font='bold 28px Courier New'; ctx.fillText(bc.name,W/2,H/2+6);
  ctx.fillStyle='#ffd700'; ctx.font='16px Courier New'; ctx.fillText('HP: '+bc.hp+'  ·  World '+world+' Boss',W/2,H/2+44);
  ctx.globalAlpha=1;
}

// ══════════════════════════════════════════════════════════════
//  MAIN LOOP
// ══════════════════════════════════════════════════════════════
let lastTS=0;
function loop(ts){
  const dt=Math.min((ts-lastTS)/16.67,3); lastTS=ts;
  ctx.clearRect(0,0,W,H);
  if(level) drawBg();

  if(STATE==='bossIntro'){
    bossIntroTimer+=dt;
    if(level){ drawTiles(); drawItems(); level.enemies.forEach(drawEnemy); drawPlayer(); drawParticles(); drawFloatingTexts(); }
    drawBossIntro();
    if(bossIntroTimer>200) startBossBattle();

  } else if(STATE==='boss'||STATE==='bossWin'){
    tickTimer(ts);
    if(transformAnim>0) transformAnim=Math.max(0,transformAnim-dt);
    if(STATE==='boss'){ updatePlayer(dt); updateEnemies(dt); updateItems(dt); updateBoss(dt); }
    if(STATE==='bossWin'){ bossWinTimer+=dt; updatePlayer(dt); }
    updateCamera();
    drawTiles(); drawItems(); level.enemies.forEach(drawEnemy);
    drawBoss(); drawPlayer(); drawParticles(); drawFloatingTexts();
    if(STATE==='bossWin'){
      ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#f0d000'; ctx.font='bold 36px Courier New'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('BOSS DEFEATED!',W/2,H/2-20);
      ctx.fillStyle='#fff'; ctx.font='18px Courier New'; ctx.fillText('+5000 pts',W/2,H/2+20);
      if(bossWinTimer>160) afterBossWin();
    }

  } else if(STATE==='playing'||STATE==='levelclear'){
    tickTimer(ts);
    if(transformAnim>0) transformAnim=Math.max(0,transformAnim-dt);
    if(STATE==='playing'){ updatePlayer(dt); updateEnemies(dt); updateItems(dt); checkFlag(); }
    updateCamera();
    drawTiles(); drawFlag(); drawItems(); level.enemies.forEach(drawEnemy);
    drawCoins(); drawPlayer(); drawParticles(); drawFloatingTexts();
    if(STATE==='levelclear'){
      ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#fff'; ctx.font='bold 36px Courier New'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('COURSE CLEAR!',W/2,H/2);
      ctx.fillStyle='#f0d000'; ctx.font='20px Courier New'; ctx.fillText('SCORE: '+score,W/2,H/2+50);
    }
  }

  requestAnimationFrame(loop);
}

// ══════════════════════════════════════════════════════════════
//  UI / INPUT
// ══════════════════════════════════════════════════════════════
function showMsg(title,sub,hint){
  const box=document.getElementById('msg-box');
  document.getElementById('msg-title').textContent=title;
  document.getElementById('msg-sub').textContent=sub;
  document.getElementById('msg-hint').textContent=hint;
  box.style.display='block';
  document.getElementById('overlay').style.pointerEvents='all';
}
function hideMsg(){
  document.getElementById('msg-box').style.display='none';
  document.getElementById('overlay').style.pointerEvents='none';
}

document.addEventListener('keydown',e=>{
  keys[e.code]=true;
  if((e.code==='Enter'||e.code==='Space')&&(STATE==='title'||STATE==='gameover'||STATE==='win')){
    e.preventDefault();
    score=0; coins=0; lives=3; timer=300; world=1; worldLevel=1;
    power='small'; prevPower='small'; transformAnim=0; timerLastTick=0;
    boss=null; particles=[]; floatingTexts=[]; levelClearFired=false;
    player=makePlayer(); camX=0; level=buildLevel(1,1);
    STATE='playing'; hideMsg(); updateHUD();
  }
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
});
document.addEventListener('keyup',e=>{ keys[e.code]=false; });

// ── BOOT
player=makePlayer(); level=buildLevel(1,1); updateHUD();
showMsg('SUPER ADVENTURE','6 Levels  ·  3 Boss Battles  ·  3 Worlds','PRESS ENTER OR SPACE TO START');
requestAnimationFrame(loop);