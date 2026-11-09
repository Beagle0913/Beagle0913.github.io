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
js/explain.js  Plain-language notes for every type (idea, plan, common slip, quick check), in both languages.
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

For every exercise type, in both languages, this:

- checks that the stored answers are accepted when typed the way the page shows them, and that a perturbed answer (all boxes, and each box on its own) is rejected;
- recomputes the answers independently from the raw problem data (Gaussian elimination, polar complex arithmetic, numerical limits, simulation of the matrix models) and compares;
- generates the Lithuanian and English versions from the same random seed and requires identical answers;
- checks that no text contains `undefined` or `NaN`, and times each generator.

The page also runs every freshly generated problem through its own checker before showing it, and makes a new one if that fails.
