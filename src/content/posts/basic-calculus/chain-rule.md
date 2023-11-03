---
title: "Definition 1.1.4 (Chain rule)"
open: true
draft: true
---

In all the following scenarios, let $h:=f\circ g$.

### When f takes a scalar

Let $f,g:\R\to\R$. Then $h:\R\to\R$ and we have

$$
h'(t)=f'(g(t))\cdot g'(t)
$$

And $f',g':\R\to\R$.

### When f takes a vector

Let $g:\R\to\R^n$ and $f:\R^n\to\R$. Then $h:\R\to\R$ and we have

$$
h(t)=f(g(t)) \\[0.5em]
h'(t)=\nabla f(g(t))^Tg'(t)
$$

Note that $\nabla f(g(t))\in\R^n$ and $g'(t)\in\R^n$.
