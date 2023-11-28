from __consts__ import *
from __utils__ import *


class File:
    def __init__(self, filepath):  # type: (str) -> None
        self.filepath = filepath
        self.lines = Lines(read_file(filepath))
        self.__index__ = None  # type: list[tuple[int, int, bytes]]

    def index(self, vimgrep=False):  # type: (bool) -> None
        self.__index__ = []
        for line, k in self.lines:
            mark_index = Line.get_mark_index(line)
            label = Line.get_label(line)
            if mark_index is not None or label is not None:
                vg = None
                if vimgrep and mark_index is not None:
                    vg = Line.get_vimgrep(line)
                self.__index__.append((k, mark_index, label, vg))

    def labels(self):  # type: () -> list[bytes]
        if self.__index__ is None:
            panic(f"[{self.filepath}] is not indexed yet.")
        return list(map(Index.label, self.__index__))

    def vimgrep(self, filepath):  # type: (str) -> None
        for idx in self.__index__:
            t = Index.title(idx)
            t = filepath if t is None else t.decode("utf8")
            print(filepath, ":", Index.line_number(idx), ":", 0, ":", t, sep="")

    def add_labels_and_write(self, existing):  # type: (set[bytes]) -> None
        lines = self.lines.buffer.splitlines()
        for k, _, label in self.__index__:
            if label is None:
                lines[k] += b"\\label{" + new_sha(existing) + b"}"
        with open(self.filepath, "wb") as f:
            f.write(b"\n".join(lines))


class Lines:
    def __init__(self, buffer, show_proof=False, show_compute=False):
        self.buffer = buffer
        self.reset()
        self.hidden = False
        self.show_proof = show_proof
        self.show_compute = show_compute

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

        if not self.show_proof:
            if stripped == b"\\begin{proof}":
                self.hidden = True
            elif stripped == b"\\end{proof}":
                self.hidden = False
                return b"", self.line_number

        if not self.show_compute:
            if stripped == b"\\begin{compute}":
                self.hidden = True
            elif stripped == b"\\end{compute}":
                self.hidden = False
                return b"", self.line_number

        line = b"" if self.hidden else line

        return line, self.line_number


class Index:
    def __init__(self, lnum, mark_idx, label, title) -> None:
        self.lnum = lnum
        self.__mark_idx__ = mark_idx
        self.label = label
        self.title = title

    def mark(self):  # type: () -> bytes
        return MARKS[self.__mark_idx__]
