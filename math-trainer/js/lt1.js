/* ================= Lietuviška versija: 3–5 temos ================= */
const INV2L = 'A<sup>−1</sup> = (1/det)·[d, −b; −c, a]: pagrindinės įstrižainės elementus sukeiskite vietomis, kitų dviejų pakeiskite ženklą, viską padalykite iš determinanto. Jei det = 0, atvirkštinė matrica neegzistuoja.';
const CRAMERL = 'Δ – koeficientų matricos determinantas. Δ<sub>x</sub>: x stulpelį pakeiskite laisvųjų narių stulpeliu; analogiškai Δ<sub>y</sub> ir Δ<sub>z</sub>. Tada x = Δ<sub>x</sub>/Δ, y = Δ<sub>y</sub>/Δ, z = Δ<sub>z</sub>/Δ. Jei Δ = 0: kai visi kiti Δ lygūs 0 – be galo daug sprendinių, kai bent vienas nelygus 0 – sprendinių nėra.';

regLT('lincomb', 'Veiksmai su matricomis: αA + βBᵀ',
  'Pirmiausia transponuokite (B eilutės tampa B<sup>T</sup> stulpeliais). Kiekvieną elementą padauginkite iš skaičiaus, tada sudėkite atitinkamus elementus. Matricų matmenys turi sutapti.',
  () => {
    const A = rm(2, 3, -5, 7), B = rm(3, 2, -8, 7), a = pick([2, 2, 3, -2, 4]), b = pick([3, 3, 2, -1, -2, 5]);
    const BT = T(B), aA = A.map(r => r.map(x => a * x)), bB = BT.map(r => r.map(x => b * x)), R = aA.map((r, i) => r.map((x, j) => x + bB[i][j]));
    const ex = terms([[a, I('A')], [b, I('B') + '<sup>T</sup>']]);
    return {
      q: `Tegul ${E('A', M(A))} ir ${E('B', M(B))}. Apskaičiuokite ${ex}.`,
      steps: [
        st(`Transponuokite ${I('B')}:`, [mat(2, 3, `${I('B')}<sup>T</sup> =`)], [BT], 'Pirmoji B eilutė tampa pirmuoju Bᵀ stulpeliu, antroji – antruoju ir t. t. 3×2 matrica virsta 2×3 matrica.', `${I('B')}<sup>T</sup> = ${M(BT)}`),
        st(`Dabar padauginkite iš skaičių ir sudėkite:`, [mat(2, 3, `${ex} =`)], [R], `Kiekvienas elementas: ${a}·(A elementas) ${b < 0 ? '−' : '+'} ${Math.abs(b)}·(Bᵀ elementas) toje pačioje vietoje.`, `${a}${I('A')} = ${M(aA)}, &nbsp; ${b}${I('B')}<sup>T</sup> = ${M(bB)}, &nbsp; suma = ${M(R)}`)
      ]
    };
  });

regLT('matmul', 'Matricų daugyba',
  'Sandauga AB egzistuoja tik tada, kai A stulpelių skaičius lygus B eilučių skaičiui. Rezultato matmenys: (A eilučių skaičius) × (B stulpelių skaičius). Elementas (i, j) = A i-oji eilutė, padauginta iš B j-ojo stulpelio: atitinkami elementai sudauginami ir sudedami.',
  () => {
    const [m, n, p] = pick([[2, 2, 2], [2, 2, 2], [2, 3, 2], [3, 2, 2], [2, 2, 3], [3, 2, 3], [2, 3, 3]]);
    const A = rm(m, n, -4, 7), B = rm(n, p, -4, 8), R = mmul(A, B);
    const W = A.map(r => B[0].map((_, j) => r.map((x, k) => `${P(x)}·${P(B[k][j])}`).join(' + ')));
    return {
      q: `Tegul ${E('A', M(A))} ir ${E('B', M(B))}. Apskaičiuokite ${I('AB')}.`,
      steps: [
        st(`Kokių matmenų yra ${I('AB')}?`, [num('', { after: 'eil.', w: 3 }), num('×', { after: 'stulp.', w: 3 })], [m, p], `A yra ${m}×${n}, B yra ${n}×${p}. Vidiniai skaičiai sutampa (${n} = ${n}); išoriniai skaičiai nusako rezultato matmenis.`, `${m}×${n} kart ${n}×${p} duoda ${m}×${p}.`),
        st(`Užpildykite sandaugą:`, [mat(m, p, `${I('AB')} =`)], [R], 'Elementas (i, j): imkite A i-ąją eilutę ir B j-ąjį stulpelį, sudauginkite atitinkamus elementus ir sudėkite.', `${M(W)} = ${M(R)}`)
      ]
    };
  });

