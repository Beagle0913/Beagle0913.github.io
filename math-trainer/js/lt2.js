/* ================= Lietuviška versija: 6–9 temos ================= */
const NEGIML = 'Jei menamoji dalis neigiama, minusą rašykite antrajame langelyje (skaičiui 3 − 2i įveskite 3 ir -2).';
const PHIL = 'Kampus rašykite taip: 7pi/6, pi/4, pi ir pan.';
const quadL = m => m % 6 === 0 ? ['teigiamojoje realiojoje pusašėje', 'teigiamojoje menamojoje pusašėje', 'neigiamojoje realiojoje pusašėje', 'neigiamojoje menamojoje pusašėje'][m / 6] : ['I', 'II', 'III', 'IV'][Math.floor(m / 6)] + ' ketvirtyje';
const rPhiL = z => `r = √(${H(Math.round(z.re.v * z.re.v))} + ${H(Math.round(z.im.v * z.im.v))}) = ${z.r.h}, taškas yra ${quadL(z.m)}, φ = ${z.phi.h}`;

regLT('cbasic', 'Sudėtis, atimtis, daugyba',
  'Su i elkitės kaip su raide ir naudokite i² = −1. Sandauga: (a + bi)(c + di) = (ac − bd) + (ad + bc)i. Skaičiaus a + bi jungtinis skaičius yra a − bi.',
  () => {
    const a = [nz(-5, 6), nz(-5, 6)], b = [nz(-5, 6), nz(-5, 6)], cb = [b[0], -b[1]], ca = [a[0], -a[1]], sm = [a[0] + b[0], a[1] + b[1]];
    const mulHow = `(${Z(a)})(${Z(b)}) = ${cmulHow(a, b)}, o i² = −1.`;
    const [ex, r, how] = pick([
      [`${z1} + ${z2}`, sm, 'Atskirai sudėkite realiąsias ir menamąsias dalis.'],
      [`${z1} − ${z2}`, [a[0] - b[0], a[1] - b[1]], 'Atskirai atimkite realiąsias ir menamąsias dalis.'],
      [`${z1}·${z2}`, cmul(a, b), mulHow], [`${z1}·${z2}`, cmul(a, b), mulHow],
      [`${z1}·${bar(z2)}`, cmul(a, cb), `Skaičiaus ${z2} jungtinis yra ${Z(cb)}. Tada sudauginkite.`],
      [`${bar(z1)}·${z2}`, cmul(ca, b), `Skaičiaus ${z1} jungtinis yra ${Z(ca)}. Tada sudauginkite.`],
      [`${z1}<sup>2</sup>`, cmul(a, a), '(a + bi)² = a² − b² + 2abi'],
      [`(${z1} + ${z2})<sup>2</sup>`, cmul(sm, sm), `Pirmiausia ${z1} + ${z2} = ${Z(sm)}, tada kelkite kvadratu: (a + bi)² = a² − b² + 2abi.`]
    ]);
    return { q: `Tegul ${z1} = ${Z(a)} ir ${z2} = ${Z(b)}. Atlikite veiksmus: ${ex}.`, steps: [st(NEGIML, ReIm(), r, how, `${ex} = ${Z(r)}`)] };
  });

regLT('cdiv', 'Kompleksinių skaičių dalyba',
  'Skaitiklį ir vardiklį padauginkite iš vardiklio jungtinio skaičiaus. Vardiklis tampa realiuoju skaičiumi c² + d². Tada atskirkite realiąją ir menamąją dalis.',
  () => {
    const a = [nz(-5, 6), nz(-5, 6)], b = [nz(-4, 5), nz(-4, 5)], cb = [b[0], -b[1]], t = cmul(a, cb), dn = b[0] * b[0] + b[1] * b[1], r = [new Q(t[0], dn), new Q(t[1], dn)];
    return {
      q: `Apskaičiuokite ${big(Z(a), Z(b))}.`,
      steps: [
        st(`Skaitiklį padauginkite iš vardiklio jungtinio skaičiaus: (${Z(a)})(${Z(cb)}) =`, ReIm(), t, '(a + bi)(c + di) = (ac − bd) + (ad + bc)i, nes i² = −1.', `(${Z(a)})(${Z(cb)}) = ${Z(t)}`),
        st(`Vardiklis tampa (${Z(b)})(${Z(cb)}) =`, [num('')], [dn], 'c² + d²', `${P(b[0])}² + ${P(b[1])}² = ${dn}`),
        st('Padalykite abi dalis (galima rašyti trupmenas, pvz., 5/17):', ReIm(), r, `Padalykite ${Z(t)} iš ${dn}.`, `${big(Z(a), Z(b))} = ${cx(r[0], r[1])}`)
      ]
    };
  });

regLT('ccube', 'Kėlimas kubu',
  'Pirmiausia pakelkite kvadratu, tada rezultatą dar kartą padauginkite iš z. (a + bi)² = a² − b² + 2abi.',
  () => {
    const a = [nz(-3, 4), nz(-3, 4)], s = cmul(a, a), c = cmul(s, a);
    return {
      q: `Tegul ${I('z')} = ${Z(a)}. Apskaičiuokite ${I('z')}<sup>3</sup>.`,
      steps: [
        st(`Pirmiausia ${I('z')}<sup>2</sup> =`, ReIm(), s, 'Realioji dalis a² − b², menamoji dalis 2ab.', `${I('z')}<sup>2</sup> = ${Z(s)}`),
        st(`Tada ${I('z')}<sup>3</sup> = ${I('z')}<sup>2</sup>·${I('z')} = (${Z(s)})(${Z(a)}) =`, ReIm(), c, 'Sudauginkite ir pasinaudokite i² = −1.', `${I('z')}<sup>3</sup> = ${Z(c)}`)
      ]
    };
  });

regLT('ctrig', 'Trigonometrinė forma',
  'z = r(cos φ + i sin φ), kur r = √(a² + b²). Kampui φ: pažymėkite tašką plokštumoje ir nustatykite ketvirtį, raskite smailųjį kampą iš tg = |b|/|a| (1 → π/4, √3 → π/3, 1/√3 → π/6), tada pataisykite: II ketvirtyje π − kampas, III ketvirtyje π + kampas, IV ketvirtyje 2π − kampas.',
  () => {
    const z = niceZ(pick(NICE), ri(1, 4));
    return {
      q: `Užrašykite kompleksinį skaičių ${I('z')} = ${cxSd(z.re, z.im)} trigonometrine forma ${I('r')}(cos φ + ${I('i')} sin φ), kai 0 ≤ φ &lt; 2π.`,
      steps: [
        st('Modulis (šaknį galima rašyti taip: 3sqrt(2)):', [num(`${I('r')} =`)], [z.r], `r = √(a² + b²) = √(${H(Math.round(z.re.v * z.re.v))} + ${H(Math.round(z.im.v * z.im.v))})`, `${I('r')} = ${z.r.h}`),
        st(`Argumentas. ${PHIL}`, [num('φ =', { mod: 2 * PI })], [z.phi], `Taškas yra ${quadL(z.m)}. cos φ = ${sdH(cosE(z.m))}, sin φ = ${sdH(sinE(z.m))}.`, `${I('z')} = ${z.r.h}(cos ${z.phi.h} + ${I('i')} sin ${z.phi.h})`)
      ]
    };
  });

