---
title: 'Result 0.0.1 (Residue of a monomial zᵏ)'
---

Let's compute the residue of a monomial:

$$
\oint_\gamma z^k\,dz
$$

Where $\gamma:[0,2\pi]\to\C$ is a unit circle about zero,
parameterized by $\gamma(t)=e^{it}$

Then by [Definition 2.1.5][2.1.5] we have

$$
\begin{align*}
\oint_\gamma z^k\,dz
&=\int_0^{2\pi}(\gamma(t))^k\cdot\frac{d\gamma}{dt}\,dt\\
&=\int_0^{2\pi}ie^{i(k+1)t}\,dt\tag*{$*$}\\
&=\begin{cases}2\pi i&\text{if }k=1\\0&\text{otherwise}\end{cases}
\end{align*}
$$

If $k=1$, continuing from ($*$) we have

$$
\int_0^{2\pi}i\,dt=2\pi i
$$

And if $k\neq1$, continuing from ($*$) we have

$$
\begin{align*}
\int_0^{2\pi}ie^{i(k+1)t}\,dt
&=i\left[\frac1{i(k+1)}e^{i(k+1)t}\right]_0^{2\pi}\\
&=\frac1{(k+1)}\left[e^{2\pi i(k+1)}-e^0\right]\\
&=0
\end{align*}
$$

[2.1.5]: #complex-analysis/definition-2.1.5-complex-line-integral.md
