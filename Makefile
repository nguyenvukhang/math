MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
MAKEFILE_DIR  := $(dir $(MAKEFILE_PATH))

PYTEX := python3 $(MAKEFILE_DIR)bin/pytex
# PYTEX += --no-proof
# PYTEX += --no-compute

# --- [TEX_FILES] ---
TEX_FILES += toc.tex
TEX_FILES += plenary.tex
TEX_FILES += algorithm-design.tex
# TEX_FILES += calculus.tex
# TEX_FILES += complex-analysis.tex
# TEX_FILES += nonlinear-optimization-unconstrained.tex
# TEX_FILES += nonlinear-optimization-constrained.tex
# TEX_FILES += ordinary-differential-equations.tex


build:
	$(PYTEX) -J minimath \
		build $(TEX_FILES)

plenary:
	$(PYTEX) -J plenary \
		build plenary.tex calculus.tex

dev:
	$(PYTEX) -J minimath dev $(TEX_FILES)

all:
	python3 bin/build-all.py

test:
	@$(PYTEX) test

sha:
	@$(PYTEX) sha | pbcopy

clean:
	rm -rf .build
	rm -rf minimath*.pdf

open:
	open minimath.pdf

label:
	$(PYTEX) label

head:
	$(PYTEX) generate-section-titles

syntax:
	python3 bin/gen.py syntax > tex.vim
	cat tex.vim >> ~/dots/nvim/after/syntax/tex.vim

sync:
	rm -rf ~/uni/@/tex_modules
	cp -r $(MAKEFILE_DIR)tex_modules ~/uni/@/tex_modules
