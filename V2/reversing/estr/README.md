
# EAT SLEEP TRACE REPEAT

    $ ./chall
    enter password: zh3r0{xxxxxx...}
    search complete
    $ # :)

### Author: X3eRo0

## Soln

reverse the trace till you realise that there is random
number generator and flag bytes are basically searched
in the array of random numbers.

reverse the loops in the trace to get indexes of flag bytes
and recover the flag.

## Flag
zh3r0{d1d_y0u_enjoyed_r3v3rs1ng_w1th0ut_b1n4ry_?}