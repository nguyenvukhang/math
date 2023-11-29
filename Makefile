MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
MAKEFILE_DIR  := $(dir $(MAKEFILE_PATH))

PYTEX := python3 $(MAKEFILE_DIR)tex_modules/pytex

# --- [TEX_FILES] ---
TEX_FILES += plenary.tex
TEX_FILES += calculus.tex
# TEX_FILES += algorithm-design.tex
# TEX_FILES += complex-analysis.tex
TEX_FILES += nonlinear-optimization-unconstrained.tex
TEX_FILES += nonlinear-optimization-constrained.tex
# TEX_FILES += ordinary-differential-equations.tex

build:
	$(PYTEX) -J minimath \
		build $(TEX_FILES)

fmt:
	rm -f *.bak* **/*.bak*
	latexindent -s -w -m -l=.latexindent.yaml *.tex || echo "failed"
	rm -f *.bak* **/*.bak*

test:
	@tex_modules/__tests__.py

plenary:
	$(PYTEX) -J plenary \
		build plenary.tex calculus.tex

refs:
	$(PYTEX) -J plenary build plenary.tex calculus.tex
	$(PYTEX) -J all build plenary.tex calculus.tex *.tex

dev:
	$(PYTEX) -J minimath --toc dev $(TEX_FILES)

all:
	bash .github/workflows/build-all.sh

sha:
	@$(PYTEX) sha | pbcopy

sha-dev:
	@$(PYTEX) sha

label:
	$(PYTEX) label

head:
	@$(PYTEX) generate-section-titles

clean:
	rm -rf .build *.log minimath*.pdf

open:
	open minimath.pdf

sync:
	rm -rf ~/uni/@/tex_modules
	cp -r $(MAKEFILE_DIR)tex_modules ~/uni/@/tex_modules
