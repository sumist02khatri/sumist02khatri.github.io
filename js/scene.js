/* scene.js: the three.js world (toon shading, torii gate, islands, companion, camera flight).
   Needs three.js r128 and ui.js loaded first. */
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x120a2b); scene.fog = new THREE.Fog(0x2a1060, 25, 90);
const cam = new THREE.PerspectiveCamera(60, 1, .1, 300);
const sun = new THREE.DirectionalLight(0xffffff, 1); sun.position.set(5, 10, 6); scene.add(sun, new THREE.AmbientLight(0x8866cc, .7));
const grad = new THREE.DataTexture(new Uint8Array([70, 160, 255]), 3, 1, THREE.LuminanceFormat); grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.needsUpdate = true;
function toon(geo, color, out = 1.07) { const m = new THREE.Mesh(geo, new THREE.MeshToonMaterial({ color, gradientMap: grad })); const o = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x0d0620, side: THREE.BackSide })); o.scale.setScalar(out); m.add(o); return m }
// moon
const moon = new THREE.Mesh(new THREE.SphereGeometry(14, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffe9f4, fog: false })); moon.position.set(0, 12, -95); scene.add(moon);
const halo = new THREE.Mesh(new THREE.SphereGeometry(19, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff7eb6, transparent: true, opacity: .25, fog: false })); halo.position.copy(moon.position); scene.add(halo);
// stars
{
   const n = 700, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { p[i * 3] = (Math.random() - .5) * 220; p[i * 3 + 1] = Math.random() * 80 - 5; p[i * 3 + 2] = -Math.random() * 140 + 20 }
   const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: .4, fog: false })))
}
// torii gate
const torii = new THREE.Group(), red = 0xff3b4e;
[-3, 3].forEach(x => { const p = toon(new THREE.CylinderGeometry(.35, .4, 8, 16), red); p.position.set(x, 4, 0); torii.add(p) });
const b1 = toon(new THREE.BoxGeometry(9.4, .7, .8), red); b1.position.y = 7.6; torii.add(b1);
const b2 = toon(new THREE.BoxGeometry(7, .45, .5), red); b2.position.y = 6; torii.add(b2);
const b3 = toon(new THREE.BoxGeometry(10.6, .35, 1), 0x1a1030); b3.position.y = 8.1; torii.add(b3);
scene.add(torii);
// ground disc
const ground = toon(new THREE.CylinderGeometry(9, 10, 1, 40), 0x3b2a8a); ground.position.y = -.5; scene.add(ground);
const ring = new THREE.Mesh(new THREE.TorusGeometry(6.5, .08, 8, 64), new THREE.MeshBasicMaterial({ color: 0x5ee7ff })); ring.rotation.x = Math.PI / 2; ring.position.y = .1; scene.add(ring);
// orbiting ring
const orb = new THREE.Mesh(new THREE.TorusGeometry(9, .06, 8, 80), new THREE.MeshBasicMaterial({ color: 0xffd84d })); orb.position.y = 5; scene.add(orb);
// floating crystals
const crystals = [], cc = [0xff7eb6, 0x5ee7ff, 0xffd84d, 0xb79cff, 0x7dffb2];
for (let i = 0; i < 34; i++) { const c = toon(new THREE.OctahedronGeometry(.5 + Math.random() * .9), cc[i % 5], 1.1); c.position.set((Math.random() - .5) * 34, Math.random() * 16 + 1, 10 - Math.random() * 95); c.userData = { s: Math.random() * 2 + .5, o: Math.random() * 6.28, y: c.position.y }; scene.add(c); crystals.push(c) }
// floating islands
const isl = [];
[[-12, 6, -20], [13, 8, -34], [-10, 5, -50], [11, 7, -64]].forEach(([x, y, z], i) => {
   const g = new THREE.Group(); const t = toon(new THREE.CylinderGeometry(4, 3.6, .8, 20), 0x6bff9e); const r = toon(new THREE.ConeGeometry(3.6, 5, 20), 0x7a4a2a); r.rotation.x = Math.PI; r.position.y = -2.9;
   const tr = toon(new THREE.ConeGeometry(1, 3, 6), 0xff7eb6); tr.position.y = 2; const tk = toon(new THREE.CylinderGeometry(.2, .25, 1.2, 8), 0x5a3520); tk.position.y = .9; g.add(t, r, tk, tr); g.position.set(x, y, z); g.userData = { y, o: i }; scene.add(g); isl.push(g)
});
// sakura petals
const N = 600, pp = new Float32Array(N * 3), pv = [];
for (let i = 0; i < N; i++) { pp[i * 3] = (Math.random() - .5) * 50; pp[i * 3 + 1] = Math.random() * 25; pp[i * 3 + 2] = 15 - Math.random() * 100; pv.push(Math.random() * .03 + .01) }
const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffb3d4, size: .18, transparent: true, opacity: .85, depthWrite: false })));
// speed lines
const lines = []; for (let i = 0; i < 40; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(.04, .04, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .35 })); l.position.set((Math.random() - .5) * 30, Math.random() * 14, 10 - Math.random() * 90); scene.add(l); lines.push(l) }

