TEX_FILES += plenary.tex
# TEX_FILES += algorithm-design.tex
TEX_FILES += calculus.tex
# TEX_FILES += complex-analysis.tex
# TEX_FILES += nonlinear-optimization.tex
TEX_FILES += ordinary-differential-equations.tex

SETUP := python3 pytex.py
BUILD_ARGS += -Hheader.tex
# BUILD_ARGS += --no-proof
# BUILD_ARGS += --no-compute


build:
	$(SETUP) $(BUILD_ARGS) build $(TEX_FILES)

dev:
	$(SETUP) $(BUILD_ARGS) dev $(TEX_FILES)

all:
	$(SETUP) $(BUILD_ARGS) build \
		plenary.tex \
		calculus.tex \
		algorithm-design.tex \
		complex-analysis.tex \
		nonlinear-optimization.tex \
		ordinary-differential-equations.tex

test:
	@$(SETUP) test

sha:
	@$(SETUP) sha | pbcopy

sha-bash:
	@date +%s%N | openssl dgst -sha256 | cut -b1-7 | pbcopy

clean:
	rm -rf .build

open:
	open minimath.pdf

tag:
	git tag -f latest
	git push --tag --force
