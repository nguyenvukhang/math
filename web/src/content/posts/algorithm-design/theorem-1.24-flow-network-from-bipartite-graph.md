---
title: Theorem 1.24 (Constructing a flow network from a bipartite graph)
---

Let $G=(L\cup R,E)$ be a bipartite graph. There is a flow network $G'$
(which can be constructed from $G$ by an algorithm in $O(|V|+|E|)$
time) such that

- For every integer-valued flow $f$ on $G'$, there is a matching $M_f$
  in $G$ such that $\text{val}(f)=|M_f|$.
- For every matching $M$ in G there is an integer-valued flow $f_M$ on
  $G'$ such that $|M|=\text{val}(f_M)$.

The idea is to connect all vertices in $L$ to $s$, and all vertices in
$R$ to $t$. Set the capacity of terminal-facing edges to 1, and set
the capacity of all other edges to $\infty$.
