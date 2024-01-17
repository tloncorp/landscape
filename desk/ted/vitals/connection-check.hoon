::  XX: As an alternative implementation, we could perform these checks (mostly)
::      in parallel. In that case, we shouldn't return immediately when a check
::      completes, but instead record the results and then check them after some
::      timeout (e.g. 30s).
::
/-  spider, vitals
/+  io=strandio, lib-vitals=vitals
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=+  !<([~ target=ship] arg)
;<  our=@p  bind:m  get-our:io
;<  now=@da  bind:m  get-time:io
|^
  ::  early exit; check if we have live path to target
  ;<  tqos=qos:ames  bind:m  (get-qos target)
  ?:  ?&  ?=(%live -.tqos)
          (gth last-contact.tqos (sub now info-timeout:vitals))
      ==
    (post-result [%yes ~])
  ::  set pending to %trying-dns
  ::  XX: can we use the strand cards for these?
  ;<  ~  bind:m  (update-status [%trying-dns ~])
  ::  check if we can fetch example.com
  ;<  ~  bind:m  (send-request:io [%'GET' 'http://example.com' ~ ~])
  ;<  =client-response:iris  bind:m  take-client-response:io
  ?.  ?&  ?=(%finished -.client-response)
          =(200 status-code.response-header.client-response)
      ==
    (post-result [%no-dns ~])
  ::  set pending to %trying-local
  ;<  ~  bind:m  (update-status [%trying-local ~])
  ::  check if we can contact our own galaxy
  ;<  gqos=qos:ames  bind:m  (scry:io qos:ames ~[%gx %vitals %galaxy %vitals-qos])
  ?.  ?=(%live -.gqos)
    (post-result [%no-our-galaxy last-contact.gqos])
  ::  set pending to %trying-target
  ;<  ~  bind:m  (update-status [%trying-target ~])
  ::  check if we can contact target (with timeout)
  ;<  chek=(unit)  bind:m  (check-online target target-timeout:vitals)
  ?:  ?=([%$ %$] chek)
    (post-result [%yes ~])
  ::  if we're a moon, check if we can contact our planet
  ::
  ::  NN: failing to contact our sponsor is only a failure condition for moons,
  ::      since currently only moons receive additional routing help from their
  ::      sponsors
  ::  NN: we do this after the initial target check because if we're a moon and
  ::      our planet is down, it's useful to talk to ships that still have live
  ::      wires (e.g. for troubleshooting); thus, by waiting to perform this
  ::      check, we don't report %no-our-planet for every connectivity check
  ::      when attempting to track down a live peer from whom to seek help
  ::
  ;<    sqos=qos:ames
      bind:m
    =/  mm  (strand ,qos:ames)
    ^-  form:mm
    ?.  ?=(%earl (clan:title our))
      (pure:mm [%live *@da])
    (scry:io qos:ames ~[%gx %vitals %sponsor %vitals-qos])
  ?.  ?=(%live -.sqos)
    (post-result [%no-our-planet last-contact.sqos])
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
  ;<  ~  bind:m  (update-status [%trying-sponsor i.sponsors])
  ::  ask sponsor if he has live wire to target
  ;<  live=(unit ?)  bind:m  (ask-sponsor i.sponsors)
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
++  update-status
  |=  =pending:vitals
  =/  m  (strand ,~)
  ^-  form:m
  %+  poke-our:io
    %vitals
  :-  %update-status
  !>
  ^-  update:vitals
  [target now %pending pending]
::  thread version of +scry-qos in /=landscape=/lib/vitals/hoon
++  get-qos
  |=  peer=ship
  =/  m  (strand ,qos:ames)
  ^-  form:m
  ?:  =(our peer)
    (pure:m [%live now])
  ;<  peers=(map ship ?(%alien %known))  bind:m
    (scry:io (map ship ?(%alien %known)) ~[%ax %$ %peers])
  ?.  (~(has by peers) peer)
    (pure:m [%unborn now])
  ;<  state=ship-state:ames  bind:m
    (scry:io ship-state:ames ~[%ax %$ %peers (scot %p peer)])
  (pure:m (simplify-qos:lib-vitals state))
++  galaxy-down
  |=  galaxy=ship
  =/  m  (strand ,vase)
  ^-  form:m
  ;<  =qos:ames  bind:m  (get-qos galaxy)
  (post-result [%no-their-galaxy last-contact.qos])
++  post-result
  |=  =complete:vitals
  =/  m  (strand ,vase)
  ^-  form:m
  (pure:m !>(complete))
++  ask-sponsor
  |=  sponsor=ship
  =/  m  (strand ,(unit ?))
  ^-  form:m
  %-  (handle-err ,?)
  %+  (set-timeout:io ,?)  target-timeout:vitals
  ::  XX: currently returns [~ |] if the sponsor doesn't have %vitals running
  ;<    ~
      bind:(strand ,?)
    %-  send-raw-card:io
    :*  %pass
        /poke
        %agent
        [sponsor %vitals]
        %poke
        %ship
        !>(target)
    ==
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
  ::
      [~ %agent * %poke-ack *]
    ?.  =(/poke wire.u.in.tin)
      `[%skip ~]
    ?~  p.sign.u.in.tin
      `[%done &]
    `[%done |]
  ==
++  check-online
  |=  [who=ship lag=@dr]
  =/  m  (strand ,(unit))
  ^-  form:m
  %-  (handle-err ,~)
  %+  (set-timeout:io ,~)  lag
  =/  n  (strand ,~)
  ;<  ~  bind:n  (poke:io [who %hood] %helm-hi !>(~))
  (pure:n ~)
++  handle-err
  |*  computation-result=mold
  =/  m  (strand ,(unit computation-result))
  =/  n  (strand ,computation-result)
  |=  computation=form:n
  ^-  form:m
  |=  tin=strand-input:strand
  =*  loop  $
  =/  c-res  (computation tin)
  ?+  -.next.c-res  c-res
    %cont  c-res(self.next ..loop(computation self.next.c-res))
    %fail  c-res(next [%done ~])
    %done  c-res(value.next (some value.next.c-res))
  ==
--
