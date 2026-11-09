'use strict';
/* ---------- random + integer helpers ---------- */
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[ri(0, a.length - 1)];
const nz = (a, b) => { let x; do { x = ri(a, b); } while (x === 0); return x; };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = ri(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
const PI = Math.PI;
const MIN = '−';

/* ---------- exact fractions ---------- */
class Q {
  constructor(n, d = 1) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); this.n = n / g; this.d = d / g; }
  static of(x) { return x instanceof Q ? x : new Q(x); }
  add(o) { o = Q.of(o); return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = Q.of(o); return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = Q.of(o); return new Q(this.n * o.n, this.d * o.d); }
  div(o) { o = Q.of(o); return new Q(this.n * o.d, this.d * o.n); }
  get v() { return this.n / this.d; }
  str() { return this.d === 1 ? String(this.n) : this.n + '/' + this.d; }
}
const fr = x => { if (typeof x !== 'number' || !isFinite(x)) return x; for (let d = 1; d <= 120; d++) if (Math.abs(x * d - Math.round(x * d)) < 1e-9) return new Q(Math.round(x * d), d); return x; };
const val = x => (x && typeof x === 'object') ? x.v : x;

/* ---------- HTML maths helpers ---------- */
const FR = (a, b) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
function H(x) {
  if (x instanceof Q) return x.d === 1 ? H(x.n) : (x.n < 0 ? MIN : '') + FR(Math.abs(x.n), x.d);
  if (typeof x === 'number') {
    if (!isFinite(x)) return (x < 0 ? MIN : '+') + '∞';
    const s = String(Math.round(Math.abs(x) * 1e6) / 1e6).replace('.', ',');
    return (x < 0 ? MIN : '') + s;
  }
  if (x && typeof x === 'object' && 'h' in x) return x.h;
  return String(x);
}
const P = x => val(x) < 0 ? '(' + H(x) + ')' : H(x);           // parenthesise negatives
function S(x) {                                                    // text that can be typed into a field
  if (x instanceof Q) return x.str();
  if (typeof x === 'number') return !isFinite(x) ? (x < 0 ? '-inf' : 'inf') : String(Math.round(x * 1e6) / 1e6);
  if (x && typeof x === 'object' && 's' in x) return x.s;
  return String(x);
}
function M(a, o = {}) {
  const c = a[0].length;
  return `<span class="mx${o.det ? ' det' : ''}"><span class="mg" style="grid-template-columns:repeat(${c},auto)">` +
    a.map((r, i) => r.map((x, j) => `<span${o.hl && o.hl(i, j) ? ' class="hl"' : ''}>${H(x)}</span>`).join('')).join('') + '</span></span>';
}
const D = (a, o = {}) => M(a, { ...o, det: true });
const V = v => M(v.map(x => [x]));
const I = s => `<i>${s}</i>`;
const sub = (a, b) => `${I(a)}<sub>${b}</sub>`;
function terms(list) {
  let out = '';
  for (const [c, s] of list) {
    const v = val(c); if (!v) continue;
    const neg = v < 0, a = c instanceof Q ? new Q(Math.abs(c.n), c.d) : Math.abs(c);
    const one = val(a) === 1;
    const body = (one && s) ? s : H(a) + s;
    out += out ? (neg ? ' − ' : ' + ') + body : (neg ? MIN : '') + body;
  }
  return out || '0';
}
const cx = (a, b) => terms([[a, ''], [b, I('i')]]);
const pw = (v, k) => k === 0 ? '' : k === 1 ? I(v) : `${I(v)}<sup>${k}</sup>`;
function poly(c, v, desc = true) {            // c[k] = coefficient of v^k
  let l = c.map((x, k) => [x, pw(v, k)]); if (desc) l = l.reverse();
  return terms(l);
}
const lin = (a, v = 'x') => a === 0 ? I(v) : `${I(v)} ${a < 0 ? '+' : MIN} ${Math.abs(a)}`;   // (x − a)
const sys = eqs => `<span class="sys">${eqs.map(e => `<span>${e}</span>`).join('')}</span>`;
const lim = (v, to) => `<span class="lim"><span>lim</span><span>${I(v)}→${to}</span></span>`;
const root = (inner, idx) => `<span class="rt">${idx ? `<sup>${idx}</sup>` : ''}√<span class="rd">${inner}</span></span>`;
const big = (a, b) => `<span class="fr big"><span>${a}</span><span>${b}</span></span>`;

