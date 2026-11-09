/* ================= TOPIC 6 — complex numbers ================= */
const ReIm = () => [num('', { w: 9 }), num('+', { after: I('i'), w: 9 })];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const Z = z => cx(z[0], z[1]);
const z1 = sub('z', 1), z2 = sub('z', 2), bar = s => `<span class="bar">${s}</span>`;
const NEGIM = 'If the imaginary part is negative, type the minus inside the second box (for 3 − 2i type 3 and -2).';

reg('cbasic', 6, 'Add, subtract, multiply', 'Veiksmai su kompleksiniais skaičiais',
  'Treat i like a letter and use i² = −1. Product: (a + bi)(c + di) = (ac − bd) + (ad + bc)i. The conjugate of a + bi is a − bi.',
  () => {
    const a = [nz(-5, 6), nz(-5, 6)], b = [nz(-5, 6), nz(-5, 6)], cb = [b[0], -b[1]], ca = [a[0], -a[1]], sm = [a[0] + b[0], a[1] + b[1]];
    const ops = [
      [`${z1} + ${z2}`, sm, 'Add real parts and imaginary parts separately.'],
      [`${z1} − ${z2}`, [a[0] - b[0], a[1] - b[1]], 'Subtract real parts and imaginary parts separately.'],
      [`${z1}·${z2}`, cmul(a, b), `(${Z(a)})(${Z(b)}) = ${a[0] * b[0]} ${a[0] * b[1] < 0 ? '−' : '+'} ${Math.abs(a[0] * b[1])}i ${a[1] * b[0] < 0 ? '−' : '+'} ${Math.abs(a[1] * b[0])}i ${a[1] * b[1] < 0 ? '−' : '+'} ${Math.abs(a[1] * b[1])}i², and i² = −1.`],
      [`${z1}·${z2}`, cmul(a, b), `(${Z(a)})(${Z(b)}) = ${a[0] * b[0]} ${a[0] * b[1] < 0 ? '−' : '+'} ${Math.abs(a[0] * b[1])}i ${a[1] * b[0] < 0 ? '−' : '+'} ${Math.abs(a[1] * b[0])}i ${a[1] * b[1] < 0 ? '−' : '+'} ${Math.abs(a[1] * b[1])}i², and i² = −1.`],
      [`${z1}·${bar(z2)}`, cmul(a, cb), `The conjugate of ${z2} is ${Z(cb)}. Then multiply out.`],
      [`${bar(z1)}·${z2}`, cmul(ca, b), `The conjugate of ${z1} is ${Z(ca)}. Then multiply out.`],
      [`${z1}<sup>2</sup>`, cmul(a, a), '(a + bi)² = a² − b² + 2abi'],
      [`(${z1} + ${z2})<sup>2</sup>`, cmul(sm, sm), `First ${z1} + ${z2} = ${Z(sm)}, then square: (a + bi)² = a² − b² + 2abi.`]
    ], k = ri(0, ops.length - 1), [ex, r, how] = ops[k];
    return { v: { a, b, k }, q: `Let ${z1} = ${Z(a)} and ${z2} = ${Z(b)}. Compute ${ex}.`, steps: [st(NEGIM, ReIm(), r, how, `${ex} = ${Z(r)}`)] };
  });

reg('cdiv', 6, 'Divide complex numbers', 'Kompleksinių skaičių dalyba',
  'Multiply top and bottom by the conjugate of the denominator. The bottom becomes the real number c² + d². Then split into real and imaginary parts.',
  () => {
    const a = [nz(-5, 6), nz(-5, 6)], b = [nz(-4, 5), nz(-4, 5)], cb = [b[0], -b[1]], t = cmul(a, cb), dn = b[0] * b[0] + b[1] * b[1], r = [new Q(t[0], dn), new Q(t[1], dn)];
    return { v: { a, b }, q: `Compute ${big(Z(a), Z(b))}.`,
      steps: [
        st(`Multiply the numerator by the conjugate of the denominator: (${Z(a)})(${Z(cb)}) =`, ReIm(), t, '(a + bi)(c + di) = (ac − bd) + (ad + bc)i, with i² = −1.', `(${Z(a)})(${Z(cb)}) = ${Z(t)}`),
        st(`The denominator becomes (${Z(b)})(${Z(cb)}) =`, [num('')], [dn], 'c² + d²', `${b[0]}² + ${Math.abs(b[1])}² = ${dn}`),
        st('Divide both parts (fractions like 5/17 are fine):', ReIm(), r, `${Z(t)} divided by ${dn}.`, `${big(Z(a), Z(b))} = ${cx(r[0], r[1])}`)
      ]
    };
  });

reg('ccube', 6, 'Cube a complex number', 'Kėlimas kubu',
  'Square first, then multiply the result by z once more. (a + bi)² = a² − b² + 2abi.',
  () => {
    const a = [nz(-3, 4), nz(-3, 4)], s = cmul(a, a), c = cmul(s, a);
    return { v: { a }, q: `Let ${I('z')} = ${Z(a)}. Compute ${I('z')}<sup>3</sup>.`,
      steps: [
        st(`First ${I('z')}<sup>2</sup> =`, ReIm(), s, 'a² − b² for the real part, 2ab for the imaginary part.', `${I('z')}<sup>2</sup> = ${Z(s)}`),
        st(`Then ${I('z')}<sup>3</sup> = ${I('z')}<sup>2</sup>·${I('z')} = (${Z(s)})(${Z(a)}) =`, ReIm(), c, 'Multiply out and use i² = −1.', `${I('z')}<sup>3</sup> = ${Z(c)}`)
      ]
    };
  });

const NICE = [0, 2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22];
function niceZ(m, k) {            // angle m·π/12
  const r = m % 6 === 0 ? sd(k) : m % 3 === 0 ? sd(k, 2) : sd(2 * k);
  return { r, re: sdMul(r, cosE(m)), im: sdMul(r, sinE(m)), phi: angM(m), m };
}
const quad = m => m % 6 === 0 ? ['the positive real axis', 'the positive imaginary axis', 'the negative real axis', 'the negative imaginary axis'][m / 6] : 'quadrant ' + ['I', 'II', 'III', 'IV'][Math.floor(m / 6)];
const PHI = 'Angles: type 7pi/6, pi/4, pi and so on.';
const rPhi = z => `r = √(${H(Math.round(z.re.v * z.re.v))} + ${H(Math.round(z.im.v * z.im.v))}) = ${z.r.h}, the point lies on ${quad(z.m)}, φ = ${z.phi.h}`;

reg('ctrig', 6, 'Trigonometric form', 'Trigonometrinė forma',
  'z = r(cos φ + i sin φ) with r = √(a² + b²). For φ: plot the point to see the quadrant, find the reference angle from tan = |b|/|a| (1 → π/4, √3 → π/3, 1/√3 → π/6), then adjust: QII: π − angle, QIII: π + angle, QIV: 2π − angle.',
  () => {
    const z = niceZ(pick(NICE), ri(1, 4));
    return { v: { re: z.re.v, im: z.im.v }, q: `Write ${I('z')} = ${cxSd(z.re, z.im)} in the form ${I('r')}(cos φ + ${I('i')} sin φ), with 0 ≤ φ &lt; 2π.`,
      steps: [
        st('Modulus (roots can be typed as 3sqrt(2)):', [num(`${I('r')} =`)], [z.r], `r = √(a² + b²) = √(${H(Math.round(z.re.v * z.re.v))} + ${H(Math.round(z.im.v * z.im.v))})`, `${I('r')} = ${z.r.h}`),
        st(`Argument. ${PHI}`, [num('φ =', { mod: 2 * PI })], [z.phi], `The point lies on ${quad(z.m)}. cos φ = ${sdH(cosE(z.m))}, sin φ = ${sdH(sinE(z.m))}.`, `${I('z')} = ${z.r.h}(cos ${z.phi.h} + ${I('i')} sin ${z.phi.h})`)
      ]
    };
  });

