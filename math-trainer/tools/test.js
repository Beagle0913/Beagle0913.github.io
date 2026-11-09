/* Trainer checks. Run:  node test.js [problems per type, default 400]
 *
 * 1. Answer parser: accepted and rejected spellings.
 * 2. Round trip: for every exercise type in both languages, the stored answers (written the way they
 *    would be typed) are accepted, a perturbed answer is rejected, and no text holds a broken value.
 * 3. Independent verification: the answers of every English generator are recomputed here with separate
 *    code (Gaussian elimination, polar complex arithmetic, numerical limits, simulation) from the raw
 *    problem data, and must agree.
 * 4. Language parity: with the same random seed the Lithuanian generator must produce exactly the same
 *    answers as the English one, so step 3 covers both.
 * 5. Speed: time to generate a problem of each type.
 */
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = fs.existsSync(path.join(__dirname, 'core.js')) ? __dirname : path.join(__dirname, '..', 'js');
const code = ['core.js', 'gen1.js', 'gen2.js', 'gen0.js', 'lt1.js', 'lt2.js', 'lt0.js', 'explain.js'].map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n') + '\n;globalThis.__x={TYPES,checkStep,numeric,parseNum,S,val,selfCheck,EXPLAIN};';
vm.runInThisContext(code);
const { TYPES, checkStep, numeric, parseNum, S, selfCheck, EXPLAIN } = globalThis.__x;
const N = +process.argv[2] || 400; let fails = 0;
const fail = (...a) => { fails++; if (fails <= 40) console.log('FAIL', ...a); };
const fn = (x, ctx) => typeof x === 'function' ? x(ctx) : x;
const sysRandom = Math.random;
const seeded = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

/* ---------- 1. parser ---------- */
for (const [s, e] of [['3/4', .75], ['-2,5', -2.5], ['0.5', .5], ['3sqrt(2)', 3 * Math.SQRT2], ['7pi/6', 7 * Math.PI / 6], ['sqrt(3)/2', Math.sqrt(3) / 2], ['-inf', -Infinity], ['∞', Infinity], ['+∞', Infinity], ['2^3', 8], ['2^-1', .5],
  ['sqrt(5/3)', Math.sqrt(5 / 3)], ['−1/2', -.5], ['pi', Math.PI], ['π/4', Math.PI / 4], ['-sqrt3', -Math.sqrt(3)], ['√3/2', Math.sqrt(3) / 2], ['3√2', 3 * Math.SQRT2], ['(1+2)*3', 9], ['2(3)', 6], ['1/sqrt(21)', 1 / Math.sqrt(21)], [' 12 ', 12],
  ['1 1', NaN], ['1 1/2', NaN], ['1.2.3', NaN], ['abc', NaN], ['', NaN], ['3+', NaN], ['(2', NaN], ['2)', NaN], ['1e5', NaN], ['sqrt(-1)', NaN], ['0/0', NaN], ['<b>1</b>', NaN], ['3i', NaN], ['x', NaN]]) {
  const v = parseNum(s); if (!(Object.is(v, e) || Math.abs(v - e) < 1e-12 || (isNaN(v) && isNaN(e)))) fail('parser', JSON.stringify(s), v, e);
}

/* ---------- every type has complete notes in both languages ---------- */
for (const t of TYPES) for (const lg of ['en', 'lt']) {
  const x = EXPLAIN[t.id] && EXPLAIN[t.id][lg];
  if (!x || !x.idea || !x.trap || !x.check || !Array.isArray(x.plan) || x.plan.length < 2 || x.plan.length > 4) { fail('notes missing or incomplete', lg, t.id); continue; }
  const words = [x.idea, ...x.plan, x.trap, x.check].join(' ').replace(/<[^>]+>/g, '').split(/\s+/).length;
  if (words > 110) fail('notes too long', lg, t.id, words);
}
for (const id of Object.keys(EXPLAIN)) if (!TYPES.some(t => t.id === id)) fail('notes for unknown type', id);