/* ---------- surds c·√r and angles (multiples of π) ---------- */
const sd = (c, r = 1) => ({ c: Q.of(c), r, get v() { return this.c.v * Math.sqrt(this.r); }, get s() { return sdS(this); }, get h() { return sdH(this); } });
function sdH(s) {
  if (s.r === 1 || s.c.n === 0) return H(s.c);
  const n = Math.abs(s.c.n), top = (n === 1 ? '' : n) + '√' + s.r;
  return (s.c.n < 0 ? MIN : '') + (s.c.d === 1 ? top : FR(top, s.c.d));
}
function sdS(s) {
  if (s.r === 1 || s.c.n === 0) return s.c.str();
  return (s.c.n === 1 ? '' : s.c.n === -1 ? '-' : s.c.n) + `sqrt(${s.r})` + (s.c.d === 1 ? '' : '/' + s.c.d);
}
const sdMul = (a, b) => a.r === b.r ? sd(a.c.mul(b.c).mul(a.r), 1) : sd(a.c.mul(b.c), a.r * b.r);
function cosE(m) {                       // m = angle / (π/12)
  m = ((m % 24) + 24) % 24; if (m > 12) m = 24 - m; let sg = 1; if (m > 6) { sg = -1; m = 12 - m; }
  const t = { 0: [1, 1, 1], 2: [1, 2, 3], 3: [1, 2, 2], 4: [1, 2, 1], 6: [0, 1, 1] }[m];
  return sd(new Q(sg * t[0], t[1]), t[2]);
}
const sinE = m => cosE(m - 6);
function cxSd(re, im) {
  const R = re.c.n !== 0, Im = im.c.n !== 0; if (!R && !Im) return '0';
  let out = R ? sdH(re) : '';
  if (Im) {
    const neg = im.c.n < 0, a = sd(new Q(Math.abs(im.c.n), im.c.d), im.r);
    const body = (a.c.n === 1 && a.c.d === 1 && a.r === 1) ? I('i') : sdH(a) + I('i');
    out += R ? (neg ? ' − ' : ' + ') + body : (neg ? MIN : '') + body;
  }
  return out;
}
const ang = q => ({                      // q·π
  q, get v() { return this.q.v * PI; },
  get s() { const q = this.q; return q.n === 0 ? '0' : (q.n === 1 ? '' : q.n === -1 ? '-' : q.n) + 'pi' + (q.d === 1 ? '' : '/' + q.d); },
  get h() { const q = this.q; if (q.n === 0) return '0'; const n = Math.abs(q.n), top = (n === 1 ? '' : n) + 'π'; return (q.n < 0 ? MIN : '') + (q.d === 1 ? top : FR(top, q.d)); }
});
const angM = m => ang(new Q(m, 12));     // from π/12 units

/* ---------- matrices (integers, or Q where noted) ---------- */
const rm = (r, c, lo, hi) => Array.from({ length: r }, () => Array.from({ length: c }, () => ri(lo, hi)));
const T = A => A[0].map((_, j) => A.map(r => r[j]));
const mmul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));
const qmul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, x, k) => s.add(Q.of(x).mul(B[k][j])), new Q(0))));
const det2 = A => A[0][0] * A[1][1] - A[0][1] * A[1][0];
const minorM = (A, i, j) => A.filter((_, r) => r !== i).map(r => r.filter((_, c) => c !== j));
function det(A) {
  const n = A.length; if (n === 1) return A[0][0]; if (n === 2) return det2(A);
  let s = 0; for (let j = 0; j < n; j++) if (A[0][j]) s += (j % 2 ? -1 : 1) * A[0][j] * det(minorM(A, 0, j)); return s;
}
const repCol = (A, j, b) => A.map((r, i) => r.map((x, c) => c === j ? b[i] : x));
const inv2 = A => { const d = det2(A); return [[new Q(A[1][1], d), new Q(-A[0][1], d)], [new Q(-A[1][0], d), new Q(A[0][0], d)]]; };
const sarrus = A => {
  const [[a, b, c], [d, e, f], [g, h, i]] = A;
  return { pos: [a * e * i, b * f * g, c * d * h], neg: [c * e * g, a * f * h, b * d * i], ps: `${P(a)}·${P(e)}·${P(i)} + ${P(b)}·${P(f)}·${P(g)} + ${P(c)}·${P(d)}·${P(h)}`, ns: `${P(c)}·${P(e)}·${P(g)} + ${P(a)}·${P(f)}·${P(h)} + ${P(b)}·${P(d)}·${P(i)}` };
};
const d2s = A => `${P(A[0][0])}·${P(A[1][1])} − ${P(A[0][1])}·${P(A[1][0])}`;

