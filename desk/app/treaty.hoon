/-  docket
/+  *treaty, default-agent, agentio, verb, dbug
|%
++  default-ally  ~dister-dozzod-dozzod
::
+$  card  $+(card card:agent:gall)
+$  state-1
  $:  %1
      treaties=(map [=ship =desk] treaty)
      sovereign=(map desk treaty)
      entente=alliance
      =allies:ally
      versions=(map ship (each @ud (set desk)))  ::  known ver or pending subs
  ==
--
::
^-  agent:gall
%+  verb  |
%-  agent:dbug
^-  agent:gall
=|  state-1
=*  state  -
=<
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
    io    ~(. agentio bowl)
    pass  pass:io
    cc    ~(. +> bowl)
++  on-init
  ?:  =(our.bowl default-ally)  `this
  (on-poke %ally-update-0 !>([%add default-ally]))
++  on-save  !>(state)
++  on-load
  |=  =vase
  ^-  (quip card _this)
  |^  =/  old=state-any
        ::NOTE  v0 was untagged, so we must extract it carefully, $? no bueno
        ?:  ?|(?=([~ *] q.vase) ?=([^ *] -.q.vase))
          [%0 !<(state-0 vase)]
        !<(state-any vase)
      =^  caz  old
        ?:  ?=(%1 -.old)  [~ old]
        :_  (state-0-to-1 +.old)
        ;:  weld
          ::  kick incoming subscriptions so they reestablish their connection
          ::
          %-  drop
          =;  pas=(list path)
            ?:  =(~ pas)  ~
            (some [%give %kick pas ~])
          %+  turn
            %+  weld  ~(tap in ~(key by treaties.old))
            (turn ~(tap in ~(key by sovereign.old)) (lead our.bowl))
          |=([s=ship d=desk] /treaty/(scot %p s)/[d])
        ::
          ::  issue warps for bills and seals for things we publish
          ::
          ^-  (list card)
          %-  zing
          %+  turn  ~(tap in ~(key by sovereign))
          |=  =desk
          ^-  (list card)
          ~[warp-bill warp-seal]:~(. so:cc desk)
        ::
          ::  start version negotiation with everyone we're subscribed to
          ::
          %~  tap  in
          %+  roll  ~(tap by wex.bowl)
          |=  [[[=wire =ship =term] [acked=? =path]] cas=(set card)]
          ^+  cas
          ?.  =(term dap.bowl)  cas
          ?.  ?=([%treaty *] wire)  cas
          ?.  ?=([%treaty *] path)  cas
          %-  ~(put in cas)
          [%pass /version %agent [ship dap.bowl] %watch /version]
        ==
      ?>  ?=(%1 -.old)
      [caz this(state old)]
  ::
  +$  state-any  $%(state-1 [%0 state-0])
  ::
  +$  state-0
    $:  treaties=(map [=ship =desk] treaty-0:treaty)
        sovereign=(map desk treaty-0:treaty)
        entente=alliance
        =allies:ally
        direct=(set [=ship =desk])
    ==
  ::
  ++  state-0-to-1
    |=  state-0
    ^-  state-1
    :^  %1
        (~(run by treaties) treaty-0-to-1)
      (~(run by sovereign) treaty-0-to-1)
    [entente allies ~]
  --
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?>  (team:title [our src]:bowl)
  |^
  ?+  mark  (on-poke:def mark vase)
    %ally-update-0      (ally-update !<(update:ally vase))
    %alliance-update-0  (alliance-update !<(update:alliance vase))
  ::
      %noun
    =+  ;;([%add =desk] q.vase)
    =/  =treaty  (build-treaty:cc desk)
    =.  sovereign  (~(put by sovereign) desk treaty)
    `this  ::NOTE  this doesn't set up fully, use :treaty|publish instead
  ==
  ::
  ++  ally-update
    |=  =update:ally
    ^-  (quip card _this)
    =-  [[(ally-update:ca:cc update) -.-] +.-]
    ?<  ?=(?(%ini %new) -.update)
    =*  ship  ship.update
    ?<  =(ship our.bowl)
    =*  al   ~(. al:cc ship.update)
    ?-  -.update
      %add  [~[watch:al] this(allies (~(put by allies) ship *alliance))]
      %del  [~[leave:al] this(allies (~(del by allies) ship))]
    ==
  ::
  ++  alliance-update
    |=  =update:alliance
    ^-  (quip card _this)
    =-  [[(alliance-update:ca:cc update) -.-] +.-]
    ?+  -.update  !!
    ::
        %add
      =,  update
      =.  entente  (~(put in entente) [ship desk])
      ?.  =(our.bowl ship)  `this
      =*  so  ~(. so:cc desk)
      =/  =treaty  (build-treaty:cc desk)
      =.  sovereign  (~(put by sovereign) desk treaty)
      :_  this
      [publish warp-docket warp-bill warp-seal give]:so
    ::
        %del
      =,  update
      =.  entente  (~(del in entente) [ship desk])
      ?.  =(our.bowl ship)  `this
      =.  sovereign  (~(del by sovereign) desk)
      :_(this ~(kick so:cc desk)^~)
   ==
  --
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?+  path  (on-watch:def path)
    [%version ~]  [[(fact-init:io %atom !>(1))]~ this]
  ::
    ::  syncing
      [?(%treaty %treaty-1) @ @ ~]
    =/  =ship  (slav %p i.t.path)
    =*  desk   i.t.t.path
    =/  mage
      ?-  -.path
        %treaty    treaty-0:cg:cc
        %treaty-1  treaty:cg:cc
      ==
    ?:  =(our.bowl ship)
      :_  this
      [(fact-init:io (mage (~(got by sovereign) desk)))]~
    ?^  treat=(~(get by treaties) [ship desk])
      :_  this
      [(fact-init:io (mage u.treat))]~
    ?>  =(our.bowl src.bowl)
    :_(this (drop ~(safe-watch tr:cc [ship desk])))
    ::
      [%treaties ~]
    :_  this
    ::NOTE  this assumes that all treaties in sovereign are also
    ::      present in the treaties map
    (fact-init:io (treaty-update-0:cg:cc %ini treaties))^~
    ::
      [%treaties-1 ~]
    :_  this
    ::NOTE  this assumes that all treaties in sovereign are also
    ::      present in the treaties map
    (fact-init:io (treaty-update:cg:cc %ini treaties))^~
    ::
      [%alliance ~]
    :_  this
    (fact-init:io (alliance-update:cg:cc %ini entente))^~
    ::  local
    ::
      [%allies ~]
    :_  this
    (fact-init:io (ally-update:cg:cc %ini allies))^~
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  (on-peek:def path)
    [%x %alliance ~]      ``(alliance-update:cg:cc %ini entente)
    [%x %default-ally ~]  ``ship+!>(default-ally)
    [%x %allies ~]        ``(ally-update:cg:cc %ini allies)
  ::
     [%x %treaties @ ~]
    =/  =ship  (slav %p i.t.t.path)
    =/  alliance  (~(get ju allies) ship)
    =/  allied
      %-  ~(gas by *(map [^ship desk] treaty))
      %+  skim  ~(tap by treaties)
      |=  [ref=[^ship desk] =treaty]
      (~(has in alliance) ref)
    ``(treaty-update:cg:cc %ini allied)
  ::
      [%x %treaty @ @ ~]
    =/  =ship  (slav %p i.t.t.path)
    =*  desk   i.t.t.t.path
    ``(treaty:cg:cc (~(got by treaties) [ship desk]))
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  =*  ship  src.bowl
  |^
  ?+  wire  (on-agent:def wire sign)
    [%ally @ ~]  ?>(=(ship (slav %p i.t.wire)) take-ally)
  ::
      [?(%treaty %treaty-1) @ @ ~]
    =*  desk  i.t.t.wire
    ?>  =(ship (slav %p i.t.wire))
    (take-treaty i.wire desk)
  ::
      [%version ~]  ::  version negotiation
    ?+  -.sign  !!
      %kick  [[%pass /version %agent [src dap]:bowl %watch /version]~ this]
    ::
        %watch-ack
      ?~  p.sign  [~ this]
      ::  if the watch gets rejected, this means they're still on v0.
      ::  register them as such and send any pending subs as v0 ones.
      ::
      =/  des=(set desk)
        =+  v=(~(gut by versions) src.bowl [%| p=~])
        ?:(?=(%| -.v) p.v ~)
      :_  this(versions (~(put by versions) src.bowl &+0))
      %+  murn  ~(tap in des)
      |=(d=desk ~(safe-watch-0 tr:cc src.bowl d))
    ::
        %fact
      ?>  ?=(%atom p.cage.sign)
      =+  !<(v=atom q.cage.sign)
      ::  we are v1, so only understand v1 at most
      ::
      =.  v  (min v 1)
      ::  other versions won't happen, v0 had no version negotiation
      ::
      ?>  =(1 v)
      ::  find v0 subs and re-establish them as v1 subs
      ::
      :_  this(versions (~(put by versions) src.bowl &+v))
      %+  weld
        ^-  (list card)
        ::  establish any desired subscriptions
        ::
        =/  des=(set desk)
          =+  v=(~(gut by versions) src.bowl [%| p=~])
          ?:(?=(%| -.v) p.v ~)
        %+  murn  ~(tap in des)
        |=(d=desk ~(safe-watch tr:cc src.bowl d))
      ::  upgrade any existing v0 subscriptions
      ::
      ^-  (list card)
      %-  zing
      %+  turn  ~(tap by wex.bowl)
      |=  [[=^wire =^ship =term] [acked=? =path]]
      ^-  (list card)
      ?.  =(ship src.bowl)  ~
      ?.  =(term dap.bowl)  ~
      ?.  ?=([%treaty *] wire)  ~
      ?.  ?=([%treaty *] path)  ~
      =/  new=^^wire  wire(- %treaty-1)
      =/  nep=^path   path(- %treaty-1)
      :~  [%pass wire %agent [src dap]:bowl %leave ~]
          [%pass new %agent [src dap]:bowl %watch nep]
      ==
    ==
  ==
  ::
  ++  take-ally
    ^-  (quip card _this)
    ?+  -.sign  (on-agent:def wire sign)
    ::
        %kick
      ?.  (~(has by allies) ship)  `this
      :_(this ~[~(watch al:cc ship)])
    ::
        %watch-ack
      ?~  p.sign  (on-agent:def wire sign)
      =.  allies  (~(del by allies) ship)
      %-  (slog leaf+"Broke alliance with {<ship>}" u.p.sign)
      `this
    ::
        %fact
      ?.  =(%alliance-update-0 p.cage.sign)  `this
      =+  !<(=update:alliance q.cage.sign)
      =.  allies
        ?-  -.update
          %ini  (~(put by allies) src.bowl init.update)
          %add  (~(put ju allies) src.bowl [ship desk]:update)
          %del  (~(del ju allies) src.bowl [ship desk]:update)
        ==
      =^  cards  versions
        ^-  (quip card _versions)
        =/  v=(each @ud (set desk))
          (~(gut by versions) src.bowl |+~)
        ::  if we haven't done version negotiation yet,
        ::  start it if we haven't yet,
        ::  and queue up the desks we care about
        ::
        ?:  ?=(%| -.v)
          :-  ?:  (~(has by wex.bowl) /version [src dap]:bowl)  ~
              [%pass /version %agent [src dap]:bowl %watch /version]~
          =-  (~(put by versions) src.bowl |+-)
          ?-  -.update
            %ini  (~(uni in p.v) `(set desk)`(~(run in init.update) tail))
            %add  (~(put in p.v) desk.update)
            %del  (~(del in p.v) desk.update)
          ==
        ::  if we've netogiated a version already, establish subs with that
        ::
        :_  versions
        =/  w
          |=  [s=^ship d=desk]
          ?+  p.v  !!
            %0  ~(safe-watch-0 tr:cc s d)
            %1  ~(safe-watch tr:cc s d)
          ==
        ?-  -.update
          %ini  (murn ~(tap in init.update) w)
          %add  (drop (w [ship desk]:update))
          %del  [leave-0 leave ~]:~(. tr:cc [ship desk]:update)
        ==
      :_  this
      :_  cards
      (fact:io (ally-update:cg:cc %new ship (~(get ju allies) src.bowl)) /allies ~)
    ==
  ::
  ++  take-treaty
    |=  [version=?(%treaty %treaty-1) =desk]
    ^-  (quip card _this)
    =*  tr   ~(. tr:cc ship desk)
    ?+  -.sign  (on-agent:def wire sign)
    ::
    :: rewatch only if we aren't source
    :: this would cause a potential kick-rewatch loop otherwise
    ::
        %kick
      :_  this
      ?:  =(our.bowl ship)  ~
      ?:  ?=(%treaty-1 version)  [watch:tr]~
      ::  v0 subscription got kicked, which could indicate the host upgraded
      ::  to v1. we bring the v0 sub back, but also (re)try version negotiation
      ::
      :~  watch-0:tr
          [%pass /version %agent [src dap]:bowl %watch /version]
      ==
    ::
        %watch-ack
      ?~  p.sign
        [~ this]
      =.  treaties  (~(del by treaties) ship desk)
      %-  (slog leaf+"treaty: withdrew from {<ship>}/{<desk>}" u.p.sign)
      [gone:tr this]
    ::
        %fact
      =/  treaty=(unit treaty)
        ?+  p.cage.sign  ~
          %treaty-0  `(treaty-0-to-1 !<(treaty-0:treaty q.cage.sign))
          %treaty-1  `!<(treaty q.cage.sign)
        ==
      ?~  treaty  `this
      ?>  =([ship desk] [ship desk]:u.treaty)
      =.  treaties  (~(put by treaties) [ship desk]:u.treaty u.treaty)
      [give:tr this]
    ==
  --
