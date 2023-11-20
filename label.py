import os, re
from typing import Any


def read_file(fp):  # type: (str) -> tuple[str, list[bytes]]
    with open(fp, "rb") as f:
        data = f.read().splitlines()
        return (fp, data)


tex_files = filter(lambda v: v.endswith(".tex"), os.listdir())
tex_files = list(map(read_file, tex_files))


shas = set()

markers = None  # type: list[bytes]
LABEL_REGEX = re.compile(b"{([a-z0-9]{7})}$")


def get_markers():  # type: () -> list[bytes]
    global markers
    if markers is not None:
        return markers
    MATCHER = re.compile(b"^\\\\def(\\\\[A-Z][a-z]+)#1#2{\\\\subsubsection{.*#1.*#2}")
    with open("header.tex", "rb") as f:
        l = f.read().splitlines()
    l = map(lambda l: MATCHER.search(l), l)
    l = filter(bool, l)
    l = map(lambda l: l.groups()[0], l)
    markers = list(l)
    return markers


def is_marker(line):  # type: (bytes) -> bool
    return any(map(line.startswith, get_markers()))


def for_each(files, fn):  # type: (list[tuple[str, list[bytes]]], Any) -> None
    for fp, data in files:
        for i in range(len(data)):
            fn(fp, data, i)


def get_labels(_, data, i):  # type: (str, list[bytes], int) -> None
    line = data[i]
    if not is_marker(line):
        return
    hit = LABEL_REGEX.search(line)
    if hit is None:
        return
    label = hit.groups()[0]
    if label in shas:
        raise Exception(f"Found a duplicate label: {label}")
    shas.add(label)


def add_labels(_, data, i):  # type: (str, list[bytes], int) -> None
    line = data[i]
    if not is_marker(line) or LABEL_REGEX.search(line) is not None:
        return
    data[i] += b"\\label{" + new_sha() + b"}"


def write(fp, data, _):  # type: (str, list[bytes], int) -> None
    with open(fp, "wb") as f:
        f.write(b'\n'.join(data))


def new_sha():  # type: () -> bytes
    global shas
    from random import randint as r

    s, c = "abcdef0123456789", lambda e: s[r(0, e)]
    gen = lambda: c(5) + "".join([c(15) for _ in range(6)])
    x = gen()
    while x in shas:
        x = gen()
    shas.add(x)
    return x.encode("utf-8")


for_each(tex_files, get_labels)
for_each(tex_files, add_labels)
for_each(tex_files, write)


# for fp in tex_files:
#     add_labels(fp, markers)
