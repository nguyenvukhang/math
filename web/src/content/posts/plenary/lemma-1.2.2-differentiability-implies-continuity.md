---
title: 'Lemma 1.2.2 (Differentiability implies continuity)'
---

import [Differentiability][diff]  
import [Continuity][cont]  

If a function $f(x)$ is differentiable at a point $x=c$ in its domain,
then $f(x)$ is continuous at $x=c$.

We will prove this statement for $f:\R\to\R$.

Since $f$ is differentiable at $c$, the limit

$$
f'(c)=\lim_{x\to c}\frac{f(x)-f(c)}{x-c}
$$

exists. Then we can calculate $\displaystyle\lim_{x\to c}f(x)-f(c)$ as
follows:

$$
\begin{align*}
\lim_{x\to c}f(x)-f(c)
&= \lim_{x\to c}\left(\frac{f(x)-f(c)}{x-c}\right)(x-c) \\
&= \lim_{x\to c}f'(c)(x-c) \\
&= 0
\end{align*}
$$

Hence we have $\displaystyle\lim_{x\to c}f(x)=f(c)$ and hence $f$ is
continuous.

[diff]: #calculus/differentiability
[cont]: #plenary/definition-1.2.1-continuity