regLT('possible', 'Ar įmanoma sudauginti?',
  'Užrašykite matmenis greta: (m×n)(p×q). Sandauga egzistuoja tik tada, kai vidiniai skaičiai lygūs (n = p). Rezultato matmenys m×q.',
  () => {
    let sh, ok;
    do {
      sh = shuffle([[2, 3], [2, 2], [3, 2], [3, 3], [1, 2], [2, 1], [3, 1], [1, 3]]).slice(0, 3);
      ok = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== j) ok.push(sh[i][1] === sh[j][0]);
    } while (!ok.some(x => x) || ok.every(x => x));
    const N = ['A', 'B', 'C'], Ms = sh.map(s => rm(s[0], s[1], -6, 7));
    const pairs = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== j) pairs.push([i, j]);
    const good = pairs.filter((_, k) => ok[k]), [gi, gj] = pick(good);
    return {
      q: `Tegul ${Ms.map((m, i) => E(N[i], M(m))).join(', ')}.`,
      steps: [
        st('Pažymėkite visas sandaugas, kurias įmanoma apskaičiuoti:', [checks(pairs.map(([i, j]) => I(N[i] + N[j])))], [ok], `Matmenys: ${sh.map((s, i) => `${N[i]} yra ${s[0]}×${s[1]}`).join(', ')}. XY įmanoma, kai X stulpelių skaičius = Y eilučių skaičiui.`,
          pairs.map(([i, j], k) => `${I(N[i] + N[j])}: (${sh[i][0]}×<b>${sh[i][1]}</b>)(<b>${sh[j][0]}</b>×${sh[j][1]}) ${ok[k] ? '✓' : '✗'}`).join(' &nbsp;·&nbsp; ')),
        st(`Kokių matmenų yra ${I(N[gi] + N[gj])}?`, [num('', { after: 'eil.', w: 3 }), num('×', { after: 'stulp.', w: 3 })], [sh[gi][0], sh[gj][1]], 'Pirmosios matricos eilučių skaičius × antrosios matricos stulpelių skaičius.', `(${sh[gi][0]}×${sh[gi][1]})(${sh[gj][0]}×${sh[gj][1]}) duoda ${sh[gi][0]}×${sh[gj][1]}.`)
      ]
    };
  });

regLT('det2', 'Determinantas 2×2',
  'Matricai 2×2: pagrindinės įstrižainės sandauga minus šalutinės įstrižainės sandauga, ad − bc.',
  () => {
    const A = rm(2, 2, -7, 9);
    return { q: `Apskaičiuokite determinantą ${D(A)}.`, steps: [st('', [num('det =')], [det2(A)], 'ad − bc: sudauginkite pagrindinės įstrižainės elementus ir atimkite šalutinės įstrižainės sandaugą.', `${d2s(A)} = ${H(det2(A))}`)] };
  });

regLT('det3', 'Determinantas 3×3 (trikampių taisyklė)',
  'Trikampių (Sarrus) taisyklė: aei + bfg + cdh (trys sandaugos pagrindinės įstrižainės kryptimi) minus ceg + afh + bdi (trys sandaugos šalutinės įstrižainės kryptimi).',
  () => {
    const A = rm(3, 3, -3, 6), s = sarrus(A), p = s.pos.reduce((x, y) => x + y), n = s.neg.reduce((x, y) => x + y);
    return {
      q: `Apskaičiuokite determinantą ${D(A)}.`,
      steps: [
        st('Sudėkite tris sandaugas pagrindinės įstrižainės kryptimi (aei + bfg + cdh):', [num('suma =')], [p], 'Pagrindinė įstrižainė ir du jai lygiagretūs „trikampiai“.', `${s.ps} = ${H(p)}`),
        st('Sudėkite tris sandaugas šalutinės įstrižainės kryptimi (ceg + afh + bdi):', [num('suma =')], [n], 'Šalutinė įstrižainė ir du jai lygiagretūs trikampiai.', `${s.ns} = ${H(n)}`),
        st('Iš pirmosios sumos atimkite antrąją:', [num('det =')], [p - n], `${H(p)} − ${P(n)}`, `${H(p)} − ${P(n)} = ${H(p - n)}`)
      ]
    };
  });