regLT('demoivre', 'Muavro teorema: kėlimas laipsniu',
  'Užrašykite z trigonometrine forma. Tada z<sup>n</sup> = r<sup>n</sup>(cos nφ + i sin nφ): modulį keliame laipsniu, kampą dauginame iš n. Prieš skaičiuodami cos ir sin, atmeskite pilnus apsisukimus 2π.',
  () => {
    const m = pick(NICE.filter(x => x % 6)), z = niceZ(m, 1), n = m % 3 === 0 ? pick([2, 4, 6, 8]) : pick([3, 3, 6, 6, 12]);
    const R = Math.round(Math.pow(z.r.v, n)), mm = ((m * n) % 24 + 24) % 24, re = cosE(mm).c.mul(R), im = sinE(mm).c.mul(R);
    return {
      q: `Tegul ${I('z')} = ${cxSd(z.re, z.im)}. Pasinaudodami Muavro teorema apskaičiuokite ${I('z')}<sup>${n}</sup>.`,
      steps: [
        st(`Skaičiaus ${I('z')} trigonometrinė forma. ${PHIL}`, [num(`${I('r')} =`), num('φ =', { mod: 2 * PI })], [z.r, z.phi], `r = √(a² + b²). Taškas yra ${quadL(m)}.`, rPhiL(z)),
        st(`Modulį pakelkite laipsniu, kampą padauginkite iš ${n}:`, [num(`${I('r')}<sup>${n}</sup> =`), num(`${n}φ =`, { mod: 2 * PI })], [R, angM(m * n)], `${n}·${z.phi.h}. Galite palikti taip arba atimti 2π kartotinius.`, `${I('r')}<sup>${n}</sup> = ${R}, &nbsp; ${n}φ = ${angM(m * n).h}${m * n >= 24 ? ' = ' + angM(mm).h + ' (atmetus pilnus apsisukimus)' : ''}`),
        st(`Įstatykite cos ir sin reikšmes. ${NEGIML}`, ReIm(), [re, im], `cos ${angM(mm).h} = ${sdH(cosE(mm))}, sin ${angM(mm).h} = ${sdH(sinE(mm))}; abu padauginkite iš ${R}.`, `${I('z')}<sup>${n}</sup> = ${R}(cos ${angM(mm).h} + ${I('i')} sin ${angM(mm).h}) = ${cx(re, im)}`)
      ]
    };
  });

regLT('croots', 'n-tojo laipsnio šaknys',
  'Užrašykite w = ρ(cos θ + i sin θ). Šaknų yra n. Visų jų modulis lygus ⁿ√ρ. Jų argumentai (θ + 2πk)/n, kai k = 0, 1, …, n − 1: pradėkite nuo θ/n ir vis pridėkite 2π/n. Šaknys išsidėsto tolygiai ant apskritimo.',
  () => {
    const [aw, n, mw] = pick([[1, 3, 0], [1, 4, 0], [1, 6, 0], [8, 3, 0], [16, 4, 0], [27, 3, 0], [64, 6, 0], [4, 2, 0], [1, 3, 12], [1, 4, 12], [1, 6, 12], [8, 3, 12], [16, 4, 12], [27, 3, 12], [64, 3, 12], [64, 6, 12], [4, 2, 12], [9, 2, 12], [1, 2, 6], [1, 3, 6], [1, 2, 18], [1, 3, 18], [8, 3, 6], [4, 2, 18]]);
    const wh = ['' + aw, (aw === 1 ? '' : aw) + I('i'), MIN + aw, MIN + (aw === 1 ? '' : aw) + I('i')][mw / 6], rho = Math.round(Math.pow(aw, 1 / n)), m0 = mw / n, stepm = 24 / n, K = ri(0, n - 1);
    const rt = k => { const m = m0 + stepm * k; return { m, re: sdMul(sd(rho), cosE(m)), im: sdMul(sd(rho), sinE(m)) }; }, rk = rt(K);
    return {
      q: `Raskite visas ${root(wh, n)} reikšmes (lygties ${I('z')}<sup>${n}</sup> = ${wh} sprendinius).`,
      steps: [
        st(`Skaičiaus ${wh} trigonometrinė forma. ${PHIL}`, [num('modulis ='), num('argumentas θ =', { mod: 2 * PI })], [aw, angM(mw)], 'Teigiamo realiojo skaičiaus argumentas lygus 0, neigiamo – π, teigiamo i kartotinio – π/2, neigiamo – 3π/2.', `${wh} = ${aw}(cos ${angM(mw).h} + ${I('i')} sin ${angM(mw).h})`),
        st('Šaknys:', [num('kiek yra šaknų?', { w: 3 }), num('kiekvienos šaknies modulis =')], [n, rho], `n-tojo laipsnio šaknų yra n, kiekvienos modulis lygus ⁿ√ρ.`, `Šaknų yra ${n}, kiekvienos modulis ${root(aw, n)} = ${rho}`),
        st('Jų argumentai:', [num(`pirmoji šaknis (${I('k')} = 0): φ<sub>0</sub> =`, { mod: 2 * PI }), num('kampas tarp gretimų šaknų =')], [angM(m0), angM(stepm)], 'Pirmoji: θ/n. Žingsnis: 2π/n.', `φ<sub>0</sub> = ${angM(m0).h}, toliau vis pridedame ${angM(stepm).h}: ${[...Array(n).keys()].map(k => angM(m0 + stepm * k).h).join(', ')}`),
        st(`Šaknį, kai ${I('k')} = ${K} (argumentas ${angM(rk.m).h}), užrašykite pavidalu a + bi. Šaknis rašykite taip: sqrt(3)/2. ${NEGIML}`, ReIm(), [rk.re, rk.im], `cos ${angM(rk.m).h} = ${sdH(cosE(rk.m))}, sin ${angM(rk.m).h} = ${sdH(sinE(rk.m))}; padauginkite iš modulio ${rho}.`, 'Visos šaknys: ' + [...Array(n).keys()].map(k => cxSd(rt(k).re, rt(k).im)).join('; &nbsp;'))
      ]
    };
  });

regLT('cquad', 'Kvadratinė lygtis, kai D < 0',
  'D = b² − 4ac. Kai D neigiamas, √D = i·√|D|, ir z = (−b ± i√|D|) / 2a. Abu sprendiniai yra vienas kitam jungtiniai skaičiai.',
  () => {
    const a = ri(-5, 5), b = ri(1, 6), p = -2 * a, q = a * a + b * b, Dv = p * p - 4 * q;
    return {
      q: `Išspręskite lygtį ${poly([q, p, 1], 'z')} = 0, kai ${I('z')} ∈ ℂ.`,
      steps: [
        st('Diskriminantas:', [num(`${I('D')} =`)], [Dv], 'D = b² − 4ac', `${I('D')} = ${P(p)}² − 4·${q} = ${H(Dv)}`),
        st(`Kadangi D &lt; 0, √D yra menamasis skaičius:`, [num(`√${I('D')} =`, { after: I('i') })], [2 * b], `√(${H(Dv)}) = √${-Dv}·i`, `√${I('D')} = ${2 * b}${I('i')}`),
        st('Sprendiniai:', [num(`${I('z')} =`, { w: 4 }), num('±', { after: I('i'), w: 4 })], [a, b], `z = (−b ± √D)/2 = (${H(-p)} ± ${2 * b}i)/2. Menamąją dalį įveskite kaip teigiamą skaičių.`, `${sub('z', '1,2')} = ${a === 0 ? '' : H(a) + ' '}± ${b === 1 ? '' : b}${I('i')}`, { val: v => (close(v[0], a) && close(Math.abs(v[1]), b)) ? true : { bad: [close(v[0], a) ? null : { f: 0 }, close(Math.abs(v[1]), b) ? null : { f: 1 }].filter(Boolean) } })
      ]
    };
  });

