

function rand(min,max){ return Math.random()*(max-min)+min; }

function spawnFloaty(container, opts){
  const el = document.createElement('div');
  el.className='floaty';
  el.textContent = opts.char;
  el.style.left = opts.left+'%';
  el.style.bottom = '-40px';
  el.style.fontSize = opts.size+'px';
  el.style.animation = `floatUp ${opts.dur}s linear ${opts.delay}s forwards`;
  el.style.color = opts.color||'#fff';
  container.appendChild(el);
  setTimeout(()=>el.remove(), (opts.dur+opts.delay)*1000+200);
}

function startFloatLoop(container, chars, count, colorFn){
  function spawnBatch(){
    for(let i=0;i<count;i++){
      spawnFloaty(container, {
        char: chars[Math.floor(Math.random()*chars.length)],
        left: rand(2,95),
        size: rand(14,30),
        dur: rand(6,11),
        delay: rand(0,3),
        color: colorFn ? colorFn() : '#fff'
      });
    }
  } 
  spawnBatch();
  return setInterval(spawnBatch, 3500);
}

function spawnSparkles(container, count){
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className='floaty';
    s.textContent='✦';
    s.style.left = rand(0,100)+'%';
    s.style.top = rand(0,100)+'%';
    s.style.fontSize = rand(8,16)+'px';
    s.style.color = '#fff';
    s.style.animation = `sparkleTwinkle ${rand(1.5,3)}s ease-in-out ${rand(0,2)}s infinite`;
    container.appendChild(s);
  }
}

/* ---------------- Welcome screen effects ---------------- */
const welcomeDeco = document.getElementById('welcomeDeco');
spawnSparkles(welcomeDeco, 25);
startFloatLoop(welcomeDeco, ['💗','💖','💕','✨'], 4, ()=> ['#ff69b4','#ffc1e3','#ffd86b'][Math.floor(rand(0,3))]);

// confetti burst + poppers on load
function burstConfetti(container, n){
  const colors = ['#ff69b4','#ffd86b','#c9a7ff','#ff2d8a','#fff','#6cddff'];
  for(let i=0;i<n;i++){
    const c = document.createElement('div');
    c.className='confetti';
    c.style.left = rand(0,100)+'%';
    c.style.background = colors[Math.floor(rand(0,colors.length))];
    c.style.animation = `confettiFall ${rand(2.5,4.5)}s linear ${rand(0,1.2)}s forwards`;
    c.style.transform = `rotate(${rand(0,360)}deg)`;
    container.appendChild(c);
    setTimeout(()=>c.remove(), 6000);
  }
}
function burstPoppers(container){
  const positions = [['8%','15%'],['85%','12%'],['15%','75%'],['80%','70%']];
  positions.forEach((p,i)=>{
    setTimeout(()=>{
      const pop = document.createElement('div');
      pop.className='popper'; pop.textContent='🎉';
      pop.style.left = p[0]; pop.style.top = p[1];
      container.appendChild(pop);
      burstConfetti(container, 18);
      setTimeout(()=>pop.remove(), 1500);
    }, i*250);
  });
}
burstPoppers(welcomeDeco);
setInterval(()=>burstConfetti(welcomeDeco, 8), 4000);

/* music toggle */
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let musicOn = false;
musicBtn.addEventListener('click', ()=>{
  musicOn = !musicOn;
  if(musicOn){
    bgMusic.play().catch(()=>{});
    musicBtn.textContent='🔊 Music';
  } else {
    bgMusic.pause();
    musicBtn.textContent='🔇 Music';
  }
});

/* ---------------- Screen navigation ---------------- */
const screens = {
  welcome: document.getElementById('welcome'),
  login: document.getElementById('login'),
  travel: document.getElementById('travel'),
  choice: document.getElementById('choice'),
  letterScreen: document.getElementById('letterScreen'),
  courtScreen: document.getElementById('courtScreen'),
};
function goTo(name){
  Object.values(screens).forEach(s=>s.classList.add('hidden'));
  screens[name].classList.remove('hidden');
}

document.getElementById('enterBtn').addEventListener('click', ()=>{
  goTo('login');
  if(!loginDecoStarted){ initLoginDeco(); }
});

/* ---------------- Login screen effects ---------------- */
let loginDecoStarted = false;
function initLoginDeco(){
  loginDecoStarted = true;
  const loginDeco = document.getElementById('loginDeco');
  spawnSparkles(loginDeco, 20);
  startFloatLoop(loginDeco, ['💗','✨','💫'], 3, ()=> ['#ff69b4','#ffc1e3'][Math.floor(rand(0,2))]);
}

const pwInput = document.getElementById('pwInput');
const errorMsg = document.getElementById('errorMsg');
const correctPW = ['04/02/2007','october/04/2009','10-04-2009','october 4 2009','10/4/2009'];

document.getElementById('unlockBtn').addEventListener('click', tryUnlock);
pwInput.addEventListener('keydown', e=>{ if(e.key==='Enter') tryUnlock(); });