regLT('diagram', 'Matricinė diagrama → matrica Q',
  'Sistemai n<sub>t+1</sub> = Q·n<sub>t</sub>: <b>stulpelis</b> – iš kur rodyklė išeina, <b>eilutė</b> – į kur ji ateina. Rodyklė iš B į A su svoriu 4 rašoma A eilutėje, B stulpelyje. Jei rodyklės nėra, rašome 0.',
  () => {
    const n = pick([2, 2, 3]), names = ['A', 'B', 'C'].slice(0, n); let Qm, cnt;
    do { Qm = rm(n, n, 0, 9).map(r => r.map(x => Math.random() < (n === 2 ? 0.25 : 0.45) ? 0 : (x || 1))); cnt = Qm.flat().filter(x => x).length; } while (cnt < n + 1 || cnt === n * n);
    return {
      q: `Paveikslėlyje pavaizduota matricinė diagrama, atitinkanti rekurentinių lygčių sistemą ${I('n')}<sub>t+1</sub> = ${I('Q')}${I('n')}<sub>t</sub>; būsenų tvarka: ${names.join(', ')}.<div class="fig">${diagram(Qm, names)}</div>`,
      steps: [st('Užrašykite matricą:', [mat(n, n, `${I('Q')} =`)], [Qm], 'Peržiūrėkite rodykles po vieną. Rodyklė iš būsenos j į būseną i su svoriu w: įrašykite w į i-ąją eilutę, j-ąjį stulpelį. Kilpos rašomos įstrižainėje.',
        `${sys(recEq(Qm, names))} &nbsp;⇒&nbsp; ${E('Q', M(Qm))}`)]
    };
  });

regLT('rec2mat', 'Rekurentinės lygtys → matrica',
  'Kintamuosius abiejose pusėse išdėstykite ta pačia tvarka. Matricos i-ojoje eilutėje rašomi i-osios lygties koeficientai. Jei kintamojo lygtyje nėra, jo koeficientas lygus 0.',
  () => {
    const n = pick([2, 3, 3]), names = pick([['x', 'y', 'z'], ['s', 'a', 'v'], ['p', 'k', 'm'], ['a', 'b', 'c']]).slice(0, n); let Qm;
    if (Math.random() < 0.5) {
      Qm = Array.from({ length: n }, () => Array(n).fill(0));
      for (let j = 0; j < n; j++) { const stay = pick([5, 6, 7, 8, 9]), to = pick([...Array(n).keys()].filter(i => i !== j)); Qm[j][j] = stay / 10; Qm[to][j] = (10 - stay) / 10; }
    } else { do { Qm = rm(n, n, -3, 6).map(r => r.map(x => Math.random() < 0.35 ? 0 : x)); } while (Qm.some(r => r.every(x => !x))); }
    return {
      q: `Modelis aprašomas rekurentinių lygčių sistema ${sys(recEq(Qm, names))} Užrašykite jos matricinę išraišką ${M(names.map(v => [sub(v, 't+1')]))} = ${I('Q')}${M(names.map(v => [sub(v, 't')]))}.`,
      steps: [st('', [mat(n, n, `${I('Q')} =`)], [Qm], `Stulpelių tvarka: ${names.join(', ')}. Kiekvienoje lygtyje išrašykite kiekvieno kintamojo koeficientą; jei kintamojo nėra, rašykite 0. Dešimtaines trupmenas galima rašyti 0,3 arba 0.3.`, E('Q', M(Qm)))]
    };
  });

regLT('iterate', 'Vektorių dinamika: n₁ ir n₂',
  'n<sub>1</sub> = A·n<sub>0</sub>, tada n<sub>2</sub> = A·n<sub>1</sub>. Kiekvienas žingsnis – viena matricos ir vektoriaus sandauga.',
  () => {
    const A = rm(2, 2, -1, 3), n0 = [[ri(1, 5)], [ri(1, 5)]], n1 = mmul(A, n0), n2v = mmul(A, n1);
    const w = (A, v) => M(A.map(r => [r.map((x, k) => `${P(x)}·${P(v[k][0])}`).join(' + ')]));
    return {
      q: `Tegul ${I('n')}<sub>t+1</sub> = ${I('A')}${I('n')}<sub>t</sub>, kai ${E('A', M(A))} ir ${I('n')}<sub>0</sub> = ${M(n0)}.`,
      steps: [
        st('Vienas žingsnis:', [mat(2, 1, `${I('n')}<sub>1</sub> =`)], [n1], 'Pirmoji A eilutė, padauginta iš n₀, duoda pirmąjį elementą, antroji eilutė – antrąjį.', `${w(A, n0)} = ${M(n1)}`),
        st('Dar vienas žingsnis:', [mat(2, 1, `${I('n')}<sub>2</sub> =`)], [n2v], 'Padauginkite A iš ką tik gauto vektoriaus.', `${w(A, n1)} = ${M(n2v)}`)
      ]
    };
  });

