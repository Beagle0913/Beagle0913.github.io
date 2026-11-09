/* ================= Lietuviška versija: 1–2 temos ================= */
const ROOTSL = 'Šaknį galima rašyti taip: sqrt(74).';

regLT('closest', 'Taškai ir koordinačių plokštumos',
  'xy plokštuma yra z = 0, xz plokštuma – y = 0, yz plokštuma – x = 0. Atstumas nuo taško iki koordinačių plokštumos lygus tos koordinatės, kurios <b>nėra</b> plokštumos pavadinime, moduliui.',
  () => {
    const c1 = ri(0, 2), c2 = pick([0, 1, 2].filter(i => i !== c1)), zi = ri(0, 2), N = ['P', 'Q', 'R']; let pts;
    do { pts = [0, 1, 2].map(() => [nz(-8, 8), nz(-8, 8), nz(-8, 8)]); pts[zi][c2] = 0; } while (new Set(pts.map(p => Math.abs(p[c1]))).size < 3);
    const d = pts.map(p => Math.abs(p[c1])), near = d.indexOf(Math.min(...d));
    return {
      q: `Duoti taškai ${pts.map((p, i) => I(N[i]) + pt(p)).join(', ')}.`,
      steps: [
        st(`Kuris iš taškų yra arčiausiai ${I(PLANE[c1])} plokštumos?`, [choice(N.map(I))], [near], `${PLANE[c1]} plokštuma yra ${AX[c1]} = 0, todėl palyginkite ${AX[c1]} koordinačių modulius.`, `|${AX[c1]}| taškams P, Q, R lygus ${d.join('; ')}. Mažiausias – taško ${N[near]}.`),
        st(`Kuris taškas priklauso ${I(PLANE[c2])} plokštumai?`, [choice(N.map(I))], [zi], `Taškas priklauso ${PLANE[c2]} plokštumai, kai jo ${AX[c2]} koordinatė lygi 0.`, `Taško ${N[zi]} koordinatė ${AX[c2]} = 0.`)
      ]
    };
  });

regLT('distpt', 'Atstumas iki plokštumos ir ašies',
  'Iki koordinačių plokštumos: trūkstamos koordinatės modulis (iki xy plokštumos – |z|). Iki koordinačių ašies: šaknis iš <b>kitų dviejų</b> koordinačių kvadratų sumos (iki x ašies – √(y² + z²)).',
  () => {
    const p = [nz(-9, 9), nz(-9, 9), nz(-9, 9)], pl = ri(0, 2), ax = ri(0, 2), o = [0, 1, 2].filter(i => i !== ax), s = p[o[0]] ** 2 + p[o[1]] ** 2;
    return {
      q: `Raskite atstumą nuo taško ${pt(p)} iki:`,
      steps: [
        st(`${I(PLANE[pl])} plokštumos`, [num('atstumas =')], [Math.abs(p[pl])], `${PLANE[pl]} plokštuma yra ${AX[pl]} = 0. Kiek ${AX[pl]} koordinatė nutolusi nuo 0?`, `|${H(p[pl])}| = ${Math.abs(p[pl])}`),
        st(`${I(AX[ax])} ašies. ${ROOTSL}`, [num('atstumas =')], [rt2(s)], `Artimiausias ${AX[ax]} ašies taškas turi tą pačią ${AX[ax]} koordinatę, o kitos dvi jo koordinatės lygios 0. Todėl svarbios tik ${AX[o[0]]} ir ${AX[o[1]]}.`, `√(${P(p[o[0]])}² + ${P(p[o[1]])}²) = √${s}${Number.isInteger(Math.sqrt(s)) ? ' = ' + Math.sqrt(s) : ' ≈ ' + H(Math.round(Math.sqrt(s) * 100) / 100)}`)
      ]
    };
  });

