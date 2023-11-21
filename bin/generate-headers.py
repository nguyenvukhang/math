def generate_section(t):  # type: (str) -> str
    c = lambda v: rf"\ifx&#2&\else{v}\fi"
    buf = f"\def\{t}#1#2" + "{\subsubsection{" + t + r" {#1}\quad{\normalfont"
    buf += c("(") + "#2" + c(")") + "}}}"
    return buf


SECTION_TITLES = (
    "Algorithm",
    "Corollary",
    "Definition",
    "Example",
    "Exercise",
    "Lemma",
    "Problem",
    "Proposition",
    "Remark",
    "Result",
    "Theorem",
)
l = map(generate_section, SECTION_TITLES)
l = map(print, l)
list(l)
