BITS 64

global _start

_start:
    call main

input:
    push    rbp
    mov     rbp, rsp
    xor     rax, rax
    xor     rdi, rdi
    lea     rsi, [pswd]
    mov     rdx, 100
    syscall
    mov     rsp, rbp
    pop     rbp
    ret


rand:
	mov 	rcx, [PRVS_N]
	mov 	rdx, rcx
	shr 	rdx, 12
	xor 	rcx, rdx
	mov 	rdx, rcx
	shl 	rdx, 25
	xor 	rcx, rdx
	mov 	rdx, rcx
	shr 	rdx, 27
	xor 	rcx, rdx
	mov 	rax, 2685821657736338717
	mul 	rcx
	mov 	[PRVS_N], rcx
	ret


srand:
    mov     [PRVS_N], rdi
    ret


main:

    mov     rax, 0x01
    mov     rdi, rax
    lea     rsi, [prompt]
    mov     rdx, 0x10
    syscall
    call    input
    mov     rdi, 0x41424344
    call    srand
    mov     rcx, 2048
    xor     r15, r15

    _main_rand_loop:
        test    rcx, rcx
        jz      _main_continue
        push    rcx
        call    rand
        pop     rcx
        mov     BYTE [array + r15], al
        inc     r15
        dec     rcx
        jmp _main_rand_loop
    
    _main_continue:
    mov     rsi, 0x00

    main_search_loop:

        mov     dil, BYTE [pswd + rsi]
        call    search
        cmp     rax, -1
        jz      bad_search
        mov     BYTE [search_result + rsi], al
        inc     rsi
        cmp     sil, 0x64
        jnz     main_search_loop

    mov     rax, 0x01
    mov     rdi, rax
    lea     rsi, [byebye]
    mov     rdx, 0x10
    syscall
    mov     rax, 0x3c
    mov     rdi, 0x00
    syscall

bad_search:
    mov     rax, 0x3c
    mov     rdi, 0xff
    syscall

search:
    push    rbp
    mov     rbp, rsp
    mov     rbx, rdi
    xor     rdx, rdx
    
    _search_loop:
        
        mov     al, [array + rdx]
        inc     rdx
        cmp     rdx, 0x7ff
        jz      return_bad
        cmp     al, bl
        jnz     _search_loop
        ; mov     rdi, rax
        ; call    print

    dec     rdx
    mov     rax, rdx
    mov     rsp, rbp
    pop     rbp
    ret

return_bad:

    mov     rax, -1
    mov     rsp, rbp
    pop     rbp
    ret    

xor:
    mov     rax, rdi
    add     rdi, rsi
    and     rax, rsi
    neg     rax
    lea     rax, [rdi+rax*2]
    ret

; print:
;     
;     push    rsi
;     sub     rsp, 2
;     mov     rsi, rsp
;     mov     byte [rsp + 0], 0x0A
;     mov     byte [rsp + 1], dil
;     mov     edi, 0x1
;     mov     edx, 0x2
;     mov     eax, 0x1
;     syscall
;     add     rsp, 2
;     pop     rsi
;     ret

section .data

PRVS_N: dq 0x00


array:
    times 2048 db 0x00
pswd:
    times 0x064 db 0x00
search_result:
    times 0x064 db 0x00
prompt:
    db "enter password: ", 0x00
byebye:
    db "search complete", 0x0A, 0x00
