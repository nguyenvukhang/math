---
title: 'Theorem 1.1.1 (Fundamental theorem of calculus)'
---

### First part

Let $f:[a,b]\to\R$ be continuous. Let $F:[a,b]\to\R$ be defined by

$$
F(x)=\int_a^xf(t)\,dt
$$

Then $F$ is uniformly continuous on $[a,b]$ and differentiable on
$(a,b)$, and

$$
F'(x)=f(x)
$$

on $(a,b)$ so $F$ is an antiderivative of $f$.

#### Corollary

$$
\int_a^bf(t)\,dt=F(b)-F(a)
$$

### Second part

Let $f:[a,b]\to\R$. Let $F:[a,b]\to\R$ be continuous and also the
antiderivative of $f$ in $(a,b)$. If $f$ is Riemann integrable on
$[a,b]$, then

$$
\int_a^bf(t)\,dt=F(b)-F(a)
$$

This is stronger than the corollary because it does not assume that
$f$ is continuous.
