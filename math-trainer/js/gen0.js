/* ================= TOPIC 1 — coordinate systems ================= */
const Bv = s => `<b>${s}</b>`;
const rv = v => '<span class="nw">[' + v.map(H).join('; ') + ']</span>';
const pt = v => '<span class="nw">(' + v.map(H).join('; ') + ')</span>';
const rt2 = n => { const r = Math.round(Math.sqrt(n)); return r * r === n ? r : { v: Math.sqrt(n), s: `sqrt(${n})`, h: `√${n}` }; };
const overRt = (d, n) => { const r = Math.round(Math.sqrt(n)); if (r * r === n) return new Q(d, r); if (d === 0) return 0; return { v: d / Math.sqrt(n), s: `${d}/sqrt(${n})`, h: (d < 0 ? MIN : '') + FR(Math.abs(d), '√' + n) }; };
const dotv = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const n2 = a => dotv(a, a);
const dots = (a, b) => a.map((x, i) => `${P(x)}·${P(b[i])}`).join(' + ');
const sqs = a => a.map(x => `${P(x)}²`).join(' + ');
const AX = ['x', 'y', 'z'], PLANE = ['yz', 'xz', 'xy'];       // plane i is the one where coordinate i equals 0
const ROOTS = 'Roots can be typed as sqrt(74).';

reg('closest', 1, 'Points and coordinate planes', 'Taškai ir koordinačių plokštumos',
  'The xy-plane is z = 0, the xz-plane is y = 0, the yz-plane is x = 0. The distance from a point to a coordinate plane is the absolute value of the one coordinate that is <b>missing</b> from the plane’s name.',
  () => {
    const c1 = ri(0, 2), c2 = pick([0, 1, 2].filter(i => i !== c1)), zi = ri(0, 2), N = ['P', 'Q', 'R']; let pts;
    do { pts = [0, 1, 2].map(() => [nz(-8, 8), nz(-8, 8), nz(-8, 8)]); pts[zi][c2] = 0; } while (new Set(pts.map(p => Math.abs(p[c1]))).size < 3);
    const d = pts.map(p => Math.abs(p[c1])), near = d.indexOf(Math.min(...d));
    return { v: { pts, c1, c2 }, q: `Take the points ${pts.map((p, i) => I(N[i]) + pt(p)).join(', ')}.`,
      steps: [
        st(`Which point is closest to the ${I(PLANE[c1])}-plane?`, [choice(N.map(I))], [near], `The ${PLANE[c1]}-plane is ${AX[c1]} = 0, so compare the sizes of the ${AX[c1]}-coordinates.`, `|${AX[c1]}| is ${d.join(', ')} for P, Q, R. The smallest belongs to ${N[near]}.`),
        st(`Which point lies in the ${I(PLANE[c2])}-plane?`, [choice(N.map(I))], [zi], `A point lies in the ${PLANE[c2]}-plane when its ${AX[c2]}-coordinate is 0.`, `${N[zi]} has ${AX[c2]} = 0.`)
      ]
    };
  });

reg('distpt', 1, 'Distance to a plane or an axis', 'Atstumas iki plokštumos ir ašies',
  'To a coordinate plane: the absolute value of the missing coordinate (to the xy-plane it is |z|). To a coordinate axis: the root of the sum of squares of the <b>other two</b> coordinates (to the x-axis it is √(y² + z²)).',
  () => {
    const p = [nz(-9, 9), nz(-9, 9), nz(-9, 9)], pl = ri(0, 2), ax = ri(0, 2), o = [0, 1, 2].filter(i => i !== ax), s = p[o[0]] ** 2 + p[o[1]] ** 2;
    return { v: { p, pl, ax }, q: `Find the distance from the point ${pt(p)}:`,
      steps: [
        st(`to the ${I(PLANE[pl])}-plane`, [num('distance =')], [Math.abs(p[pl])], `The ${PLANE[pl]}-plane is ${AX[pl]} = 0. How far is the ${AX[pl]}-coordinate from 0?`, `|${H(p[pl])}| = ${Math.abs(p[pl])}`),
        st(`to the ${I(AX[ax])}-axis. ${ROOTS}`, [num('distance =')], [rt2(s)], `The nearest point on the ${AX[ax]}-axis keeps ${AX[ax]} and has the other two coordinates 0. So only ${AX[o[0]]} and ${AX[o[1]]} count.`, `√(${P(p[o[0]])}² + ${P(p[o[1]])}²) = √${s}${Number.isInteger(Math.sqrt(s)) ? ' = ' + Math.sqrt(s) : ' ≈ ' + H(Math.round(Math.sqrt(s) * 100) / 100)}`)
      ]
    };
  });

