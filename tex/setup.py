import sys, os, re
from os import path

from subprocess import Popen, PIPE

BUILD_DIR = ".build"
SHOW_PROOFS = True
SHOW_COMPUTES = True
JOBNAME = "minimath"

ALL_TEX_FILES = """

algorithm-design.tex
calculus.tex
complex-analysis.tex
nonlinear-optimization.tex
ordinary-differential-equations.tex
plenary.tex

"""

ALL_TEX_FILES = ALL_TEX_FILES.strip().split("\n")

# get index `i` form list `l`, None if not found
get = lambda l, i: l[i] if (i >= 0 and len(l) > i) or (i < 0 and len(l) >= -i) else None


def read_file(f, mode="r") -> str:
    with open(f, mode) as f:
        return f.read()


def debug():
    pass


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
    b = read_file(path, mode="rb")
    if not SHOW_COMPUTES:
        b = remove_in_between(b, b"\\begin{compute}", b"\\end{compute}")
    if not SHOW_PROOFS:
        b = remove_in_between(b, b"\\begin{proof}", b"\\end{proof}")
    return b


class PdfLatex:
    # start a subprocess of `pdflatex` ready to take a latex file in
    # from stdin
    def __init__(self, build_dir=BUILD_DIR):
        args = ("pdflatex", "--output-directory", build_dir, f"--jobname={JOBNAME}")
        self.x = Popen(args, stdin=PIPE, stdout=PIPE, stderr=PIPE)
        self.files = []

    def write(self, e: bytes):
        self.x.stdin.write(e)

    def add_file(self, filepath: str):
        self.files.append(filepath)

    def add_files(self, filepaths: list[str]):
        self.files.extend(filepaths)

    def __compile__(self, filepath: str) -> bytes:
        b = read_file(filepath, mode="rb")
        if not SHOW_COMPUTES:
            b = remove_in_between(b, b"\\begin{compute}", b"\\end{compute}")
        if not SHOW_PROOFS:
            b = remove_in_between(b, b"\\begin{proof}", b"\\end{proof}")
        return b

    def process_files(self):
        pipe = map(self.__compile__, self.files)
        pipe = map(self.write, pipe)
        list(pipe)

    def close(self):
        self.write(read_file("header.tex", mode="rb"))
        self.write(b"\\begin{document}")
        self.process_files()
        self.write(b"\\end{document}")
        self.x.stdin.flush()
        self.x.stdin.close()
        self.monitor()
        self.x.wait()

    def monitor(self):
        hyperref_flag = False

        for line in iter(self.x.stdout.readline, b""):
            line = line.removesuffix(b"\n")
            if line == b"*" or b"(Please type a command or say `\end')" in line:
                continue
            if line.startswith(b"Package hyperref Warning"):
                hyperref_flag = True
                continue
            if hyperref_flag and line.startswith(b"(hyperref)"):
                continue
            elif hyperref_flag:
                hyperref_flag = False
            if line:
                print(line.decode("utf8"))


# [SUBCOMMAND] builds using all the tex_files supplied, in that order
def build(tex_files, build_dir=BUILD_DIR):
    if not path.isdir(build_dir):
        os.mkdir(build_dir)

    pdflatex = PdfLatex(build_dir=build_dir)
    pdflatex.add_files(tex_files)
    pdflatex.close()

    pdf_basename = f"{JOBNAME}.pdf"
    os.rename(path.join(BUILD_DIR, pdf_basename), pdf_basename)


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
def get_labels(data: str, pattern: re.Pattern[str]) -> list[str]:
    res, ids = pattern.search(data), []
    while res != None:
        ids.append(res.groups()[0])
        data = data[res.span()[1] :]  # seek forward
        res = pattern.search(data)
    return ids


# Get all files ending with '.tex' in the directory that contains this
# script
def get_tex_files():
    files, cwd = [], path.dirname(__file__)
    for root, _, f in os.walk(cwd):
        f = filter(lambda f: f.endswith(".tex"), f)
        f = map(lambda f: path.join(root, f), f)
        f = map(lambda f: path.relpath(f, cwd), f)
        files.extend(f)
    return files


# Assert that all id definitions of the form `\label{cbae218}` are
# unique in the files supplied
def assert_unique_ids(tex_files):
    pattern = re.compile("\\\label{([0-9a-z]{7})}")
    ok, ids = True, {}
    for f in tex_files:
        labels = get_labels(read_file(f), pattern)
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


c = get(sys.argv, 1)
if c == "build":
    files = ALL_TEX_FILES if get(sys.argv, 2) == "--all" else sys.argv[2:]
    build(files)
elif c == "sha":
    sha()
elif c == "checkhealth":
    checkhealth()
else:
    debug()
