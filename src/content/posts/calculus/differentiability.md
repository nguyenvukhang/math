---
title: 'Definition 1.1.5 (Differentiability)'
---

In single-variable calculus, $f:\R\to\R$ is differetiable if

$$
\lim_{h\to0}\frac{f(a+h)-f(a)}h
$$

exists (and if so, is denoted as $f'(a)$).

In multivariable calculus, $f:\R^n\to\R$ is differetiable if there
exists a linear map $J:\R^n\to\R$ such that

$$
\lim_{h\to0}\frac{f(a+h)-f(a)-J(h)}{\norm{h}}=0
$$