reg('sphere', 1, 'Sphere: centre and radius', 'Sferos centras ir spindulys',
  'If the squares have a coefficient, divide the whole equation by it first. Move every variable term to the left. Complete the square for each variable: x² + px = (x + p/2)² − (p/2)². Collect the numbers on the right: the result is (x − a)² + (y − b)² + (z − c)² = r², with centre (a, b, c) and radius r.',
  () => {
    let c; do { c = [ri(-6, 6), ri(-6, 6), ri(-6, 6)]; } while (c.filter(x => x).length < 2);
    const r = ri(1, 7), k = pick([1, 1, 1, 2, 3]), G = r * r - n2(c), h0 = c.findIndex(x => x), hv = AX[h0];
    const lhs = terms([[k, pw('x', 2)], [k, pw('y', 2)], [k, pw('z', 2)], ...c.map((v, i) => [-2 * v * k, I(AX[i])])]);
    const sq = c.map((v, i) => v === 0 ? pw(AX[i], 2) : `(${lin(v, AX[i])})<sup>2</sup>`).join(' + ');
    return { v: { c, r, k, G }, q: `The equation ${lhs} = ${H(k * G)} describes a sphere.`,
      steps: [
        st(`${k > 1 ? `Divide by ${k}, then complete` : 'Complete'} the square in each variable. Centre:`, AX.map(a => num(`${I(a)}<sub>0</sub> =`, { w: 4 })), c, `${hv}² ${c[h0] > 0 ? '−' : '+'} ${Math.abs(2 * c[h0])}${hv} = (${hv} ${c[h0] > 0 ? '−' : '+'} ${Math.abs(c[h0])})² − ${c[h0] * c[h0]}. Each centre coordinate is half of that variable’s coefficient, with the opposite sign.`, `Centre (${c.map(H).join('; ')})`),
        st('Right-hand side after moving the constants over:', [num(`${sq} =`)], [r * r], `${H(G)} + ${c.map(v => v * v).join(' + ')}`, `${sq} = ${H(G)} + ${c.map(v => v * v).join(' + ')} = ${r * r}`),
        st('Radius:', [num(`${I('r')} =`)], [r], 'The right-hand side is r².', `${I('r')} = √${r * r} = ${r}`)
      ]
    };
  });

reg('touch', 1, 'Sphere touching a coordinate plane', 'Sfera, liečianti plokštumą',
  'A sphere touches a plane when its radius equals the distance from the centre to that plane. For a coordinate plane that distance is the absolute value of the missing coordinate.',
  () => {
    let c; do { c = [nz(-7, 7), nz(-7, 7), nz(-7, 7)]; } while (new Set(c.map(Math.abs)).size < 3);
    const pl = ri(0, 2), r = Math.abs(c[pl]), sq = c.map((v, i) => `(${lin(v, AX[i])})<sup>2</sup>`).join(' + ');
    return { v: { c, pl }, q: `A sphere has its centre at ${pt(c)} and touches the ${I(PLANE[pl])}-plane.`,
      steps: [
        st('Its radius:', [num(`${I('r')} =`)], [r], `Distance from the centre to the ${PLANE[pl]}-plane (${AX[pl]} = 0).`, `${I('r')} = |${H(c[pl])}| = ${r}`),
        st('Its equation:', [num(`${sq} =`)], [r * r], 'The right-hand side is r².', `${sq} = ${r * r}`)
      ]
    };
  });

