---
title: 'Proposition 2.1.9 (Parameterization-independence of line integrals)'
---

Let $U\subseteq\C$ be open and $f:U\to\C$ be a continuous function.
Let $\gamma:[a,b]\to U$ be a $C^1$ curve. Suppose that
$\phi:[c,d]\to[a,b]$ is a bijective increasing $C^1$ with a $C^1$
inverse.

<!--
TODO: Is the inverse of a continuous bijective function continuous?
NO.
https://math.stackexchange.com/questions/368824/is-the-inverse-of-a-continuous-bijective-function-also-continuous
-->

Let $\tilde\gamma=\gamma\circ\phi$. Then

$$
\oint_{\tilde\gamma}f(z)\,dz= \oint_\gamma f(z)\,dz
$$

The proof involves the standard change of variable formula from
calculus.
