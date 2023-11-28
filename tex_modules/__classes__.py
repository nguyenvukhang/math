from __consts__ import *


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
