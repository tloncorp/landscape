/-  hark
/+  summarize, default-agent, verb, dbug
::
|%
+$  card  card:agent:gall
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 enabled=_| bark-host=_~rilfet-palsum]
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
      %noun
    =+  !<([m=@ n=*] vase)
    $(mark m, vase (need (slew 3 vase)))
  ::
      %set-host
    ?>  =(src.bowl our.bowl)
    `this(bark-host !<(ship vase))
      ::
      %enable
    :_  this(enabled %.y)
    ~[[%pass /add-recipient %agent [bark-host %bark] %poke %bark-add-recipient !>(our.bowl)]]
      ::
      %disable
    :_  this(enabled %.n)
    ~[[%pass /remove-recipient %agent [bark-host %bark] %poke %bark-remove-recipient !>(our.bowl)]]
      ::
      %growl-summarize
    ?.  enabled
      :_  this
      ~[[%pass /bark-summary %agent [bark-host %bark] %poke %bark-receive-summary !>(~)]]
    =/  requested  !<(time vase)
    =/  activity    ~(summarize-activity summarize [our now]:bowl)
    =/  inactivity  ~(summarize-inactivity summarize [our now]:bowl)
    :_  this
    ~[[%pass /bark-summary %agent [bark-host %bark] %poke %bark-receive-summary !>(`[requested %life activity inactivity])]]
  ==
++  on-watch  on-watch:def
++  on-agent  on-agent:def
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
