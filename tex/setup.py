import sys, os, re

from subprocess import Popen, PIPE

VERBOSE = True
SHOW_PROOFS = False
JOBNAME = "minimath"


def read_file(f, flags="r") -> str:
    with open(f, flags) as f:
        return f.read()


# [SUBCOMMAND] builds using all the tex_files supplied, in that order
def build(tex_files, verbose=False):
    BUILD_DIR = ".build"
    if not os.path.isdir(BUILD_DIR):
        os.mkdir(BUILD_DIR)
    x = Popen(
        ["pdflatex", "--output-directory", BUILD_DIR, f"--jobname={JOBNAME}"],
        stdin=PIPE,
        stdout=None if verbose else PIPE,
        stderr=None if verbose else PIPE,
    )
    tex = lambda e: x.stdin.write(e)

    tex(read_file("header.tex", flags="rb"))

    # config inserts
    if not SHOW_PROOFS:
        tex(b"\\excludecomment{proof}")

    tex(b"\\begin{document}")
    [tex(read_file(f, flags="rb")) for f in tex_files]
    tex(b"\\end{document}")

    x.stdin.flush()
    x.stdin.close()
    x.wait()
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

    s, c = "0123456789abcdef", lambda: s[randint(0, len(s) - 1)]
    print("".join([c() for _ in range(7)]), end="")


def get_labels(data: str):
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