::
++  on-arvo
  |=  [=wire sign=sign-arvo]
  |^  ^-  (quip card _this)
  ?+  wire  (on-arvo:def wire sign)
    [%init ~]  !! :: setup sponsor ally
  ::
      [%sovereign @ *]
    =*  desk  i.t.wire
    (take-sovereign t.t.wire desk)
  ==
  ::
  ++  take-sovereign
    |=  [=^wire =desk]
    =/  so  ~(. so:cc desk)
    ?>  ?=([?(%clay %behn) %writ *] sign)
    ?.  (~(has by sovereign) desk)  `this
    =*  riot  p.sign
    ?:  &(?=(~ riot) ?=(?(~ [%docket ~]) wire))
      ::  if the docket file is gone, we can no longer publish this desk
      ::
      =.  sovereign  (~(del by sovereign) desk)
      [~[kick:so] this]
    =/  =treaty  (~(got by sovereign) desk)
    =+  og=treaty
    ::  modify either the docket, bill or treaty,
    ::  depending on which one got updated
    ::
    =?  docket.treaty  ?=(?(~ [%docket ~]) wire)
      ?>  ?=(^ riot)
      =*  cage  r.u.riot
      ?>  =(%docket-0 p.cage)
      !<(docket:docket q.cage)
    =?  bill.treaty  ?=([%bill ~] wire)
      ?~  riot  ~
      =*  cage  r.u.riot
      ?>  =(%bill p.cage)
      !<(bill:clay q.cage)
    =?  seal.treaty  ?=([%seal ~] wire)
      ?~  riot  ~
      =*  cage  r.u.riot
      ?>  =(%seal p.cage)
      (sy +:!<([%0 (list perm:gall)] q.cage))
    ::TODO  this updates the hash of the whole desk, but is only run whenever
    ::      any of these files change. (previously, more coherently, only when
    ::      the docket file changed.) should we always have a %next %z request,
    ::      or just leave the hash out of treaties?
    =?  treaty  !=(og treaty)  (update-treaty:cc treaty)
    ::  save the changes, push out the update,
    ::  and request the next version of the file
    ::
    :_  this(sovereign (~(put by sovereign) desk treaty))
    :_  ?:(=(og treaty) ~ give:so)
    ?+  wire  ~|(wire !!)
      ?(~ [%docket ~])  warp-docket:so
      [%bill ~]         warp-bill:so
      [%seal ~]         warp-seal:so
    ==
  --

::
++  on-fail  on-fail:def
++  on-leave  on-leave:def
--
|_  =bowl:gall
++  io  ~(. agentio bowl)
++  pass  pass:io
::
++  build-treaty
  |=  =desk
  ^-  treaty
  =/  so  ~(. so desk)
  %:  update-treaty
    our.bowl
    desk
    *case
    *@uv
    get-docket:so
    get-bill:so
    get-seal:so
  ==
::
++  update-treaty
  |=  =treaty
  =+  .^(=cass:clay %cw (scry:io desk.treaty /))
  =+  .^(hash=@uv %cz (scry:io desk.treaty /))
  treaty(case da+da.cass, hash hash)
::  +al: Side effects for allies
++  al
  |_  =ship
  ++  pass    ~(. ^pass /ally/(scot %p ship))
  ++  watch   (watch:pass [ship dap.bowl] /alliance)
  ++  leave   (leave:pass ship dap.bowl)
  --
::  +cg: Cage construction
++  cg
  |%
  ++  ally-update      |=(=update:ally ally-update-0+!>(update))
  ++  alliance-update  |=(=update:alliance alliance-update-0+!>(update))
  ++  treaty  |=(t=^treaty treaty-1+!>(t))
  ++  treaty-0  |=(t=^treaty treaty-0+!>((treaty-1-to-0 t)))
  ++  treaty-update  |=(u=update:^treaty treaty-update-1+!>(u))
  ++  treaty-update-0  |=(u=update:^treaty treaty-update-0+!>((update-1-to-0 u)))
  --
::  +ca: Card construction
++  ca
  |%
  ++  watch-docket  (~(watch-our pass /docket) %docket /dockets)
  ++  ally-update  |=(=update:ally (fact:io (ally-update:cg update) /allies ~))
  ++  alliance-update
    |=(=update:alliance (fact:io (alliance-update:cg update) /alliance ~))
  --
::  +tr: engine for treaties
++  tr
  =/  version=term  %treaty-1
  |_  [=ship =desk]
  ++  pass  ~(. ^pass path)
  ++  path  /[version]/(scot %p ship)/[desk]
  ++  dock  [ship dap.bowl]
  ++  watch  (watch:pass dock path)
  ++  watch-0  watch(version %treaty)
  ++  watching  (~(has by wex.bowl) [path dock])
  ++  watching-0  watching(version %treaty)
  ++  safe-watch  `(unit card)`?:(|(watching =(our.bowl ship)) ~ `watch)
  ++  safe-watch-0  safe-watch(version %treaty)
  ++  leave  (leave:pass dock)
  ++  leave-0  leave(version %treaty)
  ++  gone
    ^-  (list card)
    :~  (fact:io (treaty-update:cg %del ship desk) /treaties-1 ~)
        (fact:io (treaty-update-0:cg %del ship desk) /treaties ~)
        (kick-only:io our.bowl path ~)
        (kick-only:io our.bowl path(version %treaty) ~)
    ==
  ++  give
    ^-  (list card)
    =/  t=treaty  (~(got by treaties) ship desk)
    :~  (fact:io (treaty-update:cg %add t) /treaties-1 ~)
        (fact:io (treaty-update-0:cg %add t) /treaties ~)
        (fact:io (treaty:cg t) path ~)
        (fact:io (treaty-0:cg t) path(version %treaty) ~)
    ==
  --
