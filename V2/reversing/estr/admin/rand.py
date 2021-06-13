import random

PRNG_A = 0x4212
PRNG_B = 0x9837
PRNG_C = 0x2042
PRVS_N = 0x0000

flag = "eXecUt10n_traces_4r3_n0t_fun"
flag = [ord(flag[i]) for i in range(len(flag))]

def srand(seed):
	global PRVS_N
	PRVS_N = seed

def rand():
	global PRVS_N
	rcx = (PRVS_N) & 0xffffffffffffffff
	rdx = (rcx) & 0xffffffffffffffff
	rdx = (rdx >> 12) & 0xffffffffffffffff
	rcx = (rcx ^ rdx) & 0xffffffffffffffff
	rdx = (rcx) & 0xffffffffffffffff
	rdx = (rdx << 25) & 0xffffffffffffffff
	rcx = (rcx ^ rdx) & 0xffffffffffffffff
	rdx = (rcx) & 0xffffffffffffffff
	rdx = (rdx >> 27) & 0xffffffffffffffff
	rcx = (rcx ^ rdx) & 0xffffffffffffffff
	rax = (2685821657736338717) & 0xffffffffffffffff
	rax = (rax * rcx) & 0xffffffffffffffff
	PRVS_N = rcx & 0xffffffffffffffff
	return rax & 0xff

srand(0x41424344)
arr = []
for i in range(2048):
	arr.append(rand())
for i in range(len(flag)):
	print "%s(%i)\tfound at 0x%.4x:\tOK" %(chr(flag[i]), i, arr.index(flag[i]))