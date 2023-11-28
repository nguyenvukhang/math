# pytex

A build tool for my math notes.

A **mark** is a custom LaTeX command along the lines of

```
\Theorem{4.1.6}{Antoine's Conjecture}\label{cc7b8c6}
```

- Build
  - Hide certain environments
- Continuous build
  - Rebuild on change
- Generate TOC
- Generate a fresh SHA
- Add labels to all
- Check for duplicate SHA definitions
- Generate mark definitions in `headers.sty`

## Development mode (continuous build)

Create an index for all files. Upon any file changing, re-index that
file

## Development points

Keep cases simple by having a health-check script the enforces a
set of constraints on all input tex files.

## Constraints

- Cannot nest `{proof}` and `{compute}` environments.
- `\begin` and `\end` of self-defined environments `proof` and
  `compute` must be on a line of its own.

## Roadmap

Forgo hiding proofs and computes for now, in the interest of studying
for exams. Focus on TOC and enforcing non-duplicate SHAs.
