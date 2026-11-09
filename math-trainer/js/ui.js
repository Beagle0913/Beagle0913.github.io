/* ================= interface (Lithuanian by default, English as an option) ================= */
(function () {
  const $ = s => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const dotfix = h => typeof h === 'string' ? h.replace(/·/g, '<span class="dot">·</span>') : h;
  const fn = (x, ctx) => dotfix(typeof x === 'function' ? x(ctx) : x);
  const STR = {
    lt: {
      brand: 'GMC matematikos <b>pratybų</b> treniruoklis', reset: 'Ištrinti pažangą', reset2: 'Spustelėkite dar kartą, kad ištrintumėte', choose: 'Pasirinkite uždavinio tipą', nav: 'Uždavinių tipai',
      mix1: 'Mišrūs uždaviniai (1 KD)', mix1s: '1–8 temos', mix2: 'Mišrūs uždaviniai (ribos)', mix2s: '9 tema', mix: 'mišrūs', title: 'GMC matematikos treniruoklis', skip: 'Praleisti šį uždavinį', stepOf: (k, n) => `${k} žingsnis iš ${n}`, solved: 'išspręsta be pagalbos', streak: 'iš eilės',
      topic: n => `${n} tema`, method: 'Kaip spręsti šio tipo uždavinius', check: 'Tikrinti', hint: 'Užuomina', show: 'Rodyti atsakymą', solL: 'Sprendimas', nohint: 'Šiam žingsniui užuominos nėra.',
      fill: 'Pirmiausia užpildykite visus langelius.', cant: v => `Nepavyko perskaityti „${v}“. Rašykite skaičius, trupmenas (3/4), sqrt(3), pi arba inf.`, pickopt: 'Pirmiausia pasirinkite atsakymą.',
      near: 'Labai arti. Įveskite tikslią reikšmę, pavyzdžiui, trupmeną 2/3.', notthat: 'Ne. Bandykite dar kartą.', notyet: 'Dar ne. Pažymėti langeliai neteisingi.',
      done: 'Išspręsta!', doneHelp: 'Atlikta su pagalba', another: 'Dar vienas toks uždavinys', next: 'Kitas uždavinys', repeat: 'Kartoti šį tipą', answer: 'atsakymas', row: 'eilutė', col: 'stulpelis', enter: t => 'įrašyti ' + t, lang: 'Kalba',
      keys: 'Atsakymų rašymas: trupmenos <code>3/4</code>, dešimtainės trupmenos <code>0,5</code> arba <code>0.5</code>, šaknys <code>sqrt(3)/2</code>, kampai <code>7pi/6</code>, begalybė <code>inf</code> ir <code>-inf</code>. Žingsnis tikrinamas klavišu Enter. Uždaviniai kaskart generuojami iš naujo pagal pratybų uždavinių pavyzdžius.'
    },
    en: {
      brand: 'GMC math <b>pratybos</b> trainer', reset: 'Reset progress', reset2: 'Click again to erase progress', choose: 'Choose exercise type', nav: 'Exercise types',
      mix1: 'Test 1 mix', mix1s: 'topics 1–8', mix2: 'Limits mix', mix2s: 'topic 9', mix: 'mix', title: 'GMC Math Trainer', skip: 'Skip this problem', stepOf: (k, n) => `Step ${k} of ${n}`, solved: 'solved without help', streak: 'streak',
      topic: n => `Topic ${n}`, method: 'How to solve this type', check: 'Check', hint: 'Hint', show: 'Show answer', solL: 'Worked', nohint: 'No hint for this step.',
      fill: 'Fill in every box first.', cant: v => `I can’t read “${v}”. Use numbers, fractions like 3/4, sqrt(3), pi or inf.`, pickopt: 'Pick an option first.',
      near: 'Very close. Give the exact value, for example a fraction like 2/3.', notthat: 'Not that. Try again.', notyet: 'Not yet. The marked boxes are wrong.',
      done: 'Solved!', doneHelp: 'Done, with help', another: 'Another one like this', next: 'Next problem', repeat: 'Repeat this type', answer: 'answer', row: 'row', col: 'column', enter: t => 'enter ' + t, lang: 'Language',
      keys: 'Typing answers: fractions <code>3/4</code>, decimals <code>0.5</code> or <code>0,5</code>, roots <code>sqrt(3)/2</code>, angles <code>7pi/6</code>, infinity <code>inf</code> and <code>-inf</code>. Press Enter to check a step. Problems are generated fresh every time, modelled on the exercises from the pratybos sheets.'
    }
  };
  const KEY = 'gmc-math-trainer-v1', LKEY = 'gmc-math-trainer-lang';
  let stats = { clean: {}, helped: {}, streak: 0 }, lang = 'lt';
  const count = x => (typeof x === 'number' && isFinite(x) && x >= 0) ? Math.min(Math.floor(x), 1e6) : 0;
  const cleanMap = m => { const o = {}; if (m && typeof m === 'object') for (const t of TYPES) { const c = count(m[t.id]); if (c) o[t.id] = c; } return o; };
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && typeof s === 'object') stats = { clean: cleanMap(s.clean), helped: cleanMap(s.helped), streak: count(s.streak) }; const l = localStorage.getItem(LKEY); if (l === 'en' || l === 'lt') lang = l; } catch (e) { /* storage unavailable or corrupted: start fresh */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(stats)); localStorage.setItem(LKEY, lang); } catch (e) { /* ignore */ } };
  let S_ = STR[lang];
  const tName = t => lang === 'lt' ? t.L.name : t.name, tOther = t => lang === 'lt' ? t.name : t.L.name;
  const topName = t => lang === 'lt' ? t.lt : t.name, topOther = t => lang === 'lt' ? t.name : t.lt;

  const byId = Object.fromEntries(TYPES.map(t => [t.id, t]));
  const ALL1 = [1, 2, 3, 4, 5, 6, 7, 8];
  let mode = { kind: 'mix', topics: ALL1, label: 'test1' };
  let cur = null, lastId = null, interacted = false;

  function applyLang() {
    S_ = STR[lang]; document.documentElement.lang = lang; document.title = S_.title;
    $('#brand').innerHTML = S_.brand; $('#reset').textContent = S_.reset; $('#navtoggle span').textContent = S_.choose; $('#nav').setAttribute('aria-label', S_.nav); $('#keys').innerHTML = S_.keys;
    $('#langs').setAttribute('aria-label', S_.lang);
    document.querySelectorAll('#langs button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false'));
  }
  document.querySelectorAll('#langs button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return; lang = b.dataset.lang; save(); applyLang(); interacted = true;
    const keep = mode; if (cur) { mode = { kind: 'type', id: cur.type.id, label: keep.label }; newProblem(); mode = keep; drawNav(); } else newProblem();
  }));

  /* ---------- navigation ---------- */
  function drawNav() {
    const nav = $('#nav'); nav.innerHTML = '';
    const mixes = el('div', 'mixes');
    const mk = (cls, html, m, current) => { const b = el('button', 'navb ' + cls, html); b.type = 'button'; if (current) b.setAttribute('aria-current', 'true'); b.addEventListener('click', () => { mode = m; interacted = true; nav.classList.remove('open'); $('#navtoggle').setAttribute('aria-expanded', 'false'); newProblem(); }); return b; };
    mixes.append(mk('mix', `<span>${S_.mix1}</span><span class="cnt">${S_.mix1s}</span>`, { kind: 'mix', topics: ALL1, label: 'test1' }, mode.label === 'test1'));
    mixes.append(mk('mix', `<span>${S_.mix2}</span><span class="cnt">${S_.mix2s}</span>`, { kind: 'mix', topics: [9], label: 'test2' }, mode.label === 'test2'));
    nav.append(mixes);
    for (const t of TOPICS) {
      const box = el('div', 'topic');
      box.append(mk('th', `<span><span class="no">${t.n}</span>${topName(t)}</span><span class="cnt">${S_.mix}</span>`, { kind: 'mix', topics: [t.n], label: 't' + t.n }, mode.label === 't' + t.n));
      box.append(el('div', 'lt', topOther(t)));
      for (const ty of TYPES.filter(x => x.topic === t.n)) {
        const c = stats.clean[ty.id] || 0;
        box.append(mk('ty', `<span>${tName(ty)}</span><span class="cnt">${c ? c + ' ✓' : ''}</span>`, { kind: 'type', id: ty.id, label: ty.id }, mode.label === ty.id));
      }
      nav.append(box);
    }
    const curBtn = nav.querySelector('[aria-current="true"]'); if (curBtn && nav.scrollHeight > nav.clientHeight) { const top = curBtn.offsetTop - nav.offsetTop; if (top < nav.scrollTop || top > nav.scrollTop + nav.clientHeight - 60) nav.scrollTop = Math.max(0, top - nav.clientHeight / 3); }
    const total = Object.values(stats.clean).reduce((a, b) => a + b, 0);
    $('#tally').innerHTML = `<span><strong>${total}</strong> ${S_.solved}</span><span>${S_.streak} <strong>${stats.streak}</strong></span>`;
  }
  $('#navtoggle').addEventListener('click', () => { const o = $('#nav').classList.toggle('open'); $('#navtoggle').setAttribute('aria-expanded', o ? 'true' : 'false'); });
  let armed = false;
  $('#reset').addEventListener('click', e => {
    if (!armed) { armed = true; e.target.textContent = S_.reset2; setTimeout(() => { armed = false; e.target.textContent = S_.reset; }, 4000); return; }
    stats = { clean: {}, helped: {}, streak: 0 }; save(); armed = false; e.target.textContent = S_.reset; drawNav();
  });

  /* ---------- problem ---------- */
  function pickType() {
    if (mode.kind === 'type') return byId[mode.id];
    const pool = TYPES.filter(t => mode.topics.includes(t.topic) && (t.id !== lastId));
    // favour the types solved least often so the mix covers everything
    const w = pool.map(t => 1 / (1 + (stats.clean[t.id] || 0))); let r = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < pool.length; i++) { r -= w[i]; if (r <= 0) return pool[i]; }
    return pool[pool.length - 1];
  }
  function newProblem() {
    const type = pickType(); lastId = type.id;
    const gen = lang === 'lt' ? type.L.gen : type.gen; let prob = gen();
    for (let tries = 0; tries < 25 && !selfCheck(prob); tries++) prob = gen();
    cur = { type, prob, ctx: {}, k: 0, helped: false };
    const topic = TOPICS.find(t => t.n === type.topic), sheet = $('#sheet'); sheet.innerHTML = '';
    const head = el('div', 'phead', `<span class="tag">${S_.topic(topic.n)}</span><h2>${tName(type)}</h2><span class="lt">${tOther(type)}</span><span class="prog" id="prog"></span>`);
    const skip = el('button', 'linkb skip', S_.skip); skip.type = 'button'; skip.addEventListener('click', () => { interacted = true; newProblem(); }); head.append(skip);
    const method = el('details', 'method', `<summary>${S_.method}</summary><p>${lang === 'lt' ? type.L.method : type.method}</p>`);
    const stmt = el('div', 'stmt math', dotfix(cur.prob.q));
    const steps = el('ol', 'steps'); steps.id = 'steps';
    sheet.append(head, method, stmt, steps);
    drawNav(); drawStep();
    if (interacted) window.scrollTo({ top: Math.max(0, sheet.getBoundingClientRect().top + window.scrollY - 12), behavior: 'auto' });
  }

  function fieldDom(f, k, fi) {
    const wrap = el('span', 'fld'); const id = `s${k}f${fi}`;
    const lbl = el('span', 'lbl', f.label || ''); wrap.append(lbl);
    const plain = (f.label || S_.answer).replace(/<[^>]+>/g, '').trim() || S_.answer;
    if (f.k === 'num') {
      const i = el('input', 'in'); i.type = 'text'; i.id = id; i.autocomplete = 'off'; i.spellcheck = false; i.setAttribute('autocapitalize', 'off'); i.setAttribute('aria-label', plain); if (f.w) i.style.setProperty('--w', f.w);
      wrap.append(i, el('span', 'aft', f.after || ''));
      if (f.inf) for (const [t, v] of [['+∞', 'inf'], ['−∞', '-inf']]) { const c = el('button', 'chip', t); c.type = 'button'; c.setAttribute('aria-label', S_.enter(t)); c.addEventListener('click', () => { i.value = v; i.focus(); }); wrap.append(c); }
    } else if (f.k === 'mat') {
      const mx = el('span', 'mx inp'), g = el('span', 'mg c' + f.c);
      for (let a = 0; a < f.r; a++) for (let b = 0; b < f.c; b++) { const i = el('input', 'in'); i.type = 'text'; i.id = `${id}r${a}c${b}`; i.autocomplete = 'off'; i.spellcheck = false; i.setAttribute('autocapitalize', 'off'); i.setAttribute('aria-label', `${plain} ${S_.row} ${a + 1} ${S_.col} ${b + 1}`); i.style.setProperty('--w', 4); i.dataset.r = a; i.dataset.c = b; g.append(i); }
      mx.append(g); wrap.append(mx); wrap.style.whiteSpace = 'normal';
    } else {
      const box = el('span', 'opts'); box.setAttribute('role', 'group'); wrap.style.whiteSpace = 'normal';
      f.options.forEach((o, n) => {
        const b = el('button', 'opt', o); b.type = 'button'; b.id = `${id}o${n}`; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => { if (f.k === 'choice') box.querySelectorAll('.opt').forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', f.k === 'checks' && b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); b.classList.remove('bad'); box.dispatchEvent(new CustomEvent('picked', { bubbles: true })); });
        box.append(b);
      });
      wrap.append(box);
    }
    return wrap;
  }
  function read(step, li) {              // -> {vals, err}
    const vals = []; let err = null;
    step.fields.forEach((f, fi) => {
      const w = li.querySelectorAll('.fields > .fld')[fi];
      if (f.k === 'num') { const i = w.querySelector('input'); i.classList.remove('bad'); if (!i.value.trim()) err = err || S_.fill; else { const v = parseNum(i.value); if (isNaN(v)) { i.classList.add('bad'); err = S_.cant(i.value); } vals.push(v); return; } vals.push(NaN); }
      else if (f.k === 'mat') {
        const m = Array.from({ length: f.r }, () => Array(f.c).fill(NaN));
        w.querySelectorAll('input').forEach(i => { i.classList.remove('bad'); if (!i.value.trim()) { err = err || S_.fill; return; } const v = parseNum(i.value); if (isNaN(v)) { i.classList.add('bad'); err = S_.cant(i.value); } m[+i.dataset.r][+i.dataset.c] = v; });
        vals.push(m);
      } else {
        const on = [...w.querySelectorAll('.opt')].map(b => b.getAttribute('aria-pressed') === 'true');
        if (f.k === 'choice') { const n = on.indexOf(true); if (n < 0) err = err || S_.pickopt; vals.push(n); } else vals.push(on);
      }
    });
    return { vals, err };
  }
  function fill(step, li, ans) {
    step.fields.forEach((f, fi) => {
      const w = li.querySelectorAll('.fields > .fld')[fi], a = ans[fi];
      if (f.k === 'num') w.querySelector('input').value = S(a);
      else if (f.k === 'mat') w.querySelectorAll('input').forEach(i => { i.value = S(a[+i.dataset.r][+i.dataset.c]); });
      else w.querySelectorAll('.opt').forEach((b, n) => b.setAttribute('aria-pressed', (f.k === 'choice' ? n === a : !!a[n]) ? 'true' : 'false'));
    });
  }
  function drawStep() {
    const step = cur.prob.steps[cur.k], k = cur.k, li = el('li', 'step active');
    $('#prog').textContent = S_.stepOf(k + 1, cur.prob.steps.length);
    const body = el('div', 'math');
    body.append(el('div', 'sq', fn(step.q, cur.ctx)));
    const fields = el('div', 'fields'); step.fields.forEach((f, fi) => { if (f.br) fields.append(el('span', 'brk')); fields.append(fieldDom(f, k, fi)); }); body.append(fields);
    const acts = el('div', 'acts'), bCheck = el('button', 'btn primary', S_.check), bHint = el('button', 'btn', S_.hint), bShow = el('button', 'btn', S_.show), fb = el('span', 'fb');
    [bCheck, bHint, bShow].forEach(b => { b.type = 'button'; }); fb.setAttribute('role', 'status');
    bCheck.dataset.act = 'check'; bHint.dataset.act = 'hint'; bShow.dataset.act = 'show';
    acts.append(bCheck, bHint, bShow, fb); body.append(acts);
    const hint = el('div', 'hint'); hint.hidden = true; hint.dataset.label = S_.hint; body.append(hint);
    li.append(el('div', 'no', String(k + 1)), body); $('#steps').append(li);
    let tries = 0;
    const showHint = () => { hint.innerHTML = fn(step.hint, cur.ctx) || S_.nohint; hint.hidden = false; cur.helped = true; };
    const lock = (cls) => {
      li.classList.remove('active'); li.classList.add(cls);
      li.querySelectorAll('input, .opt').forEach(x => { x.disabled = true; x.classList.remove('bad'); });
      if (step.save) step.save(cur.ctx);
      acts.remove(); hint.hidden = true;
      const sol = fn(step.sol, cur.ctx); if (sol) { const s = el('div', 'sol', sol); s.dataset.label = S_.solL; body.append(s); }
      cur.k++; if (cur.k < cur.prob.steps.length) drawStep(); else finish();
    };
    const check = () => {
      interacted = true;
      const { vals, err } = read(step, li);
      if (err) { fb.className = 'fb no'; fb.textContent = err; return; }
      const r = checkStep(step, vals, cur.ctx);
      if (r.ok) return lock('done');
      tries++; let near = false;
      for (const b of r.bad) {
        const f = step.fields[b.f], w = li.querySelectorAll('.fields > .fld')[b.f];
        if (f.k === 'num') { w.querySelector('input').classList.add('bad'); if (!step.val) { const a = val(step.ans[b.f]); if (isFinite(a) && isFinite(vals[b.f]) && Math.abs(vals[b.f] - a) < 0.006 * Math.max(1, Math.abs(a))) near = true; } }
        else if (f.k === 'mat') w.querySelectorAll('input').forEach(i => { if (!b.cells || b.cells.some(c => c[0] === +i.dataset.r && c[1] === +i.dataset.c)) i.classList.add('bad'); });
        else w.querySelectorAll('.opt[aria-pressed="true"]').forEach(x => x.classList.add('bad'));
      }
      fb.className = 'fb no';
      fb.textContent = r.msg || (near ? S_.near : step.fields.every(f => f.k === 'choice' || f.k === 'checks') ? S_.notthat : S_.notyet);
      if (tries === 2 && hint.hidden) showHint();
    };
    bCheck.addEventListener('click', check);
    bHint.addEventListener('click', showHint);
    bShow.addEventListener('click', () => { interacted = true; cur.helped = true; fill(step, li, step.ansFn ? step.ansFn(cur.ctx) : step.ans); lock('shown'); });
    li.addEventListener('keydown', e => {
      const t = e.target; if (!t.matches('input')) return;
      if (e.key === 'Enter') { e.preventDefault(); check(); return; }
      if (t.dataset.r === undefined || e.altKey || e.ctrlKey || e.metaKey) return;
      const r = +t.dataset.r, c = +t.dataset.c, atStart = t.selectionStart === 0 && t.selectionEnd === 0, atEnd = t.selectionStart === t.value.length;
      const to = e.key === 'ArrowUp' ? [r - 1, c] : e.key === 'ArrowDown' ? [r + 1, c] : (e.key === 'ArrowLeft' && atStart) ? [r, c - 1] : (e.key === 'ArrowRight' && atEnd) ? [r, c + 1] : null;
      if (!to) return; const nx = t.closest('.mg').querySelector(`input[data-r="${to[0]}"][data-c="${to[1]}"]`); if (nx) { e.preventDefault(); nx.focus(); nx.select(); }
    });
    li.addEventListener('input', e => { e.target.classList.remove('bad'); });
    if (step.fields.length === 1 && step.fields[0].k === 'choice') { bCheck.hidden = true; li.addEventListener('picked', check); }
    if (interacted) { const first = li.querySelector('input:not(:disabled), .opt'); if (first) first.focus({ preventScroll: true }); li.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }
  function finish() {
    const id = cur.type.id;
    if (cur.helped) { stats.helped[id] = (stats.helped[id] || 0) + 1; stats.streak = 0; } else { stats.clean[id] = (stats.clean[id] || 0) + 1; stats.streak++; }
    save(); drawNav();
    const f = el('div', 'finish');
    f.append(el('span', 'verdict' + (cur.helped ? ' help' : ''), cur.helped ? S_.doneHelp : S_.done));
    const next = el('button', 'btn primary', mode.kind === 'type' ? S_.another : S_.next); next.type = 'button'; next.dataset.act = 'next'; next.addEventListener('click', () => { interacted = true; newProblem(); }); f.append(next);
    if (mode.kind === 'mix') { const again = el('button', 'btn', S_.repeat); again.type = 'button'; again.addEventListener('click', () => { interacted = true; const keep = mode; mode = { kind: 'type', id, label: keep.label }; newProblem(); mode = keep; drawNav(); }); f.append(again); }
    $('#prog').textContent = ''; const sk = $('#sheet .skip'); if (sk) sk.remove();
    $('#sheet').append(f); next.focus({ preventScroll: true }); f.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  applyLang(); newProblem();
})();
