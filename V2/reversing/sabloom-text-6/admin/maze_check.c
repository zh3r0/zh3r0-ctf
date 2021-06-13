#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>

#define RIGHT 0
#define DOWN  1
#define LEFT  2
#define UP    3

int  expand_maze(const unsigned char *, char *);
int  solve(const unsigned char *, const unsigned char *, size_t, size_t, size_t);
void byte2bits(const unsigned char *, bool *, int);


const unsigned char maze[66 * 9] = {

"\x00\x00\x00\x00\x00\x00\x00\x00\x00"
"\x77\xDF\x77\xFF\xFD\xFF\x7F\xFD\x00"
"\x15\x51\x50\x50\x04\x11\x04\x15\x00"
"\x55\x75\x5F\x57\xDD\xF5\xF5\xD5\x00"
"\x51\x05\x41\x14\x51\x04\x11\x55\x00"
"\x5F\x7D\xDD\xD7\x5F\x77\xDF\x77\x00"
"\x40\x44\x14\x51\x41\x51\x00\x01\x00"
"\x77\xDF\xF5\xDF\x77\x5D\xFF\xF7\x00"
"\x45\x00\x05\x00\x14\x44\x11\x04\x00"
"\x5D\xDF\xDD\x7F\xD5\xD7\xDD\xF7\x00"
"\x50\x50\x41\x40\x51\x10\x40\x11\x00"
"\x77\xDF\x77\x5D\xDF\xF5\xDF\xD7\x00"
"\x44\x01\x14\x51\x00\x15\x10\x54\x00"
"\x75\xFD\x5D\xDF\xFF\xDD\x77\xF7\x00"
"\x15\x05\x41\x10\x00\x41\x10\x01\x00"
"\x75\x77\x7F\x7F\x7F\x5F\x77\xFD\x00"
"\x45\x50\x10\x00\x41\x50\x44\x15\x00"
"\x5D\xD7\xF7\xFF\xDD\x5D\xFD\xD5\x00"
"\x50\x14\x54\x00\x15\x45\x01\x51\x00"
"\x5D\xF5\x55\xFF\x77\x7D\xDF\x5F\x00"
"\x45\x05\x44\x50\x50\x00\x10\x50\x00"
"\x57\x7F\x7F\xD7\xD7\xFF\x77\xDF\x00"
"\x50\x40\x01\x04\x14\x01\x44\x01\x00"
"\x5F\xD7\xF7\x7D\xD7\x77\x5D\xD7\x00"
"\x44\x14\x14\x40\x51\x54\x51\x54\x00"
"\x77\xF7\xD7\x5F\xD5\xD7\xDF\x55\x00"
"\x10\x10\x51\x54\x15\x04\x04\x55\x00"
"\x57\xD7\x5D\x55\xDD\x75\xF5\xDF\x00"
"\x54\x51\x44\x51\x45\x51\x11\x40\x00"
"\x55\xDF\x5F\xD7\x75\x5F\x5D\x5F\x00"
"\x55\x00\x40\x14\x45\x40\x45\x11\x00"
"\x5D\xFF\x5D\xFF\x7D\x7D\xDD\xF7\x00"
"\x40\x01\x54\x00\x05\x05\x50\x15\x00"
"\x7F\x7F\x77\xFD\xF5\x5D\x5F\xD5\x00"
"\x45\x40\x40\x05\x15\x51\x00\x55\x00"
"\x75\x77\x7F\x77\x75\xD7\xFD\xD5\x00"
"\x14\x15\x01\x51\x40\x54\x41\x15\x00"
"\x57\x75\xF7\x5D\x7F\x57\x7F\x75\x00"
"\x51\x44\x14\x44\x05\x51\x00\x14\x00"
"\x5D\x5F\x5D\xDF\x75\xD7\x7F\xD7\x00"
"\x51\x41\x41\x01\x50\x14\x40\x51\x00"
"\x57\x77\xDF\x7D\xDF\x75\xDF\xD7\x00"
"\x54\x10\x50\x50\x01\x44\x44\x05\x00"
"\x57\xDF\x5F\x5F\xDF\x77\x77\xF5\x00"
"\x51\x41\x01\x05\x10\x51\x10\x15\x00"
"\x55\x5D\xFD\xF5\x77\xDD\x77\xDD\x00"
"\x55\x14\x04\x11\x40\x05\x40\x41\x00"
"\x75\xF7\xF5\xF7\x7F\x7D\x5D\xDD\x00"
"\x44\x04\x05\x05\x01\x41\x55\x15\x00"
"\x7D\xF5\xF7\x7D\xFD\xDD\xD7\x77\x00"
"\x04\x45\x10\x40\x04\x10\x11\x40\x00"
"\x5D\xDD\x5D\xF5\xF7\xDF\xF7\x7D\x00"
"\x51\x55\x51\x15\x11\x10\x40\x05\x00"
"\x57\x55\xDF\x75\x5D\x77\x7F\xF5\x00"
"\x55\x10\x40\x45\x45\x44\x01\x15\x00"
"\x5D\x7F\x5F\x5F\xDD\x5D\xFF\x55\x00"
"\x50\x44\x50\x40\x15\x45\x10\x55\x00"
"\x77\x5D\xDF\x5D\xF5\x7D\x77\x55\x00"
"\x45\x51\x11\x55\x01\x05\x45\x55\x00"
"\x55\xDD\xD7\x75\xFF\x7D\x5D\x75\x00"
"\x55\x04\x44\x05\x04\x41\x11\x05\x00"
"\x55\x77\x77\xF5\x75\xDD\xD7\x77\x00"
"\x54\x50\x11\x14\x51\x14\x54\x51\x00"
"\x77\xDF\xFF\x77\xDF\xF7\x77\xDF\x00"
"\x00\x00\x00\x00\x00\x00\x00\x00\x00"
};

