::  XX: As an alternative implementation, we could perform these checks (mostly)
::      in parallel. In that case, we shouldn't return immediately when a check
::      completes, but instead record the results and then check them after some
::      timeout (e.g. 30s).
::
/-  v=vitals, spider
/+  *vitals, io=strandio
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=+  !<([~ target=ship] arg)
;<  our=@p  bind:m  get-our:io
|^
  ::  early exit; check if we have live path to target
  ;<  tqos=qos:ames  bind:m  (get-qos target)
  ;<  now=@da  bind:m  get-time:io
  ?:  ?&  ?=(%live -.tqos)
          (gth last-contact.tqos (sub now info-timeout:v))
      ==
    (post-result [%yes ~])
  ::  set pending to %trying-dns
  ::  XX: can we use the strand cards for these?
  ;<  ~  bind:m  (update-status target [%trying-dns ~])
  ::  check if we can fetch example.com
  ;<  ~  bind:m  (send-request:io [%'GET' 'http://example.com' ~ ~])
  ;<  =client-response:iris  bind:m  take-client-response:io
  ?.  ?&  ?=(%finished -.client-response)
          =(200 status-code.response-header.client-response)
      ==
    (post-result [%no-dns ~])
  ::  set pending to %trying-local
  ;<  ~  bind:m  (update-status target [%trying-local ~])
  ::  check if we can contact our own galaxy
  ;<  =ping:v  bind:m  (scry:io ping:v ~[%gx %ping %noun])
  ;<  gqos=qos:ames  bind:m  (scry:io qos:ames ~[%gx %vitals %galaxy %vitals-qos])
  ?:  !(galaxy-reachable ping gqos)
    (post-result [%no-our-galaxy last-contact.gqos])
  ::  set pending to %trying-target
  ;<  ~  bind:m  (update-status target [%trying-target ~])
  ::  check if we can contact target (with timeout)
  ;<  chek=(unit)  bind:m  (check-online target target-timeout:v)
  ?:  ?=([%$ %$] chek)
    (post-result [%yes ~])
  ::  if we're a moon, check if we can contact our planet
  ::
  ::  NN: failing to contact our sponsor is only a failure condition for moons,
  ::      since currently only moons require the direct sponsor to be online for
  ::      peers to grab the moon keys
  ::  NN: we do this after the initial target check because if we're a moon and
  ::      our planet is down, it's useful to talk to ships that still have live
  ::      wires (e.g. for troubleshooting); thus, by waiting to perform this
  ::      check, we don't report %no-our-planet for every connectivity check
  ::      when attempting to track down a live peer from whom to seek help
  ::
  ;<  moon-sponsor-reachable=?
      bind:m
    =/  mm  (strand ,?)
    ^-  form:mm
    ?.  ?=(%earl (clan:title our))
      (pure:mm %.y)
    =/  sponsor=@p  (end 5 our)
    ;<  ~  bind:mm  (update-status target [%trying-sponsor sponsor])
    ;<  pchek=(unit)   bind:mm  (check-online sponsor target-timeout:v)
    ?:  ?=([%$ %$] pchek)
      (pure:mm %.y)
    (pure:mm %.n)
  ::
  ?:  !moon-sponsor-reachable
    ;<  pqos=qos:ames  bind:m  (scry:io qos:ames ~[%gx %vitals %sponsor %vitals-qos])
    (post-result [%no-our-planet last-contact.pqos])
  ::  early exit; if target is a galaxy, there's nothing more we can check
  ?:  ?=(%czar (clan:title target))
    (galaxy-down target)
  ::  check if target sponsors can reach target
  ;<  saxo=(list ship)  bind:m  (scry:io (list ship) ~[%j %saxo (scot %p target)])
  =/  sponsors
    ?~  saxo  ~
    t.saxo
  |-
  ::  case impossible:
  ::    - early exit for target = galaxy
  ::    - base case is sponsor = galaxy
  ?~  sponsors  !!
  ::  set pending to %trying-sponsor
  ;<  ~  bind:m  (update-status target [%trying-sponsor i.sponsors])
  ::  ask sponsor if he has live wire to target
  ;<  live=(unit ?)  bind:m  (ask-sponsor i.sponsors target)
  ::  if timeout...
  ?~  live
    ::  ... and sponsor is galaxy ...
    ?:  ?=(%czar (clan:title i.sponsors))
      ::  ... it's so over
      (galaxy-down i.sponsors)
    :: ... otherwise, check next sponsor
    $(sponsors t.sponsors)
  ::  report whether sponsor can reach target
  %-  post-result
  ?:  u.live
    [%no-sponsor-hit i.sponsors]
  [%no-sponsor-miss i.sponsors]
::
++  galaxy-reachable
  |=  [=ping:v =qos:ames]
  ^-  ?
  ?-    -.ping
      %0
    ?=(%live -.qos)
  ::
      %1
    ?:  ?=(%pub -.plan.ping)
      %.y
    ?=(%live -.qos)
  ::
      %2
    ?.  ?=(%nat -.plan.ping)
      %.y
    ?=(%live -.qos)
  ::
      %3
    ?:  ?=(%informal mode.ping)
      %.y
    ?=(%live -.qos)
  ==
::
++  galaxy-down
  |=  galaxy=ship
  =/  m  (strand ,vase)
  ^-  form:m
  ;<  =qos:ames  bind:m  (get-qos galaxy)
  (post-result [%no-their-galaxy last-contact.qos])
--