regLT('inverse2', 'Atvirkštinė matrica 2×2', INV2L,
  () => {
    const A = goodA2(-5, 7, [1, 2, 3, 4, 5, 6]), d = det2(A), ad = adj2(A), inv = inv2(A);
    return {
      q: `Raskite matricos ${E('A', M(A))} atvirkštinę matricą.`,
      steps: [
        st('Determinantas:', [num('det A =')], [d], 'ad − bc', `${d2s(A)} = ${H(d)}`),
        st('Pagrindinės įstrižainės elementus sukeiskite vietomis, kitų dviejų pakeiskite ženklą:', [mat(2, 2, '')], [ad], 'Iš [a, b; c, d] gaunama [d, −b; −c, a].', M(ad)),
        st('Kiekvieną elementą padalykite iš determinanto (trupmenas rašykite 3/4):', [mat(2, 2, `${I('A')}<sup>−1</sup> =`)], [inv], `Kiekvienas ankstesnės matricos elementas dalijamas iš ${H(d)}.`, `${I('A')}<sup>−1</sup> = ${FR(1, P(d))}·${M(ad)} = ${M(inv)}`)
      ]
    };
  });

regLT('isinverse', 'Ar matricos viena kitai atvirkštinės?',
  'Sudauginkite jas. A ir B yra viena kitai atvirkštinės tada ir tik tada, kai AB yra vienetinė matrica (įstrižainėje vienetai, kitur nuliai).',
  () => {
    const A = goodA2(-4, 7, [1, 2, 3]); let B = inv2(A); const yes = Math.random() < 0.55;
    if (!yes) { const c = shuffle([[0, 0], [0, 1], [1, 0], [1, 1]]).find(([i, j]) => B[i][j].n !== 0); B = B.map((r, i) => r.map((x, j) => i === c[0] && j === c[1] ? x.mul(-1) : x)); }
    const AB = qmul(A, B);
    return {
      q: `Nustatykite, ar matricos ${E('A', M(A))} ir ${E('B', M(B))} yra viena kitai atvirkštinės.`,
      steps: [
        st('Sudauginkite:', [mat(2, 2, `${I('AB')} =`)], [AB], 'A eilutė kart B stulpelis. Trupmenas rašykite 7/3.', `${I('AB')} = ${M(AB)}`),
        st('Ar A ir B yra viena kitai atvirkštinės?', [choice(['Taip', 'Ne'])], [yes ? 0 : 1], 'Palyginkite AB su vienetine matrica.', yes ? 'AB yra vienetinė matrica, todėl taip.' : 'AB nėra vienetinė matrica, todėl ne.')
      ]
    };
  });

regLT('singular', 'Kada matrica išsigimusi?',
  'Išsigimusi (singuliari) matrica – tokia, kurios det = 0. Užrašykite determinantą su nežinomuoju, prilyginkite jį nuliui ir išspręskite lygtį.',
  () => {
    const pos = ri(0, 3), e = [nz(-6, 9), nz(-6, 9), nz(-6, 9), nz(-6, 9)];
    const [a, b, c, d] = e;
    const sol = [new Q(b * c, d), new Q(a * d, c), new Q(a * d, b), new Q(b * c, a)][pos];
    const sh = e.map((x, k) => k === pos ? I('a') : x);
    const eq = ['a·' + P(d) + ' − ' + P(b) + '·' + P(c), P(a) + '·' + P(d) + ' − a·' + P(c), P(a) + '·' + P(d) + ' − ' + P(b) + '·a', P(a) + '·a − ' + P(b) + '·' + P(c)][pos];
    return {
      q: `Su kokia ${I('a')} reikšme matrica ${M([[sh[0], sh[1]], [sh[2], sh[3]]])} yra išsigimusi (singuliari)?`,
      steps: [st('', [num(`${I('a')} =`)], [sol], `Determinantą prilyginkite nuliui: ${eq} = 0.`, `${eq} = 0 &nbsp;⇒&nbsp; ${I('a')} = ${H(sol)}`)]
    };
  });