reg('demoivre', 6, 'Powers with de Moivre', 'Muavro teorema: laipsniai',
  'Write z in trigonometric form. Then z<sup>n</sup> = r<sup>n</sup>(cos nφ + i sin nφ): raise the modulus to the power, multiply the angle by n. Drop full turns of 2π before reading off cos and sin.',
  () => {
    const m = pick(NICE.filter(x => x % 6)), z = niceZ(m, 1), n = m % 3 === 0 ? pick([2, 4, 6, 8]) : pick([3, 3, 6, 6, 12]);
    const R = Math.round(Math.pow(z.r.v, n)), mm = ((m * n) % 24 + 24) % 24, re = cosE(mm).c.mul(R), im = sinE(mm).c.mul(R);
    return { v: { re: z.re.v, im: z.im.v, n }, q: `Let ${I('z')} = ${cxSd(z.re, z.im)}. Compute ${I('z')}<sup>${n}</sup> with de Moivre’s theorem.`,
      steps: [
        st(`Trigonometric form of ${I('z')}. ${PHI}`, [num(`${I('r')} =`), num('φ =', { mod: 2 * PI })], [z.r, z.phi], `r = √(a² + b²). The point lies on ${quad(m)}.`, rPhi(z)),
        st(`Raise the modulus to the power and multiply the angle:`, [num(`${I('r')}<sup>${n}</sup> =`), num(`${n}φ =`, { mod: 2 * PI })], [R, angM(m * n)], `${n}·${z.phi.h}. You may leave it as is or subtract multiples of 2π.`, `${I('r')}<sup>${n}</sup> = ${R}, &nbsp; ${n}φ = ${angM(m * n).h}${m * n >= 24 ? ' = ' + angM(mm).h + ' (after removing full turns)' : ''}`),
        st(`Read off cos and sin. ${NEGIM}`, ReIm(), [re, im], `cos ${angM(mm).h} = ${sdH(cosE(mm))}, sin ${angM(mm).h} = ${sdH(sinE(mm))}; multiply both by ${R}.`, `${I('z')}<sup>${n}</sup> = ${R}(cos ${angM(mm).h} + ${I('i')} sin ${angM(mm).h}) = ${cx(re, im)}`)
      ]
    };
  });

reg('croots', 6, 'n-th roots of a number', 'Šaknys iš kompleksinio skaičiaus',
  'Write w = ρ(cos θ + i sin θ). There are n roots. All have modulus ⁿ√ρ. Their arguments are (θ + 2πk)/n for k = 0, 1, …, n − 1: start at θ/n and keep adding 2π/n. They sit evenly on a circle.',
  () => {
    const [aw, n, mw] = pick([[1, 3, 0], [1, 4, 0], [1, 6, 0], [8, 3, 0], [16, 4, 0], [27, 3, 0], [64, 6, 0], [4, 2, 0], [1, 3, 12], [1, 4, 12], [1, 6, 12], [8, 3, 12], [16, 4, 12], [27, 3, 12], [64, 3, 12], [64, 6, 12], [4, 2, 12], [9, 2, 12], [1, 2, 6], [1, 3, 6], [1, 2, 18], [1, 3, 18], [8, 3, 6], [4, 2, 18]]);
    const wh = ['' + aw, (aw === 1 ? '' : aw) + I('i'), MIN + aw, MIN + (aw === 1 ? '' : aw) + I('i')][mw / 6], rho = Math.round(Math.pow(aw, 1 / n)), m0 = mw / n, stepm = 24 / n, K = ri(0, n - 1);
    const rt = k => { const m = m0 + stepm * k; return { m, re: sdMul(sd(rho), cosE(m)), im: sdMul(sd(rho), sinE(m)) }; }, rk = rt(K);
    return { v: { aw, n, mw, K }, q: `Find all values of ${root(wh, n)} (the solutions of ${I('z')}<sup>${n}</sup> = ${wh}).`,
      steps: [
        st(`Trigonometric form of ${wh}. ${PHI}`, [num('modulus ='), num('argument θ =', { mod: 2 * PI })], [aw, angM(mw)], 'A positive real number has argument 0, a negative one π, a positive multiple of i has π/2, a negative one 3π/2.', `${wh} = ${aw}(cos ${angM(mw).h} + ${I('i')} sin ${angM(mw).h})`),
        st('The roots:', [num('how many roots?', { w: 3 }), num('modulus of each root =')], [n, rho], `n-th roots: n of them, each with modulus ⁿ√ρ.`, `${n} roots, each with modulus ${root(aw, n)} = ${rho}`),
        st('Their arguments:', [num(`first root (${I('k')} = 0): φ<sub>0</sub> =`, { mod: 2 * PI }), num('angle between neighbouring roots =')], [angM(m0), angM(stepm)], 'First: θ/n. Spacing: 2π/n.', `φ<sub>0</sub> = ${angM(m0).h}, then add ${angM(stepm).h} each time: ${[...Array(n).keys()].map(k => angM(m0 + stepm * k).h).join(', ')}`),
        st(`Write the root with ${I('k')} = ${K} (argument ${angM(rk.m).h}) as a + bi. Use sqrt(3)/2 style for roots. ${NEGIM}`, ReIm(), [rk.re, rk.im], `cos ${angM(rk.m).h} = ${sdH(cosE(rk.m))}, sin ${angM(rk.m).h} = ${sdH(sinE(rk.m))}; multiply by the modulus ${rho}.`, 'All roots: ' + [...Array(n).keys()].map(k => cxSd(rt(k).re, rt(k).im)).join('; &nbsp;'))
      ]
    };
  });

reg('cquad', 6, 'Quadratic with complex roots', 'Kvadratinė lygtis, kai D < 0',
  'D = b² − 4ac. When D is negative, √D = i·√|D|, and z = (−b ± i√|D|) / 2a. The two roots are conjugates.',
  () => {
    const a = ri(-5, 5), b = ri(1, 6), p = -2 * a, q = a * a + b * b, Dv = p * p - 4 * q;
    return { v: { p, q }, q: `Solve ${poly([q, p, 1], 'z')} = 0 for complex ${I('z')}.`,
      steps: [
        st('Discriminant:', [num(`${I('D')} =`)], [Dv], 'D = b² − 4ac', `${I('D')} = ${P(p)}² − 4·${q} = ${H(Dv)}`),
        st(`Since D &lt; 0, √D is imaginary:`, [num(`√${I('D')} =`, { after: I('i') })], [2 * b], `√(${H(Dv)}) = √${-Dv}·i`, `√${I('D')} = ${2 * b}${I('i')}`),
        st('The roots:', [num(`${I('z')} =`, { w: 4 }), num('±', { after: I('i'), w: 4 })], [a, b], `z = (−b ± √D)/2 = (${H(-p)} ± ${2 * b}i)/2. Enter the imaginary part as a positive number.`, `${sub('z', '1,2')} = ${H(a)} ± ${b}${I('i')}`, { val: v => (close(v[0], a) && close(Math.abs(v[1]), b)) ? true : { bad: [close(v[0], a) ? null : { f: 0 }, close(Math.abs(v[1]), b) ? null : { f: 1 }].filter(Boolean) } })
      ]
    };
  });