regLT('sphere', 'Sferos centras ir spindulys',
  'Jei prie kvadratų yra koeficientas, pirmiausia visą lygtį iš jo padalykite. Visus narius su kintamaisiais perkelkite į kairę. Kiekvienam kintamajam išskirkite pilnąjį kvadratą: x² + px = (x + p/2)² − (p/2)². Skaičius surinkite dešinėje: gaunama (x − a)² + (y − b)² + (z − c)² = r², centras (a; b; c), spindulys r.',
  () => {
    let c; do { c = [ri(-6, 6), ri(-6, 6), ri(-6, 6)]; } while (c.filter(x => x).length < 2);
    const r = ri(1, 7), k = pick([1, 1, 1, 2, 3]), G = r * r - n2(c), h0 = c.findIndex(x => x), hv = AX[h0];
    const lhs = terms([[k, pw('x', 2)], [k, pw('y', 2)], [k, pw('z', 2)], ...c.map((v, i) => [-2 * v * k, I(AX[i])])]);
    const sq = c.map((v, i) => v === 0 ? pw(AX[i], 2) : `(${lin(v, AX[i])})<sup>2</sup>`).join(' + ');
    return {
      q: `Parodykite, kad lygtis ${lhs} = ${H(k * G)} aprašo sferą, ir raskite jos centro koordinates bei spindulio ilgį.`,
      steps: [
        st(`${k > 1 ? `Padalykite iš ${k} ir išskirkite` : 'Išskirkite'} pilnąjį kvadratą kiekvienam kintamajam. Centras:`, AX.map(a => num(`${I(a)}<sub>0</sub> =`, { w: 4 })), c, `${hv}² ${c[h0] > 0 ? '−' : '+'} ${Math.abs(2 * c[h0])}${hv} = (${hv} ${c[h0] > 0 ? '−' : '+'} ${Math.abs(c[h0])})² − ${c[h0] * c[h0]}. Kiekviena centro koordinatė lygi pusei to kintamojo koeficiento su priešingu ženklu.`, `Centras (${c.map(H).join('; ')})`),
        st('Dešinioji pusė, perkėlus konstantas:', [num(`${sq} =`)], [r * r], `${H(G)} + ${c.map(v => v * v).join(' + ')}`, `${sq} = ${H(G)} + ${c.map(v => v * v).join(' + ')} = ${r * r}`),
        st('Spindulys:', [num(`${I('r')} =`)], [r], 'Dešinioji pusė lygi r².', `${I('r')} = √${r * r} = ${r}`)
      ]
    };
  });

regLT('touch', 'Sfera, liečianti koordinačių plokštumą',
  'Sfera liečia plokštumą, kai jos spindulys lygus atstumui nuo centro iki tos plokštumos. Koordinačių plokštumai tai trūkstamos koordinatės modulis.',
  () => {
    let c; do { c = [nz(-7, 7), nz(-7, 7), nz(-7, 7)]; } while (new Set(c.map(Math.abs)).size < 3);
    const pl = ri(0, 2), r = Math.abs(c[pl]), sq = c.map((v, i) => `(${lin(v, AX[i])})<sup>2</sup>`).join(' + ');
    return {
      q: `Užrašykite sferos su centru taške ${pt(c)} lygtį, kai ji liečia ${I(PLANE[pl])} plokštumą.`,
      steps: [
        st('Jos spindulys:', [num(`${I('r')} =`)], [r], `Atstumas nuo centro iki ${PLANE[pl]} plokštumos (${AX[pl]} = 0).`, `${I('r')} = |${H(c[pl])}| = ${r}`),
        st('Jos lygtis:', [num(`${sq} =`)], [r * r], 'Dešinioji pusė lygi r².', `${sq} = ${r * r}`)
      ]
    };
  });

