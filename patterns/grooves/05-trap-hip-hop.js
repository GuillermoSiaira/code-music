// Trap / Hip-hop — 140 BPM
// half-time: la caja cae en el 3. Los hats hacen redobles con ply.

setcpm(140/4)

$: s("bd").beat("0,7,10", 16)
$: s("sd").beat("8", 16)
$: s("hh*8")
  .ply("<1 [1 1 1 2] 1 [1 3]>")

// Sumale un bajo o acordes:
$: note("c1").beat("0,7,10",16)
  .s("sine") // 808
  .decay(.8).sustain(0)
