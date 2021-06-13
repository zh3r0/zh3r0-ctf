from PIL import Image

img = Image.new("RGB", (65, 65), color="black")
pix = img.load()

maze = []

maze.append("\x00\x00\x00\x00\x00\x00\x00\x00\x00")
maze.append("\x77\xDF\x77\xFF\xFD\xFF\x7F\xFD\x00")
maze.append("\x15\x51\x50\x50\x04\x11\x04\x15\x00")
maze.append("\x55\x75\x5F\x57\xDD\xF5\xF5\xD5\x00")
maze.append("\x51\x05\x41\x14\x51\x04\x11\x55\x00")
maze.append("\x5F\x7D\xDD\xD7\x5F\x77\xDF\x77\x00")
maze.append("\x40\x44\x14\x51\x41\x51\x00\x01\x00")
maze.append("\x77\xDF\xF5\xDF\x77\x5D\xFF\xF7\x00")
maze.append("\x45\x00\x05\x00\x14\x44\x11\x04\x00")
maze.append("\x5D\xDF\xDD\x7F\xD5\xD7\xDD\xF7\x00")
maze.append("\x50\x50\x41\x40\x51\x10\x40\x11\x00")
maze.append("\x77\xDF\x77\x5D\xDF\xF5\xDF\xD7\x00")
maze.append("\x44\x01\x14\x51\x00\x15\x10\x54\x00")
maze.append("\x75\xFD\x5D\xDF\xFF\xDD\x77\xF7\x00")
maze.append("\x15\x05\x41\x10\x00\x41\x10\x01\x00")
maze.append("\x75\x77\x7F\x7F\x7F\x5F\x77\xFD\x00")
maze.append("\x45\x50\x10\x00\x41\x50\x44\x15\x00")
maze.append("\x5D\xD7\xF7\xFF\xDD\x5D\xFD\xD5\x00")
maze.append("\x50\x14\x54\x00\x15\x45\x01\x51\x00")
maze.append("\x5D\xF5\x55\xFF\x77\x7D\xDF\x5F\x00")
maze.append("\x45\x05\x44\x50\x50\x00\x10\x50\x00")
maze.append("\x57\x7F\x7F\xD7\xD7\xFF\x77\xDF\x00")
maze.append("\x50\x40\x01\x04\x14\x01\x44\x01\x00")
maze.append("\x5F\xD7\xF7\x7D\xD7\x77\x5D\xD7\x00")
maze.append("\x44\x14\x14\x40\x51\x54\x51\x54\x00")
maze.append("\x77\xF7\xD7\x5F\xD5\xD7\xDF\x55\x00")
maze.append("\x10\x10\x51\x54\x15\x04\x04\x55\x00")
maze.append("\x57\xD7\x5D\x55\xDD\x75\xF5\xDF\x00")
maze.append("\x54\x51\x44\x51\x45\x51\x11\x40\x00")
maze.append("\x55\xDF\x5F\xD7\x75\x5F\x5D\x5F\x00")
maze.append("\x55\x00\x40\x14\x45\x40\x45\x11\x00")
maze.append("\x5D\xFF\x5D\xFF\x7D\x7D\xDD\xF7\x00")
maze.append("\x40\x01\x54\x00\x05\x05\x50\x15\x00")
maze.append("\x7F\x7F\x77\xFD\xF5\x5D\x5F\xD5\x00")
maze.append("\x45\x40\x40\x05\x15\x51\x00\x55\x00")
maze.append("\x75\x77\x7F\x77\x75\xD7\xFD\xD5\x00")
maze.append("\x14\x15\x01\x51\x40\x54\x41\x15\x00")
maze.append("\x57\x75\xF7\x5D\x7F\x57\x7F\x75\x00")
maze.append("\x51\x44\x14\x44\x05\x51\x00\x14\x00")
maze.append("\x5D\x5F\x5D\xDF\x75\xD7\x7F\xD7\x00")
maze.append("\x51\x41\x41\x01\x50\x14\x40\x51\x00")
maze.append("\x57\x77\xDF\x7D\xDF\x75\xDF\xD7\x00")
maze.append("\x54\x10\x50\x50\x01\x44\x44\x05\x00")
maze.append("\x57\xDF\x5F\x5F\xDF\x77\x77\xF5\x00")
maze.append("\x51\x41\x01\x05\x10\x51\x10\x15\x00")
maze.append("\x55\x5D\xFD\xF5\x77\xDD\x77\xDD\x00")
maze.append("\x55\x14\x04\x11\x40\x05\x40\x41\x00")
maze.append("\x75\xF7\xF5\xF7\x7F\x7D\x5D\xDD\x00")
maze.append("\x44\x04\x05\x05\x01\x41\x55\x15\x00")
maze.append("\x7D\xF5\xF7\x7D\xFD\xDD\xD7\x77\x00")
maze.append("\x04\x45\x10\x40\x04\x10\x11\x40\x00")
maze.append("\x5D\xDD\x5D\xF5\xF7\xDF\xF7\x7D\x00")
maze.append("\x51\x55\x51\x15\x11\x10\x40\x05\x00")
maze.append("\x57\x55\xDF\x75\x5D\x77\x7F\xF5\x00")
maze.append("\x55\x10\x40\x45\x45\x44\x01\x15\x00")
maze.append("\x5D\x7F\x5F\x5F\xDD\x5D\xFF\x55\x00")
maze.append("\x50\x44\x50\x40\x15\x45\x10\x55\x00")
maze.append("\x77\x5D\xDF\x5D\xF5\x7D\x77\x55\x00")
maze.append("\x45\x51\x11\x55\x01\x05\x45\x55\x00")
maze.append("\x55\xDD\xD7\x75\xFF\x7D\x5D\x75\x00")
maze.append("\x55\x04\x44\x05\x04\x41\x11\x05\x00")
maze.append("\x55\x77\x77\xF5\x75\xDD\xD7\x77\x00")
maze.append("\x54\x50\x11\x14\x51\x14\x54\x51\x00")
maze.append("\x77\xDF\xFF\x77\xDF\xF7\x77\xDF\x00")
maze.append("\x00\x00\x00\x00\x00\x00\x00\x00\x00")

#print(len(maze))

for lines in range(65):
    bitcounter = 0
    for b in range(8):
        byte = maze[lines][b]

        for bits in range(8):
            #print(ord(byte) & 1)
            if (ord(byte) >> (7 - bits)) & 1:
                pix[(bitcounter, lines)] = (255, 255, 255)
            bitcounter += 1
        	

    #pix[(64, lines)] = (0, 0, 0)

img.show()