regLT('dist3', 'Atstumas tarp dviejų taškų',
  'Atimkite koordinates (pabaiga minus pradžia), tris skirtumus pakelkite kvadratu, sudėkite ir ištraukite šaknį: √(Δx² + Δy² + Δz²).',
  () => {
    const a = [ri(-5, 6), ri(-5, 6), ri(-5, 6)]; let b; do { b = [ri(-5, 6), ri(-5, 6), ri(-5, 6)]; } while (b.every((x, i) => x === a[i]));
    const d = b.map((x, i) => x - a[i]), s = n2(d);
    return {
      q: `Masės centro koordinatės laiko momentu ${I('t')} = 0 yra ${pt(a)}, o laiko momentu ${I('t')} = 2 yra ${pt(b)}.`,
      steps: [
        st('Kiek pasikeitė kiekviena koordinatė (pabaiga minus pradžia)?', AX.map(v => num(`Δ${I(v)} =`, { w: 4 })), d, 'Neigiamas pokytis reiškia, kad koordinatė sumažėjo.', AX.map((v, i) => `Δ${I(v)} = ${H(b[i])} − ${P(a[i])} = ${H(d[i])}`).join(', &nbsp;')),
        st(`Koks atstumas tarp šių dviejų padėčių? ${ROOTSL}`, [num('atstumas =')], [rt2(s)], '√(Δx² + Δy² + Δz²)', `√(${sqs(d)}) = √${s}${Number.isInteger(Math.sqrt(s)) ? ' = ' + Math.sqrt(s) : ' ≈ ' + H(Math.round(Math.sqrt(s) * 100) / 100)}`)
      ]
    };
  });

const SHAPESL = ['Plokštuma', 'Erdvės dalis vienoje plokštumos pusėje', 'Tiesė', 'Apskritimas', 'Sfera (tik paviršius)', 'Rutulys', 'Cilindras'];
regLT('describe', 'Ką lygtis aprašo erdvėje ℝ³?',
  'Erdvėje ℝ³ nepaminėtas kintamasis yra laisvas. Viena tiesinė lygtis aprašo plokštumą; nelygybė – viską, kas yra vienoje jos pusėje. Dvi lygtys kartu aprašo sankirtą (dvi plokštumos kertasi tiese; cilindras ir plokštuma – apskritimu). x² + y² + z² = r² yra sfera, su ženklu ≤ – rutulys, o vien x² + y² = r² – cilindras aplink z ašį.',
  () => {
    const c = nz(-6, 8), r = ri(2, 5), [u, v, w] = shuffle(AX), bank = [
      [`${I(u)} = ${H(c)}`, 0, `Visi taškai, kurių ${u} = ${H(c)}; kitos dvi koordinatės laisvos. Plokštuma, lygiagreti ${[u, v, w].filter(a => a !== u).sort().join('')} plokštumai.`],
      [`${I('x')} + ${I('y')} = ${Math.abs(c)}`, 0, 'Viena tiesinė lygtis; z laisvas. Vertikali plokštuma, kuri kerta xy plokštumą tiese x + y = ' + Math.abs(c) + '.'],
      [`${I(u)} &lt; ${H(c)}`, 1, `Visi taškai vienoje plokštumos ${u} = ${H(c)} pusėje.`],
      [`${I(u)} = ${H(c)}, &nbsp; ${I(v)} = ${H(r)}`, 2, `Dvi plokštumos kertasi tiese; laisvas tik ${w}.`],
      [`${pw('x', 2)} + ${pw('y', 2)} = ${r * r}, &nbsp; ${I('z')} = ${H(c)}`, 3, `Apskritimo su spinduliu ${r} taškai, kurių z koordinatė yra ${H(c)}, o centro koordinatės yra (0; 0; ${H(c)}).`],
      [`${pw('x', 2)} + ${pw('y', 2)} + ${pw('z', 2)} = ${r * r}`, 4, `Visi taškai, nutolę nuo koordinačių pradžios tiksliai atstumu ${r}.`],
      [`${pw('x', 2)} + ${pw('y', 2)} + ${pw('z', 2)} ≤ ${r * r - 1}`, 5, `Visi taškai, kurie priklauso rutuliui, kurio spindulys yra √${r * r - 1}, o centras (0; 0; 0).`],
      [`${pw('x', 2)} + ${pw('y', 2)} = ${r * r}`, 6, `z laisvas, todėl spindulio ${r} apskritimas kartojasi kiekviename aukštyje: cilindras aplink z ašį.`]];
    return { q: `Žodžiais apibūdinkite objektą, kurį ℝ<sup>3</sup> erdvėje aprašo duotos lygtys arba nelygybės.`, steps: shuffle(bank).slice(0, 3).map(([h, a, why]) => st(`<span class="bigq">${h}</span>`, [choice(SHAPESL)], [a], 'Kurie kintamieji laisvi? Tai lygtis ar nelygybė? Viena sąlyga ar dvi?', why)) };
  });

