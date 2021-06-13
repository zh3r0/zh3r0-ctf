#include <stdio.h>
#include <stdint.h>
#include <string.h>

typedef uint8_t  u8;
typedef uint16_t u16;
typedef uint32_t u32;
typedef uint64_t u64;

static unsigned  char * encoded_flag[32] = {
    "\x64\xad\x00\x23\x3d\x3f\xeb\x00\x55\x99\x1e\xe0\x00\x00\xff\x00\x55\x99\x1e\x1f\xe0\x00\xff\x00\xd5\x19\x9e\xe0\xff\x80\xff\x00"
};

void print_bytes(const unsigned char *bs, const size_t size) {
    for (size_t i = 0; i < size; i++) {
        printf("\\x%02x", bs[i]);
    }
    printf("\n");
}

/*
def permute(block):
    result = [0 for _ in range(8)]
    for i in range(8):
        x = block[i]
        for j in range(8):
            result[j] |= (x & 1) << i
            x >>= 1
    return result
*/

u64 encode(char *block){

    u8 bytes[8];
    memset(bytes, 0, sizeof(bytes));
    for (u32 i = 0; i < 8; i++){
        u8 x = block[i];
        for (u32 j = 0; j < 8; j++){
            bytes[j] |= (x & 1) << i;
            x >>= 1;
        }
    }

    return (*(u64 *) &bytes);
}


int main(){

    char input[33] = "zh3r0{4_b4byre_w1th0ut_-O3_XDXD}";
    u64  encoded[4];

    for (u32 i = 0, j = 0; i < 32; i += 8, j++){
        encoded[j] = (u64) encode(&input[i]);
    }

    puts("==========input==========");
    print_bytes(encoded, 32);
    return 0;
}