reg('dist3', 1, 'Distance between two points', 'Atstumas tarp dviejų taškų',
  'Subtract coordinate by coordinate (end minus start), square the three differences, add them, take the root: √(Δx² + Δy² + Δz²).',
  () => {
    const a = [ri(-5, 6), ri(-5, 6), ri(-5, 6)]; let b; do { b = [ri(-5, 6), ri(-5, 6), ri(-5, 6)]; } while (b.every((x, i) => x === a[i]));
    const d = b.map((x, i) => x - a[i]), s = n2(d);
    return { v: { a, b }, q: `A point moves from ${I('A')}${pt(a)} at time ${I('t')} = 0 to ${I('B')}${pt(b)} at ${I('t')} = 2.`,
      steps: [
        st('Change in each coordinate (end minus start):', AX.map(v => num(`Δ${I(v)} =`, { w: 4 })), d, 'A negative change means the coordinate decreased.', AX.map((v, i) => `Δ${I(v)} = ${H(b[i])} − ${P(a[i])} = ${H(d[i])}`).join(', &nbsp;')),
        st(`Distance between the two positions. ${ROOTS}`, [num('distance =')], [rt2(s)], '√(Δx² + Δy² + Δz²)', `√(${sqs(d)}) = √${s}${Number.isInteger(Math.sqrt(s)) ? ' = ' + Math.sqrt(s) : ' ≈ ' + H(Math.round(Math.sqrt(s) * 100) / 100)}`)
      ]
    };
  });

const SHAPES = ['A plane', 'Half of space, on one side of a plane', 'A line', 'A circle', 'A sphere (surface only)', 'A solid ball', 'A cylinder'];
reg('describe', 1, 'What does the equation describe in space?', 'Ką aprašo lygtis erdvėje ℝ³?',
  'In ℝ³ a variable that is not mentioned is free. One linear equation gives a plane; an inequality gives everything on one side of it. Two equations together give the intersection (two planes meet in a line; a cylinder and a plane meet in a circle). x² + y² + z² = r² is a sphere, with ≤ it is the solid ball, and x² + y² = r² alone is a cylinder around the z-axis.',
  () => {
    const c = nz(-6, 8), r = ri(2, 5), [u, v, w] = shuffle(AX), bank = [
      [`${I(u)} = ${H(c)}`, 0, `Every point with ${u} = ${H(c)}; the other two coordinates are free. A plane parallel to the ${[u, v, w].filter(a => a !== u).sort().join('')}-plane.`],
      [`${I('x')} + ${I('y')} = ${Math.abs(c)}`, 0, 'One linear equation; z is free. A vertical plane standing on the line x + y = ' + Math.abs(c) + ' of the xy-plane.'],
      [`${I(u)} &lt; ${H(c)}`, 1, `All points on one side of the plane ${u} = ${H(c)}.`],
      [`${I(u)} = ${H(c)}, &nbsp; ${I(v)} = ${H(r)}`, 2, `Two planes intersect in a line; only ${w} is free.`],
      [`${pw('x', 2)} + ${pw('y', 2)} = ${r * r}, &nbsp; ${I('z')} = ${H(c)}`, 3, `A circle of radius ${r} at height z = ${H(c)}, centre (0; 0; ${H(c)}).`],
      [`${pw('x', 2)} + ${pw('y', 2)} + ${pw('z', 2)} = ${r * r}`, 4, `All points at distance exactly ${r} from the origin.`],
      [`${pw('x', 2)} + ${pw('y', 2)} + ${pw('z', 2)} ≤ ${r * r - 1}`, 5, `All points at distance at most √${r * r - 1} from the origin: the surface and everything inside.`],
      [`${pw('x', 2)} + ${pw('y', 2)} = ${r * r}`, 6, `z is free, so the circle of radius ${r} is repeated at every height: a cylinder around the z-axis.`]];
    return { v: {}, q: `Describe the set of points in ℝ<sup>3</sup> given by each condition.`, steps: shuffle(bank).slice(0, 3).map(([h, a, why]) => st(`<span class="bigq">${h}</span>`, [choice(SHAPES)], [a], 'Which variables are free? Is it an equation or an inequality? One condition or two?', why)) };
  });