/* ---------- 2 tema ---------- */
regLT('vecops', 'Veiksmai su vektoriais, ilgis',
  'Sudėkite, atimkite ir dauginkite iš skaičių pakomponenčiui. Ilgis: |a| = √(a₁² + a₂² + a₃²).',
  () => {
    const n = pick([2, 3]), a = n === 2 && Math.random() < 0.5 ? pick([[3, -4], [5, -12], [-6, 8], [8, 15], [-5, 12], [4, 3]]) : rm(1, n, -6, 7)[0]; let b; do { b = rm(1, n, -6, 7)[0]; } while (b.every((x, i) => x === a[i]));
    const al = pick([2, 2, 3, -1]), be = pick([3, 3, -2, 2]), sum = a.map((x, i) => x + b[i]), lc = a.map((x, i) => al * x + be * b[i]), df = a.map((x, i) => x - b[i]);
    const ex = terms([[al, Bv('a')], [be, Bv('b')]]);
    return {
      q: `Apskaičiuokite ${Bv('a')} + ${Bv('b')}, ${ex}, |${Bv('a')}| ir |${Bv('a')} − ${Bv('b')}|, kai ${Bv('a')} = ${rv(a)}, ${Bv('b')} = ${rv(b)}.`,
      steps: [
        st('Suma:', [mat(1, n, `${Bv('a')} + ${Bv('b')} =`)], [[sum]], 'Sudėkite atitinkamas komponentes.', `${Bv('a')} + ${Bv('b')} = ${rv(sum)}`),
        st('Tiesinis darinys:', [mat(1, n, `${ex} =`)], [[lc]], `Kiekviena komponentė: ${al}·(a komponentė) ${be < 0 ? '−' : '+'} ${Math.abs(be)}·(b komponentė).`, `${ex} = ${rv(lc)}`),
        st(`Ilgis. ${ROOTSL}`, [num(`|${Bv('a')}| =`)], [rt2(n2(a))], 'Šaknis iš komponenčių kvadratų sumos.', `|${Bv('a')}| = √(${sqs(a)}) = ${H(rt2(n2(a)))}`),
        st('Skirtumo ilgis:', [num(`|${Bv('a')} − ${Bv('b')}| =`)], [rt2(n2(df))], `Pirmiausia ${Bv('a')} − ${Bv('b')} = ${rv(df)}, tada jo ilgis.`, `${Bv('a')} − ${Bv('b')} = ${rv(df)}, ilgis √${n2(df)}${Number.isInteger(Math.sqrt(n2(df))) ? ' = ' + Math.sqrt(n2(df)) : ''}`)
      ]
    };
  });

