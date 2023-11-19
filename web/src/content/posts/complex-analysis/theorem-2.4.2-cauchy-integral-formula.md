---
title: "Theorem 2.4.2 (Cauchy integral formula)"
---

Suppose that $U\subseteq\C$ is open and that $f$ is a holomorphic
function on $U$. Let $z_0\in U$ and let $r>0$ such that $\bar
D(z_0,r)\subseteq U$ . Let $\gamma:[0,1]\to\C$ be the $C^1$ curve
$\gamma(t)=z_0+r\cos(2\pi t)+ir\sin(2\pi t)$. Then, for each $z\in
D(z_0,r)$,

$$
f(z)=\frac1{2\pi i}\oint_\gamma\frac{f(\zeta)}{\zeta-z}\,d\zeta
$$

The converse of this theorem is true too: if $f$ is given by the
Cauchy integral formula, then $f$ is holomorphic.
