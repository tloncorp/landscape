/-  vitals, spider
/+  io=strandio
|%
++  simplify-qos
  |=  =ship-state:ames
  ^-  qos:ames
  ?-  -.ship-state
    %alien  [%dead *@da]
    %known  ?+  -.qos.ship-state  qos.ship-state
              %unborn   [%dead last-contact.qos.ship-state]
  ==        ==
::
++  scry-qos
  |=  [=ship =time peer=ship]
  ^-  qos:ames
  ::  a ship is not guaranteed by %ames to know itself, so we fake it
  ?:  =(ship peer)
    [%live time]
  ::  .^(* /ax/=//=/peers/[peer]) crashes if the peer is unknown, so we
  ::  check the source map beforehand and fake an %unborn if we can see
  ::  a crash coming
  =/  ames-peers=path  /ax/(scot %p ship)//(scot %da time)/peers
  =/  peers  .^((map ^ship ?(%alien %known)) ames-peers)
  ?.  (~(has by peers) peer)
    [%unborn time]
  =/  pqos  .^(ship-state:ames (snoc ames-peers (scot %p peer)))
  (simplify-qos pqos)
::
::  thread helpers ::::::::::::::::::::::::::::::::::::
::
::  thread version of +scry-qos
++  get-qos
  |=  peer=ship
  =/  m  (strand:spider ,qos:ames)
  ^-  form:m
  ;<  our=@p  bind:m  get-our:io
  ;<  now=@da  bind:m  get-time:io
  ?:  =(our peer)
    (pure:m [%live now])
  ;<  peers=(map ship ?(%alien %known))  bind:m
    (scry:io (map ship ?(%alien %known)) ~[%ax %$ %peers])
  ?.  (~(has by peers) peer)
    (pure:m [%unborn now])
  ;<  state=ship-state:ames  bind:m
    (scry:io ship-state:ames ~[%ax %$ %peers (scot %p peer)])
  (pure:m (simplify-qos state))
::
++  update-status
  |=  [target=ship =pending:vitals]
  =/  m  (strand:spider ,~)
  ^-  form:m
  ;<  now=@da  bind:m  get-time:io
  %+  poke-our:io
    %vitals
  :-  %update-status
  !>
  ^-  update:vitals
  [target now %pending pending]
::
++  post-result
  |=  =complete:vitals
  =/  m  (strand:spider ,vase)
  ^-  form:m
  (pure:m !>(complete))
::
++  ask-sponsor
  |=  [sponsor=ship target=ship]
  =/  m  (strand:spider ,(unit ?))
  ^-  form:m
  %-  (handle-err ,?)
  %+  (set-timeout:io ,?)  target-timeout:vitals
  ::  XX: currently returns [~ |] if the sponsor doesn't have %vitals running
  ;<    ~
      bind:(strand:spider ,?)
    %-  send-raw-card:io
    :*  %pass
        /poke
        %agent
        [sponsor %vitals]
        %poke
        %ship
        !>(target)
    ==
  |=  tin=strand-input:strand:spider
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
::
++  check-online
  |=  [who=ship lag=@dr]
  =/  m  (strand:spider ,(unit))
  ^-  form:m
  %-  (handle-err ,~)
  %+  (set-timeout:io ,~)  lag
  =/  n  (strand:spider ,~)
  ;<  ~  bind:n  (poke:io [who %ping] %noun !>(~))
  (pure:n ~)
::
++  handle-err
  |*  computation-result=mold
  =/  m  (strand:spider ,(unit computation-result))
  =/  n  (strand:spider ,computation-result)
  |=  computation=form:n
  ^-  form:m
  |=  tin=strand-input:strand:spider
  =*  loop  $
  =/  c-res  (computation tin)
  ?+  -.next.c-res  c-res
    %cont  c-res(self.next ..loop(computation self.next.c-res))
    %fail  c-res(next [%done ~])
    %done  c-res(value.next (some value.next.c-res))
  ==
--
