from os import curdir, path
import os
from typing import TypeVar
from __consts__ import *


T = TypeVar("T")


def panic(*s):
    (print(*s), exit())


# get index `i` form list `l`, `d` if out of range
def get(l, i, d=None):  # type: (list[T], int, T | None) -> T
    return l[i] if (i >= 0 and len(l) > i) or (i < 0 and len(l) >= -i) else d


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


def has_only(buf, chars):  # type: (bytes, bytes) -> bool
    return all(map(lambda b: b in chars, buf))


def should_pretty_print(x):
    if len(x) == 0:
        return False
    fl = x[0]
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
    )


# quick routine to read a file into bytes
def read_file(path):  # type: (str) -> bytes
    with open(path, "rb") as f:
        return f.read()


# lines should not end with newline characters
def write_file(path, lines):  # type: (str, list[bytes]) -> None
    with open(path, "wb") as f:
        f.write(b"\n".join(lines))


# Checks if all '{}' pairs are closed in the line
def is_closed(line):  # type: (bytes) -> bool
    stk = 0
    for b in line:
        stk += 1 if b == 123 else -1 if b == 125 else 0
    return stk == 0


# remove all bytes including and within a start and end marker
#
# useful for removing content between `\begin{proof}` and `\end{proof}`
# TODO: add a checkhealth where we can't nest \begin{proof} nor \begin{compute}
def remove_in_between(data: bytes, start: bytes, end: bytes):
    buffer, n = [], len(end)
    r, p = data.find(start), 0
    while r >= 0:
        buffer.extend(data[p:r])
        p = data.find(end, r) + n
        r = data.find(start, p)
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

    def get_mark_index(line):  # type: (bytes) -> bytes | None
        for i in range(len(MARKS_WITH_BSLS)):
            if line.startswith(MARKS_WITH_BSLS[i]):
                if not Line.is_closed(line):
                    panic("Section title spans multiple lines in line:\n", line)
                return i

    # Assume that labels are at the end of lines.
    #
    # TODO: add to checkhealth a function that ensures that all labels
    # are at the end of lines.
    def get_label(line):  # type: (bytes) -> bytes | None
        hit = Regex.LABEL_ENDL.search(line)
        if hit is None:
            return None
        return hit.groups()[0]

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
