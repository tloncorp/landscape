/-  *contacts
/+  default-agent, dbug, verb
/+  *contacts
::  performance, keep warm
/+  contacts-json
::
|%
::  conventions
::
::    .con: a contact
::    .rof: our profile
::    .rol: our full rolodex
::    .far: foreign peer
::    .for: foreign profile
::    .sag: foreign subscription state
::
+|  %types
+$  card     card:agent:gall
+$  state-0  [%0 rof=$@(~ profile-0) rol=rolodex-0]
+$  state-1  [%1 rof=$@(~ profile-1) rolodex-1]
--
::
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
  ::  |pub: publication mgmt
  ::
  ::    - /news: local updates to our profile and rolodex
  ::    - /contact: updates to our profile
  ::
  ::    as these publications are trivial, |pub does *not*
  ::    make use of the +abet pattern. the only behavior of note
  ::    is wrt the /contact/at/$date path, which exists to minimize
  ::    redundant network traffic.
  ::
  ::    /epic protocol versions are even more trivial,
  ::    published ad-hoc, elsewhere.
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
        ::  XX when there are no subscribers on a path, we still
        ::  send facts on an empty path. This is no problem, unless
        ::  it is used in ++peer
        ::
        ++  subs-0
          ^-  (set path)
          %-  ~(rep by sup.bowl)
          |=  [[duct ship pat=path] acc=(set path)]
          ?.(?=([%contact *] pat) acc (~(put in acc) pat))
        ++  subs
          ^-  (set path)
          %-  ~(rep by sup.bowl)
          |=  [[duct ship pat=path] acc=(set path)]
          ?.(?=([%v1 %contact *] pat) acc (~(put in acc) pat))
        ::
        ++  fact-0
          |=  [pat=(set path) u=update-0]
          ^-  gift:agent:gall
          [%fact ~(tap in pat) %contact-update !>(u)]
        ::
        ++  fact
          |=  [pat=(set path) u=update-1]
          ^-  gift:agent:gall
          [%fact ~(tap in pat) upd:mar !>(u)]
        --
    ::
    |%
    ::
    ++  p-anon  ?.(?=([@ ^] rof) cor (p-send-self ~))
    ::
    ++  p-self
      |=  e=(map @tas value-1)
      =/  old=contact-1
        ?.(?=([@ ^] rof) *contact-1 con.rof)
      =/  new=contact-1
        (do-edit-1 old e)
      ?:  =(old new)
        cor
      (p-send-self new)
    ::  +p-page: create new contact page
    ::
    ++  p-page
      |=  [=cid con=contact-1]
      ?:  (~(has by book) id+cid)
        ~|  "contact page {<cid>} already exists"  !!
      (p-send-page cid con)
    ::  +p-edit: edit contact page overlay
    ::
    ++  p-edit
      |=  [=kip mod=(map @tas value-1)]
      =/  =page
        ~|  "contact page {<kip>} does not exist"
        (~(got by book) kip)
      =/  old=contact-1
        q.page
      =/  new=contact-1
        (do-edit-1 q.page mod)
      ?:  =(old new)
        cor
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
    ::  +p-spot: add as a contact
    ::
    ++  p-spot
      |=  [who=ship mod=contact-1]
      ?:  (~(has by book) who)
        ~|  "peer {<who>} is already a contact"  !!
      =/  con=contact-1
        ~|  "peer {<who>} not found"
        =/  far=foreign-1
          (~(got by peers) who)
        ?~  for.far  *contact-1
        con.for.far
      (p-send-spot who con mod)
    ::
    ++  p-send-self
      |=  con=contact-1
      =/  p=profile-1  [?~(rof now.bowl (mono wen.rof now.bowl)) con]
      =.  rof  p
      ::
      =.  cor
        (give (fact-0 subs-0 [%full (to-profile-0 p)]))
      =.  cor
        (give (fact subs [%full p]))
      =.  cor
        (p-news-0 our.bowl (to-contact-0 con))
      (p-news [%self con])
    ::  +p-send-page: publish new contact page
    ::
    ++  p-send-page
      |=  [=cid mod=contact-1]
      =/  =page
        [*contact-1 mod]
      =.  book  (~(put by book) id+cid page)
      (p-news [%page id+cid page])
    ::  +p-send-edit: publish contact page update
    ::
    ++  p-send-edit
      |=  [=kip =page]
      =.  book
        (~(put by book) kip page)
      ::  this is a peer page, send v0 update
      ::
      =?  cor  ?=(ship kip)
        %+  p-news-0  kip
        (to-contact-0 (contact-mod page))
      (p-news [%page kip page])
    ::
    ++  p-send-wipe
      |=  [=kip =page]
      =.  book
        (~(del by book) kip)
      ::  peer overlay lost
      ::
      =?  cor  &(?=(ship kip) !?=(~ q.page))
        ::  v0 peer contact is modified
        %+  p-news-0  kip
        (to-contact-0 p.page)
      (p-news [%wipe kip])
    ::  +p-send-spot: publish peer spot
    ::
    ++  p-send-spot
      |=  [who=ship con=contact-1 mod=contact-1]
      =.  book
        (~(put by book) who con mod)
      :: XX think about this logic: rolodex-0
      :: is essentially peers now.
      ::
      :: =.  cor
      ::   %+  p-news-0  who
      ::     (to-contact-0 (~(uni by con) mod))
      (p-news [%page who con mod])
    ::
    ++  p-init-0
      |=  wen=(unit @da)
      ?~  rof  cor
      ?~  wen  (give (fact ~ full+rof))
      ?:  =(u.wen wen.rof)  cor
      ::
      :: no future subs
      ?>((lth u.wen wen.rof) (give (fact-0 ~ full+(to-profile-0 rof))))
    ::
    ++  p-init
      |=  wen=(unit @da)
      ?~  rof  cor
      ?~  wen  (give (fact ~ full+rof))
      ?:  =(u.wen wen.rof)  cor
      ::
      :: no future subs
      ?>((lth u.wen wen.rof) (give (fact ~ full+rof)))
    ::
    ++  p-news-0
      |=  n=news-0
      (give %fact ~[/news] %contact-news !>(n))
    ::
    ++  p-news
      |=  n=news-1
      (give %fact ~[/v1/news] %contact-news-1 !>(n))
    --
  ::
  ::  +sub: subscription mgmt
  ::
  ::    /epic: foreign protocol versions, |si-epic:s-impl
  ::    /contact/*: foreign profiles, |s-impl
  ::
  ::    subscription state is tracked per peer in .sag
  ::
  ::    ~:     no subscription
  ::    %want: /contact/* being attempted
  ::    %fail: /contact/* failed, /epic being attempted
  ::    %lost: /epic failed
  ::    %chi:  /contact/* established
  ::    %lev:  we're (incompatibly) ahead of the publisher
  ::    %dex:  we're behind the publisher
  ::
  ::    for a given peer, we always have at most one subscription,
  ::    to either /contact/* or /epic.
  ::
  ++  sub
    |^  |=  who=ship
        ^+  s-impl
        ?<  =(our.bowl who)
        =/  old  (~(get by peers) who)
        ~(. s-impl who %live ?=(~ old) (fall old *foreign-1))
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
      |_  [who=ship sas=?(%dead %live) new=? foreign-1]
      ::
      ++  si-cor  .
      ::
      ++  si-abet
        ^+  cor
        ?-  sas
          %live  ~&  live+who
                 =.  peers  (~(put by peers) who [for sag])
                 ?.  new  cor
                 ::  NB: this assumes con.for is only set in +si-hear
                 ::
                 =.  cor  (p-news-0:pub who ~)
                 (p-news:pub [%peer who ~])
          ::
          %dead  ?:  new  cor
                 =.  peers  (~(del by peers) who)
                 =/  page=(unit page)
                   (~(get by book) who)
                 ::
                 ::  this is not quite right, reflecting *total* deletion
                 ::  as *contact* deletion. but it's close, and keeps /news simpler
                 ::
                 =.  cor  (p-news-0:pub who ~)
                 (p-news:pub [%peer who ~])
        ==
      ::
      ++  si-take
        |=  =sign:agent:gall
        ^+  si-cor
        ?-  -.sign
          %poke-ack   ~|(strange-poke-ack+wire !!)
        ::
          %watch-ack  ~|  strange-watch-ack+wire
                      ?>  ?=(%want sag)
                      ?~  p.sign  si-cor(sag [%chi ~])
                      %-  (slog 'contact-fail' u.p.sign)
                      pe-peer:si-epic(sag %fail)
        ::
          %kick       si-meet(sag ~)
        ::
        ::  [compat] we *should* maintain backcompat here
        ::
        ::    by either directly handling or upconverting
        ::    old actions. but if we don't, we'll fall back
        ::    to /epic and wait for our peer to upgrade.
        ::
        ::    %fact's from the future are also /epic,
        ::    in case our peer downgrades. if not, we'll
        ::    handle it on +load.
        ::
          %fact       ?+    p.cage.sign  (si-odd p.cage.sign)
                          :: XX make sure I have got it right here
                          ::
                          ?(upd:base:mar %contact-update-1)
                        (si-hear !<(update-1 q.cage.sign))
        ==            ==
      ::
      ++  si-hear
        |=  u=update-1
        ^+  si-cor
        ?:  &(?=(^ for) (lte wen.u wen.for))
          si-cor
        %=  si-cor
          for  +.u
          cor  =.  cor
                 (p-news-0:pub who (to-contact-0 con.u))
               =/  page=(unit page)  (~(get by book) who)
               ::  update peer contact
               ::
               =?  cor  ?=(^ page)
                 ?:  =(p.u.page con.u)  cor
                 =.  book  (~(put by book) who u.page(p con.u))
                 (p-news:pub %page who con.u q.u.page)
               (p-news:pub %peer who con.u)
        ==
      ::
      :: ++  si-meet  si-cor  :: init key in +si-abet
      ::
      ++  si-meet
        ^+  si-cor
        ?.  ?=(~ sag)
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
          cor  ?+    sag   cor
                   ?(%fail [?(%lev %dex) *])
                 (pass /epic %agent [who dap.bowl] %leave ~)
               ::
                   ?(%want [%chi *])
                 (pass /contact %agent [who dap.bowl] %leave ~)
        ==     ==
      ::
      ++  si-odd
        |=  =mark
        ^+  si-cor
        =*  upd  *upd:base:mar
        =*  wid  ^~((met 3 upd))
        ?.  =(upd (end [3 wid] mark))
          ~&(fake-news+mark si-cor)   ::  XX unsub?
        ?~  ver=(slaw %ud (rsh 3^+(wid) mark))
          ~&(weird-news+mark si-cor)  ::  XX unsub?
        ?:  =(okay u.ver)
          ~|(odd-not-odd+mark !!)     ::  oops!
        =.  si-cor  si-snub  :: unsub before .sag update
        =.  sag  ?:((lth u.ver okay) [%lev ~] [%dex u.ver])
        pe-peer:si-epic
      ::
      ++  si-epic
        |%
        ++  pe-take
          |=  =sign:agent:gall
          ^+  si-cor
          ?-  -.sign
            %poke-ack   ~|(strange-poke-ack+wire !!)
          ::
            %watch-ack  ?~  p.sign  si-cor
                        %-  (slog 'epic-fail' u.p.sign)
                        si-cor(sag %lost)
          ::
            %kick       ?.  ?=(?(%fail [?(%dex %lev) *]) sag)
                          si-cor  :: XX strange
                        pe-peer
          ::
            %fact       ?+  p.cage.sign
                                 ~&(fact-not-epic+p.cage.sign si-cor)
                          %epic  (pe-hear !<(epic q.cage.sign))
          ==            ==
        ::
        ++  pe-hear
          |=  =epic
          ^+  si-cor
          ?.  ?=(?(%fail [?(%dex %lev) *]) sag)
            ~|(strange-epic+[okay epic] !!)  :: get %kick'd
          ?:  =(okay epic)
            ?:  ?=(%fail sag)
              si-cor(sag %lost)  :: abandon hope
            si-meet:si-snub
          ::
          ::  handled generically to support peer downgrade
          ::
          si-cor(sag ?:((gth epic okay) [%dex epic] [%lev ~]))
        ::
        ++  pe-peer
          si-cor(cor (pass /epic %agent [who dap.bowl] %watch /epic))
        --
      --
    --
  ::  XX can we just assume this migration happened
  ::  at %contacts v0 and cut it out?
  ::
  ::  +migrate: from :contact-store
  ::
  ::    all known ships, non-default profiles, no subscriptions
  ::
  :: ++  migrate
  ::   =>  |%
  ::       ++  legacy
  ::         |%
  ::         +$  rolodex   (map ship contact)
  ::         +$  resource  [=entity name=term]
  ::         +$  entity    ship
  ::         +$  contact
  ::           $:  nickname=@t
  ::               bio=@t
  ::               status=@t
  ::               color=@ux
  ::               avatar=(unit @t)
  ::               cover=(unit @t)
  ::               groups=(set resource)
  ::               last-updated=@da
  ::           ==
  ::         --
  ::       --
  ::   ::
  ::   ^+  cor
  ::   =/  bas  /(scot %p our.bowl)/contact-store/(scot %da now.bowl)
  ::   ?.  .^(? gu+(weld bas /$))  cor
  ::   =/  ful  .^(rolodex:legacy gx+(weld bas /all/noun))
  ::   ::
  ::   |^  cor(rof us, rol them)
  ::   ++  us  (biff (~(get by ful) our.bowl) convert)
  ::   ::
  ::   ++  them
  ::     ^-  rolodex
  ::     %-  ~(rep by (~(del by ful) our.bowl))
  ::     |=  [[who=ship con=contact:legacy] rol=rolodex]
  ::     (~(put by rol) who (convert con) ~)
  ::   ::
  ::   ++  convert
  ::     |=  con=contact:legacy
  ::     ^-  $@(~ profile)
  ::     ?:  =(*contact:legacy con)  ~
  ::     [last-updated.con con(|6 groups.con)]
  ::   --
  ::
  :: +|  %implementation
  ::
  ++  init
    (emit %pass /migrate %agent [our dap]:bowl %poke noun+!>(%migrate))
  ::
  ++  load
    |=  old-vase=vase
    ^+  cor
    |^  =+  !<([old=versioned-state cool=epic] old-vase)
        ?>  ?=(%1 -.old)
        cor(state old)
    :: |^  =+  !<([old=versioned-state cool=epic] old-vase)
    ::     ::  if there should be a sub (%chi saga), but there is none (in the
    ::     ::  bowl), re-establish it. %kick handling used to be faulty.
    ::     ::  we run this "repair" on every load, in the spirit of +inflate-io.
    ::     ::
    ::     =^  cards  rol.old
    ::       %+  roll  ~(tap by rol.old)
    ::       |=  [[who=ship foreign] caz=(list card) rol=rolodex]
    ::       ?.  ?&  =([%chi ~] sag)
    ::               !(~(has by wex.bowl) [/contact who dap.bowl])
    ::           ==
    ::         [caz (~(put by rol) who for sag)]
    ::       :-  :_  caz
    ::           =/  =path  [%contact ?~(for / /at/(scot %da wen.for))]
    ::           [%pass /contact %agent [who dap.bowl] %watch path]
    ::       (~(put by rol) who for %want)
    ::     =.  state  old
    ::     =.  cor    (emil cards)
    ::     ::  [compat] if our protocol version changed
    ::     ::
    ::     ::    we first tell the world, then see if we can now understand
    ::     ::    any of our friends who were sending messages from the future.
    ::     ::
    ::     ?:(=(okay cool) cor l-bump(cor l-epic))
    ::
    +$  versioned-state
      $%  state-0
          state-1
      ==
    ::
    :: ++  l-epic  (give %fact [/epic ~] epic+!>(okay))
    :: ::
    :: ++  l-bump
    ::   ^+  cor
    ::   %-  ~(rep by rol)
    ::   |=  [[who=ship foreign] =_cor]
    ::   ::  XX to fully support downgrade, we'd need to also
    ::   ::  save an epic in %lev
    ::   ::
    ::   ?.  ?&  ?=([%dex *] sag)
    ::           =(okay ver.sag)
    ::       ==
    ::     cor
    ::   si-abet:si-heed:si-snub:(sub:cor who)
    --
  ::
  ++  poke
    |=  [=mark =vase]
    ^+  cor
    ?+    mark  ~|(bad-mark+mark !!)
        %noun
      ?+  q.vase  !!
        %migrate  ~|(%migrate-not-implemented !!)
      ==
        $?  %contact-action-1
            %contact-action-0
            act:base:mar
        ==
      ?>  =(our src):bowl
      =/  act
        ?-  mark
            %contact-action-1
          !<(action vase)
            ?(act:base:mar %contact-action-0)
          (to-action-1 !<(action-0 vase))
        ==
      ~&  poke+-.act
      ?-  -.act
        %anon  p-anon:pub
        %self  (p-self:pub p.act)
        %page  (p-page:pub p.act q.act)
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
  ::  /x/all -> $rolodex-0
  ::  /x/contact/her=@ -> $@(~ contact-0)
  ::
  ::  v1 scries
  ::
  ::  /x/v1/self -> $@(~ $profile-1)
  ::  /x/v1/book -> $book
  ::  /x/v1/book/her=@p -> $page
  ::  /x/v1/book/id/cid=@uv -> $page
  ::  /x/v1/peer/her=@p -> $contact-1
  ::
  ++  peek
    |=  pat=(pole knot)
    ^-  (unit (unit cage))
    ?+    pat  [~ ~]
        ::
        [%x %all ~]
      =/  rol-0=rolodex-0
        %-  ~(urn by peers)
        |=  [who=ship far=foreign-1]
        ^-  foreign-0
        =/  mod=contact-1
          ?~  page=(~(get by book) who)
            ~
          q.u.page
        (to-foreign-0 (foreign-mod far mod))
      =/  lor-0=rolodex-0
        ?:  |(?=(~ rof) ?=(~ con.rof))  rol-0
        (~(put by rol-0) our.bowl (to-profile-0 rof) ~)
      ``contact-rolodex+!>(lor-0)
        ::
        [%x %contact her=@ ~]
      ?~  who=`(unit @p)`(slaw %p her.pat)
        [~ ~]
      =/  tac=?(~ contact-0)
        ?:  =(our.bowl u.who)
          ?~(rof ~ (to-contact-0 con.rof))
        =+  (~(get by peers) u.who)
        ?:  |(?=(~ -) ?=(~ for.u.-))  ~
        (to-contact-0 con.for.u.-)
      ?~  tac  [~ ~]
      :: XX smart compiler > Hoon compiler
      ``contact+!>(`contact-0`tac)
        ::
        [%x %v1 %self ~]
      ?~  rof  [~ ~]
      ?~  con.rof  [~ ~]
      ``contact-1+!>(con.rof)
        ::
        [%x %v1 %book ~]
      ``contact-book-1+!>(book)
        ::
        [%x %v1 %book her=@p ~]
      ?~  who=`(unit @p)`(slaw %p her.pat)
        [~ ~]
      =/  page=(unit page)
        (~(get by book) u.who)
      ?~  page
        [~ ~]
      ``contact-page-1+!>(`^page`u.page)
        ::
        [%x %v1 %book %id =cid ~]
      ?~  id=`(unit @uv)`(slaw %uv cid.pat)
        [~ ~]
      =/  page=(unit page)
        (~(get by book) id+u.id)
      ?~  page
        [~ ~]
      ``contact-page-1+!>(`^page`u.page)
        [%x %v1 %contact her=@p ~]
      ?~  who=`(unit @p)`(slaw %p her.pat)
        [~ ~]
      ?~  far=(~(get by peers) u.who)
        [~ ~]
      ?~  page=(~(get by book) u.who)
        ``contact-1+!>(`contact-1`?~(for.u.far ~ con.for.u.far))
      ``contact-1+!>((contact-mod u.page))
        ::
        [%x %v1 %peer her=@p ~]
      ::
      ::  not a peer
      ?~  who=`(unit @p)`(slaw %p her.pat)
        [~ ~]
      ::
      ::  peer not found
      ?~  far=(~(get by peers) u.who)
        [~ ~]
      ::
      ::  peer has no profile
      :: ?~  for.u.far
      ::   [~ ~]
      ``contact-foreign-1+!>(`foreign-1`u.far)
    ==
  ::
  ++  peer
    |=  pat=(pole knot)
    ^+  cor
    ?+  pat  ~|(bad-watch-path+pat !!)
      ::  v0
      [%contact ~]  (p-init-0:pub ~)
      [%contact %at wen=@ ~]  (p-init-0:pub `(slav %da wen.pat))
      [%news ~]  ~|(local-news+src.bowl ?>(=(our src):bowl cor))
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
      [%contact ~]  si-abet:(si-take:(sub src.bowl) sign)
      [%epic ~]     si-abet:(pe-take:si-epic:(sub src.bowl) sign)
      ::
      ::   [%migrate ~]
      :: ?>  ?=(%poke-ack -.sign)
      :: ?~  p.sign  cor
      :: %-  (slog leaf/"{<wire>} failed" u.p.sign)
      :: cor
    ==
  --
--