const unsigned char solution[54] = "\x34\x9F\x5B\x53\xE7\x7C\xEF\xB8\xA6\xF8\x95\xED\x7D\xF1\xAB\xAE\xEB\xE0\xB2\x9B\xE8\x79\x5F\x2E\x71\xAB\x53\x9E\xB9\xF7\x75\xF3\xD7\x47\x5A\xBB\xE1\xD3\x7C\xB7\x7D\x1F\x67\x2B\xE5\x94\xEB\x63\xD4\x74\xF1\xF5\xD3\x0B";
const unsigned char enc[54] =      "\x4E\xF7\x68\x21\xD7\x07\x82\xF9\xDC\x9D\xE6\xB2\x0A\xC2\xF9\xCB\xB4\xD1\xDC\xED\xDB\x17\x2B\x4B\x35\xF4\x31\xE7\xE6\xB2\x12\x8A\xA7\x33\x33\xDA\x8F\x80\x23\xD4\x1F\x2C\x04\x13\xD7\xF6\xD2\x1E\xAE\x1C\xC2\x87\xE3\x70";

void xor(const unsigned char *a, unsigned char *b, unsigned char *out){

    size_t len_key = strlen(b);
    for(int i = 0; i < 54; i++){
        out[i] = a[i] ^ b[i % len_key];
    }
    return;
}

void byte2bits(const unsigned char *bytes, bool *bits, int byte_len){

    memset(bits, 0, byte_len * 8);
    int bit_counter = 0;
    for(int i = 0; i < (byte_len); i++){
        int bit_c = 0;
        for(int j = 0; j < 8; j++){
            bits[bit_counter] = ((bytes[i] >> (7 - j)) & 1) != 0;
            bit_counter++;
        }
    }

    return;
}

int expand_maze(const unsigned char *maze, char *expanded_maze){

    if (maze == NULL || expanded_maze == NULL){
        return -1;
    }

    for (int lines = 0; lines < 65; lines++){
        int bitcounter = 0;

        for (int bytes = 0; bytes < 8; bytes++){
            char byte = maze[(lines * 9) + bytes];

            for(int bit = 7; bit > -1; bit--){
                expanded_maze[(lines * 65) + bitcounter] = (char) ((byte >> bit) & 1);
                bitcounter++;
            }

        }

    }

    expanded_maze[63 * 65 + 63] = 0xff;

    return 0;
}


int solve(const unsigned char *maze, const unsigned char *solution, size_t maze_h, size_t maze_w, size_t sol_len){
    
    int           bit_ptr  = 0;
    int           dir      = 0;
    bool          cur_bit  = 0;
    bool          nex_bit  = 0;
    bool         *bits     = (bool *)malloc(8 * sol_len * sizeof(bool));
    int           direction[4] = {RIGHT, DOWN, LEFT, UP};
    int           x = 1, y = 1;

    byte2bits(solution, bits, sol_len);
    /*
    for(int i = 0; i < sol_len * 8; i++){
        printf("%d ", bits[i]);
    }
    puts("");
    */

    while(bit_ptr != (sol_len * 8)){


        cur_bit  = bits[bit_ptr];
        nex_bit  = bits[bit_ptr + 1];

        if(cur_bit == 1){
            bit_ptr++;
            if(nex_bit == 1){
                dir = (dir + 1) % 4;
            } else {
                dir = (dir - 1) % 4;
                if (dir < 0){
                    dir = 4 + dir;
                }
            }
        }

        bit_ptr++;
        switch(dir){
            case RIGHT:
            {
                if((maze[(y) * 65 + (x + 2)] != '\x00') && (maze[y * 65 + (x + 1)] != '\x00')){
                    x += 2;
                }
                break;
            }
            case DOWN:
            {
                if((maze[((y+2) * 65) + x] != '\x00') && (maze[((y+1) * 65) + x] != '\x00')){
                    y += 2;
                }
                break;
            }
            case LEFT:
            {
                if((maze[(y * 65) + (x - 2)] != '\x00') && (maze[(y * 65) + (x - 1)] != '\x00')){
                    x -= 2;
                }
                break;
            }
            case UP:
            {
                if((maze[((y - 2) * 65) + x] != '\x00') && (maze[((y - 1) * 65) + x] != '\x00')){
                    y -= 2;
                }
                break;
            }
        }
    }

    free(bits);
    bits = NULL;

    if(maze[y * 65 + x] == 0xff){
        return 0;
    }

    return -1;
}


int main(){


    // doom1234lol

    unsigned char input[51];
    unsigned char sol[54] = {0};
    memset(input, 0, 21);
    scanf("%50s", input); 

    xor(enc, input, sol);

    for(int i = 0; i < 54; i++){
        printf("\\x%.2X", sol[i]);
    }
    puts("");

    char *expanded_maze = (char *)malloc(65 * 65 * sizeof(char));
    memset(expanded_maze, 0, (65 * 65));
    if(expand_maze(maze, expanded_maze) != 0){
        // raise error;
    }

    if (solve(expanded_maze, sol, 65, 65, 54) == 0){
        puts("solved");
    } else {
        puts("bye");
    }

    free(expanded_maze);
    expanded_maze = NULL;

    return 0;
}
