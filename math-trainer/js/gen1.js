/* ================= TOPIC 3 — matrix algebra ================= */
const E = (n, h) => `${I(n)} = ${h}`;

reg('lincomb', 3, 'Combine matrices: αA + βBᵀ', 'Veiksmai su matricomis',
  'Transpose first (rows of B become columns of Bᵀ). Multiply every entry by its number, then add entry by entry. Sizes must match.',
  () => {
    const A = rm(2, 3, -5, 7), B = rm(3, 2, -8, 7), a = pick([2, 2, 3, -2, 4]), b = pick([3, 3, 2, -1, -2, 5]);
    const BT = T(B), aA = A.map(r => r.map(x => a * x)), bB = BT.map(r => r.map(x => b * x)), R = aA.map((r, i) => r.map((x, j) => x + bB[i][j]));
    const ex = terms([[a, I('A')], [b, I('B') + '<sup>T</sup>']]);
    return { v: { A, B, a, b }, q: `Let ${E('A', M(A))} and ${E('B', M(B))}. Compute ${ex}.`,
      steps: [
        st(`Transpose ${I('B')}:`, [mat(2, 3, `${I('B')}<sup>T</sup> =`)], [BT], 'Row 1 of B becomes column 1 of Bᵀ, row 2 becomes column 2, and so on. A 3×2 matrix turns into a 2×3 one.', `${I('B')}<sup>T</sup> = ${M(BT)}`),
        st(`Now multiply by the numbers and add:`, [mat(2, 3, `${ex} =`)], [R], `Each entry is ${a}·(entry of A) ${b < 0 ? '−' : '+'} ${Math.abs(b)}·(entry of Bᵀ) in the same position.`, `${a}${I('A')} = ${M(aA)}, &nbsp; ${b}${I('B')}<sup>T</sup> = ${M(bB)}, &nbsp; sum = ${M(R)}`)
      ]
    };
  });

reg('matmul', 3, 'Multiply two matrices', 'Matricų daugyba',
  'AB exists only when A has as many columns as B has rows. The result has (rows of A) × (columns of B). Entry (i, j) = row i of A times column j of B, multiplied pairwise and added.',
  () => {
    const [m, n, p] = pick([[2, 2, 2], [2, 2, 2], [2, 3, 2], [3, 2, 2], [2, 2, 3], [3, 2, 3], [2, 3, 3]]);
    const A = rm(m, n, -4, 7), B = rm(n, p, -4, 8), R = mmul(A, B);
    const W = A.map(r => B[0].map((_, j) => r.map((x, k) => `${P(x)}·${P(B[k][j])}`).join(' + ')));
    return { v: { A, B }, q: `Let ${E('A', M(A))} and ${E('B', M(B))}. Compute ${I('AB')}.`,
      steps: [
        st(`What size is ${I('AB')}?`, [num('', { after: 'rows', w: 3 }), num('×', { after: 'columns', w: 3 })], [m, p], `A is ${m}×${n}, B is ${n}×${p}. The inner numbers match (${n} = ${n}); the outer numbers give the size.`, `${m}×${n} times ${n}×${p} gives ${m}×${p}.`),
        st(`Fill in the product:`, [mat(m, p, `${I('AB')} =`)], [R], 'Entry (i, j): take row i of A and column j of B, multiply matching entries and add them.', `${M(W)} = ${M(R)}`)
      ]
    };
  });

reg('possible', 3, 'Which products exist?', 'Ar įmanoma sudauginti?',
  'Write the sizes side by side: (m×n)(p×q). The product exists only if the two inner numbers are equal (n = p). The result is m×q.',
  () => {
    let sh, ok;
    do {
      sh = shuffle([[2, 3], [2, 2], [3, 2], [3, 3], [1, 2], [2, 1], [3, 1], [1, 3]]).slice(0, 3);
      ok = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== j) ok.push(sh[i][1] === sh[j][0]);
    } while (!ok.some(x => x) || ok.every(x => x));
    const N = ['A', 'B', 'C'], Ms = sh.map(s => rm(s[0], s[1], -6, 7));
    const pairs = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== j) pairs.push([i, j]);
    const good = pairs.filter((_, k) => ok[k]), [gi, gj] = pick(good);
    return { v: { sh, gi, gj }, q: `Let ${Ms.map((m, i) => E(N[i], M(m))).join(', ')}.`,
      steps: [
        st('Select every product that can be computed:', [checks(pairs.map(([i, j]) => I(N[i] + N[j])))], [ok], `Sizes: ${sh.map((s, i) => `${N[i]} is ${s[0]}×${s[1]}`).join(', ')}. XY works when columns of X = rows of Y.`,
          pairs.map(([i, j], k) => `${I(N[i] + N[j])}: (${sh[i][0]}×<b>${sh[i][1]}</b>)(<b>${sh[j][0]}</b>×${sh[j][1]}) ${ok[k] ? '✓' : '✗'}`).join(' &nbsp;·&nbsp; ')),
        st(`What size is ${I(N[gi] + N[gj])}?`, [num('', { after: 'rows', w: 3 }), num('×', { after: 'columns', w: 3 })], [sh[gi][0], sh[gj][1]], 'Rows of the first matrix × columns of the second.', `(${sh[gi][0]}×${sh[gi][1]})(${sh[gj][0]}×${sh[gj][1]}) gives ${sh[gi][0]}×${sh[gj][1]}.`)
      ]
    };
  });