function tryUnlock(){
  const val = pwInput.value.trim().toLowerCase();
  if(correctPW.includes(val)){
    errorMsg.style.display='none';
    startGalaxyTravel();
  } else {
    errorMsg.style.display='block';
    errorMsg.style.animation='none';
    void errorMsg.offsetWidth;
    errorMsg.style.animation='shake .4s ease';
  }
}

/* ── Galaxy Travel ── */
const TRAVEL_DURATION = 6200;
let warpRafId = null;

function startGalaxyTravel(){
  goTo('travel');
  runTravelText();
  runWarpCanvas();
  setTimeout(triggerFlash, TRAVEL_DURATION - 320);
  setTimeout(()=>{ goTo('choice'); initGalaxy3D(); }, TRAVEL_DURATION + 260);
}

function runTravelText(){
  const el = document.getElementById('travelText');
  const msgs = [
    { t:0,    txt:'Departing into deep space...' },
    { t:2000, txt:'Crossing the void between stars...' },
    { t:4200, txt:'Galaxy detected — arriving soon...' },
  ];
  msgs.forEach(({t, txt})=>{
    setTimeout(()=>{
      el.classList.remove('show');
      setTimeout(()=>{ el.textContent = txt; el.classList.add('show'); }, 280);
    }, t);
  });
}

function triggerFlash(){
  const f = document.getElementById('warpFlash');
  f.classList.remove('flash'); void f.offsetWidth; f.classList.add('flash');
}

