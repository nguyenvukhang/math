---
title: 'Result 2.0.1 (Method of undetermined coefficients)'
---

Form: $ay'' + by' + cy = g(t)$

| $g(t)$                                                               | $y(t)$                                                                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| $P_n(t) = a_0t^n + a_1t^{n-1} + \ldots + a_n$                        | $t^s(A_0t^n + A_1t^{n-1} + \ldots + A_n)$                                                                                       |
| $P_n(t)e^{\alpha t}$                                                 | $t^s(A_0t^n + A_1t^{n-1} + \ldots + A_n)e^{\alpha t}$                                                                           |
| $P_n(t)e^{\alpha t}\begin{cases}\sin\beta t\\\cos\beta t\end{cases}$ | $t^s[(A_0t^n + A_1t^{n-1} + \ldots + A_n)e^{\alpha t}\cos\beta t\\+(B_0t^n + B_1t^{n-1} + \ldots+ B_n)e^{\alpha t}\sin\beta t]$ |

Here, $s$ is the smallest non-negative integer that ensures that no
term in $y(t)$ is a solution of the corresponding homogeneous
equation.
