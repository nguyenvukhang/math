#!/bin/bash

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

PYTEX="python3 tex_modules/pytex"

b() {
  JOB="$1"
  echo "job: $JOB"
    # run twice to generate document references correctly
    # only report errors on the second one, since the first one will have
    # incorrectly flagged-out undefined references anyway
  $PYTEX -J $JOB ${@:2} build ${TEX_FILES[@]} >/dev/null
  $PYTEX -J $JOB ${@:2} build ${TEX_FILES[@]}
}

b minimath
b minimath.nc --no-compute
b minimath.np --no-proof
b minimath.np.nc --no-proof --no-compute

TEX_FILES=(toc.tex plenary.tex calculus.tex)
b plenary
