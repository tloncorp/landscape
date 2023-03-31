/-  spider
/+  *strandio
=,  strand=strand:spider
=,  strand-fail=strand-fail:libstrand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=+  !<(vic=cord arg)
;<  our=@p   bind:m  get-our
;<  =json  bind:m  (fetch-json "{(trip vic)}bait/who")
=/  =ship  (slav %p (so:dejs:format json))
;<  ~  bind:m  (poke [our %reel] reel-command+!>([%set-ship ship]))
(pure:m !>(~))
