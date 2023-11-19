MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
MAKEFILE_DIR  := $(dir $(MAKEFILE_PATH))

PYTEX := pytex
TEX_FILES += main.tex
BUILD_ARGS += -H$(MAKEFILE_DIR)../../header.tex

build:
	$(PYTEX) $(BUILD_ARGS) build $(TEX_FILES)

dev:
	$(PYTEX) $(BUILD_ARGS) dev $(TEX_FILES)

clean:
	rm -rf .build
	rm -rf hw.pdf

open:
	open hw.pdf
