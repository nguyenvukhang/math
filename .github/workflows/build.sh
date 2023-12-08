#!/bin/bash

build() {
  # \begin{document}
  echo '\documentclass{article}' >$1
  echo '\usepackage{headers}' >>$1
  printf '\\begin{document}\n\n' >>$1

  # append each file
  for t in "${TEX_FILES[@]}"; do
    cat $t >>$1
    printf '\n\\newpage\n\n' >>$1
  done

  # \end{document}
  printf '\n\\end{document}' >>$1
}

TEX_FILES=(
  toc.tex
  plenary.tex
  calculus.tex
  algorithm-design.tex
  complex-analysis.tex
  nonlinear-optimization-unconstrained.tex
  nonlinear-optimization-constrained.tex
  ordinary-differential-equations.tex
)
build .git/minimath.tex

TEX_FILES=(plenary.tex calculus.tex)
build .git/plenary.tex
