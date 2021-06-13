from struct import pack,unpack
from numpy import random
from Crypto.Cipher import AES
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

output = input('enter output in hex:\n')
for _ in range(2):
    output = bytes.fromhex(output)
    iv,flag_enc = output[:16],output[16:]
    rand_outputs = unpack('<4I',iv)

    rand_seed = recover_seed(rand_outputs)
    random.seed(rand_seed)
    iv2,key = random.bytes(16),random.bytes(16)
    cipher = AES.new(key,iv=iv,mode=AES.MODE_CBC)
    output = cipher.decrypt(flag_enc)
    print(output)
    output = output.hex()



