---
title: 'Solving 1st order differential equations'
sorter: 0.0.1
---

### Separable

Clearly.

### Homogeneous

Form: $\displaystyle\frac{dy}{dx}=g\left(\frac yx\right)$

An easier way to check if $\displaystyle\frac{dy}{dx}$ satisfies this
form is by letting $f(x,y):=\displaystyle\frac{dy}{dx}$ and verifying
that $f(x,y)=f(kx,ky)$

#### Method

Let $u:=y/x$. Eliminate all the $y$s.

### Linear

Form: $\displaystyle\frac{dy}{dx}+p(x)y=q(x)$

#### Method

Let $\ln u:=\int p(x)\,dx$ and jump to

$$
\frac d{dx}uy=u\cdot q(x)
$$

(which is just the product rule of differentiation)

### Bernoulli

Form: $\displaystyle\frac{dy}{dx}+p(x)y=q(x)\cdot y^n$

If $n\in\{0,1\}$, we have the linear case.

#### Method

Use $u:=y^{1-n}$, eliminate all $y$s, and reduce to a linear DE in
$u$:

$$
\frac{du}{dx}+(1-n)p(x)u=(1-n)q(x)
$$

### Riccati

Form: $\displaystyle\frac{dy}{dx}=p(x)y^2+q(x)y+r(x)$

#### Method

By inspection, find a basic solution $y_1(x)$.

Then define $u(x)$ by $\displaystyle y=y_1(x)+\frac1{u(x)}$. Use this
to eliminate all $y$ and $y'$ in the original DE, and reduce it to a
linear DE in $u$:

$$
-u'=(2py_1+q)u+p
$$

### Exact

Form: $\displaystyle M(x,y)+N(x,y)\frac{dy}{dx}=0$

Criteria: $M_y=N_x$.

#### Method

Idea: $F_x=M$, and $F_y=N$.

Integrate to find $F(x,y)=\int M(x,y)\,dx=\int N(x,y)\,dy$.

Then we have $F(x,y)=C$ for some constant $C$.
