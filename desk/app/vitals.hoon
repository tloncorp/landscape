/+  default-agent, verb-lib=verb, dbug
^-  agent:gall
=>
  |%
  +$  card  card:agent:gall
  +$  current-state
    $:  %0
    ==
  --
=|  current-state
=*  state  -
=<
  %+  verb-lib  |
  %-  agent:dbug
  |_  =bowl:gall
  +*  this  .
      def   ~(. (default-agent this %|) bowl)
      cor   ~(. +> [bowl ~])
  ++  on-init
    ^-  (quip card _this)
    =^  cards  state
      abet:init:cor
    [cards this]
  ::
  ++  on-save  !>(state)
  ++  on-load
    |=  =vase
    ^-  (quip card _this)
    =^  cards  state
      abet:(load:cor vase)
    [cards this]
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card _this)
    =^  cards  state
      abet:(poke:cor mark vase)
    [cards this]
  ++  on-watch
    |=  =path
    ^-  (quip card _this)
    =^  cards  state
      abet:(watch:cor path)
    [cards this]
  ::
  ++  on-peek   peek:cor
  ::
  ++  on-leave   on-leave:def
  ++  on-fail    on-fail:def
  ::
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    =^  cards  state
      abet:(agent:cor wire sign)
    [cards this]
  ++  on-arvo
    |=  [=wire sign=sign-arvo]
    ^-  (quip card _this)
    =^  cards  state
      abet:(arvo:cor wire sign)
    [cards this]
  --
|_  [=bowl:gall cards=(list card)]
++  abet  [(flop cards) state]
++  cor   .
++  emit  |=(=card cor(cards [card cards]))
++  emil  |=(caz=(list card) cor(cards (welp (flop caz) cards)))
++  give  |=(=gift:agent:gall (emit %give gift))
++  init
  ^+  cor
  cor
::  +load: load next state
++  load
  |=  =vase
  ^+  cor
  =+  !<(old=current-state vase)
  cor(state old)
::
++  poke
  |=  [=mark =vase]
  |^  ^+  cor
  ?+    mark  ~|(bad-poke/mark !!)
      %noun  cor
  ==
  --
::
++  watch
  |=  =(pole knot)
  ^+  cor
  ?+    pole  ~|(bad-watch-path/path !!)
      [%imp ~]        ?>(from-self cor)
  ==
::
++  agent
  |=  [=(pole knot) =sign:agent:gall]
  ^+  cor
  ?+    pole  ~|(bad-agent-wire/pole !!)
      ~  cor
  ==
++  give-kick
  |=  [pas=(list path) =cage]
  =.  cor  (give %fact pas cage)
  (give %kick ~ ~)
++  arvo
  |=  [=wire sign=sign-arvo]
  ^+  cor
  ~&  arvo/wire
  cor
++  peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  [~ ~]
    ~  [~ ~]
  ::
  ==