reg('det2', 3, 'Determinant 2×2', 'Determinantas 2×2',
  'For a 2×2 matrix: main diagonal product minus the other diagonal product, ad − bc.',
  () => {
    const A = rm(2, 2, -7, 9);
    return { v: { A }, q: `Compute ${D(A)}.`, steps: [st('', [num('det =')], [det2(A)], 'ad − bc: multiply the main diagonal, subtract the product of the other diagonal.', `${d2s(A)} = ${H(det2(A))}`)] };
  });

reg('det3', 3, 'Determinant 3×3 (Sarrus)', 'Determinantas 3×3',
  'Triangle rule: aei + bfg + cdh (three products going down-right) minus ceg + afh + bdi (three products going down-left).',
  () => {
    const A = rm(3, 3, -3, 6), s = sarrus(A), p = s.pos.reduce((x, y) => x + y), n = s.neg.reduce((x, y) => x + y);
    return { v: { A }, q: `Compute ${D(A)}.`,
      steps: [
        st('Add the three products along the main-diagonal direction (aei + bfg + cdh):', [num('sum =')], [p], 'Main diagonal, then the two “triangles” parallel to it.', `${s.ps} = ${H(p)}`),
        st('Add the three products along the other diagonal direction (ceg + afh + bdi):', [num('sum =')], [n], 'Anti-diagonal, then the two triangles parallel to it.', `${s.ns} = ${H(n)}`),
        st('Subtract the second sum from the first:', [num('det =')], [p - n], `${H(p)} − ${P(n)}`, `${H(p)} − ${P(n)} = ${H(p - n)}`)
      ]
    };
  });

