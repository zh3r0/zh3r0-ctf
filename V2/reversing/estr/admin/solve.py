SEED = 0

with open('trace.txt', 'r') as file:
    trace_data = file.readlines()

def parse_trace(data):
    trace = []
    for i in range(len(data)):
        ip          = int(data[i].split(":")[0], 16)
        instruction = data[i].split(":")[1].strip()
        trace.append([ip, instruction])
    return trace

def srand(val):
    global SEED
    SEED = val
    return

def rand():
    global SEED
    rcx = (SEED) % (2 ** 64)
    rdx = (rcx ) % (2 ** 64)
    rdx = (rdx >> 0xc) % (2 ** 64)
    rcx = (rcx ^ rdx) % (2 ** 64)
    rdx = (rcx) % (2 ** 64)
    rdx = (rdx << 0x19) % (2 ** 64)
    rcx = (rcx ^ rdx) % (2 ** 64)
    rdx = (rcx) % (2 ** 64)
    rdx = (rdx >> 0x1b) % (2 ** 64)
    rcx = (rcx ^ rdx) % (2 ** 64)
    rax = 0x2545f4914f6cdd1d % (2 ** 64)
    rax = (rax * rcx) % (2 ** 64)
    SEED = rcx
    return rax & 0xff

def get_random_data():
    srand(0x41424344)
    a = [rand() for i in range(0x800)]
    return a

trace = parse_trace(trace_data)

rand_func    = 0x401023
search_start = 0x4010bd
search_loop  = 0x401122
search_end   = 0x401129

def get_search_value():
    # find the calls to search
    # find the argument f call
    # by counting how many times
    # loop happened
    found = [] 
    k = 0
    while k < len(trace):
        i = 0
        if trace[k][0] == search_start:
            while trace[k][0] != search_end:
                if trace[k][0] == search_loop:
                    # print(trace[k][1])
                    i += 1
                    k += 1
                k+=1

            found.append(i)

        k += 1 
    return found

random = get_random_data()
found = get_search_value()
flag = ""
for i in found:
    if i != 260:
        flag += chr(random[i - 1])

print(flag.strip())
# get_search_value()
# rand was called 2048 times
# search was called 40 times
