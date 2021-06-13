def isqrt(n):
    u, s = n, n+1
    while u < s:
        s = u
        t = s + n // s
        u = t // 2
    return s


def n2nk(n,k=2):
    if k==1:
        return [n]
    m = (isqrt(8*n+1) - 1)//2
    j = n-(m*(m+1))//2
    i = m-j
    if k==2:
        return [i,j]
    return n2nk(i,k-k//2) + n2nk(j,k//2)

flag_n = 2597749519984520018193538914972744028780767067373210633843441892910830749749277631182596420937027368405416666234869030284255514216592219508067528406889067888675964979055810441575553504341722797908073355991646423732420612775191216409926513346494355434293682149298585

for flag_len in range(2,100):
    nk = n2nk(flag_n,flag_len)
    if all(i in range(0x20,0x7f) for i in nk):
        print(bytes(nk))
