---
title: 'Definition 2.0.0 (Wronskian)'
---

The Wronskian of two differentiable functions $f$ and $g$ is
$W(f,g):=fg'-gf'$

More generally, for $n$ complex-valued functions $f_1,\ldots,f_n$
which are $n-1$ times differentiable on an interval $I$, the Wronskian
$W(f_1,\ldots,f_n)$ is a function on $x\in I$ defined by

$$
W(f_1,\ldots,f_n)(x):=\det\begin{bmatrix}
f_1(x)  & f_2(x)  & \ldots & f_n(x)  \\
f_1'(x) & f_2'(x) & \ldots & f_n'(x) \\
\vdots  & \vdots  & \ddots & \vdots  \\
f_1^{(n-1)}(x) & f_2^{(n-1)}(x) & \ldots & f_n^{(n-1)}(x) \\
\end{bmatrix}
$$