regLT('backstep', 'Ankstesnio sezono vektorius',
  'Jei x<sub>t+1</sub> = A·x<sub>t</sub>, tai x<sub>t</sub> = A<sup>−1</sup>·x<sub>t+1</sub>. Raskite 2×2 atvirkštinę matricą ir padauginkite ją iš žinomo vektoriaus.',
  () => {
    const A = goodA2(-3, 6, [1, 2, 4, 5]), x = [[ri(-3, 6)], [nz(-3, 6)]], y = mmul(A, x), d = det2(A), inv = inv2(A);
    return {
      q: `Populiacijos vektorius nuo vieno sezono iki kito kinta pagal lygtį ${I('x')}<sub>t+1</sub> = ${M(A)}${I('x')}<sub>t</sub>. Šio sezono vektorius yra ${I('x')}<sub>t+1</sub> = ${M(y)}. Koks buvo prieš tai buvusio sezono vektorius?`,
      steps: [
        st('Matricos determinantas:', [num('det =')], [d], 'ad − bc', `${d2s(A)} = ${H(d)}`),
        st('Atvirkštinė matrica:', [mat(2, 2, `${I('A')}<sup>−1</sup> =`)], [inv], INV2L, `${FR(1, P(d))}·${M(adj2(A))} = ${M(inv)}`),
        st('Atvirkštinę matricą padauginkite iš šio sezono vektoriaus:', [mat(2, 1, `${I('x')}<sub>t</sub> =`)], [x], 'x<sub>t</sub> = A<sup>−1</sup>·x<sub>t+1</sub>', `${M(inv)}${M(y)} = ${M(x)}`)
      ]
    };
  });

regLT('minor', 'Minoras ir adjunktas',
  'Minoras M<sub>ij</sub>: išbraukite i-ąją eilutę ir j-ąjį stulpelį ir apskaičiuokite likusios matricos determinantą. Adjunktas A<sub>ij</sub> = (−1)<sup>i+j</sup>·M<sub>ij</sub>: tas pats skaičius, tik ženklas keičiamas, kai i + j nelyginis.',
  () => {
    const A = rm(3, 3, -5, 9), i = ri(0, 2), j = ri(0, 2), m = minorM(A, i, j), Mv = det2(m), sg = (i + j) % 2 ? -1 : 1, ij = `${i + 1}${j + 1}`;
    return {
      q: `Tegul ${E('A', M(A))}. Apskaičiuokite minorą ${sub('M', ij)} ir adjunktą ${sub('A', ij)}.`,
      steps: [
        st(`Minoras:`, [num(`${sub('M', ij)} =`)], [Mv], `Išbraukite ${i + 1} eilutę ir ${j + 1} stulpelį: ${M(A, { hl: (r, c) => r === i || c === j })} Likę keturi elementai sudaro 2×2 determinantą.`, `${sub('M', ij)} = ${D(m)} = ${d2s(m)} = ${H(Mv)}`),
        st(`Adjunktas:`, [num(`${sub('A', ij)} =`)], [sg * Mv], `(−1)<sup>${i + 1}+${j + 1}</sup> = ${sg > 0 ? '+1' : '−1'}`, `${sub('A', ij)} = (−1)<sup>${i + 1 + j + 1}</sup>·${P(Mv)} = ${H(sg * Mv)}`)
      ]
    };
  });

