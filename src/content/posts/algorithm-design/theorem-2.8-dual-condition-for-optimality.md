---
title: 'Theorem 2.8 (Dual condition for optimality)'
---

Consider a primal Max-LP with an $m\times n$ system of constraints
$Ax\leq b$ and objective function $c\cdot x$. Let $x^*$ be a feasible
solution to the primal Max-LP, and let $y^*$ be a feasible solution to
the dual Min-LP. Then $x^*$ and $y^*$ are both optimal if and only if

- for all $i=1,\ldots,n$, we have $x^*_i=0$ or $(A^Ty)_i=c_i$.
- for all $j=1,\ldots,m$, we have $y^*_j=0$ or $(A^Ty)_j=b_j$.

That is, if $x^*\neq0$ then the corresponding dual constriant is
tight, and if $y^*\neq0$ then the corresponding primal constraint is
tight.

_Proof._ By the Complementary Slackness equations

$$
(A^Ty^*-c)\cdot x^*=0\\(Ax^*-b)\cdot y^*=0
$$

clearly.