function runWarpCanvas(){
  const cvs = document.getElementById('warpCanvas');
  const ctx = cvs.getContext('2d');
  const dpr = Math.min(devicePixelRatio||1, 2);
  const W = window.innerWidth, H = window.innerHeight;
  cvs.width=W*dpr; cvs.height=H*dpr;
  cvs.style.width=W+'px'; cvs.style.height=H+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);

  const cx=W/2, cy=H/2;
  const DEPTH=Math.max(W,H)*1.25, FOCAL=240;

  /* Star colour palette — weighted toward white */
  const COLS=[
    '252,252,255','255,255,255','248,248,252','255,255,255','252,252,255',
    '255,255,255','248,248,255','255,255,255',   // white (8 entries)
    '255,185,225','255,165,215','240,180,255',   // pink / lavender
    '200,170,255','215,185,255',                 // purple
    '255,225,135','255,215,105',                 // gold
    '175,238,255','160,228,252',                 // cyan-blue
  ];
  const pickCol=()=>COLS[Math.floor(Math.random()*COLS.length)];

  function makeStar(spread){
    return {
      x: rand(-W*1.35, W*1.35),
      y: rand(-H*1.35, H*1.35),
      z: spread ? rand(DEPTH*0.01, DEPTH) : DEPTH,
      px:null, py:null,
      col: pickCol(),
      w: 0.35+Math.random()*1.0
    };
  }

  const N = Math.max(160, Math.min(300, Math.floor(W*0.38)));
  const stars = Array.from({length:N}, ()=>makeStar(true));

  /* Solid initial fill */
  ctx.fillStyle='#03000d'; ctx.fillRect(0,0,W,H);

  let t0=null, tLast=null, spiralA=0;

  /* Speed curve: quick ramp → cruise → graceful decel */
  function getSpeed(p){
    if(p<0.14) return 55 + 1680*(p/0.14)*(p/0.14);
    if(p<0.58) return 1680 + Math.sin(p*12)*28; // subtle shimmer at cruise
    const d=(p-0.58)/0.42;
    return 1680*Math.pow(1-d, 1.9)+22;
  }

  /* Background deep-space colour — shifts from black → indigo → purple-magenta near galaxy */
  function bgRGB(p){
    const r = Math.round(3  + (p>0.48 ? (p-0.48)/0.52*22  : 0));
    const g = Math.round(0  + (p>0.6  ? (p-0.6)/0.4*4    : 0));
    const b = Math.round(13 + (p>0.25 ? (p-0.25)/0.75*48 : 0));
    return `${r},${g},${b}`;
  }

  /* Destination galaxy bloom — a real spiral galaxy grows ahead */
  function drawGalaxy(p){
    if(p<0.46) return;
    const prog = Math.pow((p-0.46)/0.54, 1.15);
    const maxR = Math.min(W,H)*0.58;
    const size = prog*maxR;
    const bA   = prog*0.92;

    ctx.save();
    ctx.translate(cx, cy);

    /* 1. Outer diffuse halo (round, no tilt) */
    const halo=ctx.createRadialGradient(0,0,size*0.5,0,0,size*1.4);
    halo.addColorStop(0,`rgba(130,65,210,${(bA*0.16).toFixed(3)})`);
    halo.addColorStop(0.6,`rgba(80,30,160,${(bA*0.07).toFixed(3)})`);
    halo.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=halo;
    ctx.beginPath(); ctx.arc(0,0,size*1.4,0,Math.PI*2); ctx.fill();

    /* 2. Tilted galactic disc */
    ctx.save();
    ctx.rotate(-0.42);
    ctx.scale(1.0, 0.38);

    const disc=ctx.createRadialGradient(0,0,0,0,0,size*1.05);
    disc.addColorStop(0,    `rgba(255,225,255,${Math.min(1,bA*1.08).toFixed(3)})`);
    disc.addColorStop(0.10, `rgba(240,155,255,${(bA*0.88).toFixed(3)})`);
    disc.addColorStop(0.28, `rgba(175,95,255, ${(bA*0.58).toFixed(3)})`);
    disc.addColorStop(0.55, `rgba(90, 35,195, ${(bA*0.24).toFixed(3)})`);
    disc.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle=disc;
    ctx.beginPath(); ctx.ellipse(0,0,size*1.05,size*1.05,0,0,Math.PI*2); ctx.fill();

    ctx.restore(); // remove disc tilt

    /* 3. Spiral arms (particle dots) */
    if(prog>0.28){
      const armA=(prog-0.28)/0.72;
      spiralA+=0.006;
      for(let arm=0;arm<2;arm++){
        const aOff=arm*Math.PI;
        for(let i=1;i<62;i++){
          const fr=i/62;
          const r2=fr*size*0.84;
          const ang=aOff+spiralA+fr*3.9;
          const ax=Math.cos(ang)*r2;
          const ay=Math.sin(ang)*r2*0.36;
          const pa=armA*(1-fr*fr)*0.72;
          if(pa<0.015) continue;
          const pr=Math.max(0.4,(1-fr)*3.8*prog);
          ctx.beginPath();
          ctx.arc(ax,ay,pr,0,Math.PI*2);
          ctx.fillStyle=`rgba(218,172,255,${pa.toFixed(3)})`;
          ctx.fill();
        }
      }
    }

    /* 4. Bright nucleus */
    const nSize=size*0.13;
    const nuc=ctx.createRadialGradient(0,0,0,0,0,nSize);
    nuc.addColorStop(0,`rgba(255,255,255,${Math.min(1,bA*1.1).toFixed(3)})`);
    nuc.addColorStop(0.35,`rgba(255,230,255,${(bA*0.85).toFixed(3)})`);
    nuc.addColorStop(0.7,`rgba(195,135,255,${(bA*0.4).toFixed(3)})`);
    nuc.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=nuc;
    ctx.beginPath(); ctx.arc(0,0,nSize,0,Math.PI*2); ctx.fill();

    /* 5. Lens flare cross (only near arrival) */
    if(prog>0.7){
      const flA=(prog-0.7)/0.3*0.35;
      const fl=nSize*3.5;
      ctx.strokeStyle=`rgba(255,240,255,${flA.toFixed(3)})`;
      ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.moveTo(-fl,0); ctx.lineTo(fl,0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-fl); ctx.lineTo(0,fl); ctx.stroke();
    }

    ctx.restore();
  }

  function frame(ts){
    if(!t0){ t0=ts; tLast=ts; }
    const dt=Math.min((ts-tLast)/1000, 0.05);
    tLast=ts;
    const elapsed=ts-t0;
    const p=Math.min(elapsed/TRAVEL_DURATION,1);
    const spd=getSpeed(p);

    /* Trail fade — shorter at slow speed, long at warp */
    const trailA=Math.max(0.09, Math.min(0.36, 1.0-spd/1720));
    ctx.fillStyle=`rgba(${bgRGB(p)},${trailA})`;
    ctx.fillRect(0,0,W,H);

    /* Stars */
    for(const s of stars){
      s.z-=spd*dt;
      if(s.z<=1){ Object.assign(s,makeStar(false)); continue; }
      const k=FOCAL/s.z;
      const sx=cx+s.x*k, sy=cy+s.y*k;
      if(sx<-90||sx>W+90||sy<-90||sy>H+90){ Object.assign(s,makeStar(false)); continue; }
      const cl=1-s.z/DEPTH;
      const rad=s.w*Math.max(0.22, cl*2.9);
      const al=Math.max(0.07, Math.min(1, cl*1.45+0.05));

      /* Streak trail */
      if(s.px!==null){
        const sf=Math.min(1,spd/650);
        const tx=sx+(s.px-sx)*(1-sf*0.72);
        const ty=sy+(s.py-sy)*(1-sf*0.72);
        ctx.strokeStyle=`rgba(${s.col},${al*0.88})`;
        ctx.lineWidth=rad*0.82; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(sx,sy); ctx.stroke();
      }

      /* Star head with glow */
      if(cl>0.5){ ctx.shadowBlur=rad*5; ctx.shadowColor=`rgba(${s.col},${al*0.55})`; }
      ctx.fillStyle=`rgba(${s.col},${al})`;
      ctx.beginPath(); ctx.arc(sx,sy,rad*0.48,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;

      s.px=sx; s.py=sy;
    }

    drawGalaxy(p);

    if(elapsed<TRAVEL_DURATION){ warpRafId=requestAnimationFrame(frame); }
    else{ cancelAnimationFrame(warpRafId); }
  }

  if(warpRafId) cancelAnimationFrame(warpRafId);
  warpRafId=requestAnimationFrame(frame);
}



