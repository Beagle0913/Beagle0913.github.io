/* Plain-language notes for every exercise type: the idea, a plan, the usual slip and a quick check.
   Shown beside the problem on wide screens and as a fold-out above it on narrow ones. */
const X = (idea, plan, trap, check) => ({ idea, plan, trap, check });
const CRAMER_EN = X(
  `Each unknown is a ratio of two determinants. The top one is the coefficient table with that unknown's column replaced by the right-hand sides.`,
  [`Δ: determinant of the coefficients.`, `For x: put the right-hand sides in the x-column and take the determinant. Same for the others.`, `Divide each by Δ.`],
  `Replacing a row instead of a column, or mixing up which column belongs to which unknown.`,
  `Put the solution into the equation you looked at least.`);
const CRAMER_LT = X(
  `Kiekvienas nežinomasis – dviejų determinantų santykis. Viršutinis yra koeficientų lentelė, kurioje to nežinomojo stulpelis pakeistas laisvaisiais nariais.`,
  [`Δ – koeficientų determinantas.`, `Nežinomajam x: į x stulpelį rašome laisvuosius narius ir skaičiuojame determinantą. Taip pat ir kitiems.`, `Kiekvieną dalijame iš Δ.`],
  `Pakeisti eilutę vietoj stulpelio arba supainioti, kuris stulpelis kuriam nežinomajam priklauso.`,
  `Įstatome sprendinį į tą lygtį, į kurią žiūrėjome mažiausiai.`);

