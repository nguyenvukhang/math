import re

MARKS = (  # {{{
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
# }}}

SHOW_PROOF = False
SHOW_COMPUTE = True


def inc(a, b, c):  # type: (int, int, int) -> bool
    return a <= b and b <= c


def bytes_find_all(data, query, offset=0):  # type: (bytes, bytes, int) -> list[int]
    v, i = [], data.find(query)
    while i != -1:
        v.append(i + offset)
        i = data.find(query, i + 1)
    return v


# CHECKHEALTH TODO list
# make sure that all the following strings are on lines of their own:
#   * `\begin{proof}`
#   * `\end{proof}`
#   * `\begin{compute}`
#   * `\end{compute}`
# make sure that the following strings are always at the end of the
# line
#   * `\label{*******}`


class Lines:  # {{{
    def __init__(self, buffer):  # type: (bytes) -> None
        self.buffer = buffer
        self.reset()
        self.hide_depth = 0

    def reset(self):
        self.cursor, self.line_number = 0, -1

    def find(self, query):  # type: (bytes) -> int
        return self.buffer.find(query, self.cursor)

    def __iter__(self):
        return self

    def __next__(self):  # type() -> tuple[bytes, int]
        if self.cursor < 0:
            self.reset()
            raise StopIteration
        self.line_number += 1
        a, b = self.cursor, self.find(b"\n")
        self.cursor = -1 if b == -1 else b + 1

        line = self.buffer[a:] if b == -1 else self.buffer[a:b]

        stripped = line.strip()

        if not SHOW_PROOF:
            if stripped == b"\\begin{proof}":
                self.hide_depth += 1
            elif stripped == b"\\end{proof}":
                self.hide_depth -= 1
                if self.hide_depth == 0:
                    return b"", self.line_number

        if not SHOW_COMPUTE:
            if stripped == b"\\begin{compute}":
                self.hide_depth += 1
            elif stripped == b"\\end{compute}":
                self.hide_depth -= 1
                if self.hide_depth == 0:
                    return b"", self.line_number

        line = b"" if self.hide_depth > 0 else line

        return line, self.line_number  # }}}


class Regex:  # {{{
    LABEL = re.compile(b"\\\\label{([a-z0-9]{7})}")
    LABEL_ENDL = re.compile(b"\\\\label{([a-z0-9]{7})}$")
    HREF = re.compile(b"\\\\href{([a-z0-9]{7})}")
    STAR_NUM = re.compile(b"^\*\[\d+\]$")  # }}}


def panic(*s):
    print(*s)
    exit()


class Index:
    def new(self):  # type: () -> tuple[int, int, bytes]
        return (None, None)

    def line_number(x):
        return x[0]

    def mark(x):  # type: (tuple[int, int, bytes]) -> bytes
        return MARKS[x[1]]

    def label(x):  # type: (tuple[int, int, bytes]) -> bytes
        return x[2]


class File:
    def __init__(self, filepath):  # type: (str) -> None
        self.filepath = filepath
        self.lines = Lines(read_file(filepath))
        self.__index__ = None  # type: list[tuple[int, int, bytes]]

    def index(self):  # type: (set[bytes]) -> None
        self.__index__ = []
        for line, k in self.lines:
            print("*", line)
            mark_index = Line.get_mark_index(line)
            label = Line.get_label(line)
            if mark_index is not None or label is not None:
                self.__index__.append((k, mark_index, label))

    def labels(self):  # type: () -> list[bytes]
        if self.__index__ is None:
            panic(f"[{self.filepath}] is not indexed yet.")
        return list(map(Index.label, self.__index__))

    def add_labels_and_write(self, existing):  # type: (set[bytes]) -> None
        lines = self.lines.buffer.splitlines()
        for k, _, label in self.__index__:
            if label is None:
                lines[k] += b"\\label{" + new_sha(existing) + b"}"
        with open(self.filepath, "wb") as f:
            f.write(b"\n".join(lines))


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

    def get_mark_index(line):  # type: (bytes) -> bytes | None
        for i in range(len(MARKS_WITH_BSLS)):
            if line.startswith(MARKS_WITH_BSLS[i]):
                if not Line.is_closed(line):
                    panic("Section title spans multiple lines in line:\n", line)
                return i

    def get_label(line):  # type: (bytes) -> bytes | None
        """
        Assume that labels are at the end of lines.

        TODO: add to checkhealth a function that ensures that all labels
        are at the end of lines.
        """
        hit = Regex.LABEL_ENDL.search(line)
        if hit is None:
            return None
        return hit.groups()[0]


def merge_labels(files):  # type: (list[File]) -> set[bytes]
    seen = set()
    for file in files:
        for label in file.labels():
            if label in seen:
                panic("Found a duplicate label: %s" % label.decode("utf8"))
            seen.add(label)
    return seen


def new_sha(existing):  # type: (set[bytes]) -> bytes
    from random import randint as r

    s, c = "abcdef0123456789", lambda e: s[r(0, e)]
    gen = lambda: c(5) + "".join([c(15) for _ in range(6)])
    x = gen()
    while x in existing:
        x = gen()
    existing.add(x)
    return x.encode("utf-8")


# quick routine to read a file into bytes
def read_file(path):  # type: (str) -> bytes
    with open(path, "rb") as f:
        return f.read()


def get_in_between(
    buf, start, include=False
):  # type: (bytes, int, bool) -> tuple[bytes, int] | None
    stk, s = 0, None
    for i in range(start, len(buf)):
        if buf[i] == 123:  # ord(b'{')
            stk, s = stk + 1, s if s is not None else i
        elif buf[i] == 125:  # ord(b'}')
            if stk == 1:
                hit = buf[s : i + 1] if include else buf[s + 1 : i]
                return (hit, i + 1)
            stk -= 1
    return None


FILES = (
    # "algorithm-design.tex",
    # "calculus.tex",
    # "complex-analysis.tex",
    # "nonlinear-optimization-constrained.tex",
    # "nonlinear-optimization-unconstrained.tex",
    # "ordinary-differential-equations.tex",
    # "plenary.tex",
    "build.tex",
)
pipe = FILES
pipe = map(read_file, pipe)
pipe = map(Lines, pipe)

indexed_files = []  # type: list[File]

for path in FILES:
    file = File(path)
    file.index()
    # indexed_files.append(file)

# all_labels = merge_labels(indexed_files)
# for file in indexed_files:
#     file.add_labels_and_write(all_labels)
