/-  *contacts
/+  default-agent, dbug, verb, neg=negotiate
/+  *contacts
::
::  performance, keep warm
/+  j0=contacts-json-0, j1=contacts-json-1
::
|%
::  conventions
::
::    .con: a contact
::    .rof: our profile
::    .rol: [legacy] our full rolodex
::    .far: foreign peer
::    .for: foreign profile
::    .sag: foreign subscription state
::
+|  %molds
+$  card     card:agent:gall
+$  state-1  [%1 rof=$@(~ profile) =book =peers]
--
:: %-  %^  agent:neg
::       notify=|
::       [~.contacts^%1 ~ ~]
::       [~.contacts^[~.contacts^%1 ~ ~] ~ ~]
%-  agent:dbug
%+  verb  |
^-  agent:gall
=|  state-1
=*  state  -
::
=<  |_  =bowl:gall
    +*  this  .
        def   ~(. (default-agent this %|) bowl)
        cor   ~(. raw bowl)
    ::
    ++  on-init
      ^-  (quip card _this)
      =^  cards  state  abet:init:cor
      [cards this]
    ::
    ++  on-save  !>([state okay])
    ::
    ++  on-load
      |=  old=vase
      ^-  (quip card _this)
      =^  cards  state  abet:(load:cor old)
      [cards this]
    ::
    ++  on-watch
      |=  =path
      ^-  (quip card _this)
      =^  cards  state  abet:(peer:cor path)
      [cards this]
    ::
    ++  on-poke
      |=  [=mark =vase]
      ^-  (quip card _this)
      =^  cards  state  abet:(poke:cor mark vase)
      [cards this]
    ::
    ++  on-peek   peek:cor
    ++  on-leave  on-leave:def
    ::
    ++  on-agent
      |=  [=wire =sign:agent:gall]
      ^-  (quip card _this)
      =^  cards  state  abet:(agent:cor wire sign)
      [cards this]
    ::
    ++  on-arvo   on-arvo:def
    ++  on-fail   on-fail:def
    --
