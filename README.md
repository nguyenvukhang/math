### minimath

> _So mini that the font size of mini is 0 in the repo name._

A set of math notes in a single PDF, with everything linked to
maximize navigational efficiency.

PDFs are uploaded to every [release][latest], and also to the [pdf
branch][pdf] of this repository.

#### Flow overview

Build a `TeX` document using some or all of the `*.tex` files, and
then pass it through [`pdftex`][pdftex] to build a PDF.

#### Detailed flow

Packages are downloaded into the `tex_modules` directory.

Global configs are located in `tex_modules/headers.sty`, and so the
final document looks like this:

```tex
\documentclass{article}
\usepackage{headers}
\begin{document}
% ...
\end{document}
```

For [`pdftex`][pdftex] to pick up on `tex_modules` as a place to
search for LaTeX packages, we set the `TEXINPUTS` environment
variable to `tex_modules/:`, as documented [here][pdftex-docs].

```sh
TEXINPUTS=tex_modules/: pdftex *.tex
```

#### Commands

##### `build`

Takes a list of `*.tex` files and writes to a `out.tex` file,
ready for compilation with

```sh
TEXINPUTS=tex_modules/: pdftex out.tex
```

This exists because the current CI configuration uses
`xu-cheng/latex-action@v3` out-of-the-box, which means we can't use
the `minimath` rust binary with `pdftex` in one command.

Hence the build flow on CI is to build using this command to produce a
`minimath.tex`, and then use `xu-cheng/latex-action@v3` to build the
pdf.

##### `dev`

A user-facing command that requires `pdftex` to be installed.

<br>

<p align='center'>
  <img src="https://github.com/nguyenvukhang/math/assets/10664455/68170003-30f7-467f-ad2d-aef3c08aa15e"/>
</p>

[gh-act]: https://github.com/nguyenvukhang/math/blob/main/.github/workflows/ci.yml
[latest]: https://github.com/nguyenvukhang/math/releases/latest
[pdf]: https://github.com/nguyenvukhang/math/tree/pdf
[pdftex]: https://www.tug.org/applications/pdftex
[pdftex-docs]: https://texdoc.org/serve/pdftex/0