regLT('reduction', 'Redukcijos formulės',
  'Dvi taisyklės. (1) Pavadinimas: jei kampe yra π/2 arba 3π/2, sin ir cos susikeičia; jei π arba 2π – funkcija lieka ta pati. (2) Ženklas: tarkite, kad α yra mažas smailusis kampas, nustatykite, kuriame ketvirtyje yra visas kampas, ir imkite ženklą, kurį tame ketvirtyje turi <b>pradinė</b> funkcija.',
  () => {
    const f = pick(['sin', 'cos']), b = pick([1, 2, 3, 4]), s = pick([1, -1]), extra = pick([0, 0, 0, 2, 4]);
    const merged = b === 4 && extra > 0, base = merged ? (extra + 2) + 'π' : ang(new Q(b, 2)).h, exh = `${f}(${extra && !merged ? extra + 'π + ' : ''}${base} ${s > 0 ? '+' : '−'} α)`;   // 2π + 2π is written as 4π
    const al = 0.37, x = b * PI / 2 + s * al, v = f === 'sin' ? Math.sin(x) : Math.cos(x);
    const opts = [['sin α', Math.sin(al)], ['−sin α', -Math.sin(al)], ['cos α', Math.cos(al)], ['−cos α', -Math.cos(al)]], ans = opts.findIndex(o => Math.abs(o[1] - v) < 1e-9);
    const qd = ((b + (s > 0 ? 0 : -1)) % 4 + 4) % 4, qn = ['I', 'II', 'III', 'IV'][qd], swap = b % 2 === 1, pos = v > 0;
    return {
      q: `Suprastinkite pritaikydami trigonometrinių funkcijų redukcijos savybes: ${exh}.`,
      steps: [st('', [choice(opts.map(o => o[0]))], [ans], `${extra && !merged ? `Pirmiausia atmeskite ${extra}π (pilni apsisukimai nieko nekeičia). ` : ''}Ar ${base} keičia funkcijos pavadinimą? Kuriame ketvirtyje yra kampas ${base} ${s > 0 ? '+' : '−'} α, kai α mažas?`,
        `${swap ? `${base} keičia ${f} į ${f === 'sin' ? 'cos' : 'sin'}` : `${base} palieka ${f}`}. Kampas yra ${qn} ketvirtyje, kur ${f} ${pos ? 'teigiamas' : 'neigiamas'}. Atsakymas: ${opts[ans][0]}.`)]
    };
  });

/* ---------- 7 tema ---------- */
const isEigVecL = (A, l, v) => { const r = isEigVec(A, l, v); if (r === true) return true; return r.startsWith('An eigenvector cannot') ? 'Tikrinis vektorius negali būti nulinis. Pasirinkite laisvą reikšmę, pavyzdžiui, 1.' : `Šis vektorius netenkina lygties (A − λI)v = 0, kai λ = ${H(l)}. Įstatykite jį į abi lygtis.`; };
const vecStepL = (A, l, v, name) => {
  const n = A.length, Sx = shiftM(A, l), xs = ['x', 'y', 'z'].slice(0, n).map(c => n === 2 ? sub('x', c === 'x' ? 1 : 2) : I(c));
  return st(`Tikrinis vektorius, kai λ = ${H(l)}. Išspręskite (${AmL(l)})${I('v')} = 0; tinka bet kuris nenulinis sprendinys.`, [mat(n, 1, `${name} =`)], [v.map(x => [x])],
    `${AmL(l)} = ${M(Sx)}. Lygtys yra viena kitos kartotinės, todėl užtenka vienos: vienam nežinomajam priskirkite 1 ir išreikškite kitus.`,
    `${sys(Sx.map(r => terms(r.map((c, j) => [c, xs[j]])) + ' = 0'))} &nbsp;⇒&nbsp; pavyzdžiui, ${name} = ${V(v)} (tinka bet kuris kartotinis).`,
    { val: vals => isEigVecL(A, l, vals[0].map(r => r[0])) });
};
const lamSetL = (l, labels) => st('Išspręskite ją. Tikrines reikšmes įveskite bet kuria tvarka:', l.map((_, k) => num(`λ<sub>${k + 1}</sub> =`)), l, labels.hint, labels.sol,
  { val: v => { const a = v.slice().sort((x, y) => x - y), b = l.slice().sort((x, y) => x - y); return a.every((x, k) => close(x, b[k])) ? true : 'Tai nėra charakteristinės lygties šaknys. Patikrinkite skaidymą daugikliais arba diskriminantą.'; } });
const charStepL = e => st(`Charakteristinė lygtis |${I('A')} − λ${I('I')}| = 0. Užrašykite ją pavidalu:`, [num('λ<sup>2</sup> +', { after: 'λ', w: 4 }), num('+', { after: '= 0', w: 4 })], [-e.t, e.d],
  `${D([[dl(e.A[0][0]), e.A[0][1]], [e.A[1][0], dl(e.A[1][1])]])} = ${gl(e.A[0][0])}${gl(e.A[1][1])} − ${P(e.A[0][1])}·${P(e.A[1][0])}. Trumpiau: λ² − (pėdsakas)λ + det.`,
  `${lamPoly(e)} = 0 &nbsp; (pėdsakas = ${H(e.t)}, det = ${H(e.d)})`);
const EIGL = 'Tikrinės reikšmės: sprendžiame |A − λI| = 0. Matricai 2×2 tai λ² − (a + d)λ + (ad − bc) = 0. Tikrinis vektorius kiekvienai λ: įstatykite λ į (A − λI)v = 0. Lygtys tampa proporcingos, todėl užtenka vienos: vieną nežinomąjį pasirinkite laisvai (pavyzdžiui, 1) ir raskite kitą. Bet kuris nenulinis kartotinis taip pat yra tikrinis vektorius.';

regLT('eig2', 'Tikrinės reikšmės ir tikriniai vektoriai 2×2', EIGL,
  () => {
    const e = eigA(), vs = e.l.map(l => eigvec2(e.A, l));
    return {
      q: `Apskaičiuokite matricos ${E('A', M(e.A))} tikrines reikšmes ir tikrinius vektorius.`,
      steps: [charStepL(e), lamSetL(e.l, { hint: `Raskite du skaičius, kurių suma ${H(e.t)}, o sandauga ${H(e.d)}, arba naudokite diskriminantą.`, sol: `λ<sub>1</sub> = ${H(e.l[0])}, λ<sub>2</sub> = ${H(e.l[1])}` }),
      vecStepL(e.A, e.l[0], vs[0], sub('v', 1)), vecStepL(e.A, e.l[1], vs[1], sub('v', 2))]
    };
  });

regLT('eig3', 'Tikrinės reikšmės ir tikriniai vektoriai 3×3',
  EIGL + ' Matricai 3×3 determinantą |A − λI| skleiskite pagal eilutę arba stulpelį su dviem nuliais: daugiklis (g − λ) išsikelia iš karto ir lieka 2×2 determinantas.',
  () => {
    const t = eig3A();
    return {
      q: `Apskaičiuokite matricos ${E('A', M(t.A))} tikrines reikšmes ir tikrinius vektorius.`,
      steps: [lamSetL(t.l, { hint: `Skleiskite |A − λI| pagal ${t.low ? '3 stulpelį' : '3 eilutę'}: ${gl(t.g)}·${D([[dl(t.e.A[0][0]), t.e.A[0][1]], [t.e.A[1][0], dl(t.e.A[1][1])]])} = 0.`, sol: `${gl(t.g)}(${lamPoly(t.e)}) = 0 &nbsp;⇒&nbsp; λ = ${t.l.map(H).join('; ')}` }),
      ...t.l.map((l, k) => vecStepL(t.A, l, t.vs[k], sub('v', k + 1)))]
    };
  });

