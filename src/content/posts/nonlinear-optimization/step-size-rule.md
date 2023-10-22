---
title: 'Definition 3.1.4 (Step-size rule)'
---

Let $f:{\R}^n\to{\R}$ be continuously differentiable and
let $\mathcal{A}_f:=\{(x,d)\mid\nabla f(x)^Td<0\}$. A set-valued
mapping

$$
T:(x,d)\in\mathcal{A}_f\mapsto T(x,d)\subset\R_{++}
$$

is called a step-size rule for $f$.

We call it well-defined for $f$ if $T(x,d)\neq0$ for all
$(x,d)\in\mathcal{A}_f$.

If the step-size rule is well-defined for all continuously
differentiable functions ${\R}^n\to{\R}$, we simply call
it well-defined.
