from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("action", choices=["headers", "syntax"])


def generate_section(t):  # type: (str) -> str
    c = lambda v: rf"\ifx&#2&\else{v}\fi"
    space = r"\hspace{0.7em}"
    buf = f"\def\{t}#1#2" + "{\subsubsection{" + t + r" {#1}"
    buf += space + r"{"
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


def __headers__():
    for l in map(generate_section, SECTION_TITLES):
        print(l)


# put this output in ~/.config/nvim/after/syntax/tex.vim
def __syntax__():
    for v in SECTION_TITLES:
        print(f'syn match tex{v} "\\\\{v}"')
    for v in SECTION_TITLES:
        print(f"hi tex{v} guifg=#d3869b")


def main():
    args = parser.parse_args()
    if args.action == "headers":
        __headers__()
    elif args.action == "syntax":
        __syntax__()


if __name__ == "__main__":
    main()
