from os import curdir, path
import os
from re import compile as re_compile
from __args__ import Args
from subprocess import Popen, PIPE

MARKS = (
    b"Algorithm",
    b"Corollary",
    b"Definition",
    b"Example",
    b"Exercise",
    b"Lemma",
    b"Problem",
    b"Proposition",
    b"Remark",
    b"Result",
    b"Theorem",
)
MARKS_WITH_BSLS = tuple(b"\\" + x for x in MARKS)


class Rx:
    LABEL = re_compile(b"\\\\label{([a-z0-9]{7})}")


def panic(*s):
    (print(*s), exit())


def new_sha(existing):  # type: (set[bytes]) -> bytes
    from random import randint as r

    s, c = "abcdef0123456789", lambda e: s[r(0, e)]
    gen = lambda: c(5) + "".join([c(15) for _ in range(6)])
    x = gen()
    while x in existing:
        x = gen()
    existing.add(x)
    return x.encode("utf-8")


def get_in_between(
    buf, start, include=False
):  # type: (bytes, int, bool) -> tuple[bytes|None, int]
    if buf is None:
        return None, -1
    stk, s = 0, None
    for i in range(start, len(buf)):
        if buf[i] == 123:  # ord(b'{')
            stk, s = stk + 1, s if s is not None else i
        elif buf[i] == 125:  # ord(b'}')
            if stk == 1:
                hit = buf[s : i + 1] if include else buf[s + 1 : i]
                return (hit, i + 1)
            stk -= 1
    return None, -1


# Get all files ending with '.tex' in the user's current directory
def get_tex_files(recursive=True):  # type: (bool) -> list[str]
    is_tex = lambda f: f.endswith(".tex")
    if recursive:
        files, cwd = [], os.curdir
        for root, _, f in os.walk(cwd):
            f = filter(is_tex, f)
            f = map(lambda f: path.join(root, f), f)
            f = map(lambda f: path.relpath(f, cwd), f)
            files.extend(f)
        return files
    else:
        return [x for x in os.listdir() if is_tex(x)]


def get_all_labels(tex_files):  # type: (list[str]) -> set[bytes]
    all_labels = set()
    for f in tex_files:
        labels = Rx.LABEL.findall(read_file(f))
        for label in labels:
            if label in all_labels:
                panic(f"Duplicate label: {label}")
            all_labels.add(label)
    return all_labels


def run_observer(handler):
    from watchdog.observers import Observer
    from time import sleep

    observer = Observer()
    observer.schedule(handler, curdir, recursive=False)
    observer.start()
    try:
        while True:
            sleep(1)
    finally:
        (observer.stop(), observer.join())


# all substrings are included in any line in the buffer
def __starts_with__(buf, x):
    return any(map(lambda l: l.startswith(x), buf))


# buffer has any line that starts with substring
def __includes__(buf, x):
    return any(map(lambda l: all(map(lambda x: x in l, x)), buf))


# check if `buf` contains only chars from `chars`
def has_only(buf, chars):  # type: (bytes, bytes) -> bool
    return all(map(lambda b: b in chars, buf))


def should_pretty_print(x):  # type: (bytes) -> bool
    fl = x[0] if len(x) > 0 else None
    if fl is None:
        return False
    if len(x) < 2 and (b"*\n" == fl or has_only(fl, b"0123456789[] *\n")):
        return False

    sw, inc = __starts_with__, __includes__

    return not (
        sw(x, b"This is pdfTeX")
        or sw(x, b"*geometry*")
        or sw(x, b"**entering extended mode")
        or sw(x, b"Package hyperref Warning")
        or sw(x, b"Underfull \hbox (badness 10000)")
        or inc(x, (b"texlive", b"texmf", b"latex"))  # system package
        or inc(x, (b"texlive", b"texmf", b"pdftex"))  # system package
        or inc(x, (b"(Please type a command or say `\end')\n"))
        or sw(x, b"LaTeX Warning: You have requested package")
        or sw(x, b"LaTeX Font Warning: Command \\footnotesize invalid in math mode")
    )


# quick routine to read a file into bytes
def read_file(path):  # type: (str) -> bytes
    with open(path, "rb") as f:
        return f.read()


# lines should not end with newline characters
def write_file(path, lines):  # type: (str, list[bytes]) -> None
    with open(path, "wb") as f:
        f.write(b"\n".join(lines))


# remove all bytes including and within a start and end marker
#
# useful for removing content between `\begin{proof}` and `\end{proof}`
# TODO: add a checkhealth where we can't nest \begin{proof} nor \begin{compute}
def remove_in_between(data: bytes, start: bytes, end: bytes):
    buffer, n = [], len(end)
    r, p = data.find(start), 0
    while r >= 0:
        buffer.extend(data[p:r])
        p, r = data.find(end, r) + n, data.find(start, p)
    buffer.extend(data[p:])
    return bytes(buffer)


