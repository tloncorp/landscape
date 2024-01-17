::  This app provides a batteries-included view of your connectivity with any
::  ship.  An interface should be able to get all relevant information directly
::  from this app and display it to the user.  For this reason, it includes many
::  "pending" states and reasons for failure.
::
::  To access these statuses, subscribe to /ship/~sampel-palnet for each ship
::  you care about, and then send pokes of the form [%run-check ~sampel-palnet]
::  to kick off the connectivity check.
::
::  You can also scry to /ship/~sampel-palnet to get the latest information
::  (with timestamp), but you must poke to actively test the state. The special
::  scry paths /sponsor and /galaxy give immediate access to connectivity state
::  with our direct sponsor & galaxy, which will always be up-to-date (within
::  the last minute).
::
::  Internally, when we receive a %run-check poke, we start a thread to attempt
::  to contact that ship, and if it is taking too long, we will investigate and
::  report possible reasons.  As the thread progresses, it will give updates on
::  its investigation by poking the app with `%update-status`, and these updates
::  will immediately go out to subscribers.
::
::  TODO:
::    V: Replace foreign sponsor ack/nack with remote scry
::    W: Remote scry foreign sponsor child connection from Ames directly
::    X: Add ping to Ames connection state and surface to %vitals
::    Y: Register ships for regularly scheduled connectivity checks
::    Z: Replace legacy subscription with SSS
::
/-  v=vitals
/+  lib=vitals
/+  dbug, default-agent, verb
^-  agent:gall
=>
  |%
  +$  card  card:agent:gall
  +$  versioned-state  current-state
  +$  current-state
    $:  %0
        connections=(map ship result:v)
    ==
  --
=|  current-state
=*  state  -
=<
  %+  verb  |
  %-  agent:dbug
  |_  =bowl:gall
  +*  this  .
      def   ~(. (default-agent this %|) bowl)
      cor   ~(. +> [bowl ~])
  ++  on-init   on-init:def
  ::
  ++  on-save
    !>(state)
  ::
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
  ++  on-leave  on-leave:def
  ::
  ++  on-fail   on-fail:def
  ::
  ++  on-agent  on-agent:def
  ::
  ++  on-arvo
    |=  [=wire sign=sign-arvo]
    ^-  (quip card _this)
    =^  cards  state
      abet:(arvo:cor wire sign)
    [cards this]
  --
|_  [=bowl:gall cards=(list card)]
+*  our   our.bowl
    now   now.bowl
    src   src.bowl
++  cor   .
++  abet  [(flop cards) state]
++  emit  |=(=card cor(cards [card cards]))
++  emil  |=(caz=(list card) cor(cards (welp (flop caz) cards)))
++  give  |=(=gift:agent:gall (emit %give gift))
++  load
  |=  =vase
  =/  loaded-state  !<(versioned-state vase)
  ?-  -.loaded-state
    %0  cor(connections connections.loaded-state)
  ==
++  poke
  |=  [=mark =vase]
  ^+  cor
  ?+    mark  ~|([%bad-mark mark] !!)
  ::
  ::  private pokes
  ::
      %update-status
    ?>  =(our src)
    =+  !<(=update:v vase)
    =.  connections  (~(put by connections) update)
    %-  give
    :*  %fact
        ~[/status/(scot %p -.update)]
        %vitals-result
        !>(+.update)
    ==
  ::
      %run-check
    ?>  =(our src)
    =+  !<(=ship vase)
    ?>  =(~ (find ~[our] (saxo:title our now ship)))
    =/  stat=(unit result:v)  (~(get by connections) ship)
    ::  XX: code duplicated because of annoying type issue
    ?~  stat
      =.  connections  (~(put by connections) [ship now %pending %setting-up ~])
      %-  emit
      :*  %pass
          /check-result/(scot %p ship)
          %arvo
          %k
          %fard
          %landscape
          %vitals-connection-check
          %noun
          !>((some ship))
      ==
    ?:  ?=(%pending -.status.u.stat)
      cor
    =.  connections  (~(put by connections) [ship now %pending %setting-up ~])
    %-  emit
    ::  [%pass [wire] %arvo %k %fard [beak or desk] [thread-name] [mark] [vase]]
    :*  %pass
        /check-result/(scot %p ship)
        %arvo
        %k
        %fard
        %landscape
        %vitals-connection-check
        %noun
        !>((some ship))
    ==
  ::
  ::  public pokes
  ::
      %ship
    =+  !<(=ship vase)
    ?>  ?=([%live *] (scry-qos:lib our now ship))
    cor
  ==
++  watch
  |=  =path
  ^+  cor
  ?+    path  ~|([%evil-watch path] !!)
  ::
      [%status @ta ~]
    %-  give
    :*  %fact
        ~[path]
        %vitals-result
        !>  %+  fall
              (~(get by connections) (slav %p i.t.path))
            [*@da %complete %no-data ~]
    ==
  ==
++  peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  [~ ~]
  ::
      [%x %sponsor ~]
    %-  some
    %-  some
    :-  %vitals-qos
    !>  (scry-qos:lib our now (sein:title our now our))
  ::
      [%x %galaxy ~]
    %-  some
    %-  some
    :-  %vitals-qos
    !>  (scry-qos:lib our now (rear (saxo:title our now our)))
  ::
      [%x %ship @tas ~]
    %-  some
    %-  some
    :-  %vitals-result
    !>
    %+  fall  (~(get by connections) (slav %p i.t.t.path))
    [*@da %complete %no-data ~]
  ==
++  arvo
  |=  [=wire sign=sign-arvo]
  ^+  cor
  ?+    wire  ~|([%bad-arvo-take wire] !!)
      [%check-result @ta ~]
    ?>  ?=(%khan -.sign)
    ?>  ?=(%arow +<.sign)
    =/  =ship  (slav %p i.t.wire)
    =/  =result:v
      :-  now
      :-  %complete
      ?-  -.p.sign
        %&  !<(complete:v q.p.p.sign)
        %|  [%crash tang.p.p.sign]
      ==
    =.  connections  (~(put by connections) [ship result])
    %-  give
    :*  %fact
        ~[/status/(scot %p ship)]
        %vitals-result
        !>(result)
    ==
  ==
--