/* ================= TOPIC 2 — vectors, dot product ================= */
reg('vecops', 2, 'Vector arithmetic and length', 'Veiksmai su vektoriais, ilgis',
  'Add, subtract and multiply by numbers component by component. Length: |a| = √(a₁² + a₂² + a₃²).',
  () => {
    const n = pick([2, 3]), a = n === 2 && Math.random() < 0.5 ? pick([[3, -4], [5, -12], [-6, 8], [8, 15], [-5, 12], [4, 3]]) : rm(1, n, -6, 7)[0]; let b; do { b = rm(1, n, -6, 7)[0]; } while (b.every((x, i) => x === a[i]));
    const al = pick([2, 2, 3, -1]), be = pick([3, 3, -2, 2]), sum = a.map((x, i) => x + b[i]), lc = a.map((x, i) => al * x + be * b[i]), df = a.map((x, i) => x - b[i]);
    const ex = terms([[al, Bv('a')], [be, Bv('b')]]);
    return { v: { a, b, al, be }, q: `Let ${Bv('a')} = ${rv(a)} and ${Bv('b')} = ${rv(b)}.`,
      steps: [
        st('Sum:', [mat(1, n, `${Bv('a')} + ${Bv('b')} =`)], [[sum]], 'Add matching components.', `${Bv('a')} + ${Bv('b')} = ${rv(sum)}`),
        st('Combination:', [mat(1, n, `${ex} =`)], [[lc]], `Each component: ${al}·(component of a) ${be < 0 ? '−' : '+'} ${Math.abs(be)}·(component of b).`, `${ex} = ${rv(lc)}`),
        st(`Length. ${ROOTS}`, [num(`|${Bv('a')}| =`)], [rt2(n2(a))], 'Root of the sum of squared components.', `|${Bv('a')}| = √(${sqs(a)}) = ${H(rt2(n2(a)))}`),
        st('Length of the difference:', [num(`|${Bv('a')} − ${Bv('b')}| =`)], [rt2(n2(df))], `First ${Bv('a')} − ${Bv('b')} = ${rv(df)}, then its length.`, `${Bv('a')} − ${Bv('b')} = ${rv(df)}, length √${n2(df)}${Number.isInteger(Math.sqrt(n2(df))) ? ' = ' + Math.sqrt(n2(df)) : ''}`)
      ]
    };
  });

reg('dot', 2, 'Dot product', 'Skaliarinė sandauga',
  'a·b = a₁b₁ + a₂b₂ + a₃b₃: multiply matching components and add. The result is a number. In i, j, k notation the coefficients are the components (a missing letter means 0).',
  () => {
    if (Math.random() < 0.4) {
      const a = [nz(-4, 5), ri(-3, 4), ri(-3, 4)], b = [ri(-3, 4), nz(-4, 5), ri(-3, 4)], ijk = v => terms(v.map((x, i) => [x, Bv('ijk'[i])]));
      return { v: { a, b }, q: `Compute ${Bv('a')}·${Bv('b')} for ${Bv('a')} = ${ijk(a)} and ${Bv('b')} = ${ijk(b)}.`, steps: [st('', [num(`${Bv('a')}·${Bv('b')} =`)], [dotv(a, b)], `As components: ${Bv('a')} = ${rv(a)}, ${Bv('b')} = ${rv(b)}.`, `${dots(a, b)} = ${H(dotv(a, b))}`)] };
    }
    const d = pick([2, 3, 4]), a = [nz(-5, 6), nz(-5, 6), new Q(pick([1, -1, 3]), d)], b = [nz(-6, 7), nz(-6, 7), d * nz(-3, 3)], r = a[0] * b[0] + a[1] * b[1] + a[2].n * b[2] / a[2].d;
    return { v: { a: a.map(val), b }, q: `Compute ${Bv('a')}·${Bv('b')} for ${Bv('a')} = ${rv(a)} and ${Bv('b')} = ${rv(b)}.`, steps: [st('', [num(`${Bv('a')}·${Bv('b')} =`)], [r], 'Multiply first by first, second by second, third by third, then add.', `${dots(a, b)} = ${H(r)}`)] };
  });