regLT('dot', 'Skaliarinė sandauga',
  'a·b = a₁b₁ + a₂b₂ + a₃b₃: sudauginkite atitinkamas komponentes ir sudėkite. Rezultatas – skaičius. Užrašant per i, j, k, koeficientai yra komponentės (jei raidės nėra, komponentė lygi 0).',
  () => {
    if (Math.random() < 0.4) {
      const a = [nz(-4, 5), ri(-3, 4), ri(-3, 4)], b = [ri(-3, 4), nz(-4, 5), ri(-3, 4)], ijk = v => terms(v.map((x, i) => [x, Bv('ijk'[i])]));
      return { q: `Apskaičiuokite ${Bv('a')}·${Bv('b')}, kai ${Bv('a')} = ${ijk(a)}, ${Bv('b')} = ${ijk(b)}.`, steps: [st('', [num(`${Bv('a')}·${Bv('b')} =`)], [dotv(a, b)], `Komponentėmis: ${Bv('a')} = ${rv(a)}, ${Bv('b')} = ${rv(b)}.`, `${dots(a, b)} = ${H(dotv(a, b))}`)] };
    }
    const d = pick([2, 3, 4]), a = [nz(-5, 6), nz(-5, 6), new Q(pick([1, -1, 3]), d)], b = [nz(-6, 7), nz(-6, 7), d * nz(-3, 3)], r = a[0] * b[0] + a[1] * b[1] + a[2].n * b[2] / a[2].d;
    return { q: `Apskaičiuokite ${Bv('a')}·${Bv('b')}, kai ${Bv('a')} = ${rv(a)}, ${Bv('b')} = ${rv(b)}.`, steps: [st('', [num(`${Bv('a')}·${Bv('b')} =`)], [r], 'Padauginkite pirmą komponentę iš pirmos, antrą iš antros, trečią iš trečios ir sudėkite.', `${dots(a, b)} = ${H(r)}`)] };
  });

regLT('meaning', 'Kurios išraiškos turi prasmę?',
  'Taškas · žymi skaliarinę sandaugą: abiejose pusėse turi būti vektoriai, o rezultatas – skaičius. Skaičių galima dauginti iš vektoriaus (be taško), tačiau skaičiaus negalima nei sudėti su vektoriumi, nei skaliariškai iš jo dauginti. Eikite iš vidaus į išorę ir kiekvieną dalį pažymėkite „skaičius“ arba „vektorius“.',
  () => {
    const a = Bv('a'), b = Bv('b'), c = Bv('c'), bank = [
      [`(${a}·${b})·${c}`, false, 'a·b yra skaičius; skaičiaus negalima skaliariškai dauginti iš c'], [`(${a}·${b})${c}`, true, 'skaičiaus ir vektoriaus sandauga'], [`|${a}|(${b}·${c})`, true, 'dviejų skaičių sandauga'],
      [`${a}·(${b} + ${c})`, true, 'vektoriaus ir vektoriaus skaliarinė sandauga'], [`${a}·${b} + ${c}`, false, 'skaičiaus ir vektoriaus suma neapibrėžta'], [`|${a}|·(${b} + ${c})`, false, '|a| yra skaičius; jo negalima skaliariškai dauginti iš vektoriaus'],
      [`${a}·${b} + |${c}|`, true, 'dviejų skaičių suma'], [`(${a} + ${b})·${c}`, true, 'vektoriaus ir vektoriaus skaliarinė sandauga'], [`${a} + ${b}·${c}`, false, 'vektoriaus ir skaičiaus suma neapibrėžta'], [`(${a}·${b})(${a}·${c})`, true, 'dviejų skaičių sandauga']];
    let qs; do { qs = shuffle(bank).slice(0, 6); } while (qs.every(x => x[1]) || !qs.some(x => x[1]));
    return {
      q: `Paaiškinkite, kurios iš pateiktų išraiškų turi prasmę, o kurios – ne. Čia ${a}, ${b}, ${c} – vektoriai, o · žymi skaliarinę sandaugą.`,
      steps: [st('Pažymėkite visas išraiškas, kurios turi prasmę:', [checks(qs.map(x => x[0]))], [qs.map(x => x[1])], 'Kiekvienai išraiškai žingsnis po žingsnio nustatykite, ar dalis yra skaičius, ar vektorius.', qs.map(x => `${x[0]}: ${x[1] ? '✓' : '✗'} ${x[2]}`).join('<br>'))]
    };
  });

