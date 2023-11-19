---
title: "Lemma 1.27 (König's Theorem)"
---

If $G=(L\cup R,E)$ is a bipartite graph then

$$
\max\{|M|:M\text{ a matching}\}=\min\{|U|:U\text{ a vertex cover}\}
$$

cover $U$ on $G$ we have $|M|\leq|U|$.

The number of matchings is bounded above by the size of the largest
vertex cover.

_Proof._ Every edge $e\in M$ must be covered by one of its two
endpoints in $U$, and no single vertex can cover two edges in $M$.
