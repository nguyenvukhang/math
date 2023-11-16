---
title: 'Definition 2.1.3 (Complex integration)'
---

Let $\psi:[a,b]\to\C$ be continous on $[a,b]$. Write
$\psi(t)=\psi_1(t)+i\psi_2(t)$. Then we define

$$
\int_a^b\psi(t)\,dt
:=
  \int_a^b\psi_1(t)\,dt
+i\int_a^b\psi_2(t)\,dt
$$

Using this definition along with Definitions [2.1.1][2.1.1] and
[2.1.2][2.1.2], we have that if $\gamma\in C^1([a,b])$ is
complex-valued, then

$$
\gamma(b)-\gamma(a) = \int_a^b\gamma'(t)\,dt
$$

[2.1.1]: ../complex-analysis/bounded-c1-functions.md
[2.1.2]: ../complex-analysis/continuous-complex-curve.md