regLT('right', 'Ar trikampis statusis?',
  'Sudarykite kraštinių vektorius (galo taškas minus pradžios taškas). Dvi kraštinės statmenos tada ir tik tada, kai jų skaliarinė sandauga lygi 0. Patikrinkite kiekvienoje viršūnėje susikertančių kraštinių porą.',
  () => {
    const N = ['P', 'Q', 'R']; let p, sides, dp, at;
    for (;;) {
      p = [0, 1, 2].map(() => [ri(-4, 6), ri(-4, 6), ri(-5, 5)]);
      if (Math.random() < 0.65) { const u = [nz(-3, 3), nz(-3, 3), ri(-2, 2)], k = nz(-2, 2), w = pick([[u[1] * k, -u[0] * k, 0], [0, u[2] * k, -u[1] * k], [u[2] * k, 0, -u[0] * k], [u[1] * k, -u[0] * k, u[2] ? 0 : k]]); if (dotv(u, w) !== 0 || n2(w) === 0) continue; const v = ri(0, 2), o = [0, 1, 2].filter(i => i !== v); p[o[0]] = p[v].map((x, i) => x + u[i]); p[o[1]] = p[v].map((x, i) => x + w[i]); }
      sides = [[0, 1], [0, 2], [1, 2]].map(([i, j]) => p[j].map((x, k) => x - p[i][k]));
      if (sides.some(s => n2(s) === 0)) continue;
      dp = [dotv(sides[0], sides[1]), -dotv(sides[0], sides[2]), dotv(sides[1], sides[2])];
      const cr = [sides[0][1] * sides[1][2] - sides[0][2] * sides[1][1], sides[0][2] * sides[1][0] - sides[0][0] * sides[1][2], sides[0][0] * sides[1][1] - sides[0][1] * sides[1][0]];
      if (n2(cr) === 0 || p.flat().some(x => Math.abs(x) > 9)) continue;
      at = dp.indexOf(0); break;
    }
    const ar = s => `<span class="bar">${s}</span>`, nm = ['PQ', 'PR', 'QR'];
    return {
      q: `Pasinaudodami vektoriais nustatykite, ar trikampis, kurio viršūnės yra taškai ${p.map((x, i) => I(N[i]) + pt(x)).join(', ')}, yra statusis.`,
      steps: [
        st('Kraštinių vektoriai (galas minus pradžia):', nm.map(s => mat(1, 3, `${ar(I(s))} =`)), sides.map(s => [s]), 'Vektoriui PQ iš taško Q koordinačių atimkite taško P koordinates.', nm.map((s, i) => `${ar(I(s))} = ${rv(sides[i])}`).join(', &nbsp;')),
        st('Kiekvienoje viršūnėje susikertančių kraštinių skaliarinė sandauga:', [num(`viršūnėje ${I('P')}: ${ar(I('PQ'))}·${ar(I('PR'))} =`, { w: 4 }), num(`viršūnėje ${I('Q')}: ${ar(I('QP'))}·${ar(I('QR'))} =`, { w: 4 }), num(`viršūnėje ${I('R')}: ${ar(I('RP'))}·${ar(I('RQ'))} =`, { w: 4 })], dp, 'QP yra PQ su priešingais ženklais; taip pat RP = −PR, RQ = −QR.', `viršūnėje P: ${H(dp[0])}, &nbsp; viršūnėje Q: ${H(dp[1])}, &nbsp; viršūnėje R: ${H(dp[2])}`),
        st('Išvada:', [choice(['Status kampas viršūnėje P', 'Status kampas viršūnėje Q', 'Status kampas viršūnėje R', 'Trikampis nėra statusis'])], [at < 0 ? 3 : at], 'Nulinė skaliarinė sandauga reiškia, kad kraštinės statmenos.', at < 0 ? 'Nė viena skaliarinė sandauga nelygi 0, todėl stataus kampo nėra.' : `Skaliarinė sandauga viršūnėje ${N[at]} lygi 0, todėl trikampis yra statusis (status kampas prie ${N[at]}).`)
      ]
    };
  });