regLT('det4', 'Determinantas 4×4 (skleidimas)',
  'Pasirinkite eilutę arba stulpelį, kuriame daugiausia nulių. det = (elementas × jo adjunktas) suma toje eilutėje ar stulpelyje. Nuliai nieko neprideda, todėl 3×3 determinantų reikia tik nenuliniams elementams. Adjunkto ženklas: (−1)<sup>i+j</sup>.',
  () => {
    let A = rm(4, 4, -2, 4).map(r => r.map(x => Math.random() < 0.2 ? 0 : x)); const c = ri(0, 3), rows = shuffle([0, 1, 2, 3]).slice(0, 2).sort();
    for (let i = 0; i < 4; i++) A[i][c] = rows.includes(i) ? nz(-3, 5) : 0;
    const asRow = Math.random() < 0.4; const cof = rows.map(i => ((i + c) % 2 ? -1 : 1) * det(minorM(A, i, c))), mins = rows.map(i => minorM(A, i, c));
    const d = rows.reduce((s, i, k) => s + A[i][c] * cof[k], 0), ent = rows.map(i => A[i][c]);
    const sh = asRow ? T(A) : A, idx = i => asRow ? `${c + 1}${i + 1}` : `${i + 1}${c + 1}`, mn = k => asRow ? T(mins[k]) : mins[k];
    const stepC = k => { const i = rows[k], sg = (i + c) % 2 ? -1 : 1, s = sarrus(mn(k)); return st(`Elemento ${H(ent[k])} adjunktas:`, [num(`${sub('A', idx(i))} = ${sg > 0 ? '+' : MIN}${D(mn(k))} =`)], [cof[k]], `Apskaičiuokite 3×3 determinantą trikampių taisykle, tada pritaikykite ženklą (${sg > 0 ? '+' : '−'}).`, `${D(mn(k))} = (${s.ps}) − (${s.ns}) = ${H(det(mins[k]))}, todėl ${sub('A', idx(i))} = ${H(cof[k])}`); };
    return {
      q: `Apskaičiuokite determinantą ${D(sh, { hl: (i, j) => (asRow ? i : j) === c })} skleisdami pagal ${c + 1} ${asRow ? 'eilutę' : 'stulpelį'} (ten yra du nuliai).`,
      steps: [stepC(0), stepC(1),
      st('Sudėkite: kiekvienas elementas, padaugintas iš savo adjunkto.', [num('det =')], [d], `${P(ent[0])}·${sub('A', idx(rows[0]))} + ${P(ent[1])}·${sub('A', idx(rows[1]))}`, `${P(ent[0])}·${P(cof[0])} + ${P(ent[1])}·${P(cof[1])} = ${H(d)}`)]
    };
  });

regLT('cramer2', 'Kramerio metodas, 2 nežinomieji', CRAMERL,
  () => {
    let A; do { A = rm(2, 2, -5, 6); } while (!det2(A) || Math.abs(det2(A)) > 30 || A.flat().some(x => !x));
    const b = [nz(-9, 9), ri(-9, 9)], d = det2(A), A1 = repCol(A, 0, b), A2 = repCol(A, 1, b), d1 = det2(A1), dd2 = det2(A2);
    return {
      q: `Išspręskite tiesinių lygčių sistemą Kramerio metodu: ${sys(A.map((r, i) => eqn(r, ['x', 'y'], b[i])))}`,
      steps: [
        st('Pagrindinis determinantas:', [num('Δ =')], [d], `Δ = ${D(A)}`, `Δ = ${D(A)} = ${d2s(A)} = ${H(d)}`),
        st('Po vieną stulpelį pakeiskite laisvųjų narių stulpeliu:', [num(`Δ<sub>x</sub> = ${D(A1)} =`), num(`Δ<sub>y</sub> = ${D(A2)} =`)], [d1, dd2], 'Dar du 2×2 determinantai: ad − bc.', `Δ<sub>x</sub> = ${d2s(A1)} = ${H(d1)}, &nbsp; Δ<sub>y</sub> = ${d2s(A2)} = ${H(dd2)}`),
        st('Padalykite:', [num(`${I('x')} =`), num(`${I('y')} =`)], [new Q(d1, d), new Q(dd2, d)], 'x = Δ<sub>x</sub>/Δ, y = Δ<sub>y</sub>/Δ. Galima rašyti trupmenas.', `${I('x')} = ${FR(H(d1), H(d))} = ${H(new Q(d1, d))}, &nbsp; ${I('y')} = ${FR(H(dd2), H(d))} = ${H(new Q(dd2, d))}`)
      ]
    };
  });