reg('reduction', 6, 'Reduction formulas', 'Redukcijos formulės',
  'Two rules. (1) Name: π/2 or 3π/2 in the angle swaps sin ↔ cos; π or 2π keeps the name. (2) Sign: pretend α is a small acute angle, see which quadrant the whole angle falls in, and take the sign the <b>original</b> function has there.',
  () => {
    const f = pick(['sin', 'cos']), b = pick([1, 2, 3, 4]), s = pick([1, -1]), extra = pick([0, 0, 0, 2, 4]);
    const base = ang(new Q(b, 2)).h, exh = `${f}(${extra ? extra + 'π + ' : ''}${base} ${s > 0 ? '+' : '−'} α)`;
    const al = 0.37, x = b * PI / 2 + s * al, v = f === 'sin' ? Math.sin(x) : Math.cos(x);
    const opts = [['sin α', Math.sin(al)], ['−sin α', -Math.sin(al)], ['cos α', Math.cos(al)], ['−cos α', -Math.cos(al)]], ans = opts.findIndex(o => Math.abs(o[1] - v) < 1e-9);
    const qd = ((b + (s > 0 ? 0 : -1)) % 4 + 4) % 4, qn = ['I', 'II', 'III', 'IV'][qd], swap = b % 2 === 1, pos = v > 0;
    return { v: { f, b, s, extra }, q: `Simplify ${exh}.`,
      steps: [st('', [choice(opts.map(o => o[0]))], [ans], `${extra ? `Drop ${extra}π first (full turns change nothing). ` : ''}Does ${base} swap the function name? Which quadrant is ${base} ${s > 0 ? '+' : '−'} α in when α is small?`,
        `${swap ? `${base} swaps ${f} to ${f === 'sin' ? 'cos' : 'sin'}` : `${base} keeps ${f}`}. The angle is in quadrant ${qn}, where ${f} is ${pos ? 'positive' : 'negative'}. Result: ${opts[ans][0]}.`)]
    };
  });

/* ================= TOPIC 7 — eigenvalues, eigenvectors ================= */
function eigA() {
  for (;;) {
    const A = rm(2, 2, -5, 6), t = A[0][0] + A[1][1], d = det2(A), disc = t * t - 4 * d, s = Math.round(Math.sqrt(Math.max(disc, 0)));
    const off = A[0][1] * A[1][0] !== 0 || ((A[0][1] || A[1][0]) && Math.random() < 0.15);
    if (disc > 0 && s * s === disc && off) return { A, t, d, l: [(t - s) / 2, (t + s) / 2] };
  }
}
const normv = v => { const g = v.reduce((a, b) => gcd(a, b), 0) || 1; let w = v.map(x => x / g); const f = w.find(x => x !== 0); if (f < 0) w = w.map(x => -x); return w.map(x => x === 0 ? 0 : x); };
function eigvec2(A, l) {
  const a = A[0][0] - l, b = A[0][1], c = A[1][0], d = A[1][1] - l;
  return normv((a || b) ? [b, -a] : [d, -c]);
}
function nullvec3(Mx) {
  const cr = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) { const c = cr(Mx[i], Mx[j]); if (c.some(x => x)) return normv(c); }
  return null;
}
const shiftM = (A, l) => A.map((r, i) => r.map((x, j) => i === j ? x - l : x));
const isEigVec = (A, l, v) => {
  const sc = Math.max(...v.map(Math.abs)); if (!(sc > 1e-9) || v.some(x => !isFinite(x))) return 'An eigenvector cannot be the zero vector. Pick a free value such as 1.';
  const res = A.map(r => r.reduce((s, x, k) => s + x * v[k], 0)); return res.every((x, i) => Math.abs(x - l * v[i]) < 1e-6 * Math.max(1, sc) * 10) ? true : `That vector does not satisfy (A − λI)v = 0 for λ = ${H(l)}. Put it back into both equations.`;
};
const vecStep = (A, l, v, name) => {
  const n = A.length, Sx = shiftM(A, l), xs = ['x', 'y', 'z'].slice(0, n).map(c => n === 2 ? sub('x', c === 'x' ? 1 : 2) : I(c));
  return st(`Eigenvector for λ = ${H(l)}. Solve (${I('A')} − ${P(l)}${I('I')})${I('v')} = 0; any non-zero solution is accepted.`, [mat(n, 1, `${name} =`)], [v.map(x => [x])],
    `${I('A')} − ${P(l)}${I('I')} = ${M(Sx)}. The equations are multiples of each other, so use one, set one unknown to 1 and solve for the rest.`,
    `${sys(Sx.map(r => terms(r.map((c, j) => [c, xs[j]])) + ' = 0'))} &nbsp;⇒&nbsp; for example ${name} = ${V(v)} (any multiple works).`,
    { val: vals => isEigVec(A, l, vals[0].map(r => r[0])) });
};
const lamSet = (l, labels) => st('Solve it. Enter the eigenvalues in any order:', l.map((_, k) => num(`λ<sub>${k + 1}</sub> =`)), l, labels.hint, labels.sol,
  { val: v => { const a = v.slice().sort((x, y) => x - y), b = l.slice().sort((x, y) => x - y); return a.every((x, k) => close(x, b[k])) ? true : 'Those are not the roots of the characteristic equation. Check the factorisation or the discriminant.'; } });
const charStep = e => st(`Characteristic equation |${I('A')} − λ${I('I')}| = 0. Expand it into the form:`, [num('λ<sup>2</sup> +', { after: 'λ', w: 4 }), num('+', { after: '= 0', w: 4 })], [-e.t, e.d],
  `${D([[`${H(e.A[0][0])} − λ`, e.A[0][1]], [e.A[1][0], `${H(e.A[1][1])} − λ`]])} = (${H(e.A[0][0])} − λ)(${H(e.A[1][1])} − λ) − ${P(e.A[0][1])}·${P(e.A[1][0])}. Shortcut: λ² − (trace)λ + det.`,
  `${poly([e.d, -e.t, 1], 'λ').replace(/<i>λ<\/i>/g, 'λ')} = 0 &nbsp; (trace = ${H(e.t)}, det = ${H(e.d)})`);
const EIG = 'Eigenvalues: solve |A − λI| = 0. For 2×2 this is λ² − (a + d)λ + (ad − bc) = 0. Eigenvector for each λ: put λ into (A − λI)v = 0. The equations become proportional, so keep one, choose one unknown freely (for example 1) and solve the other. Any non-zero multiple is a valid eigenvector.';

reg('eig2', 7, 'Eigenvalues and eigenvectors 2×2', 'Tikrinės reikšmės ir vektoriai 2×2', EIG,
  () => {
    const e = eigA(), vs = e.l.map(l => eigvec2(e.A, l));
    return { v: { A: e.A }, q: `Find the eigenvalues and eigenvectors of ${E('A', M(e.A))}.`,
      steps: [charStep(e), lamSet(e.l, { hint: `Find two numbers with sum ${H(e.t)} and product ${H(e.d)}, or use the discriminant.`, sol: `λ<sub>1</sub> = ${H(e.l[0])}, λ<sub>2</sub> = ${H(e.l[1])}` }),
      vecStep(e.A, e.l[0], vs[0], sub('v', 1)), vecStep(e.A, e.l[1], vs[1], sub('v', 2))]
    };
  });

