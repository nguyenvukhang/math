MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
MAKEFILE_DIR  := $(dir $(MAKEFILE_PATH))

PYTEX := python3 $(MAKEFILE_DIR)tex_modules/pytex

# --- [TEX_FILES] ---
TEX_FILES += toc.tex
TEX_FILES += plenary.tex
TEX_FILES += calculus.tex
TEX_FILES += complex-analysis.tex
# TEX_FILES += nonlinear-optimization-unconstrained.tex
# TEX_FILES += nonlinear-optimization-constrained.tex
# TEX_FILES += ordinary-differential-equations.tex
# TEX_FILES += algorithm-design.tex
# TEX_FILES += sandbox.tex

build:
	$(PYTEX) -J minimath build $(TEX_FILES)

dev:
	$(PYTEX) -J minimath dev $(TEX_FILES)

ref:
	$(PYTEX) -J ref build \
		plenary.tex \
		calculus.tex \
    algorithm-design.tex \
    complex-analysis.tex \
    nonlinear-optimization-unconstrained.tex \
    nonlinear-optimization-constrained.tex \
    ordinary-differential-equations.tex

toc:
	$(PYTEX) toc

ci:
	bash .github/workflows/build.sh
	TEXINPUTS='tex_modules/:' pdflatex .ci/minimath.tex
	@make clean

fmt:
	prettier -w --print-width 200 toc.json
	rm -f *.bak* **/*.bak*
	latexindent -s -w -m -l=.latexindent.yaml *.tex || echo "failed"
	rm -f *.bak* **/*.bak*

test:
	@tex_modules/__tests__.py

plenary:
	$(PYTEX) -J plenary \
		build plenary.tex calculus.tex

sha:
	@$(PYTEX) sha | pbcopy

sha-dev:
	@$(PYTEX) sha

label:
	$(PYTEX) label

head:
	@$(PYTEX) generate-section-titles

clean:
	rm -rf .ci .build *.aux *.out *.log minimath*.pdf

open:
	open minimath.pdf

sync:
	rm -rf ~/uni/@/tex_modules
	cp -r $(MAKEFILE_DIR)tex_modules ~/uni/@/tex_modules
