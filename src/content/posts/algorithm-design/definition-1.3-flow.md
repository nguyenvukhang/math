---
title: 'Definition 1.3 (Flow)'
---

Let $G$ be a flow network. A _flow_ on $G$ is given by a positive
number $f(e)$ for each edge $e$ in $G$ satisfying the following two
constraints:

- **Capacity constraints.** For each edge $e\in E$, we have $0\leq
  f(e)\leq c(e)$
- **Flow conservation** For each vertex $v\in V$ that is not the
  source or target vertex,
  $$
  \sum_{e\text{ into }v} f(e) = \sum_{e\text{ leaving }v} f(e)
  $$

The _value_ of flow $f$ is all of the flow leaving $s$:

$$
\text{val}(f):=\sum_{e\text{ leaving }s} f(e)
$$

where $s$ is the source node of $G$.