reg('meaning', 2, 'Which expressions make sense?', 'Kurios išraiškos turi prasmę?',
  'The dot · needs a vector on both sides and gives a number. A number may multiply a vector (no dot), but a number can never be added to a vector or dotted with one. Work from the inside out and label each piece “number” or “vector”.',
  () => {
    const a = Bv('a'), b = Bv('b'), c = Bv('c'), bank = [
      [`(${a}·${b})·${c}`, false, 'a·b is a number; a number cannot be dotted with c'], [`(${a}·${b})${c}`, true, 'number times vector'], [`|${a}|(${b}·${c})`, true, 'number times number'],
      [`${a}·(${b} + ${c})`, true, 'vector dotted with vector'], [`${a}·${b} + ${c}`, false, 'number plus vector is not defined'], [`|${a}|·(${b} + ${c})`, false, '|a| is a number; it cannot be dotted with a vector'],
      [`${a}·${b} + |${c}|`, true, 'number plus number'], [`(${a} + ${b})·${c}`, true, 'vector dotted with vector'], [`${a} + ${b}·${c}`, false, 'vector plus number is not defined'], [`(${a}·${b})(${a}·${c})`, true, 'number times number']];
    let qs; do { qs = shuffle(bank).slice(0, 6); } while (qs.every(x => x[1]) || !qs.some(x => x[1]));
    return { v: {}, q: `Here ${a}, ${b}, ${c} are vectors and · is the dot product.`,
      steps: [st('Select every expression that makes sense:', [checks(qs.map(x => x[0]))], [qs.map(x => x[1])], 'For each one decide step by step whether a piece is a number or a vector.', qs.map(x => `${x[0]}: ${x[1] ? '✓' : '✗'} ${x[2]}`).join('<br>'))]
    };
  });

reg('right', 2, 'Is the triangle right-angled?', 'Ar trikampis statusis?',
  'Build the side vectors (end point minus start point). Two sides are perpendicular exactly when their dot product is 0. Check the pair of sides that meet at each vertex.',
  () => {
    const N = ['P', 'Q', 'R']; let p, sides, dp, at;
    for (;;) {
      p = [0, 1, 2].map(() => [ri(-4, 6), ri(-4, 6), ri(-5, 5)]);
      if (Math.random() < 0.65) { const u = [nz(-3, 3), nz(-3, 3), ri(-2, 2)], k = nz(-2, 2), w = pick([[u[1] * k, -u[0] * k, 0], [0, u[2] * k, -u[1] * k], [u[2] * k, 0, -u[0] * k], [u[1] * k, -u[0] * k, u[2] ? 0 : k]]); if (dotv(u, w) !== 0 || n2(w) === 0) continue; const v = ri(0, 2), o = [0, 1, 2].filter(i => i !== v); p[o[0]] = p[v].map((x, i) => x + u[i]); p[o[1]] = p[v].map((x, i) => x + w[i]); }
      sides = [[0, 1], [0, 2], [1, 2]].map(([i, j]) => p[j].map((x, k) => x - p[i][k]));      // PQ, PR, QR
      if (sides.some(s => n2(s) === 0)) continue;
      dp = [dotv(sides[0], sides[1]), -dotv(sides[0], sides[2]), dotv(sides[1], sides[2])];        // at P, Q, R
      const cr = [sides[0][1] * sides[1][2] - sides[0][2] * sides[1][1], sides[0][2] * sides[1][0] - sides[0][0] * sides[1][2], sides[0][0] * sides[1][1] - sides[0][1] * sides[1][0]];
      if (n2(cr) === 0 || p.flat().some(x => Math.abs(x) > 9)) continue;
      at = dp.indexOf(0); break;
    }
    const ar = s => `<span class="bar">${s}</span>`, nm = ['PQ', 'PR', 'QR'];
    return { v: { p }, q: `A triangle has vertices ${p.map((x, i) => I(N[i]) + pt(x)).join(', ')}.`,
      steps: [
        st('Side vectors (end minus start):', nm.map(s => mat(1, 3, `${ar(I(s))} =`)), sides.map(s => [s]), 'For PQ subtract the coordinates of P from those of Q.', nm.map((s, i) => `${ar(I(s))} = ${rv(sides[i])}`).join(', &nbsp;')),
        st('Dot product of the two sides meeting at each vertex:', [num(`at ${I('P')}: ${ar(I('PQ'))}·${ar(I('PR'))} =`, { w: 4 }), num(`at ${I('Q')}: ${ar(I('QP'))}·${ar(I('QR'))} =`, { w: 4 }), num(`at ${I('R')}: ${ar(I('RP'))}·${ar(I('RQ'))} =`, { w: 4 })], dp, 'QP is PQ with every sign flipped, and likewise RP = −PR, RQ = −QR.', `at P: ${H(dp[0])}, &nbsp; at Q: ${H(dp[1])}, &nbsp; at R: ${H(dp[2])}`),
        st('Conclusion:', [choice(['Right angle at P', 'Right angle at Q', 'Right angle at R', 'Not a right triangle'])], [at < 0 ? 3 : at], 'A zero dot product means the two sides are perpendicular.', at < 0 ? 'None of the dot products is 0, so there is no right angle.' : `The dot product at ${N[at]} is 0, so the angle at ${N[at]} is 90°.`)
      ]
    };
  });

