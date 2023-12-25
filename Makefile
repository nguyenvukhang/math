MINIMATH_VERSION := v1.1.7

MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
MAKEFILE_DIR  := $(dir $(MAKEFILE_PATH))

# --- [TEX_FILES] ---
TEX_FILES += toc.tex
TEX_FILES += plenary.tex
TEX_FILES += calculus.tex
# TEX_FILES += complex-analysis.tex
# TEX_FILES += nonlinear-optimization-unconstrained.tex
# TEX_FILES += nonlinear-optimization-constrained.tex
TEX_FILES += ordinary-differential-equations.tex
# TEX_FILES += algorithm-design.tex
# TEX_FILES += sandbox.tex

MINIMATH := minimath

ALL_TEX_FILES := toc.tex \
	plenary.tex \
	calculus.tex \
	algorithm-design.tex \
	complex-analysis.tex \
	nonlinear-optimization-unconstrained.tex \
	nonlinear-optimization-constrained.tex \
	ordinary-differential-equations.tex

install:
	cargo install --path . --locked --debug

build:
	@make install
	$(MINIMATH) build $(TEX_FILES)

dev:
	$(MINIMATH) dev $(TEX_FILES)

test:
	@make install
	$(MINIMATH) checkhealth

ref: BUILD := $(MINIMATH) build -J ref
ref: BUILD += $(ALL_TEX_FILES)
ref:
	@make build-cli
	$(BUILD) && $(BUILD)

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