/* ================================================================
   3-D GALAXY CHOICE — Three.js
   ================================================================ */
const GDEFS = [
  { id:'1', name:'Memories Galaxy 🌙', desc:'where our moments live',
    pos:[-16, 3,-10], c1:0xd4baff, c2:0x8a5cff, c3:0x2a0f6e, arms:3, tilt:.18 },
  { id:'2', name:'Love Galaxy 💗',     desc:'straight from the heart',
    pos:[ 16, 3,-10], c1:0xffb8dc, c2:0xff2d8a, c3:0x7a0038, arms:4, tilt:-.12 },
  { id:'3', name:'Dream Galaxy ✨',    desc:'wishes written in stars',
    pos:[-12,-5, 18], c1:0xfff3a0, c2:0xffb238, c3:0x5a3000, arms:2, tilt:.22 },
  { id:'4', name:'Future Galaxy 🌎',  desc:'everything still to come',
    pos:[ 12, 7, 18], c1:0xaff0ff, c2:0x2fb6e0, c3:0x003a50, arms:3, tilt:-.08 },
];

const G3D = {
  renderer:null, scene:null, camera:null, rafId:null,
  orbit:{ theta:0, phi:Math.PI/3.2, r:55 },
  autoRotate:true, isDragging:false, isFlying:false,
  galaxyGroups:[], hitSpheres:[], labelEls:[],
  prevX:0, prevY:0, totalDrag:0
};

