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
f(\gamma(b))-f(\gamma(a))&=\int_a^b (f\circ\gamma)'(t)\,dt\\
&=\int_a^b\left(
\frac{\partial f}{\partial x}(\gamma(t))\cdot\frac{d\gamma_1}{dt}+
\frac{\partial f}{\partial y}(\gamma(t))\cdot\frac{d\gamma_2}{dt}
\right)
\,dt\\
&=\int_a^b
f_x(\gamma(t))\cdot\gamma_1'(t)+f_y(\gamma(t))\cdot\gamma_2'(t)
\,dt
\end{align*}
$$

This follows from [Definition 2.1.3][2.1.3] and the [chain
rule][chain-rule].

(the lack of an $i$ term is intentional. Remember that
$f\circ\gamma:\R\to\R$)

[2.1.3]: #complex-analysis/definition-2.1.3-complex-integration
[chain-rule]: #basic-calculus/chain-rule
