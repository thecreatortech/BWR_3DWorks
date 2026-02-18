// BWR 3D Works — Where Rebellion Meets Precision
// Complete React E-Commerce App with WebGL PBR Shaders
// =====================================================

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// =====================================================
// DESIGN TOKENS (CSS Variables injected via style tag)
// =====================================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@200;300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --white: #ffffff;
      --off-white: #f7f7f7;
      --near-white: #f0f0f0;
      --gray-50: #fafafa;
      --gray-100: #ebebeb;
      --gray-200: #d6d6d6;
      --gray-300: #b0b0b0;
      --gray-400: #888;
      --gray-600: #444;
      --gray-800: #1a1a1a;
      --gray-900: #111;
      --black: #000000;
      --accent: #1a1a1a;
      --font-sans: 'DM Sans', -apple-system, sans-serif;
      --font-display: 'Cormorant Garamond', Georgia, serif;
      --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
      --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
      --ease-smooth: cubic-bezier(0.65, 0, 0.35, 1);
    }

    html { font-size: 16px; -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }

    body {
      background: var(--white);
      color: var(--black);
      font-family: var(--font-sans);
      font-weight: 300;
      overflow-x: hidden;
      cursor: none;
    }

    /* CUSTOM CURSOR */
    #cur-dot {
      position: fixed; width: 6px; height: 6px;
      background: var(--black); border-radius: 50%;
      pointer-events: none; z-index: 99999;
      transform: translate(-50%,-50%);
      transition: width .25s, height .25s, background .3s;
      will-change: transform;
    }
    #cur-ring {
      position: fixed; width: 38px; height: 38px;
      border: 1.5px solid rgba(0,0,0,0.4); border-radius: 50%;
      pointer-events: none; z-index: 99998;
      transform: translate(-50%,-50%);
      transition: width .4s var(--ease-out), height .4s var(--ease-out), border-color .3s, background .3s;
      will-change: transform;
    }
    #cur-dot.on-dark { background: var(--white); }
    #cur-ring.on-dark { border-color: rgba(255,255,255,0.5); }
    #cur-dot.hover { width: 14px; height: 14px; mix-blend-mode: difference; }
    #cur-ring.hover { width: 64px; height: 64px; border-color: rgba(0,0,0,0.15); background: rgba(0,0,0,0.04); }

    /* BUTTONS */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 15px 34px; font-family: var(--font-sans);
      font-size: 13px; font-weight: 500; letter-spacing: 0.05em;
      text-decoration: none; border: none; cursor: pointer;
      position: relative; overflow: hidden;
      transition: transform .3s var(--ease-out), box-shadow .3s;
      -webkit-font-smoothing: antialiased;
    }
    .btn::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.12); opacity: 0; transition: opacity .3s; }
    .btn:hover::after { opacity: 1; }
    .btn:hover { transform: translateY(-2px); }
    .btn:active { transform: translateY(0); }
    .btn-white { background: var(--white); color: var(--black); }
    .btn-white:hover { box-shadow: 0 8px 32px rgba(255,255,255,0.25); }
    .btn-white::after { background: rgba(0,0,0,0.05); }
    .btn-ghost { background: rgba(255,255,255,0.08); color: var(--white); border: 1px solid rgba(255,255,255,0.18); backdrop-filter: blur(10px); }
    .btn-ghost:hover { box-shadow: 0 8px 32px rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.4); }
    .btn-dark { background: var(--black); color: var(--white); }
    .btn-dark:hover { box-shadow: 0 8px 36px rgba(0,0,0,0.3); }
    .btn-outline-dark { background: transparent; color: var(--black); border: 1.5px solid rgba(0,0,0,0.2); }
    .btn-outline-dark:hover { border-color: var(--black); box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .btn-outline-dark::after { background: rgba(0,0,0,0.03); }
    .btn-full { width: 100%; justify-content: center; }

    /* SCROLL REVEAL */
    .reveal { opacity: 0; transform: translateY(50px); transition: opacity .9s var(--ease-out), transform .9s var(--ease-out); }
    .reveal.in { opacity: 1; transform: translateY(0); }
    .reveal.d1 { transition-delay: .1s; }
    .reveal.d2 { transition-delay: .2s; }
    .reveal.d3 { transition-delay: .3s; }
    .reveal.d4 { transition-delay: .4s; }

    /* HERO */
    @keyframes aUp { to { opacity: 1; transform: translateY(0); } }
    @keyframes scanLine { 0%{left:-100%} 100%{left:200%} }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
    @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
    @keyframes csIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    @keyframes toastIn { to{transform:translateX(-50%) translateY(0)} }

    /* NOISE TEXTURE */
    body::before {
      content: ''; position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: 0.018; pointer-events: none; z-index: 99999;
    }

    canvas { display: block; }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      body { cursor: auto; }
      #cur-dot, #cur-ring { display: none; }
    }
  `}</style>
);

// =====================================================
// PRODUCTS DATA — with Sketchfab embed IDs
// =====================================================
const PRODUCTS = [
  {
    id: 1, name: 'Orbital Vase No.7', cat: 'home', price: 348,
    desc: 'A sculptural study in negative space. Fluid curvature meets mathematical precision. Printed at 0.05mm layer resolution — near-invisible surface topology.',
    badge: 'Limited', geom: 'vase',
    sketchfabId: 'a8f91f71faff45fdbea9fe0e88ae77a6', // Decorative vase
    specs: [['Material','PETG Matte'],['Resolution','0.05mm'],['Finish','Hand-polished'],['Ships In','3–5 Days'],['Edition','12 Units']]
  },
  {
    id: 2, name: 'Helical Tower', cat: 'architectural', price: 520,
    desc: 'Parametric stacking geometry. An architectural column at domestic scale. Twelve interleaving spirals resolve into a singular vertical statement.',
    badge: 'New', geom: 'helical',
    sketchfabId: '9a59b82f98f34ae6a3a39b1b85c22fda',
    specs: [['Material','PLA+ Obsidian'],['Resolution','0.08mm'],['Finish','Micro-polished'],['Ships In','5–7 Days'],['Edition','12 Units']]
  },
  {
    id: 3, name: 'Void Sphere', cat: 'home', price: 289,
    desc: 'Pure form. 800 intersecting planes creating structural void. A meditation on presence and absence rendered in precision polymer.',
    badge: '', geom: 'sphere',
    sketchfabId: 'd425eb3d30bf435faa4b96b36e1a3ab3',
    specs: [['Material','PETG Pearl'],['Resolution','0.06mm'],['Finish','Satin'],['Ships In','3–5 Days'],['Edition','24 Units']]
  },
  {
    id: 4, name: 'Lattice Cuff', cat: 'wearables', price: 195,
    desc: 'Wearable precision engineering. Printed at 0.08mm for micro-flex. The structure breathes with your movement — rigid yet alive.',
    badge: 'Sold Out', geom: 'ring',
    sketchfabId: 'f8e0deaa28694e479bb01d8028da47cb',
    specs: [['Material','Flexible TPU'],['Resolution','0.08mm'],['Finish','Raw texture'],['Ships In','7–10 Days'],['Edition','30 Units']]
  },
  {
    id: 5, name: 'Arc Plinth', cat: 'architectural', price: 720,
    desc: 'A plinth that is itself the sculpture. Monolithic black. The base becomes the statement — commanding negative space with gravitational authority.',
    badge: 'Limited', geom: 'vase',
    sketchfabId: '1e1d7b4d5e374a8db97de8a6fc0ef0dc',
    specs: [['Material','PLA Matte Black'],['Resolution','0.05mm'],['Finish','12-step hand finish'],['Ships In','7–10 Days'],['Edition','8 Units']]
  },
  {
    id: 6, name: 'Moiré Pendant', cat: 'wearables', price: 168,
    desc: 'Optical interference made wearable. Two concentric lattice layers produce shifting moiré patterns as light and angle change.',
    badge: '', geom: 'torus',
    sketchfabId: 'b07ad48b1b9941939e9a9d9c93c5ea73',
    specs: [['Material','Transparent PETG'],['Resolution','0.07mm'],['Finish','Clear-coat'],['Ships In','3–5 Days'],['Edition','48 Units']]
  },
  {
    id: 7, name: 'Fractal Bowl', cat: 'home', price: 312,
    desc: 'Infinitely complex surface topology. L-system branching resolved at 0.05mm render depth. A functional object that rewards prolonged study.',
    badge: 'New', geom: 'sphere',
    sketchfabId: '3b33e7b0d57041d79ea7ef6a65534e1b',
    specs: [['Material','PETG Frost'],['Resolution','0.05mm'],['Finish','Sanded + sealed'],['Ships In','5–7 Days'],['Edition','12 Units']]
  },
  {
    id: 8, name: 'Column Series I', cat: 'architectural', price: 890,
    desc: 'Architectural column at 1:10 scale. Museum-grade finish. Twelve fluted ribs dissolve into a capital of impossible delicacy at 0.04mm.',
    badge: 'Limited', geom: 'helical',
    sketchfabId: 'c8f5c5d3a2c74c21abfae30ffd4cef3c',
    specs: [['Material','PLA+ Marble'],['Resolution','0.04mm'],['Finish','Automotive grade'],['Ships In','10–14 Days'],['Edition','6 Units']]
  },
  {
    id: 9, name: 'Mesh Ring', cat: 'wearables', price: 145,
    desc: 'Parametric mesh structure. Sized to order. 340 interconnected nodes — individually modelled and resolved into a unified wearable topology.',
    badge: '', geom: 'ring',
    sketchfabId: 'f8e0deaa28694e479bb01d8028da47cb',
    specs: [['Material','Nylon PA12'],['Resolution','0.08mm'],['Finish','Natural'],['Ships In','5–7 Days'],['Edition','Unlimited']]
  },
];

const CATEGORIES = ['all', 'home', 'architectural', 'wearables'];
const GEOMS = ['vase','torus','sphere','helical','ring'];

// =====================================================
// WEBGL ENGINE — PBR Shaders + Procedural Geometry
// =====================================================
class WebGLScene {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.opts = opts;
    this.running = false;
    this.gl = null;
    this.init();
  }

  init() {
    const canvas = this.canvas;
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true }) ||
               canvas.getContext('experimental-webgl', { antialias: true, alpha: true });
    if (!gl) return;
    this.gl = gl;
    this.dpr = Math.min(window.devicePixelRatio, 2);

    // --- Vertex Shader ---
    const vs = `
      attribute vec3 aPos;
      attribute vec3 aNorm;
      uniform mat4 uMVP;
      uniform mat4 uNorm;
      varying vec3 vN;
      varying vec3 vWorld;
      void main(){
        gl_Position = uMVP * vec4(aPos, 1.0);
        vN = normalize(mat3(uNorm) * aNorm);
        vWorld = aPos;
      }`;

    // --- PBR Fragment Shader ---
    const bgVal = (this.opts.bg !== undefined ? this.opts.bg : 0.97).toFixed(1);
    const fs = `
      precision highp float;
      varying vec3 vN;
      varying vec3 vWorld;
      uniform vec3 uColor;
      uniform vec3 uCam;
      uniform float uRough;
      uniform float uMetal;
      uniform float uTime;
      uniform int uWire;

      vec3 fresnelSchlick(float cosTheta, vec3 F0){
        return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
      }
      float distributionGGX(vec3 N, vec3 H, float roughness){
        float a = roughness * roughness;
        float a2 = a * a;
        float NdH = max(dot(N, H), 0.0);
        float NdH2 = NdH * NdH;
        float denom = NdH2 * (a2 - 1.0) + 1.0;
        return a2 / (3.14159265 * denom * denom);
      }
      float geometrySchlickGGX(float NdV, float roughness){
        float r = roughness + 1.0;
        float k = (r * r) / 8.0;
        return NdV / (NdV * (1.0 - k) + k);
      }
      float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness){
        float NdV = max(dot(N, V), 0.0);
        float NdL = max(dot(N, L), 0.0);
        return geometrySchlickGGX(NdV, roughness) * geometrySchlickGGX(NdL, roughness);
      }
      void main(){
        if(uWire == 1){ gl_FragColor = vec4(0.0, 0.0, 0.0, 0.35); return; }
        vec3 N = normalize(vN);
        vec3 V = normalize(uCam - vWorld);
        vec3 albedo = uColor;
        float roughness = max(uRough, 0.04);
        float metallic = uMetal;
        vec3 F0 = mix(vec3(0.04), albedo, metallic);

        vec3 Lo = vec3(0.0);
        vec3 lightDirs[3];
        lightDirs[0] = normalize(vec3(3.0, 5.0, 4.0));
        lightDirs[1] = normalize(vec3(-2.0, 3.0, -3.0));
        lightDirs[2] = normalize(vec3(0.0, -2.0, 2.0));
        float lightInts[3];
        lightInts[0] = 2.4;
        lightInts[1] = 1.2;
        lightInts[2] = 0.6;

        for(int i = 0; i < 3; i++){
          vec3 L = lightDirs[i];
          vec3 H = normalize(V + L);
          float NdL = max(dot(N, L), 0.0);
          vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);
          float D = distributionGGX(N, H, roughness);
          float G = geometrySmith(N, V, L, roughness);
          vec3 numerator = D * G * F;
          float denominator = 4.0 * max(dot(N, V), 0.0) * NdL + 0.001;
          vec3 specular = numerator / denominator;
          vec3 kD = (vec3(1.0) - F) * (1.0 - metallic);
          Lo += (kD * albedo / 3.14159265 + specular) * NdL * lightInts[i];
        }

        float ao = 0.5 + 0.5 * dot(N, vec3(0.0, 1.0, 0.0));
        vec3 ambient = albedo * mix(vec3(0.02), vec3(0.08), ao) * (${bgVal} > 0.5 ? 1.0 : 0.7);
        float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.25;
        vec3 rimColor = (${bgVal} > 0.5) ? vec3(0.0) : vec3(1.0);

        vec3 color = Lo + ambient + rim * rimColor;
        color = color / (color + vec3(1.0));
        color = pow(color, vec3(1.0 / 2.2));
        gl_FragColor = vec4(color, 1.0);
      }`;

    const mkShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    this.prog = gl.createProgram();
    gl.attachShader(this.prog, mkShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(this.prog, mkShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(this.prog);
    gl.useProgram(this.prog);

    this.loc = {
      aPos: gl.getAttribLocation(this.prog, 'aPos'),
      aNorm: gl.getAttribLocation(this.prog, 'aNorm'),
      uMVP: gl.getUniformLocation(this.prog, 'uMVP'),
      uNorm: gl.getUniformLocation(this.prog, 'uNorm'),
      uColor: gl.getUniformLocation(this.prog, 'uColor'),
      uCam: gl.getUniformLocation(this.prog, 'uCam'),
      uRough: gl.getUniformLocation(this.prog, 'uRough'),
      uMetal: gl.getUniformLocation(this.prog, 'uMetal'),
      uTime: gl.getUniformLocation(this.prog, 'uTime'),
      uWire: gl.getUniformLocation(this.prog, 'uWire'),
    };

    // Build geometry
    const geomFns = { vase: () => this.mkVase(), torus: () => this.mkTorus(), helical: () => this.mkHelical(), sphere: () => this.mkSphere(), ring: () => this.mkRing() };
    this.geom = (geomFns[this.opts.geom] || geomFns.vase)();

    // State
    this.rotYaw = 0.3;
    this.rotPitch = 0.18;
    this.dist = 3.6;
    this.autoRot = true;
    this.autoSpeed = this.opts.speed || 0.004;
    this.dragging = false;
    this.lastX = 0; this.lastY = 0;
    this.wireframe = false;
    this.time = 0;
    this.color = this.opts.color || [0.06, 0.06, 0.06];
    this.rough = this.opts.rough !== undefined ? this.opts.rough : 0.3;
    this.metal = this.opts.metal !== undefined ? this.opts.metal : 0.1;
    this.bgColor = this.opts.bg !== undefined ? this.opts.bg : 0.97;

    this.bindEvents();

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    this.running = true;
    this.frame();
  }

  resize() {
    const { canvas, gl, dpr } = this;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.W = w; this.H = h;
  }

  build(vArr, nArr, iArr) {
    const gl = this.gl;
    const vF = new Float32Array(vArr);
    const nF = new Float32Array(nArr);
    let iType, iF;
    if (vArr.length / 3 > 65535 || iArr.length > 65535) {
      const ext = gl.getExtension('OES_element_index_uint');
      iF = ext ? new Uint32Array(iArr) : new Uint16Array(iArr.map(x => x % 65535));
      iType = gl.UNSIGNED_INT;
    } else {
      iF = new Uint16Array(iArr);
      iType = gl.UNSIGNED_SHORT;
    }
    const vb = gl.createBuffer(), nb = gl.createBuffer(), ib = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, vF, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, nb); gl.bufferData(gl.ARRAY_BUFFER, nF, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, iF, gl.STATIC_DRAW);
    return { vb, nb, ib, cnt: iArr.length, type: iType };
  }

  mkTorus(R = 0.62, r = 0.22, mseg = 80, tseg = 40) {
    const v = [], n = [], idx = [];
    for (let i = 0; i <= mseg; i++) {
      const u = i / mseg * Math.PI * 2;
      for (let j = 0; j <= tseg; j++) {
        const v2 = j / tseg * Math.PI * 2;
        const x = (R + r * Math.cos(v2)) * Math.cos(u);
        const y = r * Math.sin(v2);
        const z = (R + r * Math.cos(v2)) * Math.sin(u);
        v.push(x, y, z);
        const cx = R * Math.cos(u), cz = R * Math.sin(u);
        n.push((x - cx) / r, y / r, (z - cz) / r);
      }
    }
    for (let i = 0; i < mseg; i++) for (let j = 0; j < tseg; j++) {
      const a = i * (tseg + 1) + j, b = a + 1, c = a + (tseg + 1), d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
    return this.build(v, n, idx);
  }

  mkVase() {
    const v = [], n = [], idxA = [], segs = 80;
    const profile = [];
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const y = (t - 0.5) * 2.6;
      const s = Math.sin(t * Math.PI);
      const r = 0.38 * s + 0.1 + 0.14 * Math.sin(t * Math.PI * 4.5) * s * s + 0.06 * Math.sin(t * Math.PI * 9) * s;
      profile.push([r, y]);
    }
    for (let i = 0; i < profile.length; i++) {
      for (let j = 0; j <= segs; j++) {
        const ang = j / segs * Math.PI * 2;
        const [ri, yi] = profile[i];
        v.push(ri * Math.cos(ang), yi, ri * Math.sin(ang));
        let dr = 0, dy2 = 0;
        if (i < profile.length - 1) { dr = profile[i + 1][0] - ri; dy2 = profile[i + 1][1] - yi; }
        else { dr = ri - profile[i - 1][0]; dy2 = yi - profile[i - 1][1]; }
        const L = Math.sqrt(dr * dr + dy2 * dy2) || 1;
        n.push((dy2 / L) * Math.cos(ang), (-dr / L), (dy2 / L) * Math.sin(ang));
      }
    }
    for (let i = 0; i < profile.length - 1; i++) for (let j = 0; j < segs; j++) {
      const a = i * (segs + 1) + j, b = a + 1, c = a + (segs + 1), d = c + 1;
      idxA.push(a, b, c, b, d, c);
    }
    return this.build(v, n, idxA);
  }

  mkHelical() {
    const v = [], n = [], idxA = [], segs = 64;
    const turns = 3.2, height = 2.6, baseR = 0.35, twist = 0.8;
    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const y = (t - 0.5) * height;
      const tw = Math.sin(t * Math.PI) * twist;
      const r = baseR + 0.18 * Math.sin(t * Math.PI) * Math.sin(t * turns * Math.PI * 2);
      pts.push([r, y, tw]);
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = 0; j <= segs; j++) {
        const ang = j / segs * Math.PI * 2 + pts[i][2];
        const [ri, yi] = pts[i];
        v.push(ri * Math.cos(ang), yi, ri * Math.sin(ang));
        let dr = 0, dy2 = 0;
        if (i < pts.length - 1) { dr = pts[i + 1][0] - ri; dy2 = pts[i + 1][1] - yi; }
        else { dr = ri - pts[i - 1][0]; dy2 = yi - pts[i - 1][1]; }
        const L = Math.sqrt(dr * dr + dy2 * dy2) || 1;
        n.push((dy2 / L) * Math.cos(ang), (-dr / L), (dy2 / L) * Math.sin(ang));
      }
    }
    for (let i = 0; i < pts.length - 1; i++) for (let j = 0; j < segs; j++) {
      const a = i * (segs + 1) + j, b = a + 1, c = a + (segs + 1), d = c + 1;
      idxA.push(a, b, c, b, d, c);
    }
    return this.build(v, n, idxA);
  }

  mkSphere(subdivs = 5) {
    const t = (1 + Math.sqrt(5)) / 2;
    let verts = [[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]]
      .map(v => { const l = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2); return [v[0]/l, v[1]/l, v[2]/l]; });
    let faces = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
    const mid = {};
    const midpoint = (a, b) => {
      const k = Math.min(a,b) + '_' + Math.max(a,b);
      if (mid[k] !== undefined) return mid[k];
      const va = verts[a], vb = verts[b];
      const mx = (va[0]+vb[0])/2, my = (va[1]+vb[1])/2, mz = (va[2]+vb[2])/2;
      const l = Math.sqrt(mx*mx + my*my + mz*mz);
      const idx2 = verts.length;
      verts.push([mx/l, my/l, mz/l]);
      return mid[k] = idx2;
    };
    for (let s = 0; s < subdivs; s++) {
      const nf = [];
      for (const [a, b, c] of faces) {
        const ab = midpoint(a,b), bc = midpoint(b,c), ca = midpoint(c,a);
        nf.push([a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]);
      }
      faces = nf;
    }
    const v2 = [], n2 = [], idx2 = [];
    verts.forEach(([x,y,z]) => { v2.push(x*.82, y*.82, z*.82); n2.push(x, y, z); });
    faces.forEach(([a,b,c]) => idx2.push(a, b, c));
    return this.build(v2, n2, idx2);
  }

  mkRing() { return this.mkTorus(0.55, 0.18, 64, 32); }

  m4mul(a, b) {
    const r = new Float32Array(16);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[i*4+k] * b[k*4+j];
      r[i*4+j] = s;
    }
    return r;
  }
  persp(fov, asp, n, f) {
    const ff = 1 / Math.tan(fov / 2);
    return new Float32Array([ff/asp,0,0,0,0,ff,0,0,0,0,(f+n)/(n-f),-1,0,0,2*f*n/(n-f),0]);
  }
  rotX(a) { return new Float32Array([1,0,0,0,0,Math.cos(a),-Math.sin(a),0,0,Math.sin(a),Math.cos(a),0,0,0,0,1]); }
  rotY(a) { return new Float32Array([Math.cos(a),0,Math.sin(a),0,0,1,0,0,-Math.sin(a),0,Math.cos(a),0,0,0,0,1]); }
  trans(x, y, z) { return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]); }
  inv4(m) {
    const r = new Float32Array(16);
    r[0]=m[0]; r[1]=m[4]; r[2]=m[8]; r[3]=0;
    r[4]=m[1]; r[5]=m[5]; r[6]=m[9]; r[7]=0;
    r[8]=m[2]; r[9]=m[6]; r[10]=m[10]; r[11]=0;
    r[12]=0; r[13]=0; r[14]=0; r[15]=1;
    return r;
  }

  bindEvents() {
    const c = this.canvas;
    const onDown = e => {
      this.dragging = true; this.autoRot = false;
      const p = e.touches ? e.touches[0] : e;
      this.lastX = p.clientX; this.lastY = p.clientY;
      e.preventDefault();
    };
    const onMove = e => {
      if (!this.dragging) return;
      const p = e.touches ? e.touches[0] : e;
      this.rotYaw += (p.clientX - this.lastX) * 0.006;
      this.rotPitch += (p.clientY - this.lastY) * 0.005;
      this.rotPitch = Math.max(-1.4, Math.min(1.4, this.rotPitch));
      this.lastX = p.clientX; this.lastY = p.clientY;
      e.preventDefault();
    };
    const onUp = () => {
      this.dragging = false;
      setTimeout(() => { if (!this.dragging) this.autoRot = true; }, 2200);
    };
    const onWheel = e => {
      this.dist += e.deltaY * 0.002;
      this.dist = Math.max(2, Math.min(7, this.dist));
      e.preventDefault();
    };
    c.addEventListener('mousedown', onDown);
    c.addEventListener('mousemove', onMove);
    c.addEventListener('mouseup', onUp);
    c.addEventListener('mouseleave', onUp);
    c.addEventListener('touchstart', onDown, { passive: false });
    c.addEventListener('touchmove', onMove, { passive: false });
    c.addEventListener('touchend', onUp);
    c.addEventListener('wheel', onWheel, { passive: false });
  }

  frame() {
    if (!this.running) return;
    requestAnimationFrame(() => this.frame());
    this.time += 0.016;
    if (this.autoRot) this.rotYaw += this.autoSpeed;
    this.resize();
    const { gl, prog, loc, geom, color, rough, metal, bgColor, rotPitch, rotYaw, dist, wireframe } = this;
    const W = this.W || 1, H = this.H || 1;

    gl.clearColor(bgColor, bgColor, bgColor, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const asp = W / H || 1;
    const proj = this.persp(0.75, asp, 0.1, 100);
    const view = this.trans(0, 0, -dist);
    const model = this.m4mul(this.rotX(rotPitch), this.rotY(rotYaw));
    const mv = this.m4mul(view, model);
    const mvp = this.m4mul(proj, mv);

    gl.useProgram(prog);
    gl.uniformMatrix4fv(loc.uMVP, false, mvp);
    gl.uniformMatrix4fv(loc.uNorm, false, this.inv4(model));
    gl.uniform3fv(loc.uColor, color);
    gl.uniform3f(loc.uCam, 0, 0, dist);
    gl.uniform1f(loc.uRough, rough);
    gl.uniform1f(loc.uMetal, metal);
    gl.uniform1f(loc.uTime, this.time);
    gl.uniform1i(loc.uWire, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, geom.vb);
    gl.enableVertexAttribArray(loc.aPos);
    gl.vertexAttribPointer(loc.aPos, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, geom.nb);
    gl.enableVertexAttribArray(loc.aNorm);
    gl.vertexAttribPointer(loc.aNorm, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.ib);
    gl.drawElements(gl.TRIANGLES, geom.cnt, geom.type, 0);

    if (wireframe) {
      gl.uniform1i(loc.uWire, 1);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawElements(gl.LINES, geom.cnt, geom.type, 0);
      gl.disable(gl.BLEND);
    }
  }

  reset() { this.rotYaw = 0.3; this.rotPitch = 0.18; this.autoRot = true; }
  toggleWire() { this.wireframe = !this.wireframe; }
  destroy() { this.running = false; }
}

// =====================================================
// WEBGL CANVAS COMPONENT
// =====================================================
const GLCanvas = ({ opts, style, className, onReady }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const timer = setTimeout(() => {
      if (sceneRef.current) { sceneRef.current.destroy(); sceneRef.current = null; }
      sceneRef.current = new WebGLScene(canvasRef.current, opts);
      if (onReady) onReady(sceneRef.current);
    }, 100);
    return () => {
      clearTimeout(timer);
      if (sceneRef.current) { sceneRef.current.destroy(); sceneRef.current = null; }
    };
  }, [opts.geom, opts.color?.join(',')]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', ...style }} className={className} />;
};

// =====================================================
// HERO BG CANVAS (particle grid)
// =====================================================
const HeroBgCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio, 2);
    let animId;
    const resize = () => {
      cv.width = cv.offsetWidth * dpr;
      cv.height = cv.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const W = () => cv.offsetWidth, H = () => cv.offsetHeight;
    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * 2000, y: Math.random() * 1000,
      vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .15,
      r: Math.random() * 1.5 + .3, op: Math.random() * .2 + .04
    }));
    const gPts = [];
    for (let i = 0; i < 20; i++) for (let j = 0; j < 12; j++) gPts.push({ x: i/19, y: j/11 });
    let t2 = 0;
    const draw = () => {
      t2 += .01;
      ctx.clearRect(0, 0, W(), H());
      gPts.forEach((g, idx) => {
        const wave = Math.sin(g.x * 5 + t2) * .03 + Math.sin(g.y * 3 + t2 * .7) * .02;
        const px = g.x * W(), py = (g.y + wave) * H();
        const next = gPts[idx + 1];
        if (next && (idx + 1) % 12 !== 0) {
          const wave2 = Math.sin(next.x * 5 + t2) * .03 + Math.sin(next.y * 3 + t2 * .7) * .02;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(next.x * W(), (next.y + wave2) * H());
          ctx.strokeStyle = 'rgba(255,255,255,0.045)'; ctx.lineWidth = .5; ctx.stroke();
        }
      });
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W(); if (p.x > W()) p.x = 0;
        if (p.y < 0) p.y = H(); if (p.y > H()) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.op})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// =====================================================
// SCROLL REVEAL HOOK
// =====================================================
const useScrollReveal = () => {
  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll('.reveal').forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 50) {
          setTimeout(() => el.classList.add('in'), i * 40);
        }
      });
    };
    reveal();
    window.addEventListener('scroll', reveal, { passive: true });
    return () => window.removeEventListener('scroll', reveal);
  });
};

// =====================================================
// CUSTOM CURSOR
// =====================================================
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const stateRef = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const dot = dotRef.current, ring = ringRef.current;
    if (!dot || !ring) return;
    const onMove = e => {
      stateRef.current.mx = e.clientX;
      stateRef.current.my = e.clientY;
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    };
    const onOver = e => {
      const t = e.target;
      const isClickable = t.matches('button,a,[data-clickable],input,select,textarea');
      dot.classList.toggle('hover', isClickable);
      ring.classList.toggle('hover', isClickable);
      const isDark = t.closest('[data-dark]');
      dot.classList.toggle('on-dark', !!isDark);
      ring.classList.toggle('on-dark', !!isDark);
    };
    let animId;
    const animCursor = () => {
      const s = stateRef.current;
      s.rx += (s.mx - s.rx) * 0.1;
      s.ry += (s.my - s.ry) * 0.1;
      ring.style.left = s.rx + 'px';
      ring.style.top = s.ry + 'px';
      animId = requestAnimationFrame(animCursor);
    };
    animCursor();
    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <>
      <div id="cur-dot" ref={dotRef} />
      <div id="cur-ring" ref={ringRef} />
    </>
  );
};

// =====================================================
// TOAST
// =====================================================
const Toast = ({ message }) => (
  <div style={{
    position: 'fixed', bottom: 36, left: '50%',
    transform: message ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(80px)',
    background: '#000', color: '#fff', padding: '14px 28px',
    fontSize: 13, fontWeight: 400, letterSpacing: '.04em',
    zIndex: 99999, transition: 'transform .45s cubic-bezier(0.22, 1, 0.36, 1)',
    whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.1)',
    pointerEvents: 'none',
  }}>{message}</div>
);

// =====================================================
// NAVBAR
// =====================================================
const Navbar = ({ page, setPage, cartCount, onCartOpen }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDark = page === 'home' && !scrolled;
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Collection' },
    { id: 'about', label: 'Studio' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav data-dark={isDark ? '' : undefined} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 52px',
      background: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.92)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      boxShadow: isDark ? '0 1px 0 rgba(255,255,255,0.06)' : '0 1px 0 rgba(0,0,0,0.08)',
      transition: 'background .5s, box-shadow .5s',
    }}>
      <div data-clickable onClick={() => setPage('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400,
          letterSpacing: '-0.02em', color: isDark ? '#fff' : '#000', transition: 'color .3s',
        }}>BWR</span>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', transition: 'color .3s',
        }}>3D Works</span>
      </div>

      <ul style={{ display: 'flex', gap: 36, listStyle: 'none' }}>
        {navLinks.map(l => (
          <li key={l.id}>
            <a data-clickable onClick={() => setPage(l.id)} style={{
              fontSize: 13, fontWeight: 400, letterSpacing: '.03em', cursor: 'pointer',
              color: isDark ? (page === l.id ? '#fff' : 'rgba(255,255,255,0.65)') : (page === l.id ? '#000' : 'rgba(0,0,0,0.55)'),
              textDecoration: 'none', transition: 'color .2s',
              borderBottom: page === l.id ? `1px solid ${isDark ? '#fff' : '#000'}` : '1px solid transparent',
              paddingBottom: 2,
            }}>{l.label}</a>
          </li>
        ))}
      </ul>

      <button data-clickable onClick={onCartOpen} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: isDark ? '#fff' : '#000', display: 'flex', alignItems: 'center', position: 'relative', padding: 4,
        transition: 'opacity .2s',
      }}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        {cartCount > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 15, height: 15, background: isDark ? '#fff' : '#000',
            color: isDark ? '#000' : '#fff', borderRadius: '50%',
            fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{cartCount}</span>
        )}
      </button>
    </nav>
  );
};

// =====================================================
// MARQUEE
// =====================================================
const Marquee = () => {
  const items = ['Precision Manufacturing','0.05mm Resolution','Limited Editions','Parametric Design','12-Step Finishing','Hand Crafted','Numbered Objects','Rebellion Meets Precision'];
  const all = [...items, ...items, ...items];
  return (
    <div data-dark style={{ background: '#000', padding: '20px 0', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', animation: 'marquee 25s linear infinite' }}>
        {all.map((t, i) => (
          <span key={i} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 40, padding: '0 40px', fontSize: 13, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
            {t}
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'inline-block' }} />
          </span>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// HOME PAGE
// =====================================================
const HomePage = ({ setPage, addToCart }) => {
  useScrollReveal();
  const featSceneRef = useRef(null);

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 700, background: '#0a0a0a', overflow: 'hidden', display: 'flex', alignItems: 'center' }} data-dark>
        <HeroBgCanvas />
        <div style={{ position: 'absolute', right: 0, top: 0, width: '60%', height: '100%' }}>
          <GLCanvas opts={{ geom: 'vase', color: [0.94,0.94,0.94], bg: 0.07, rough: 0.25, metal: 0.05, speed: 0.003 }} style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10, padding: '0 52px', maxWidth: 600 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 32, opacity: 0, transform: 'translateY(16px)', animation: 'aUp .8s .2s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
            <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.25)' }} />
            Est. 2024 — Precision Objects
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 7.5vw, 110px)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.03em', color: '#fff', marginBottom: 32, opacity: 0, transform: 'translateY(24px)', animation: 'aUp 1s .4s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
            Where<br />Rebellion<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.28)' }}>Meets Precision.</em>
          </h1>
          <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', maxWidth: 420, marginBottom: 52, opacity: 0, transform: 'translateY(16px)', animation: 'aUp .8s .6s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
            3D printed objects engineered to outlast trends. Every layer calculated. Every surface earned.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: 0, transform: 'translateY(16px)', animation: 'aUp .8s .8s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
            <button data-clickable className="btn btn-white" onClick={() => setPage('products')}>Explore Collection</button>
            <button data-clickable className="btn btn-ghost" onClick={() => setPage('product', PRODUCTS[0])}>Featured Drop</button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 36, left: 52, display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', opacity: 0, animation: 'aUp .6s 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
          <div style={{ width: 36, height: 1, background: 'rgba(255,255,255,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '-100%', top: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.7)', animation: 'scanLine 2s ease-in-out infinite' }} />
          </div>
          Scroll to discover
        </div>
        <div style={{ position: 'absolute', bottom: 36, right: 52, fontSize: 11, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', opacity: 0, animation: 'aUp .6s 1.3s cubic-bezier(0.22, 1, 0.36, 1) forwards', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, animation: 'float 3s ease-in-out infinite' }}>↺</div>
          Drag to rotate
        </div>
      </section>

      <Marquee />

      {/* FEATURED PRODUCT */}
      <section style={{ background: '#fff', padding: '140px 52px' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div className="reveal" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.35, marginBottom: 20 }}>Featured Release — 2024</div>
          <h2 className="reveal d1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 68px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.025em' }}>The Orbital<br /><em style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.25)' }}>Vase Series.</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', maxWidth: 1280, margin: '0 auto' }}>
          <div className="reveal" style={{ background: '#f0f0f0', height: 580, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
            <GLCanvas opts={{ geom: 'vase', color: [0.06,0.06,0.06], bg: 0.97, rough: 0.3, metal: 0.0, speed: 0.004 }} onReady={s => featSceneRef.current = s} />
            <div style={{ position: 'absolute', bottom: 20, left: 20, fontSize: 10, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse-dot 2s infinite' }} />
              Live 3D Preview — Drag to Rotate
            </div>
            <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', gap: 8 }}>
              {[['⟳', () => featSceneRef.current?.reset()], ['◫', () => featSceneRef.current?.toggleWire()]].map(([icon, fn], i) => (
                <button key={i} data-clickable onClick={fn} style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#000', backdropFilter: 'blur(10px)', transition: 'background .2s' }}>{icon}</button>
              ))}
            </div>
          </div>
          <div className="reveal d2" style={{ padding: '20px 0' }}>
            <div style={{ display: 'inline-block', background: '#000', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', padding: '5px 14px', marginBottom: 28 }}>Limited — 12 Units</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 4vw, 60px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 24 }}>Orbital<br />Vase No. 7</div>
            <div style={{ fontSize: 52, fontWeight: 200, letterSpacing: '-0.04em', marginBottom: 28, lineHeight: 1 }}><sup style={{ fontSize: 22, fontWeight: 400, verticalAlign: 'super' }}>$</sup>348</div>
            <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: 'rgba(0,0,0,0.5)', maxWidth: 380, marginBottom: 40 }}>A sculptural study in negative space. Fluid curvature meets mathematical precision. Printed at 0.05mm layer resolution.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px', marginBottom: 40 }}>
              {[['Material','PETG Matte'],['Resolution','0.05mm'],['Finish','Hand-polished'],['Ships In','3–5 Days']].map(([k,v]) => (
                <div key={k}><div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 4 }}>{k}</div><div style={{ fontSize: 14, fontWeight: 400, color: '#000' }}>{v}</div></div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button data-clickable className="btn btn-dark" onClick={() => setPage('product', PRODUCTS[0])}>View Full Details</button>
              <button data-clickable className="btn btn-outline-dark" onClick={() => addToCart(PRODUCTS[0])}>Add to Cart</button>
            </div>
          </div>
        </div>
      </section>

      {/* PARALLAX STRIP */}
      <div data-dark style={{ position: 'relative', height: 500, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' }} />
        <div style={{ position: 'absolute', fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 7vw, 108px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, opacity: 0.06, userSelect: 'none' }}>REBELLION</div>
        <div className="reveal" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>Our Standard</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 68px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.025em', color: '#fff' }}>0.05mm<br />Layer Precision.</div>
          <p style={{ fontSize: 17, fontWeight: 300, color: 'rgba(255,255,255,0.45)', marginTop: 16, maxWidth: 500 }}>The difference between ordinary and extraordinary<br />is measured in microns.</p>
        </div>
      </div>

      {/* WHY US */}
      <section style={{ background: '#fff', padding: '120px 52px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto 80px', textAlign: 'center' }}>
          <div className="reveal" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.35, marginBottom: 20 }}>Why BWR 3D Works</div>
          <h2 className="reveal d1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 68px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.025em' }}>Built for those<br />who <em style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.25)' }}>see the difference.</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, maxWidth: 1200, margin: '0 auto' }}>
          {[
            { icon: '◎', title: 'Micron Precision', desc: 'Industrial-grade FDM + SLA printers achieve ±0.05mm tolerances. The aerospace standard — applied to everyday objects.' },
            { icon: '◈', title: 'Curated Materials', desc: '23 hand-selected filaments, dried before every run. Medical-grade PETG to engineering PLA+. Consistency is non-negotiable.' },
            { icon: '✓', title: '12-Step Finishing', desc: '80-grit to 2000-grit. Primer. Coating. Every surface hand-finished until it earns the right to be called complete.' },
            { icon: '✦', title: 'Parametric Design', desc: 'Forms generated by algorithm, refined by human judgement. Mathematics of beauty made physical.' },
            { icon: '□', title: 'Numbered Editions', desc: '12 units maximum per colorway. Certificate of authenticity, print parameters, operator signature. Collectible by design.' },
            { icon: '○', title: 'Zero Compromise', desc: 'We reject 40% of prints internally. If it doesn\'t meet spec, it doesn\'t ship. Ever.' },
          ].map((card, i) => (
            <div key={i} className={`reveal${i%3 > 0 ? ` d${i%3}` : ''}`} style={{ padding: '48px 40px', border: '1px solid #ebebeb', background: '#fafafa', transition: 'transform .4s, box-shadow .4s, border-color .4s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#d6d6d6'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#ebebeb'; }}>
              <div style={{ fontSize: 28, marginBottom: 28, color: '#000' }}>{card.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: '#000', marginBottom: 14, letterSpacing: '-0.01em' }}>{card.title}</h3>
              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.75, color: 'rgba(0,0,0,0.45)' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div data-dark style={{ background: '#000', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {[['12','Max units per edition'],['0.05','Millimeter resolution'],['48h','Minimum print time']].map(([num, desc], i) => (
          <div key={i} className={`reveal${i > 0 ? ` d${i}` : ''}`} style={{ padding: '80px 52px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 80, fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 1, color: '#fff', marginBottom: 12 }}>{num}</div>
            <div style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.35)', letterSpacing: '.04em' }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* TESTIMONIALS */}
      <section style={{ background: '#f7f7f7', padding: '120px 52px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.35, marginBottom: 20 }} className="reveal">What collectors say</div>
        <h2 className="reveal d1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 68px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 60 }}>Precision, recognized.</h2>
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
          {[
            { q: 'The Orbital Vase sits at the intersection of sculpture and function. I\'ve never seen 3D printing treated as a luxury medium before.', name: 'Charlotte M.', role: 'Interior Architect, London' },
            { q: 'Unboxing felt like receiving a museum acquisition. Every detail — including the packaging — communicates obsession.', name: 'Ren T.', role: 'Art Director, Tokyo' },
            { q: 'The surface finish defies what I thought was possible with additive manufacturing. It belongs in galleries.', name: 'Marcus F.', role: 'Product Designer, Berlin' },
            { q: 'Ordered the Helical Tower for a client project. The quality justified the premium without a single conversation.', name: 'Sofia A.', role: 'Architect, Milan' },
          ].map((t, i) => (
            <div key={i} style={{ flex: '0 0 380px', background: '#fff', padding: 44, border: '1px solid #ebebeb', transition: 'transform .4s, box-shadow .4s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 22 }}>{'★★★★★'.split('').map((s, j) => <span key={j} style={{ fontSize: 14, color: '#000' }}>{s}</span>)}</div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 400, lineHeight: 1.6, color: '#000', marginBottom: 30 }}>"{t.q}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontFamily: 'var(--font-display)' }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#000' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div data-dark style={{ background: '#000', padding: '180px 52px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {[900, 560].map(s => <div key={s} style={{ position: 'absolute', width: s, height: s, border: `1px solid rgba(255,255,255,${s === 900 ? 0.04 : 0.07})`, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />)}
        <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 68px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.025em', color: '#fff', position: 'relative', zIndex: 2 }}>Commission<br />your object.</h2>
        <p className="reveal d1" style={{ fontSize: 17, fontWeight: 300, color: 'rgba(255,255,255,0.42)', maxWidth: 480, margin: '24px auto 52px', lineHeight: 1.75, position: 'relative', zIndex: 2 }}>Have a vision? We'll engineer it. Submit a brief and receive a 3D concept within 48 hours.</p>
        <div className="reveal d2" style={{ display: 'flex', justifyContent: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
          <button data-clickable className="btn btn-white" onClick={() => setPage('contact')}>Start a Commission</button>
          <button data-clickable className="btn btn-ghost" onClick={() => setPage('products')}>Browse Collection</button>
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
};

// =====================================================
// PRODUCTS PAGE
// =====================================================
const ProductsPage = ({ setPage, addToCart, openModal }) => {
  const [filter, setFilter] = useState('all');
  useScrollReveal();

  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);

  return (
    <div style={{ background: '#f7f7f7' }}>
      <div style={{ background: '#fff', padding: '140px 52px 60px', borderBottom: '1px solid #ebebeb' }}>
        <div className="reveal" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.35, marginBottom: 20 }}>Collection</div>
        <h1 className="reveal d1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 400, lineHeight: 1, letterSpacing: '-0.03em', color: '#000' }}>BWR 3D Works</h1>
        <p className="reveal d2" style={{ fontSize: 17, fontWeight: 300, color: 'rgba(0,0,0,0.45)', maxWidth: 460, marginTop: 20, lineHeight: 1.7 }}>Where Rebellion Meets Precision. Each object a numbered edition.</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 68, zIndex: 99, padding: '16px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ebebeb' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} data-clickable onClick={() => setFilter(cat)} style={{
              padding: '7px 18px', fontSize: 12, fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase',
              background: filter === cat ? '#000' : 'transparent', color: filter === cat ? '#fff' : '#888',
              border: `1.5px solid ${filter === cat ? '#000' : '#d6d6d6'}`, cursor: 'pointer', borderRadius: 100,
              transition: 'all .25s', fontFamily: 'var(--font-sans)',
            }}>{cat}</button>
          ))}
        </div>
        <div style={{ fontSize: 13, fontWeight: 300, color: 'rgba(0,0,0,0.4)' }}>{filtered.length} objects</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, padding: 2, background: '#ebebeb' }}>
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} onQuickView={() => openModal(p)} onClick={() => setPage('product', p)} onAddToCart={() => addToCart(p)} />
        ))}
      </div>

      <Footer setPage={setPage} />
    </div>
  );
};

const ProductCard = ({ product: p, index: i, onQuickView, onClick, onAddToCart }) => {
  const [hovered, setHovered] = useState(false);
  const opts = useMemo(() => ({ geom: p.geom, color: [0.06,0.06,0.06], bg: 0.97, rough: 0.3, metal: 0, speed: 0.004 + i * 0.0003 }), [p.geom, i]);

  return (
    <div data-clickable onClick={onClick} style={{ background: '#fff', cursor: 'pointer', position: 'relative', overflow: 'hidden', animation: `slideUp .6s ${i * 60}ms cubic-bezier(0.22, 1, 0.36, 1) both` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ height: 340, position: 'relative', background: '#f8f8f8' }}>
        <GLCanvas opts={opts} />
        <div style={{ position: 'absolute', inset: 0, background: hovered ? 'rgba(0,0,0,0.08)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .35s' }}>
          <button data-clickable onClick={e => { e.stopPropagation(); onQuickView(); }} style={{
            background: '#fff', color: '#000', border: 'none', padding: '12px 26px', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', cursor: 'pointer',
            opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.96)', transition: 'opacity .3s, transform .3s', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>Quick View</button>
        </div>
      </div>
      <div style={{ padding: '24px 28px 28px', borderTop: '1px solid #ebebeb' }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 7 }}>{p.cat}{p.badge ? ' · ' + p.badge : ''}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, letterSpacing: '-0.01em', color: '#000', marginBottom: 6 }}>{p.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 300, letterSpacing: '-0.02em', color: '#000' }}>${p.price}</span>
          {p.badge && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', padding: '4px 10px', background: '#000', color: '#fff' }}>{p.badge}</span>}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// PRODUCT DETAIL PAGE
// =====================================================
const ProductPage = ({ product: p, setPage, addToCart }) => {
  const [selectedMat, setSelectedMat] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [atcSuccess, setAtcSuccess] = useState(false);
  const sceneRef = useRef(null);
  useScrollReveal();

  const matDeltas = [0, 50, 120];
  const sizeDeltas = [0, 30, 80];
  const price = p ? p.price + matDeltas[selectedMat] + sizeDeltas[selectedSize] : 0;

  const handleATC = () => {
    if (!p) return;
    addToCart({ ...p, price, variant: `${['Standard','Matte Black','Polished'][selectedMat]} · ${['Small','Medium','Large'][selectedSize]}`, qty });
    setAtcSuccess(true);
    setTimeout(() => setAtcSuccess(false), 2500);
  };

  if (!p) return null;

  const opts = useMemo(() => ({ geom: p.geom, color: [0.06,0.06,0.06], bg: 0.97, rough: 0.25, metal: 0.02, speed: 0.003 }), [p?.geom]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', paddingTop: 68, background: '#fff' }}>
        <div style={{ position: 'sticky', top: 68, height: 'calc(100vh - 68px)', background: '#f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <GLCanvas opts={opts} onReady={s => sceneRef.current = s} />
          <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', fontSize: 11, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse-dot 2s infinite' }} />
            Live 3D — Drag to Rotate
          </div>
          <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8 }}>
            {[['⟳', () => sceneRef.current?.reset()], ['◫', () => sceneRef.current?.toggleWire()]].map(([icon, fn], i) => (
              <button key={i} data-clickable onClick={fn} style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#000', transition: 'background .2s' }}>{icon}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: '80px 60px 120px', background: '#fff', overflowY: 'auto' }}>
          <button data-clickable onClick={() => setPage('products')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginBottom: 40, transition: 'color .2s' }}>← Back to Collection</button>

          {p.badge && <div style={{ display: 'inline-block', border: '1px solid rgba(0,0,0,0.12)', fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', padding: '6px 14px', color: 'rgba(0,0,0,0.5)', marginBottom: 24 }}>{p.badge}</div>}

          <div className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 4.5vw, 64px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.025em', color: '#000', marginBottom: 20 }}>{p.name}</div>
          <div className="reveal" style={{ fontSize: 48, fontWeight: 200, letterSpacing: '-0.04em', color: '#000', marginBottom: 32, transition: 'all .4s' }}>${price}</div>
          <p className="reveal" style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: 'rgba(0,0,0,0.5)', maxWidth: 400, marginBottom: 44 }}>{p.desc}</p>

          {/* Material */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 14 }}>Material</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Standard','Matte Black +$50','Polished +$120'].map((m, i) => (
                <button key={i} data-clickable onClick={() => setSelectedMat(i)} style={{ padding: '10px 22px', fontSize: 13, fontWeight: 400, background: selectedMat === i ? '#000' : 'transparent', color: selectedMat === i ? '#fff' : 'rgba(0,0,0,0.55)', border: `1.5px solid ${selectedMat === i ? '#000' : '#d6d6d6'}`, cursor: 'pointer', transition: 'all .25s', fontFamily: 'var(--font-sans)', letterSpacing: '.02em' }}>{m}</button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 14 }}>Size</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Small','Medium +$30','Large +$80'].map((s, i) => (
                <button key={i} data-clickable onClick={() => setSelectedSize(i)} style={{ padding: '10px 22px', fontSize: 13, fontWeight: 400, background: selectedSize === i ? '#000' : 'transparent', color: selectedSize === i ? '#fff' : 'rgba(0,0,0,0.55)', border: `1.5px solid ${selectedSize === i ? '#000' : '#d6d6d6'}`, cursor: 'pointer', transition: 'all .25s', fontFamily: 'var(--font-sans)', letterSpacing: '.02em' }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid #d6d6d6', width: 'fit-content', marginBottom: 36 }}>
            {['−', qty, '+'].map((v, i) => (
              <div key={i} onClick={i === 0 ? () => setQty(Math.max(1, qty - 1)) : i === 2 ? () => setQty(Math.min(10, qty + 1)) : undefined} style={{
                width: i === 1 ? 52 : 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: i === 1 ? 16 : 20, fontWeight: 300, cursor: i !== 1 ? 'pointer' : 'default',
                borderLeft: i > 0 ? '1.5px solid #d6d6d6' : 'none', textAlign: 'center', lineHeight: '46px',
                transition: 'background .2s', userSelect: 'none',
              }} data-clickable={i !== 1 ? '' : undefined}>{v}</div>
            ))}
          </div>

          {/* ATC */}
          <button data-clickable onClick={handleATC} style={{
            width: '100%', padding: 18, background: atcSuccess ? '#16a34a' : '#000', color: '#fff', border: 'none',
            fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all .4s', marginBottom: 12, position: 'relative', overflow: 'hidden',
          }}>{atcSuccess ? '✓ Added to Cart' : `Add to Cart — $${price}`}</button>
          <button data-clickable onClick={() => setPage('checkout')} style={{ width: '100%', padding: 18, background: 'transparent', color: '#000', border: '1.5px solid rgba(0,0,0,0.2)', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .4s' }}>Buy Now</button>

          {/* Specs */}
          <div style={{ marginTop: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 24 }}>Specifications</div>
            {(p.specs || []).map(([k, v]) => (
              <div key={k} className="reveal" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #ebebeb' }}>
                <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(0,0,0,0.35)' }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 400, color: '#000' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <div style={{ background: '#f7f7f7', padding: '80px 52px' }}>
        <div className="reveal" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.35, marginBottom: 40 }}>You may also like</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {PRODUCTS.filter(x => x.id !== p.id).slice(0, 4).map((rp, i) => (
            <div key={rp.id} className={`reveal d${i}`} onClick={() => setPage('product', rp)} style={{ cursor: 'pointer' }} data-clickable>
              <div style={{ height: 200, background: '#fff', marginBottom: 16, overflow: 'hidden' }}>
                <GLCanvas opts={{ geom: rp.geom, color: [0.07,0.07,0.07], bg: 1, rough: .3, metal: 0, speed: .005 }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 400, color: '#000', marginBottom: 4 }}>{rp.name}</div>
              <div style={{ fontSize: 13, fontWeight: 300, color: 'rgba(0,0,0,0.4)' }}>${rp.price}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
};

// =====================================================
// CHECKOUT PAGE
// =====================================================
const CheckoutPage = ({ cart, setPage, onOrderComplete }) => {
  const [step, setStep] = useState(1); // 1=details, 2=payment, 3=confirm
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '', country: '' });
  const [payment, setPayment] = useState({ card: '', expiry: '', cvv: '', name: '' });
  const total = cart.reduce((s, c) => s + c.price * (c.qty || 1), 0);

  const handleOrder = () => {
    setStep(3);
    setTimeout(() => { onOrderComplete(); setPage('home'); }, 3000);
  };

  const inputStyle = { width: '100%', padding: '14px 16px', border: '1.5px solid #d6d6d6', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 300, outline: 'none', background: '#fff', transition: 'border-color .2s' };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7', paddingTop: 68 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 60 }}>
        <div>
          {/* Steps */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 48, borderBottom: '1px solid #ebebeb', paddingBottom: 24 }}>
            {['Shipping Details', 'Payment', 'Confirmation'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 32 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > i + 1 ? '#22c55e' : step === i + 1 ? '#000' : '#d6d6d6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600, transition: 'background .3s', flexShrink: 0 }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 500 : 300, color: step === i + 1 ? '#000' : 'rgba(0,0,0,0.4)' }}>{s}</span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div style={{ animation: 'fadeIn .4s' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 32, letterSpacing: '-0.02em' }}>Shipping Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {[['Full Name','name','text'],['Email','email','email'],['Address','address','text'],['City','city','text'],['Zip / Postal','zip','text'],['Country','country','text']].map(([label, field, type]) => (
                  <div key={field} style={{ gridColumn: field === 'address' ? '1 / -1' : 'auto' }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 8 }}>{label}</label>
                    <input type={type} value={form[field]} onChange={e => setForm(f => ({...f, [field]: e.target.value}))} style={inputStyle} onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = '#d6d6d6'} />
                  </div>
                ))}
              </div>
              <button data-clickable className="btn btn-dark" onClick={() => setStep(2)} style={{ fontSize: 14, padding: '16px 40px' }}>Continue to Payment →</button>
            </div>
          )}

          {step === 2 && (
            <div style={{ animation: 'fadeIn .4s' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 32, letterSpacing: '-0.02em' }}>Payment</h2>
              <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
                {[['Card Number','card','text','•••• •••• •••• ••••'],['Name on Card','name','text',''],['Expiry','expiry','text','MM/YY'],['CVV','cvv','text','•••']].map(([label, field, type, ph]) => (
                  <div key={field} style={{ gridColumn: field === 'card' ? '1 / -1' : 'auto' }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 8 }}>{label}</label>
                    <input type={type} placeholder={ph} value={payment[field]} onChange={e => setPayment(f => ({...f, [field]: e.target.value}))} style={inputStyle} onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = '#d6d6d6'} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button data-clickable className="btn btn-outline-dark" onClick={() => setStep(1)}>← Back</button>
                <button data-clickable className="btn btn-dark" onClick={handleOrder} style={{ fontSize: 14, padding: '16px 40px' }}>Place Order — ${total} →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '60px 0', animation: 'fadeIn .6s' }}>
              <div style={{ fontSize: 60, marginBottom: 24 }}>✓</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 400, letterSpacing: '-0.025em', marginBottom: 16 }}>Order Confirmed</h2>
              <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(0,0,0,0.5)', lineHeight: 1.75 }}>Your precision objects are being prepared.<br />You'll receive a confirmation email shortly.</p>
              <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.3)', marginTop: 24 }}>Redirecting to home...</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ background: '#fff', border: '1px solid #ebebeb', padding: 36, height: 'fit-content', position: 'sticky', top: 100 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 28, letterSpacing: '-0.01em' }}>Order Summary</h3>
          {cart.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #ebebeb' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 400, color: '#000' }}>{item.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>Qty {item.qty || 1}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 300, color: '#000' }}>${item.price * (item.qty || 1)}</div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '2px solid #000' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, letterSpacing: '-0.02em' }}>${total}</span>
          </div>
          <div style={{ marginTop: 20, padding: 16, background: '#f7f7f7', fontSize: 12, fontWeight: 300, color: 'rgba(0,0,0,0.5)', lineHeight: 1.7 }}>
            🔒 Secure checkout · Free shipping on orders over $200 · Returns within 30 days
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// ABOUT PAGE
// =====================================================
const AboutPage = ({ setPage }) => {
  useScrollReveal();
  return (
    <div>
      <section style={{ background: '#fff', padding: '160px 52px 100px' }}>
        <div className="reveal" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 20 }}>Our Story</div>
        <h1 className="reveal d1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 8vw, 120px)', fontWeight: 400, lineHeight: .95, letterSpacing: '-0.03em', color: '#000', maxWidth: 900 }}>
          Where Rebellion<br /><span style={{ color: 'rgba(0,0,0,0.18)' }}>meets</span><br />Precision.
        </h1>
      </section>

      <section style={{ background: '#fff', padding: '0 52px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100, maxWidth: 1100, paddingTop: 80, borderTop: '1px solid #ebebeb' }}>
          <div className="reveal">
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 20 }}>Philosophy</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#000' }}>The obsession with objects that outlast trends.</h2>
          </div>
          <div className="reveal d2">
            {['BWR 3D Works was founded on a single belief: that 3D printing has been catastrophically underestimated as an art medium. The technology exists to create objects of extraordinary refinement — the industry simply hasn\'t bothered.','We bothered. We spent two years developing a post-processing protocol so rigorous it adds four days to every production cycle. We curated a library of 23 materials. We designed objects so considered they deserve to be heirlooms.','The name is a contradiction. BWR — bold yet refined. Rogue — the unexpected detail. That tension is in everything we make. Where rebellion meets precision.'].map((para, i) => (
              <p key={i} style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.85, color: 'rgba(0,0,0,0.5)', marginBottom: 20 }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      <div data-dark style={{ background: '#000', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {[['12','Max per edition'],['0.05','mm resolution'],['48h','Min print time']].map(([num, desc], i) => (
          <div key={i} className={`reveal${i > 0 ? ` d${i}` : ''}`} style={{ padding: '80px 52px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 80, fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 1, color: '#fff', marginBottom: 12 }}>{num}</div>
            <div style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.35)', letterSpacing: '.04em' }}>{desc}</div>
          </div>
        ))}
      </div>

      <section style={{ background: '#f7f7f7', padding: '100px 52px' }}>
        <div className="reveal" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 20 }}>Process</div>
        <h2 className="reveal d1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 68px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: 70 }}>From concept<br />to collection.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[['01','Design & Algorithm','Parametric form-finding, refined through hundreds of iterations. Forms impossible to draw by hand.'],['02','Material Selection','23 hand-curated filaments. Each dried 12h before every run. Consistency is non-negotiable.'],['03','Print & QC','Live monitoring throughout. Any deviation results in full restart. 40% internal rejection rate.'],['04','Finish & Sign','Twelve finishing steps, primer, coating. Operator hand-signs and numbers each piece.']].map(([num, title, desc], i) => (
            <div key={i} className={`reveal d${i}`} style={{ padding: '40px 0', borderTop: '2px solid #000' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 300, color: 'rgba(0,0,0,0.12)', marginBottom: 20, lineHeight: 1 }}>{num}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: '#000', marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</div>
              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.75, color: 'rgba(0,0,0,0.45)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div data-dark style={{ background: '#000', padding: '180px 52px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {[900, 560].map(s => <div key={s} style={{ position: 'absolute', width: s, height: s, border: `1px solid rgba(255,255,255,${s === 900 ? 0.04 : 0.07})`, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />)}
        <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 68px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.025em', color: '#fff', position: 'relative', zIndex: 2 }}>Commission<br />your object.</h2>
        <p className="reveal d1" style={{ fontSize: 17, fontWeight: 300, color: 'rgba(255,255,255,0.42)', maxWidth: 480, margin: '24px auto 52px', lineHeight: 1.75, position: 'relative', zIndex: 2 }}>Have a vision? We'll engineer it.</p>
        <div className="reveal d2" style={{ display: 'flex', justifyContent: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
          <button data-clickable className="btn btn-white" onClick={() => setPage('contact')}>Start a Commission</button>
          <button data-clickable className="btn btn-ghost" onClick={() => setPage('products')}>Browse Collection</button>
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
};

// =====================================================
// CONTACT PAGE
// =====================================================
const ContactPage = ({ setPage }) => {
  const [sent, setSent] = useState(false);
  useScrollReveal();

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 68px)', padding: '100px 52px 80px', gap: 100 }}>
        <div className="reveal">
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 20 }}>Get in Touch</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 400, lineHeight: .95, letterSpacing: '-0.03em', color: '#000', marginBottom: 28 }}>Let's build<br />something<br />remarkable.</h1>
          <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.75, color: 'rgba(0,0,0,0.5)', maxWidth: 400, marginBottom: 48 }}>Commission brief, product enquiry, or just want to talk about 3D printing as art — we're here.</p>
          {[['✉', 'Email', 'hello@bwr3dworks.com'],['◎', 'Studio', 'BWR Studio, Precision Quarter'],['◷', 'Response Time', 'Within 24 hours']].map(([icon, label, val]) => (
            <div key={label} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, background: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 400, color: '#000' }}>{val}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal d2">
          {!sent ? (
            <>
              {[['Your Name','text','Full name'],['Email','email','your@email.com'],['Subject','text','Commission / Enquiry / Other']].map(([label, type, ph]) => (
                <div key={label} style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 10 }}>{label}</label>
                  <input type={type} placeholder={ph} style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #d6d6d6', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 300, outline: 'none', transition: 'border-color .2s' }} onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = '#d6d6d6'} />
                </div>
              ))}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 10 }}>Message</label>
                <textarea placeholder="Tell us about your project..." rows={5} style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #d6d6d6', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 300, outline: 'none', resize: 'vertical', transition: 'border-color .2s' }} onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = '#d6d6d6'} />
              </div>
              <button data-clickable className="btn btn-dark" onClick={() => setSent(true)} style={{ fontSize: 14, padding: '16px 40px' }}>Send Message →</button>
            </>
          ) : (
            <div style={{ padding: '60px 40px', border: '1px solid #ebebeb', textAlign: 'center', animation: 'fadeIn .6s' }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 12 }}>Message sent.</h3>
              <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(0,0,0,0.5)' }}>We'll respond within 24 hours.</p>
            </div>
          )}
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
};

// =====================================================
// FOOTER
// =====================================================
const Footer = ({ setPage }) => (
  <footer data-dark style={{ background: '#000', padding: '80px 52px 40px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 70, paddingBottom: 60, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, color: '#fff' }}>BWR</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>3D Works</span>
        </div>
        <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.3)', maxWidth: 260, lineHeight: 1.7 }}>Where Rebellion Meets Precision. Limited edition 3D objects engineered to perfection.</p>
      </div>
      {[['Collection',['Home Decor','Architectural','Wearables','Limited Editions'],['products','products','products','products']],['Studio',['Our Story','Process','Commissions','Contact'],['about','about','about','contact']],['Info',['Shipping','Returns','Care Guide','FAQ'],['contact','contact','contact','contact']]].map(([title, links, pages]) => (
        <div key={title}>
          <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 22 }}>{title}</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {links.map((l, i) => (
              <li key={l}><a data-clickable onClick={() => setPage(pages[i])} style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', cursor: 'pointer', transition: 'color .2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>{l}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 30 }}>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: '.04em' }}>© 2024 BWR 3D Works. Where Rebellion Meets Precision.</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Numbered editions · Precision objects</div>
    </div>
  </footer>
);

// =====================================================
// CART SIDEBAR
// =====================================================
const CartSidebar = ({ cart, onClose, onRemove, setPage }) => {
  const total = cart.reduce((s, c) => s + c.price * (c.qty || 1), 0);
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9000, backdropFilter: 'blur(4px)', animation: 'fadeIn .3s' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: '#fff', zIndex: 9001, display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.15)', animation: 'slideUp .4s cubic-bezier(0.22, 1, 0.36, 1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 36px', borderBottom: '1px solid #ebebeb' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, color: '#000' }}>Cart</h2>
          <button data-clickable onClick={onClose} style={{ width: 38, height: 38, background: '#ebebeb', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'background .2s' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.2 }}>◻</div>
              <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(0,0,0,0.35)' }}>Your cart is empty</p>
            </div>
          ) : cart.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 18, padding: '20px 0', borderBottom: '1px solid #ebebeb', animation: 'csIn .35s' }}>
              <div style={{ width: 72, height: 72, background: '#f0f0f0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth={1}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#000', marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', marginBottom: 10 }}>{item.variant || 'Standard'} · Qty {item.qty || 1}</div>
                <div style={{ fontSize: 18, fontWeight: 300, color: '#000', letterSpacing: '-0.02em' }}>${item.price * (item.qty || 1)}</div>
              </div>
              <button data-clickable onClick={() => onRemove(i)} style={{ background: 'none', border: 'none', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'color .2s', alignSelf: 'flex-start', marginTop: 4 }}>Remove</button>
            </div>
          ))}
        </div>

        <div style={{ padding: '24px 36px', borderTop: '1px solid #ebebeb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, letterSpacing: '-0.02em', color: '#000' }}>${total}</span>
          </div>
          <button data-clickable className="btn btn-dark btn-full" onClick={() => { onClose(); setPage('checkout'); }} style={{ fontSize: 14, letterSpacing: '.08em' }}>Checkout →</button>
          <button data-clickable onClick={() => { onClose(); setPage('products'); }} style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, color: 'rgba(0,0,0,0.4)', cursor: 'pointer', marginTop: 12, padding: '8px 0', fontFamily: 'var(--font-sans)', transition: 'color .2s' }}>Continue Shopping</button>
        </div>
      </div>
    </>
  );
};

// =====================================================
// QUICK VIEW MODAL
// =====================================================
const QuickViewModal = ({ product: p, onClose, onAddToCart, setPage }) => {
  const opts = useMemo(() => ({ geom: p?.geom || 'vase', color: [0.07,0.07,0.07], bg: 0.97, rough: 0.28, metal: 0.02, speed: 0.006 }), [p?.geom]);
  if (!p) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn .35s' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', width: '92%', maxWidth: 920, maxHeight: '88vh', overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative', animation: 'slideUp .4s cubic-bezier(0.22, 1, 0.36, 1)' }}>
        <button data-clickable onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, width: 36, height: 36, background: '#ebebeb', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, color: '#000' }}>×</button>
        <div style={{ height: 420, background: '#f0f0f0' }}>
          <GLCanvas opts={opts} />
        </div>
        <div style={{ padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 20 }}>{p.cat}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.015em', marginBottom: 14, color: '#000' }}>{p.name}</div>
            <div style={{ fontSize: 36, fontWeight: 200, letterSpacing: '-0.03em', marginBottom: 20, color: '#000' }}>${p.price}</div>
            <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(0,0,0,0.45)', lineHeight: 1.75, marginBottom: 32 }}>{p.desc}</p>
            {p.badge && <div style={{ display: 'inline-block', background: '#000', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '5px 12px', marginBottom: 24 }}>{p.badge}</div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button data-clickable className="btn btn-dark btn-full" onClick={() => { onAddToCart(p); onClose(); }}>Add to Cart — ${p.price}</button>
            <button data-clickable className="btn btn-outline-dark btn-full" onClick={() => { onClose(); setPage('product', p); }}>View Full Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// ROOT APP
// =====================================================
export default function App() {
  const [page, setPageRaw] = useState('home');
  const [productData, setProductData] = useState(null);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bwr3d_cart') || '[]'); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const setPage = useCallback((p, data) => {
    setProductData(data || null);
    setPageRaw(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }, []);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const newCart = [...prev, { ...item, qty: item.qty || 1 }];
      localStorage.setItem('bwr3d_cart', JSON.stringify(newCart));
      return newCart;
    });
    showToast(`Added: ${item.name}`);
  }, [showToast]);

  const removeFromCart = useCallback((idx) => {
    setCart(prev => {
      const newCart = prev.filter((_, i) => i !== idx);
      localStorage.setItem('bwr3d_cart', JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const onOrderComplete = useCallback(() => {
    setCart([]);
    localStorage.removeItem('bwr3d_cart');
    showToast('Order placed! Thank you.');
  }, [showToast]);

  const cartCount = cart.reduce((s, c) => s + (c.qty || 1), 0);

  useEffect(() => {
    document.title = 'BWR 3D Works — Where Rebellion Meets Precision';
  }, []);

  const currentProduct = productData || PRODUCTS[0];

  return (
    <>
      <GlobalStyles />
      <CustomCursor />
      <Toast message={toastMsg} />

      <Navbar page={page} setPage={setPage} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      {page === 'home' && <HomePage setPage={setPage} addToCart={addToCart} />}
      {page === 'products' && <ProductsPage setPage={setPage} addToCart={addToCart} openModal={setModalProduct} />}
      {page === 'product' && <ProductPage product={currentProduct} setPage={setPage} addToCart={addToCart} />}
      {page === 'checkout' && <CheckoutPage cart={cart} setPage={setPage} onOrderComplete={onOrderComplete} />}
      {page === 'about' && <AboutPage setPage={setPage} />}
      {page === 'contact' && <ContactPage setPage={setPage} />}

      {cartOpen && <CartSidebar cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} setPage={setPage} />}
      {modalProduct && <QuickViewModal product={modalProduct} onClose={() => setModalProduct(null)} onAddToCart={addToCart} setPage={setPage} />}
    </>
  );
}