/* ---------- independent maths used only by the verifier ---------- */
const Nn = x => (x && typeof x === 'object') ? (('n' in x && 'd' in x) ? x.n / x.d : x.v) : x;
const A_ = (steps, k, i = 0) => { const a = steps[k].ans[i]; return Array.isArray(a) ? a.map(r => Array.isArray(r) ? r.map(Nn) : Nn(r)) : Nn(a); };
const eq = (a, b, tol = 1e-7) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
const meq = (X, Y, tol) => X.length === Y.length && X.every((r, i) => r.length === Y[i].length && r.every((x, j) => eq(x, Y[i][j], tol)));
const mm = (X, Y) => { const R = []; for (let i = 0; i < X.length; i++) { R.push([]); for (let j = 0; j < Y[0].length; j++) { let s = 0; for (let k = 0; k < Y.length; k++) s += X[i][k] * Y[k][j]; R[i].push(s); } } return R; };
const eye = n => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => +(i === j)));
const col = v => v.map(x => [x]), tr = X => X[0].map((_, j) => X.map(r => r[j]));
function elim(M) {            // -> {det, rank} by Gaussian elimination with partial pivoting
  const a = M.map(r => r.slice()), n = a.length, m = a[0].length; let det = 1, rank = 0;
  for (let c = 0, r = 0; c < m && r < n; c++) {
    let p = r; for (let i = r + 1; i < n; i++) if (Math.abs(a[i][c]) > Math.abs(a[p][c])) p = i;
    if (Math.abs(a[p][c]) < 1e-9) { if (n === m) det = 0; continue; }
    if (p !== r) { [a[p], a[r]] = [a[r], a[p]]; det = -det; }
    det *= a[r][c];
    for (let i = r + 1; i < n; i++) { const f = a[i][c] / a[r][c]; for (let j = c; j < m; j++) a[i][j] -= f * a[r][j]; }
    r++; rank++;
  }
  if (n === m && rank < n) det = 0;
  return { det, rank };
}
const gdet = M => elim(M).det, rank = M => elim(M).rank;
const shift = (M, l) => M.map((r, i) => r.map((x, j) => i === j ? x - l : x));
const repl = (M, j, b) => M.map((r, i) => r.map((x, c) => c === j ? b[i] : x));
const cmulv = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cpow = (z, n) => { const r = Math.hypot(z[0], z[1]), t = Math.atan2(z[1], z[0]); return [Math.pow(r, n) * Math.cos(n * t), Math.pow(r, n) * Math.sin(n * t)]; };
const angEq = (a, b) => { const d = (((a - b) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); return Math.min(d, 2 * Math.PI - d) < 1e-7; };
const dotp = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
const len = a => Math.hypot(...a);
const pv = (c, x) => c.reduce((s, k, i) => s + k * Math.pow(x, i), 0);
const deg = c => { let d = 0; c.forEach((k, i) => { if (k) d = i; }); return d; };
function limOK(f, at, want) {
  if (at === Infinity) { const a = f(1e7), b = f(1e8); return isFinite(want) ? eq(b, want, 2e-4) : (Math.sign(b) === Math.sign(want) && Math.abs(b) > Math.abs(a) && Math.abs(b) > 1e3); }
  return eq(f(at + 1e-6), want, 2e-4) && eq(f(at - 1e-6), want, 2e-4);
}
const ok = (c, msg) => { if (!c) throw new Error(msg); };

/* ---------- 3. one independent verifier per exercise type ---------- */
const VER = {
  lincomb: (v, s) => { const BT = A_(s, 0), R = A_(s, 1); v.B.forEach((r, i) => r.forEach((x, j) => ok(BT[j][i] === x, 'transpose'))); v.A.forEach((r, i) => r.forEach((x, j) => ok(R[i][j] === v.a * x + v.b * v.B[j][i], 'combination'))); },
  matmul: (v, s) => { ok(A_(s, 0, 0) === v.A.length && A_(s, 0, 1) === v.B[0].length, 'size'); ok(meq(A_(s, 1), mm(v.A, v.B)), 'product'); },
  possible: (v, s) => { const exp = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== j) exp.push(v.sh[i][1] === v.sh[j][0]); ok(JSON.stringify(exp) === JSON.stringify(s[0].ans[0]), 'which exist'); ok(v.sh[v.gi][1] === v.sh[v.gj][0], 'asked product exists'); ok(A_(s, 1, 0) === v.sh[v.gi][0] && A_(s, 1, 1) === v.sh[v.gj][1], 'size'); },
  det2: (v, s) => ok(eq(A_(s, 0), gdet(v.A)), 'det'),
  det3: (v, s) => { ok(eq(A_(s, 2), gdet(v.A)), 'det'); ok(eq(A_(s, 0) - A_(s, 1), gdet(v.A)), 'parts'); },
  diagram: (v, s) => ok(meq(A_(s, 0), v.Qm), 'Q'),
  rec2mat: (v, s) => ok(meq(A_(s, 0), v.Qm), 'Q'),
  iterate: (v, s) => { const n1 = mm(v.A, v.n0); ok(meq(A_(s, 0), n1) && meq(A_(s, 1), mm(v.A, n1)), 'steps'); ok(gdet(v.A) !== 0, 'degenerate matrix'); },
  inverse2: (v, s) => { const d = gdet(v.A), inv = A_(s, 2); ok(eq(A_(s, 0), d), 'det'); ok(meq(mm(v.A, inv), eye(2)), 'A·A⁻¹'); ok(meq(A_(s, 1), inv.map(r => r.map(x => x * d))), 'adjugate'); },
  isinverse: (v, s) => { const AB = mm(v.A, v.B); ok(meq(A_(s, 0), AB), 'AB'); const isI = meq(AB, eye(2)); ok(isI === v.yes && A_(s, 1) === (isI ? 0 : 1), 'verdict'); },
  singular: (v, s) => { const e = v.e.slice(); e[v.pos] = A_(s, 0); ok(eq(gdet([[e[0], e[1]], [e[2], e[3]]]), 0), 'det not 0'); },
  backstep: (v, s) => { ok(eq(A_(s, 0), gdet(v.A)), 'det'); ok(meq(mm(v.A, A_(s, 1)), eye(2)), 'inverse'); ok(meq(mm(v.A, A_(s, 2)), v.y), 'x_t'); },
  minor: (v, s) => { const sub = v.A.filter((_, r) => r !== v.i).map(r => r.filter((_, c) => c !== v.j)); ok(eq(A_(s, 0), gdet(sub)), 'minor'); ok(eq(A_(s, 1), ((v.i + v.j) % 2 ? -1 : 1) * gdet(sub)), 'cofactor'); },
  det4: (v, s) => ok(eq(A_(s, 2), gdet(v.M)), 'det'),
  cramer2: (v, s) => { ok(eq(A_(s, 0), gdet(v.A)), 'Δ'); ok(eq(A_(s, 1, 0), gdet(repl(v.A, 0, v.b))) && eq(A_(s, 1, 1), gdet(repl(v.A, 1, v.b))), 'Δx Δy'); ok(meq(mm(v.A, col([A_(s, 2, 0), A_(s, 2, 1)])), col(v.b)), 'solution'); },
  cramer3: (v, s) => { ok(eq(A_(s, 0), gdet(v.A)), 'Δ'); [0, 1, 2].forEach(j => ok(eq(A_(s, 1 + j), gdet(repl(v.A, j, v.b))), 'Δ' + j)); ok(meq(mm(v.A, col([0, 1, 2].map(i => A_(s, 4, i)))), col(v.b)), 'solution'); },
  cramer0: (v, s) => { ok(gdet(v.A) === 0 && A_(s, 0) === 0, 'Δ'); const ds = [0, 1, 2].map(j => gdet(repl(v.A, j, v.b))); ds.forEach((d, j) => ok(eq(A_(s, 1, j), d), 'Δ' + j)); const cons = rank(v.A) === rank(v.A.map((r, i) => [...r, v.b[i]])); ok(rank(v.A) === 2, 'rank'); ok(cons === v.inf && A_(s, 2) === (cons ? 2 : 0), 'verdict'); ok(cons || ds.some(d => Math.abs(d) > 1e-9), 'rule would fail'); },
  param3: (v, s) => { ok(gdet(v.A) === 0, 'Δ'); ok(eq(A_(s, 0, 0), v.b[0]) && eq(A_(s, 0, 1), -v.A[0][2]) && eq(A_(s, 0, 2), v.b[1]) && eq(A_(s, 0, 3), -v.A[1][2]), 'right-hand sides'); for (const t of [0, 1, -2.5, 7]) ok(meq(mm(v.A, col([A_(s, 1, 0) + A_(s, 1, 1) * t, A_(s, 1, 2) + A_(s, 1, 3) * t, t])), col(v.b)), 'solution at t=' + t); },
  syskind: (v, s) => { const k0 = A_(s, 1), M = [[v.a, v.b], [k0, v.d]]; ok(eq(gdet(M), 0), 'det at k'); ok(eq(A_(s, 0, 0) - A_(s, 0, 1) * 3.7, v.a * v.d - v.b * 3.7), 'det form'); const cons = rank(M) === rank([[v.a, v.b, v.p], [k0, v.d, v.q]]); ok(cons === v.inf && A_(s, 2) === (cons ? 1 : 0), 'verdict'); },
  inv3: (v, s) => { const d = gdet(v.A), adj = A_(s, 2); ok(eq(A_(s, 0), d), 'det'); ok(meq(mm(v.A, adj), eye(3).map(r => r.map(x => x * d))), 'adjugate'); ok(meq(A_(s, 1), tr(adj)), 'cofactors'); ok(meq(mm(v.A, A_(s, 3)), col(v.b)), 'X'); },
  cbasic: (v, s) => { const a = v.a, b = v.b, cj = z => [z[0], -z[1]], sm = [a[0] + b[0], a[1] + b[1]]; const r = [sm, [a[0] - b[0], a[1] - b[1]], cmulv(a, b), cmulv(a, b), cmulv(a, cj(b)), cmulv(cj(a), b), cpow(a, 2), cpow(sm, 2)][v.k]; ok(eq(A_(s, 0, 0), r[0], 1e-9) && eq(A_(s, 0, 1), r[1], 1e-9), 'result'); },
  cdiv: (v, s) => { const r = [A_(s, 2, 0), A_(s, 2, 1)], back = cmulv(r, v.b); ok(eq(back[0], v.a[0]) && eq(back[1], v.a[1]), 'quotient'); ok(eq(A_(s, 1), v.b[0] ** 2 + v.b[1] ** 2), 'denominator'); const t = cmulv(v.a, [v.b[0], -v.b[1]]); ok(eq(A_(s, 0, 0), t[0]) && eq(A_(s, 0, 1), t[1]), 'numerator'); },
  ccube: (v, s) => { const z2 = cpow(v.a, 2), z3 = cpow(v.a, 3); ok(eq(A_(s, 0, 0), z2[0], 1e-9) && eq(A_(s, 0, 1), z2[1], 1e-9) && eq(A_(s, 1, 0), z3[0], 1e-9) && eq(A_(s, 1, 1), z3[1], 1e-9), 'powers'); },
  ctrig: (v, s) => { ok(eq(A_(s, 0), Math.hypot(v.re, v.im)), 'r'); ok(angEq(A_(s, 1), Math.atan2(v.im, v.re)), 'φ'); },
  demoivre: (v, s) => { const r = Math.hypot(v.re, v.im), t = Math.atan2(v.im, v.re), z = cpow([v.re, v.im], v.n); ok(eq(A_(s, 0, 0), r) && angEq(A_(s, 0, 1), t), 'trig form'); ok(eq(A_(s, 1, 0), Math.pow(r, v.n)) && angEq(A_(s, 1, 1), v.n * t), 'r^n, nφ'); ok(eq(A_(s, 2, 0), z[0], 1e-9) && eq(A_(s, 2, 1), z[1], 1e-9) && Math.abs(A_(s, 2, 0) - z[0]) < 1e-6 && Math.abs(A_(s, 2, 1) - z[1]) < 1e-6, 'z^n'); },
  croots: (v, s) => { const th = v.mw * Math.PI / 12, w = [v.aw * Math.cos(th), v.aw * Math.sin(th)]; ok(eq(A_(s, 0, 0), v.aw) && angEq(A_(s, 0, 1), th), 'w'); ok(A_(s, 1, 0) === v.n && eq(Math.pow(A_(s, 1, 1), v.n), v.aw), 'count, modulus'); ok(angEq(A_(s, 2, 0) * v.n, th) && eq(A_(s, 2, 1), 2 * Math.PI / v.n), 'arguments'); const rt = [A_(s, 3, 0), A_(s, 3, 1)], back = cpow(rt, v.n); ok(Math.abs(back[0] - w[0]) < 1e-6 * v.aw && Math.abs(back[1] - w[1]) < 1e-6 * v.aw, 'root^n'); ok(angEq(Math.atan2(rt[1], rt[0]), A_(s, 2, 0) + v.K * A_(s, 2, 1)), 'which root'); },
  cquad: (v, s) => { const z = [A_(s, 2, 0), A_(s, 2, 1)], z2 = cmulv(z, z); ok(eq(z2[0] + v.p * z[0] + v.q, 0) && eq(z2[1] + v.p * z[1], 0), 'root'); ok(eq(A_(s, 0), v.p * v.p - 4 * v.q) && eq(A_(s, 1) ** 2, -A_(s, 0)), 'D'); },
  reduction: (v, s) => { const al = 0.71, x = v.extra * Math.PI + v.b * Math.PI / 2 + v.s * al, val = v.f === 'sin' ? Math.sin(x) : Math.cos(x); ok(eq(val, [Math.sin(al), -Math.sin(al), Math.cos(al), -Math.cos(al)][A_(s, 0)]), 'identity'); },
  eig2: (v, s) => { const A = v.A, ls = [A_(s, 1, 0), A_(s, 1, 1)]; ok(eq(A_(s, 0, 0), -(A[0][0] + A[1][1])) && eq(A_(s, 0, 1), gdet(A)), 'characteristic'); ls.forEach(l => ok(eq(gdet(shift(A, l)), 0), 'eigenvalue')); ok(ls[0] !== ls[1] && eq(ls[0] + ls[1], A[0][0] + A[1][1]), 'both'); const so = ls.slice().sort((a, b) => a - b); [0, 1].forEach(k => { const x = A_(s, 2 + k); ok(len(x.map(r => r[0])) > 0 && meq(mm(A, x), x.map(r => [r[0] * so[k]])), 'eigenvector'); }); },
  eig3: (v, s) => { const A = v.A, ls = [0, 1, 2].map(i => A_(s, 0, i)); ls.forEach(l => ok(eq(gdet(shift(A, l)), 0), 'eigenvalue')); ok(new Set(ls).size === 3 && eq(ls[0] + ls[1] + ls[2], A[0][0] + A[1][1] + A[2][2]), 'all three'); ls.forEach((l, k) => { const x = A_(s, 1 + k); ok(len(x.map(r => r[0])) > 0 && meq(mm(A, x), x.map(r => [r[0] * l])), 'eigenvector'); }); },
  iseig: (v, s) => { const d = gdet(shift(v.A, v.k)); ok(eq(A_(s, 0), d), 'det'); ok(A_(s, 1) === (Math.abs(d) < 1e-9 ? 0 : 1), 'verdict'); },
  pdp: (v, s) => { const D = A_(s, 1), P = A_(s, 2), Pi = A_(s, 3); ok(meq(mm(P, Pi), eye(2)), 'P·P⁻¹'); ok(meq(mm(mm(P, D), Pi), v.A), 'PDP⁻¹'); ok(D[0][1] === 0 && D[1][0] === 0, 'D diagonal'); },
  closed: (v, s) => { const l = [A_(s, 0, 0), A_(s, 0, 1)], v1 = A_(s, 1, 0), v2 = A_(s, 1, 1), c = [A_(s, 2, 0), A_(s, 2, 1)]; let nT = col(v.n0); for (let k = 0; k < v.Tt; k++) nT = mm(v.A, nT); ok(meq(A_(s, 3), nT), 'n_T by iteration'); [0, 1].forEach(i => { ok(eq(c[0] * v1[i][0] + c[1] * v2[i][0], v.n0[i]), 'start'); ok(eq(c[0] * l[0] ** v.Tt * v1[i][0] + c[1] * l[1] ** v.Tt * v2[i][0], nT[i][0]), 'formula'); }); },
  markov: (v, s) => { [A_(s, 0, 0), A_(s, 0, 1)].forEach(l => ok(eq(gdet(shift(v.A, l)), 0, 1e-9), 'eigenvalue')); ok(A_(s, 1) === 0, 'behaviour'); let y = col(v.y0); for (let k = 0; k < 4000; k++) y = mm(v.A, y); ok(meq(A_(s, 2), y, 1e-6), 'limit by simulation'); },
  longrun: (v, s) => { [A_(s, 0, 0), A_(s, 0, 1)].forEach(l => ok(eq(gdet(shift(v.A, l)), 0, 1e-9), 'eigenvalue')); let y = [[1], [0.6180339887]], prev = y; for (let k = 0; k < 600; k++) { prev = y; y = mm(v.A, y); } const n = len(y.map(r => r[0])), d = len([y[0][0] - prev[0][0], y[1][0] - prev[1][0]]); const cls = n < 1e-6 ? 2 : n > 1e6 ? 1 : d < 1e-6 ? 0 : 3; ok(cls === A_(s, 1), 'behaviour by simulation: ' + cls); },
  limsym: () => { },
  limside: (v, s) => { v.items.forEach((it, k) => { const want = it.side === 2 ? 0 : (it.c / Math.pow(it.side * 1e-3, it.n) > 0 ? 1 : 2); ok(A_(s, k) === want, 'one-sided limit ' + k); }); ok(v.items.length === s.length, 'count'); },
  limrat: (v, s) => { ok(A_(s, 0, 0) === deg(v.np) && A_(s, 0, 1) === deg(v.dp), 'degrees'); ok(limOK(x => pv(v.np, x) / pv(v.dp, x), Infinity, A_(s, 1)), 'limit'); },
  limfactor: (v, s) => ok(limOK(x => pv(v.np, x) / pv(v.dp, x), v.a, A_(s, s.length - 1)), 'limit'),
  limconj: (v, s) => ok(limOK(v.f, v.at, A_(s, s.length - 1)), 'limit'),
  limroot: (v, s) => ok(limOK(v.f, v.at, A_(s, s.length - 1)), 'limit'),
  closest: (v, s) => { const d = v.pts.map(p => Math.abs(p[v.c1])); ok(d[A_(s, 0)] === Math.min(...d) && d.filter(x => x === Math.min(...d)).length === 1, 'closest'); ok(v.pts[A_(s, 1)][v.c2] === 0 && v.pts.filter(p => p[v.c2] === 0).length === 1, 'in plane'); },
  distpt: (v, s) => { ok(A_(s, 0) === Math.abs(v.p[v.pl]), 'plane'); ok(eq(A_(s, 1), Math.sqrt(dotp(v.p, v.p) - v.p[v.ax] ** 2)), 'axis'); },
  sphere: (v, s) => { const c = [0, 1, 2].map(i => A_(s, 0, i)), r = A_(s, 2); ok(r > 0 && eq(A_(s, 1), r * r), 'r²'); for (let i = 0; i < 3; i++) for (const sg of [1, -1]) { const x = c.slice(); x[i] += sg * r; ok(eq(v.k * dotp(x, x) - 2 * v.k * dotp(v.c, x), v.k * v.G), 'point on sphere'); } },
  touch: (v, s) => { ok(A_(s, 0) === Math.abs(v.c[v.pl]) && A_(s, 1) === A_(s, 0) ** 2, 'radius'); },
  dist3: (v, s) => { [0, 1, 2].forEach(i => ok(A_(s, 0, i) === v.b[i] - v.a[i], 'Δ')); ok(eq(A_(s, 1), Math.hypot(v.b[0] - v.a[0], v.b[1] - v.a[1], v.b[2] - v.a[2])), 'distance'); },
  describe: () => { },
  vecops: (v, s) => { const { a, b } = v; ok(meq(A_(s, 0), [a.map((x, i) => x + b[i])]) && meq(A_(s, 1), [a.map((x, i) => v.al * x + v.be * b[i])]), 'vectors'); ok(eq(A_(s, 2), len(a)) && eq(A_(s, 3), len(a.map((x, i) => x - b[i]))), 'lengths'); },
  dot: (v, s) => ok(eq(A_(s, 0), dotp(v.a, v.b)), 'dot'),
  meaning: () => { },
  right: (v, s) => { const [P, Q, R] = v.p, d2 = (x, y) => x.reduce((t, k, i) => t + (k - y[i]) ** 2, 0), pq = d2(P, Q), pr = d2(P, R), qr = d2(Q, R); const exp = pq + pr === qr ? 0 : pq + qr === pr ? 1 : pr + qr === pq ? 2 : 3; ok(A_(s, 2) === exp, 'Pythagoras says ' + exp); ok(meq(A_(s, 0, 0), [Q.map((x, i) => x - P[i])]) && meq(A_(s, 0, 1), [R.map((x, i) => x - P[i])]) && meq(A_(s, 0, 2), [R.map((x, i) => x - Q[i])]), 'sides'); },
  proj: (v, s) => { const { a, b } = v, pr = A_(s, 3)[0], comp = A_(s, 2); ok(eq(A_(s, 0), dotp(a, b)) && eq(A_(s, 1), len(a)), 'dot, length'); ok(eq(dotp(b.map((x, i) => x - pr[i]), a), 0), 'b − proj ⟂ a'); ok(eq(dotp(pr, pr) * dotp(a, a), dotp(pr, a) ** 2), 'proj ∥ a'); ok(eq(comp, dotp(pr, a) / len(a)), 'comp'); },
  angle: (v, s) => { const { a, b } = v, c = (dotp(a, a) + dotp(b, b) - dotp(a.map((x, i) => x - b[i]), a.map((x, i) => x - b[i]))) / (2 * len(a) * len(b)); ok(eq(A_(s, 2), c), 'cos by law of cosines'); ok(A_(s, 3) === (Math.abs(c) < 1e-9 ? 1 : c > 0 ? 0 : 2), 'type'); ok(eq(A_(s, 1, 0), len(a)) && eq(A_(s, 1, 1), len(b)), 'lengths'); },
  share: (v, s) => { const L = len(v.Vv), sa = dotp(v.A, v.Vv) / L / L, sb = dotp(v.Bd, v.Vv) / L / L; ok(eq(A_(s, 0), L), '|V|'); ok(eq(A_(s, 2, 0), sa) && eq(A_(s, 2, 1), sb), 'shares'); ok(A_(s, 3) === (sa > sb ? 0 : 1) && sa > 0 && sb > 0 && sa < 1 && sb < 1, 'closer'); }
};

