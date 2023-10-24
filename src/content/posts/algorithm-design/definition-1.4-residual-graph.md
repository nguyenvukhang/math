---
title: 'Definition 1.4 (Residual graph)'
---

Let $G$ be a flow network and let $f$ be a flow on $G$. The _residual
graph_ of $G$ and $f$, denoted by $G_f$, is the directed graph defined
as follows.

The vertices of $G_f$ are the same as the vertices of $G$.

For each edge $e=(u,v)$ in $G$, if $f(e)\lt c(e)$ then we add the edge
$(u,v)$ to $G_f$, labelled with the number $c(e)-f(e)$. If $f(e)>0$,
then we also add the edge $(v,u)$ to $G_f$, labelled with the number
$f(e)$.

All paths from $s$ to $t$ in the residual graph correspond to a
sequence where flow can be re-routed to increase its value.