function initGalaxy3D(){
  /* Rebuild label DOM every visit (they get wiped on screen change) */
  const cont = document.getElementById('galaxyLabels');
  cont.innerHTML = '';
  G3D.labelEls = GDEFS.map(d => {
    const el = document.createElement('div');
    el.className = 'galaxy-label';
    el.innerHTML = `<span class="lname">${d.name}</span><span class="ldesc">${d.desc}</span>`;
    el.addEventListener('click', () => selectGalaxy3D(d.id));
    cont.appendChild(el);
    return el;
  });
  G3D.isFlying = false;
  G3D.autoRotate = true;

  /* If renderer already built, just restart loop */
  if(G3D.renderer){
    if(G3D.rafId) cancelAnimationFrame(G3D.rafId);
    G3D.rafId = requestAnimationFrame(g3dLoop);
    return;
  }

  /* ── Renderer ── */
  const cvs = document.getElementById('galaxyCanvas');
  const W = window.innerWidth, H = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas:cvs, antialias:true, alpha:false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x020008, 1);
  G3D.renderer = renderer;

  /* ── Scene & Camera ── */
  const scene = new THREE.Scene();
  G3D.scene = scene;
  const camera = new THREE.PerspectiveCamera(58, W/H, 0.1, 700);
  G3D.camera = camera;
  g3dSetCamera();

  /* ── Background stars ── */
  const bN = 6000;
  const bP = new Float32Array(bN*3), bC = new Float32Array(bN*3);
  for(let i=0; i<bN; i++){
    bP[i*3]   = (Math.random()-.5)*500;
    bP[i*3+1] = (Math.random()-.5)*500;
    bP[i*3+2] = (Math.random()-.5)*500;
    const v = .45+Math.random()*.55;
    bC[i*3]=v*.88; bC[i*3+1]=v*.85; bC[i*3+2]=v;
  }
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute('position', new THREE.BufferAttribute(bP,3));
  bGeo.setAttribute('color',    new THREE.BufferAttribute(bC,3));
  scene.add(new THREE.Points(bGeo, new THREE.PointsMaterial({
    size:.35, sizeAttenuation:true, vertexColors:true,
    transparent:true, opacity:.7, depthWrite:false
  })));

  /* ── Nebula dust wisps ── */
  const wisp_colors=[0x5b1a63,0x1a0b50,0x3d0030,0x002040];
  wisp_colors.forEach((wc,wi)=>{
    const wN=300, wP=new Float32Array(wN*3);
    for(let i=0;i<wN;i++){
      const a=Math.random()*Math.PI*2, r2=30+Math.random()*80;
      wP[i*3]  = Math.cos(a)*r2+(wi%2===0?-20:20);
      wP[i*3+1]= (Math.random()-.5)*50;
      wP[i*3+2]= Math.sin(a)*r2+(wi<2?-15:15);
    }
    const wGeo=new THREE.BufferGeometry();
    wGeo.setAttribute('position',new THREE.BufferAttribute(wP,3));
    scene.add(new THREE.Points(wGeo,new THREE.PointsMaterial({
      color:wc, size:2.8, sizeAttenuation:true,
      transparent:true, opacity:.12, depthWrite:false
    })));
  });

  /* ── Spiral galaxy particle systems ── */
  G3D.galaxyGroups = [];
  G3D.hitSpheres   = [];
  const mobile = W < 600;
  const N  = mobile ? 4000 : 7500;   // arm particles
  const CN = mobile ?  450 :  900;   // core particles

  GDEFS.forEach(d => {
    const grp = new THREE.Group();
    grp.position.set(...d.pos);
    grp.rotation.x = d.tilt;
    grp.userData = { id:d.id };

    const C1=new THREE.Color(d.c1), C2=new THREE.Color(d.c2), C3=new THREE.Color(d.c3);
    const WHITE=new THREE.Color(1,1,1);

    /* Disc + arms */
    const pos=new Float32Array(N*3), col=new Float32Array(N*3);
    for(let i=0; i<N; i++){
      const i3=i*3;
      const r=Math.pow(Math.random(),.52)*11.5;

      if(r < 1.7){
        /* Central spherical bulge */
        const a=Math.random()*Math.PI*2;
        const e=Math.acos(2*Math.random()-1);
        pos[i3]  = Math.sin(e)*Math.cos(a)*r;
        pos[i3+1]= Math.cos(e)*r*.38;
        pos[i3+2]= Math.sin(e)*Math.sin(a)*r;
        const mc=C1.clone().lerp(WHITE,.55);
        col[i3]=mc.r; col[i3+1]=mc.g; col[i3+2]=mc.b;
      } else {
        /* Logarithmic spiral arms */
        const arm=Math.floor(Math.random()*d.arms);
        const angle=(arm/d.arms)*Math.PI*2 + r*0.78;
        const sc=(r/11.5)*2.9;
        /* Box-Muller-ish scatter for realistic arm width */
        const u1=Math.random()||1e-9, u2=Math.random();
        const gn=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
        pos[i3]  = Math.cos(angle)*r + gn*sc*.5;
        pos[i3+1]= (Math.random()-.5)*.22;
        pos[i3+2]= Math.sin(angle)*r + gn*sc*.5;
        const t=r/11.5;
        const mc=t<.5?C1.clone().lerp(C2,t*2):C2.clone().lerp(C3,(t-.5)*2);
        const br=1-t*.52;
        col[i3]=mc.r*br; col[i3+1]=mc.g*br; col[i3+2]=mc.b*br;
      }
    }
    const dGeo=new THREE.BufferGeometry();
    dGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    dGeo.setAttribute('color',   new THREE.BufferAttribute(col,3));
    grp.add(new THREE.Points(dGeo, new THREE.PointsMaterial({
      size:.11, sizeAttenuation:true, vertexColors:true,
      transparent:true, opacity:.95, depthWrite:false,
      blending:THREE.AdditiveBlending
    })));

    /* Bright glowing core */
    const cp=new Float32Array(CN*3), cc=new Float32Array(CN*3);
    for(let i=0; i<CN; i++){
      const a=Math.random()*Math.PI*2;
      const rv=Math.pow(Math.random(),1.6)*2.2;
      cp[i*3]  = Math.cos(a)*rv;
      cp[i*3+1]= (Math.random()-.5)*.14;
      cp[i*3+2]= Math.sin(a)*rv;
      const br=1-(rv/2.2)*.38;
      const mc=C1.clone().lerp(WHITE,.6);
      cc[i*3]=mc.r*br; cc[i*3+1]=mc.g*br; cc[i*3+2]=mc.b*br;
    }
    const cGeo=new THREE.BufferGeometry();
    cGeo.setAttribute('position',new THREE.BufferAttribute(cp,3));
    cGeo.setAttribute('color',   new THREE.BufferAttribute(cc,3));
    grp.add(new THREE.Points(cGeo, new THREE.PointsMaterial({
      size:.32, sizeAttenuation:true, vertexColors:true,
      transparent:true, opacity:1, depthWrite:false,
      blending:THREE.AdditiveBlending
    })));

    /* Outer halo scatter */
    const hN=Math.floor(N*.12), hP=new Float32Array(hN*3), hC=new Float32Array(hN*3);
    for(let i=0;i<hN;i++){
      const a=Math.random()*Math.PI*2, r2=9+Math.random()*4;
      const e=Math.acos(2*Math.random()-1);
      hP[i*3]=Math.sin(e)*Math.cos(a)*r2*.6;
      hP[i*3+1]=Math.cos(e)*r2*.12;
      hP[i*3+2]=Math.sin(e)*Math.sin(a)*r2*.6;
      hC[i*3]=C3.r*.6; hC[i*3+1]=C3.g*.6; hC[i*3+2]=C3.b*.6;
    }
    const hGeo=new THREE.BufferGeometry();
    hGeo.setAttribute('position',new THREE.BufferAttribute(hP,3));
    hGeo.setAttribute('color',   new THREE.BufferAttribute(hC,3));
    grp.add(new THREE.Points(hGeo, new THREE.PointsMaterial({
      size:.08, sizeAttenuation:true, vertexColors:true,
      transparent:true, opacity:.5, depthWrite:false,
      blending:THREE.AdditiveBlending
    })));

    scene.add(grp);
    G3D.galaxyGroups.push(grp);

    /* Invisible hit-sphere for raycasting */
    const hit=new THREE.Mesh(
      new THREE.SphereGeometry(10,8,8),
      new THREE.MeshBasicMaterial({visible:false, side:THREE.DoubleSide})
    );
    hit.position.set(...d.pos);
    hit.userData={id:d.id};
    scene.add(hit);
    G3D.hitSpheres.push(hit);
  });

  /* ── Pointer / drag orbit controls ── */
  const rc=new THREE.Raycaster(), mv2=new THREE.Vector2();

  function getHitId(cx,cy){
    const rect=cvs.getBoundingClientRect();
    mv2.x=((cx-rect.left)/rect.width)*2-1;
    mv2.y=-((cy-rect.top)/rect.height)*2+1;
    rc.setFromCamera(mv2, G3D.camera);
    const hits=rc.intersectObjects(G3D.hitSpheres);
    return hits.length ? hits[0].object.userData.id : null;
  }

  cvs.addEventListener('pointerdown', e=>{
    G3D.isDragging=true; G3D.prevX=e.clientX; G3D.prevY=e.clientY;
    G3D.totalDrag=0; G3D.autoRotate=false; e.preventDefault();
  },{passive:false});

  window.addEventListener('pointermove', e=>{
    if(!G3D.isDragging) return;
    const dx=e.clientX-G3D.prevX, dy=e.clientY-G3D.prevY;
    G3D.totalDrag+=Math.abs(dx)+Math.abs(dy);
    G3D.orbit.theta-=dx*.0072;
    G3D.orbit.phi=Math.max(.1,Math.min(Math.PI-.1,G3D.orbit.phi+dy*.0072));
    G3D.prevX=e.clientX; G3D.prevY=e.clientY;
    g3dSetCamera(); e.preventDefault();
  },{passive:false});

  window.addEventListener('pointerup', e=>{
    if(!G3D.isDragging) return;
    G3D.isDragging=false;
    if(G3D.totalDrag<16){
      const id=getHitId(e.clientX, e.clientY);
      if(id) selectGalaxy3D(id);
    }
    setTimeout(()=>{ G3D.autoRotate=true; },3500);
  });

  /* handle resize */
  window.addEventListener('resize',()=>{
    if(!G3D.renderer) return;
    const w=window.innerWidth,h=window.innerHeight;
    G3D.renderer.setSize(w,h);
    G3D.camera.aspect=w/h;
    G3D.camera.updateProjectionMatrix();
  });

  G3D.rafId = requestAnimationFrame(g3dLoop);
}

