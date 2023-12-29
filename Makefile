MINIMATH_VERSION := v1.1.7

MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
MAKEFILE_DIR  := $(dir $(MAKEFILE_PATH))

# --- [TEX_FILES] ---
TEX_FILES += toc.tex
TEX_FILES += plenary.tex
TEX_FILES += real-analysis.tex
# TEX_FILES += calculus.tex
# TEX_FILES += complex-analysis.tex
# TEX_FILES += nonlinear-optimization-unconstrained.tex
# TEX_FILES += nonlinear-optimization-constrained.tex
# TEX_FILES += ordinary-differential-equations.tex
# TEX_FILES += algorithm-design.tex
# TEX_FILES += sandbox.tex

MINIMATH := minimath

LINGUIST := $(HOMEBREW_PREFIX)/lib/ruby/gems/3.2.0/bin/github-linguist

ALL_TEX_FILES := toc.tex \
	plenary.tex \
	calculus.tex \
	algorithm-design.tex \
	complex-analysis.tex \
	nonlinear-optimization-unconstrained.tex \
	nonlinear-optimization-constrained.tex \
	ordinary-differential-equations.tex

BUILD_CMD := cargo install --features dev --path . --locked
# BUILD_CMD += --debug

current:
	$(LINGUIST) --help
	$(LINGUIST) tex_modules/headers.sty -b

install:
	$(BUILD_CMD)

build:
	@make install
	$(MINIMATH) build $(TEX_FILES)

dev:
	@make install
	$(MINIMATH) dev $(TEX_FILES)

test:
	@make install
	$(MINIMATH) checkhealth

ref: BUILD := $(MINIMATH) build -J ref
ref: BUILD += $(ALL_TEX_FILES)
ref:
	@make install
	$(BUILD)
	$(MINIMATH) pdf .git/.build/ref.tex
	$(MINIMATH) pdf .git/.build/ref.tex

fmt:
	@rm -f *.bak* **/*.bak* *indent.log
	latexindent -s -w -m -l=.latexindent.yaml *.tex || echo "failed"
	@rm -f *.bak* **/*.bak* *indent.log

label:
	$(MINIMATH) label

head:
	$(MINIMATH) generate-marks

clean:
	rm -rf *.aux *.out *.log minimath*.pdf .git/.build

open:
	open minimath.pdf

sync:
	rm -rf ~/uni/@/tex_modules
	cp -r $(MAKEFILE_DIR)tex_modules ~/uni/@/tex_modules

hooks:
	rm -rf $(MAKEFILE_DIR).git/hooks
	cd $(MAKEFILE_DIR).git && ln -s ../tex_modules/.hooks hooks

setup:
	git submodule update --init
