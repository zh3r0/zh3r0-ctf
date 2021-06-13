import sys
import random
from PIL import Image

random.seed("X3eRo0")

flag = r"zh3r0{mAzes_w3Re_1nv3nteD_by_EgyptianS_cb3c82b9}"

height = 65
width  = 65

stack   = []
img     = Image.new("RGB", (height, width), color="blue")
maze    = img.load()
visited = {}
solution= {}
d       = ["right", "down", "left", "up"]
# Initialize with grid.

for i in range(height):
    for j in range(width):
        if (i%2 == 1) and (j%2 == 1):
            maze[(i,j)] = (255, 255, 255)
        else:
            maze[(i,j)] = (0, 0, 0)

for i in range(height):
    for j in range(width):
        visited[(i, j)] = False

def get_unvisited(x, y):
    unvisited = []

    if y != 1:
        if not visited[(x,y - 2)]:
            unvisited.append("down")
    if y != 63:
        if not visited[(x,y + 2)]:
            unvisited.append("up")
    if x != 1:
        if not visited[(x - 2,y)]:
            unvisited.append("left")
    if x != 63:
        if not visited[(x + 2,y)]:
            unvisited.append("right")

    return unvisited


def create_maze(x, y):

    visited[(x,y)] = True
    stack.append((x, y))

    while len(stack) > 0:
        old_x = x
        old_y = y

        unvisited = get_unvisited(x, y)
        #print(x, y, unvisited)


        if len(unvisited) > 0:

            direction = random.choice(unvisited)

            if direction == "up":
                solution[(x, y + 2)] = x, y
                y += 2
                maze[(x, y - 1)] = (255, 255, 255)
            if direction == "down":
                solution[(x, y - 2)] = x, y
                y -= 2
                maze[(x, y + 1)] = (255, 255, 255)
            if direction == "left":
                solution[(x - 2, y)] = x, y
                x -= 2
                maze[(x + 1, y)] = (255, 255, 255)
            if direction == "right":
                solution[(x + 2, y)] = x, y
                x += 2
                maze[(x - 1, y)] = (255, 255, 255)

            visited[(x, y)] = True
            stack.append((x, y))
        else:
            (x, y) = stack.pop()

create_maze(1, 1)
img.show()
img.save("maze.png")

def get_byte(bits):
    char = 0
    for i in range(8):
        char |= bits[i] << (7 - i)
    return char

def get_char(i, j):

    char = 0
    bits = []
    for k in range(8):
        if maze[(j + k, i)] == (0, 0, 0):
            bits.append(0)
        else:
            bits.append(1)

    char = get_byte(bits)
    return char

for i in range(height):
    byte = "\""
    j = 0
    while j != width - 1:
        byte += "\\x%.2X" % get_char(i, j)
        j+=8
    if maze[(width - 1, i)] == (0, 0, 0):
    	byte += "\\x00\""
    else:
    	byte += "\\x01\""

    print(byte)

sol = [(63, 63)]
def solve(x,y):
    maze[(x, y)] = (0, 255, 255)
    while (x, y) != (1,1):
        x, y = solution[x, y]
        maze[(x, y)] = (0, 255, 255)
        sol.append((x, y))
solve(63, 63)

img.save("maze_solved.png")
sol = sol[::-1]

bits = ""

last_direction = 0
for i in range(len(sol)):

    cur = sol[i]
    try:
        nex = sol[i+1]
    except:
        break
    cur_x, cur_y = cur
    nex_x, nex_y = nex

    if cur_x == nex_x and cur_y + 2 == nex_y:
        direction = 1
    if cur_x == nex_x and cur_y - 2 == nex_y:
        direction = 3
    if cur_y == nex_y and cur_x + 2 == nex_x:
        direction = 0
    if cur_y == nex_y and cur_x - 2 == nex_x:
        direction = 2


    if last_direction == direction:
        bit = 0
    else:
        if d[(last_direction + 1) % 4] == d[direction]:
            bit = 3
        elif d[(last_direction - 1) % 4] == d[direction]:
            bit = 2

    last_direction = direction

    bits += bin(bit)[2:]

s = bytes.fromhex(hex(int(bits, 2))[2:])
b = ""
for i in s:
    b += "\\x%.2X" % i

print("\nsolution: ", b)

enc = ""
flg_len = len(flag)
for i in range(54):
    enc += "\\x%.2X" % (s[i] ^ ord(flag[i % flg_len]))

print("\nEncrypted: ", enc)