::  +so: engine for sovereign treaties
++  so
  =/  version=term  %treaty-1
  |_  =desk
  ++  wire  `^wire`/sovereign/[desk]
  ++  pass  ~(. ^pass wire)
  ++  path  /[version]/(scot %p our.bowl)/[desk]
  ++  get-docket  .^(docket:docket %cx (scry:io desk /desk/docket-0))
  ++  get-bill
    ^-  bill:clay
    ?.  .^(? %cu (scry:io desk /desk/bill))  ~
    .^(bill:clay %cx (scry:io desk /desk/bill))
  ++  get-seal
    ^-  pers:gall
    ?.  .^(? %cu (scry:io desk /desk/seal))  ~
    (sy +:.^([%0 (list perm:gall)] %cx (scry:io desk /desk/seal)))
  ++  warp-docket
    %+  ~(warp-our ^pass (snoc wire %docket))  desk
    `[%next %x da+now.bowl /desk/docket-0]
  ++  warp-bill
    %+  ~(warp-our ^pass (snoc wire %bill))  desk
    `[%next %x da+now.bowl /desk/bill]
  ++  warp-seal
    %+  ~(warp-our ^pass (snoc wire %seal))  desk
    `[%next %x da+now.bowl /desk/seal]
  ++  kick
    (kick:io path ~)
  ++  give
    ::  notably gives on the /treaties path, like +give:tr does.
    ::  this should not give duplicate facts, because sovereign treaties
    ::  are handled in this core, not as "normal"/foreign treaties.
    ::
    ^-  (list card)
    =/  t=treaty  (~(got by sovereign) desk)
    :~  (fact:io (treaty-update:cg %add t) /treaties-1 ~)
        (fact:io (treaty-update-0:cg %add t) /treaties ~)
        (fact:io (treaty:cg t) path ~)
        (fact:io (treaty-0:cg t) path(version %treaty) ~)
    ==
  ++  publish
    (arvo:pass %c %perm desk / [%r ~ %black ~])
  --
--
