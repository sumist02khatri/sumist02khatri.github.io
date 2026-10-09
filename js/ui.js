/* ui.js: shared state, DOM interactions, intro, sound and click effects.
   Loaded before scene.js, which reads mx, my, scroll and started. */
let mx = 0, my = 0, scroll = 0, started = false;

const cur = document.getElementById('cur');
addEventListener('mousemove', e => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5 });
document.querySelectorAll('a,.card,.chip').forEach(el => { el.addEventListener('mouseenter', () => cur.classList.add('big')); el.addEventListener('mouseleave', () => cur.classList.remove('big')) });
const cols = ['#ff7eb6', '#5ee7ff', '#ffd84d', '#b79cff', '#7dffb2'];
['Java', 'Spring Boot', 'Python', 'React', 'FastAPI', 'REST APIs', 'MySQL', 'Docker', 'AWS', 'TensorFlow', 'DSA', 'Git'].forEach((s, i) => { const d = document.createElement('div'); d.className = 'chip'; d.textContent = s; d.style.background = cols[i % 5]; d.style.animationDelay = (i * .3) + 's'; document.getElementById('chips').appendChild(d) });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }), { threshold: .2 });
document.querySelectorAll('.rv').forEach((e, i) => { e.style.transitionDelay = (i % 3) * .12 + 's'; io.observe(e) });
document.querySelectorAll('.card').forEach(c => { c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(600px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale(1.04)` }); c.addEventListener('mouseleave', () => c.style.transform = '') });
const typEl = document.getElementById('typ');
const words = ['B.Tech CSE graduate, 2026.', 'Java + Spring Boot builder.', 'Full-stack with React + FastAPI.', 'Ships ML apps too.']; let wi = 0, ci = 0, del = false;
(function type() { const w = words[wi]; typEl.textContent = w.slice(0, ci); if (!del && ci++ === w.length) { del = true; return setTimeout(type, 1400) } if (del && --ci < 0) { del = false; ci = 0; wi = (wi + 1) % words.length } setTimeout(type, del ? 30 : 70) })();


// sound + interactions
let ac; function beep(f, d = .12, type = 'triangle', v = .08, sl = 0) { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(), n = ac.currentTime; o.type = type; o.frequency.setValueAtTime(f, n); if (sl) o.frequency.exponentialRampToValueAtTime(f * sl, n + d); g.gain.setValueAtTime(v, n); g.gain.exponentialRampToValueAtTime(.001, n + d); o.connect(g).connect(ac.destination); o.start(); o.stop(n + d) } catch (e) { } }
document.getElementById('go').onclick = () => { started = true; document.getElementById('intro').classList.add('go'); document.body.classList.remove('lock');[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .25), i * 90)); setTimeout(() => document.getElementById('intro').remove(), 1000) };
const sfxw = ['ドン!', 'バーン!', 'ズバッ!', 'キラッ!', 'BOOM!', 'WOW!', 'ゴゴゴ'];
addEventListener('pointerdown', e => {
   if (!started) return;
   const s = document.createElement('div'); s.className = 'sfx'; s.textContent = sfxw[Math.random() * sfxw.length | 0]; s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; document.body.appendChild(s); setTimeout(() => s.remove(), 800);
   for (let i = 0; i < 12; i++) {
      const q = document.createElement('div'); q.className = 'spk'; q.textContent = ['✦', '🌸', '⭐'][i % 3]; q.style.left = e.clientX + 'px'; q.style.top = e.clientY + 'px'; document.body.appendChild(q); const a = Math.random() * 6.28, r = 60 + Math.random() * 90;
      q.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * r}px),calc(-50% + ${Math.sin(a) * r}px)) scale(.3) rotate(240deg)`, opacity: 0 }], { duration: 700, easing: 'ease-out' }).onfinish = () => q.remove()
   }
   beep(rnd(600, 1100), .12, 'square', .04)
});
