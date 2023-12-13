from typing import Literal, get_args
from argparse import ArgumentParser
from dataclasses import dataclass

Action = Literal[
    "build",
    "dev",
    "sha",
    "checkhealth",
    "label",
    "generate-section-titles",
    "toc",
    "toc-md",
]
ACTIONS = get_args(Action)


@dataclass
class Args:
    action: Action
    header: str
    jobname: str
    build_dir: str
    prev_rel: str
    verbose: bool
    all: bool
    tex_files: list[str]

    @staticmethod
    def parse():  # type: () -> Args
        p = ArgumentParser(
            prog="pytex",
            description="Custom pdflatex build script with Python3",
        )
        p.add_argument("action", choices=ACTIONS)
        p.add_argument("-H", dest="header", default="headers")
        p.add_argument("-J", "--jobname", default="out")
        p.add_argument("--build-dir", default=".git")
        p.add_argument("-v", "--verbose", action="store_true")
        p.add_argument("--prev-rel")
        p.add_argument("-a", "--all", action="store_true")
        p.add_argument("tex_files", nargs="*")
        args = p.parse_args()
        seen, tex_files = set(), []
        for f in args.tex_files:
            if f not in seen:
                seen.add(f)
                tex_files.append(f)
        args.tex_files = tex_files
        return Args(**vars(args))