let enter = 0, pt = 0;
const rnd = (a, b) => a + Math.random() * (b - a);
// chibi companion: original masked hero
const hero = new THREE.Group(), head = new THREE.Group(), navy = 0x1b2a6b, rd = 0xd62839, skin = 0xffe0cc;
head.add(toon(new THREE.SphereGeometry(1, 28, 28), navy), toon(new THREE.SphereGeometry(1.03, 28, 16, 0, Math.PI * 2, Math.PI * .3, Math.PI * .3), rd), toon(new THREE.SphereGeometry(1.02, 28, 16, 0, Math.PI * 2, Math.PI * .6, Math.PI * .4), skin));
[-1, 1].forEach(q => {
   const ear = toon(new THREE.ConeGeometry(.3, .7, 4), rd); ear.position.set(q * .62, .95, 0); ear.rotation.z = -q * .45;
   const e = new THREE.Mesh(new THREE.SphereGeometry(.26, 16, 16), new THREE.MeshBasicMaterial({ color: 0xe9fdff })); e.scale.set(1.1, 1.35, .3); e.position.set(q * .42, -.02, .95); e.rotation.z = q * .3;
   const pu = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 10), new THREE.MeshBasicMaterial({ color: navy })); pu.position.set(q * .42, -.02, 1.02);
   const sh = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); sh.position.set(q * .42 + .05, .05, 1.07); head.add(ear, e, pu, sh)
});
const mouth = new THREE.Mesh(new THREE.TorusGeometry(.1, .025, 6, 12, Math.PI), new THREE.MeshBasicMaterial({ color: 0x7a2a4a })); mouth.position.set(0, -.5, .93); mouth.rotation.z = Math.PI; head.add(mouth);
head.position.y = .6;
const body = toon(new THREE.CylinderGeometry(.55, .8, 1.3, 16), rd); body.position.y = -1.1;
const em = toon(new THREE.OctahedronGeometry(.25), 0xffd84d, 1.12); em.scale.z = .4; em.position.set(0, -.8, .62);
const sc = toon(new THREE.TorusGeometry(.62, .16, 8, 20), navy); sc.rotation.x = Math.PI / 2; sc.position.y = -.5;
const tail = new THREE.Group(), tb = toon(new THREE.BoxGeometry(.3, .12, 1.2), navy); tb.position.z = -.6; tail.add(tb); tail.position.set(0, -.5, -.55);
const hand = toon(new THREE.SphereGeometry(.22, 12, 12), skin); hand.position.set(.95, -1, .3);
const hand2 = toon(new THREE.SphereGeometry(.22, 12, 12), skin); hand2.position.set(-.95, -1.3, .3);
hero.add(head, body, em, sc, tail, hand, hand2); scene.add(hero);
// shooting stars
const shoot = []; for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(7, .08, .08), new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false })); m.rotation.z = .45; m.userData = { t: i * 2.3 }; scene.add(m); shoot.push(m) }
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix() }
addEventListener('resize', resize); resize();
let sm = 0, last = 0, vs = 0;
addEventListener('scroll', () => { const m = document.documentElement.scrollHeight - innerHeight; scroll = m > 0 ? scrollY / m : 0; document.getElementById('bar').style.width = scroll * 100 + '%' });
const clock = new THREE.Clock();
function loop() {
   requestAnimationFrame(loop); const t = clock.getElapsedTime();
   sm += (scroll - sm) * .06; vs += (Math.abs(scroll - sm) * .06 - vs) * .1; const v = vs;
   // camera flies forward along a curvy path
   const z = 16 - sm * 95, x = Math.sin(sm * 9) * 5 + mx * 3, y = 6 + Math.sin(sm * 6) * 2.5 - my * 2.5;
   enter += ((started ? 1 : 0) - enter) * .03; cam.position.set(x, y + (1 - enter) * 12, z + (1 - enter) * 28); cam.lookAt(Math.sin(sm * 9 + .6) * 4, 5 + Math.sin(sm * 6 + .4) * 2, z - 18);
   cam.rotation.z += Math.sin(sm * 9) * .05; cam.fov = 60 + Math.min(v * 2200, 14); cam.updateProjectionMatrix();
   const dt = t - pt; pt = t;
   cam.updateMatrixWorld(); const hw = Math.tan(cam.fov * Math.PI / 360) * 10 * cam.aspect;
   hero.position.copy(cam.localToWorld(new THREE.Vector3(hw * .62, -1.3 + Math.sin(t * 1.6) * .35, -10)));
   hero.quaternion.copy(cam.quaternion); hero.scale.setScalar(.45 + .4 * Math.min(1, cam.aspect / 1.5));
   head.rotation.y = mx * 1.1; head.rotation.x = my * .7; tail.rotation.y = Math.sin(t * 5) * .4; hand.position.y = -1 + Math.sin(t * 6) * .2;
   torii.position.y = Math.sin(t) * .25; ring.rotation.z = t * .4; orb.rotation.set(t * .5, t * .3, 0); orb.scale.setScalar(1 + Math.sin(t * 2) * .08);
   halo.scale.setScalar(1 + Math.sin(t) * .04); moon.rotation.y = t * .05;
   crystals.forEach(c => { c.rotation.x += .01 * c.userData.s; c.rotation.y += .015 * c.userData.s; c.position.y = c.userData.y + Math.sin(t * c.userData.s + c.userData.o) * .8 });
   isl.forEach(g => { g.position.y = g.userData.y + Math.sin(t * .8 + g.userData.o) * .7; g.rotation.y = t * .15 });
   const a = pg.attributes.position; for (let i = 0; i < N; i++) { a.array[i * 3 + 1] -= pv[i]; a.array[i * 3] += Math.sin(t + i) * .01; if (a.array[i * 3 + 1] < 0) a.array[i * 3 + 1] = 25 } a.needsUpdate = true;
   lines.forEach(l => { l.material.opacity = Math.min(.6, .15 + v * 60) });
   shoot.forEach(m => {
      const u = m.userData; u.t += dt; if (u.t > 7) { u.t = 0; u.p = new THREE.Vector3(cam.position.x + rnd(0, 35), cam.position.y + rnd(10, 22), cam.position.z - rnd(30, 70)) }
      if (u.p && u.t < 1.5) { m.visible = true; m.position.set(u.p.x - u.t * 30, u.p.y - u.t * 14, u.p.z) } else m.visible = false
   });
   renderer.render(scene, cam)
}
loop();
