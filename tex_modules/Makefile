# Copy this into the working directory with all the ".tex" files to
# enable
# * make build : build a pdf
# * make dev   : monitor .tex files and build the pdf on changes
# * make open  : open the generated "out.pdf"

MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
MAKEFILE_DIR  := $(dir $(MAKEFILE_PATH))
PYTEX := $(MAKEFILE_DIR)tex_modules/pytex

TEX_FILES := main.tex

build:
	$(PYTEX) build $(TEX_FILES)

dev:
	$(PYTEX) dev $(TEX_FILES)

open:
	open out.pdf