regLT('proj', 'Vektoriaus projekcija ir projekcijos vektorius',
  'Projekcija (skaičius): comp<sub>a</sub>b = (a·b)/|a|. Projekcijos vektorius: proj<sub>a</sub>b = ((a·b)/|a|²)·a – vektoriaus a kartotinis. Atkreipkite dėmesį: |a|² yra tiesiog kvadratų suma, be šaknies.',
  () => {
    const n = pick([2, 3]); let a, b; do { a = n === 2 && Math.random() < 0.4 ? pick([[3, -4], [4, 3], [-3, 4], [0, 5], [6, 8]]) : rm(1, n, -4, 5)[0]; b = rm(1, n, -5, 6)[0]; } while (n2(a) < 2 || n2(b) === 0);
    const d = dotv(a, b), s = n2(a), pr = a.map(x => new Q(d * x, s));
    return {
      q: `Apskaičiuokite vektoriaus ${Bv('b')} projekciją comp<sub>${Bv('a')}</sub>${Bv('b')} ir projekcijos vektorių proj<sub>${Bv('a')}</sub>${Bv('b')} vektoriuje ${Bv('a')}, kai ${Bv('a')} = ${rv(a)}, ${Bv('b')} = ${rv(b)}.`,
      steps: [
        st('Skaliarinė sandauga:', [num(`${Bv('a')}·${Bv('b')} =`)], [d], 'Sudauginkite atitinkamas komponentes ir sudėkite.', `${dots(a, b)} = ${H(d)}`),
        st(`Vektoriaus ${Bv('a')} ilgis. ${ROOTSL}`, [num(`|${Bv('a')}| =`)], [rt2(s)], 'Šaknis iš kvadratų sumos.', `√(${sqs(a)}) = ${H(rt2(s))}`),
        st('Projekcija (jei reikia, rašykite taip: 1/sqrt(21)):', [num(`comp<sub>${Bv('a')}</sub>${Bv('b')} =`)], [overRt(d, s)], '(a·b)/|a|', `${FR(H(d), H(rt2(s)))}${Number.isInteger(Math.sqrt(s)) ? ' = ' + H(new Q(d, Math.sqrt(s))) : ''}`),
        st('Projekcijos vektorius (galima rašyti trupmenas, pvz., 9/5):', [mat(1, n, `proj<sub>${Bv('a')}</sub>${Bv('b')} =`)], [[pr]], `Padauginkite ${Bv('a')} iš (a·b)/|a|² = ${H(d)}/${s}.`, `${H(new Q(d, s))}·${rv(a)} = ${rv(pr)}`)
      ]
    };
  });

regLT('angle', 'Kampas tarp vektorių',
  'cos θ = (a·b)/(|a|·|b|). Jau skaliarinės sandaugos ženklas parodo kampo tipą: teigiama – smailusis, nulis – statusis (vektoriai statmeni), neigiama – bukasis.',
  () => {
    const n = pick([2, 2, 3]); let a, b;
    do { a = rm(1, n, -4, 5)[0]; b = rm(1, n, -4, 5)[0]; if (Math.random() < 0.35 && n === 2) b = [a[1], -a[0]].map(x => x * nz(-2, 2)); } while (!n2(a) || !n2(b) || n2(a) * n2(b) === dotv(a, b) ** 2);
    const d = dotv(a, b), pa = n2(a), pb = n2(b);
    return {
      q: `Du pokyčio vektoriai yra ${Bv('a')} = ${rv(a)} ir ${Bv('b')} = ${rv(b)}. Kam lygus kampas θ tarp šių krypčių?`,
      steps: [
        st('Skaliarinė sandauga:', [num(`${Bv('a')}·${Bv('b')} =`)], [d], 'Sudauginkite atitinkamas komponentes ir sudėkite.', `${dots(a, b)} = ${H(d)}`),
        st(`Ilgiai. ${ROOTSL}`, [num(`|${Bv('a')}| =`), num(`|${Bv('b')}| =`)], [rt2(pa), rt2(pb)], 'Šaknis iš kvadratų sumos.', `|${Bv('a')}| = ${H(rt2(pa))}, |${Bv('b')}| = ${H(rt2(pb))}`),
        st('Kampo kosinusas (jei reikia, rašykite taip: 3/sqrt(50)):', [num('cos θ =')], [overRt(d, pa * pb)], '(a·b)/(|a|·|b|). Dviejų šaknų sandauga lygi šakniai iš sandaugos.', `cos θ = ${FR(H(d), `√${pa}·√${pb}`)} = ${H(overRt(d, pa * pb))}`),
        st('Taigi kampas yra:', [choice(['Smailusis (mažesnis nei 90°)', 'Statusis (kryptys statmenos)', 'Bukasis (didesnis nei 90°)'])], [d > 0 ? 0 : d === 0 ? 1 : 2], 'Žiūrėkite į cos θ ženklą.', d === 0 ? 'cos θ = 0 ⇒ θ = π/2, kryptys yra statmenos.' : d > 0 ? 'cos θ > 0, todėl kampas smailusis.' : 'cos θ < 0, todėl kampas bukasis.')
      ]
    };
  });

