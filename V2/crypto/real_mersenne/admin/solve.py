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

def recover_seed(outputs):
    MT = [BitVec(f'MT[{i}]',32) for i in range(n)]
    SEED = BitVec('seed', 32)
    MT[0] = SEED
    for i in range(1, n):
        temp = f * (MT[i - 1] ^ (LShR(MT[i - 1], (w - 2)))) + i
        MT[i] = temp & ((1 << w) - 1)
    twist_state(MT)
    untampered = list(map(untamper,outputs))
    S = Solver()
    for a,b in zip(untampered,MT):
        S.add(a==b)
    if S.check()==sat:
        m = S.model()
        seed = m[m.decls()[0]].as_long()
        return seed

def state_recovery_rand(outputs):
    import time
    start_time = time.time()
    MT = [BitVec(f'MT[{i}]',32) for i in range(624)]
    values = []
    for i in outputs:
        values.extend( divmod(int(i*2**53),2**26))
    S = Solver()
    for i in range(len(values)):
        if i%624==0:
            twist_state(MT)
        S.add(LShR(tamper_state(MT[i%624]),5+(i&1))==values[i])
    if S.check()==sat:
        print("time taken",time.time()-start_time)
        model = S.model()
        mt = {str(i): model[i].as_long() for i in model.decls()}
        mt = [mt[f'MT[{i}]'] for i in range(len(model))]
        return (3,tuple(mt+[624]),None)


import pwn
from fractions import Fraction
import random

def get_rand(REM,a):
    REM.sendline(str(a))
    data = REM.recvuntil(b'\nenter your guess:\n')
    num,den = pwn.re.search(b'(\-?\d+)/(\d+)\n',data).groups()
    return float(Fraction(int(den),int(num))-a)


REM = pwn.process('python3 challenge.py',shell=True)
rand_vals = [get_rand(REM,0) for _ in range(624)]
random.setstate(state_recovery_rand(rand_vals))
rand_vals_rec = [random.random() for _ in range(624)]
assert all(i==j for i,j in zip(rand_vals,rand_vals_rec))
for i in range(1000):
    REM.sendline(str(random.random()))
REM.interactive()