::
:: ++  pass-hark
::   |=  [all=? desk=? =yarn:ha]
::   ^-  card
::   =/  =wire  /hark
::   =/  =dock  [our.bowl %hark]
::   =/  =cage  hark-action+!>([%add-yarn all desk yarn])
::   [%pass wire %agent dock %poke cage]
:: ++  spin
::   |=  [=rope:ha con=(list content:ha) wer=path but=(unit button:ha)]
::   ^-  yarn:ha
::   =/  id  (end [7 1] (shax eny.bowl))
::   [id rope now.bowl con wer but]
++  from-self  =(our src):bowl
:: ++  ca-core
::   |_  [=flag:c =chat:c gone=_|]
::   +*  ca-pact  ~(. pac pact.chat)
::   ++  ca-core  .
::   ::  TODO: archive??
::   ++  ca-abet
::     %_  cor
::         chats
::       ?:(gone (~(del by chats) flag) (~(put by chats) flag chat))
::     ==
::   ++  ca-abed
::     |=  f=flag:c
::     ca-core(flag f, chat (~(got by chats) f))
::   ++  ca-area  `path`/chat/(scot %p p.flag)/[q.flag]
::   ::  TODO: add metadata
::   ::        maybe delay the watch?
::   ++  ca-import
::     |=  [writers=(set ship) =association:met:c]
::     ^+  ca-core
::     =?  ca-core  ?=(%sub -.net.chat)
::       ca-sub
::     (ca-remark-diff read/~)
::   ::
::   ++  ca-spin
::     |=  [rest=path con=(list content:ha) but=(unit button:ha)]
::     =*  group  group.perm.chat
::     =/  =nest:g  [dap.bowl flag]
::     =/  rope  [`group `nest q.byk.bowl (welp /(scot %p p.flag)/[q.flag] rest)]
::     =/  link
::       (welp /groups/(scot %p p.group)/[q.group]/channels/chat/(scot %p p.flag)/[q.flag] rest)
::     (spin rope con link but)
::   ::
::   ++  ca-watch
::     |=  =(pole knot)
::     ^+  ca-core
::     ?+    pole  !!
::         [%updates rest=*]  (ca-pub rest.pole)
::         [%ui ~]            ?>(from-self ca-core)
::         [%ui %writs ~]     ?>(from-self ca-core)
::     ::
::         [%said ship=@ time=@ *]
::       =/  =ship  (slav %p ship.pole)
::       =/  =time  (slav %ud time.pole)
::       (ca-said ship time)
::     ::
::     ==
::   ::
::   ++  ca-hook
::     |=  wer=path
::     ?>  (ca-can-read src.bowl)
::     ?>  ?=([@ ~] wer)
::     =/  time=@   (slav %ud i.wer)
::     =.  cor  (give-kick ~ %chat-said !>([flag (got:on:writs:c wit.pact.chat time)]))
::     ca-core
::   ::
::   ++  ca-said
::     |=  =id:c
::     ^+  ca-core
::     ?.  (ca-can-read src.bowl)
::       =.  cor  (give-kick ~ chat-denied+!>(~))
::       ca-core
::     =/  [=time =writ:c]  (got:ca-pact id)
::     =.  cor  (give-kick ~ %chat-said !>([flag writ]))
::     ca-core
::   ::
::   ++  ca-upgrade
::     ^+  ca-core
::     ?.  ?=(%sub -.net.chat)  ca-core
::     ?.  ?=(%dex -.saga.net.chat)  ca-core
::     ?.  =(okay ver.saga.net.chat)
::       %-  (note:wood %ver leaf/"%future-shock {<[ver.saga.net.chat flag]>}" ~)
::       ca-core
::     ca-make-chi
::   ::
::   ++  ca-pass
::     |%
::     ++  writer-sect
::       |=  [ships=(set ship) =association:met:c]
::       =/  =sect:g
::         (rap 3 %chat '-' (scot %p p.flag) '-' q.flag ~)
::       =/  title=@t
::         (rap 3 'Writers: ' title.metadatum.association ~)
::       =/  desc=@t
::         (rap 3 'The writers role for the ' title.metadatum.association ' chat' ~)
::       %+  poke-group  %import-writers
::       :+  group.association   now.bowl
::       [%cabal sect %add title desc '' '']
::     ::
::     ++  poke-group
::       |=  [=term =action:g]
::       ^+  ca-core
::       =/  =dock      [our.bowl %groups]  :: XX: which ship?
::       =/  =wire      (snoc ca-area term)
::       =.  cor
::         (emit %pass wire %agent dock %poke group-action-0+!>(action))
::       ca-core
::     ::
::     ++  create-channel
::       |=  [=term group=flag:g =channel:g]
::       ^+  ca-core
::       =/  =nest:g  [dap.bowl flag]
::       (poke-group term group now.bowl %channel nest %add channel)
::     ::
::     ++  import-channel
::       |=  =association:met:c
::       =/  meta=data:meta:g
::         [title description '' '']:metadatum.association
::       (create-channel %import group.association meta now.bowl zone=%default %| ~)
::     ::
::     ++  add-channel
::       |=  req=create:c
::       %+  create-channel  %create
::       [group.req =,(req [[title description '' ''] now.bowl %default | readers])]
::     --
::   ++  ca-init
::     |=  req=create:c
::     =/  =perm:c  [writers.req group.req]
::     =.  cor
::       (give-brief flag/flag ca-brief)
::     =.  ca-core  (ca-update now.bowl %create perm *pact:c)
::     (add-channel:ca-pass req)
::   ::
::   ++  ca-agent
::     |=  [=(pole knot) =sign:agent:gall]
::     ^+  ca-core
::     ?+    pole  !!
::         ~  :: noop wire, should only send pokes
::       ca-core
::     ::
::         [%updates ~]
::       (ca-take-update sign)
::     ::
::         [%create ~]
::       ?>  ?=(%poke-ack -.sign)
::       %.  ca-core  :: TODO rollback creation if poke fails?
::       ?~  p.sign  same
::       (slog leaf/"poke failed" u.p.sign)
::     ::
::         [%import ~]
::       ?>  ?=(%poke-ack -.sign)
::       ?~  p.sign
::         ca-core
::       %-  (slog u.p.sign)
::       :: =.  cor  (emit %pass /pyre %pyre leaf/"Failed group import" u.p.sign)
::       ca-core
::     ::
::     ==
::   ::
::   ++  ca-brief  (brief:ca-pact our.bowl last-read.remark.chat)
::   ::
::   ++  ca-peek
::     |=  =(pole knot)
::     ^-  (unit (unit cage))
::     ?+  pole  [~ ~]
::       [%writs rest=*]  (peek:ca-pact rest.pole)
::       [%perm ~]        ``chat-perm+!>(perm.chat)
::     ==
::   ::
::   ++  ca-revoke
::     |=  her=ship
::     %+  roll  ~(tap in ca-subscriptions)
::     |=  [[=ship =path] ca=_ca-core]
::     ?.  =(ship her)  ca
::     ca(cor (emit %give %kick ~[path] `ship))
::   ::
::   ++  ca-recheck
::     %+  roll  ~(tap in ca-subscriptions)
::     |=  [[=ship =path] ca=_ca-core]
::     ?:  (ca-can-read:ca ship)  ca
::     ca(cor (emit %give %kick ~[path] `ship))
::   ::
::   ++  ca-take-update
::     |=  =sign:agent:gall
::     ^+  ca-core
::     ?+    -.sign  ca-core
::         %kick
::       ?>  ?=(%sub -.net.chat)
::       ?:  =(%chi -.saga.net.chat)
::         %-  (note:wood %ver leaf/"chi-kick: {<flag>}" ~)
::         ca-sub
::       %-  (note:wood %ver leaf/"wait-kick: {<flag>}" ~)
::       ca-core
::     ::
::         %watch-ack
::       =.  net.chat  [%sub src.bowl & %chi ~]
::       ?~  p.sign  ca-core
::       %-  (slog leaf/"Failed subscription" u.p.sign)
::       ::  =.  gone  &
::       ca-core
::     ::
::         %fact
::       =*  cage  cage.sign
::       ?+  p.cage  (ca-odd-update p.cage)
::         %epic                           (ca-take-epic !<(epic:e q.cage))
::         ?(%chat-logs %chat-logs-0)      (ca-apply-logs !<(logs:c q.cage))
::         ?(%chat-update %chat-update-0)  (ca-update !<(update:c q.cage))
::       ==
::     ==
::   ::
::   ++  ca-odd-update
::     |=  =mark
::     ?.  (is-old:epos mark)
::       ca-core
::     ?.  ?=(%sub -.net.chat)
::       ca-core
::     ca-make-lev
::   ::
::   ++  ca-make-lev
::     ?.  ?=(%sub -.net.chat)
::        ca-core
::     %-  (note:wood %ver leaf/"took lev epic: {<flag>}" ~)
::     =.  saga.net.chat  lev/~
::     =.  cor  (watch-epic p.flag)
::     ca-core
::   ::
::   ++  ca-make-chi
::     ?.  ?=(%sub -.net.chat)  ca-core
::     %-  (note:wood %ver leaf/"took okay epic: {<flag>}" ~)
::     =.  saga.net.chat  chi/~
::     ?:  ca-has-sub  ca-core
::     ca-sub
::   ::
::   ++  ca-take-epic
::     |=  her=epic:e
::     ^+  ca-core
::     ?>  ?=(%sub -.net.chat)
::     ?:  =(her okay)
::       ca-make-chi
::     ?:  (gth her okay)
::       =.  saga.net.chat  dex/her
::       %-  (note:wood %ver leaf/"took dex epic: {<[flag her]>}" ~)
::       ca-core
::     ca-make-lev
::   ::
::   ++  ca-proxy
::     |=  =update:c
::     ^+  ca-core
::     ?>  ca-can-write
::     =/  =dock  [p.flag dap.bowl]
::     =/  =cage  [act:mar !>([flag update])]
::     =.  cor
::       (emit %pass ca-area %agent dock %poke cage)
::     ca-core
::   ::
::   ++  ca-groups-scry
::     =*  group  group.perm.chat
::     /(scot %p our.bowl)/groups/(scot %da now.bowl)/groups/(scot %p p.group)/[q.group]
::   ::
::   ++  ca-can-write
::     ?:  =(p.flag src.bowl)  &
::     =/  =path
::       %+  welp  ca-groups-scry
::       /channel/[dap.bowl]/(scot %p p.flag)/[q.flag]/can-write/(scot %p src.bowl)/noun
::     =+  .^(write=(unit [bloc=? sects=(set sect:g)]) %gx path)
::     ?~  write  |
::     =/  perms  (need write) 
::     ?:  |(bloc.perms =(~ writers.perm.chat))  &
::     !=(~ (~(int in writers.perm.chat) sects.perms))
::   ::
::   ++  ca-can-read
::     |=  her=ship
::     =/  =path
::       %+  welp  ca-groups-scry
::       /channel/[dap.bowl]/(scot %p p.flag)/[q.flag]/can-read/(scot %p her)/loob
::     .^(? %gx path)
::   ::
::   ++  ca-pub
::     |=  =path
::     ^+  ca-core
::     ?>  (ca-can-read src.bowl)
::     =/  =logs:c
::       ?~  path  log.chat
::       =/  =time  (slav %da i.path)
::       (lot:log-on:c log.chat `time ~)
::     =/  =cage  chat-logs+!>(logs)
::     =.  cor  (give %fact ~ cage)
::     ca-core
::   ::
::   ++  ca-safe-sub
::     ?:  |(ca-has-sub =(our.bowl p.flag))
::       ca-core
::     ca-sub
::   ::
::   ++  ca-has-sub
::     ^-  ?
::     (~(has by wex.bowl) [(snoc ca-area %updates) p.flag dap.bowl])
::   ::
::   ++  ca-sub
::     ^+  ca-core
::     =/  tim=(unit time)
::       (bind (ram:log-on:c log.chat) head)
::     =/  base=wire  (snoc ca-area %updates)
::     =/  =path
::       %+  weld  base
::       ?~  tim  ~
::       /(scot %da u.tim)
::     =/  =card
::       [%pass base %agent [p.flag dap.bowl] %watch path]
::     =.  cor  (emit card)
::     ca-core
::   ++  ca-join
::     |=  j=join:c
::     ^+  ca-core
::     =.  chats  (~(put by chats) chan.j *chat:c)
::     =.  ca-core  (ca-abed chan.j)
::     =.  last-read.remark.chat  now.bowl
::     =.  group.perm.chat  group.j
::     =.  cor  (give-brief flag/flag ca-brief)
::     ca-sub
::   ::
::   ++  ca-leave
::     =/  =dock  [p.flag dap.bowl]
::     =/  =wire  (snoc ca-area %updates)
::     =.  cor  (emit %pass wire %agent dock %leave ~)
::     =.  cor  (emit %give %fact ~[/briefs] chat-leave+!>(flag))
::     =.  gone  &
::     ca-core
::   ::
::   ++  ca-apply-logs
::     |=  =logs:c
::     ^+  ca-core
::     =/  updates=(list update:c)
::       (tap:log-on:c logs)
::     %+  roll  updates
::     |=  [=update:c ca=_ca-core]
::     (ca-update:ca update)
::   ::
::   ++  ca-subscriptions
::     %+  roll  ~(val by sup.bowl)
::     |=  [[=ship =path] out=(set [ship path])]
::     ?.  =((scag 4 path) (snoc ca-area %updates))
::       out
::     (~(put in out) [ship path])
::   ::
::   ++  ca-give-updates
::     |=  [=time d=diff:c]
::     ^+  ca-core
::     =/  paths=(set path)
::       %-  ~(gas in *(set path))
::       (turn ~(tap in ca-subscriptions) tail)
::     =.  paths  (~(put in paths) (snoc ca-area %ui))
::     =/  cag=cage  [upd:mar !>([time d])]
::     =.  cor
::       (give %fact ~(tap in paths) cag)
::     =.  cor  (give %fact ~[/ui] act:mar !>([flag [time d]]))
::     =?  cor  ?=(%writs -.d)
::       =/  =cage  writ-diff+!>(p.d)
::       (give %fact ~[(welp ca-area /ui/writs)] writ-diff+!>(p.d))
::     ca-core
::   ::
::   ++  ca-remark-diff
::     |=  diff=remark-diff:c
::     ^+  ca-core
::     =.  cor
::       (give %fact ~[(snoc ca-area %ui)] chat-remark-action+!>([flag diff]))
::     =.  remark.chat
::       ?-  -.diff
::         %watch    remark.chat(watching &)
::         %unwatch  remark.chat(watching |)
::         %read-at  !! ::  ca-core(last-read.remark.chat p.diff)
::       ::
::           %read
::       =/  =time
::         (fall (bind (ram:on:writs:c wit.pact.chat) head) now.bowl)
::       remark.chat(last-read `@da`(add time (div ~s1 100)))  ::  greater than last
::       ==
::     =.  cor
::       (give-brief flag/flag ca-brief)
::     ca-core
::   ::
::   ++  ca-update
::     |=  [=time d=diff:c]
::     ?>  ca-can-write
::     ^+  ca-core
::     =.  log.chat
::       (put:log-on:c log.chat time d)
::     =.  ca-core
::       (ca-give-updates time d)
::     ?-    -.d
::         %add-sects
::       =*  p  perm.chat
::       =.  writers.p  (~(uni in writers.p) p.d)
::       ca-core
::     ::
::         %del-sects
::       =*  p  perm.chat
::       =.  writers.p  (~(dif in writers.p) p.d)
::       ca-core
::     ::
::         %create
::       =.  perm.chat  p.d
::       =.  pact.chat  q.d
::       ca-core
::     ::
::         %writs
::       =*  delta  q.p.d
::       =.  pact.chat  (reduce:ca-pact time p.d)
::       ?-  -.delta
::           ?(%del %add-feel %del-feel)  ca-core
::           %add
::         =/  memo=memo:c  p.delta
::         =?  remark.chat  =(author.memo our.bowl)  
::           remark.chat(last-read `@da`(add now.bowl (div ~s1 100)))
::         =.  cor  (give-brief flag/flag ca-brief)
::         ?-  -.content.memo
::             %notice  ca-core
::             %story
::           ?.  ?&  !=(author.memo our.bowl)
::                   |(!=(~ replying.memo) (mentioned q.p.content.memo our.bowl))
::               ==
::             ca-core
::           ?:  (mentioned q.p.content.memo our.bowl)
::             =/  yarn  (ca-mention-hark memo p.content.memo p.p.d)
::             =.  cor  (emit (pass-hark & & yarn))
::             ca-core
::           =/  replying  (need replying.memo)
::           =/  op  (~(get pac pact.chat) replying)
::           ?~  op  ca-core
::           =/  opwrit  writ.u.op
::           =/  in-replies
::             %+  lien
::               ~(tap in replied.opwrit)
::             |=  =id:c
::             =/  writ  (~(get pac pact.chat) id)
::             ?~  writ  %.n
::             =(author.writ.u.writ our.bowl)
::           ?:  &(!=(author.opwrit our.bowl) !in-replies)  ca-core
::           ?-  -.content.opwrit
::               %notice  ca-core
::               %story
::             =/  yarn
::               %^  ca-spin
::                 /message/(scot %p p.replying)/(scot %ud q.replying)
::                 :~  [%ship author.memo]
::                     ' replied to your message “'
::                     (flatten q.p.content.opwrit)
::                     '”: '
::                     [%ship author.memo]
::                     ': '
::                     (flatten q.p.content.memo)
::                 ==
::               ~
::             =.  cor  (emit (pass-hark & & yarn))
::             ca-core
::           ==
::         ==
::       ==
::     ==
::   ::
::   ++  ca-mention-hark
::     |=  [=memo:c =story:c op=id:c]
::     %^  ca-spin
::       ?~  replying.memo
::         /op/(scot %p p.op)/(scot %ud q.op)
::       =/  id  u.replying.memo
::       /message/(scot %p p.id)/(scot %ud q.id)/op/(scot %p p.op)/(scot %ud q.op)
::       :~  [%ship author.memo]
::           ' mentioned you :'
::           (flatten q.story)
::       ==
::     ~  
::   --
--
