/-  v=vitals, spider
/+  *vitals, io=strandio
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=+  !<([~ target=ship] arg)
;<  our=@p  bind:m  get-our:io
::  early exit; check if we have live path to target
;<  tqos=qos:ames  bind:m  (get-qos target)
;<  now=@da  bind:m  get-time:io
?:  ?&  ?=(%live -.tqos)
        (gth last-contact.tqos (sub now info-timeout:v))
    ==
  (post-result [%yes ~])
::  sponsored-target check: only evaluate path to target and sponsor chain
::  (skip global DNS/local-galaxy diagnostics used by generic checks)
;<  ~  bind:m  (update-status target [%trying-target ~])
;<  chek=(unit)  bind:m  (check-online target target-timeout:v)
?:  ?=([%$ %$] chek)
  (post-result [%yes ~])
::  walk target's sponsor chain toward us
;<  saxo=(list ship)  bind:m  (scry:io (list ship) ~[%j %saxo (scot %p target)])
=/  sponsors
  ?~  saxo  ~
  t.saxo
|-
?~  sponsors
  (post-result [%no-sponsor-miss our])
=/  sponsor=ship  i.sponsors
;<  ~  bind:m  (update-status target [%trying-sponsor sponsor])
;<  live=(unit ?)  bind:m  (ask-sponsor sponsor target)
?~  live
  ?:  =(sponsor our)
    (post-result [%no-sponsor-miss sponsor])
  $(sponsors t.sponsors)
?:  u.live
  ?:  =(sponsor our)
    (post-result [%yes ~])
  $(sponsors t.sponsors)
(post-result [%no-sponsor-miss sponsor])