function g3dSetCamera(){
  const o=G3D.orbit;
  G3D.camera.position.set(
    o.r*Math.sin(o.phi)*Math.sin(o.theta),
    o.r*Math.cos(o.phi),
    o.r*Math.sin(o.phi)*Math.cos(o.theta)
  );
  G3D.camera.lookAt(0,0,0);
}

let _projVec = null;
function g3dUpdateLabels(){
  if(!G3D.renderer) return;
  if(!_projVec) _projVec = new THREE.Vector3();
  const W=G3D.renderer.domElement.offsetWidth;
  const H=G3D.renderer.domElement.offsetHeight;
  GDEFS.forEach((d,i)=>{
    /* Project a point 14 units below the galaxy disc */
    _projVec.set(d.pos[0], d.pos[1]-14, d.pos[2]);
    _projVec.project(G3D.camera);
    const x=(_projVec.x*.5+.5)*W;
    const y=(-_projVec.y*.5+.5)*H;
    const vis=_projVec.z<1 && x>-90&&x<W+90 && y>-60&&y<H+60;
    const el=G3D.labelEls[i];
    if(!el) return;
    el.style.left=x+'px';
    el.style.top =y+'px';
    el.style.opacity   = vis?'1':'0';
    el.style.pointerEvents = vis?'auto':'none';
  });
}

function selectGalaxy3D(id){
  if(G3D.isFlying) return;
  G3D.isFlying=true;
  currentGalaxy=id;

  /* Flash */
  const flash=document.getElementById('galaxyFlash');
  flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');

  /* Fly camera toward selected galaxy */
  const def=GDEFS.find(d=>d.id===id);
  const target=new THREE.Vector3(...def.pos);
  const startPos=G3D.camera.position.clone();
  /* destination = 20 units in front of galaxy, along the radius vector */
  const dir=target.clone().normalize();
  const dest=target.clone().sub(dir.clone().multiplyScalar(20));
  let tf=0;

  cancelAnimationFrame(G3D.rafId);
  function fly(){
    tf=Math.min(tf+.02,1);
    const ease=1-(1-tf)*(1-tf)*(1-tf); // cubic ease-out
    G3D.camera.position.lerpVectors(startPos,dest,ease);
    G3D.camera.lookAt(target);
    G3D.renderer.render(G3D.scene,G3D.camera);
    if(tf<1){ G3D.rafId=requestAnimationFrame(fly); }
    else{ setTimeout(()=>{ G3D.isFlying=false; openLetterScreen(id); },340); }
  }
  G3D.rafId=requestAnimationFrame(fly);
}