/* ================= TOPIC 4 — dynamics, inverses ================= */
function diagram(Qm, names) {
  const n = Qm.length, r = 20, gap = 150, x0 = 95, cy = n === 3 ? 135 : 100, W = x0 * 2 + gap * (n - 1), Hh = cy * 2;
  const X = i => x0 + gap * i; let o = '', lab = '';
  const L = (x, y, t) => { lab += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="dl">${H(t)}</text>`; };
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const w = Qm[i][j]; if (!w) continue;            // arrow j -> i
    if (i === j) {
      const x = X(i);
      if (i === 0) { o += `<path d="M${x - 17} ${cy - 10} C ${x - 62} ${cy - 34}, ${x - 62} ${cy + 34}, ${x - 18} ${cy + 11}" class="de"/>`; L(x - 64, cy + 4, w); }
      else if (i === n - 1) { o += `<path d="M${x + 17} ${cy + 10} C ${x + 62} ${cy + 34}, ${x + 62} ${cy - 34}, ${x + 18} ${cy - 11}" class="de"/>`; L(x + 64, cy + 4, w); }
      else { o += `<path d="M${x - 10} ${cy - 17} C ${x - 34} ${cy - 62}, ${x + 34} ${cy - 62}, ${x + 11} ${cy - 18}" class="de"/>`; L(x, cy - 56, w); }
    } else {
      const far = Math.abs(i - j) > 1, up = i > j, sg = up ? -1 : 1, dir = up ? 1 : -1;
      const dx = far ? 8 : 15, dy = far ? 19 : 14;
      const xs = X(j) + dir * dx, xe = X(i) - dir * dx, ys = cy + sg * dy, yc = cy + sg * (far ? 150 : 62), xm = (xs + xe) / 2;
      o += `<path d="M${xs} ${ys} Q ${xm} ${yc}, ${xe} ${ys}" class="de"/>`;
      const ym = 0.5 * ys + 0.5 * yc; L(xm, ym + (up ? -7 : 16), w);
    }
  }
  let nodes = ''; for (let i = 0; i < n; i++) nodes += `<circle cx="${X(i)}" cy="${cy}" r="${r}" class="dn"/><text x="${X(i)}" y="${cy + 5}" class="dt">${names[i]}</text>`;
  return `<svg class="dia" viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" role="img" aria-label="matrix diagram"><defs><marker id="ah" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="ah"/></marker></defs>${o}${nodes}${lab}</svg>`;
}
const recEq = (Qm, names) => Qm.map((r, i) => `${sub(names[i], 't+1')} = ${terms(r.map((c, j) => [c, sub(names[j], 't')]))}`);

reg('diagram', 4, 'Diagram → matrix Q', 'Matricinė diagrama → matrica',
  'For n<sub>t+1</sub> = Q·n<sub>t</sub>: the <b>column</b> is where the arrow starts, the <b>row</b> is where it ends. An arrow from B to A with weight 4 goes in row A, column B. No arrow means 0.',
  () => {
    const n = pick([2, 2, 3]), names = ['A', 'B', 'C'].slice(0, n); let Qm, cnt;
    do { Qm = rm(n, n, 0, 9).map(r => r.map(x => Math.random() < (n === 2 ? 0.25 : 0.45) ? 0 : (x || 1))); cnt = Qm.flat().filter(x => x).length; } while (cnt < n + 1 || cnt === n * n);
    return { v: { Qm }, q: `The diagram shows the system ${I('n')}<sub>t+1</sub> = ${I('Q')}${I('n')}<sub>t</sub>, with the states ordered ${names.join(', ')}.<div class="fig">${diagram(Qm, names)}</div>`,
      steps: [st('Write the matrix:', [mat(n, n, `${I('Q')} =`)], [Qm], 'Take each arrow in turn. Arrow from state j to state i with weight w: put w in row i, column j. Loops go on the diagonal.',
        `${sys(recEq(Qm, names))} &nbsp;⇒&nbsp; ${E('Q', M(Qm))}`)]
    };
  });

reg('rec2mat', 4, 'Recurrence equations → matrix', 'Rekurentinės lygtys → matrica',
  'Line up the variables in the same order on both sides. Row i of the matrix holds the coefficients of equation i. A variable that is missing from an equation has coefficient 0.',
  () => {
    const n = pick([2, 3, 3]), names = pick([['x', 'y', 'z'], ['s', 'a', 'v'], ['p', 'k', 'm'], ['a', 'b', 'c']]).slice(0, n); let Qm;
    if (Math.random() < 0.5) {                 // Markov-style, columns sum to 1
      Qm = Array.from({ length: n }, () => Array(n).fill(0));
      for (let j = 0; j < n; j++) { const stay = pick([5, 6, 7, 8, 9]), to = pick([...Array(n).keys()].filter(i => i !== j)); Qm[j][j] = stay / 10; Qm[to][j] = (10 - stay) / 10; }
    } else { do { Qm = rm(n, n, -3, 6).map(r => r.map(x => Math.random() < 0.35 ? 0 : x)); } while (Qm.some(r => r.every(x => !x))); }
    return { v: { Qm }, q: `A model is given by ${sys(recEq(Qm, names))} Write it as ${M(names.map(v => [sub(v, 't+1')]))} = ${I('Q')}${M(names.map(v => [sub(v, 't')]))}.`,
      steps: [st('', [mat(n, n, `${I('Q')} =`)], [Qm], `Column order is ${names.join(', ')}. In each equation read off the coefficient of each variable; write 0 where a variable does not appear. Decimals can be typed as 0.3 or 0,3.`, E('Q', M(Qm)))]
    };
  });

reg('iterate', 4, 'Step a population forward', 'Vektorių dinamika: n₁, n₂',
  'n<sub>1</sub> = A·n<sub>0</sub>, then n<sub>2</sub> = A·n<sub>1</sub>. Each step is one matrix-times-vector product.',
  () => {
    let A; do { A = rm(2, 2, -1, 3); } while (!det2(A));
    const n0 = [[ri(1, 5)], [ri(1, 5)]], n1 = mmul(A, n0), n2 = mmul(A, n1);
    const w = (A, v) => M(A.map(r => [r.map((x, k) => `${P(x)}·${P(v[k][0])}`).join(' + ')]));
    return { v: { A, n0 }, q: `Let ${I('n')}<sub>t+1</sub> = ${I('A')}${I('n')}<sub>t</sub> with ${E('A', M(A))} and ${I('n')}<sub>0</sub> = ${M(n0)}.`,
      steps: [
        st('One step:', [mat(2, 1, `${I('n')}<sub>1</sub> =`)], [n1], 'Row 1 of A times n₀ gives the first entry, row 2 of A times n₀ gives the second.', `${w(A, n0)} = ${M(n1)}`),
        st('One more step:', [mat(2, 1, `${I('n')}<sub>2</sub> =`)], [n2], 'Multiply A by the vector you just found.', `${w(A, n1)} = ${M(n2)}`)
      ]
    };
  });

const goodA2 = (lo, hi, dets) => { let A; do { A = rm(2, 2, lo, hi); } while (!dets.includes(Math.abs(det2(A)))); return A; };
const adj2 = A => [[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]];
const INV2 = 'A<sup>−1</sup> = (1/det)·[d, −b; −c, a]: swap the main-diagonal entries, change the sign of the other two, divide everything by the determinant. If det = 0 there is no inverse.';

reg('inverse2', 4, 'Inverse of a 2×2 matrix', 'Atvirkštinė matrica 2×2', INV2,
  () => {
    const A = goodA2(-5, 7, [1, 2, 3, 4, 5, 6]), d = det2(A), ad = adj2(A), inv = inv2(A);
    return { v: { A }, q: `Find the inverse of ${E('A', M(A))}.`,
      steps: [
        st('Determinant:', [num('det A =')], [d], 'ad − bc', `${d2s(A)} = ${H(d)}`),
        st('Swap the diagonal entries and change the sign of the other two:', [mat(2, 2, '')], [ad], 'From [a, b; c, d] make [d, −b; −c, a].', M(ad)),
        st('Divide every entry by the determinant (type fractions like 3/4):', [mat(2, 2, `${I('A')}<sup>−1</sup> =`)], [inv], `Each entry of the previous matrix divided by ${H(d)}.`, `${I('A')}<sup>−1</sup> = ${FR(1, P(d))}·${M(ad)} = ${M(inv)}`)
      ]
    };
  });

reg('isinverse', 4, 'Are A and B inverses?', 'Ar matricos viena kitai atvirkštinės?',
  'Multiply them. A and B are inverses exactly when AB is the identity matrix (1 on the diagonal, 0 elsewhere).',
  () => {
    const A = goodA2(-4, 7, [1, 2, 3]); let B = inv2(A); const yes = Math.random() < 0.55;
    if (!yes) { const c = shuffle([[0, 0], [0, 1], [1, 0], [1, 1]]).find(([i, j]) => B[i][j].n !== 0); B = B.map((r, i) => r.map((x, j) => i === c[0] && j === c[1] ? x.mul(-1) : x)); }
    const AB = qmul(A, B);
    return { v: { A, B: B.map(r => r.map(x => x.v)), yes }, q: `Let ${E('A', M(A))} and ${E('B', M(B))}.`,
      steps: [
        st('Multiply them:', [mat(2, 2, `${I('AB')} =`)], [AB], 'Row of A times column of B. Fractions are fine: type 7/3.', `${I('AB')} = ${M(AB)}`),
        st('Are A and B inverses of each other?', [choice(['Yes', 'No'])], [yes ? 0 : 1], 'Compare AB with the identity matrix.', yes ? 'AB is the identity matrix, so yes.' : 'AB is not the identity matrix, so no.')
      ]
    };
  });

reg('singular', 4, 'When is the matrix singular?', 'Kada matrica išsigimusi?',
  'Singular (išsigimusi) means det = 0. Write the determinant with the unknown in it, set it to 0 and solve.',
  () => {
    const pos = ri(0, 3), e = [nz(-6, 9), nz(-6, 9), nz(-6, 9), nz(-6, 9)];
    const [a, b, c, d] = e;               // [[a,b],[c,d]]
    const sol = [new Q(b * c, d), new Q(a * d, c), new Q(a * d, b), new Q(b * c, a)][pos];
    const sh = e.map((x, k) => k === pos ? I('a') : x);
    const eq = ['a·' + P(d) + ' − ' + P(b) + '·' + P(c), P(a) + '·' + P(d) + ' − a·' + P(c), P(a) + '·' + P(d) + ' − ' + P(b) + '·a', P(a) + '·a − ' + P(b) + '·' + P(c)][pos];
    return { v: { e, pos }, q: `For which value of ${I('a')} is ${M([[sh[0], sh[1]], [sh[2], sh[3]]])} singular (išsigimusi)?`,
      steps: [st('', [num(`${I('a')} =`)], [sol], `Set the determinant to zero: ${eq} = 0.`, `${eq} = 0 &nbsp;⇒&nbsp; ${I('a')} = ${H(sol)}`)]
    };
  });

reg('backstep', 4, 'Step backwards with the inverse', 'Ankstesnio sezono vektorius',
  'If x<sub>t+1</sub> = A·x<sub>t</sub>, then x<sub>t</sub> = A<sup>−1</sup>·x<sub>t+1</sub>. Find the 2×2 inverse, then multiply it by the known vector.',
  () => {
    const A = goodA2(-3, 6, [1, 2, 4, 5]), x = [[ri(-3, 6)], [nz(-3, 6)]], y = mmul(A, x), d = det2(A), inv = inv2(A);
    return { v: { A, y }, q: `A population changes by ${I('x')}<sub>t+1</sub> = ${M(A)}${I('x')}<sub>t</sub>. This season the vector is ${I('x')}<sub>t+1</sub> = ${M(y)}. What was it one season earlier?`,
      steps: [
        st('Determinant of the matrix:', [num('det =')], [d], 'ad − bc', `${d2s(A)} = ${H(d)}`),
        st('Inverse matrix:', [mat(2, 2, `${I('A')}<sup>−1</sup> =`)], [inv], INV2, `${FR(1, P(d))}·${M(adj2(A))} = ${M(inv)}`),
        st('Multiply the inverse by this season’s vector:', [mat(2, 1, `${I('x')}<sub>t</sub> =`)], [x], 'x<sub>t</sub> = A<sup>−1</sup>·x<sub>t+1</sub>', `${M(inv)}${M(y)} = ${M(x)}`)
      ]
    };
  });

/* ================= TOPIC 5 — determinants, Cramer, inverse method ================= */
reg('minor', 5, 'Minor and cofactor', 'Minoras ir adjunktas',
  'Minor M<sub>ij</sub>: cross out row i and column j, take the determinant of what is left. Cofactor (adjunktas) A<sub>ij</sub> = (−1)<sup>i+j</sup>·M<sub>ij</sub>: same number, sign flipped when i + j is odd.',
  () => {
    const A = rm(3, 3, -5, 9), i = ri(0, 2), j = ri(0, 2), m = minorM(A, i, j), Mv = det2(m), sg = (i + j) % 2 ? -1 : 1, ij = `${i + 1}${j + 1}`;
    return { v: { A, i, j }, q: `Let ${E('A', M(A))}.`,
      steps: [
        st(`Minor:`, [num(`${sub('M', ij)} =`)], [Mv], `Cross out row ${i + 1} and column ${j + 1}: ${M(A, { hl: (r, c) => r === i || c === j })} The four entries left form a 2×2 determinant.`, `${sub('M', ij)} = ${D(m)} = ${d2s(m)} = ${H(Mv)}`),
        st(`Cofactor (adjunktas):`, [num(`${sub('A', ij)} =`)], [sg * Mv], `(−1)<sup>${i + 1}+${j + 1}</sup> = ${sg > 0 ? '+1' : '−1'}`, `${sub('A', ij)} = (−1)<sup>${i + 1 + j + 1}</sup>·${P(Mv)} = ${H(sg * Mv)}`)
      ]
    };
  });

reg('det4', 5, 'Determinant 4×4 by expansion', 'Determinantas 4×4 (skleidimas)',
  'Pick the row or column with the most zeros. det = sum of (entry × its cofactor) along it. Zeros contribute nothing, so only the non-zero entries need a 3×3 determinant. Cofactor sign: (−1)<sup>i+j</sup>.',
  () => {
    let A = rm(4, 4, -2, 4).map(r => r.map(x => Math.random() < 0.2 ? 0 : x)); const c = ri(0, 3), rows = shuffle([0, 1, 2, 3]).slice(0, 2).sort();
    for (let i = 0; i < 4; i++) A[i][c] = rows.includes(i) ? nz(-3, 5) : 0;
    const asRow = Math.random() < 0.4; const cof = rows.map(i => ((i + c) % 2 ? -1 : 1) * det(minorM(A, i, c))), mins = rows.map(i => minorM(A, i, c));
    const d = rows.reduce((s, i, k) => s + A[i][c] * cof[k], 0), ent = rows.map(i => A[i][c]);
    const sh = asRow ? T(A) : A, idx = i => asRow ? `${c + 1}${i + 1}` : `${i + 1}${c + 1}`, mn = k => asRow ? T(mins[k]) : mins[k];
    const stepC = k => { const i = rows[k], sg = (i + c) % 2 ? -1 : 1, s = sarrus(mn(k)); return st(`Cofactor of the entry ${H(ent[k])}:`, [num(`${sub('A', idx(i))} = ${sg > 0 ? '+' : MIN}${D(mn(k))} =`)], [cof[k]], `Compute the 3×3 determinant with the triangle rule, then apply the sign (${sg > 0 ? '+' : '−'}).`, `${D(mn(k))} = (${s.ps}) − (${s.ns}) = ${H(det(mins[k]))}, so ${sub('A', idx(i))} = ${H(cof[k])}`); };
    return { v: { M: sh }, q: `Compute ${D(sh, { hl: (i, j) => (asRow ? i : j) === c })} by expanding along ${asRow ? 'row' : 'column'} ${c + 1} (it has two zeros).`,
      steps: [stepC(0), stepC(1),
      st('Combine: each entry times its cofactor.', [num('det =')], [d], `${P(ent[0])}·${sub('A', idx(rows[0]))} + ${P(ent[1])}·${sub('A', idx(rows[1]))}`, `${P(ent[0])}·${P(cof[0])} + ${P(ent[1])}·${P(cof[1])} = ${H(d)}`)]
    };
  });

const eqn = (row, vars, rhs) => `${terms(row.map((c, j) => [c, I(vars[j])]))} = ${H(rhs)}`;
const CRAMER = 'Δ = det of the coefficient matrix. Δ<sub>x</sub>: replace the x-column with the right-hand sides; same for y and z. Then x = Δ<sub>x</sub>/Δ, y = Δ<sub>y</sub>/Δ, z = Δ<sub>z</sub>/Δ. If Δ = 0: all other Δ’s zero means infinitely many solutions, any of them non-zero means no solution.';

reg('cramer2', 5, 'Cramer’s rule, 2 unknowns', 'Kramerio metodas 2×2', CRAMER,
  () => {
    let A; do { A = rm(2, 2, -5, 6); } while (!det2(A) || Math.abs(det2(A)) > 12 || A.flat().some(x => !x));
    const b = [nz(-9, 9), ri(-9, 9)], d = det2(A), A1 = repCol(A, 0, b), A2 = repCol(A, 1, b), d1 = det2(A1), d2 = det2(A2);
    return { v: { A, b }, q: `Solve with Cramer’s rule: ${sys(A.map((r, i) => eqn(r, ['x', 'y'], b[i])))}`,
      steps: [
        st('Main determinant:', [num('Δ =')], [d], `Δ = ${D(A)}`, `Δ = ${D(A)} = ${d2s(A)} = ${H(d)}`),
        st('Replace one column at a time with the right-hand sides:', [num(`Δ<sub>x</sub> = ${D(A1)} =`), num(`Δ<sub>y</sub> = ${D(A2)} =`)], [d1, d2], 'Two more 2×2 determinants: ad − bc.', `Δ<sub>x</sub> = ${d2s(A1)} = ${H(d1)}, &nbsp; Δ<sub>y</sub> = ${d2s(A2)} = ${H(d2)}`),
        st('Divide:', [num(`${I('x')} =`), num(`${I('y')} =`)], [new Q(d1, d), new Q(d2, d)], 'x = Δ<sub>x</sub>/Δ, y = Δ<sub>y</sub>/Δ. Fractions are fine.', `${I('x')} = ${FR(H(d1), H(d))} = ${H(new Q(d1, d))}, &nbsp; ${I('y')} = ${FR(H(d2), H(d))} = ${H(new Q(d2, d))}`)
      ]
    };
  });

const detSol = A => { const s = sarrus(A); return `(${s.ps}) − (${s.ns}) = ${H(det(A))}`; };
reg('cramer3', 5, 'Cramer’s rule, 3 unknowns', 'Kramerio metodas 3×3', CRAMER,
  () => {
    let A; do { A = rm(3, 3, -3, 4); } while (!det(A) || Math.abs(det(A)) > 30);
    const x = [ri(-4, 6), ri(-4, 6), ri(-4, 6)], b = A.map(r => r.reduce((s, c, j) => s + c * x[j], 0)), d = det(A), As = [0, 1, 2].map(j => repCol(A, j, b)), ds = As.map(det), vn = ['x', 'y', 'z'];
    return { v: { A, b }, q: `Solve with Cramer’s rule: ${sys(A.map((r, i) => eqn(r, vn, b[i])))}`,
      steps: [
        st('Main determinant:', [num(`Δ = ${D(A)} =`)], [d], 'Triangle rule: aei + bfg + cdh − ceg − afh − bdi.', `Δ = ${detSol(A)}`),
        ...[0, 1, 2].map(j => st(`Put the right-hand sides in the ${vn[j]}-column:`, [num(`Δ<sub>${vn[j]}</sub> = ${D(As[j], { hl: (r, c) => c === j })} =`)], [ds[j]], 'Same triangle rule on this matrix.', `Δ<sub>${vn[j]}</sub> = ${detSol(As[j])}`)),
        st('Divide each by Δ:', vn.map(v => num(`${I(v)} =`)), x, `x = Δ<sub>x</sub>/Δ = ${H(ds[0])}/${P(d)}, and so on.`, `(${I('x')}, ${I('y')}, ${I('z')}) = (${x.map(H).join(', ')})`)
      ]
    };
  });

reg('cramer0', 5, 'Δ = 0: none or infinitely many?', 'Kai Δ = 0: sprendinių skaičius', CRAMER,
  () => {
    let A, r1, r2, al, be;
    do { r1 = [nz(-2, 3), ri(-2, 3), ri(-2, 3)]; r2 = [ri(-2, 3), nz(-2, 3), ri(-2, 3)]; al = nz(-1, 2); be = nz(-1, 2); A = [r1, r2, r1.map((x, j) => al * x + be * r2[j])]; }
    while (r1[0] * r2[1] - r1[1] * r2[0] === 0 || A[2].some(x => Math.abs(x) > 6));
    const inf = Math.random() < 0.5, b = [ri(-4, 6), ri(-4, 6)]; b.push(al * b[0] + be * b[1] + (inf ? 0 : nz(-2, 2)));
    const As = [0, 1, 2].map(j => repCol(A, j, b)), ds = As.map(det), vn = ['x', 'y', 'z'];
    return { v: { A, b, inf }, q: `Study the system ${sys(A.map((r, i) => eqn(r, vn, b[i])))}`,
      steps: [
        st('Main determinant:', [num(`Δ = ${D(A)} =`)], [0], 'Triangle rule.', `Δ = ${detSol(A)}`),
        st('Δ = 0, so there is no unique solution. Compute the other three determinants:', vn.map((v, j) => num(`Δ<sub>${v}</sub> =`)), ds, `Replace column by column with (${b.join(', ')}): ` + As.map((a, j) => `Δ<sub>${vn[j]}</sub> = ${D(a)}`).join(', '), ds.map((d, j) => `Δ<sub>${vn[j]}</sub> = ${H(d)}`).join(', ')),
        st('How many solutions does the system have?', [choice(['No solutions', 'Exactly one', 'Infinitely many'])], [inf ? 2 : 0], 'Δ = 0 and all three others are 0 → infinitely many. Δ = 0 and at least one of the others is not 0 → none.', inf ? 'All four determinants are 0: infinitely many solutions (parametrise with z = t).' : 'Δ = 0 but not all of the others are 0: no solutions.')
      ]
    };
  });

reg('param3', 5, 'Infinitely many solutions: parametrise', 'Be galo daug sprendinių: parametrizavimas',
  'When Δ = 0 and Δ<sub>x</sub> = Δ<sub>y</sub> = Δ<sub>z</sub> = 0, one equation is a combination of the others and can be crossed out. Call one unknown t (here z = t), move the t-terms to the right-hand side, and solve the remaining two equations for x and y in terms of t. Write the answer as (x, y, z) = (…, …, t).',
  () => {
    let r1, r2, al, be, D, A;
    do { r1 = [nz(-3, 3), ri(-3, 3), nz(-3, 4)]; r2 = [ri(-3, 3), nz(-3, 3), ri(-3, 4)]; al = nz(-1, 2); be = nz(-1, 2); D = r1[0] * r2[1] - r1[1] * r2[0]; A = [r1, r2, r1.map((x, j) => al * x + be * r2[j])]; }
    while (![1, 2, 3].includes(Math.abs(D)) || A[2].some(x => Math.abs(x) > 7));
    const b = [ri(-5, 7), ri(-5, 7)]; b.push(al * b[0] + be * b[1]);
    const vn = ['x', 'y', 'z'], lhs = [0, 1].map(i => terms([[A[i][0], I('x')], [A[i][1], I('y')]]));
    const x0 = new Q(b[0] * r2[1] - r1[1] * b[1], D), x1 = new Q(-r1[2] * r2[1] + r1[1] * r2[2], D), y0 = new Q(r1[0] * b[1] - r2[0] * b[0], D), y1 = new Q(-r1[0] * r2[2] + r2[0] * r1[2], D);
    const two = sys([0, 1].map(i => `${lhs[i]} = ${terms([[b[i], ''], [-A[i][2], I('t')]])}`)), tf = { after: `·${I('t')}`, w: 4 };
    return { v: { A, b }, q: `The system ${sys(A.map((r, i) => eqn(r, vn, b[i])))} has Δ = Δ<sub>x</sub> = Δ<sub>y</sub> = Δ<sub>z</sub> = 0, so it has infinitely many solutions. Find all of them using the parameter ${I('z')} = ${I('t')}.`,
      steps: [
        st('Put z = t and move the t-terms to the right. Right-hand sides of the first two equations (a negative number goes into the box with its minus):', [num(`${lhs[0]} =`, { w: 4 }), num('+', tf), num(`${lhs[1]} =`, { w: 4, br: true }), num('+', tf)], [b[0], -A[0][2], b[1], -A[1][2]], `Equation 1 is ${eqn(A[0], vn, b[0])}. With z = t, the term with t changes sign when it crosses to the right. The third equation can be crossed out: it is a combination of the first two.`, two),
        st('Solve these two equations for x and y in terms of t (elimination, or Cramer’s rule carrying t along):', [num(`${I('x')} =`, { w: 4 }), num('+', tf), num(`${I('y')} =`, { w: 4, br: true }), num('+', tf)], [x0, x1, y0, y1], `The determinant of the left-hand sides is ${H(D)}. x = Δ<sub>x</sub>/${P(D)}, with the right-hand sides put in the x-column; the same for y.`, `(${I('x')}, ${I('y')}, ${I('z')}) = (${terms([[x0, ''], [x1, I('t')]])}; &nbsp;${terms([[y0, ''], [y1, I('t')]])}; &nbsp;${I('t')}), ${I('t')} ∈ ℝ`)
      ]
    };
  });

reg('syskind', 5, 'System with a parameter k', 'Sistema su parametru k',
  'Compute the determinant as an expression in k. Where det ≠ 0 the system has exactly one solution. At the k that makes det = 0, compare the two equations: if one is a multiple of the other (right-hand sides included) there are infinitely many solutions, otherwise none.',
  () => {
    const a = nz(-4, 5), b = nz(-3, 4), m = pick([2, 3, -2, -1, 2]), p = nz(-5, 6), d = m * b, k0 = m * a, inf = Math.random() < 0.5, q = m * p + (inf ? 0 : nz(-3, 3));
    const x1 = sub('x', 1), x2 = sub('x', 2);
    return { v: { a, b, d, p, q, inf }, q: `For which ${I('k')} does the system have one solution, none, or infinitely many? ${sys([`${terms([[a, x1], [b, x2]])} = ${H(p)}`, `${terms([[1, I('k') + x1], [d, x2]])} = ${H(q)}`])}`,
      steps: [
        st(`The determinant ${D([[a, b], [I('k'), d]])} has the form:`, [num('det ='), num(`${MIN}`, { after: `·${I('k')}` })], [a * d, b], 'ad − bc with c = k.', `det = ${P(a)}·${P(d)} − ${P(b)}·${I('k')} = ${H(a * d)} − ${P(b)}${I('k')}`),
        st('For which k is the determinant zero?', [num(`${I('k')} =`)], [k0], `Solve ${H(a * d)} − ${P(b)}k = 0.`, `${I('k')} = ${H(a * d)}/${P(b)} = ${H(k0)}. For every other k there is exactly one solution.`),
        st(`What happens at ${I('k')} = ${H(k0)}?`, [choice(['No solutions', 'Infinitely many solutions'])], [inf ? 1 : 0], `With k = ${H(k0)} the left side of equation 2 is ${H(m)} times the left side of equation 1. Is the right side also ${H(m)} times ${H(p)}?`, `${H(m)}·${P(p)} = ${H(m * p)}; the right side is ${H(q)}. ${inf ? 'The equations are the same line: infinitely many solutions.' : 'Parallel lines that never meet: no solutions.'}`)
      ]
    };
  });

reg('inv3', 5, 'Solve by the inverse-matrix method', 'Atvirkštinės matricos metodas 3×3',
  'AX = B gives X = A<sup>−1</sup>B. For a 3×3 matrix: (1) det A; (2) the matrix of cofactors A<sub>ij</sub> = (−1)<sup>i+j</sup>M<sub>ij</sub>; (3) transpose it; (4) A<sup>−1</sup> = (1/det A)·(transposed cofactor matrix).',
  () => {
    let A; do { A = rm(3, 3, -2, 3); } while (![1, 2, 3, 4, 5, 6].includes(Math.abs(det(A))));
    const x = [ri(-3, 5), ri(-3, 5), ri(-3, 5)], b = A.map(r => r.reduce((s, c, j) => s + c * x[j], 0)), d = det(A), vn = ['x', 'y', 'z'];
    const C = A.map((r, i) => r.map((_, j) => ((i + j) % 2 ? -1 : 1) * det2(minorM(A, i, j)))), adj = T(C), ab = mmul(adj, b.map(v => [v]));
    return { v: { A, b }, q: `Solve by the inverse-matrix method: ${sys(A.map((r, i) => eqn(r, vn, b[i])))}<br>Here ${E('A', M(A))}, ${E('B', V(b))}.`,
      steps: [
        st('Determinant:', [num('det A =')], [d], 'Triangle rule.', `det A = ${detSol(A)}`),
        st('Matrix of cofactors (each entry: cross out its row and column, take the 2×2 determinant, apply the sign pattern + − + / − + − / + − +):', [mat(3, 3, `${I('C')} =`)], [C], `Example: ${sub('A', 11)} = +${D(minorM(A, 0, 0))}, ${sub('A', 12)} = −${D(minorM(A, 0, 1))}.`, E('C', M(C))),
        st('Transpose it:', [mat(3, 3, `${I('C')}<sup>T</sup> =`)], [adj], 'Rows become columns.', `${I('C')}<sup>T</sup> = ${M(adj)}, so ${I('A')}<sup>−1</sup> = ${FR(1, P(d))}·${M(adj)}`),
        st(`${I('X')} = ${I('A')}<sup>−1</sup>${I('B')} = ${FR(1, P(d))}·${I('C')}<sup>T</sup>${I('B')}:`, [mat(3, 1, `${I('X')} =`)], [x.map(v => [v])], `First multiply Cᵀ by B, then divide each entry by ${H(d)}.`, `${I('C')}<sup>T</sup>${I('B')} = ${M(ab)}, divided by ${H(d)}: ${I('X')} = ${V(x)}`)
      ]
    };
  });
