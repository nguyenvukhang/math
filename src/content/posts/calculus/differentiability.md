---
title: 'Definition 1.1.5 (Differentiability)'
---

In single-variable calculus, $f:\R\to\R$ is differentiable if

$$
\lim_{h\to0}\frac{f(a+h)-f(a)}h
$$

exists (and if so, is denoted as $f'(a)$).

In multivariable calculus, $f:\R^n\to\R$ is differentiable if there
exists a linear map $J:\R^n\to\R$ such that

$$
\lim_{h\to0}\frac{f(a+h)-f(a)-J(h)}{\norm{h}}=0
$$

Then from this perspective, differentiability of single-variable
complex functions can be written as:

$f:\C\to\C$ is differentiable if there is a linear map $J:\C\to\C$

$$
\lim_{h\to0}\frac{|f(z+h)-f(z)-J(h)|}{|h|}=0
$$

### Remark

All of these cases are equivalent to saying that there exists a
$k\in\R$ such that.

$$
\lim_{h\to0}\frac{f(a+h)-f(a)}h=k
$$
