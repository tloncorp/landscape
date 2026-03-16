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
|^
  ::  sponsored-target check: only evaluate path to target and sponsor chain
  ::  (skip global DNS/local-galaxy diagnostics used by generic checks)
  ;<  ~  bind:m  (update-status [%trying-target ~])
  ;<  chek=(unit)  bind:m  (check-online target target-timeout:vitals)
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
  ;<  ~  bind:m  (update-status [%trying-sponsor sponsor])
  ;<  live=(unit ?)  bind:m  (ask-sponsor sponsor)
  ?~  live
    ?:  =(sponsor our)
      (post-result [%no-sponsor-miss sponsor])
    $(sponsors t.sponsors)
  ?:  u.live
    ?:  =(sponsor our)
      (post-result [%yes ~])
    $(sponsors t.sponsors)
  (post-result [%no-sponsor-miss sponsor])
::
++  galaxy-reachable
  |=  [=ping:vitals =qos:ames]
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
++  update-status
  |=  =pending:vitals
  =/  m  (strand ,~)
  ^-  form:m
  ;<  now=@da  bind:m  get-time:io
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
  ;<  now=@da  bind:m  get-time:io
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
