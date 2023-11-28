from os import curdir
from typing import TypeVar



T = TypeVar("T")


def panic(*s):
    (print(*s), exit())


# get index `i` form list `l`, `d` if out of range
def get(l, i, d=None):  # type: (list[T], int, T | None) -> T
    return l[i] if (i >= 0 and len(l) > i) or (i < 0 and len(l) >= -i) else d


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


def should_pretty_print(x):
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
def read_file(path):  # type: (str) -> list[bytes]
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
