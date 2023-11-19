---
title: 'Lemma 1.1.2 (Linear map norm)'
---

Let $f:\R^n\to\R$ be a linear map. Then there is a $k\in\R$ such that

$$
\frac{\norm{f(x)}}{\norm x}=k
$$

### Proof

import [Definition 1.1.1][1.1.1]

Let $v:=x/\norm x$.

$$
f(x)=f(\norm x\cdot v)=\norm x\cdot f(v)
$$

Rearranging, we have

$$
\frac{f(x)}{\norm x}=f(v)
$$

And taking norm on both sides:

$$
\frac{\norm{f(x)}}{\norm x}=\norm{f(v)}
$$

QED.

[1.1.1]: #plenary/definition-1.1.1-linear-map