regLT('iseig', 'Ar k yra tikrinė reikšmė?',
  'k yra tikrinė reikšmė tada ir tik tada, kai det(A − kI) = 0. Iš kiekvieno įstrižainės elemento atimkite k ir apskaičiuokite determinantą.',
  () => {
    const big3 = Math.random() < 0.3; let A, ls;
    if (big3) { const t = eig3A(); A = t.A; ls = t.l; } else { const e = eigA(); A = e.A; ls = e.l; }
    let k = pick(ls); if (Math.random() < 0.45) { do { k = ri(-4, 6); } while (ls.includes(k)); }
    const Sx = shiftM(A, k), d = det(Sx), yes = d === 0;
    return {
      q: `Nustatykite, ar skaičius ${I('k')} = ${H(k)} yra matricos ${E('A', M(A))} tikrinė reikšmė.`,
      steps: [
        st(`Iš įstrižainės elementų atimkite ${H(k)} ir apskaičiuokite determinantą:`, [num(`det(${AmL(k)}) =`)], [d], `${AmL(k)} = ${M(Sx)}`, `${D(Sx)} = ${big3 ? detSol(Sx) : d2s(Sx) + ' = ' + H(d)}`),
        st('Ar tai tikrinė reikšmė?', [choice(['Taip', 'Ne'])], [yes ? 0 : 1], 'Tikrinė reikšmė ⇔ determinantas lygus 0.', yes ? 'Determinantas lygus 0, todėl taip.' : 'Determinantas nelygus 0, todėl ne.')
      ]
    };
  });

/* ---------- 8 tema ---------- */
regLT('pdp', 'Diagonalizavimas: A = PDP⁻¹',
  'D – diagonalioji matrica su tikrinėmis reikšmėmis įstrižainėje. P stulpeliai yra tikriniai vektoriai, išdėstyti <b>ta pačia tvarka</b> kaip tikrinės reikšmės matricoje D. P<sup>−1</sup> – įprasta matricos P atvirkštinė 2×2 matrica. Tada A<sup>t</sup> = P·D<sup>t</sup>·P<sup>−1</sup>.',
  () => {
    let e, l, vs, Pm; do { e = eigA(); l = [e.l[1], e.l[0]]; vs = l.map(v => eigvec2(e.A, v)); Pm = T(vs); } while (Math.abs(det2(Pm)) > 6);   // keeps P⁻¹ to simple fractions
    const Dm = [[l[0], 0], [0, l[1]]], Pi = inv2(Pm);
    return {
      q: `Parodykite, kad ${I('A')} = ${I('PDP')}<sup>−1</sup>, kai ${I('P')} yra matrica, kurios stulpeliai yra matricos ${I('A')} tikriniai vektoriai, o ${I('D')} – diagonalioji matrica su atitinkamomis tikrinėmis reikšmėmis, kai ${E('A', M(e.A))}.`,
      steps: [
        lamSetL(e.l, { hint: `${lamPoly(e)} = 0`, sol: `${lamPoly(e)} = 0 &nbsp;⇒&nbsp; λ = ${H(e.l[0])}; ${H(e.l[1])}` }),
        st('Diagonalioji tikrinių reikšmių matrica (bet kuria tvarka):', [mat(2, 2, `${I('D')} =`)], [Dm], 'Tikrinės reikšmės įstrižainėje, kitur nuliai.', E('D', M(Dm)),
          { val: (v, ctx) => { const [[a, b], [c, d]] = v[0]; if (!close(b, 0) || !close(c, 0)) return { bad: [{ f: 0, cells: [[0, 1], [1, 0]].filter(([i, j]) => !close(v[0][i][j], 0)) }], msg: 'Matricos D elementai ne įstrižainėje lygūs 0.' }; const ok = (close(a, l[0]) && close(d, l[1])) || (close(a, l[1]) && close(d, l[0])); if (ok) ctx.D = [a, d]; return ok ? true : 'Įstrižainėje turi būti abi tikrinės reikšmės.'; }, save: ctx => { ctx.D = ctx.D || l; } }),
        st(ctx => `Tikriniai vektoriai stulpeliuose, ta pačia tvarka kaip matricoje ${I('D')}: 1 stulpelis – kai λ = ${H(ctx.D[0])}, 2 stulpelis – kai λ = ${H(ctx.D[1])}.`, [mat(2, 2, `${I('P')} =`)], [Pm], 'Kiekvienai tikrinei reikšmei išspręskite (A − λI)v = 0 ir vektorius surašykite greta.', ctx => { const p = T(ctx.D.map(v => eigvec2(e.A, v))); return `Pavyzdžiui, ${E('P', M(p))} (stulpelius galima dauginti iš skaičiaus).`; },
          { val: (v, ctx) => { const p = v[0], c1 = isEigVec(e.A, ctx.D[0], [p[0][0], p[1][0]]), c2 = isEigVec(e.A, ctx.D[1], [p[0][1], p[1][1]]); if (c1 !== true) return { bad: [{ f: 0, cells: [[0, 0], [1, 0]] }], msg: `1 stulpelis nėra tikrinis vektorius, kai λ = ${H(ctx.D[0])}.` }; if (c2 !== true) return { bad: [{ f: 0, cells: [[0, 1], [1, 1]] }], msg: `2 stulpelis nėra tikrinis vektorius, kai λ = ${H(ctx.D[1])}.` }; ctx.P = p; return true; }, save: ctx => { ctx.P = ctx.P || T(ctx.D.map(v => eigvec2(e.A, v))); }, ansFn: ctx => [T(ctx.D.map(v => eigvec2(e.A, v)))] }),
        st(ctx => `Raskite savo matricos ${E('P', M(ctx.P))} atvirkštinę matricą:`, [mat(2, 2, `${I('P')}<sup>−1</sup> =`)], [Pi], INV2L, ctx => { const p = ctx.P, d = det2(p); return `det P = ${H(fr(d))}, &nbsp; ${I('P')}<sup>−1</sup> = ${M([[p[1][1] / d, -p[0][1] / d], [-p[1][0] / d, p[0][0] / d]].map(r => r.map(fr)))}`; },
          { val: (v, ctx) => { const x = v[0], p = ctx.P, pr = [[p[0][0] * x[0][0] + p[0][1] * x[1][0], p[0][0] * x[0][1] + p[0][1] * x[1][1]], [p[1][0] * x[0][0] + p[1][1] * x[1][0], p[1][0] * x[0][1] + p[1][1] * x[1][1]]]; return (close(pr[0][0], 1) && close(pr[1][1], 1) && Math.abs(pr[0][1]) < 1e-6 && Math.abs(pr[1][0]) < 1e-6) ? true : 'P ir šios matricos sandauga nėra vienetinė matrica. Naudokite (1/det P)·[d, −b; −c, a].'; }, ansFn: ctx => { const p = ctx.P, d = det2(p); return [[[p[1][1] / d, -p[0][1] / d], [-p[1][0] / d, p[0][0] / d]].map(r => r.map(fr))]; } })
      ]
    };
  });

