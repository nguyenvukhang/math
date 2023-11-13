TEX_FILES += plenary.tex
# TEX_FILES += algorithm-design.tex
# TEX_FILES += calculus.tex
# TEX_FILES += complex-analysis.tex
# TEX_FILES += header.tex
TEX_FILES += nonlinear-optimization.tex
# TEX_FILES += ordinary-differential-equations.tex

SETUP := python3 setup.py

build:
	@$(SETUP) build $(TEX_FILES)

build-all:
	@$(SETUP) build --all

test:
	@$(SETUP) checkhealth

sha:
	@$(SETUP) sha | pbcopy

sha-bash:
	@date +%s%N | openssl dgst -sha256 | cut -b1-7 | pbcopy

clean:
	rm -rf .build

open:
	open .build/minimath.pdf

dev:
	@$(SETUP) dev
