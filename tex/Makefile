TEX_FILES += nonlinear-optimization.tex
TEX_FILES += complex-analysis.tex

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
