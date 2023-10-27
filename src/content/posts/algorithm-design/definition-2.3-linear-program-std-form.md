---
title: 'Definition 2.3 (Linear Program standard form)'
---

A Max-LP is in _standard form_ if it is of the form

$$
\begin{alignat*}{3}
&\text{max}             & c\cdot x &        \\
&\text{subject to}\quad & Ax       & \leq b \\
&                       & x        & \geq 0 \\
\end{alignat*}
$$

where $A\in\R^{m\times n}$, $c\in\R^n$, $b\in\R^m$ ($n$ variables, $m$
linear constraints)

Similarly, a Min-LP is in standard form when it is written as

$$
\begin{alignat*}{3}
&\text{min}             & c\cdot x &        \\
&\text{subject to}\quad & Ax       & \geq b \\
&                       & x        & \geq 0 \\
\end{alignat*}
$$
