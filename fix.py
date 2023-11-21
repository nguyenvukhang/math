import os


def read(f):
    with open(f, "rb") as f:
        return f.read()


f = os.listdir()
f = filter(lambda f: f.endswith(".tex"), f)
f = map(lambda f: (f, read(f)), f)
for p in f:
    f, d = p
    d = d.replace(rb"\begin{align}", rb"\begin{align*}")
    d = d.replace(rb"\begin{equation}", rb"\begin{equation*}")
    d = d.replace(rb"\begin{gather}", rb"\begin{gather*}")
    d = d.replace(rb"\end{align}", rb"\end{align*}")
    d = d.replace(rb"\end{equation}", rb"\end{equation*}")
    d = d.replace(rb"\end{gather}", rb"\end{gather*}")
    with open(f, "wb") as f:
        f.write(d)
