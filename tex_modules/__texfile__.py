from __utils__ import *
from __args__ import *
import os
from os import path
from subprocess import Popen, PIPE


class TexFile:
    def __init__(self, path):  # type: (str) -> None
        self.path = path
        self.bytes = read_file(path)

    def reload(self):
        self.bytes = read_file(self.path)


class Project:
    def __init__(self, tex_filepaths):  # type: (list[str]) -> None
        self.tex_files = list(map(TexFile, tex_filepaths))

    def build(self, args):  # type: (Args) -> None
        latex = PdfLatex(
            jobname=args.jobname,
            build_dir=args.build_dir,
            dev_mode=args.action == "dev",
        )
        w = latex.stdin.write

        w(b"\\documentclass{article}")
        w(b"\\usepackage{" + args.header.encode("utf8") + b"}")
        w(b"\\begin{document}")

        for f in self.tex_files:
            w(f.bytes)
            w(b"\n\\newpage\n")

        w(b"\\end{document}")

        latex.stdin.flush()
        latex.stdin.close()
        if args.verbose:
            latex.direct_stdout()
        else:
            latex.filtered_stdout()
        latex.wait()


class PdfLatex(Popen):
    # start a subprocess of `pdflatex` ready to take a latex file in
    # from stdin
    def __init__(self, jobname="minimath", build_dir=".build", dev_mode=False):
        # tells latex compiler to search for .sty packages in this folder.
        os.environ["TEXINPUTS"] = path.join(os.curdir, "tex_modules") + ":"

        self.jobname = jobname
        self.build_dir = build_dir
        self.dev_mode = dev_mode

        j, d = jobname, build_dir

        if not path.isdir(build_dir):
            os.mkdir(build_dir)

        cmd = ("pdflatex", "-halt-on-error", f"-output-directory={d}", f"-jobname={j}")
        super().__init__(cmd, stdin=PIPE, stdout=PIPE, stderr=PIPE, env=os.environ)

    def wait(self) -> int:
        super().wait()
        pdf_basename = f"{self.jobname}.pdf"
        pdf_output = path.join(self.build_dir, pdf_basename)
        if path.isfile(pdf_output):
            os.rename(pdf_output, pdf_basename)

    def buf_to_stdout(self, buf):  # type: (list[bytes]) -> None
        for l in filter(lambda v: len(v.strip()) > 0, buf):
            print(l.decode("utf8"), end="")

    def direct_stdout(self):
        self.buf_to_stdout(iter(self.stdout.readline, b""))

    def err_buf(self, buf):  # type: (list[bytes]) -> None
        s = b"".join(buf).strip().decode("utf8")
        raise Exception("PYTEX ERROR\n" + s)

    # helps to monitor stdout in a less cluttered way
    def filtered_stdout(self):
        buf, is_err = [], False
        lines = iter(self.stdout.readline, b"")
        for l in lines:
            excl, ast = l.startswith(b"!"), l.startswith(b"*")
            if excl or ast:
                if is_err and not self.dev_mode:
                    self.err_buf(buf)
                if should_pretty_print(buf):
                    self.buf_to_stdout(buf)
                buf.clear()
            is_err |= excl
            buf.append(l)

        if is_err and not self.dev_mode:
            self.err_buf(buf)