function g3dLoop(){
  if(!G3D.renderer||document.getElementById('choice').classList.contains('hidden')) return;
  G3D.rafId=requestAnimationFrame(g3dLoop);
  /* Self-spin each galaxy at slightly different speeds */
  G3D.galaxyGroups.forEach((g,i)=>{ g.rotation.y+=.0014+i*.00025; });
  /* Gentle auto-orbit when idle */
  if(G3D.autoRotate&&!G3D.isDragging){
    G3D.orbit.theta+=.0024; g3dSetCamera();
  }
  g3dUpdateLabels();
  G3D.renderer.render(G3D.scene,G3D.camera);
}

/* ---------------- Letters & Envelope ----------------*/
const letters = {
  1:{ icon:'🌙', title:'Memories Galaxy', color:'#c9a7ff',
      bg:'radial-gradient(circle at 50% 18%,#3d1a6e,#1a0b3d 55%,#05010f)',
      text:"Happy Birthday, my love 💕\n\nI hope your day is wrapped in every happiness you deserve. Every memory we've shared together feels like a star I never want to stop counting. The little moments, the quiet ones, the ones only we'd remember — I keep them all.\n\nThank you for being part of my story. Here's to a thousand more memories with you. 🌙✨" },
  2:{ icon:'💗', title:'Love Galaxy', color:'#ff69b4',
      bg:'radial-gradient(circle at 50% 18%,#6e1a45,#3d0b1a 55%,#05010f)',
      text:"You are someone very special to me 💗\n\nFrom the moment you came into my life, things felt a little brighter, a little softer, a little more magical. I find myself thinking about you more than I'd ever admit — but today is the one day I will.\n\nHappy Birthday to the person who carries my whole heart without even knowing it. 💖" },
  3:{ icon:'✨', title:'Dream Galaxy', color:'#ffd86b',
      bg:'radial-gradient(circle at 50% 18%,#4a3000,#251600 55%,#05010f)',
      text:"May all your dreams come true ✨\n\nI hope this new year of your life brings you closer to everything you've ever wished for — the big, audacious dreams and the small, tender ones. You deserve every single one of them.\n\nKeep dreaming beautifully. I'll always be cheering for you from wherever I am. 🌠" },
  4:{ icon:'🌎', title:'Future Galaxy', color:'#6cddff',
      bg:'radial-gradient(circle at 50% 18%,#003d5a,#001a2d 55%,#05010f)',
      text:"Thank you for being amazing 🌎\n\nI can't wait to see what the future holds for you — every chapter of your life is something worth watching unfold. And honestly? I really hope I get to be there for it.\n\nHappy Birthday. The best is still ahead of us. Here's to the future. 💫" },
};

let currentGalaxy = null;

/* Per-galaxy seal emojis */
const SEALS = {'1':'💌','2':'💝','3':'💫','4':'🌍'};

function openLetterScreen(g){
  goTo('letterScreen');

  /* Galaxy-specific theme */
  const ltr = letters[g];
  document.getElementById('letterScreen').style.background = ltr.bg;

  /* Floating deco */
  const deco = document.getElementById('letterDeco');
  deco.innerHTML='';
  const emojis={'1':['🌙','✦','💜'],'2':['💗','✨','💕'],'3':['✨','⭐','💛'],'4':['🌎','💙','✦']};
  startFloatLoop(deco, emojis[g]||['✨'], 2, ()=>ltr.color);
  spawnSparkles(deco, 22);

  /* Reset envelope state */
  const env      = document.getElementById('envelope');
  const wrap     = document.getElementById('envelopeWrap');
  const card     = document.getElementById('letterCard');
  const seal     = document.getElementById('envSeal');
  const hint     = document.getElementById('tapHint');

  env.classList.remove('open');
  wrap.style.cssText  = '';
  card.style.display  = 'none';
  card.classList.remove('letter-rising');
  seal.textContent    = SEALS[g]||'💌';
  hint.style.opacity  = '1';

  /* Open on tap */
  function doOpen(){
    env.removeEventListener('click', doOpen);
    hint.style.opacity='0';
    wrap.classList.add('opening');

    /* 1) Quick scale-up surge (eager) */
    env.style.transition='transform .18s cubic-bezier(.34,1.56,.64,1)';
    env.style.transform='scale(1.06)';

    setTimeout(()=>{
      /* 2) Settle back + flap starts lifting */
      env.style.transition='transform .22s ease';
      env.style.transform='scale(1)';
      env.classList.add('open');   /* flap rotates back via CSS */
    }, 160);

    setTimeout(()=>{
      /* 3) Spawn burst of sparkles from seal position */
      const rect=seal.getBoundingClientRect();
      burstSealParticles(rect.left+rect.width/2, rect.top+rect.height/2, ltr.color, deco);
    }, 450);

    setTimeout(()=>{
      /* 4) Envelope sinks away */
      wrap.style.transition='opacity .55s ease, transform .55s ease';
      wrap.style.opacity='0';
      wrap.style.transform='translateY(38px) scale(.88)';
    }, 820);

    setTimeout(()=>{
      /* 5) Letter card rises in */
      wrap.style.display='none';
      card.style.display='block';
      card.classList.add('letter-rising');
      /* Fill content */
      document.getElementById('letterIcon').textContent  = ltr.icon;
      document.getElementById('letterTitle').textContent = ltr.title;
      typeLetter(g);
    }, 1180);
  }

  env.addEventListener('click', doOpen);
}

