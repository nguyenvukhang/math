from typing import Literal, get_args
from argparse import ArgumentParser

Action = Literal[
    "build",
    "dev",
    "sha",
    "test",
    "label",
    "generate-section-titles",
    "toc",
]


class Args:
    action = None  # type: Args.Action
    header = None  # type: str
    jobname = None  # type: str
    build_dir = None  # type: str
    show_proofs = None  # type: bool
    show_computes = None  # type: bool
    verbose = None  # type: bool
    tex_files = None  # type: list[str]
    toc = None  # type: bool
    ci = None  # type: bool

    @staticmethod
    def parse():  # type: () -> Args
        p = ArgumentParser(
            prog="pytex",
            description="Custom pdflatex build script with Python3",
        )
        p.add_argument("action", choices=get_args(Action))
        p.add_argument("-H", dest="header", default="headers")
        p.add_argument("-J", "--jobname", default="out")
        p.add_argument("--build-dir", default=".build")
        p.add_argument("-v", "--verbose", action="store_true")
        p.add_argument("tex_files", nargs="*")
        args = p.parse_args()
        seen = set()
        tex_files = []
        for f in args.tex_files:
            if f not in seen:
                seen.add(f)
                tex_files.append(f)
        args.tex_files = tex_files
        return args
