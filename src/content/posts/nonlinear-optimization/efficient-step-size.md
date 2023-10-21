---
title: 'Definition 3.1.5 (Efficient step-size)'
---

Let $f:{\mathbb R}^n\to{\mathbb R}$ be continuously differentiable.
The [step-size](#onlinear-optimization/step-size-rule) rule $T$ is called efficient for $f$
if there exists $\theta > 0$ such that

$$
f(x + td)
\leq
f(x) - \theta
\left(
\frac{\nabla f(x)^Td}{\norm{d}}
\right)^2
$$