regLT('closed', 'Rekurentinės lygties sprendinys n<sub>t</sub>',
  'n<sub>t</sub> = c<sub>1</sub>λ<sub>1</sub><sup>t</sup>v<sub>1</sub> + c<sub>2</sub>λ<sub>2</sub><sup>t</sup>v<sub>2</sub>. Raskite tikrines reikšmes ir tikrinius vektorius, tada c<sub>1</sub>, c<sub>2</sub> iš pradinės sąlygos: c<sub>1</sub>v<sub>1</sub> + c<sub>2</sub>v<sub>2</sub> = n<sub>0</sub> (dvi lygtys, du nežinomieji).',
  () => {
    let e, vs, c, n0, Tt, nT;
    do {                      // keep the numbers small enough to work out by hand
      e = eigA(); vs = e.l.map(l => eigvec2(e.A, l)); c = [nz(-2, 3), nz(-2, 3)]; n0 = [0, 1].map(i => c[0] * vs[0][i] + c[1] * vs[1][i]); Tt = pick([2, 3]);
      nT = [[n0[0]], [n0[1]]]; for (let k = 0; k < Tt; k++) nT = mmul(e.A, nT);
    } while (Math.max(Math.abs(nT[0][0]), Math.abs(nT[1][0])) > 300 || Math.max(...e.l.map(Math.abs)) > 5);
    const solveC = (v, w) => { const d = v[0] * w[1] - w[0] * v[1]; return [(n0[0] * w[1] - w[0] * n0[1]) / d, (v[0] * n0[1] - n0[0] * v[1]) / d]; };
    return {
      q: `Rekurentinei lygčiai ${I('n')}<sub>t+1</sub> = ${I('A')}${I('n')}<sub>t</sub>, kai ${E('A', M(e.A))} ir ${I('n')}<sub>0</sub> = ${V(n0)}, užrašykite jos sprendinį <span class="nw">${I('n')}<sub>t</sub> = ${sub('c', 1)}λ<sub>1</sub><sup>t</sup>${sub('v', 1)} + ${sub('c', 2)}λ<sub>2</sub><sup>t</sup>${sub('v', 2)}</span>, pasinaudodami matricos ${I('A')} tikrinėmis reikšmėmis ir tikriniais vektoriais.`,
      steps: [
        st('Tikrinės reikšmės (tvarką pasirinkite patys ir jos laikykitės):', [num('λ<sub>1</sub> ='), num('λ<sub>2</sub> =')], e.l, `|A − λI| = ${lamPoly(e)} = 0`, `λ = ${H(e.l[0])} ir ${H(e.l[1])}`,
          { val: (v, ctx) => { const ok = (close(v[0], e.l[0]) && close(v[1], e.l[1])) || (close(v[0], e.l[1]) && close(v[1], e.l[0])); if (ok) ctx.l = [v[0], v[1]]; return ok ? true : 'Tai nėra charakteristinės lygties šaknys.'; }, save: ctx => { ctx.l = ctx.l || e.l; } }),
        st(ctx => `Tikriniai vektoriai: ${sub('v', 1)}, kai λ<sub>1</sub> = ${H(ctx.l[0])}, ir ${sub('v', 2)}, kai λ<sub>2</sub> = ${H(ctx.l[1])}.`, [mat(2, 1, `${sub('v', 1)} =`), mat(2, 1, `${sub('v', 2)} =`)], [vs[0].map(x => [x]), vs[1].map(x => [x])], '(A − λI)v = 0 kiekvienai λ. Tinka bet kuris nenulinis kartotinis.', ctx => `Pavyzdžiui, ${sub('v', 1)} = ${V(eigvec2(e.A, ctx.l[0]))}, ${sub('v', 2)} = ${V(eigvec2(e.A, ctx.l[1]))}.`,
          { val: (v, ctx) => { const a = v[0].map(r => r[0]), b = v[1].map(r => r[0]), c1 = isEigVecL(e.A, ctx.l[0], a), c2 = isEigVecL(e.A, ctx.l[1], b); if (c1 !== true) return { bad: [{ f: 0 }], msg: c1 }; if (c2 !== true) return { bad: [{ f: 1 }], msg: c2 }; ctx.v = [a, b]; return true; }, save: ctx => { ctx.v = ctx.v || ctx.l.map(l => eigvec2(e.A, l)); }, ansFn: ctx => ctx.l.map(l => eigvec2(e.A, l).map(x => [x])) }),
        st(ctx => `Konstantos iš pradinės sąlygos: ${sub('c', 1)}${V(ctx.v[0])} + ${sub('c', 2)}${V(ctx.v[1])} = ${V(n0)}.`, [num(`${sub('c', 1)} =`), num(`${sub('c', 2)} =`)], c, 'Dvi lygtys – po vieną kiekvienai eilutei. Spręskite keitimo arba sudėties būdu.', ctx => { const s = solveC(ctx.v[0], ctx.v[1]); return `${sub('c', 1)} = ${H(fr(s[0]))}, ${sub('c', 2)} = ${H(fr(s[1]))}, todėl ${I('n')}<sub>t</sub> = ${P(fr(s[0]))}·${P(ctx.l[0])}<sup>t</sup>${V(ctx.v[0].map(fr))} + ${P(fr(s[1]))}·${P(ctx.l[1])}<sup>t</sup>${V(ctx.v[1].map(fr))}`; },
          { val: (v, ctx) => { const s = solveC(ctx.v[0], ctx.v[1]); return (close(v[0], s[0]) && close(v[1], s[1])) ? true : { bad: [close(v[0], s[0]) ? null : { f: 0 }, close(v[1], s[1]) ? null : { f: 1 }].filter(Boolean), msg: 'Įstatykite konstantas atgal: c₁v₁ + c₂v₂ turi būti lygu n₀ abiejose eilutėse.' }; }, ansFn: ctx => solveC(ctx.v[0], ctx.v[1]).map(fr) }),
        st(`Pasinaudokite gauta formule, kai ${I('t')} = ${Tt}:`, [mat(2, 1, `${I('n')}<sub>${Tt}</sub> =`)], [nT], `c₁·λ₁<sup>${Tt}</sup>·v₁ + c₂·λ₂<sup>${Tt}</sup>·v₂`, `${I('n')}<sub>${Tt}</sub> = ${M(nT)} (tas pats, kas ${Tt} kartus padauginti iš A).`)
      ]
    };
  });

const LONGL = ['Stabilizuojasi (artėja prie pastovaus nenulinio vektoriaus)', 'Neaprėžtai auga', 'Artėja prie nulio', 'Cikliškai kinta'];
regLT('markov', 'Elgesys ilguoju laikotarpiu (Perron–Frobenius)',
  'Matrica su teigiamais elementais, kurios kiekvieno stulpelio suma lygi 1, visada turi dominuojančią tikrinę reikšmę λ = 1; kita tikrinė reikšmė moduliu mažesnė, todėl jos narys nyksta. Riba – tikrinis vektorius, atitinkantis λ = 1, normuotas taip, kad jo komponenčių suma būtų tokia pati kaip pradinio vektoriaus.',
  () => {
    const frs = [new Q(1, 10), new Q(1, 5), new Q(3, 10), new Q(2, 5), new Q(1, 2), new Q(1, 4)]; let a, b; do { a = pick(frs); b = pick(frs); } while (a.add(b).v >= 1 || a.v === b.v && Math.random() < 0.5);
    const one = new Q(1), A = [[one.sub(a), b], [a, one.sub(b)]], l2 = one.sub(a).sub(b), first = Math.random() < 0.6, y0 = first ? [1, 0] : [0, 1], lm = [b.div(a.add(b)), a.div(a.add(b))];
    return {
      q: `Mutaciją modeliuojanti rekurentinė lygtis yra ${I('y')}<sub>t+1</sub> = ${I('A')}${I('y')}<sub>t</sub>. Tarkime, ${E('A', M(A))} ir ${I('y')}<sub>0</sub> = ${V(y0)}.`,
      steps: [
        st('Apskaičiuokite matricos A tikrines reikšmes (bet kuria tvarka, galima rašyti trupmenas):', [num('λ<sub>1</sub> ='), num('λ<sub>2</sub> =')], [1, l2], 'Kiekvieno stulpelio suma lygi 1, todėl viena tikrinė reikšmė yra 1. Tikrinių reikšmių suma lygi pėdsakui.', `λ<sub>1</sub> = 1, λ<sub>2</sub> = pėdsakas − 1 = ${H(l2)}`,
          { val: v => ((close(v[0], 1) && close(v[1], l2.v)) || (close(v[1], 1) && close(v[0], l2.v))) ? true : 'Pasitikrinkite: λ² − (pėdsakas)λ + det = 0.' }),
        st(`Pasinaudodami Perron–Frobenius teorema nustatykite, koks yra ${I('y')}<sub>t</sub> elgesys ilguoju laikotarpiu.`, [choice(LONGL)], [0], 'Narys su |λ| &lt; 1 nyksta; narys su λ = 1 nekinta.', `(${H(l2)})<sup>t</sup> → 0, o 1<sup>t</sup> = 1, todėl ${I('y')}<sub>t</sub> ilguoju laikotarpiu stabilizuojasi.`),
        st('Prie kokio vektoriaus artėja?', [mat(2, 1, `lim ${I('y')}<sub>t</sub> =`)], [lm.map(x => [x])], `Tikrinis vektorius, kai λ = 1: išspręskite (A − I)v = 0. Tada normuokite jį taip, kad komponenčių suma būtų ${y0[0] + y0[1]} – kaip vektoriaus y₀.`, `Tikrinis vektorius, kai λ = 1, proporcingas ${V(normv([b.mul(20).v, a.mul(20).v]))}; normavus, kad suma būtų 1: ${V(lm)}`)
      ]
    };
  });