function eig3A() {
  for (;;) {
    const e = eigA(), g = ri(-3, 5); if (e.l.includes(g)) continue;
    const x = [ri(-2, 3), ri(-2, 3)], low = Math.random() < 0.5;
    const A = low ? [[...e.A[0], 0], [...e.A[1], 0], [x[0], x[1], g]] : [[...e.A[0], x[0]], [...e.A[1], x[1]], [0, 0, g]];
    const l = [...e.l, g].sort((a, b) => a - b), vs = l.map(v => nullvec3(shiftM(A, v))); if (vs.some(v => !v)) continue;
    return { A, l, vs, e, g, low };
  }
}
reg('eig3', 7, 'Eigenvalues and eigenvectors 3×3', 'Tikrinės reikšmės ir vektoriai 3×3',
  EIG + ' For 3×3, expand |A − λI| along the row or column with two zeros: one factor (g − λ) comes out straight away and a 2×2 determinant is left.',
  () => {
    const t = eig3A(), q2 = poly([t.e.d, -t.e.t, 1], 'λ').replace(/<i>λ<\/i>/g, 'λ');
    return { v: { A: t.A }, q: `Find the eigenvalues and eigenvectors of ${E('A', M(t.A))}.`,
      steps: [lamSet(t.l, { hint: `Expand |A − λI| along ${t.low ? 'column 3' : 'row 3'}: (${H(t.g)} − λ)·${D([[`${H(t.e.A[0][0])} − λ`, t.e.A[0][1]], [t.e.A[1][0], `${H(t.e.A[1][1])} − λ`]])} = 0.`, sol: `(${H(t.g)} − λ)(${q2}) = 0 &nbsp;⇒&nbsp; λ = ${t.l.map(H).join(', ')}` }),
      ...t.l.map((l, k) => vecStep(t.A, l, t.vs[k], sub('v', k + 1)))]
    };
  });

reg('iseig', 7, 'Is k an eigenvalue?', 'Ar k yra tikrinė reikšmė?',
  'k is an eigenvalue exactly when det(A − kI) = 0. Subtract k from each diagonal entry and compute the determinant.',
  () => {
    const big3 = Math.random() < 0.3; let A, ls;
    if (big3) { const t = eig3A(); A = t.A; ls = t.l; } else { const e = eigA(); A = e.A; ls = e.l; }
    let k = pick(ls); if (Math.random() < 0.45) { do { k = ri(-4, 6); } while (ls.includes(k)); }
    const Sx = shiftM(A, k), d = det(Sx), yes = d === 0;
    return { v: { A, k }, q: `Is ${I('k')} = ${H(k)} an eigenvalue of ${E('A', M(A))}?`,
      steps: [
        st(`Subtract ${H(k)} from the diagonal and take the determinant:`, [num(`det(${I('A')} − ${P(k)}${I('I')}) =`)], [d], `${I('A')} − ${P(k)}${I('I')} = ${M(Sx)}`, `${D(Sx)} = ${big3 ? detSol(Sx) : d2s(Sx) + ' = ' + H(d)}`),
        st('So is it an eigenvalue?', [choice(['Yes', 'No'])], [yes ? 0 : 1], 'Eigenvalue ⇔ determinant equals 0.', yes ? 'The determinant is 0, so yes.' : 'The determinant is not 0, so no.')
      ]
    };
  });

/* ================= TOPIC 8 — iterated matrices ================= */
reg('pdp', 8, 'Diagonalise: A = PDP⁻¹', 'Diagonalizavimas A = PDP⁻¹',
  'D is diagonal with the eigenvalues on the diagonal. P has the eigenvectors as columns, <b>in the same order</b> as the eigenvalues in D. P<sup>−1</sup> is the ordinary 2×2 inverse of P. Then A<sup>t</sup> = P·D<sup>t</sup>·P<sup>−1</sup>.',
  () => {
    let e, l, vs, Pm; do { e = eigA(); l = [e.l[1], e.l[0]]; vs = l.map(v => eigvec2(e.A, v)); Pm = T(vs); } while (Math.abs(det2(Pm)) > 6);   // keeps P⁻¹ to simple fractions
    const Dm = [[l[0], 0], [0, l[1]]], Pi = inv2(Pm);
    return { v: { A: e.A }, q: `Write ${E('A', M(e.A))} as ${I('A')} = ${I('PDP')}<sup>−1</sup>.`,
      steps: [
        lamSet(e.l, { hint: `λ² − (${H(e.t)})λ + (${H(e.d)}) = 0`, sol: `${poly([e.d, -e.t, 1], 'λ').replace(/<i>λ<\/i>/g, 'λ')} = 0 &nbsp;⇒&nbsp; λ = ${H(e.l[0])}, ${H(e.l[1])}` }),
        st('Diagonal matrix of eigenvalues (either order):', [mat(2, 2, `${I('D')} =`)], [Dm], 'Eigenvalues on the diagonal, zeros elsewhere.', E('D', M(Dm)),
          { val: (v, ctx) => { const [[a, b], [c, d]] = v[0]; if (!close(b, 0) || !close(c, 0)) return { bad: [{ f: 0, cells: [[0, 1], [1, 0]].filter(([i, j]) => !close(v[0][i][j], 0)) }], msg: 'The off-diagonal entries of D are 0.' }; const ok = (close(a, l[0]) && close(d, l[1])) || (close(a, l[1]) && close(d, l[0])); if (ok) ctx.D = [a, d]; return ok ? true : 'The diagonal should hold the two eigenvalues.'; }, save: ctx => { ctx.D = ctx.D || l; } }),
        st(ctx => `Eigenvectors as columns, in the same order as in ${I('D')}: column 1 for λ = ${H(ctx.D[0])}, column 2 for λ = ${H(ctx.D[1])}.`, [mat(2, 2, `${I('P')} =`)], [Pm], 'Solve (A − λI)v = 0 for each eigenvalue and write the vectors side by side.', ctx => { const p = T(ctx.D.map(v => eigvec2(e.A, v))); return `For example ${E('P', M(p))} (columns may be scaled).`; },
          { val: (v, ctx) => { const p = v[0], c1 = isEigVec(e.A, ctx.D[0], [p[0][0], p[1][0]]), c2 = isEigVec(e.A, ctx.D[1], [p[0][1], p[1][1]]); if (c1 !== true) return { bad: [{ f: 0, cells: [[0, 0], [1, 0]] }], msg: `Column 1 is not an eigenvector for λ = ${H(ctx.D[0])}.` }; if (c2 !== true) return { bad: [{ f: 0, cells: [[0, 1], [1, 1]] }], msg: `Column 2 is not an eigenvector for λ = ${H(ctx.D[1])}.` }; ctx.P = p; return true; }, save: ctx => { ctx.P = ctx.P || T(ctx.D.map(v => eigvec2(e.A, v))); }, ansFn: ctx => [T(ctx.D.map(v => eigvec2(e.A, v)))] }),
        st(ctx => `Invert your ${E('P', M(ctx.P))}:`, [mat(2, 2, `${I('P')}<sup>−1</sup> =`)], [Pi], INV2, ctx => { const p = ctx.P, d = det2(p); return `det P = ${H(fr(d))}, &nbsp; ${I('P')}<sup>−1</sup> = ${M([[p[1][1] / d, -p[0][1] / d], [-p[1][0] / d, p[0][0] / d]].map(r => r.map(fr)))}`; },
          { val: (v, ctx) => { const x = v[0], p = ctx.P, pr = [[p[0][0] * x[0][0] + p[0][1] * x[1][0], p[0][0] * x[0][1] + p[0][1] * x[1][1]], [p[1][0] * x[0][0] + p[1][1] * x[1][0], p[1][0] * x[0][1] + p[1][1] * x[1][1]]]; return (close(pr[0][0], 1) && close(pr[1][1], 1) && Math.abs(pr[0][1]) < 1e-6 && Math.abs(pr[1][0]) < 1e-6) ? true : 'P times this matrix is not the identity. Use (1/det P)·[d, −b; −c, a].'; }, ansFn: ctx => { const p = ctx.P, d = det2(p); return [[[p[1][1] / d, -p[0][1] / d], [-p[1][0] / d, p[0][0] / d]]]; } })
      ]
    };
  });

