TEX_FILES += nonlinear-optimization.tex
TEX_FILES += complex-analysis.tex

build:
	python3 build.py $(TEX_FILES)

sha:
	@date +%s%N | openssl dgst -sha256 | cut -b1-7

clean:
	rm -f *.aux *.log *.out
