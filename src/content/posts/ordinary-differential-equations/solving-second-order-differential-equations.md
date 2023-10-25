---
title: 'Solving 2nd order differential equations'
sorter: 0.0.2
draft: true
---

### Method of undetermined coefficients

Form: $ay'' + by' + cy = g(t)$

| $g(t)$                                                               | $y(t)$                                                                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| $P_n(t) = a_0t^n + a_1t^{n-1} + \ldots + a_n$                        | $t^s(A_0t^n + A_1t^{n-1} + \ldots + A_n)$                                                                                       |
| $P_n(t)e^{\alpha t}$                                                 | $t^s(A_0t^n + A_1t^{n-1} + \ldots + A_n)e^{\alpha t}$                                                                           |
| $P_n(t)e^{\alpha t}\begin{cases}\sin\beta t\\\cos\beta t\end{cases}$ | $t^s[(A_0t^n + A_1t^{n-1} + \ldots + A_n)e^{\alpha t}\cos\beta t\\+(B_0t^n + B_1t^{n-1} + \ldots+ B_n)e^{\alpha t}\sin\beta t]$ |

Here, $s$ is the smallest non-negative integer that ensures that no
term in $y(t)$ is a solution of the corresponding homogeneous
equation.

### Variation of parameters

Form: $y''+p(x)y'+q(x)y=r(x)$

And we already know that $y_1$ and $y_2$ satisfy the corresponding
homogeneous equation.

Then we can jump to

$$
y_p=v_1y_1+v_2y_2
$$

where $\displaystyle v_1:=\frac{-y_2r}{W(y_1,y_2)}$ and $\displaystyle
v_2:=\frac{y_1r}{W(y_1,y_2)}$

### Using one solution to find another

Form: $y''+p(x)y'+q(x)y=r(x)$

And we already know that $y_1$ is a solution.

Define $v(x)$ by $\displaystyle y=y_1(x)v(x)$. Use this

Then we will have

$$
v''y_1+v'(2y_1'+py_1)=0
$$

Which is a first-order linear equation in $v'$. Use $u:=v'$ to solve
for $u$ and then substitute everything back to find $y$.
