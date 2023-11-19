---
title: 'Algorithm 3. (Capacity Scaling Algorithm)'
sorter: 1.16.1
---

**Input:** A flow network $G=(V,E)$ with source node $s$, target node
$t$.  
**Output:** A flow $f$ on $G$ with maximum value.  
Initialize $f(e):=0,\;\forall e\in E$; Construct residual graph $G_f$;  
Let $C:=\max\{c(e)\mid e\text{ leaving }s\}$;  
Let $\Delta$ be the largest power of 2 that $\leq C$;  
**while** $\Delta\geq1$ **do**

> **while** there is an augmenting path in $G_f(\Delta)$ **do**
>
> > Let $P$ be any such augmenting path;  
> > $f:=\text{Augment}(f,P)$;  
> > Update the residual graph $G_f$;
>
> **end**
>
> $\Delta:=\Delta/2$

**end**  
**return** $f$
