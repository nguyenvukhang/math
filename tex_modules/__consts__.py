from re import compile as re_compile

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


class Regex:
    LABEL = re_compile(b"\\\\label{([a-z0-9]{7})}")
    LABEL_ENDL = re_compile(b"\\\\label{([a-z0-9]{7})}$")
    HREF = re_compile(b"\\\\href{([a-z0-9]{7})}")
    STAR_NUM = re_compile(b"^\*\[\d+\]$")  # }}}