regLT('longrun', 'Ilgalaikis elgesys pagal tikrines reikšmes',
  'Žiūrėkite į didžiausią moduliu tikrinę reikšmę. |λ| &gt; 1: neaprėžtas augimas. Visos |λ| &lt; 1: artėja prie nulio. Didžiausia lygi tiksliai 1 (kitos mažesnės): stabilizuojasi. Yra −1 ir nėra didesnių moduliu: ženklas keičiasi kiekviename žingsnyje, todėl kinta cikliškai.',
  () => {
    const [l, ans] = pick([[[new Q(1, 2), new Q(1, 3)], 2], [[new Q(1, 2), new Q(-1, 5)], 2], [[new Q(9, 10), new Q(1, 2)], 2], [[new Q(2), new Q(1, 2)], 1], [[new Q(3, 2), new Q(1)], 1], [[new Q(1), new Q(1, 2)], 0], [[new Q(1), new Q(-1, 3)], 0], [[new Q(1), new Q(-1)], 3], [[new Q(-1), new Q(1, 2)], 3]]);
    const ord = shuffle(l), up = Math.random() < 0.5, s = pick([0, 1, 1, 2]), A = up ? [[ord[0], s], [0, ord[1]]] : [[ord[0], 0], [s, ord[1]]];
    return {
      q: `Tegul ${I('v')}<sub>t+1</sub> = ${I('A')}${I('v')}<sub>t</sub>, kai ${E('A', M(A))}, o pradinis vektorius yra bendrojo pavidalo (išreiškiamas per abu tikrinius vektorius).`,
      steps: [
        st('Tikrinės reikšmės (bet kuria tvarka):', [num('λ<sub>1</sub> ='), num('λ<sub>2</sub> =')], ord, 'Trikampės matricos tikrinės reikšmės yra jos įstrižainės elementai.', `λ = ${H(ord[0])}; ${H(ord[1])} (trikampės matricos įstrižainė).`,
          { val: v => ((close(v[0], ord[0].v) && close(v[1], ord[1].v)) || (close(v[1], ord[0].v) && close(v[0], ord[1].v))) ? true : 'Trikampės matricos tikrines reikšmes galima nuskaityti nuo įstrižainės.' }),
        st(`Apibūdinkite ${I('v')}<sub>t</sub> elgesį ilguoju laikotarpiu.`, [choice(LONGL)], [ans], 'v<sub>t</sub> = c₁λ₁<sup>t</sup>v₁ + c₂λ₂<sup>t</sup>v₂. Kas nutinka kiekvienam λ<sup>t</sup>, kai t didėja?', ['Didžiausia |λ| lygi tiksliai 1, o kitas narys nyksta, todėl stabilizuojasi.', 'Viena tikrinė reikšmė turi |λ| &gt; 1, todėl jos narys neaprėžtai auga.', 'Abi |λ| &lt; 1, todėl abu nariai artėja prie nulio.', '(−1)<sup>t</sup> be paliovos kaitaliojasi tarp +1 ir −1, o joks kitas narys jo neužgožia, todėl kinta cikliškai.'][ans])
      ]
    };
  });

/* ---------- 9 tema ---------- */
const LOPTL = ['0', '+∞', '−∞', 'Neapibrėžtumas: reikia pertvarkyti'];
regLT('limsym', 'Simbolinės išraiškos: skaičius/∞, 0/0',
  'skaičius/∞ = 0. skaičius/0 = ∞. a<sup>+∞</sup> = ∞ ir a<sup>−∞</sup> = 0, kai a &gt; 1. Išraiškos 0/0, ∞/∞ ir ∞ − ∞ yra neapibrėžtumai: pirmiausia reikia pertvarkyti (išskaidyti daugikliais, padauginti iš jungtinio reiškinio arba iškelti aukščiausią laipsnį ir suprastinti).',
  () => {
    const c = ri(2, 9), a = ri(2, 5), bank = [
      [big(c, '+∞'), 0], [big(-c, '+∞'), 0], [big(0, '∞'), 0], [`${a}<sup>−∞</sup>`, 0], [`(${FR(1, a)})<sup>+∞</sup>`, 0], [big(c, `${a}<sup>+∞</sup>`), 0],
      [`${a}<sup>+∞</sup>`, 1], [`${c}·(+∞)`, 1], ['(+∞) + (+∞)', 1], ['(+∞)·(+∞)', 1], [big('+∞', c), 1], [`(${FR(1, a)})<sup>−∞</sup>`, 1],
      [`${MIN}${c}·(+∞)`, 2], [big('−∞', c), 2], ['(+∞)·(−∞)', 2],
      [big(0, 0), 3], [big('∞', '∞'), 3], ['(+∞) − (+∞)', 3], ['0·∞', 3]];
    const qs = shuffle(bank).slice(0, 4);
    const why = ['Pastovus skaičius, padalytas iš labai didelio, yra labai mažas; pagrindas, didesnis už 1, su labai neigiamu rodikliu yra vienetas, padalytas iš labai didelio skaičiaus.', 'Neaprėžtai didėja su pliuso ženklu.', 'Neaprėžtai didėja moduliu su minuso ženklu.', 'Dvi dalys „traukia“ į priešingas puses; rezultatas priklauso nuo konkrečių funkcijų.'];
    return { q: 'Išsiaiškinkite, kam lygi kiekviena simbolinė išraiška.', steps: qs.map(([h, a]) => st(`<span class="bigq">${h}</span>`, [choice(LOPTL)], [a], 'Į ∞ žiūrėkite kaip į „neaprėžtai didėjantį skaičių“, o į 0 – kaip į „prie nulio artėjantį skaičių“.', why[a])) };
  });

regLT('limside', 'Vienpusės ribos',
  'Arti 0 trupmena c/x<sup>n</sup> neaprėžtai didėja moduliu; reikia nustatyti tik ženklą. Iš dešinės (x → 0⁺, kitaip x → 0 + 0) x teigiamas. Iš kairės (x → 0⁻, kitaip x → 0 − 0) x neigiamas, o x<sup>n</sup> neigiamas tik tada, kai n nelyginis. Kai x → ±∞, trupmena artėja prie 0.',
  () => {
    const mk = () => {
      const c = nz(-5, 6), n = ri(1, 4), a = pick([0, 0, 0, ri(1, 4), -ri(1, 3)]), side = pick([1, 1, -1, -1, 2]);
      const den = n === 1 ? (a ? `(${lin(a)})` : I('x')) : (a ? `(${lin(a)})<sup>${n}</sup>` : `${I('x')}<sup>${n}</sup>`), f = big(H(c), a && n === 1 ? lin(a) : den);
      if (side === 2) { const to = pick(['+∞', '−∞']); return st(`${limOf('x', to, f)}`, [choice(LOPTL.slice(0, 3))], [0], 'Vardiklis neaprėžtai didėja moduliu.', 'skaičius/∞ = 0'); }
      const sg = Math.sign(c) * (side < 0 && n % 2 ? -1 : 1), to = `${H(a)}${side > 0 ? '<sup>+</sup>' : '<sup>−</sup>'}`;
      return st(`${limOf('x', to, f)}`, [choice(LOPTL.slice(0, 3))], [sg > 0 ? 1 : 2], `x artėja prie ${H(a)} iš ${side > 0 ? 'dešinės' : 'kairės'}, todėl ${a ? lin(a) : 'x'} yra labai mažas ${side > 0 ? 'teigiamas' : 'neigiamas'} skaičius. Koks laipsnio ženklas? O visos trupmenos?`,
        `Vardiklis: labai mažas ${side < 0 && n % 2 ? 'neigiamas' : 'teigiamas'} skaičius. Skaitiklis ${H(c)} yra ${c > 0 ? 'teigiamas' : 'neigiamas'}. Atsakymas: ${sg > 0 ? '+∞' : '−∞'}.`);
    };
    return { q: 'Apskaičiuokite ribas.', steps: [mk(), mk(), mk()] };
  });

