---
title: 'Definition 2.1.8 (Upper bound of line integral)'
---

Let $U\subseteq\C$ be open and $f\in C^0(U)$. Let $\gamma:[a,b]\to U$
be a $C^1$ curve, and let $\ell(\gamma)$ be given by

$$
\ell(\gamma):=\int_a^b\left|\frac{d\gamma}{dt}(t)\right|\,dt
$$

Then we have

$$
\left|\oint_\gamma f(z)\,dz\right|\leq
\Big(\sup_{t\in[a,b]}|f(\gamma(t))|\Big)\cdot\ell(\gamma)
$$

(Note that $\ell(\gamma)$ is the length of $\gamma$.)
