from .consts import *


def generate_section(t):  # type: (str) -> str
    c = lambda v: rf"\ifx&#2&\else{v}\fi"
    space = r"\hspace{0.7em}"
    buf = f"\def\{t}#1#2" + "{\subsubsection{" + t + r" {#1}"
    buf += space + r"{"
    buf += c("(") + "#2" + c(")") + "}}}"
    return buf


l = map(generate_section, SECTION_TITLES)
l = map(print, l)
list(l)
