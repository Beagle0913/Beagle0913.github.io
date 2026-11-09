# GMC Math Trainer

Step-by-step practice for the VU GMC mathematics pratybos (topics 1–9): coordinate systems, vectors, matrices, determinants and linear systems, complex numbers, eigenvalues, iterated matrices and limits.

Every problem is generated at random and solved one step at a time on screen. Each step is checked as soon as it is entered, and has a hint and a worked line. The page opens in Lithuanian; the LT / EN buttons switch language. Progress is kept in the browser only.

## Files

```
index.html     The page.
trainer.css    Styles (light and dark theme).
js/core.js     Fractions, the answer parser, maths-to-HTML helpers, answer checking, the list of topics.
js/gen1.js     English exercise types for topics 3–5.
js/gen2.js     English exercise types for topics 6–9.
js/gen0.js     English exercise types for topics 1–2.
js/lt1.js, lt2.js, lt0.js   The same exercise types in Lithuanian.
js/ui.js       The interface and its texts in both languages.
tools/test.js  Checks every exercise type in both languages.
```

## How an exercise type is defined

`reg(id, topic, name, ltName, method, gen)` registers the English version and `regLT(id, name, method, gen)` the Lithuanian one. `gen()` returns a statement `q` and a list of steps. A step is `st(prompt, fields, answers, hint, solution)`, where the fields are `num(...)`, `mat(rows, cols, ...)`, `choice([...])` or `checks([...])`. A step may carry its own `val` function when more than one answer is right (for example any non-zero multiple of an eigenvector).

When you change a generator, change it in both languages.

## Test

```
node tools/test.js 2000
```

This generates 2000 problems of every type in each language, checks that the stored answers are accepted, that wrong answers are rejected, and that no text contains `undefined` or `NaN`.