const EXPLAIN = {
  /* ---------- 1 ---------- */
  closest: {
    en: X(`A coordinate plane is just “one coordinate equals 0”. The xy-plane is the floor z = 0, so your height above it is |z|.`,
      [`Name the coordinate that is missing from the plane's name.`, `Compare the sizes of that coordinate, ignoring signs.`, `A point lies in the plane when that coordinate is exactly 0.`],
      `Looking at x and y for the xy-plane. It is the letter that is not in the name that counts.`,
      `The xy-plane is the floor: a point with z = 0 sits on it.`),
    lt: X(`Koordinačių plokštuma – tai tiesiog „viena koordinatė lygi 0“. xy plokštuma yra grindys z = 0, todėl aukštis virš jų yra |z|.`,
      [`Randame koordinatę, kurios nėra plokštumos pavadinime.`, `Lyginame tos koordinatės modulius (ženklo nepaisome).`, `Taškas priklauso plokštumai, kai ta koordinatė lygi 0.`],
      `xy plokštumai žiūrėti į x ir y. Svarbi ta raidė, kurios pavadinime nėra.`,
      `xy plokštuma – grindys: taškas su z = 0 guli ant jų.`)
  },
  distpt: {
    en: X(`To reach a plane you travel along one coordinate. To reach an axis you must cancel the other two, so it is Pythagoras with those two.`,
      [`Plane: take the missing coordinate and drop its sign.`, `Axis: square the two coordinates that are not the axis letter, add, take the root.`, `Leave roots like √74 as they are.`],
      `Using x for the x-axis. The x-coordinate is exactly the one you do not need.`,
      `A point on the axis itself (other two coordinates 0) must give distance 0.`),
    lt: X(`Iki plokštumos einame išilgai vienos koordinatės. Iki ašies reikia „panaikinti“ kitas dvi, todėl toms dviem taikome Pitagoro teoremą.`,
      [`Plokštuma: imame trūkstamą koordinatę be ženklo.`, `Ašis: keliame kvadratu tas dvi koordinates, kurios nėra ašies raidė, sudedame, traukiame šaknį.`, `Šaknis, tokias kaip √74, paliekame.`],
      `x ašiai naudoti x. Būtent x koordinatės čia ir nereikia.`,
      `Taškui ant pačios ašies (kitos dvi koordinatės 0) atstumas turi būti 0.`)
  },
  sphere: {
    en: X(`A sphere equation is “distance from the centre, squared, equals r²” in disguise. Completing the square removes the disguise.`,
      [`If the squares have a number in front, divide everything by it.`, `Centre: halve each linear coefficient and flip its sign (−6x gives 3).`, `Add the squares of the centre coordinates to the right side: that is r².`],
      `Forgetting to flip the sign: x² − 6x belongs to (x − 3)², so the centre has +3.`,
      `r² must come out positive, otherwise it is not a sphere.`),
    lt: X(`Sferos lygtis – tai užmaskuotas „atstumo iki centro kvadratas lygus r²“. Išskirdami pilnąjį kvadratą šią kaukę nuimame.`,
      [`Jei prie kvadratų yra skaičius, viską iš jo padalijame.`, `Centras: kiekvieną tiesinį koeficientą dalijame pusiau ir keičiame ženklą (iš −6x gauname 3).`, `Prie dešiniosios pusės pridedame centro koordinačių kvadratus – gauname r².`],
      `Pamiršti pakeisti ženklą: x² − 6x atitinka (x − 3)², todėl centro koordinatė yra +3.`,
      `r² turi būti teigiamas, kitaip tai ne sfera.`)
  },
  touch: {
    en: X(`Touching a plane means the sphere only just reaches it: the radius equals the centre's distance to that plane.`,
      [`Find the centre's distance to the plane (the missing coordinate, no sign).`, `That number is r.`, `Write (x − a)² + (y − b)² + (z − c)² = r².`],
      `Writing r instead of r² on the right-hand side.`,
      `Picture a ball on the floor: its centre is exactly one radius above it.`),
    lt: X(`Liesti plokštumą reiškia vos ją pasiekti: spindulys lygus centro atstumui iki tos plokštumos.`,
      [`Randame centro atstumą iki plokštumos (trūkstama koordinatė be ženklo).`, `Tai ir yra r.`, `Rašome (x − a)² + (y − b)² + (z − c)² = r².`],
      `Dešinėje parašyti r, o ne r².`,
      `Įsivaizduokime kamuolį ant grindų: jo centras yra lygiai per spindulį virš jų.`)
  },
  dist3: {
    en: X(`Pythagoras in three directions: how far you moved in x, in y and in z.`,
      [`Subtract start from end in each coordinate.`, `Square the three differences and add them.`, `Take the root.`],
      `Worrying about the sign of a difference. Squaring removes it; just use “end minus start” everywhere.`,
      `The distance can never be smaller than the largest single difference.`),
    lt: X(`Pitagoro teorema trimis kryptimis: kiek pasislinkome pagal x, pagal y ir pagal z.`,
      [`Kiekvienai koordinatei iš pabaigos atimame pradžią.`, `Tris skirtumus keliame kvadratu ir sudedame.`, `Traukiame šaknį.`],
      `Nerimauti dėl skirtumo ženklo. Keliant kvadratu jis dingsta; svarbu visur imti „pabaiga minus pradžia“.`,
      `Atstumas negali būti mažesnis už didžiausią atskirą skirtumą.`)
  },
  describe: {
    en: X(`Count what is still free. Each equation takes one degree of freedom away from 3-D space.`,
      [`A variable with no condition on it can be anything.`, `One equation: a surface (plane, sphere, cylinder). Two equations: a curve (line, circle).`, `An inequality keeps the surface and fills in one side of it.`],
      `Reading x² + y² = 4 as a circle. In space z is free, so the circle is stacked into a cylinder.`,
      `Try a point: does (2; 0; 100) satisfy it? Then the shape goes up forever.`),
    lt: X(`Skaičiuojame, kas liko laisva. Kiekviena lygtis atima iš trimatės erdvės vieną laisvės laipsnį.`,
      [`Jei kintamajam sąlygos nėra, jis gali būti bet koks.`, `Viena lygtis – paviršius (plokštuma, sfera, cilindras). Dvi lygtys – kreivė (tiesė, apskritimas).`, `Nelygybė palieka paviršių ir užpildo vieną jo pusę.`],
      `x² + y² = 4 laikyti apskritimu. Erdvėje z laisvas, todėl apskritimai „susideda“ į cilindrą.`,
      `Išbandome tašką: ar tinka (2; 0; 100)? Jei taip, figūra tęsiasi be galo aukštyn.`)
  },
  /* ---------- 2 ---------- */
  vecops: {
    en: X(`Vectors behave like lists: do everything slot by slot. Length is Pythagoras on the slots.`,
      [`Add or subtract matching components.`, `A number in front multiplies every component.`, `Length: square, add, root.`],
      `|a − b| is not |a| − |b|. Subtract the vectors first, then take the length.`,
      `3-4-5 and 5-12-13 show up often: [3; −4] has length 5.`),
    lt: X(`Vektoriai elgiasi kaip sąrašai: viską darome pakomponenčiui. Ilgis – Pitagoro teorema komponentėms.`,
      [`Sudedame ar atimame atitinkamas komponentes.`, `Skaičius priekyje daugina kiekvieną komponentę.`, `Ilgis: kvadratai, suma, šaknis.`],
      `|a − b| nėra |a| − |b|. Pirmiausia atimame vektorius, tada skaičiuojame ilgį.`,
      `Dažnai pasitaiko 3-4-5 ir 5-12-13: vektoriaus [3; −4] ilgis yra 5.`)
  },
  dot: {
    en: X(`The dot product measures how much two vectors point the same way. The result is one number.`,
      [`Multiply first with first, second with second, third with third.`, `Add the products.`, `With i, j, k: a missing letter is a 0 component.`],
      `Writing the answer as a vector. A dot product is a single number.`,
      `Perpendicular vectors give 0; a vector dotted with itself gives its length squared.`),
    lt: X(`Skaliarinė sandauga parodo, kiek du vektoriai nukreipti ta pačia kryptimi. Rezultatas – vienas skaičius.`,
      [`Dauginame pirmą iš pirmos, antrą iš antros, trečią iš trečios.`, `Sandaugas sudedame.`, `Su i, j, k: jei raidės nėra, komponentė lygi 0.`],
      `Atsakymą užrašyti kaip vektorių. Skaliarinė sandauga yra vienas skaičius.`,
      `Statmenų vektorių sandauga lygi 0; vektoriaus sandauga su savimi – jo ilgio kvadratas.`)
  },
  meaning: {
    en: X(`Type-check each piece the way a programmer would: is it a number or a vector?`,
      [`Start inside the brackets and label each result.`, `The dot needs vector · vector and returns a number.`, `Plus needs two things of the same kind.`],
      `(a·b)·c looks fine, but a·b is already a number, and a number cannot be dotted with c.`,
      `Number times vector without a dot, like (a·b)c, is fine: it just stretches c.`),
    lt: X(`Kiekvieną dalį tikriname taip, kaip programuotojas tikrina tipą: tai skaičius ar vektorius?`,
      [`Pradedame nuo skliaustų vidaus ir pažymime kiekvieną rezultatą.`, `Taškui reikia vektorius · vektorius, o gaunamas skaičius.`, `Sudėti galima tik to paties tipo dalykus.`],
      `(a·b)·c atrodo gerai, bet a·b jau yra skaičius, o skaičiaus skaliariškai iš c padauginti negalima.`,
      `Skaičius kart vektorius be taško, pvz., (a·b)c, tinka: jis tiesiog ištempia c.`)
  },
  right: {
    en: X(`A right angle shows up as a zero dot product between the two sides that meet there.`,
      [`Build the side vectors: end point minus start point.`, `At each corner, dot the two sides that leave that corner.`, `A zero means 90° at that corner.`],
      `Dotting two sides that do not start at the same corner. Flip one (PQ becomes QP) so both leave the corner.`,
      `Pythagoras agrees: the two shorter sides squared add up to the longest side squared.`),
    lt: X(`Status kampas pasirodo kaip nulinė dviejų toje viršūnėje susikertančių kraštinių skaliarinė sandauga.`,
      [`Sudarome kraštinių vektorius: galo taškas minus pradžios taškas.`, `Kiekvienoje viršūnėje skaliariškai dauginame dvi iš jos išeinančias kraštines.`, `Nulis reiškia 90° toje viršūnėje.`],
      `Dauginti kraštines, kurios prasideda ne toje pačioje viršūnėje. Vieną apverčiame (PQ tampa QP), kad abi išeitų iš viršūnės.`,
      `Pitagoro teorema sutinka: trumpesniųjų kraštinių kvadratų suma lygi ilgiausios kraštinės kvadratui.`)
  },
  proj: {
    en: X(`The projection is the shadow of b on the line of a. comp is the shadow's length (with a sign); proj is the shadow as a vector.`,
      [`Compute a·b and |a|.`, `comp = a·b divided by |a|.`, `proj = a·b divided by |a|² (no root), times the vector a.`],
      `Dividing by |b|, or using |a| instead of |a|² for the vector. Everything is measured against a.`,
      `proj must be a multiple of a, and b − proj must be perpendicular to a.`),
    lt: X(`Projekcija – tai vektoriaus b šešėlis vektoriaus a tiesėje. comp yra šešėlio ilgis (su ženklu), proj – pats šešėlis kaip vektorius.`,
      [`Skaičiuojame a·b ir |a|.`, `comp: a·b dalijame iš |a|.`, `proj: a·b dalijame iš |a|² (be šaknies) ir dauginame iš vektoriaus a.`],
      `Dalyti iš |b| arba vektoriui naudoti |a| vietoj |a|². Viskas matuojama pagal a.`,
      `proj turi būti a kartotinis, o b − proj – statmenas vektoriui a.`)
  },
  angle: {
    en: X(`The dot product knows the angle: a·b = |a||b|cos θ. So cos θ is the dot product with the lengths divided out.`,
      [`Compute a·b.`, `Compute both lengths.`, `Divide: cos θ = a·b / (|a||b|). The sign already says acute or obtuse.`],
      `Working out θ in degrees when only the type of angle is asked. The sign of a·b is enough.`,
      `cos θ must land between −1 and 1. If not, one of the lengths is wrong.`),
    lt: X(`Skaliarinė sandauga „žino“ kampą: a·b = |a||b|cos θ. Taigi cos θ – tai sandauga, padalyta iš ilgių.`,
      [`Skaičiuojame a·b.`, `Skaičiuojame abu ilgius.`, `Dalijame: cos θ = a·b / (|a||b|). Jau ženklas parodo, ar kampas smailusis, ar bukasis.`],
      `Skaičiuoti θ laipsniais, kai klausiama tik kampo tipo. Užtenka a·b ženklo.`,
      `cos θ turi būti tarp −1 ir 1. Jei ne – kuris nors ilgis neteisingas.`)
  },
  share: {
    en: X(`How much of the wanted change does the drug deliver? Project the drug's effect onto the wanted direction and compare it with the wanted size.`,
      [`|V|² is the sum of squares of the wanted change.`, `For each drug: dot its vector with V.`, `Share = that dot product divided by |V|².`],
      `Dividing by |V| only once. One |V| turns the dot product into a projection, the second turns it into a share.`,
      `A drug that produces exactly V would get share 1.`),
    lt: X(`Kokią norimo pokyčio dalį sukelia vaistas? Vaisto poveikį projektuojame į norimą kryptį ir lyginame su norimo pokyčio dydžiu.`,
      [`|V|² – norimo pokyčio komponenčių kvadratų suma.`, `Kiekvienam vaistui: jo vektorių skaliariškai dauginame iš V.`, `Dalis – ši sandauga, padalyta iš |V|².`],
      `Dalyti iš |V| tik vieną kartą. Vienas |V| paverčia sandaugą projekcija, antras – dalimi.`,
      `Vaistas, sukeliantis lygiai V, gautų dalį 1.`)
  },
  /* ---------- 3 ---------- */
  lincomb: {
    en: X(`Matrices of the same size combine cell by cell. The transpose only swaps the roles of rows and columns.`,
      [`Write B<sup>T</sup>: the first row of B becomes the first column.`, `Check that both matrices now have the same shape.`, `For each cell: number × cell of A, plus number × cell of B<sup>T</sup>.`],
      `Adding A and B before transposing. Their shapes do not even match.`,
      `The result has the same shape as A.`),
    lt: X(`Vienodų matmenų matricos jungiamos langelis po langelio. Transponavimas tik sukeičia eilučių ir stulpelių vaidmenis.`,
      [`Užrašome B<sup>T</sup>: pirmoji B eilutė tampa pirmuoju stulpeliu.`, `Patikriname, kad abiejų matricų matmenys dabar vienodi.`, `Kiekvienam langeliui: skaičius × A langelis plius skaičius × B<sup>T</sup> langelis.`],
      `Sudėti A ir B prieš transponuojant. Jų matmenys net nesutampa.`,
      `Rezultato matmenys tokie pat kaip A.`)
  },
  matmul: {
    en: X(`Each cell of AB is one row of A meeting one column of B: a small dot product.`,
      [`Check that the middle numbers match: (m×n)(n×p).`, `The outer numbers give the size m×p.`, `Cell (i, j): go along row i of A and down column j of B, multiply in pairs, add.`],
      `Multiplying cell by cell, as in addition. That is not matrix multiplication.`,
      `Point at the cell you are filling: its row number picks the row of A, its column number picks the column of B.`),
    lt: X(`Kiekvienas AB langelis – tai viena A eilutė, sutinkanti vieną B stulpelį: maža skaliarinė sandauga.`,
      [`Tikriname, ar sutampa viduriniai skaičiai: (m×n)(n×p).`, `Išoriniai skaičiai duoda matmenis m×p.`, `Langelis (i, j): einame A i-ąja eilute ir B j-uoju stulpeliu žemyn, dauginame poromis, sudedame.`],
      `Dauginti langelį iš langelio kaip sudedant. Tai nėra matricų daugyba.`,
      `Parodome pildomą langelį: jo eilutės numeris parenka A eilutę, stulpelio numeris – B stulpelį.`)
  },
  possible: {
    en: X(`Write the two sizes next to each other. The inner numbers must agree; the outer numbers are the size of the answer.`,
      [`Note each matrix as rows × columns.`, `For XY put the sizes side by side: (a×b)(c×d).`, `Possible only if b = c. The result is a×d.`],
      `Assuming BA works because AB does. Order matters.`,
      `A row (1×3) times a column (3×1) gives a single number, 1×1.`),
    lt: X(`Užrašome abu matmenis greta. Vidiniai skaičiai turi sutapti; išoriniai – atsakymo matmenys.`,
      [`Kiekvieną matricą užrašome kaip eilutės × stulpeliai.`, `Sandaugai XY matmenis rašome greta: (a×b)(c×d).`, `Įmanoma tik kai b = c. Rezultatas a×d.`],
      `Manyti, kad BA įmanoma, nes įmanoma AB. Tvarka svarbi.`,
      `Eilutė (1×3), padauginta iš stulpelio (3×1), duoda vieną skaičių, 1×1.`)
  },
  det2: {
    en: X(`One number that tells whether the matrix squashes the plane flat (0) or not.`,
      [`Multiply the main diagonal (top-left to bottom-right).`, `Multiply the other diagonal.`, `First minus second.`],
      `Sign slips with negatives: subtracting a negative product becomes adding.`,
      `If one row is a multiple of the other, the answer must be 0.`),
    lt: X(`Vienas skaičius, parodantis, ar matrica suploja plokštumą (0), ar ne.`,
      [`Sudauginame pagrindinę įstrižainę (iš viršaus kairės į apačią dešinę).`, `Sudauginame kitą įstrižainę.`, `Iš pirmos sandaugos atimame antrą.`],
      `Ženklų klaidos su neigiamais skaičiais: atimant neigiamą sandaugą gaunamas pliusas.`,
      `Jei viena eilutė yra kitos kartotinė, atsakymas turi būti 0.`)
  },
  det3: {
    en: X(`Six products: three going down-right count plus, three going down-left count minus.`,
      [`Add the three down-right products (the main diagonal and its two wrapped parallels).`, `Add the three down-left products.`, `First sum minus second sum.`],
      `Losing track of the wrapped diagonals. Copy the first two columns to the right of the matrix and all six become straight lines.`,
      `Swap two rows in your head: the answer should only change sign.`),
    lt: X(`Šešios sandaugos: trys „žemyn į dešinę“ imamos su pliusu, trys „žemyn į kairę“ – su minusu.`,
      [`Sudedame tris sandaugas žemyn į dešinę (pagrindinė įstrižainė ir dvi jai lygiagrečios).`, `Sudedame tris sandaugas žemyn į kairę.`, `Iš pirmos sumos atimame antrą.`],
      `Pasimesti tarp „užlenktų“ įstrižainių. Prirašome dešinėje pirmus du stulpelius – tada visos šešios tampa tiesios.`,
      `Mintyse sukeičiame dvi eilutes: atsakymas turi tik pakeisti ženklą.`)
  },
  /* ---------- 4 ---------- */
  diagram: {
    en: X(`Each arrow is one term of a “next step” equation. The arrows into A build the equation for A.`,
      [`Take one arrow at a time: from which state, to which state, what weight.`, `Put the weight in the row of the target and the column of the source.`, `Loops go on the diagonal; no arrow means 0.`],
      `Swapping “from” and “to”. Remember: column = from, row = to.`,
      `Read a row back: row A lists everything that flows into A.`),
    lt: X(`Kiekviena rodyklė – vienas „kito žingsnio“ lygties narys. Į A ateinančios rodyklės sudaro A lygtį.`,
      [`Imame po vieną rodyklę: iš kurios būsenos, į kurią, koks svoris.`, `Svorį rašome tikslo eilutėje ir šaltinio stulpelyje.`, `Kilpos – įstrižainėje; jei rodyklės nėra, rašome 0.`],
      `Sukeisti „iš“ ir „į“. Atsiminkime: stulpelis – iš kur, eilutė – į kur.`,
      `Perskaitome eilutę atgal: A eilutėje surašyta viskas, kas įteka į A.`)
  },
  rec2mat: {
    en: X(`The matrix is just the table of coefficients, with the variables always in the same order.`,
      [`Fix the order of the variables.`, `Each equation gives one row.`, `A variable that does not appear gets 0 in its column.`],
      `Writing the coefficients in the order they appear in the equation instead of the fixed variable order.`,
      `Multiply your matrix by the vector of variables in your head: you should get the equations back.`),
    lt: X(`Matrica – tiesiog koeficientų lentelė, kai kintamieji visada surašyti ta pačia tvarka.`,
      [`Nustatome kintamųjų tvarką.`, `Kiekviena lygtis duoda vieną eilutę.`, `Jei kintamojo lygtyje nėra, jo stulpelyje rašome 0.`],
      `Rašyti koeficientus ta tvarka, kuria jie yra lygtyje, o ne pagal nustatytą kintamųjų tvarką.`,
      `Mintyse padauginame matricą iš kintamųjų vektoriaus: turime gauti pradines lygtis.`)
  },
  iterate: {
    en: X(`One multiplication by A moves the population one time step forward.`,
      [`n<sub>1</sub> = A·n<sub>0</sub>: each row of A meets n<sub>0</sub>.`, `n<sub>2</sub> = A·n<sub>1</sub>: repeat with the new vector.`, `Keep the vectors as columns.`],
      `Using n<sub>0</sub> again for the second step instead of n<sub>1</sub>.`,
      `Each step is two small dot products; redo the one whose sign surprises you.`),
    lt: X(`Vienas dauginimas iš A perkelia populiaciją vienu laiko žingsniu į priekį.`,
      [`n<sub>1</sub> = A·n<sub>0</sub>: kiekviena A eilutė „susitinka“ su n<sub>0</sub>.`, `n<sub>2</sub> = A·n<sub>1</sub>: kartojame su nauju vektoriumi.`, `Vektorius rašome stulpeliais.`],
      `Antrajam žingsniui vėl naudoti n<sub>0</sub>, o ne n<sub>1</sub>.`,
      `Kiekvienas žingsnis – dvi mažos skaliarinės sandaugos; perskaičiuojame tą, kurios ženklas nustebino.`)
  },
  inverse2: {
    en: X(`The inverse undoes the matrix. For 2×2 there is a shortcut: swap, flip signs, divide.`,
      [`Compute det = ad − bc. If it is 0, stop: there is no inverse.`, `Swap a and d; change the signs of b and c.`, `Divide every entry by det.`],
      `Changing the signs of a and d instead of b and c.`,
      `Multiply A by your answer: you must get 1s on the diagonal and 0s elsewhere.`),
    lt: X(`Atvirkštinė matrica „atšaukia“ matricos veiksmą. 2×2 atveju yra trumpas kelias: sukeisti, pakeisti ženklus, padalyti.`,
      [`Skaičiuojame det = ad − bc. Jei 0 – atvirkštinės matricos nėra.`, `Sukeičiame a ir d; keičiame b ir c ženklus.`, `Kiekvieną elementą dalijame iš det.`],
      `Keisti a ir d ženklus vietoj b ir c.`,
      `Padauginame A iš atsakymo: įstrižainėje turi būti vienetai, kitur nuliai.`)
  },
  isinverse: {
    en: X(`Do not compute an inverse. Just multiply and see whether you get the identity.`,
      [`Compute AB.`, `Compare with the identity: 1s on the diagonal, 0s off it.`, `One wrong cell is enough to say no.`],
      `Stopping once the first row looks right.`,
      `If AB is the identity, BA is too.`),
    lt: X(`Atvirkštinės matricos skaičiuoti nereikia. Tiesiog sudauginame ir žiūrime, ar gauname vienetinę matricą.`,
      [`Skaičiuojame AB.`, `Lyginame su vienetine matrica: įstrižainėje vienetai, kitur nuliai.`, `Užtenka vieno netinkamo langelio, kad atsakymas būtų „ne“.`],
      `Sustoti, kai pirmoji eilutė atrodo gerai.`,
      `Jei AB yra vienetinė matrica, tai ir BA vienetinė.`)
  },
  singular: {
    en: X(`Singular means the determinant is 0: the rows have become proportional.`,
      [`Write ad − bc with the unknown inside.`, `Set it equal to 0.`, `Solve the small equation.`],
      `Forgetting the minus between the two products.`,
      `Put your value back: one row should be a multiple of the other.`),
    lt: X(`Išsigimusi reiškia det = 0: eilutės tapo proporcingos.`,
      [`Užrašome ad − bc su nežinomuoju.`, `Prilyginame nuliui.`, `Išsprendžiame nedidelę lygtį.`],
      `Pamiršti minusą tarp dviejų sandaugų.`,
      `Įstatome gautą reikšmę: viena eilutė turi būti kitos kartotinė.`)
  },
  backstep: {
    en: X(`Going forward multiplies by A, so going back multiplies by A<sup>−1</sup>.`,
      [`Find A<sup>−1</sup> with the 2×2 shortcut.`, `Multiply A<sup>−1</sup> by this season's vector.`, `The result is last season's vector.`],
      `Multiplying by A again. That gives next season, not the previous one.`,
      `Multiply A by your answer: you must land on this season's vector.`),
    lt: X(`Į priekį einame daugindami iš A, todėl atgal – daugindami iš A<sup>−1</sup>.`,
      [`Randame A<sup>−1</sup> pagal 2×2 taisyklę.`, `A<sup>−1</sup> dauginame iš šio sezono vektoriaus.`, `Rezultatas – praėjusio sezono vektorius.`],
      `Dar kartą dauginti iš A. Taip gautume kitą sezoną, o ne ankstesnį.`,
      `Padauginame A iš atsakymo: turime gauti šio sezono vektorių.`)
  },
  /* ---------- 5 ---------- */
  minor: {
    en: X(`A minor is the small determinant left after you delete one row and one column. The cofactor adds a chessboard sign.`,
      [`Cover row i and column j.`, `Take the 2×2 determinant of what is left: that is the minor.`, `Sign: + if i + j is even, − if it is odd.`],
      `Forgetting the sign, or putting it on the minor when it belongs only to the cofactor.`,
      `The signs form a chessboard that starts with + in the top-left corner.`),
    lt: X(`Minoras – mažas determinantas, likęs išbraukus vieną eilutę ir vieną stulpelį. Adjunktas prideda „šachmatų lentos“ ženklą.`,
      [`Uždengiame i-ąją eilutę ir j-ąjį stulpelį.`, `Skaičiuojame likusį 2×2 determinantą – tai minoras.`, `Ženklas: +, jei i + j lyginis, −, jei nelyginis.`],
      `Pamiršti ženklą arba pritaikyti jį minorui, nors jis skirtas tik adjunktui.`,
      `Ženklai sudaro šachmatų lentą, kuri prasideda + viršutiniame kairiajame kampe.`)
  },
  det4: {
    en: X(`Let the zeros do the work: expand along the line that has the most of them.`,
      [`Pick the row or column with the most zeros.`, `For each non-zero entry: delete its row and column, compute the 3×3 determinant, attach the chessboard sign.`, `Add up entry × cofactor.`],
      `Expanding along the first row out of habit and computing four 3×3 determinants instead of two.`,
      `Zero entries need no work at all: 0 times anything is 0.`),
    lt: X(`Leidžiame dirbti nuliams: skleidžiame pagal tą eilutę ar stulpelį, kur jų daugiausia.`,
      [`Pasirenkame eilutę ar stulpelį su daugiausia nulių.`, `Kiekvienam nenuliniam elementui: išbraukiame jo eilutę ir stulpelį, skaičiuojame 3×3 determinantą, pridedame šachmatų lentos ženklą.`, `Sudedame elementų ir jų adjunktų sandaugas.`],
      `Iš įpročio skleisti pagal pirmą eilutę ir skaičiuoti keturis 3×3 determinantus vietoj dviejų.`,
      `Nuliniams elementams nieko skaičiuoti nereikia: 0, padaugintas iš bet ko, yra 0.`)
  },
  cramer2: { en: CRAMER_EN, lt: CRAMER_LT },
  cramer3: { en: CRAMER_EN, lt: CRAMER_LT },
  cramer0: {
    en: X(`Δ = 0 means the equations are not independent. Then either they contradict each other (no solution) or one is redundant (infinitely many).`,
      [`Confirm that Δ = 0.`, `Compute Δ<sub>x</sub>, Δ<sub>y</sub>, Δ<sub>z</sub>.`, `All zero: infinitely many. Any of them non-zero: none.`],
      `Answering “no solutions” as soon as Δ = 0 without looking at the other determinants.`,
      `Geometrically: planes that share a line (infinitely many) or planes that never all meet (none).`),
    lt: X(`Δ = 0 reiškia, kad lygtys nėra nepriklausomos. Tada jos arba prieštarauja viena kitai (sprendinių nėra), arba viena yra perteklinė (be galo daug).`,
      [`Įsitikiname, kad Δ = 0.`, `Skaičiuojame Δ<sub>x</sub>, Δ<sub>y</sub>, Δ<sub>z</sub>.`, `Visi nuliai – be galo daug. Bent vienas ne nulis – sprendinių nėra.`],
      `Atsakyti „sprendinių nėra“ vos pamačius Δ = 0, nepažiūrėjus į kitus determinantus.`,
      `Geometriškai: plokštumos, turinčios bendrą tiesę (be galo daug), arba plokštumos, kurios visos kartu nesusikerta (nėra).`)
  },
  param3: {
    en: X(`One equation is redundant, so one unknown is free. Call it t and express the others through it.`,
      [`Set z = t and cross out the redundant equation.`, `Move the t-terms to the right: now it is a 2×2 system.`, `Solve for x and y; both will contain t.`],
      `The sign of the t-term when it crosses the equals sign.`,
      `Take t = 0 and t = 1 and test both points in the original third equation.`),
    lt: X(`Viena lygtis perteklinė, todėl vienas nežinomasis laisvas. Pavadiname jį t ir kitus išreiškiame per jį.`,
      [`Imame z = t ir išbraukiame perteklinę lygtį.`, `Narius su t perkeliame į dešinę – lieka 2×2 sistema.`, `Randame x ir y; abu priklausys nuo t.`],
      `Nario su t ženklas, kai jis pereina per lygybės ženklą.`,
      `Imame t = 0 ir t = 1 ir abu taškus patikriname pradinėje trečiojoje lygtyje.`)
  },
  syskind: {
    en: X(`For almost every k the two lines cross once. Only at the special k that makes the determinant 0 do they become parallel or identical.`,
      [`Write the determinant with k in it and solve det = 0.`, `Put that k into the system.`, `Same line (coefficients and right side all in proportion): infinitely many. Parallel: none.`],
      `Comparing only the left sides. The right-hand sides decide between “none” and “infinitely many”.`,
      `Divide the second equation by the first, term by term: three equal ratios mean the same line.`),
    lt: X(`Beveik su kiekviena k reikšme dvi tiesės kertasi viename taške. Tik su ypatinga k, kai determinantas lygus 0, jos tampa lygiagrečios arba sutampa.`,
      [`Užrašome determinantą su k ir sprendžiame det = 0.`, `Tą k įstatome į sistemą.`, `Ta pati tiesė (koeficientai ir dešinioji pusė proporcingi) – be galo daug. Lygiagrečios – sprendinių nėra.`],
      `Lyginti tik kairiąsias puses. Būtent dešiniosios pusės nulemia, ar „nėra“, ar „be galo daug“.`,
      `Antrąją lygtį panariui dalijame iš pirmosios: trys vienodi santykiai reiškia tą pačią tiesę.`)
  },
  inv3: {
    en: X(`AX = B is like 3x = 6: “divide” by A, which means multiply by A<sup>−1</sup>.`,
      [`det A (if it is 0, the method does not work).`, `Cofactor of every entry, then transpose that matrix.`, `X = (1/det) · (transposed cofactors) · B.`],
      `Forgetting to transpose the cofactor matrix. It is the most common slip here.`,
      `Put X back into the original equations.`),
    lt: X(`AX = B yra kaip 3x = 6: „dalijame“ iš A, t. y. dauginame iš A<sup>−1</sup>.`,
      [`det A (jei 0, metodas netinka).`, `Kiekvieno elemento adjunktas, tada tą matricą transponuojame.`, `X = (1/det) · (transponuota adjunktų matrica) · B.`],
      `Pamiršti transponuoti adjunktų matricą. Tai dažniausia klaida.`,
      `Įstatome X į pradines lygtis.`)
  },
  /* ---------- 6 ---------- */
  cbasic: {
    en: X(`Treat i as a letter, with one extra rule: wherever i² appears, replace it by −1.`,
      [`Add and subtract: real parts together, imaginary parts together.`, `Multiply: expand the brackets (four products).`, `Turn i² into −1 and collect.`],
      `Forgetting that i·i gives −1, so that product moves to the real part with its sign changed.`,
      `z times its conjugate is always a positive real number, a² + b².`),
    lt: X(`Su i elgiamės kaip su raide, tik su viena papildoma taisykle: kur atsiranda i², keičiame į −1.`,
      [`Sudėtis ir atimtis: realiosios dalys atskirai, menamosios atskirai.`, `Daugyba: atskliaudžiame (keturios sandaugos).`, `i² keičiame į −1 ir sutraukiame.`],
      `Pamiršti, kad i·i duoda −1, todėl ta sandauga pereina į realiąją dalį su pakeistu ženklu.`,
      `z ir jo jungtinio skaičiaus sandauga visada yra teigiamas realusis skaičius a² + b².`)
  },
  cdiv: {
    en: X(`You cannot divide by something with i in it, so first make the denominator real.`,
      [`Multiply top and bottom by the conjugate of the bottom.`, `The bottom becomes c² + d², a plain number.`, `Expand the top and divide both parts by that number.`],
      `Multiplying by the conjugate of the numerator instead of the denominator.`,
      `Multiply your answer by the original denominator: you should get the numerator back.`),
    lt: X(`Dalyti iš skaičiaus su i negalima, todėl pirmiausia vardiklį paverčiame realiuoju.`,
      [`Skaitiklį ir vardiklį dauginame iš vardiklio jungtinio skaičiaus.`, `Vardiklis tampa c² + d² – paprastu skaičiumi.`, `Atskliaudžiame skaitiklį ir abi dalis dalijame iš to skaičiaus.`],
      `Dauginti iš skaitiklio, o ne iš vardiklio jungtinio skaičiaus.`,
      `Atsakymą padauginame iš pradinio vardiklio: turime gauti skaitiklį.`)
  },
  ccube: {
    en: X(`No special formula needed: square first, then multiply once more.`,
      [`z² = (a² − b²) + 2ab·i.`, `Multiply that by z.`, `Replace i² by −1 and collect.`],
      `Cubing the real and imaginary parts separately. (a + bi)³ is not a³ + b³i.`,
      `|z³| should equal |z|³.`),
    lt: X(`Ypatingos formulės nereikia: pirma keliame kvadratu, tada dauginame dar kartą.`,
      [`z² = (a² − b²) + 2ab·i.`, `Tai dauginame iš z.`, `i² keičiame į −1 ir sutraukiame.`],
      `Kelti kubu realiąją ir menamąją dalis atskirai. (a + bi)³ nėra a³ + b³i.`,
      `|z³| turi būti lygus |z|³.`)
  },
  ctrig: {
    en: X(`Instead of “so far right, so far up”, describe the point by its distance from 0 and its direction.`,
      [`r = √(a² + b²).`, `Sketch the point to see the quadrant.`, `Find the reference angle from |b|/|a| (1 → π/4, √3 → π/3, 1/√3 → π/6) and adjust it to the quadrant.`],
      `Trusting arctg blindly: it only returns angles in quadrants I and IV. The sketch fixes that.`,
      `r·cos φ must give back a and r·sin φ must give back b, signs included.`),
    lt: X(`Vietoj „tiek į dešinę, tiek aukštyn“ tašką nusakome atstumu nuo 0 ir kryptimi.`,
      [`r = √(a² + b²).`, `Nusibraižome tašką ir nustatome ketvirtį.`, `Smailųjį kampą randame iš |b|/|a| (1 → π/4, √3 → π/3, 1/√3 → π/6) ir pritaikome ketvirčiui.`],
      `Aklai pasitikėti arctg: jis grąžina tik I ir IV ketvirčių kampus. Brėžinys tai ištaiso.`,
      `r·cos φ turi grąžinti a, o r·sin φ – b, kartu su ženklais.`)
  },
  demoivre: {
    en: X(`Multiplying complex numbers multiplies their lengths and adds their angles. A power just repeats that n times.`,
      [`Write z as r and φ.`, `r<sup>n</sup> for the length, n·φ for the angle.`, `Remove full turns of 2π, then read off cos and sin.`],
      `Expanding (1 + √3i)<sup>6</sup> by brute force. The whole point of the theorem is to avoid that.`,
      `If nφ is a multiple of 2π the answer is a positive real number; a multiple of π gives a real number.`),
    lt: X(`Dauginant kompleksinius skaičius ilgiai dauginami, o kampai sudedami. Laipsnis tai tiesiog pakartoja n kartų.`,
      [`Užrašome z per r ir φ.`, `Ilgiui r<sup>n</sup>, kampui n·φ.`, `Atmetame pilnus apsisukimus 2π ir randame cos bei sin.`],
      `Atskliausti (1 + √3i)<sup>6</sup> „jėga“. Teorema kaip tik ir skirta to išvengti.`,
      `Jei nφ yra 2π kartotinis, atsakymas – teigiamas realusis skaičius; jei π kartotinis – realusis skaičius.`)
  },
  croots: {
    en: X(`The n roots sit evenly around a circle, like the corners of a regular polygon.`,
      [`Write the number as ρ and θ.`, `Radius of the circle: <sup>n</sup>√ρ.`, `First root at angle θ/n, then keep adding 2π/n until you have n of them.`],
      `Stopping at one root. There are always exactly n.`,
      `Raise any root to the n-th power in your head: the angle should come back to θ.`),
    lt: X(`n šaknų išsidėsto tolygiai ant apskritimo, tarsi taisyklingojo daugiakampio viršūnės.`,
      [`Skaičių užrašome per ρ ir θ.`, `Apskritimo spindulys: <sup>n</sup>√ρ.`, `Pirmoji šaknis – kampu θ/n, toliau vis pridedame 2π/n, kol turime n šaknų.`],
      `Sustoti radus vieną šaknį. Jų visada yra lygiai n.`,
      `Mintyse pakeliame bet kurią šaknį n-tuoju laipsniu: kampas turi grįžti į θ.`)
  },
  cquad: {
    en: X(`The usual formula still works. A negative discriminant only means the ± part becomes imaginary.`,
      [`D = b² − 4ac.`, `√D = i·√|D|.`, `z = (−b ± i√|D|) / 2a: real part −b/2a, imaginary part √|D|/2a.`],
      `Dividing only one of the two parts by 2a.`,
      `The two roots are mirror images: same real part, opposite imaginary parts.`),
    lt: X(`Įprasta formulė tebegalioja. Neigiamas diskriminantas tik reiškia, kad dalis su ± tampa menamoji.`,
      [`D = b² − 4ac.`, `√D = i·√|D|.`, `z = (−b ± i√|D|) / 2a: realioji dalis −b/2a, menamoji √|D|/2a.`],
      `Iš 2a padalyti tik vieną iš dviejų dalių.`,
      `Abu sprendiniai yra veidrodiniai: ta pati realioji dalis, priešingos menamosios.`)
  },
  reduction: {
    en: X(`Two separate questions: does the name change, and what is the sign?`,
      [`Drop full turns (2π, 4π).`, `π/2 or 3π/2 inside: sin and cos swap. π or 2π: the name stays.`, `Sign: imagine α tiny, find the quadrant, use the sign the original function has there.`],
      `Taking the sign from the new function instead of the original one.`,
      `Test with α = 0: both sides must give the same number.`),
    lt: X(`Du atskiri klausimai: ar keičiasi pavadinimas ir koks ženklas?`,
      [`Atmetame pilnus apsisukimus (2π, 4π).`, `Jei viduje π/2 ar 3π/2 – sin ir cos susikeičia. Jei π ar 2π – pavadinimas lieka.`, `Ženklas: įsivaizduojame labai mažą α, randame ketvirtį ir imame pradinės funkcijos ženklą jame.`],
      `Ženklą nustatyti pagal naująją funkciją, o ne pagal pradinę.`,
      `Tikriname su α = 0: abi pusės turi duoti tą patį skaičių.`)
  },
  /* ---------- 7 ---------- */
  eig2: {
    en: X(`An eigenvector is a direction the matrix does not turn; it only stretches it. The eigenvalue is the stretch factor.`,
      [`Characteristic equation: λ² − (a + d)λ + (ad − bc) = 0.`, `Solve it: two numbers with that sum and that product.`, `For each λ, put it into (A − λI)v = 0, set one unknown to 1 and solve the other.`],
      `Expecting two different equations for the eigenvector. They are always multiples of each other, so use one.`,
      `Multiply A by your vector: you must get λ times the same vector.`),
    lt: X(`Tikrinis vektorius – kryptis, kurios matrica nepasuka, tik ištempia. Tikrinė reikšmė – ištempimo daugiklis.`,
      [`Charakteristinė lygtis: λ² − (a + d)λ + (ad − bc) = 0.`, `Sprendžiame: du skaičiai su tokia suma ir tokia sandauga.`, `Kiekvieną λ įstatome į (A − λI)v = 0, vienam nežinomajam priskiriame 1 ir randame kitą.`],
      `Tikėtis dviejų skirtingų lygčių tikriniam vektoriui. Jos visada proporcingos, todėl naudojame vieną.`,
      `Padauginame A iš vektoriaus: turime gauti tą patį vektorių, padaugintą iš λ.`)
  },
  eig3: {
    en: X(`Same idea as 2×2. The zeros in the matrix let one eigenvalue drop out immediately.`,
      [`Expand |A − λI| along the row or column with two zeros.`, `One factor (g − λ) appears; the rest is a 2×2 problem.`, `For each λ solve (A − λI)v = 0, choosing one unknown freely.`],
      `Multiplying everything out into a cubic. Keep the factor (g − λ) outside the bracket.`,
      `The three eigenvalues add up to the sum of the diagonal.`),
    lt: X(`Ta pati idėja kaip 2×2. Matricos nuliai leidžia vienai tikrinei reikšmei „iškristi“ iš karto.`,
      [`Skleidžiame |A − λI| pagal eilutę ar stulpelį su dviem nuliais.`, `Atsiranda daugiklis (g − λ); likusi dalis – 2×2 uždavinys.`, `Kiekvienai λ sprendžiame (A − λI)v = 0, vieną nežinomąjį pasirinkę laisvai.`],
      `Viską sudauginti į kubinę lygtį. Daugiklį (g − λ) paliekame prieš skliaustus.`,
      `Trijų tikrinių reikšmių suma lygi įstrižainės elementų sumai.`)
  },
  iseig: {
    en: X(`No need to find all the eigenvalues. Just test the one number.`,
      [`Subtract k from every diagonal entry.`, `Take the determinant.`, `Zero means yes.`],
      `Subtracting k from every entry instead of only the diagonal.`,
      `For a triangular matrix the eigenvalues are simply the diagonal entries.`),
    lt: X(`Visų tikrinių reikšmių ieškoti nereikia. Tiesiog patikriname vieną skaičių.`,
      [`Iš kiekvieno įstrižainės elemento atimame k.`, `Skaičiuojame determinantą.`, `Nulis reiškia „taip“.`],
      `Atimti k iš visų elementų, o ne tik iš įstrižainės.`,
      `Trikampės matricos tikrinės reikšmės – tiesiog įstrižainės elementai.`)
  },
  /* ---------- 8 ---------- */
  pdp: {
    en: X(`Seen in eigenvector “coordinates”, the matrix only stretches. P translates into those coordinates and back.`,
      [`Find the eigenvalues: they go on the diagonal of D.`, `The eigenvectors become the columns of P, in the same order.`, `Invert P with the 2×2 shortcut.`],
      `Putting the eigenvectors in a different order from the eigenvalues in D.`,
      `Multiply P·D·P<sup>−1</sup>: you must get A back.`),
    lt: X(`Tikrinių vektorių „koordinatėse“ matrica tik tempia. P perveda į tas koordinates ir atgal.`,
      [`Randame tikrines reikšmes – jos rašomos D įstrižainėje.`, `Tikriniai vektoriai tampa P stulpeliais ta pačia tvarka.`, `P atvirkštinę matricą randame pagal 2×2 taisyklę.`],
      `Tikrinius vektorius surašyti kita tvarka nei tikrinės reikšmės matricoje D.`,
      `Sudauginame P·D·P<sup>−1</sup>: turime gauti A.`)
  },
  closed: {
    en: X(`Split the start into eigenvector pieces. Each piece is then simply multiplied by its own λ at every step.`,
      [`Find λ<sub>1</sub>, λ<sub>2</sub> and their eigenvectors.`, `Solve c<sub>1</sub>v<sub>1</sub> + c<sub>2</sub>v<sub>2</sub> = n<sub>0</sub> for c<sub>1</sub> and c<sub>2</sub> (two small equations).`, `Write n<sub>t</sub> = c<sub>1</sub>λ<sub>1</sub><sup>t</sup>v<sub>1</sub> + c<sub>2</sub>λ<sub>2</sub><sup>t</sup>v<sub>2</sub>.`],
      `Pairing a λ with the wrong eigenvector.`,
      `Put t = 0: the formula must give n<sub>0</sub>. Put t = 1: it must equal A·n<sub>0</sub>.`),
    lt: X(`Pradinį vektorių išskaidome į tikrinių vektorių dalis. Kiekviena dalis kiekviename žingsnyje tiesiog dauginama iš savo λ.`,
      [`Randame λ<sub>1</sub>, λ<sub>2</sub> ir jų tikrinius vektorius.`, `Iš c<sub>1</sub>v<sub>1</sub> + c<sub>2</sub>v<sub>2</sub> = n<sub>0</sub> randame c<sub>1</sub> ir c<sub>2</sub> (dvi nedidelės lygtys).`, `Rašome n<sub>t</sub> = c<sub>1</sub>λ<sub>1</sub><sup>t</sup>v<sub>1</sub> + c<sub>2</sub>λ<sub>2</sub><sup>t</sup>v<sub>2</sub>.`],
      `Suporuoti λ su ne tuo tikriniu vektoriumi.`,
      `Kai t = 0, formulė turi duoti n<sub>0</sub>. Kai t = 1 – turi sutapti su A·n<sub>0</sub>.`)
  },
  markov: {
    en: X(`Columns that add up to 1 only move things around; they create and destroy nothing. So the total stays fixed and the mix settles.`,
      [`One eigenvalue is 1; the other is trace − 1.`, `The eigenvector for λ = 1 gives the final proportions.`, `Scale it so its entries add up to the starting total.`],
      `Giving the raw eigenvector without rescaling it to the right total.`,
      `Multiply A by your limit vector: nothing should change.`),
    lt: X(`Stulpeliai, kurių suma lygi 1, tik perskirsto – nieko nesukuria ir nesunaikina. Todėl bendra suma išlieka, o pasiskirstymas nusistovi.`,
      [`Viena tikrinė reikšmė lygi 1; kita – pėdsakas − 1.`, `Tikrinis vektorius, kai λ = 1, duoda galutines proporcijas.`, `Normuojame jį taip, kad komponenčių suma būtų lygi pradinei sumai.`],
      `Pateikti tikrinį vektorių jo nenormavus iki reikiamos sumos.`,
      `Padauginame A iš ribinio vektoriaus: niekas neturi pasikeisti.`)
  },
  longrun: {
    en: X(`After many steps the eigenvalue that is largest in size wins. Its size decides everything.`,
      [`Read off the eigenvalues (the diagonal of a triangular matrix).`, `Take the one with the largest absolute value.`, `Above 1: grows. Below 1: dies out. Exactly 1: settles. −1: the sign flips forever.`],
      `Ignoring a minus sign: −1 does not settle, it keeps switching.`,
      `Imagine λ<sup>100</sup>: 2<sup>100</sup> is huge, 0.5<sup>100</sup> is nothing, 1<sup>100</sup> is 1, and (−1)<sup>100</sup> and (−1)<sup>101</sup> differ.`),
    lt: X(`Po daugelio žingsnių „laimi“ didžiausia moduliu tikrinė reikšmė. Jos dydis viską ir nulemia.`,
      [`Nuskaitome tikrines reikšmes (trikampės matricos įstrižainė).`, `Imame didžiausią moduliu.`, `Daugiau už 1 – auga. Mažiau už 1 – nyksta. Lygiai 1 – nusistovi. −1 – ženklas be galo kaitaliojasi.`],
      `Nepaisyti minuso: su −1 niekas nenusistovi, ženklas vis keičiasi.`,
      `Įsivaizduokime λ<sup>100</sup>: 2<sup>100</sup> milžiniškas, 0,5<sup>100</sup> beveik nulis, 1<sup>100</sup> lygus 1, o (−1)<sup>100</sup> ir (−1)<sup>101</sup> skiriasi.`)
  },
  /* ---------- 9 ---------- */
  limsym: {
    en: X(`Think of ∞ as “a number that keeps growing” and ask what the whole expression does.`,
      [`A fixed number over a growing one: shrinks to 0.`, `Growing times growing, or plus growing: still growing.`, `Two forces pulling opposite ways (0/0, ∞/∞, ∞ − ∞, 0·∞): cannot tell yet.`],
      `Calling ∞ − ∞ zero or ∞/∞ one. It depends on which part grows faster.`,
      `Try real numbers: 5/1000000, 2<sup>100</sup>, 2<sup>−100</sup>.`),
    lt: X(`Į ∞ žiūrime kaip į „vis didėjantį skaičių“ ir klausiame, ką daro visas reiškinys.`,
      [`Pastovus skaičius, padalytas iš didėjančio: artėja prie 0.`, `Didėjantis, padaugintas iš didėjančio ar su juo sudėtas: vis tiek didėja.`, `Dvi jėgos, traukiančios į priešingas puses (0/0, ∞/∞, ∞ − ∞, 0·∞): dar negalima pasakyti.`],
      `∞ − ∞ laikyti nuliu arba ∞/∞ – vienetu. Viskas priklauso nuo to, kuri dalis auga greičiau.`,
      `Išbandome tikrus skaičius: 5/1000000, 2<sup>100</sup>, 2<sup>−100</sup>.`)
  },
  limside: {
    en: X(`Dividing by something tiny gives something huge. Only the sign is left to decide.`,
      [`Which side are you coming from? That fixes the sign of (x − a).`, `An even power makes the denominator positive; an odd power keeps its sign.`, `Combine with the sign of the numerator.`],
      `Forgetting that, coming from the left, an odd power stays negative.`,
      `Plug in a nearby number, such as 0.01 or −0.01, and look at the sign.`),
    lt: X(`Dalydami iš labai mažo skaičiaus gauname labai didelį. Belieka nustatyti ženklą.`,
      [`Iš kurios pusės artėjame? Tai nulemia (x − a) ženklą.`, `Lyginis laipsnis vardiklį padaro teigiamą; nelyginis ženklą išlaiko.`, `Atsižvelgiame į skaitiklio ženklą.`],
      `Pamiršti, kad artėjant iš kairės nelyginis laipsnis lieka neigiamas.`,
      `Įstatome artimą skaičių, pvz., 0,01 arba −0,01, ir žiūrime į ženklą.`)
  },
  limrat: {
    en: X(`For huge x only the highest powers matter. Everything else is small change.`,
      [`Find the highest power on top and on the bottom.`, `Same power: the answer is the ratio of their coefficients.`, `Bottom wins: 0. Top wins: ±∞, with the sign of that ratio.`],
      `Reading the first term instead of the highest power: in 1 − 3n³ the leader is −3n³.`,
      `Put x = 1000 into a calculator: the value should be close to your answer.`),
    lt: X(`Kai x labai didelis, svarbūs tik aukščiausi laipsniai. Visa kita – smulkmenos.`,
      [`Randame aukščiausią laipsnį skaitiklyje ir vardiklyje.`, `Laipsniai vienodi: atsakymas – jų koeficientų santykis.`, `„Laimi“ vardiklis: 0. „Laimi“ skaitiklis: ±∞ su to santykio ženklu.`],
      `Žiūrėti į pirmą narį, o ne į aukščiausią laipsnį: reiškinyje 1 − 3n³ vyriausiasis narys yra −3n³.`,
      `Skaičiuotuvu įstatome x = 1000: reikšmė turi būti arti atsakymo.`)
  },
  limfactor: {
    en: X(`0/0 is a hint, not a dead end: top and bottom both hide the same factor (x − a).`,
      [`Substitute first. If you get a number, you are done.`, `If 0/0: factor top and bottom so that (x − a) shows.`, `Cancel it and substitute again.`],
      `Cancelling terms instead of factors. You can only cancel something that multiplies the whole top and the whole bottom.`,
      `Try an x very close to a on a calculator.`),
    lt: X(`0/0 yra užuomina, o ne aklavietė: ir skaitiklyje, ir vardiklyje slepiasi tas pats daugiklis (x − a).`,
      [`Pirmiausia įstatome. Jei gauname skaičių – baigta.`, `Jei 0/0: skaitiklį ir vardiklį skaidome taip, kad atsirastų (x − a).`, `Suprastiname ir įstatome dar kartą.`],
      `Prastinti dėmenis, o ne daugiklius. Suprastinti galima tik tai, kas daugina visą skaitiklį ir visą vardiklį.`,
      `Skaičiuotuvu išbandome x, labai artimą a.`)
  },
  limconj: {
    en: X(`The root is what blocks the factoring. Multiplying by the conjugate removes it, because (a − b)(a + b) = a² − b².`,
      [`Multiply top and bottom by the same expression with the opposite sign in the middle.`, `The roots disappear and a factor like (x − a) appears.`, `Cancel it and substitute.`],
      `Multiplying only the top. The fraction must stay the same, so the bottom gets the conjugate too.`,
      `The conjugate itself does not become 0 at the limit point, so it is safe to substitute into it.`),
    lt: X(`Skaidyti trukdo šaknis. Daugindami iš jungtinio reiškinio ją pašaliname, nes (a − b)(a + b) = a² − b².`,
      [`Skaitiklį ir vardiklį dauginame iš to paties reiškinio su priešingu ženklu viduryje.`, `Šaknys dingsta ir atsiranda daugiklis, pvz., (x − a).`, `Suprastiname ir įstatome.`],
      `Padauginti tik skaitiklį. Trupmena turi likti ta pati, todėl jungtinis reiškinys atsiranda ir vardiklyje.`,
      `Pats jungtinis reiškinys ribos taške netampa 0, todėl į jį galima saugiai įstatyti.`)
  },
  limroot: {
    en: X(`A square root halves the power (a cube root thirds it). √(4x² + …) behaves like 2x, so treat it as a leading term.`,
      [`Under each root keep only the highest power and take the root of it.`, `Now every piece is a simple power of x.`, `Compare leading terms top and bottom, as for polynomial fractions.`],
      `Taking the root of the coefficient but forgetting the power: √(9x⁴) is 3x², not 3x⁴.`,
      `Put x = 10000 into a calculator.`),
    lt: X(`Kvadratinė šaknis laipsnį padalija pusiau (kubinė – į tris). √(4x² + …) elgiasi kaip 2x, todėl žiūrime į ją kaip į vyriausiąjį narį.`,
      [`Po kiekviena šaknimi paliekame tik aukščiausią laipsnį ir ištraukiame šaknį.`, `Dabar kiekviena dalis – paprastas x laipsnis.`, `Lyginame vyriausiuosius narius skaitiklyje ir vardiklyje kaip racionaliosiose trupmenose.`],
      `Ištraukti šaknį iš koeficiento, bet pamiršti laipsnį: √(9x⁴) yra 3x², o ne 3x⁴.`,
      `Skaičiuotuvu įstatome x = 10000.`)
  }
};