regLT('cramer3', 'Kramerio metodas, 3 nežinomieji', CRAMERL,
  () => {
    let A; do { A = rm(3, 3, -3, 4); } while (!det(A) || Math.abs(det(A)) > 30);
    const x = [ri(-4, 6), ri(-4, 6), ri(-4, 6)], b = A.map(r => r.reduce((s, c, j) => s + c * x[j], 0)), d = det(A), As = [0, 1, 2].map(j => repCol(A, j, b)), ds = As.map(det), vn = ['x', 'y', 'z'];
    return {
      q: `Išspręskite tiesinių lygčių sistemą Kramerio metodu: ${sys(A.map((r, i) => eqn(r, vn, b[i])))}`,
      steps: [
        st('Pagrindinis determinantas:', [num(`Δ = ${D(A)} =`)], [d], 'Trikampių taisyklė: aei + bfg + cdh − ceg − afh − bdi.', `Δ = ${detSol(A)}`),
        ...[0, 1, 2].map(j => st(`Laisvųjų narių stulpelį įrašykite vietoje ${vn[j]} stulpelio:`, [num(`Δ<sub>${vn[j]}</sub> = ${D(As[j], { hl: (r, c) => c === j })} =`)], [ds[j]], 'Ta pati trikampių taisyklė šiai matricai.', `Δ<sub>${vn[j]}</sub> = ${detSol(As[j])}`)),
        st('Kiekvieną padalykite iš Δ:', vn.map(v => num(`${I(v)} =`)), x, `x = Δ<sub>x</sub>/Δ = ${H(ds[0])}/${P(d)} ir t. t.`, `(${I('x')}, ${I('y')}, ${I('z')}) = (${x.map(H).join('; ')})`)
      ]
    };
  });

regLT('cramer0', 'Kai Δ = 0: sprendinių nėra ar be galo daug?', CRAMERL,
  () => {
    let A, r1, r2, al, be;
    do { r1 = [nz(-2, 3), ri(-2, 3), ri(-2, 3)]; r2 = [ri(-2, 3), nz(-2, 3), ri(-2, 3)]; al = nz(-1, 2); be = nz(-1, 2); A = [r1, r2, r1.map((x, j) => al * x + be * r2[j])]; }
    while (r1[0] * r2[1] - r1[1] * r2[0] === 0 || A[2].some(x => Math.abs(x) > 6));
    const inf = Math.random() < 0.5, b = [ri(-4, 6), ri(-4, 6)]; b.push(al * b[0] + be * b[1] + (inf ? 0 : nz(-2, 2)));
    const As = [0, 1, 2].map(j => repCol(A, j, b)), ds = As.map(det), vn = ['x', 'y', 'z'];
    return {
      q: `Ištirkite tiesinių lygčių sistemą ${sys(A.map((r, i) => eqn(r, vn, b[i])))}`,
      steps: [
        st('Pagrindinis determinantas:', [num(`Δ = ${D(A)} =`)], [0], 'Trikampių taisyklė.', `Δ = ${detSol(A)}`),
        st('Δ = 0, todėl vienintelio sprendinio nėra. Apskaičiuokite kitus tris determinantus:', vn.map((v, j) => num(`Δ<sub>${v}</sub> =`)), ds, `Stulpelius po vieną pakeiskite laisvųjų narių stulpeliu (${b.join('; ')}): ` + As.map((a, j) => `Δ<sub>${vn[j]}</sub> = ${D(a)}`).join(', '), ds.map((d, j) => `Δ<sub>${vn[j]}</sub> = ${H(d)}`).join(', ')),
        st('Kiek sprendinių turi sistema?', [choice(['Sprendinių nėra', 'Vienintelis sprendinys', 'Be galo daug sprendinių'])], [inf ? 2 : 0], 'Δ = 0 ir visi trys kiti lygūs 0 → be galo daug sprendinių. Δ = 0 ir bent vienas kitas nelygus 0 → sprendinių nėra.', inf ? 'Visi keturi determinantai lygūs 0: be galo daug sprendinių (parametrizuojame z = t).' : 'Δ = 0, bet ne visi kiti lygūs 0: sprendinių nėra.')
      ]
    };
  });

