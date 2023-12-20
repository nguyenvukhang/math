MINIMATH_VERSION := v1.1.7

MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
MAKEFILE_DIR  := $(dir $(MAKEFILE_PATH))

PYTEX := python3 $(MAKEFILE_DIR)tex_modules/pytex

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

MINIMATH := cargo run

x:
	$(MINIMATH) build $(TEX_FILES)

x2: 
	cd omath && dune exec omath

x1:
	@make test
	@make build

build:
	$(PYTEX) -J minimath build $(TEX_FILES)

dev:
	$(PYTEX) -J minimath dev $(TEX_FILES)

test:
	$(PYTEX) checkhealth

ref: BUILD := $(PYTEX) -J ref build toc.tex \
	plenary.tex \
	calculus.tex \
	algorithm-design.tex \
	complex-analysis.tex \
	nonlinear-optimization-unconstrained.tex \
	nonlinear-optimization-constrained.tex \
	ordinary-differential-equations.tex
ref:
	$(BUILD) && $(BUILD)

sha:
	$(PYTEX) sha | pbcopy

toc:
	$(PYTEX) toc

toc-md:
	$(PYTEX) toc-md

gen-notes:
	[ -d .git/prev ] && git worktree remove -f .git/prev || echo ""
	git worktree add .git/prev
	cd .git/prev && git reset --hard $(PREV_TAG)
	cd .git/prev && $(PYTEX) toc-md
	$(PYTEX) --prev-rel .git/prev/shas.json toc-md
	nvim CHANGELOG.md
	rm -f CHANGELOG.md
	[ -d .git/prev ] && git worktree remove -f .git/prev || echo ""
	git branch -D prev

fmt:
	@rm -f *.bak* **/*.bak* *indent.log
	latexindent -s -w -m -l=.latexindent.yaml *.tex || echo "failed"
	@rm -f *.bak* **/*.bak* *indent.log

label:
	$(PYTEX) label

head:
	@$(PYTEX) generate-section-titles

clean:
	rm -rf *.aux *.out *.log minimath*.pdf

open:
	open minimath.pdf

sync:
	rm -rf ~/uni/@/tex_modules
	cp -r $(MAKEFILE_DIR)tex_modules ~/uni/@/tex_modules

hooks:
	rm -rf $(MAKEFILE_DIR).git/hooks
	cd $(MAKEFILE_DIR).git && ln -s ../tex_modules/.hooks hooks
