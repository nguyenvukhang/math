import sys, os, re

from subprocess import Popen, PIPE

BUILD_DIR = ".build"
VERBOSE = True
SHOW_PROOFS = True
SHOW_COMPUTES = True
JOBNAME = "minimath"


def read_file(f, flags="r") -> str:
    with open(f, flags) as f:
        return f.read()


def debug():
    data = read_file("ordinary-differential-equations.tex", flags="rb")
    remove_in_between(data, b"\\begin{compute}", b"\\end{compute}")


# remove all bytes including and within a start and end marker
def remove_in_between(data: bytes, start: bytes, end: bytes):
    buffer, r = [], data.find(start)
    while r >= 0:
        buffer.extend(data[:r])
        data = data[data.find(end) + len(end) :]
        r = data.find(start)
    buffer.extend(data)
    return bytes(buffer)


def build_one_file(path) -> bytes:
    b = read_file(path, flags="rb")
    if not SHOW_COMPUTES:
        b = remove_in_between(b, b"\\begin{compute}", b"\\end{compute}")
    if not SHOW_PROOFS:
        b = remove_in_between(b, b"\\begin{proof}", b"\\end{proof}")
    return b


class PdfLatex:
    # start a subprocess of `pdflatex` ready to take a latex file in
    # from stdin
    def __init__(self, verbose=False):
        p = None if verbose else PIPE
        args = ("pdflatex", "--output-directory", BUILD_DIR, f"--jobname={JOBNAME}")
        self.x = Popen(args, stdin=PIPE, stdout=p, stderr=p)

    def write(self, e: bytes):
        self.x.stdin.write(e)

    def close(self):
        self.x.stdin.flush()
        self.x.stdin.close()
        self.x.wait()


# [SUBCOMMAND] builds using all the tex_files supplied, in that order
def build(tex_files, verbose=False):
    if not os.path.isdir(BUILD_DIR):
        os.mkdir(BUILD_DIR)

    pdflatex = PdfLatex(verbose=verbose)
    pdflatex.write(read_file("header.tex", flags="rb"))

    pdflatex.write(b"\\begin{document}")
    list(map(pdflatex.write, map(build_one_file, tex_files)))
    pdflatex.write(b"\\end{document}")

    pdflatex.close()

    pdf_basename = f"{JOBNAME}.pdf"
    os.rename(os.path.join(BUILD_DIR, pdf_basename), pdf_basename)


# don't clean to make sure that links are well-formed
def clean():
    RM = [".aux", ".out", ".log"]
    files = list(filter(lambda x: any([x.endswith(r) for r in RM]), os.listdir()))
    [os.remove(x) for x in files]


# [SUBCOMMAND] returns a 7-char SHA hash that Make can send to
# clipboard
def sha():
    from random import randint

    l = "abcdef"[randint(0, 5)]

    s, c = "0123456789abcdef", lambda: s[randint(0, len(s) - 1)]
    print(l + "".join([c() for _ in range(6)]), end="")


# get all instances of `\label{...}` in a file buffer
def get_labels(data: str) -> list[str]:
    res, ids = re.search("\\\label{([0-9a-z]{7})}", data), []
    while res != None:
        ids.append(res.groups()[0])
        data = data[res.span()[1] :]  # seek forward
        res = re.search("\\\label{([0-9a-z]{7})}", data)
    return ids


# Get all files ending with '.tex' in the directory that contains this
# script
def get_tex_files():
    files, cwd = [], os.path.dirname(__file__)
    for root, _, f in os.walk(cwd):
        f = filter(lambda f: f.endswith(".tex"), f)
        f = map(lambda f: os.path.join(root, f), f)
        f = map(lambda f: os.path.relpath(f, cwd), f)
        files.extend(f)
    return files


# Assert that all id definitions of the form `\label{cbae218}` are
# unique in the files supplied
def assert_unique_ids(tex_files):
    ok, ids = True, {}
    for f in tex_files:
        labels = get_labels(read_file(f))
        for label in labels:
            t = ids.get(label, [])
            t.append(f)
            ids[label] = t

    dups = [(k, v) for k, v in ids.items() if len(v) > 1]
    ok &= len(dups) == 0

    if len(dups) > 0:
        print("Duplicate ids found:")
        for k, v in dups:
            print(f"{k}")
            [print("\t*", v) for v in v]

    return ok


# [SUBCOMMAND] checks if everything is in a healthy state
def checkhealth():
    tex_files = get_tex_files()
    ALL_OK = True
    ALL_OK &= assert_unique_ids(tex_files)

    if ALL_OK:
        print("All checks passed!")


c = sys.argv[1]
if c == "build":
    build(sys.argv[2:], verbose=VERBOSE)
elif c == "sha":
    sha()
elif c == "checkhealth":
    checkhealth()
else:
    debug()