::
|%
::
+|  %state
::
::    namespaced to avoid accidental direct reference
::
++  raw
  =|  out=(list card)
  |_  =bowl:gall
  ::
  +|  %generic
  ::
  ++  abet  [(flop out) state]
  ++  cor   .
  ++  emit  |=(c=card cor(out [c out]))
  ++  emil  |=(c=(list card) cor(out (weld (flop c) out)))
  ++  give  |=(=gift:agent:gall (emit %give gift))
  ++  pass  |=([=wire =note:agent:gall] (emit %pass wire note))
  ::
  +|  %operations
  ::
  ::  +pub: publication management
  ::
  ::    - /v1/news: local updates to our profile and rolodex
  ::    - /v1/contact: updates to our profile
  ::
  ::    as these publications are trivial, |pub does *not*
  ::    make use of the +abet pattern. the only behavior of note
  ::    is wrt the /contact/at/$date path, which exists to minimize
  ::    redundant network traffic.
  ::
  ::    /epic protocol versions are even more trivial,
  ::    published ad-hoc, elsewhere.
  ::
  ::    Facts are always send in the following order:
  ::    1. [legacy] /news
  ::    2. /v1/news
  ::    3. /v1/contact
  ::
  ++  pub
    =>  |%
        ::  if this proves to be too slow, the set of paths
        ::  should be maintained statefully: put on +p-init:pub,
        ::  filtered at some interval (on +load?) to avoid a space leak.
        ::
        ::  XX number of peers is usually around 5.000.
        ::  this means that the number of subscribers is about the
        ::  same. Thus on each contact update we need to filter
        ::  over 5.000 elements: do some benchmarking.
        ::
        ++  subs
          ^-  (set path)
          %-  ~(rep by sup.bowl)
          |=  [[duct ship pat=path] acc=(set path)]
          ?.(?=([%v1 %contact *] pat) acc (~(put in acc) pat))
        ++  fact
          |=  [pat=(set path) u=update]
          ^-  gift:agent:gall
          [%fact ~(tap in pat) upd:mar !>(u)]
        --
    ::
    |%
    ::  +p-anon: delete our profile
    ::
    ++  p-anon  ?.(?=([@ ^] rof) cor (p-send-self ~))
    ::  +p-self: edit our profile
    ::
    ++  p-self
      |=  con=(map @tas value)
      =/  old=contact
        ?.(?=([@ ^] rof) *contact con.rof)
      =/  new=contact
        (do-edit old con)
      ?:  =(old new)
        cor
      ?>  (sane-contact new)
      (p-send-self new)
    ::  +p-page: create new contact page
    ::
    ++  p-page
      |=  [=cid con=contact]
      ?:  (~(has by book) id+cid)
        ~|  "contact page {<cid>} already exists"  !!
      ?>  (sane-contact con)
      (p-send-page cid con)
    ::  +p-spot: add peer as a contact
    ::  
    ++  p-spot
      |=  [who=ship mod=contact]
      ?:  (~(has by book) who)
        ~|  "peer {<who>} is already a contact"  !!
      =/  con=contact
        ~|  "peer {<who>} not found"
        =/  far=foreign
          (~(got by peers) who)
        ?~  for.far  *contact
        con.for.far
      ?>  (sane-contact mod)
      (p-send-spot who con mod)
    ::  +p-edit: edit contact page overlay
    ::
    ++  p-edit
      |=  [=kip mod=contact]
      =/  =page
        ~|  "contact page {<kip>} does not exist"
        (~(got by book) kip)
      =/  old=contact
        q.page
      =/  new=contact
        (do-edit old mod)
      ?:  =(old new)
        cor
      ?>  (sane-contact new)
      (p-send-edit kip p.page new)
    ::  +p-wipe: delete a contact page
    ::
    ++  p-wipe
      |=  wip=(list kip)
      %+  roll  wip
        |=  [=kip acc=_cor]
        =/  =page
          ~|  "contact id {<kip>} not found"
          (~(got by book) kip)
        (p-send-wipe kip page)
    ::  +p-send-self: publish modified profile
    ::
    ++  p-send-self
      |=  con=contact
      =/  p=profile  [?~(rof now.bowl (mono wen.rof now.bowl)) con]
      =.  rof  p
      ::
      =.  cor
        (p-news-0 our.bowl (to-contact-0 con))
      =.  cor
        (p-news [%self con])
      (give (fact subs [%full p]))
    ::  +p-send-page: publish new contact page
    ::
    ++  p-send-page
      |=  [=cid mod=contact]
      =/  =page
        [*contact mod]
      =.  book  (~(put by book) id+cid page)
      (p-news [%page id+cid page])
    ::  +p-send-spot: publish peer spot
    ::
    ++  p-send-spot
      |=  [who=ship con=contact mod=contact]
      =.  book
        (~(put by book) who con mod)
      (p-news [%page who con mod])
    ::  +p-send-edit: publish contact page update
    ::
    ++  p-send-edit
      |=  [=kip =page]
      =.  book
        (~(put by book) kip page)
      (p-news [%page kip page])
    ::  +p-send-wipe: publish contact page wipe
    ::
    ++  p-send-wipe
      |=  [=kip =page]
      =.  book
        (~(del by book) kip)
      (p-news [%wipe kip])
    ::  +p-init: publish our profile
    ::
    ++  p-init
      |=  wen=(unit @da)
      ?~  rof  cor
      ?~  wen  (give (fact ~ full+rof))
      ?:  =(u.wen wen.rof)  cor
      ::
      :: no future subs
      ?>((lth u.wen wen.rof) (give (fact ~ full+rof)))
    ::  +p-news-0: [legacy] publish news
    ::
    ++  p-news-0
      |=  n=news-0:legacy
      (give %fact ~[/news] %contact-news !>(n))
    ::  +p-news: publish news
    ::
    ++  p-news
      |=  n=news
      (give %fact ~[/v1/news] %contact-news-1 !>(n))
    --
  ::
  ::  +sub: subscription mgmt
  ::
  ::    /contact/*: foreign profiles, _s-impl
  ::
  ::    subscription state is tracked per peer in .sag
  ::
  ::    ~:     no subscription
  ::    %want: /contact/* requested
  ::
  ::    for a given peer, we always have at most one subscription,
  ::    to /contact/*
  ::
  ++  sub
    |^  |=  who=ship
        ^+  s-impl
        ?<  =(our.bowl who)
        =/  old  (~(get by peers) who)
        ~(. s-impl who %live ?=(~ old) (fall old *foreign))
    ::
    ++  s-many
      |=  [l=(list ship) f=$-(_s-impl _s-impl)]
      ^+  cor
      %+  roll  l
      |=  [who=@p acc=_cor]
      ?:  =(our.bowl who)  acc
      si-abet:(f (sub:acc who))
    ::
    ++  s-impl
      |_  [who=ship sas=?(%dead %live) new=? foreign]
      ::
      ++  si-cor  .
      ::
      ++  si-abet
        ^+  cor
        ?-  sas
          %live  =.  peers  (~(put by peers) who [for sag])
                 ?.  new  cor
                 ::  NB: this assumes con.for is only set in +si-hear
                 ::
                 =.  cor  (p-news-0:pub who ~)
                 (p-news:pub [%peer who ~])
          ::
          %dead  ?:  new  cor
                 =.  peers  (~(del by peers) who)
                 ::
                 ::  this is not quite right, reflecting *total* deletion
                 ::  as *contact* deletion. but it's close, and keeps /news simpler
                 ::
                 =.  cor  (p-news-0:pub who ~)
                 (p-news:pub [%peer who ~])
        ==
      ::
      ++  si-take
        |=  [=wire =sign:agent:gall]
        ^+  si-cor
        ?-  -.sign
          %poke-ack   ~|(strange-poke-ack+wire !!)
        ::
          %watch-ack  ~|  strange-watch-ack+wire
                      si-cor
        ::
          %kick       si-meet(sag ~)
        ::
          %fact       ?+    p.cage.sign  ~|(strange-fact+wire !!)
                          %contact-update-1
                        (si-hear !<(update q.cage.sign))
        ==            ==
      ::
      ++  si-hear
        |=  u=update
        ^+  si-cor
        ?>  (sane-contact con.u)
        ?:  &(?=(^ for) (lte wen.u wen.for))
          si-cor
        %_  si-cor
          for  +.u
          cor  =.  cor
                 (p-news-0:pub who (to-contact-0 con.u))
               =/  page=(unit page)  (~(get by book) who)
               ::  update peer contact page
               ::
               =?  cor  ?=(^ page)
                 ?:  =(p.u.page con.u)  cor
                 =.  book  (~(put by book) who u.page(p con.u))
                 (p-news:pub %page who con.u q.u.page)
               (p-news:pub %peer who con.u)
        ==
      ::
      ++  si-meet
        ^+  si-cor
        ::
        ::  already connected
        ?:  ?=(%want sag)
          si-cor
        =/  pat  [%v1 %contact ?~(for / /at/(scot %da wen.for))]
        %=  si-cor
          cor  (pass /contact %agent [who dap.bowl] %watch pat)
          sag  %want
        ==
      ::
      ++  si-drop  si-snub(sas %dead)
      ::
      ++  si-snub
        %_  si-cor
          sag  ~
          cor   ?.  ?=(%want sag)  cor
                (pass /contact %agent [who dap.bowl] %leave ~)
        ==
      --
    --
  ::
  ::  +migrate: from :contact-store
  ::
  ::    all known ships, non-default profiles, no subscriptions
  ::
  ++  migrate
    =>  |%
        ++  legacy
          |%
          +$  rolodex   (map ship contact)
          +$  resource  [=entity name=term]
          +$  entity    ship
          +$  contact
            $:  nickname=@t
                bio=@t
                status=@t
                color=@ux
                avatar=(unit @t)
                cover=(unit @t)
                groups=(set resource)
                last-updated=@da
            ==
          --
        --
    ::
    ^+  cor
    =/  bas  /(scot %p our.bowl)/contact-store/(scot %da now.bowl)
    ?.  .^(? gu+(weld bas /$))  cor
    =/  ful  .^(rolodex:legacy gx+(weld bas /all/noun))
    ::
    |^
    cor(rof us, peers them)
    ++  us  (biff (~(get by ful) our.bowl) convert)
    ::
    ++  them
      ^-  ^peers
      %-  ~(rep by (~(del by ful) our.bowl))
      |=  [[who=ship con=contact:legacy] =^peers]
      (~(put by peers) who (convert con) ~)
    ::
    ++  convert
      |=  con=contact:legacy
      ^-  $@(~ profile)
      ?:  =(*contact:legacy con)  ~
      [last-updated.con (to-contact con(|6 groups.con))]
    --
  ::
  +|  %implementation
  ::
  ++  init
    (emit %pass /migrate %agent [our dap]:bowl %poke noun+!>(%migrate))
  ::
  ++  load
    |=  old-vase=vase
    ^+  cor
    |^  =+  !<([old=versioned-state cool=epic] old-vase)
        =?  cor  !=(okay cool)  l-epic
        ::
        ?-  -.old
          %0
        =.  rof  ?~(rof.old ~ (to-profile rof.old))
        ::  migrate peers. for each peer
        ::  1. leave /epic, if any
        ::  2. subscribe if desired
        ::  3. put into peers
        ::
        =^  caz=(list card)  peers
          %+  roll  ~(tap by rol.old)
          |=  [[who=ship foreign-0:legacy] caz=(list card) =_peers]
          ::  leave /epic if any
          ::
          =?  caz  (~(has by wex.bowl) [/epic who dap.bowl])
            :_  caz
            [%pass /epic %agent [who dap.bowl] %leave ~]
          =/  fir=$@(~ profile)
            ?~  for  ~
            (to-profile for)
          ::  no intent to connect
          ::
          ?:  =(~ sag)
            :-  caz
            (~(put by peers) who fir ~)
          :_  (~(put by peers) who fir %want)
          ?:  (~(has by wex.bowl) [/contact who dap.bowl])
            caz
          =/  =path  [%v1 %contact ?~(fir / /at/(scot %da wen.fir))]
          :_  caz
          [%pass /contact %agent [who dap.bowl] %watch path]
        (emil caz)
        ::
          %1
        =.  state  old
        =/  cards
          %+  roll  ~(tap by peers)
          |=  [[who=ship foreign] caz=(list card)]
          ::  intent to connect, resubscribe
          ::
          ?:  ?&  =(%want sag)
                  !(~(has by wex.bowl) [/contact who dap.bowl])
              ==
            =/  =path  [%v1 %contact ?~(for / /at/(scot %da wen.for))]
            :_  caz
            [%pass /contact %agent [who dap.bowl] %watch path]
          caz
        (emil cards)
        ==
    +$  state-0  [%0 rof=$@(~ profile-0:legacy) rol=rolodex:legacy]
    +$  versioned-state
      $%  state-0
          state-1
      ==
    ::
    ++  l-epic  (give %fact [/epic ~] epic+!>(okay))
    --
  ::
  ++  poke
    |=  [=mark =vase]
    ^+  cor
    ?+    mark  ~|(bad-mark+mark !!)
        %noun
      ?+  q.vase  !!
        %migrate  migrate
      ==
        $?  act:base:mar
            %contact-action-0
            %contact-action-1
        ==
      ?>  =(our src):bowl
      =/  act=action
        ?-  mark
          ::
          ::  legacy %contact-action
            ?(act:base:mar %contact-action-0)
          =/  act-0  !<(action-0:legacy vase)
          ?.  ?=(%edit -.act-0)
            (to-action act-0)
          ::  v0 %edit needs special handling to evaluate 
          ::  groups edit
          ::
          =/  groups=(set $>(%cult value))
            ?~  rof  ~
            =+  set=(~(ges cy con.rof) groups+%cult)
            ?:  =(~ set)  ~
            (need set)
          [%self (to-self-edit p.act-0 groups)]
          ::
            %contact-action-1
          !<(action vase)
        ==
      ?-  -.act
        %anon  p-anon:pub
        %self  (p-self:pub p.act)
        %page  (p-page:pub p.act q.act)
        ::  if we spot someone who is not a peer,
        ::  we meet them first
        ::
        %spot  =?  cor  !(~(has by peers) p.act)
                 si-abet:si-meet:(sub p.act)
               (p-spot:pub p.act q.act)
        %edit  (p-edit:pub p.act q.act)
        %wipe  (p-wipe:pub p.act)
        %meet  (s-many:sub p.act |=(s=_s-impl:sub si-meet:s))
        %drop  (s-many:sub p.act |=(s=_s-impl:sub si-drop:s))
        %snub  (s-many:sub p.act |=(s=_s-impl:sub si-snub:s))
      ==
    ==
  ::  +peek: scry
  ::
  ::  v0 scries
  ::
  ::  /x/all -> $rolodex:legacy
  ::  /x/contact/her=@ -> $@(~ contact-0:legacy)
  ::
  ::  v1 scries
  ::
  ::  /x/v1/self -> $contact
  ::  /x/v1/book -> $book
  ::  /x/v1/book/her=@p -> $page
  ::  /x/v1/book/id/cid=@uv -> $page
  ::  /x/v1/all -> $directory
  ::  /x/v1/contact/her=@p -> $contact
  ::  /x/v1/peer/her=@p -> $contact
  ::
  ++  peek
    |=  pat=(pole knot)
    ^-  (unit (unit cage))
    ?+    pat  [~ ~]
      ::
        [%x %all ~]
      =/  rol-0=rolodex:legacy
        %-  ~(urn by peers)
        |=  [who=ship far=foreign]
        ^-  foreign-0:legacy
        =/  mod=contact
          ?~  page=(~(get by book) who)
            ~
          q.u.page
        (to-foreign-0 (foreign-mod far mod))
      =/  lor-0=rolodex:legacy
        ?:  |(?=(~ rof) ?=(~ con.rof))  rol-0
        (~(put by rol-0) our.bowl (to-profile-0 rof) ~)
      ``contact-rolodex+!>(lor-0)
      ::
        [%x %contact her=@ ~]
      ?~  who=`(unit @p)`(slaw %p her.pat)
        [~ ~]
      =/  tac=?(~ contact-0:legacy)
        ?:  =(our.bowl u.who)
          ?~(rof ~ (to-contact-0 con.rof))
        =+  far=(~(get by peers) u.who)
        ?:  |(?=(~ far) ?=(~ for.u.far))  ~
        (to-contact-0 con.for.u.far)
      ?~  tac  [~ ~]
      ``contact+!>(`contact-0:legacy`tac)
      ::
        [%x %v1 %self ~]
      ?~  rof  [~ ~]
      ?~  con.rof  [~ ~]
      ``contact-1+!>(`contact`con.rof)
      ::
        [%x %v1 %book ~]
      ?~  book  [~ ~]
      ``contact-book-0+!>(book)
      ::
        [%x %v1 %book her=@p ~]
      ?~  who=`(unit @p)`(slaw %p her.pat)
        [~ ~]
      =/  page=(unit page)
        (~(get by book) u.who)
      ?~  page
        [~ ~]
      ``contact-page-0+!>(`^page`u.page)
      ::
        [%x %v1 %book %id =cid ~]
      ?~  id=`(unit @uv)`(slaw %uv cid.pat)
        [~ ~]
      =/  page=(unit page)
        (~(get by book) id+u.id)
      ?~  page
        [~ ~]
      ``contact-page-0+!>(`^page`u.page)
      ::
        [%x %v1 %all ~]
      =|  dir=directory
      ::  export all ship contacts
      ::
      =.  dir
        %-  ~(rep by book)
        |=  [[=kip =page] =_dir]
        ?^  kip
          dir
        (~(put by dir) kip (contact-uni page))
      ::  export all peers
      ::
      =.  dir
        %-  ~(rep by peers)
        |=  [[who=ship far=foreign] =_dir]
        ?~  for.far  dir
        ?:  (~(has by dir) who)  dir
        (~(put by dir) who con.for.far)
      ?~  dir
        [~ ~]
      ``contact-directory-0+!>(dir)
      ::
        [%x %v1 %contact her=@p ~]
      ?~  who=`(unit @p)`(slaw %p her.pat)
        [~ ~]
      ?~  far=(~(get by peers) u.who)
        [~ ~]
      ?~  page=(~(get by book) u.who)
        ?~  for.u.far  [~ ~]
        ``contact-1+!>(con.for.u.far)
      ``contact-1+!>((contact-uni u.page))
      ::
        [%x %v1 %peer her=@p ~]
      ?~  who=`(unit @p)`(slaw %p her.pat)
        [~ ~]
      ?~  far=(~(get by peers) u.who)
        [~ ~]
      ``contact-foreign-1+!>(`foreign`u.far)
    ==
  ::
  ++  peer
    |=  pat=(pole knot)
    ^+  cor
    ?+  pat  ~|(bad-watch-path+pat !!)
      ::
      ::  v0
      [%news ~]  ~|(local-news+src.bowl ?>(=(our src):bowl cor))
      ::
      ::  v1
      [%v1 %contact ~]  (p-init:pub ~)
      [%v1 %contact %at wen=@ ~]  (p-init:pub `(slav %da wen.pat))
      [%v1 %news ~]  ~|(local-news+src.bowl ?>(=(our src):bowl cor))
      ::
      [%epic ~]  (give %fact ~ epic+!>(okay))
    ==
  ::
  ++  agent
    |=  [=wire =sign:agent:gall]
    ^+  cor
    ?+  wire  ~|(evil-agent+wire !!)
        [%contact ~]
      si-abet:(si-take:(sub src.bowl) wire sign)
        [%migrate ~]
      ?>  ?=(%poke-ack -.sign)
      ?~  p.sign  cor
      %-  (slog leaf/"{<wire>} failed" u.p.sign)
      cor
    ==
  --
--
