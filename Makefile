MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
MAKEFILE_DIR  := $(dir $(MAKEFILE_PATH))

PYTEX := python3 $(MAKEFILE_DIR)tex_modules/pytex
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
	bash bin/build-all.sh

test:
	@$(PYTEX) test

sha:
	@$(PYTEX) sha | pbcopy

label:
	$(PYTEX) label

head:
	$(PYTEX) generate-section-titles

clean:
	rm -rf .build
	rm -rf minimath*.pdf

open:
	open minimath.pdf

sync:
	rm -rf ~/uni/@/tex_modules
	cp -r $(MAKEFILE_DIR)tex_modules ~/uni/@/tex_modules