reg('proj', 2, 'Projection of b onto a', 'Vektoriaus projekcija',
  'Scalar projection (a number): comp<sub>a</sub>b = (a·b)/|a|. Vector projection: proj<sub>a</sub>b = ((a·b)/|a|²)·a, a multiple of a. Note that |a|² is just the sum of squares, with no root.',
  () => {
    const n = pick([2, 3]); let a, b; do { a = n === 2 && Math.random() < 0.4 ? pick([[3, -4], [4, 3], [-3, 4], [0, 5], [6, 8]]) : rm(1, n, -4, 5)[0]; b = rm(1, n, -5, 6)[0]; } while (n2(a) < 2 || n2(b) === 0);
    const d = dotv(a, b), s = n2(a), pr = a.map(x => new Q(d * x, s));
    return { v: { a, b }, q: `Let ${Bv('a')} = ${rv(a)} and ${Bv('b')} = ${rv(b)}. Find the scalar projection comp<sub>${Bv('a')}</sub>${Bv('b')} and the vector projection proj<sub>${Bv('a')}</sub>${Bv('b')}.`,
      steps: [
        st('Dot product:', [num(`${Bv('a')}·${Bv('b')} =`)], [d], 'Multiply matching components and add.', `${dots(a, b)} = ${H(d)}`),
        st(`Length of ${Bv('a')}. ${ROOTS}`, [num(`|${Bv('a')}| =`)], [rt2(s)], 'Root of the sum of squares.', `√(${sqs(a)}) = ${H(rt2(s))}`),
        st('Scalar projection (type it like 1/sqrt(21) if needed):', [num(`comp<sub>${Bv('a')}</sub>${Bv('b')} =`)], [overRt(d, s)], '(a·b)/|a|', `${FR(H(d), H(rt2(s)))}${Number.isInteger(Math.sqrt(s)) ? ' = ' + H(new Q(d, Math.sqrt(s))) : ''}`),
        st('Vector projection (fractions like 9/5 are fine):', [mat(1, n, `proj<sub>${Bv('a')}</sub>${Bv('b')} =`)], [[pr]], `Multiply ${Bv('a')} by (a·b)/|a|² = ${H(d)}/${s}.`, `${H(new Q(d, s))}·${rv(a)} = ${rv(pr)}`)
      ]
    };
  });

