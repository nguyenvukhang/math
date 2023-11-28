from typing import Literal, get_args
from argparse import ArgumentParser

Action = Literal[
    "build",
    "dev",
    "sha",
    "test",
    "label",
    "generate-section-titles",
]


class Args:
    def __init__(self, args):
        self.action = args.action or None  # type: Args.Action
        self.header = args.header or None  # type: str
        self.jobname = args.jobname or None  # type: str
        self.build_dir = args.build_dir or None  # type: str
        self.show_proofs = args.show_proofs or None  # type: bool
        self.show_computes = args.show_computes or None  # type: bool
        self.verbose = args.verbose or None  # type: bool
        self.tex_files = args.tex_files or None  # type: list[str]
        self.toc = args.toc or None  # type: bool

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
        p.add_argument("--toc", action="store_true")
        p.add_argument("--no-proof", dest="show_proofs", action="store_false")
        p.add_argument("--no-compute", dest="show_computes", action="store_false")
        p.add_argument("--verbose", action="store_true")
        p.add_argument("tex_files", nargs="*")
        data = p.parse_args()
        seen = set()
        tex_files = []
        for f in data.tex_files:
            if f not in seen:
                seen.add(f)
                tex_files.append(f)
        data.tex_files = tex_files
        return Args(data)
