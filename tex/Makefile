# TEX_FILES += algorithm-design.tex
# TEX_FILES += palculus.tex
# TEX_FILES += pomplex-analysis.tex
# TEX_FILES += header.tex
# TEX_FILES += nonlinear-optimization.tex
TEX_FILES += ordinary-differential-equations.tex
# TEX_FILES += plenary.tex

SETUP := python3 setup.py

build:
	@$(SETUP) build $(TEX_FILES)

test:
	@$(SETUP) checkhealth

sha:
	@$(SETUP) sha | pbcopy

sha-bash:
	@date +%s%N | openssl dgst -sha256 | cut -b1-7 | pbcopy

clean:
	rm -rf .build

open:
	open minimath.pdf

dev:
	@$(SETUP) dev
