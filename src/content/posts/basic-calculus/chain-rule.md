---
title: 'Definition 1.1.4 (Chain rule)'
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
h'(t)=\nabla f(g(t))^Tg'(t)
$$

Note that $\nabla f(g(t))\in\R^n$ and $g'(t)\in\R^n$.

### When f takes a complex number

Let $g:\R\to\C$ and $f:\C\to\R$. Then $h:\R\to\R$.

In particular, we write $g(t)=g_1(t)+ig_2(t)$ and $f:x+iy\mapsto
f(x+iy)$.

Interestingly, we still have

$$
(f\circ g)'(t) =
f_x(g(t))\cdot {g_1}'(t)+f_y(g(t))\cdot {g_2}'(t)
$$

Note the lack of $i$ terms on the term with ${g_2}'$. This is
intentional.

Remember anyway that $f\circ g:\R\to\R$, and so we must have $(f\circ
g)':\R\to\R$.
