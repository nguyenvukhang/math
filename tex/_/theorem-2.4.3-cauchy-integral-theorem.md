---
title: 'Theorem 2.4.3 (Cauchy integral theorem)'
---

If $f$ is a holomorphic function on an open disc $U\subseteq\C$, and
if $\gamma:[a,b]\to U$ is a $C^1$ curve in $U$ with
$\gamma(a)=\gamma(b)$, then

$$
\oint_\gamma f(z)\,dz=0
$$

_Proof._ By [Theorem 1.5.3][1.5.3], there is a holomorphic function
$G:U\to\C$ with $G'=f$ on $U$. Since $\gamma(a)=\gamma(b)$, we have
that

$$
0=G(\gamma(b))-G(\gamma(a))
$$

By [Proposition 2.1.6][2.1.6], this equals

$$
\oint_\gamma G'(z)\,dz=\oint_\gamma f(z)\,dz
$$

(Reminder that since $G$ is holomorphic, $G'=\frac{\partial
G}{\partial z}$ by [Theorem 2.2.1][2.2.1])

[1.5.3]: #complex-analysis/theorem-1.5.3
[2.1.6]: #complex-analysis/proposition-2.1.6-holomorphic-line-integral
[2.2.1]: #complex-analysis/theorem-2.2.1-existence-of-derivative-on-holomorphic-f