regLT('limrat', 'Racionalioji trupmena, kai x → ∞',
  'Neapibrėžtumas ∞/∞: skaitiklyje ir vardiklyje iškelkite aukščiausią laipsnį ir suprastinkite (arba tiesiog palyginkite vyriausiuosius narius). Laipsniai vienodi: vyriausiųjų koeficientų santykis. Vardiklio laipsnis didesnis: 0. Skaitiklio laipsnis didesnis: ±∞, ženklas toks pat kaip vyriausiųjų koeficientų santykio.',
  () => {
    const v = pick(['x', 'n']), kind = pick([0, 0, 0, 1, 2]), q = ri(1, 5), p = kind === 0 ? q : kind === 1 ? ri(0, q - 1) : q + ri(1, 2), lp = nz(-5, 6), lq = nz(-5, 6);
    const np = p === 0 ? [lp] : randPoly(p, lp), dp = randPoly(q, lq), desc = Math.random() < 0.5;
    const ans = kind === 0 ? new Q(lp, lq) : kind === 1 ? 0 : (lp / lq > 0 ? Infinity : -Infinity);
    return {
      q: `Apskaičiuokite ribą ${limOf(v, '+∞', big(poly(np, v, desc), poly(dp, v, desc)))}.`,
      steps: [
        st('Aukščiausias kintamojo laipsnis:', [num('skaitiklyje:', { w: 3 }), num('vardiklyje:', { w: 3 })], [p, q], 'Ieškokite didžiausio laipsnio rodiklio, kad ir kurioje reiškinio vietoje jis būtų.', `Skaitiklyje: ${pw(v, p) || v + ' nėra (laipsnis 0)'}, vardiklyje: ${pw(v, q)}.`),
        st('Riba:', [num('=', INF)], [ans], kind === 0 ? 'Laipsniai vienodi: padalykite vyriausiuosius koeficientus.' : kind === 1 ? 'Vardiklis auga greičiau.' : 'Skaitiklis auga greičiau. Koks ženklas?', kind === 0 ? `Vyriausieji nariai: ${big(terms([[lp, pw(v, p)]]), terms([[lq, pw(v, q)]]))} → ${H(ans)}` : kind === 1 ? 'Skaitiklio laipsnis mažesnis: riba lygi 0.' : `Vyriausieji nariai: ${big(terms([[lp, pw(v, p)]]), terms([[lq, pw(v, q)]]))} = ${terms([[new Q(lp, lq), pw(v, p - q)]])} → ${H(ans)}`)
      ]
    };
  });

regLT('limfactor', '0/0: skaidymas daugikliais',
  'Įstatę gauname 0/0, vadinasi, ir skaitiklis, ir vardiklis dalijasi iš (x − a). Išskaidykite abu daugikliais (kvadratinio trinario šaknys arba a² − b² = (a − b)(a + b), a³ − b³ = (a − b)(a² + ab + b²)), suprastinkite (x − a) ir tada įstatykite.',
  () => {
    if (Math.random() < 0.3) {
      const a = pick([1, 2, 3, -1, -2]), ans = new Q(3 * a, 2);
      return {
        q: `Apskaičiuokite ribą ${limOf('x', H(a), big(poly([-a * a * a, 0, 0, 1], 'x'), poly([-a * a, 0, 1], 'x')))}.`,
        steps: [
          st(`Skaitiklis = (${lin(a)})·(…). Antrasis daugiklis:`, [num(`${I('x')}<sup>2</sup> +`, { after: I('x'), w: 4 }), num('+', { w: 4 })], [a, a * a], 'a³ − b³ = (a − b)(a² + ab + b²)', `${poly([-a * a * a, 0, 0, 1], 'x')} = (${lin(a)})(${poly([a * a, a, 1], 'x')})`),
          st(`Vardiklis = (${lin(a)})·(…). Antrasis daugiklis:`, [num(`${I('x')} +`, { w: 4 })], [a], 'a² − b² = (a − b)(a + b)', `${poly([-a * a, 0, 1], 'x')} = (${lin(a)})(${lin(-a)})`),
          st(`Suprastinkite (${lin(a)}) ir įstatykite ${I('x')} = ${H(a)}:`, [num('riba =', INF)], [ans], `${big(poly([a * a, a, 1], 'x'), lin(-a))}, kai x = ${H(a)}`, `${big(H(3 * a * a), H(2 * a))} = ${H(ans)}`)
        ]
      };
    }
    let a, r1, r2; do { a = ri(-4, 5); r1 = ri(-5, 6); r2 = ri(-5, 6); } while (r1 === a || r2 === a || r1 === r2);
    const np = [a * r1, -(a + r1), 1], dp = [a * r2, -(a + r2), 1], ans = new Q(a - r1, a - r2);
    return {
      q: `Apskaičiuokite ribą ${limOf('x', H(a), big(poly(np, 'x'), poly(dp, 'x')))}.`,
      steps: [
        st(`Įstatę ${I('x')} = ${H(a)} gauname 0/0, todėl abu reiškiniai turi daugiklį (${lin(a)}). Raskite kitą kiekvieno šaknį:`, [num('kita skaitiklio šaknis:', { w: 4 }), num('kita vardiklio šaknis:', { w: 4 })], [r1, r2], 'Naudokite diskriminantą arba Vieto teoremą: šaknų sandauga lygi laisvajam nariui.', `Skaitiklis = (${lin(a)})(${lin(r1)}), vardiklis = (${lin(a)})(${lin(r2)})`),
        st(`Suprastinkite (${lin(a)}) ir įstatykite ${I('x')} = ${H(a)}:`, [num('riba =', INF)], [ans], `${big(lin(r1), lin(r2))}, kai x = ${H(a)}`, `${big(`${H(a)} − ${P(r1)}`, `${H(a)} − ${P(r2)}`)} = ${H(ans)}`)
      ]
    };
  });

