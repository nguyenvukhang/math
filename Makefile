MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
MAKEFILE_DIR  := $(dir $(MAKEFILE_PATH))

PYTEX := python3 bin/pytex
# PYTEX := pytex


# --- [TEX_FILES] ---
TEX_FILES += plenary.tex
# TEX_FILES += algorithm-design.tex
TEX_FILES += calculus.tex
# TEX_FILES += complex-analysis.tex
TEX_FILES += nonlinear-optimization-unconstrained.tex
TEX_FILES += nonlinear-optimization-constrained.tex
# TEX_FILES += ordinary-differential-equations.tex


# --- [BUILD_ARGS] ---
BUILD_ARGS += -Hheader.tex
BUILD_ARGS += -Jminimath
# BUILD_ARGS += --no-proof
# BUILD_ARGS += --no-compute


build:
	$(PYTEX) $(BUILD_ARGS) --pretty build $(TEX_FILES)

build-pre:
	$(PYTEX) -Hheader.tex -Jplenary --pretty build plenary.tex calculus.tex

v:
	$(PYTEX) $(BUILD_ARGS) build $(TEX_FILES)

dev:
	$(PYTEX) $(BUILD_ARGS) --pretty dev $(TEX_FILES)

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
	python3 $(MAKEFILE_DIR)bin/label.py

edit:
	nvim `which pytex`
	cp `which pytex` bin/pytex

head:
	python3 bin/gen.py headers >> header.tex

syntax:
	python3 bin/gen.py syntax > tex.vim
	cat tex.vim >> ~/dots/nvim/after/syntax/tex.vim
