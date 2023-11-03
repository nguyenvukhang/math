---
title: 'Definition 1.4.1 (Holomorphic functions)'
---

Let $U\subset\mathbb C$ be open. Let $f:U\to\C$ be in $C^1(U)$. $f$ is
said to be _holomorphic_ if

$$
\frac{\partial f}{\partial\bar z}=0
$$

### Properties of holomorphic functions

If $f$ and $g$ are holomorphic in a domain $U$, then so are $f+g$,
$f-g$, $fg$, and $f\circ g$.

Additionally, if $g$ has no zeros in $U$, then $f/g$ is holomorphic
too.

### Examples of holomorphic functions

Here are some building blocks to get started (remember that you can
use these with the properties above to show that other more
complicated functions are holomorphic too):

1. $f(z)=1/z$ on $\C\setminus\{0\}$
2. $f(z)=z$ on $\C$

(I really thought this list was gonna be longer. To be continued.)

All these can be proved using a destructuring of $z:=x+iy$ and using
[Definition 1.1.3][1.1.3]

[1.1.3]: #complex-analysis/definition-1.1.3-complex-partials
