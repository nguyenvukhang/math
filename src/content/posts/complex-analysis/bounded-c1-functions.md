---
title: 'Definition 2.1.1 (Bounded C¹ functions)'
---

A function $\phi:[a,b]\to\R$ is continuously differentiable
(and we write $\phi\in C^1([a,b])$) if

1. $\phi$ is continuous on $[a,b]$
2. $\phi'$ exists on $(a,b)$
3. $\phi'$ has a continuous extension to $[a,b]$

In other words, for (3) we require that

$$
\lim_{t\to a^+}\phi'(t)
\quad\text{and}\quad
\lim_{t\to b^-}\phi'(t)
$$

both exist.

The motivation for this definition is so if $\phi\in C^1([a,b])$, then
we have

$$
\begin{align*}
\phi(b) - \phi(a) &=
\lim_{\epsilon\to0^+}\big(\phi(b-\epsilon)-\phi(a+\epsilon)\big)\\
&=\lim_{\epsilon\to0^+}\int_{a+\epsilon}^{b-\epsilon}\phi'(t)\,dt\\
&=\int_a^b\phi'(t)\,dt\\
\end{align*}
$$

and hence have the fundamental theorem of calculus hold for $\phi\in
C^1([a,b])$.