reg('closed', 8, 'Solution n<sub>t</sub> from eigenvalues', 'Rekurentinės lygties sprendinys',
  'n<sub>t</sub> = c<sub>1</sub>λ<sub>1</sub><sup>t</sup>v<sub>1</sub> + c<sub>2</sub>λ<sub>2</sub><sup>t</sup>v<sub>2</sub>. Find eigenvalues and eigenvectors, then get c<sub>1</sub>, c<sub>2</sub> from the start: c<sub>1</sub>v<sub>1</sub> + c<sub>2</sub>v<sub>2</sub> = n<sub>0</sub> (two equations, two unknowns).',
  () => {
    let e, vs, c, n0, Tt, nT;
    do {                      // keep the numbers small enough to work out by hand
      e = eigA(); vs = e.l.map(l => eigvec2(e.A, l)); c = [nz(-2, 3), nz(-2, 3)]; n0 = [0, 1].map(i => c[0] * vs[0][i] + c[1] * vs[1][i]); Tt = pick([2, 3]);
      nT = [[n0[0]], [n0[1]]]; for (let k = 0; k < Tt; k++) nT = mmul(e.A, nT);
    } while (Math.max(Math.abs(nT[0][0]), Math.abs(nT[1][0])) > 300 || Math.max(...e.l.map(Math.abs)) > 5);
    const solveC = (v, w) => { const d = v[0] * w[1] - w[0] * v[1]; return [(n0[0] * w[1] - w[0] * n0[1]) / d, (v[0] * n0[1] - n0[0] * v[1]) / d]; };
    return { v: { A: e.A, n0, Tt }, q: `Let ${I('n')}<sub>t+1</sub> = ${I('A')}${I('n')}<sub>t</sub> with ${E('A', M(e.A))} and ${I('n')}<sub>0</sub> = ${V(n0)}. Write the solution ${I('n')}<sub>t</sub> = ${sub('c', 1)}λ<sub>1</sub><sup>t</sup>${sub('v', 1)} + ${sub('c', 2)}λ<sub>2</sub><sup>t</sup>${sub('v', 2)}.`,
      steps: [
        st('Eigenvalues (choose your own order, and keep it):', [num('λ<sub>1</sub> ='), num('λ<sub>2</sub> =')], e.l, `|A − λI| = λ² − (${H(e.t)})λ + (${H(e.d)}) = 0`, `λ = ${H(e.l[0])} and ${H(e.l[1])}`,
          { val: (v, ctx) => { const ok = (close(v[0], e.l[0]) && close(v[1], e.l[1])) || (close(v[0], e.l[1]) && close(v[1], e.l[0])); if (ok) ctx.l = [v[0], v[1]]; return ok ? true : 'Those are not the roots of the characteristic equation.'; }, save: ctx => { ctx.l = ctx.l || e.l; } }),
        st(ctx => `Eigenvectors: ${sub('v', 1)} for λ<sub>1</sub> = ${H(ctx.l[0])} and ${sub('v', 2)} for λ<sub>2</sub> = ${H(ctx.l[1])}.`, [mat(2, 1, `${sub('v', 1)} =`), mat(2, 1, `${sub('v', 2)} =`)], [vs[0].map(x => [x]), vs[1].map(x => [x])], '(A − λI)v = 0 for each λ. Any non-zero multiple is fine.', ctx => `For example ${sub('v', 1)} = ${V(eigvec2(e.A, ctx.l[0]))}, ${sub('v', 2)} = ${V(eigvec2(e.A, ctx.l[1]))}.`,
          { val: (v, ctx) => { const a = v[0].map(r => r[0]), b = v[1].map(r => r[0]), c1 = isEigVec(e.A, ctx.l[0], a), c2 = isEigVec(e.A, ctx.l[1], b); if (c1 !== true) return { bad: [{ f: 0 }], msg: c1 }; if (c2 !== true) return { bad: [{ f: 1 }], msg: c2 }; ctx.v = [a, b]; return true; }, save: ctx => { ctx.v = ctx.v || ctx.l.map(l => eigvec2(e.A, l)); }, ansFn: ctx => ctx.l.map(l => eigvec2(e.A, l).map(x => [x])) }),
        st(ctx => `Constants from the start: ${sub('c', 1)}${V(ctx.v[0])} + ${sub('c', 2)}${V(ctx.v[1])} = ${V(n0)}.`, [num(`${sub('c', 1)} =`), num(`${sub('c', 2)} =`)], c, 'Two equations, one per row. Solve by substitution or elimination.', ctx => { const s = solveC(ctx.v[0], ctx.v[1]); return `${sub('c', 1)} = ${H(fr(s[0]))}, ${sub('c', 2)} = ${H(fr(s[1]))}, so ${I('n')}<sub>t</sub> = ${P(fr(s[0]))}·${P(ctx.l[0])}<sup>t</sup>${V(ctx.v[0].map(fr))} + ${P(fr(s[1]))}·${P(ctx.l[1])}<sup>t</sup>${V(ctx.v[1].map(fr))}`; },
          { val: (v, ctx) => { const s = solveC(ctx.v[0], ctx.v[1]); return (close(v[0], s[0]) && close(v[1], s[1])) ? true : { bad: [close(v[0], s[0]) ? null : { f: 0 }, close(v[1], s[1]) ? null : { f: 1 }].filter(Boolean), msg: 'Put your constants back in: c₁v₁ + c₂v₂ must equal n₀ in both rows.' }; }, ansFn: ctx => solveC(ctx.v[0], ctx.v[1]) }),
        st(`Use your formula with ${I('t')} = ${Tt}:`, [mat(2, 1, `${I('n')}<sub>${Tt}</sub> =`)], [nT], `c₁·λ₁<sup>${Tt}</sup>·v₁ + c₂·λ₂<sup>${Tt}</sup>·v₂`, `${I('n')}<sub>${Tt}</sub> = ${M(nT)} (the same as multiplying by A ${Tt} times).`)
      ]
    };
  });

