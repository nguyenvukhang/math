from argparse import ArgumentParser
import os, re, time, datetime
from os import path
from subprocess import Popen, PIPE
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

JOBNAME = "minimath"


def get_parser():
    p = ArgumentParser(
        prog="pytex",
        description="Custom pdflatex build script with Python3",
    )
    p.add_argument("action", choices=["build", "dev", "sha", "test"])
    p.add_argument("-H", dest="header_files", action="append", default=[])
    p.add_argument("--no-proof", dest="show_proofs", action="store_false")
    p.add_argument("--no-compute", dest="show_computes", action="store_false")
    p.add_argument("--build-dir", default=".build")
    p.add_argument("tex_files", nargs="*")
    return p


# get index `i` form list `l`, None if not found
get = lambda l, i: l[i] if (i >= 0 and len(l) > i) or (i < 0 and len(l) >= -i) else None


def read_file(f, mode="r") -> str:
    with open(f, mode) as f:
        return f.read()


def debug():
    pass


# remove all bytes including and within a start and end marker
def remove_in_between(data: bytes, start: bytes, end: bytes):
    buffer, r, n = [], data.find(start), len(end)
    while r >= 0:
        buffer.extend(data[:r])
        data = data[data.find(end) + n :]
        r = data.find(start)
    buffer.extend(data)
    return bytes(buffer)


class PdfLatex:
    # start a subprocess of `pdflatex` ready to take a latex file in
    # from stdin
    def __init__(self, args):
        cmd = (
            "pdflatex",
            f"--output-directory={args.build_dir}",
            f"--jobname={JOBNAME}",
        )
        self.x = Popen(cmd, stdin=PIPE, stdout=PIPE, stderr=PIPE)
        self.tex_files, self.header_files = [], []
        self.show_computes = args.show_computes
        self.show_proofs = args.show_proofs

    def write(self, e: bytes):
        self.x.stdin.write(e)

    def add_headers(self, filepaths: list[str]):
        self.header_files.extend(filepaths)

    def add_files(self, filepaths: list[str]):
        self.tex_files.extend(filepaths)

    def __compile__(self, filepath: str) -> bytes:
        b = read_file(filepath, mode="rb")
        if not self.show_computes:
            b = remove_in_between(b, b"\\begin{compute}", b"\\end{compute}")
        if not self.show_proofs:
            b = remove_in_between(b, b"\\begin{proof}", b"\\end{proof}")
        return b

    def process_files(self):
        pipe = map(self.__compile__, self.tex_files)
        pipe = map(self.write, pipe)
        list(pipe)

    def close(self):
        [self.write(read_file(fp, "rb")) for fp in self.header_files]
        self.write(b"\\begin{document}")
        self.process_files()
        self.write(b"\\end{document}")
        self.x.stdin.flush()
        self.x.stdin.close()
        self.monitor_stdout()
        self.x.wait()

    # helps to monitor stdout in a less cluttered way
    def monitor_stdout(self):
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
def build(args):
    if not path.isdir(args.build_dir):
        os.mkdir(args.build_dir)

    pdflatex = PdfLatex(args)
    pdflatex.add_headers(args.header_files)
    pdflatex.add_files(args.tex_files)
    pdflatex.close()

    pdf_basename = f"{JOBNAME}.pdf"
    pdf_output = path.join(args.build_dir, pdf_basename)
    if path.isfile(pdf_output):
        os.rename(pdf_output, pdf_basename)


# don't clean to make sure that links are well-formed
def clean():
    RM = [".aux", ".out", ".log"]
    files = list(filter(lambda x: any([x.endswith(r) for r in RM]), os.listdir()))
    [os.remove(x) for x in files]


# [SUBCOMMAND] prints a 7-char SHA hash that the user can copy to
# clipboard. This SHA is unique in all ".tex" files that are in the
# current directory and all the current subdirectories.
#
# opinionated quirk: all generated SHAs will start with a letter.
def sha():
    from random import randint as r

    s, c = "abcdef0123456789", lambda e: s[r(0, e)]
    gen = lambda: c(5) + "".join([c(15) for _ in range(6)])
    _, ids = get_unique_ids(get_tex_files())
    ids = set(ids)

    x = gen()
    while x in ids:
        x = gen()

    print(x, end="")


# get all instances of `\label{...}` in a file buffer
def get_labels(data: str, pattern: re.Pattern[str]) -> list[str]:
    res, ids = pattern.search(data), []
    while res != None:
        ids.append(res.groups()[0])
        data = data[res.span()[1] :]  # seek forward
        res = pattern.search(data)
    return ids


# Get all files ending with '.tex' in the user's current directory
def get_tex_files():
    files, cwd = [], os.curdir
    for root, _, f in os.walk(cwd):
        f = filter(lambda f: f.endswith(".tex"), f)
        f = map(lambda f: path.join(root, f), f)
        f = map(lambda f: path.relpath(f, cwd), f)
        files.extend(f)
    return files


def get_unique_ids(tex_files):
    pattern = re.compile("\\\label{([0-9a-z]{7})}")
    ids = {}
    for f in tex_files:
        labels = get_labels(read_file(f), pattern)
        for label in labels:
            t = ids.get(label, [])
            t.append(f)
            ids[label] = t

    dups = [(k, v) for k, v in ids.items() if len(v) > 1]
    ids = list(ids.keys())

    return (dups, ids)


# Assert that all id definitions of the form `\label{cbae218}` are
# unique in the files supplied
def assert_unique_ids(tex_files):
    dups, _ = get_unique_ids(tex_files)

    if len(dups) > 0:
        print("Duplicate ids found:")
        for k, v in dups:
            print(f"{k}")
            [print("\t*", v) for v in v]

    return len(dups) == 0


# [SUBCOMMAND] checks if everything is in a healthy state
# 1. checks that no two labels have the same SHA
def test():
    ALL_OK = True
    ALL_OK &= assert_unique_ids(get_tex_files())

    if ALL_OK:
        print("All checks passed!")


# [SUBCOMMAND] runs a server that rebuilds the pdf if any file
# changed.
def dev(args):
    now = lambda: datetime.datetime.now().strftime("%H:%M:%S")
    build2 = lambda: build(args)
    [build2(), print("\n[Last build: %s]" % now())]

    class EventHandler(FileSystemEventHandler):
        def __init__(self, args):
            self.args = args

        def on_any_event(self, event):
            if event.event_type == "modified":
                file = event.src_path
                if file.endswith(".tex"):
                    [build2(), print("\n[Last build: %s]" % now())]

    observer = Observer()
    observer.schedule(EventHandler(args), os.curdir, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    finally:
        observer.stop()
        observer.join()


def main():
    args = get_parser().parse_args()
    if args.action == "build":
        build(args)
    elif args.action == "dev":
        dev(args)
    elif args.action == "sha":
        sha()
    elif args.action == "test":
        test()


if __name__ == "__main__":
    main()
