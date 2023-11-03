---
title: 'Proposition 2.1.4'
---

Let $U\subseteq\C$ be open and let $\gamma:[a,b]\to U$ be a $C^1$
curve. If $f:U\to\R$ and $f\in C^1(U)$ and we write

$$
f:x+iy\mapsto f(x+iy)\\\gamma(t)=\gamma_1(t)+i\gamma_2(t)
$$

then

$$
\begin{align*}
f(\gamma(b))-f(\gamma(a))&=
\int_a^b\left(
\frac{\partial f}{\partial x}(\gamma(t))\cdot\frac{d\gamma_1}{dt}+
i\frac{\partial f}{\partial y}(\gamma(t))\cdot\frac{d\gamma_2}{dt}
\right)
\,dt\\
&=\int_a^b
f_x(\gamma(t))\cdot\gamma_1'(t)+if_y(\gamma(t))\cdot\gamma_2'(t)
\,dt
\end{align*}
$$

This follows from the [chain rule][chain-rule].

[chain-rule]: #basic-calculus/chain-rule