const LONG = ['It settles at a constant non-zero vector', 'It grows without bound', 'It shrinks to zero', 'It keeps oscillating'];
reg('markov', 8, 'Long-run behaviour (Perron–Frobenius)', 'Elgesys ilguoju laikotarpiu',
  'A matrix with positive entries whose columns each add up to 1 always has the dominant eigenvalue λ = 1; the other one is smaller in size, so its term dies out. The limit is the eigenvector for λ = 1, scaled so its entries add up to the same total as the starting vector.',
  () => {
    const fr = [new Q(1, 10), new Q(1, 5), new Q(3, 10), new Q(2, 5), new Q(1, 2), new Q(1, 4)]; let a, b; do { a = pick(fr); b = pick(fr); } while (a.add(b).v >= 1 || a.v === b.v && Math.random() < 0.5);
    const one = new Q(1), A = [[one.sub(a), b], [a, one.sub(b)]], l2 = one.sub(a).sub(b), first = Math.random() < 0.6, y0 = first ? [1, 0] : [0, 1], lim = [b.div(a.add(b)), a.div(a.add(b))];
    return { v: { A: A.map(r => r.map(x => x.v)), y0 }, q: `A mutation model is ${I('y')}<sub>t+1</sub> = ${I('A')}${I('y')}<sub>t</sub> with ${E('A', M(A))} and ${I('y')}<sub>0</sub> = ${V(y0)}.`,
      steps: [
        st('Eigenvalues of A, in any order (fractions are fine):', [num('λ<sub>1</sub> ='), num('λ<sub>2</sub> =')], [1, l2], 'Each column adds up to 1, so one eigenvalue is 1. The two eigenvalues add up to the trace.', `λ<sub>1</sub> = 1, λ<sub>2</sub> = trace − 1 = ${H(l2)}`,
          { val: v => ((close(v[0], 1) && close(v[1], l2.v)) || (close(v[1], 1) && close(v[0], l2.v))) ? true : 'Check with λ² − (trace)λ + det = 0.' }),
        st(`What does ${I('y')}<sub>t</sub> do in the long run?`, [choice(LONG)], [0], 'The term with |λ| &lt; 1 fades away; the term with λ = 1 stays the same size.', `(${H(l2)})<sup>t</sup> → 0, and 1<sup>t</sup> = 1, so ${I('y')}<sub>t</sub> stabilises.`),
        st('Where does it settle?', [mat(2, 1, `lim ${I('y')}<sub>t</sub> =`)], [lim.map(x => [x])], `Eigenvector for λ = 1: solve (A − I)v = 0. Then scale it so the entries add up to ${y0[0] + y0[1]}, the total of y₀.`, `Eigenvector for λ = 1 is proportional to ${V(normv([b.mul(20).v, a.mul(20).v]))}; scaled to total 1: ${V(lim)}`)
      ]
    };
  });

reg('longrun', 8, 'Long-run behaviour from eigenvalues', 'Ilgalaikis elgesys pagal tikrines reikšmes',
  'Look at the eigenvalue largest in absolute value. |λ| &gt; 1: growth without bound. All |λ| &lt; 1: decay to zero. Largest is exactly 1 (others smaller): settles at a constant vector. A −1 with nothing bigger: the sign flips every step, so it oscillates.',
  () => {
    const [l, ans] = pick([[[new Q(1, 2), new Q(1, 3)], 2], [[new Q(1, 2), new Q(-1, 5)], 2], [[new Q(9, 10), new Q(1, 2)], 2], [[new Q(2), new Q(1, 2)], 1], [[new Q(3, 2), new Q(1)], 1], [[new Q(1), new Q(1, 2)], 0], [[new Q(1), new Q(-1, 3)], 0], [[new Q(1), new Q(-1)], 3], [[new Q(-1), new Q(1, 2)], 3]]);
    const ord = shuffle(l), up = Math.random() < 0.5, s = pick([0, 1, 1, 2]), A = up ? [[ord[0], s], [0, ord[1]]] : [[ord[0], 0], [s, ord[1]]];
    return { v: { A: A.map(r => r.map(val)) }, q: `Let ${I('v')}<sub>t+1</sub> = ${I('A')}${I('v')}<sub>t</sub> with ${E('A', M(A))} and a typical starting vector (one that involves both eigenvectors).`,
      steps: [
        st('Eigenvalues, in any order:', [num('λ<sub>1</sub> ='), num('λ<sub>2</sub> =')], ord, 'For a triangular matrix the eigenvalues are the diagonal entries.', `λ = ${H(ord[0])}, ${H(ord[1])} (the diagonal of a triangular matrix).`,
          { val: v => ((close(v[0], ord[0].v) && close(v[1], ord[1].v)) || (close(v[1], ord[0].v) && close(v[0], ord[1].v))) ? true : 'For a triangular matrix, read the eigenvalues off the diagonal.' }),
        st(`What does ${I('v')}<sub>t</sub> do in the long run?`, [choice(LONG)], [ans], 'v<sub>t</sub> = c₁λ₁<sup>t</sup>v₁ + c₂λ₂<sup>t</sup>v₂. What happens to each λ<sup>t</sup> as t grows?', ['The largest |λ| is exactly 1 and the other term fades, so it settles.', 'One eigenvalue has |λ| &gt; 1, so its term grows without bound.', 'Both |λ| &lt; 1, so both terms shrink to zero.', '(−1)<sup>t</sup> switches between +1 and −1 forever and no other term outgrows it, so it oscillates.'][ans])
      ]
    };
  });

/* ================= TOPIC 9 — limits ================= */
const INF = { inf: true };
const LOPT = ['0', '+∞', '−∞', 'Indeterminate: needs more work'];
reg('limsym', 9, 'Quick forms: number/∞, number/0, 0/0', 'Simbolinės išraiškos',
  'number/∞ = 0. number/0 = ∞. a<sup>+∞</sup> = ∞ and a<sup>−∞</sup> = 0 when a &gt; 1. The forms 0/0, ∞/∞ and ∞ − ∞ are indeterminate: you must simplify first (factor, multiply by the conjugate, or divide by the highest power).',
  () => {
    const c = ri(2, 9), a = ri(2, 5), bank = [
      [big(c, '+∞'), 0], [big(-c, '+∞'), 0], [big(0, '∞'), 0], [`${a}<sup>−∞</sup>`, 0], [`${FR(1, a)}<sup>+∞</sup>`, 0], [big(c, `${a}<sup>+∞</sup>`), 0],
      [`${a}<sup>+∞</sup>`, 1], [`${c}·(+∞)`, 1], ['(+∞) + (+∞)', 1], ['(+∞)·(+∞)', 1], [big('+∞', c), 1], [`${FR(1, a)}<sup>−∞</sup>`, 1],
      [`${MIN}${c}·(+∞)`, 2], [big('−∞', c), 2], ['(+∞)·(−∞)', 2],
      [big(0, 0), 3], [big('∞', '∞'), 3], ['(+∞) − (+∞)', 3], ['0·∞', 3]];
    const qs = shuffle(bank).slice(0, 4);
    const why = ['A fixed number divided by something huge is tiny; a base above 1 with a very negative exponent is 1 over something huge.', 'It grows past every bound, with a plus sign.', 'It grows past every bound, with a minus sign.', 'The two parts pull in opposite directions; the result depends on the actual functions.'];
    return { v: {}, q: 'Decide what each symbolic expression equals.', steps: qs.map(([h, a]) => st(`<span class="bigq">${h}</span>`, [choice(LOPT)], [a], 'Think of ∞ as “a number growing without bound” and 0 as “a number shrinking towards zero”.', why[a])) };
  });

reg('limside', 9, 'One-sided limits of 1/xⁿ', 'Vienpusės ribos',
  'Near 0 the fraction c/x<sup>n</sup> blows up; only the sign needs care. From the right (x → 0⁺) x is positive. From the left (x → 0⁻) x is negative, and x<sup>n</sup> is negative only when n is odd. For x → ±∞ the fraction goes to 0.',
  () => {
    const vv = [];
    const mk = () => {
      const c = nz(-5, 6), n = ri(1, 4), a = pick([0, 0, 0, ri(1, 4), -ri(1, 3)]), side = pick([1, 1, -1, -1, 2]); vv.push({ c, n, a, side });
      const den = n === 1 ? (a ? `(${lin(a)})` : I('x')) : (a ? `(${lin(a)})<sup>${n}</sup>` : `${I('x')}<sup>${n}</sup>`), f = big(H(c), a && n === 1 ? lin(a) : den);
      if (side === 2) { const to = pick(['+∞', '−∞']); return st(`${lim('x', to)} ${f}`, [choice(LOPT.slice(0, 3))], [0], 'The denominator grows without bound.', 'number/∞ = 0'); }
      const sg = Math.sign(c) * (side < 0 && n % 2 ? -1 : 1), to = `${H(a)}${side > 0 ? '<sup>+</sup>' : '<sup>−</sup>'}`;
      return st(`${lim('x', to)} ${f}`, [choice(LOPT.slice(0, 3))], [sg > 0 ? 1 : 2], `x approaches ${H(a)} from the ${side > 0 ? 'right, so' : 'left, so'} ${a ? lin(a) : 'x'} is a tiny ${side > 0 ? 'positive' : 'negative'} number. What sign does the power have? And the whole fraction?`,
        `Denominator: tiny ${side < 0 && n % 2 ? 'negative' : 'positive'} number. Numerator ${H(c)} is ${c > 0 ? 'positive' : 'negative'}. Result: ${sg > 0 ? '+∞' : '−∞'}.`);
    };
    return { v: { items: vv }, q: 'Find each limit.', steps: [mk(), mk(), mk()] };
  });

