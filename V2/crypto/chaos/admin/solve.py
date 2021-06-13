from challenge import *
x_,y_,z_,u_ = 0x0124fdce, 0x89ab57ea, 0xba89370a, 0xfedc45ef
A_,B_,C_,D_ = 0x401ab257, 0xb7cd34e1, 0x76b3a27c, 0xf13c3adf
b1 = bytes.fromhex( f'{x_:08x}{y_:08x}{z_:08x}{u_:08x}')
b2 = bytes.fromhex( f'{A_:08x}{B_:08x}{C_:08x}{D_:08x}')
F = 0xffffffff
b3 = bytes.fromhex( f'{x_^F:08x}{y_^F:08x}{z_^F:08x}{u_^F:08x}')
b4 = bytes.fromhex( f'{A_^F:08x}{B_^F:08x}{C_^F:08x}{D_^F:08x}')
assert hash(b1+b2)==hash(b3+b4)
