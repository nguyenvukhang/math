---
title: 'Theorem 2.6 (Weak Duality for linear programs)'
---

Let $x$ be any feasible solution to a Max-LP in standard form, and let
$y$ be any feasible solution to its dual LP. Then $c\cdot x\leq b\cdot
y$.

_Proof._ Using variables from [Definition 2.5][def2.5], we have

$$
c\cdot x\leq(A^Ty)\cdot x = y^TAx\leq y^Tb=b\cdot y
$$

Note that for column vectors $a,b$, we have $a\cdot b=a^Tb$.

[def2.5]: #algorithm-design/definition-2.5-dual-linear-program
