#!/usr/bin/env python3

import subprocess

ALL_TEX_FILES = (
    "plenary.tex",
    "calculus.tex",
    "algorithm-design.tex",
    "complex-analysis.tex",
    "nonlinear-optimization.tex",
    "ordinary-differential-equations.tex",
)


def build(job, no_proof=False, no_compute=False):
    print(f"[JOB: {job}]")
    pytex = ["python3", "bin/pytex", f"-J{job}", "-Hheader.tex"]
    no_proof and pytex.append("--no-proof")
    no_compute and pytex.append("--no-compute")
    pytex.append("build")
    pytex.extend(ALL_TEX_FILES)
    # run twice to generate document references correctly
    subprocess.run(pytex)
    subprocess.run(pytex)


build("minimath")
build("minimath.nc", no_compute=True)
build("minimath.np", no_proof=True)
build("minimath.np.nc", no_proof=True, no_compute=True)