reg('angle', 2, 'Angle between two vectors', 'Kampas tarp vektorių',
  'cos θ = (a·b)/(|a|·|b|). The sign of the dot product already tells the type of angle: positive means acute, zero means a right angle (perpendicular), negative means obtuse.',
  () => {
    const n = pick([2, 2, 3]); let a, b;
    do { a = rm(1, n, -4, 5)[0]; b = rm(1, n, -4, 5)[0]; if (Math.random() < 0.35 && n === 2) b = [a[1], -a[0]].map(x => x * nz(-2, 2)); } while (!n2(a) || !n2(b) || n2(a) * n2(b) === dotv(a, b) ** 2);
    const d = dotv(a, b), pa = n2(a), pb = n2(b);
    return { v: { a, b }, q: `Two change vectors are ${Bv('a')} = ${rv(a)} and ${Bv('b')} = ${rv(b)}. Find the angle θ between them.`,
      steps: [
        st('Dot product:', [num(`${Bv('a')}·${Bv('b')} =`)], [d], 'Multiply matching components and add.', `${dots(a, b)} = ${H(d)}`),
        st(`Lengths. ${ROOTS}`, [num(`|${Bv('a')}| =`), num(`|${Bv('b')}| =`)], [rt2(pa), rt2(pb)], 'Root of the sum of squares.', `|${Bv('a')}| = ${H(rt2(pa))}, |${Bv('b')}| = ${H(rt2(pb))}`),
        st('Cosine of the angle (type it like 3/sqrt(50) if needed):', [num('cos θ =')], [overRt(d, pa * pb)], '(a·b)/(|a|·|b|). The product of two roots is the root of the product.', `cos θ = ${FR(H(d), `√${pa}·√${pb}`)} = ${H(overRt(d, pa * pb))}`),
        st('So the angle is:', [choice(['Acute (less than 90°)', 'A right angle (the vectors are perpendicular)', 'Obtuse (more than 90°)'])], [d > 0 ? 0 : d === 0 ? 1 : 2], 'Look at the sign of cos θ.', d === 0 ? 'cos θ = 0, so θ = π/2.' : d > 0 ? 'cos θ > 0, so the angle is acute.' : 'cos θ < 0, so the angle is obtuse.')
      ]
    };
  });

reg('share', 2, 'Relative share of a desired change', 'Santykinė pokyčio dalis (genų raiška)',
  'The desired change is a vector V. A drug causes the change A. The part of A that points along V is comp<sub>V</sub>A = (A·V)/|V|. As a share of the desired change: comp<sub>V</sub>A / |V| = (A·V)/|V|². The drug with the share closer to 1 is closer to the goal.',
  () => {
    let Vv, A, Bd, s, sa, sb;
    do { Vv = [nz(-5, 9), nz(-5, 9), nz(-6, 6)]; A = [ri(-4, 6), ri(-4, 6), ri(-5, 5)]; Bd = [ri(-4, 6), ri(-4, 6), ri(-5, 5)]; s = n2(Vv); sa = dotv(A, Vv); sb = dotv(Bd, Vv); } while (sa <= 0 || sb <= 0 || sa >= s || sb >= s || sa === sb);
    return { v: { Vv, A, Bd }, q: `Researchers want to change the expression of three genes by ${sub('V', 3)} = ${rv(Vv)}. Drug A causes the change ${rv(A)} and drug B causes ${rv(Bd)}.`,
      steps: [
        st(`Size of the desired change. ${ROOTS}`, [num(`|${sub('V', 3)}| =`)], [rt2(s)], 'Root of the sum of squares.', `√(${sqs(Vv)}) = ${H(rt2(s))}`),
        st('Dot product of each drug’s vector with the desired change:', [num(`${I('A')}·${sub('V', 3)} =`), num(`${I('B')}·${sub('V', 3)} =`)], [sa, sb], 'Multiply matching components and add.', `${dots(A, Vv)} = ${sa}, &nbsp; ${dots(Bd, Vv)} = ${sb}`),
        st('Share of the desired change that each drug delivers (as fractions):', [num('drug A:'), num('drug B:')], [new Q(sa, s), new Q(sb, s)], `Scalar projection divided by |V₃|: (A·V₃)/|V₃|², and |V₃|² = ${s}.`, `A: ${FR(sa, s)} ≈ ${H(Math.round(sa / s * 100) / 100)}, &nbsp; B: ${FR(sb, s)} ≈ ${H(Math.round(sb / s * 100) / 100)}`),
        st('Which drug is closer to the desired effect?', [choice(['Drug A', 'Drug B'])], [sa > sb ? 0 : 1], 'The larger share (closer to 1) is closer to the goal.', `Drug ${sa > sb ? 'A' : 'B'} delivers the larger share.`)
      ]
    };
  });