class Line:
    # Checks if the line closes all '{' opened in that line
    def is_closed(line):  # type: (bytes) -> bool
        stk = 0
        for b in line:
            stk += 1 if b == 123 else -1 if b == 125 else 0
        return stk == 0

    def get_mark(line):  # type: (bytes) -> bytes | None
        for st in MARKS_WITH_BSLS:
            if line.startswith(st):
                if not Line.is_closed(line):
                    panic("Section title spans multiple lines in line:\n", line)
                return st

    # Parses a line into <MARK>, <NUM>, <NAME>, <SHA>
    def parse(line):
        mark = Line.get_mark(line)
        if mark is None:
            return None, None, None, None
        num, i = get_in_between(line, len(mark))
        name, i = get_in_between(line, i)
        label, _ = get_in_between(line, i)
        return mark[1:], num, name, label

    def remove_hrefs(line):  # type: (bytes) -> bytes
        buf = b""
        j = 0
        i = line.find(b"\\href{")
        while i >= 0:
            buf += line[j:i]
            # get past the reference SHA
            _, i = get_in_between(line, i)
            text, j = get_in_between(line, i)
            buf += text
            i = line.find(b"\\href{", j)
        buf += line[j:]
        return buf


# for build/dev
class TexFile:
    def __init__(self, path):  # type: (str) -> None
        self.path = path
        self.bytes = read_file(path)

    def reload(self):
        self.bytes = read_file(self.path)


# for build/dev
class Project:
    def __init__(self, tex_filepaths):  # type: (list[str]) -> None
        self.tex_files = list(map(TexFile, tex_filepaths))

    def build(self, args):  # type: (Args) -> None
        latex = PdfLatex(
            jobname=args.jobname,
            build_dir=args.build_dir,
            dev_mode=args.action == "dev",
        )
        w = latex.stdin.write

        w(b"\\documentclass{article}")
        w(b"\\usepackage{" + args.header.encode("utf8") + b"}")
        w(b"\\begin{document}")

        for f in self.tex_files:
            w(f.bytes)
            w(b"\n\\newpage\n")

        w(b"\\end{document}")

        latex.stdin.flush()
        latex.stdin.close()
        if args.verbose:
            latex.direct_stdout()
        else:
            latex.filtered_stdout()
        latex.wait()


class PdfLatex(Popen):
    # start a subprocess of `pdflatex` ready to take a latex file in
    # from stdin
    def __init__(self, jobname="minimath", build_dir=".build", dev_mode=False):
        # tells latex compiler to search for .sty packages in this folder.
        os.environ["TEXINPUTS"] = path.join(os.curdir, "tex_modules") + ":"

        self.jobname = jobname
        self.build_dir = build_dir
        self.dev_mode = dev_mode

        j, d = jobname, build_dir

        if not path.isdir(build_dir):
            os.mkdir(build_dir)

        cmd = ("pdflatex", "-halt-on-error", f"-output-directory={d}", f"-jobname={j}")
        super().__init__(cmd, stdin=PIPE, stdout=PIPE, stderr=PIPE, env=os.environ)

    def wait(self) -> int:
        super().wait()
        pdf_basename = f"{self.jobname}.pdf"
        pdf_output = path.join(self.build_dir, pdf_basename)
        if path.isfile(pdf_output):
            os.rename(pdf_output, pdf_basename)

    def buf_to_stdout(self, buf):  # type: (list[bytes]) -> None
        for l in filter(lambda v: len(v.strip()) > 0, buf):
            print(l.decode("utf8"), end="")

    def direct_stdout(self):
        self.buf_to_stdout(iter(self.stdout.readline, b""))

    def err_buf(self, buf):  # type: (list[bytes]) -> None
        s = b"".join(buf).strip().decode("utf8")
        raise Exception("PYTEX ERROR\n" + s)

    # helps to monitor stdout in a less cluttered way
    def filtered_stdout(self):
        buf, is_err = [], False
        lines = iter(self.stdout.readline, b"")
        for l in lines:
            excl, ast = l.startswith(b"!"), l.startswith(b"*")
            if excl or ast:
                if is_err and not self.dev_mode:
                    self.err_buf(buf)
                if should_pretty_print(buf):
                    self.buf_to_stdout(buf)
                buf.clear()
            is_err |= excl
            buf.append(l)

        if is_err and not self.dev_mode:
            self.err_buf(buf)


# for labelling/indexing
class File:
    def __init__(self, path):  # type: (str) -> None
        self.path = path
        self.lines = read_file(path).splitlines()
        self.__index__ = None

    def index(self):  # type: (bool) -> None
        self.__index__ = []
        for k, line in enumerate(self.lines):
            mark, num, name, label = Line.parse(line)
            if mark is not None:
                self.__index__.append([k, mark, num, name, label])

    def serialize(self):
        data = []
        for row in self.__index__:
            row[3] = Line.remove_hrefs(row[3])
            row = [r.decode("utf8") if type(r) == bytes else r for r in row]
            data.append(tuple(row))
        return data

    def labels(self):  # type: () -> list[bytes]
        if self.__index__ is None:
            panic(f"[{self.path}] is not indexed yet.")
        return list(map(lambda v: v[4], self.__index__))

    def add_labels_and_write(self, existing):  # type: (set[bytes]) -> None
        for i in self.__index__:
            lnum, label = i[0], i[4]
            if label is None:
                self.lines[lnum] += b"\\label{" + new_sha(existing) + b"}"
        with open(self.path, "wb") as f:
            f.write(b"\n".join(self.lines))

    @staticmethod
    def merge_labels(files):  # type: (list[File]) -> set[bytes]
        seen = set()
        for file in files:
            for label in filter(lambda v: v is not None, file.labels()):
                if label in seen:
                    panic("Found a duplicate label: %s" % label.decode("utf8"))
                seen.add(label)
        return seen


def assert_eq(received, expected):
    if received == expected:
        return
    print(f"\nreceived: {received}\nexpected: {expected}\n")
    panic("Assertion Error.")
