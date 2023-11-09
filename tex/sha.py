import random

s = "0123456789abcdef"
c = lambda: s[random.randint(0, len(s) - 1)]
print("".join([c() for _ in range(7)]), end="")