/* Particle burst from seal position when it opens */
function burstSealParticles(ox, oy, color, container){
  const emojis=['✨','💫','⭐','✦','💕','🌟'];
  for(let i=0;i<18;i++){
    const el=document.createElement('div');
    el.style.cssText=`position:fixed;pointer-events:none;font-size:${12+Math.random()*14}px;
      left:${ox}px;top:${oy}px;z-index:999;`;
    el.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    const angle=Math.random()*Math.PI*2;
    const dist=60+Math.random()*110;
    const tx=Math.cos(angle)*dist, ty=Math.sin(angle)*dist;
    el.style.animation='none';
    el.style.transition=`transform ${0.6+Math.random()*0.5}s cubic-bezier(.25,.46,.45,.94),opacity .5s ease ${0.2+Math.random()*0.3}s`;
    document.body.appendChild(el);
    requestAnimationFrame(()=>{
      el.style.transform=`translate(${tx}px,${ty}px) scale(0)`;
      el.style.opacity='0';
    });
    setTimeout(()=>el.remove(), 1200);
  }
}

function typeLetter(g){
  const data=letters[g];
  const textEl=document.getElementById('letterText');
  textEl.innerHTML='';
  let i=0;
  const cursor=document.createElement('span');
  cursor.className='typewriter-cursor'; cursor.textContent='\u00A0';

  function typeChar(){
    if(i<data.text.length){
      textEl.textContent=data.text.slice(0,i+1);
      textEl.appendChild(cursor);
      i++;
      setTimeout(typeChar, i<3?0:22);
    } else { cursor.remove(); }
  }
  typeChar();
}

document.getElementById('backBtn').addEventListener('click', ()=>{
  goTo('choice');
  initGalaxy3D();
});

document.getElementById('continueBtn').addEventListener('click', ()=>{
  goTo('courtScreen');
  if(!courtDecoStarted){ initCourtDeco(); }
});

/* ---------------- Court question screen ---------------- */
let courtDecoStarted = false;
function initCourtDeco(){
  courtDecoStarted = true;
  const courtDeco = document.getElementById('courtDeco');
  spawnSparkles(courtDeco, 22);
  startFloatLoop(courtDeco, ['💘','💗','✨'], 3, ()=> ['#ff69b4','#ffc1e3','#ffd86b'][Math.floor(rand(0,3))]);
}

let selectedAnswer = null;
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const submitBtn = document.getElementById('submitBtn');
const feedbackBox = document.getElementById('feedbackBox');
const courtStatus = document.getElementById('courtStatus');

function selectAnswer(answer){
  selectedAnswer = answer;
  yesBtn.classList.toggle('selected', answer === 'yes');
  noBtn.classList.toggle('selected', answer === 'no');
  submitBtn.disabled = false;
}
yesBtn.addEventListener('click', ()=> selectAnswer('yes'));
noBtn.addEventListener('click', ()=> selectAnswer('no'));

// Change this to wherever save_response.php is hosted, e.g. "https://yourdomain.com/save_response.php"
const SAVE_ENDPOINT = 'save_response.php';

submitBtn.addEventListener('click', async ()=>{
  if(!selectedAnswer) return;
  submitBtn.disabled = true;
  courtStatus.textContent = 'Sending your answer...';

  const payload = {
    answer: selectedAnswer,
    feedback: feedbackBox.value.trim(),
    galaxy: currentGalaxy || ''
  };

  try{
    const res = await fetch(SAVE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=>({success:false}));

    if(data && data.success){
      courtStatus.textContent = '';
      showThanks(selectedAnswer);
    } else {
      courtStatus.textContent = "Couldn't save right now, but I still see your answer 💗";
      showThanks(selectedAnswer);
    }
  } catch(err){
    courtStatus.textContent = "Couldn't reach the server, but I still see your answer 💗";
    showThanks(selectedAnswer);
  }
});

function showThanks(answer){
  document.getElementById('courtForm').style.display = 'none';
  const thanks = document.getElementById('courtThanks');
  thanks.style.display = 'block';
  if(answer === 'yes'){
    document.getElementById('thanksTitle').textContent = 'Yay! 🥹💗';
    document.getElementById('thanksSub').textContent = "You just made me the happiest person alive. I can't wait for what's ahead, together.";
    burstPoppers(document.getElementById('courtDeco'));
  } else {
    document.getElementById('thanksTitle').textContent = 'Thank you for being honest 💗';
    document.getElementById('thanksSub').textContent = "Whatever you choose, I'm grateful you spent your birthday with this little surprise.";
  }
}