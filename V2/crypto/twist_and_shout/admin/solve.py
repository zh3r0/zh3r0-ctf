from z3 import *

(w, n, m, r) = (32, 624, 397, 31)
a = 0x9908B0DF
(u, d) = (11, 0xFFFFFFFF)
(s, b) = (7, 0x9D2C5680)
(t, c) = (15, 0xEFC60000)
l = 18
f = 1812433253
lower_mask = (1<<r)-1
upper_mask = 1<<r


def tamper_state( y):
    y = y ^ (LShR(y, u) & d)
    y = y ^ ((y << s) & b)
    y = y ^ ((y << t) & c)
    y = y ^ (LShR(y, l))
    return y

def untamper(num):
    S = Solver()
    y = BitVec('y', 32)
    y = tamper_state(y)
    S.add(num == y)
    if S.check() == sat:
        m = S.model()
        return m[m.decls()[0]].as_long()

def twist_state(MT):
    for i in range(n):
        x = (MT[i] & upper_mask) + (MT[(i + 1) % n] & lower_mask)
        xA = LShR(x, 1)
        xA = If(x & 1 == 1, xA ^ a, xA)
        MT[i] = simplify(MT[(i + m) % n] ^ xA)


def untwist(outputs):
    MT = [BitVec(f'MT[{i}]', 32) for i in range(n)]
    twist_state(MT)
    s = Solver()
    for i in range(len(outputs)):
        s.add(outputs[i] == MT[i])
    if s.check() == sat:
        model = s.model()
        untwisted = {str(i): model[i].as_long() for i in model.decls()}
        untwisted = [untwisted[f'MT[{i}]'] for i in range(624)]
        return untwisted

def solve(outputs):
    untampered = list(map(untamper,outputs))
    untwisted = untwist(untampered)
    return b"".join(int.to_bytes(i,4,'big') for i in untwisted)

#print(solve(outputs))