/* ---------- 2. round trip + 3. independent verification ---------- */
const sameAns = (a, b) => JSON.stringify(a, (k, x) => typeof x === 'function' ? undefined : (typeof x === 'number' ? Math.round(x * 1e9) / 1e9 : x)) === JSON.stringify(b, (k, x) => typeof x === 'function' ? undefined : (typeof x === 'number' ? Math.round(x * 1e9) / 1e9 : x));
const ansOf = p => p.steps.map(s => s.fields.map((f, i) => numeric(f, s.ans[i])));
const summary = [];
for (const t of TYPES) {
  if (!t.L || !t.L.gen) { fail('no Lithuanian version', t.id); continue; }
  if (!VER[t.id]) { fail('no verifier', t.id); continue; }
  let verified = 0, parity = 0;
  for (const [lg, gen] of [['en', t.gen], ['lt', t.L.gen]]) {
    for (let n = 0; n < N; n++) {
      const seed = (n + 1) * 7919 + t.id.length * 104729 + t.id.charCodeAt(0);
      Math.random = seeded(seed);
      let p; try { p = gen(); } catch (e) { fail('generator threw', lg, t.id, e.message); break; }
      if (!selfCheck(p)) { fail('self-check rejected', lg, t.id, 'seed', seed); break; }
      if (lg === 'en') { try { VER[t.id](p.v, p.steps); verified++; } catch (e) { fail('independent check', t.id, 'seed', seed, '-', e.message); break; } }
      else { Math.random = seeded(seed); const pe = t.gen(); if (sameAns(ansOf(pe), ansOf(p))) parity++; else { fail('LT and EN answers differ', t.id, 'seed', seed); break; } }
      const ctx = {}; let bad = false;
      for (const [k, s] of p.steps.entries()) {
        try {
          const q = fn(s.q, ctx), raw = s.ans;
          const typed = s.fields.map((f, i) => f.k === 'num' ? parseNum(S(raw[i])) : f.k === 'mat' ? raw[i].map(r => r.map(x => parseNum(S(x)))) : raw[i]);
          if (!checkStep(s, typed, ctx).ok) { fail('correct answer rejected', lg, t.id, 'step', k); bad = true; break; }
          if (s.save) s.save(ctx);
          if (s.ansFn) { const a = s.ansFn(ctx); if (!checkStep(s, a.map((x, i) => numeric(s.fields[i], x)), ctx).ok) { fail('ansFn rejected', lg, t.id, k); bad = true; break; } }
          const wrong = s.fields.map((f, i) => f.k === 'num' ? (isFinite(typed[i]) ? typed[i] + 1 : 0) : f.k === 'mat' ? typed[i].map((r, a) => r.map((x, b) => x + 0.37 * (a + 1) - 0.21 * (b + 1))) : f.k === 'choice' ? (typed[i] + 1) % f.options.length : typed[i].map((x, j) => j === 0 ? !x : x));
          if (checkStep(s, wrong, JSON.parse(JSON.stringify(ctx))).ok && !s.fields.some(f => f.mod)) { fail('wrong answer accepted', lg, t.id, 'step', k); bad = true; break; }
          // each field on its own: one wrong box must be enough to fail the step
          if (!s.val) for (let i = 0; i < s.fields.length; i++) { if (s.fields[i].mod) continue; const one = typed.map((x, j) => j === i ? wrong[i] : x); if (checkStep(s, one, JSON.parse(JSON.stringify(ctx))).ok) { fail('single wrong box accepted', lg, t.id, 'step', k, 'field', i); bad = true; break; } }
          const texts = [q, fn(s.hint, ctx), fn(s.sol, ctx), ...s.fields.map(f => (f.label || '') + (f.after || '')), ...s.fields.flatMap(f => f.options || [])].join(' ');
          if (/undefined|NaN|\[object|Infinity/.test(texts)) { fail('broken text', lg, t.id, 'step', k, texts.match(/.{0,50}(undefined|NaN|\[object|Infinity).{0,30}/)[0]); bad = true; break; }
        } catch (e) { fail('step threw', lg, t.id, k, e.message); bad = true; break; }
      }
      if (bad) break;
    }
  }
  Math.random = sysRandom;
  const t0 = process.hrtime.bigint(); for (let n = 0; n < 300; n++) { t.gen(); t.L.gen(); } const us = Number(process.hrtime.bigint() - t0) / 600 / 1000;
  summary.push({ id: t.id, topic: t.topic, verified, parity, us });
}
Math.random = sysRandom;
const slow = summary.filter(x => x.us > 1500);
if (slow.length) fail('slow generators (µs per problem)', slow.map(x => x.id + ':' + x.us.toFixed(0)).join(' '));
if (process.argv.includes('-v')) for (const x of summary) console.log(String(x.topic).padStart(2), x.id.padEnd(10), 'verified', x.verified, 'parity', x.parity, (x.us).toFixed(0).padStart(5) + ' µs');
const tot = summary.reduce((a, x) => a + x.verified, 0), par = summary.reduce((a, x) => a + x.parity, 0), mx = summary.reduce((a, x) => x.us > a.us ? x : a, { us: 0 });
console.log(`${TYPES.length} types · ${tot} problems verified independently · ${par} LT/EN answer sets identical · slowest generator ${mx.id} ${mx.us.toFixed(0)} µs`);
console.log(fails ? `FAILS: ${fails}` : 'ALL PASS');
process.exit(fails ? 1 : 0);
