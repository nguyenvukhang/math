#!/bin/bash

build() {
  # \begin{document}
  cat >$1 <<-EOF
\\documentclass{article}
\\usepackage{headers}
\\begin{document}

EOF
  # append each file
  for t in "${TEX_FILES[@]}"; do
    cat $t >>$1
    echo $'\n\\newpage\n' >>$1
  done
  # \end{document}
  echo $'\n\n\\end{document}' >>$1
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
