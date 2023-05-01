/-  reel
/+  default-agent, verb, dbug, *reel
|%
+$  card  card:agent:gall
+$  versioned-state
  $%  state-0
      state-1
      state-2
  ==
::
::  vic: URL of bait service
::  civ: @p of bait service
::  our-metadata: map from tokens to their metadata
::  outstanding-pokes: ships we have poked and await a response from
::
+$  state-0
  $:  %0
      vic=@t
      civ=ship
      descriptions=(map cord cord)
  ==
+$  state-1
  $:  %1
      vic=@t
      civ=ship
      our-metadata=(map cord metadata:reel)
  ==
+$  state-2
  $:  %2
      vic=@t
      civ=ship
      our-metadata=(map cord metadata:reel)
      outstanding-pokes=(set (pair ship cord))
  ==
++  url-for-token
  |=  [vic=cord our=ship token=cord]
  (crip "{(trip vic)}{(trip (scot %p our))}/{(trip token)}")
--
=|  state-2
=*  state  -
::
%-  agent:dbug
%+  verb  |
|_  =bowl:gall
+*  this       .
    def        ~(. (default-agent this %|) bowl)
::
++  on-init
  ^-  (quip card _this)
  `this(vic 'https://tlon.network/lure/', civ ~loshut-lonreg)
::
++  on-save  !>(state)
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
      %2
    `this(state old)
      %1
    `this(state [%2 'https://tlon.network/lure/' ~loshut-lonreg ~ ~])
      %0
    `this(state [%2 'https://tlon.network/lure/' ~loshut-lonreg ~ ~])
  ==
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+    mark  (on-poke:def mark vase)
      %reel-command
    ?>  =(our.bowl src.bowl)
    =+  !<(=command:reel vase)
    ?-  -.command
        %set-service
      :_  this(vic vic.command)
      ~[[%pass /set-ship %arvo %k %fard q.byk.bowl %reel-set-ship %noun !>(vic.command)]]
        %set-ship
      :_  this(civ civ.command)
      %+  turn  ~(tap by our-metadata)
      |=  [token=cord =metadata:reel]
      ^-  card
      [%pass /describe %agent [civ %bait] %poke %bait-describe !>([token metadata])]
    ==
  ::
      %reel-bite
    =+  !<(=bite:reel vase)
    [[%give %fact ~[/bites] mark !>(bite)]~ this]
  ::
      %reel-describe
    =+  !<([token=cord =metadata:reel] vase)
    :_  this(our-metadata (~(put by our-metadata) token metadata))
    ~[[%pass /describe %agent [civ %bait] %poke %bait-describe !>([token metadata])]]
      %reel-undescribe
    =+  !<(token=cord vase)
    :_  this(our-metadata (~(del by our-metadata) token))
    ~[[%pass /undescribe %agent [civ %bait] %poke %bait-undescribe !>(token)]]
      %reel-want-token-link
    =+  !<(token=cord vase)
    :_  this
    =/  result=(unit [cord cord])
      ?.  (~(has by our-metadata) token)  ~
      `[token (url-for-token vic our.bowl token)]
    ~[[%pass [%token-link-want token ~] %agent [src.bowl %reel] %poke %reel-give-token-link !>(result)]]
      %reel-give-token-link
    =+  !<(result=(unit [cord cord]) vase)
    ?~  result  `this
    =/  [token=cord url=cord]  u.result
    :_  this
    ~[[%give %fact ~[[%token-link (scot %p src.bowl) token ~]] %json !>(s+url)]]
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?:  ?=([%token-link @ @ ~] wire)
    ?+  -.sign  (on-agent:def wire sign)
        %poke-ack
      `this(outstanding-pokes (~(del in outstanding-pokes) [src.bowl i.t.t.wire]))
    ==
  (on-agent:def wire sign)
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?>  =(our.bowl src.bowl)
  ?+  path  (on-watch:def path)
    [%bites ~]  `this
      [%token-link @ @ ~]
    =/  target  (slav %p i.t.path)
    =/  group   i.t.t.path
    ?~  (~(has in outstanding-pokes) [target group])  `this
    :_  this(outstanding-pokes (~(put in outstanding-pokes) [target group]))
    ~[[%pass path %agent [target %reel] %poke %reel-want-token-link !>(group)]]
  ==
::
++  on-leave  on-leave:def
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  [~ ~]
    [%x %service ~]  ``noun+!>(vic)
    [%x %bait ~]  ``reel-bait+!>([vic civ])
    ::
      [%x %outstanding-poke @ @ ~]
    ``json+!>([%b (~(has in outstanding-pokes) [(slav %p i.t.t.path) i.t.t.t.path])])
    ::
      [%x %metadata @ ~]
    =/  =metadata:reel  (fall (~(get by our-metadata) i.t.t.path) *metadata:reel)
    ``reel-metadata+!>(metadata)
  ==
::
++  on-arvo
  |=  [=wire sign=sign-arvo]
  ^-  (quip card:agent:gall _this)
  ?>  ?=([%set-ship ~] wire)
  ?>  ?=([%khan %arow *] sign)
  ?:  ?=(%.n -.p.sign)
    ((slog 'reel: fetch bait ship failed' p.p.sign) `this)
  `this
++  on-fail   on-fail:def
--
