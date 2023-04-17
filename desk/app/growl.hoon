/+  default-agent, verb, dbug
::
|%
+$  card  card:agent:gall
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 enabled=?]
--
::
::  This agent should eventually go into landscape
::
=|  state-0
=*  state  -
%-  agent:dbug
%+  verb  |
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
++  on-init
  :_  this(enabled %.n)
  ~[[%pass /hark %agent [our.bowl %hark] %watch /ui]]
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+  mark  (on-poke:def mark vase)
      %enable
    `this(enabled %.y)
      %disable
    `this(enabled %.n)
  ==
++  on-watch  on-watch:def
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?+  wire  (on-agent:def wire sign)
      [%hark ~]
    ?-  -.sign
        %poke-ack   `this
        %watch-ack  `this
        %kick
      :_  this
      ~[[%pass /hark %agent [our.bowl %hark] %watch /ui]]
        %fact
      ::  TODO
      `this
    ==
  ==
++  on-fail
  |=  [=term =tang]
  (mean ':sub +on-fail' term tang)
++  on-leave
  |=  =path
  `this
++  on-save  !>(state)
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
      %0
    `this(state old)
  ==
++  on-arvo  on-arvo:def
++  on-peek  on-peek:def
--