function randPoly(deg, lead) { const c = Array(deg + 1).fill(0); c[deg] = lead; c[0] = Math.random() < 0.7 ? nz(-4, 5) : 0; if (deg > 1) c[ri(1, deg - 1)] = Math.random() < 0.7 ? nz(-4, 5) : 0; return c; }
reg('limrat', 9, 'Polynomial fraction at infinity', 'Racionalioji trupmena, kai x → ∞',
  'Form ∞/∞: take the highest power out of the top and the bottom (or just compare leading terms). Same degree: ratio of the leading coefficients. Bottom degree larger: 0. Top degree larger: ±∞, with the sign of the ratio of leading coefficients.',
  () => {
    const v = pick(['x', 'n']), kind = pick([0, 0, 0, 1, 2]), q = ri(1, 5), p = kind === 0 ? q : kind === 1 ? ri(0, q - 1) : q + ri(1, 2), lp = nz(-5, 6), lq = nz(-5, 6);
    const np = p === 0 ? [lp] : randPoly(p, lp), dp = randPoly(q, lq), desc = Math.random() < 0.5;
    const ans = kind === 0 ? new Q(lp, lq) : kind === 1 ? 0 : (lp / lq > 0 ? Infinity : -Infinity);
    return { v: { np, dp }, q: `Find ${lim(v, '+∞')} ${big(poly(np, v, desc), poly(dp, v, desc))}.`,
      steps: [
        st('Highest power of the variable:', [num('in the numerator:', { w: 3 }), num('in the denominator:', { w: 3 })], [p, q], 'Look for the largest exponent, wherever it stands in the expression.', `Numerator: ${pw(v, p) || 'no ' + v + ' (degree 0)'}, denominator: ${pw(v, q)}.`),
        st('The limit:', [num('=', INF)], [ans], kind === 0 ? 'Same degree: divide the leading coefficients.' : kind === 1 ? 'The denominator grows faster.' : 'The numerator grows faster. Which sign?', kind === 0 ? `Leading terms: ${big(terms([[lp, pw(v, p)]]), terms([[lq, pw(v, q)]]))} → ${H(ans)}` : kind === 1 ? 'Lower degree on top: the limit is 0.' : `Leading terms: ${big(terms([[lp, pw(v, p)]]), terms([[lq, pw(v, q)]]))} = ${terms([[new Q(lp, lq), pw(v, p - q)]])} → ${H(ans)}`)
      ]
    };
  });

reg('limfactor', 9, '0/0: factor and cancel', '0/0: skaidymas daugikliais',
  'Substituting gives 0/0, which means (x − a) divides both top and bottom. Factor both (roots of the quadratic, or a² − b² = (a − b)(a + b), a³ − b³ = (a − b)(a² + ab + b²)), cancel (x − a), then substitute.',
  () => {
    if (Math.random() < 0.3) {
      const a = pick([1, 2, 3, -1, -2]), ans = new Q(3 * a, 2);
      return { v: { np: [-a * a * a, 0, 0, 1], dp: [-a * a, 0, 1], a }, q: `Find ${lim('x', H(a))} ${big(poly([-a * a * a, 0, 0, 1], 'x'), poly([-a * a, 0, 1], 'x'))}.`,
        steps: [
          st(`Numerator = (${lin(a)})·(…). The second factor is:`, [num(`${I('x')}<sup>2</sup> +`, { after: I('x'), w: 4 }), num('+', { w: 4 })], [a, a * a], 'a³ − b³ = (a − b)(a² + ab + b²)', `${poly([-a * a * a, 0, 0, 1], 'x')} = (${lin(a)})(${poly([a * a, a, 1], 'x')})`),
          st(`Denominator = (${lin(a)})·(…). The second factor is:`, [num(`${I('x')} +`, { w: 4 })], [a], 'a² − b² = (a − b)(a + b)', `${poly([-a * a, 0, 1], 'x')} = (${lin(a)})(${lin(-a)})`),
          st(`Cancel (${lin(a)}) and substitute ${I('x')} = ${H(a)}:`, [num('limit =', INF)], [ans], `${big(poly([a * a, a, 1], 'x'), lin(-a))} at x = ${H(a)}`, `${big(H(3 * a * a), H(2 * a))} = ${H(ans)}`)
        ]
      };
    }
    let a, r1, r2; do { a = ri(-4, 5); r1 = ri(-5, 6); r2 = ri(-5, 6); } while (r1 === a || r2 === a || r1 === r2);
    const np = [a * r1, -(a + r1), 1], dp = [a * r2, -(a + r2), 1], ans = new Q(a - r1, a - r2);
    return { v: { np, dp, a }, q: `Find ${lim('x', H(a))} ${big(poly(np, 'x'), poly(dp, 'x'))}.`,
      steps: [
        st(`Substituting ${I('x')} = ${H(a)} gives 0/0, so both parts contain the factor (${lin(a)}). Find the other root of each:`, [num('other root of the numerator:', { w: 4 }), num('other root of the denominator:', { w: 4 })], [r1, r2], 'Use the discriminant, or Vieta: the product of the two roots equals the constant term.', `Numerator = (${lin(a)})(${lin(r1)}), denominator = (${lin(a)})(${lin(r2)})`),
        st(`Cancel (${lin(a)}) and substitute ${I('x')} = ${H(a)}:`, [num('limit =', INF)], [ans], `${big(lin(r1), lin(r2))} at x = ${H(a)}`, `${big(`${H(a)} − ${P(r1)}`, `${H(a)} − ${P(r2)}`)} = ${H(ans)}`)
      ]
    };
  });

