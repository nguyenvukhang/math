# PYTEX := python3 pytex.py
PYTEX := pytex


# --- [TEX_FILES] ---
TEX_FILES += plenary.tex
# TEX_FILES += algorithm-design.tex
TEX_FILES += calculus.tex
# TEX_FILES += complex-analysis.tex
TEX_FILES += nonlinear-optimization.tex
# TEX_FILES += ordinary-differential-equations.tex


# --- [BUILD_ARGS] ---
BUILD_ARGS += -Hheader.tex
BUILD_ARGS += -Jminimath
# BUILD_ARGS += --no-proof
# BUILD_ARGS += --no-compute


build:
	$(PYTEX) $(BUILD_ARGS) build $(TEX_FILES)

dev:
	$(PYTEX) $(BUILD_ARGS) dev $(TEX_FILES)

all:
	$(PYTEX) $(BUILD_ARGS) $(ARGS) build \
		plenary.tex \
		calculus.tex \
		algorithm-design.tex \
		complex-analysis.tex \
		nonlinear-optimization.tex \
		ordinary-differential-equations.tex

test:
	@$(PYTEX) test

sha:
	@$(PYTEX) sha | pbcopy

clean:
	rm -rf .build
	rm -rf minimath.pdf

open:
	open minimath.pdf
