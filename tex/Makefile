# TEX_FILES += algorithm-design.tex
# TEX_FILES += palculus.tex
# TEX_FILES += pomplex-analysis.tex
# TEX_FILES += header.tex
TEX_FILES += nonlinear-optimization.tex
# TEX_FILES += ordinary-differential-equations.tex
# TEX_FILES += plenary.tex

build:
	python3 build.py $(TEX_FILES)

test:
	python3 checkhealth.py

sha:
	python3 sha.py | pbcopy

sha-bash:
	@date +%s%N | openssl dgst -sha256 | cut -b1-7 | pbcopy

clean:
	rm -f *.aux *.log *.out
