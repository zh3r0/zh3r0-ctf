
# Pyaz 
    $ ./xvm pyaz.xvm
    Enter Password: asd
    Wrong Password
    $ # :)

### Author: X3eRo0

## Soln

Parse the pyaz.xvm file to extract all sections. all the sections
other than the .text and .data are encrypted and are decrypted
during runtime. reverse engineer the code at the entry point to 
manually decrypt the layers. each layer checks some part of the flag.


## Flag
zh3r0{s0_m4ny_t34rS_wh1Le_P33l1ng_tH1s_On10n}
