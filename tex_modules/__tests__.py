#!/usr/bin/env python3

from __classes__ import *


def test_hide_proofs():
    buf = r"""
before
\begin{proof}
    This is left as an exercise for the reader
\end{proof}
after"""
    buf = buf.encode("utf8")
    result = [x for x in Lines(buf)]
    return result == [
        (b"", 0),
        (b"before", 1),
        (b"", 2),
        (b"", 3),
        (b"", 4),
        (b"after", 5),
    ]


if __name__ == "__main__":
    test_function_names = [x for x in dir() if x.startswith("test_")]
    g = globals()
    for test_function_name in test_function_names:
        print("[TEST]", test_function_name)
        if not g[test_function_name]():
            print("[FAILED]", test_function_name)
            break
    print("All tests passed!")