/* ---------- answer parser: 3/4, -2.5, 0,5, 3sqrt(2), 7pi/6, inf ---------- */
function parseNum(str) {
  let s = String(str).trim().toLowerCase();
  if (!s || /\d\s+\d/.test(s)) return NaN;
  s = s.replace(/[−–—]/g, '-').replace(/,/g, '.').replace(/[×·]/g, '*').replace(/[÷:]/g, '/')
    .replace(/π/g, 'pi').replace(/∞|begalyb[eė]|infinity|oo/g, 'inf').replace(/√/g, 'sqrt').replace(/∛/g, 'cbrt').replace(/\s+/g, '');
  const tk = []; const re = /(\d+\.?\d*|\.\d+)|([a-z]+)|([-+*/^()])/y; let m, pos = 0;
  while (pos < s.length) { re.lastIndex = pos; m = re.exec(s); if (!m) return NaN; tk.push(m[1] ? { t: 'n', v: parseFloat(m[1]) } : m[2] ? { t: 'id', v: m[2] } : { t: m[3] }); pos = re.lastIndex; }
  let i = 0, bad = false;
  const peek = () => tk[i], eat = () => tk[i++];
  function atom() {
    const k = eat(); if (!k) { bad = true; return NaN; }
    if (k.t === 'n') return k.v;
    if (k.t === '(') { const v = expr(); if (!peek() || eat().t !== ')') bad = true; return v; }
    if (k.t === 'id') {
      if (k.v === 'pi') return PI; if (k.v === 'inf') return Infinity;
      if (k.v === 'sqrt') return Math.sqrt(power()); if (k.v === 'cbrt') return Math.cbrt(power());
    }
    bad = true; return NaN;
  }
  function power() { const b = atom(); if (peek() && peek().t === '^') { eat(); const e = unary(); return Math.pow(b, e); } return b; }
  function unary() { if (peek() && peek().t === '-') { eat(); return -unary(); } if (peek() && peek().t === '+') { eat(); return unary(); } return power(); }
  function term() {
    let v = unary();
    for (;;) {
      const k = peek(); if (!k) break;
      if (k.t === '*') { eat(); v *= unary(); } else if (k.t === '/') { eat(); v /= unary(); }
      else if (k.t === 'n' || k.t === 'id' || k.t === '(') v *= power(); else break;
    }
    return v;
  }
  function expr() { let v = term(); for (;;) { const k = peek(); if (!k) break; if (k.t === '+') { eat(); v += term(); } else if (k.t === '-') { eat(); v -= term(); } else break; } return v; }
  const v = expr(); if (bad || i < tk.length) return NaN; return v;
}

/* ---------- checking ---------- */
function close(a, b, mod) {
  if (typeof a !== 'number' || isNaN(a)) return false;
  if (!isFinite(b)) return a === b;
  if (!isFinite(a)) return false;
  if (mod) { const d = (((a - b) % mod) + mod) % mod; return Math.min(d, mod - d) < 1e-6; }
  return Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b));
}
const numeric = (f, a) => f.k === 'mat' ? a.map(r => r.map(val)) : f.k === 'num' ? val(a) : a;
function checkStep(step, vals, ctx) {
  if (step.val) {
    const r = step.val(vals, ctx);
    if (r === true) return { ok: true, bad: [] };
    if (typeof r === 'string') return { ok: false, bad: [], msg: r };
    return { ok: false, bad: r.bad || [], msg: r.msg };
  }
  const bad = [];
  step.fields.forEach((f, k) => {
    const a = numeric(f, step.ans[k]), v = vals[k];
    if (f.k === 'num') { if (!close(v, a, f.mod)) bad.push({ f: k }); }
    else if (f.k === 'mat') { const cells = []; a.forEach((r, i) => r.forEach((x, j) => { if (!close(v[i][j], x)) cells.push([i, j]); })); if (cells.length) bad.push({ f: k, cells }); }
    else if (f.k === 'choice') { if (v !== a) bad.push({ f: k }); }
    else if (f.k === 'checks') { if (a.some((x, i) => !!x !== !!v[i])) bad.push({ f: k }); }
  });
  return { ok: !bad.length, bad };
}

/* ---------- step + type registry ---------- */
const num = (label, o = {}) => ({ k: 'num', label, ...o });
const mat = (r, c, label) => ({ k: 'mat', r, c, label });
const choice = options => ({ k: 'choice', options });
const checks = options => ({ k: 'checks', options });
const st = (q, fields, ans, hint, sol, extra = {}) => ({ q, fields, ans, hint, sol, ...extra });
const TOPICS = [
  { n: 1, name: 'Coordinate systems', lt: 'Koordinačių sistemos', test: 1 },
  { n: 2, name: 'Vectors and the dot product', lt: 'Vektoriai. Skaliarinė sandauga', test: 1 },
  { n: 3, name: 'Matrix algebra', lt: 'Matricų algebra', test: 1 },
  { n: 4, name: 'Matrix dynamics and inverses', lt: 'Matricos ir vektorių dinamika. Atvirkštinės matricos', test: 1 },
  { n: 5, name: 'Determinants and linear systems', lt: 'Determinantas. Kramerio ir atvirkštinės matricos metodai', test: 1 },
  { n: 6, name: 'Complex numbers', lt: 'Kompleksiniai skaičiai', test: 1 },
  { n: 7, name: 'Eigenvalues and eigenvectors', lt: 'Tikrinės reikšmės ir tikriniai vektoriai', test: 1 },
  { n: 8, name: 'Iterated matrices', lt: 'Iteruotųjų matricų metodai', test: 1 },
  { n: 9, name: 'Limits', lt: 'Ribos', test: 2 }
];
const TYPES = [];
const reg = (id, topic, name, lt, method, gen) => TYPES.push({ id, topic, name, lt, method, gen });
const regLT = (id, name, method, gen) => { TYPES.find(t => t.id === id).L = { name, method, gen }; };
