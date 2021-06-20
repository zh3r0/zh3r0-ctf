def isPrime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5)+1):
        if n % i == 0:
            return False

    return True

def encrypt(t):
    return (chr(ord(t) - 6 ))

def encript(t):
    return (chr(ord(t) + 9 ))
"""
105,107,107,86,110,43,126,86,99,92,107,46
ikkVn+~Vc\\k."""
inp="ikkVn+~Vc\\k."
wow=""

for i in range(1,len(inp)+1):

    if isPrime(i):
        #print(i)
        wow=wow+ encrypt(inp[i-1])
    else:
        wow += encript(inp[i-1])

print(wow)

