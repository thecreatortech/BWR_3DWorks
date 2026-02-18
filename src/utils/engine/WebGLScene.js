// =====================================================
// WEBGL ENGINE — PBR Shaders + Procedural Geometry
// =====================================================
export class WebGLScene {
	constructor(canvas, opts = {}) {
		this.canvas = canvas;
		this.opts = opts;
		this.running = false;
		this.gl = null;
		this.init();
	}

	init() {
		const canvas = this.canvas;
		const gl =
			canvas.getContext('webgl', {
				antialias: true,
				alpha: false,
				premultipliedAlpha: false,
			}) ||
			canvas.getContext('experimental-webgl', {
				antialias: true,
				alpha: false,
				premultipliedAlpha: false,
			});
		if (!gl) {
			console.error(
				'[WebGLScene] WebGL not supported. Canvas dimensions:',
				canvas.width,
				canvas.height,
				'offsetWidth/Height:',
				canvas.offsetWidth,
				canvas.offsetHeight,
			);
			// Fallback: show error message using 2D canvas
			const ctx = canvas.getContext('2d');
			if (ctx) {
				canvas.width = canvas.offsetWidth || 300;
				canvas.height = canvas.offsetHeight || 300;
				ctx.fillStyle = '#f0f0f0';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = '#999';
				ctx.font = '14px sans-serif';
				ctx.textAlign = 'center';
				ctx.fillText('WebGL not supported', canvas.width / 2, canvas.height / 2);
			}
			return;
		}
		this.gl = gl;
		this.dpr = Math.min(window.devicePixelRatio, 2);

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
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
				console.error('[WebGLScene] Shader compile error:', gl.getShaderInfoLog(s));
			}
			return s;
		};

		this.prog = gl.createProgram();
		gl.attachShader(this.prog, mkShader(gl.VERTEX_SHADER, vs));
		gl.attachShader(this.prog, mkShader(gl.FRAGMENT_SHADER, fs));
		gl.linkProgram(this.prog);
		if (!gl.getProgramParameter(this.prog, gl.LINK_STATUS)) {
			console.error('[WebGLScene] Program link error:', gl.getProgramInfoLog(this.prog));
		}
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

		const geomFns = {
			vase: () => this.mkVase(),
			torus: () => this.mkTorus(),
			helical: () => this.mkHelical(),
			sphere: () => this.mkSphere(),
			ring: () => this.mkRing(),
		};
		this.geom = (geomFns[this.opts.geom] || geomFns.vase)();

		this.rotYaw = 0.5; // Slight rotation for better 3D view
		this.rotPitch = 0.15; // Slight downward angle
		this.dist = 4.5; // Much farther back to see the full model
		this.autoRot = true;
		this.autoSpeed = this.opts.speed || 0.004;
		this.dragging = false;
		this.lastX = 0;
		this.lastY = 0;
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
		this.W = w;
		this.H = h;
	}

	build(vArr, nArr, iArr) {
		const gl = this.gl;
		const vF = new Float32Array(vArr);
		const nF = new Float32Array(nArr);
		let iType, iF;
		if (vArr.length / 3 > 65535 || iArr.length > 65535) {
			const ext = gl.getExtension('OES_element_index_uint');
			iF = ext ? new Uint32Array(iArr) : new Uint16Array(iArr.map((x) => x % 65535));
			iType = gl.UNSIGNED_INT;
		} else {
			iF = new Uint16Array(iArr);
			iType = gl.UNSIGNED_SHORT;
		}
		const vb = gl.createBuffer(),
			nb = gl.createBuffer(),
			ib = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vb);
		gl.bufferData(gl.ARRAY_BUFFER, vF, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, nb);
		gl.bufferData(gl.ARRAY_BUFFER, nF, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, iF, gl.STATIC_DRAW);
		return { vb, nb, ib, cnt: iArr.length, type: iType };
	}

	mkTorus(R = 0.62, r = 0.22, mseg = 80, tseg = 40) {
		const v = [],
			n = [],
			idx = [];
		for (let i = 0; i <= mseg; i++) {
			const u = (i / mseg) * Math.PI * 2;
			for (let j = 0; j <= tseg; j++) {
				const v2 = (j / tseg) * Math.PI * 2;
				const x = (R + r * Math.cos(v2)) * Math.cos(u);
				const y = r * Math.sin(v2);
				const z = (R + r * Math.cos(v2)) * Math.sin(u);
				v.push(x, y, z);
				const cx = R * Math.cos(u),
					cz = R * Math.sin(u);
				n.push((x - cx) / r, y / r, (z - cz) / r);
			}
		}
		for (let i = 0; i < mseg; i++)
			for (let j = 0; j < tseg; j++) {
				const a = i * (tseg + 1) + j,
					b = a + 1,
					c = a + (tseg + 1),
					d = c + 1;
				idx.push(a, b, c, b, d, c);
			}
		return this.build(v, n, idx);
	}

	mkVase() {
		const v = [],
			n = [],
			idxA = [],
			segs = 80;
		const profile = [];
		for (let i = 0; i <= 80; i++) {
			const t = i / 80;
			const y = (t - 0.5) * 2.6;
			const s = Math.sin(t * Math.PI);
			const r =
				0.38 * s +
				0.1 +
				0.14 * Math.sin(t * Math.PI * 4.5) * s * s +
				0.06 * Math.sin(t * Math.PI * 9) * s;
			profile.push([r, y]);
		}
		for (let i = 0; i < profile.length; i++) {
			for (let j = 0; j <= segs; j++) {
				const ang = (j / segs) * Math.PI * 2;
				const [ri, yi] = profile[i];
				v.push(ri * Math.cos(ang), yi, ri * Math.sin(ang));
				let dr = 0,
					dy2 = 0;
				if (i < profile.length - 1) {
					dr = profile[i + 1][0] - ri;
					dy2 = profile[i + 1][1] - yi;
				} else {
					dr = ri - profile[i - 1][0];
					dy2 = yi - profile[i - 1][1];
				}
				const L = Math.sqrt(dr * dr + dy2 * dy2) || 1;
				n.push((dy2 / L) * Math.cos(ang), -dr / L, (dy2 / L) * Math.sin(ang));
			}
		}
		for (let i = 0; i < profile.length - 1; i++)
			for (let j = 0; j < segs; j++) {
				const a = i * (segs + 1) + j,
					b = a + 1,
					c = a + (segs + 1),
					d = c + 1;
				idxA.push(a, b, c, b, d, c);
			}
		return this.build(v, n, idxA);
	}

	mkHelical() {
		const v = [],
			n = [],
			idxA = [],
			segs = 64;
		const turns = 3.2,
			height = 2.6,
			baseR = 0.35,
			twist = 0.8;
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
				const ang = (j / segs) * Math.PI * 2 + pts[i][2];
				const [ri, yi] = pts[i];
				v.push(ri * Math.cos(ang), yi, ri * Math.sin(ang));
				let dr = 0,
					dy2 = 0;
				if (i < pts.length - 1) {
					dr = pts[i + 1][0] - ri;
					dy2 = pts[i + 1][1] - yi;
				} else {
					dr = ri - pts[i - 1][0];
					dy2 = yi - pts[i - 1][1];
				}
				const L = Math.sqrt(dr * dr + dy2 * dy2) || 1;
				n.push((dy2 / L) * Math.cos(ang), -dr / L, (dy2 / L) * Math.sin(ang));
			}
		}
		for (let i = 0; i < pts.length - 1; i++)
			for (let j = 0; j < segs; j++) {
				const a = i * (segs + 1) + j,
					b = a + 1,
					c = a + (segs + 1),
					d = c + 1;
				idxA.push(a, b, c, b, d, c);
			}
		return this.build(v, n, idxA);
	}

	mkSphere(subdivs = 5) {
		const t = (1 + Math.sqrt(5)) / 2;
		let verts = [
			[-1, t, 0],
			[1, t, 0],
			[-1, -t, 0],
			[1, -t, 0],
			[0, -1, t],
			[0, 1, t],
			[0, -1, -t],
			[0, 1, -t],
			[t, 0, -1],
			[t, 0, 1],
			[-t, 0, -1],
			[-t, 0, 1],
		].map((v) => {
			const l = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
			return [v[0] / l, v[1] / l, v[2] / l];
		});
		let faces = [
			[0, 11, 5],
			[0, 5, 1],
			[0, 1, 7],
			[0, 7, 10],
			[0, 10, 11],
			[1, 5, 9],
			[5, 11, 4],
			[11, 10, 2],
			[10, 7, 6],
			[7, 1, 8],
			[3, 9, 4],
			[3, 4, 2],
			[3, 2, 6],
			[3, 6, 8],
			[3, 8, 9],
			[4, 9, 5],
			[2, 4, 11],
			[6, 2, 10],
			[8, 6, 7],
			[9, 8, 1],
		];
		const mid = {};
		const midpoint = (a, b) => {
			const k = Math.min(a, b) + '_' + Math.max(a, b);
			if (mid[k] !== undefined) return mid[k];
			const va = verts[a],
				vb = verts[b];
			const mx = (va[0] + vb[0]) / 2,
				my = (va[1] + vb[1]) / 2,
				mz = (va[2] + vb[2]) / 2;
			const l = Math.sqrt(mx * mx + my * my + mz * mz);
			const idx2 = verts.length;
			verts.push([mx / l, my / l, mz / l]);
			return (mid[k] = idx2);
		};
		for (let s = 0; s < subdivs; s++) {
			const nf = [];
			for (const [a, b, c] of faces) {
				const ab = midpoint(a, b),
					bc = midpoint(b, c),
					ca = midpoint(c, a);
				nf.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
			}
			faces = nf;
		}
		const v2 = [],
			n2 = [],
			idx2 = [];
		verts.forEach(([x, y, z]) => {
			v2.push(x * 0.82, y * 0.82, z * 0.82);
			n2.push(x, y, z);
		});
		faces.forEach(([a, b, c]) => idx2.push(a, b, c));
		return this.build(v2, n2, idx2);
	}

	mkRing() {
		return this.mkTorus(0.55, 0.18, 64, 32);
	}

	m4mul(a, b) {
		const r = new Float32Array(16);
		for (let i = 0; i < 4; i++)
			for (let j = 0; j < 4; j++) {
				let s = 0;
				for (let k = 0; k < 4; k++) s += a[i * 4 + k] * b[k * 4 + j];
				r[i * 4 + j] = s;
			}
		return r;
	}
	persp(fov, asp, n, f) {
		const ff = 1 / Math.tan(fov / 2);
		return new Float32Array([
			ff / asp,
			0,
			0,
			0,
			0,
			ff,
			0,
			0,
			0,
			0,
			(f + n) / (n - f),
			-1,
			0,
			0,
			(2 * f * n) / (n - f),
			0,
		]);
	}
	rotX(a) {
		return new Float32Array([
			1,
			0,
			0,
			0,
			0,
			Math.cos(a),
			-Math.sin(a),
			0,
			0,
			Math.sin(a),
			Math.cos(a),
			0,
			0,
			0,
			0,
			1,
		]);
	}
	rotY(a) {
		return new Float32Array([
			Math.cos(a),
			0,
			Math.sin(a),
			0,
			0,
			1,
			0,
			0,
			-Math.sin(a),
			0,
			Math.cos(a),
			0,
			0,
			0,
			0,
			1,
		]);
	}
	trans(x, y, z) {
		return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
	}
	inv4(m) {
		const r = new Float32Array(16);
		r[0] = m[0];
		r[1] = m[4];
		r[2] = m[8];
		r[3] = 0;
		r[4] = m[1];
		r[5] = m[5];
		r[6] = m[9];
		r[7] = 0;
		r[8] = m[2];
		r[9] = m[6];
		r[10] = m[10];
		r[11] = 0;
		r[12] = 0;
		r[13] = 0;
		r[14] = 0;
		r[15] = 1;
		return r;
	}

	bindEvents() {
		const c = this.canvas;
		const onDown = (e) => {
			this.dragging = true;
			this.autoRot = false;
			const p = e.touches ? e.touches[0] : e;
			this.lastX = p.clientX;
			this.lastY = p.clientY;
			e.preventDefault();
		};
		const onMove = (e) => {
			if (!this.dragging) return;
			const p = e.touches ? e.touches[0] : e;
			this.rotYaw += (p.clientX - this.lastX) * 0.006;
			this.rotPitch += (p.clientY - this.lastY) * 0.005;
			this.rotPitch = Math.max(-1.4, Math.min(1.4, this.rotPitch));
			this.lastX = p.clientX;
			this.lastY = p.clientY;
			e.preventDefault();
		};
		const onUp = () => {
			this.dragging = false;
			setTimeout(() => {
				if (!this.dragging) this.autoRot = true;
			}, 2200);
		};
		const onWheel = (e) => {
			this.dist += e.deltaY * 0.003;
			this.dist = Math.max(2.5, Math.min(8, this.dist)); // Zoom range for proper viewing
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
		const {
			gl,
			prog,
			loc,
			geom,
			color,
			rough,
			metal,
			bgColor,
			rotPitch,
			rotYaw,
			dist,
			wireframe,
		} = this;
		const W = this.W || 1,
			H = this.H || 1;

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

		// Debug: check GL errors on first frame
		if (this.time < 0.02) {
			console.log(
				'[WebGLScene] Rendering with color:',
				color,
				'bgColor:',
				bgColor,
				'dist:',
				dist,
			);
			const err = gl.getError();
			if (err !== gl.NO_ERROR) {
				console.error('[WebGLScene] GL Error after drawElements:', err);
			} else {
				console.log('[WebGLScene] Draw successful, rendered', geom.cnt, 'indices');
			}
		}

		if (wireframe) {
			gl.uniform1i(loc.uWire, 1);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			gl.drawElements(gl.LINES, geom.cnt, geom.type, 0);
			gl.disable(gl.BLEND);
		}
	}

	reset() {
		this.rotYaw = 0.5;
		this.rotPitch = 0.15;
		this.dist = 4.5;
		this.autoRot = true;
	}
	toggleWire() {
		this.wireframe = !this.wireframe;
	}
	destroy() {
		this.running = false;
	}
}
