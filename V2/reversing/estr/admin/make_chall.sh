nasm -felf64 chall.asm
ld chall.o -o chall
rm chall.o
cat flag.txt | pin -t ~/pintool/source/tools/MyPinTool/obj-intel64/tracer.so -- ./chall