regLT('syskind', 'Sistema su parametru k',
  'Apskaičiuokite determinantą kaip reiškinį su k. Kai det ≠ 0, sistema turi vienintelį sprendinį. Su ta k reikšme, kai det = 0, palyginkite abi lygtis: jei viena yra kitos kartotinis (įskaitant dešiniąsias puses), sprendinių be galo daug, kitu atveju jų nėra.',
  () => {
    const a = nz(-4, 5), b = nz(-3, 4), m = pick([2, 3, -2, -1, 2]), p = nz(-5, 6), d = m * b, k0 = m * a, inf = Math.random() < 0.5, q = m * p + (inf ? 0 : nz(-3, 3));
    const x1 = sub('x', 1), x2 = sub('x', 2);
    return {
      q: `Su kokiomis ${I('k')} reikšmėmis tiesinių lygčių sistema turi vienintelį sprendinį, neturi sprendinių arba turi be galo daug sprendinių? ${sys([`${terms([[a, x1], [b, x2]])} = ${H(p)}`, `${terms([[1, I('k') + x1], [d, x2]])} = ${H(q)}`])}`,
      steps: [
        st(`Determinantas ${D([[a, b], [I('k'), d]])} turi pavidalą:`, [num('det ='), num(`${MIN}`, { after: `·${I('k')}` })], [a * d, b], 'ad − bc, kai c = k.', `det = ${P(a)}·${P(d)} − ${P(b)}·${I('k')} = ${H(a * d)} − ${P(b)}${I('k')}`),
        st('Su kokia k reikšme determinantas lygus nuliui?', [num(`${I('k')} =`)], [k0], `Išspręskite ${H(a * d)} − ${P(b)}k = 0.`, `${I('k')} = ${H(a * d)}/${P(b)} = ${H(k0)}. Su visomis kitomis k reikšmėmis sistema turi vienintelį sprendinį.`),
        st(`Kas nutinka, kai ${I('k')} = ${H(k0)}?`, [choice(['Sprendinių nėra', 'Be galo daug sprendinių'])], [inf ? 1 : 0], `Kai k = ${H(k0)}, antrosios lygties kairioji pusė lygi pirmosios lygties kairiajai pusei, padaugintai iš ${H(m)}. Ar dešinioji pusė taip pat lygi ${H(m)}·${P(p)}?`, `${H(m)}·${P(p)} = ${H(m * p)}; dešinioji pusė lygi ${H(q)}. ${inf ? 'Lygtys proporcingos (ta pati tiesė): be galo daug sprendinių.' : 'Tiesės lygiagrečios ir nesikerta: sprendinių nėra.'}`)
      ]
    };
  });

regLT('inv3', 'Atvirkštinės matricos metodas 3×3',
  'AX = B, todėl X = A<sup>−1</sup>B. Matricai 3×3: (1) det A; (2) adjunktų A<sub>ij</sub> = (−1)<sup>i+j</sup>M<sub>ij</sub> matrica; (3) ją transponuokite; (4) A<sup>−1</sup> = (1/det A)·(transponuota adjunktų matrica).',
  () => {
    let A; do { A = rm(3, 3, -2, 3); } while (![1, 2, 3, 4, 5, 6].includes(Math.abs(det(A))));
    const x = [ri(-3, 5), ri(-3, 5), ri(-3, 5)], b = A.map(r => r.reduce((s, c, j) => s + c * x[j], 0)), d = det(A), vn = ['x', 'y', 'z'];
    const C = A.map((r, i) => r.map((_, j) => ((i + j) % 2 ? -1 : 1) * det2(minorM(A, i, j)))), adj = T(C), ab = mmul(adj, b.map(v => [v]));
    return {
      q: `Išspręskite tiesinių lygčių sistemą atvirkštinės matricos metodu: ${sys(A.map((r, i) => eqn(r, vn, b[i])))} Čia ${E('A', M(A))}, ${E('B', V(b))}.`,
      steps: [
        st('Determinantas:', [num('det A =')], [d], 'Trikampių taisyklė.', `det A = ${detSol(A)}`),
        st('Adjunktų matrica (kiekvienam elementui: išbraukite jo eilutę ir stulpelį, apskaičiuokite 2×2 determinantą, pritaikykite ženklus + − + / − + − / + − +):', [mat(3, 3, `${I('C')} =`)], [C], `Pavyzdžiui: ${sub('A', 11)} = +${D(minorM(A, 0, 0))}, ${sub('A', 12)} = −${D(minorM(A, 0, 1))}.`, E('C', M(C))),
        st('Transponuokite:', [mat(3, 3, `${I('C')}<sup>T</sup> =`)], [adj], 'Eilutės tampa stulpeliais.', `${I('C')}<sup>T</sup> = ${M(adj)}, todėl ${I('A')}<sup>−1</sup> = ${FR(1, P(d))}·${M(adj)}`),
        st(`${I('X')} = ${I('A')}<sup>−1</sup>${I('B')} = ${FR(1, P(d))}·${I('C')}<sup>T</sup>${I('B')}:`, [mat(3, 1, `${I('X')} =`)], [x.map(v => [v])], `Pirmiausia Cᵀ padauginkite iš B, tada kiekvieną elementą padalykite iš ${H(d)}.`, `${I('C')}<sup>T</sup>${I('B')} = ${M(ab)}, padaliję iš ${H(d)}: ${I('X')} = ${V(x)}`)
      ]
    };
  });
