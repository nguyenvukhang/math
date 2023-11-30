from __consts__ import *
from __utils__ import *


class File:
    def __init__(self, filepath):  # type: (str) -> None
        self.filepath = filepath
        self.lines = Lines(read_file(filepath))
        self.__index__ = None

    def index(self):  # type: (bool) -> None
        self.__index__ = []
        for k, line in self.lines:
            mark_index = Line.get_mark_index(line)
            label = Line.get_label(line)
            if mark_index is not None or label is not None:
                self.__index__.append((k, mark_index, label))

    def labels(self):  # type: () -> list[bytes]
        if self.__index__ is None:
            panic(f"[{self.filepath}] is not indexed yet.")
        return list(map(lambda v: v[2], self.__index__))

    def add_labels_and_write(self, existing):  # type: (set[bytes]) -> None
        lines = self.lines.buffer.splitlines()
        for i in self.__index__:
            lnum, label = i[0], i[2]
            if label is None:
                lines[lnum] += b"\\label{" + new_sha(existing) + b"}"
        with open(self.filepath, "wb") as f:
            f.write(b"\n".join(lines))

    @staticmethod
    def merge_labels(files):  # type: (list[File]) -> set[bytes]
        seen = set()
        for file in files:
            for label in file.labels():
                if label is None:
                    continue
                if label in seen:
                    panic("Found a duplicate label: %s" % label.decode("utf8"))
                seen.add(label)
        return seen


class Lines:
    def __init__(self, buffer):  # type: (bytes) -> None
        self.buffer = buffer
        self.reset()

    def reset(self):
        self.cursor, self.line_number = 0, -1

    def find(self, query):  # type: (bytes) -> int
        return self.buffer.find(query, self.cursor)

    def __iter__(self):
        return self

    def __next__(self):  # type() -> tuple[int, bytes]
        if self.cursor < 0:
            self.reset()
            raise StopIteration
        self.line_number += 1
        a, b = self.cursor, self.find(b"\n")
        self.cursor = -1 if b == -1 else b + 1
        line = self.buffer[a:] if b == -1 else self.buffer[a:b]
        return self.line_number, line
