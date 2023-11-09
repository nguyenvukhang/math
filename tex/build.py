import sys, os
from subprocess import Popen, PIPE

VERBOSE = True
SHOW_PROOFS = False
JOBNAME = "minimath"
tex_files = sys.argv[1:]


def read_file(f) -> bytes:
    with open(f, "rb") as f:
        return f.read()


def build(tex_files, verbose=False):
    x = Popen(
        ["pdflatex", f"--jobname={JOBNAME}"],
        stdin=PIPE,
        stdout=None if verbose else PIPE,
        stderr=None if verbose else PIPE,
    )
    tex = lambda e: x.stdin.write(e)

    tex(read_file("header.tex"))
    if not SHOW_PROOFS:
        tex(b"\\excludecomment{proof}")
    tex(b"\\begin{document}")
    [tex(read_file(f)) for f in tex_files]
    tex(b"\\end{document}")

    x.stdin.flush()
    x.stdin.close()
    x.wait()
    pass


def clean():
    RM = [".aux", ".out", ".log"]
    files = list(filter(lambda x: any([x.endswith(r) for r in RM]), os.listdir()))
    [os.remove(x) for x in files]


build(tex_files, verbose=VERBOSE)
clean()