regLT('share', 'Santykinė pokyčio dalis (genomo raiškos profilis)',
  'Norimas pokytis – vektorius V. Vaistas sukelia pokytį A. Vektoriaus A dalis, nukreipta išilgai V, yra skaliarinė projekcija comp<sub>V</sub>A = (A·V)/|V|. Santykinė norimo pokyčio dalis: comp<sub>V</sub>A / |V| = (A·V)/|V|². Vaistas, kurio dalis arčiau 1, yra arčiau norimo efekto.',
  () => {
    let Vv, A, Bd, s, sa, sb;
    do { Vv = [nz(-5, 9), nz(-5, 9), nz(-6, 6)]; A = [ri(-4, 6), ri(-4, 6), ri(-5, 5)]; Bd = [ri(-4, 6), ri(-4, 6), ri(-5, 5)]; s = n2(Vv); sa = dotv(A, Vv); sb = dotv(Bd, Vv); } while (sa <= 0 || sb <= 0 || sa >= s || sb >= s || sa === sb);
    return {
      q: `Tyrėjai bando sukurti vaistą, kuris pakeistų trijų genų raišką tam tikru būdu. Norimas genų raiškos pokytis, užrašytas kaip vektorius ${sub('V', 3)}, yra ${rv(Vv)}. Nagrinėjami du potencialūs vaistai ir jų sukeliami raiškos profiliai yra A) ${rv(A)} ir B) ${rv(Bd)}.`,
      steps: [
        st(`Koks yra norimo raiškos pokyčio vertės dydis? ${ROOTSL}`, [num(`|${sub('V', 3)}| =`)], [rt2(s)], 'Šaknis iš kvadratų sumos.', `√(${sqs(Vv)}) = ${H(rt2(s))}`),
        st('Kiekvieno vaisto vektoriaus ir norimo pokyčio skaliarinė sandauga:', [num(`${I('A')}·${sub('V', 3)} =`), num(`${I('B')}·${sub('V', 3)} =`)], [sa, sb], 'Sudauginkite atitinkamas komponentes ir sudėkite.', `${dots(A, Vv)} = ${sa}, &nbsp; ${dots(Bd, Vv)} = ${sb}`),
        st('Pasinaudodami skaliarine projekcija nustatykite norimo pokyčio santykinę dalį, kurią sukelia kiekvienas vaistas (trupmenomis):', [num('vaistas A:'), num('vaistas B:')], [new Q(sa, s), new Q(sb, s)], `Projekcija, padalyta iš |V₃|: (A·V₃)/|V₃|², o |V₃|² = ${s}.`, `Vaisto A sukeliamo pokyčio dalis: ${FR(sa, s)} ≈ ${H(Math.round(sa / s * 100) / 100)}. Vaisto B sukeliamo pokyčio dalis: ${FR(sb, s)} ≈ ${H(Math.round(sb / s * 100) / 100)}.`),
        st('Kuris vaistas yra arčiau norimo pasiekti efekto?', [choice(['Vaistas A', 'Vaistas B'])], [sa > sb ? 0 : 1], 'Didesnė dalis (arčiau 1) reiškia, kad vaistas arčiau tikslo.', `Vaistas ${sa > sb ? 'A' : 'B'}.`)
      ]
    };
  });
