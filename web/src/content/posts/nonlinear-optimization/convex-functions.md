---
title: 'Definition 1.2.3 (Convex functions)'
---

Let $C\subset\R^n$ be
[convex](#nonlinear-optimization/convex-sets). Let $\lambda\in(0,1)$
and $x,y\in C$ and let

Then $f:C\to\R$ is said to be

- convex on $C$ if
  $$
  f(\lambda x+(1-\lambda)y)\leq\lambda f(x)+(1-\lambda)f(y)
  $$
- strictly convex on $C$ if
  $$
  f(\lambda x + (1-\lambda) y) < \lambda f(x)  + (1-\lambda) f(y)
  $$
- strongly convex on $C$ if $\exists\mu>0$ such that
  $$
  f(\lambda x+(1-\lambda)y)+\frac{\mu}{2}\lambda(1-\lambda)\norm{x-y}^2\leq\lambda f(x)+(1-\lambda)f(y)
  $$