reg('limconj', 9, '0/0 with a square root: conjugate', '0/0 su šaknimi: jungtinis reiškinys',
  'Multiply top and bottom by the conjugate (same two terms, opposite sign between them). (a − b)(a + b) = a² − b² removes the root. Then a factor cancels with the other part of the fraction and you can substitute.',
  () => {
    const kind = ri(0, 2);
    if (kind === 2) {
      const a = pick([1, 4, 9]), b = ri(1, 5), c = ri(1, 5), d = pick([1, 1, 2, 3]), ra = Math.sqrt(a), ans = new Q(b + c, 2 * ra * d);
      const s1 = root(terms([[a, ''], [b, I('x')]])), s2 = root(terms([[a, ''], [-c, I('x')]]));
      return { v: { f: x => (Math.sqrt(a + b * x) - Math.sqrt(a - c * x)) / (d * x), at: 0 }, q: `Find ${lim('x', 0)} ${big(`${s1} − ${s2}`, terms([[d, I('x')]]))}.`,
        steps: [
          st(`Multiply top and bottom by ${s1} + ${s2}. The numerator becomes:`, [num('', { after: `·${I('x')}`, w: 4 })], [b + c], `(${terms([[a, ''], [b, I('x')]])}) − (${terms([[a, ''], [-c, I('x')]])})`, `(${terms([[a, ''], [b, I('x')]])}) − (${terms([[a, ''], [-c, I('x')]])}) = ${b + c}${I('x')}`),
          st(`Cancel ${I('x')}, then substitute ${I('x')} = 0:`, [num('limit =', INF)], [ans], `${big(b + c, `${d === 1 ? '' : d + '·'}(${s1} + ${s2})`)} at x = 0`, `${big(b + c, `${d === 1 ? '' : d + '·'}(${ra} + ${ra})`)} = ${H(ans)}`)
        ]
      };
    }
    const a = ri(-2, 5), r = ri(1, 5), p = ri(1, 5), q = r * r - p * a, rt = root(terms([[p, I('x')], [q, '']])), flip = kind === 1, ans = flip ? new Q(2 * r, p) : new Q(p, 2 * r);
    const top = `${rt} − ${r}`, bot = lin(a);
    return { v: { f: x => flip ? (x - a) / (Math.sqrt(p * x + q) - r) : (Math.sqrt(p * x + q) - r) / (x - a), at: a }, q: `Find ${lim('x', H(a))} ${flip ? big(bot, top) : big(top, bot)}.`,
      steps: [
        st(`Multiply top and bottom by the conjugate ${rt} + ${r}. Then (${rt} − ${r})(${rt} + ${r}) simplifies to:`, [num('', { after: `·(${lin(a)})`, w: 4 })], [p], `(${terms([[p, I('x')], [q, '']])}) − ${r * r} = ${terms([[p, I('x')], [q - r * r, '']])}. Take the common factor out.`, `${terms([[p, I('x')], [q - r * r, '']])} = ${p}(${lin(a)})`),
        st(`After cancelling (${lin(a)}), the conjugate is left. At ${I('x')} = ${H(a)}: ${rt} + ${r} =`, [num('')], [2 * r], `√(${p}·${P(a)} ${q < 0 ? '−' : '+'} ${Math.abs(q)}) + ${r}`, `√${r * r} + ${r} = ${2 * r}`),
        st('So the limit is:', [num('limit =', INF)], [ans], flip ? `What is left is (√… + ${r})/${p}.` : `What is left is ${p}/(√… + ${r}).`, flip ? `${big(2 * r, p)} = ${H(ans)}` : `${big(p, 2 * r)} = ${H(ans)}`)
      ]
    };
  });

reg('limroot', 9, 'Roots at infinity', 'Šaknys, kai x → ∞',
  'Under a root only the highest power matters: √(a²x² + …) behaves like a·x, ³√(8x⁶ + …) like 2x² (for x → +∞). Replace each root by its leading behaviour, then compare leading terms as for polynomial fractions.',
  () => {
    const kind = ri(0, 2);
    if (kind === 0) {
      const a = ri(1, 4), d = nz(-3, 4), c = ri(1, 6), e = pick(['π', '1', '3', '5']), ans = new Q(a, d), rt = root(terms([[c, ''], [a * a, pw('x', 2)]]));
      return { v: { f: x => Math.sqrt(c + a * a * x * x) / ((e === 'π' ? Math.PI : +e) + d * x), at: Infinity }, q: `Find ${lim('x', '+∞')} ${big(rt, `${e} ${d < 0 ? '−' : '+'} ${Math.abs(d) === 1 ? '' : Math.abs(d)}${I('x')}`)}.`,
        steps: [
          st(`For large ${I('x')}, ${rt} behaves like:`, [num('', { after: `·${I('x')}`, w: 4 })], [a], '√(a²x²) = a·x for positive x; the constant under the root stops mattering.', `${rt} ≈ ${root(`${a * a}${pw('x', 2)}`)} = ${a}${I('x')}`),
          st('Compare leading terms:', [num('limit =', INF)], [ans], `${big(`${a}x`, `${d}x`)}`, `${big(`${a}${I('x')}`, `${H(d)}${I('x')}`)} → ${H(ans)}`)
        ]
      };
    }
    if (kind === 1) {
      const pairs = [[8, 2, 2], [18, 2, 3], [12, 3, 2], [27, 3, 3], [5, 3, 0], [7, 2, 0], [2, 3, 0], [20, 5, 2], [3, 1, 0], [32, 2, 4]], [p, q, sq] = pick(pairs), b = ri(1, 5), c = ri(1, 5);
      const ans = sq ? sq : { v: Math.sqrt(p / q), s: `sqrt(${new Q(p, q).str()})`, h: root(H(new Q(p, q))) };
      return { v: { f: x => Math.sqrt(b + p * x) / Math.sqrt(q * x - c), at: Infinity }, q: `Find ${lim('x', '+∞')} ${big(root(terms([[b, ''], [p, I('x')]])), root(terms([[q, I('x')], [-c, '']])))}.`,
        steps: [st('Put everything under one root and compare leading terms. Type a root as sqrt(5/3).', [num('limit =', INF)], [ans], `${root(big(terms([[b, ''], [p, I('x')]]), terms([[q, I('x')], [-c, '']])))}; inside, the fraction tends to ${H(new Q(p, q))}.`, `${root(H(new Q(p, q)))}${sq ? ' = ' + sq : ''}`)]
      };
    }
    const k = pick([2, 3]), m = pick([1, 2]), A0 = pick([1, 2, 3]), A = Math.pow(A0, k), B = nz(-3, 4), C = ri(1, 3), dd = ri(1, 5);
    const c1 = ri(1, 4), c2 = ri(1, 3);
    const numRoot = root(terms([[A, pw('x', k * m)], [c1, pw('x', m)], [1, '']]), k === 3 ? 3 : ''), denRoot = root(terms([[1, ''], [c2, pw('x', m)], [C * C, pw('x', 2 * m)]]));
    const ans = new Q(A0 + B, C), xm = pw('x', m);
    return { v: { f: x => (Math.pow(A * Math.pow(x, k * m) + c1 * Math.pow(x, m) + 1, 1 / k) + B * Math.pow(x, m) - (m === 2 ? 2 * x : 0)) / (Math.sqrt(1 + c2 * Math.pow(x, m) + C * C * Math.pow(x, 2 * m)) + dd), at: Infinity }, q: `Find ${lim('x', '+∞')} ${big(`${numRoot} ${B < 0 ? '−' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}${xm}${m === 2 ? ` − 2${I('x')}` : ''}`, `${denRoot} + ${dd}`)}.`,
      steps: [
        st(`Leading behaviour of the roots for large ${I('x')}:`, [num(`${numRoot} ≈`, { after: `·${xm}`, w: 4 }), num(`${denRoot} ≈`, { after: `·${xm}`, w: 4 })], [A0, C], `Keep only the highest power under each root: ${root(`${A}${pw('x', k * m)}`, k === 3 ? 3 : '')} and ${root(`${C * C}${pw('x', 2 * m)}`)}.`, `${numRoot} ≈ ${A0}${xm}, &nbsp; ${denRoot} ≈ ${C}${xm}`),
        st(`Compare the coefficients of ${xm} on top and bottom:`, [num('limit =', INF)], [ans], `Top: (${A0} ${B < 0 ? '−' : '+'} ${Math.abs(B)})${xm}. Bottom: ${C}${xm}.`, `${big(`${A0} ${B < 0 ? '−' : '+'} ${Math.abs(B)}`, C)} = ${H(ans)}`)
      ]
    };
  });