regLT('limconj', '0/0 su šaknimi: jungtinis reiškinys',
  'Skaitiklį ir vardiklį padauginkite iš jungtinio reiškinio (tie patys du nariai, tik priešingas ženklas tarp jų). (a − b)(a + b) = a² − b² panaikina šaknį. Tada daugiklis susiprastina su kita trupmenos dalimi ir galima įstatyti.',
  () => {
    const kind = ri(0, 2);
    if (kind === 2) {
      const a = pick([1, 4, 9]), b = ri(1, 5), c = ri(1, 5), d = pick([1, 1, 2, 3]), ra = Math.sqrt(a), ans = new Q(b + c, 2 * ra * d);
      const s1 = root(terms([[a, ''], [b, I('x')]])), s2 = root(terms([[a, ''], [-c, I('x')]]));
      return {
        q: `Apskaičiuokite ribą ${limOf('x', 0, big(`${s1} − ${s2}`, terms([[d, I('x')]])))}.`,
        steps: [
          st(`Skaitiklį ir vardiklį padauginkite iš ${s1} + ${s2}. Skaitiklis tampa:`, [num('', { after: `·${I('x')}`, w: 4 })], [b + c], `(${terms([[a, ''], [b, I('x')]])}) − (${terms([[a, ''], [-c, I('x')]])})`, `(${terms([[a, ''], [b, I('x')]])}) − (${terms([[a, ''], [-c, I('x')]])}) = ${b + c}${I('x')}`),
          st(`Suprastinkite ${I('x')}, tada įstatykite ${I('x')} = 0:`, [num('riba =', INF)], [ans], `${big(b + c, `${d === 1 ? '' : d + '·'}(${s1} + ${s2})`)}, kai x = 0`, `${big(b + c, `${d === 1 ? '' : d + '·'}(${ra} + ${ra})`)} = ${H(ans)}`)
        ]
      };
    }
    const a = ri(-2, 5), r = ri(1, 5), p = ri(1, 5), q = r * r - p * a, rt = root(terms([[p, I('x')], [q, '']])), flip = kind === 1, ans = flip ? new Q(2 * r, p) : new Q(p, 2 * r);
    const top = `${rt} − ${r}`, bot = lin(a);
    return {
      q: `Apskaičiuokite ribą ${limOf('x', H(a), flip ? big(bot, top) : big(top, bot))}.`,
      steps: [
        st(`Skaitiklį ir vardiklį padauginkite iš jungtinio reiškinio ${rt} + ${r}. Tada (${rt} − ${r})(${rt} + ${r}) supaprastėja iki:`, [num('', { after: `·(${lin(a)})`, w: 4 })], [p], `(${terms([[p, I('x')], [q, '']])}) − ${r * r} = ${terms([[p, I('x')], [q - r * r, '']])}. Iškelkite bendrą daugiklį.`, `${terms([[p, I('x')], [q - r * r, '']])} = ${p}(${lin(a)})`),
        st(`Suprastinus (${lin(a)}) lieka jungtinis reiškinys. Kai ${I('x')} = ${H(a)}: ${rt} + ${r} =`, [num('')], [2 * r], `√(${p}·${P(a)} ${q < 0 ? '−' : '+'} ${Math.abs(q)}) + ${r}`, `√${r * r} + ${r} = ${2 * r}`),
        st('Taigi riba lygi:', [num('riba =', INF)], [ans], flip ? `Lieka ${p === 1 ? `√… + ${r}` : `(√… + ${r})/${p}`}.` : `Lieka ${p}/(√… + ${r}).`, flip ? `${p === 1 ? '' : big(2 * r, p) + ' = '}${H(ans)}` : `${big(p, 2 * r)} = ${H(ans)}`)
      ]
    };
  });

regLT('limroot', 'Šaknys, kai x → ∞',
  'Po šaknimi svarbus tik aukščiausias laipsnis: √(a²x² + …) elgiasi kaip a·x, ³√(8x⁶ + …) – kaip 2x² (kai x → +∞). Kiekvieną šaknį pakeiskite jos vyriausiuoju nariu, tada lyginkite vyriausiuosius narius kaip racionaliosiose trupmenose.',
  () => {
    const kind = ri(0, 2);
    if (kind === 0) {
      const a = ri(1, 4), d = nz(-3, 4), c = ri(1, 6), e = pick(['π', '1', '3', '5']), ans = new Q(a, d), rt = root(terms([[c, ''], [a * a, pw('x', 2)]]));
      return {
        q: `Apskaičiuokite ribą ${limOf('x', '+∞', big(rt, `${e} ${d < 0 ? '−' : '+'} ${Math.abs(d) === 1 ? '' : Math.abs(d)}${I('x')}`))}.`,
        steps: [
          st(`Kai ${I('x')} reikšmės didelės, ${rt} elgiasi kaip:`, [num('', { after: `·${I('x')}`, w: 4 })], [a], '√(a²x²) = a·x, kai x teigiamas; konstanta po šaknimi nebeturi įtakos.', `${rt} ≈ ${root(terms([[a * a, pw('x', 2)]]))} = ${terms([[a, I('x')]])}`),
          st('Palyginkite vyriausiuosius narius:', [num('riba =', INF)], [ans], `${big(terms([[a, I('x')]]), terms([[d, I('x')]]))}`, `${big(terms([[a, I('x')]]), terms([[d, I('x')]]))} → ${H(ans)}`)
        ]
      };
    }
    if (kind === 1) {
      const pairs = [[8, 2, 2], [18, 2, 3], [12, 3, 2], [27, 3, 3], [5, 3, 0], [7, 2, 0], [2, 3, 0], [20, 5, 2], [3, 1, 0], [32, 2, 4]], [p, q, sq] = pick(pairs), b = ri(1, 5), c = ri(1, 5);
      const ans = sq ? sq : { v: Math.sqrt(p / q), s: `sqrt(${new Q(p, q).str()})`, h: root(H(new Q(p, q))) };
      return {
        q: `Apskaičiuokite ribą ${limOf('x', '+∞', big(root(terms([[b, ''], [p, I('x')]])), root(terms([[q, I('x')], [-c, '']]))))}.`,
        steps: [st('Viską surašykite po viena šaknimi ir palyginkite vyriausiuosius narius. Šaknį rašykite taip: sqrt(5/3).', [num('riba =', INF)], [ans], `${root(big(terms([[b, ''], [p, I('x')]]), terms([[q, I('x')], [-c, '']])))}; trupmena po šaknimi artėja prie ${H(new Q(p, q))}.`, `${root(H(new Q(p, q)))}${sq ? ' = ' + sq : ''}`)]
      };
    }
    const k = pick([2, 3]), m = pick([1, 2]), A0 = pick([1, 2, 3]), A = Math.pow(A0, k), B = nz(-3, 4), C = ri(1, 3), dd = ri(1, 5);
    const numRoot = root(terms([[A, pw('x', k * m)], [ri(1, 4), pw('x', m)], [1, '']]), k === 3 ? 3 : ''), denRoot = root(terms([[1, ''], [ri(1, 3), pw('x', m)], [C * C, pw('x', 2 * m)]]));
    const ans = new Q(A0 + B, C), xm = pw('x', m);
    return {
      q: `Apskaičiuokite ribą ${limOf('x', '+∞', big(`${numRoot} ${B < 0 ? '−' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}${xm}${m === 2 ? ` − 2${I('x')}` : ''}`, `${denRoot} + ${dd}`))}.`,
      steps: [
        st(`Šaknų elgesys, kai ${I('x')} reikšmės didelės:`, [num(`${numRoot} ≈`, { after: `·${xm}`, w: 4 }), num(`${denRoot} ≈`, { after: `·${xm}`, w: 4 })], [A0, C], `Po kiekviena šaknimi palikite tik aukščiausią laipsnį: ${root(terms([[A, pw('x', k * m)]]), k === 3 ? 3 : '')} ir ${root(terms([[C * C, pw('x', 2 * m)]]))}.`, `${numRoot} ≈ ${terms([[A0, xm]])}, &nbsp; ${denRoot} ≈ ${terms([[C, xm]])}`),
        st(`Palyginkite ${xm} koeficientus skaitiklyje ir vardiklyje:`, [num('riba =', INF)], [ans], `Skaitiklis: (${A0} ${B < 0 ? '−' : '+'} ${Math.abs(B)})${xm}. Vardiklis: ${terms([[C, xm]])}.`, `${C === 1 ? `${A0} ${B < 0 ? '−' : '+'} ${Math.abs(B)}` : big(`${A0} ${B < 0 ? '−' : '+'} ${Math.abs(B)}`, C)} = ${H(ans)}`)
      ]
    };
  });
