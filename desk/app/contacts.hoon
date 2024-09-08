/-  *contacts
/+  default-agent, dbug, verb
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
+|  %help
::
::  +cy: contact map engine
::
++  cy
  |_  c=contact-1
  ::  +get: get typed value
  ::
  ++  get
    |*  [key=@tas typ=value-type-1]
    ^-  (unit _p:*$>(_typ value-1))
    =/  val=(unit value-1)  (~(get by c) key)
    ?~  val  ~
    ?~  u.val  !!
    ~|  "{<typ>} expected at {<key>}"
    ::  XX Hoon compiler really needs to eat more fish
    :: ?>  ?=($>(_typ value-1) -.u.val)
    :: +.u.val
    ::
    ?-  typ
      %text  ?>(?=(%text -.u.val) (some p.u.val))
      %date  ?>(?=(%date -.u.val) (some p.u.val))
      %tint  ?>(?=(%tint -.u.val) (some p.u.val))
      %ship  ?>(?=(%ship -.u.val) (some p.u.val))
      %look  ?>(?=(%look -.u.val) (some p.u.val))
      %cult  ?>(?=(%cult -.u.val) (some p.u.val))
      %set   ?>(?=(%set -.u.val) (some p.u.val))
    ==
  ::  +gos: got specialized to set
  ::
  ++  gos
    |*  [key=@tas typ=value-type-1]
    ::  XX make Hoon compiler smarter
    ::  to be able to specialize to uniform set of
    ::  type typ.
    :: =*  vat  $>(_typ value-1)
    :: ^-  (set _+:*vat)
    ::
    =/  val=value-1  (~(got by c) key)
    ?~  val  !!
    ~|  "set expected at {<key>}"
    ?>  ?=(%set -.val)
    p.val
  ::  +gut: got with default
  ::
  ++  gut
    |*  [key=@tas def=value-1]
    ^+  +.def
    =/  val=value-1  (~(gut by c) key ~)
    ?~  val
      +.def
    ~|  "{<-.def>} expected at {<key>}"
    :: XX wish for Hoon compiler to be smarter.
    :: this results in fish-loop.
    :: ?+  -.def  !!
    ::   %text  ?>(?=(%text -.val) +.val)
    :: ==
    :: ?>  ?=(_-.def -.val)
    ?-  -.val
      %text  ?>(?=(%text -.def) p.val)
      %date  ?>(?=(%date -.def) p.val)
      %tint  ?>(?=(%tint -.def) p.val)
      %ship  ?>(?=(%ship -.def) p.val)
      %look  ?>(?=(%look -.def) p.val)
      %cult  ?>(?=(%cult -.def) p.val)
      %set   ?>(?=(%set -.def) p.val)
    ==
  ::  +gub: got with bunt default
  ::
  ++  gub
    |*  [key=@tas typ=value-type-1]
    ^+  +:*$>(_typ value-1)
    =/  val=value-1  (~(gut by c) key ~)
    ?~  val
      ?+  typ  !!
        %text  p:*$>(%text value-1)
        %date  p:*$>(%date value-1)
        %tint  p:*$>(%tint value-1)
        %ship  p:*$>(%ship value-1)
        %look  p:*$>(%look value-1)
        %cult  p:*$>(%cult value-1)
        %set   p:*$>(%set value-1)
      ==
    :: ~|  "{<key>} expected to be {<-.def>}"
    :: XX wish for Hoon compiler to be smarter.
    :: this results in fish-loop.
    :: ?+  -.def  !!
    ::   %text  ?>(?=(%text -.val) +.val)
    :: ==
    :: ?>  ?=(_-.def -.val)
    ::
    ?-  typ
      %text  ?>(?=(%text -.val) p.val)
      %date  ?>(?=(%date -.val) p.val)
      %tint  ?>(?=(%tint -.val) p.val)
      %ship  ?>(?=(%ship -.val) p.val)
      %look  ?>(?=(%look -.val) p.val)
      %cult  ?>(?=(%cult -.val) p.val)
      %set   ?>(?=(%set -.val) p.val)
    ==
  --
++  do-edit  do-edit-0
++  do-edit-0
  |=  [c=contact-0 f=field-0]
  ^+  c
  ?-  -.f
    %nickname   c(nickname nickname.f)
    %bio        c(bio bio.f)
    %status     c(status status.f)
    %color      c(color color.f)
  ::
    %avatar     ~|  "cannot add a data url to avatar!"
                ?>  ?|  ?=(~ avatar.f)
                        !=('data:' (end 3^5 u.avatar.f))
                    ==
                c(avatar avatar.f)
  ::
    %cover      ~|  "cannot add a data url to cover!"
                ?>  ?|  ?=(~ cover.f)
                        !=('data:' (end 3^5 u.cover.f))
                    ==
                c(cover cover.f)
  ::
    %add-group  c(groups (~(put in groups.c) flag.f))
  ::
    %del-group  c(groups (~(del in groups.c) flag.f))
  ==
++  do-edit-1
  |=  [con=contact-1 edit=(map @tas value-1)]
  ^+  con
  =/  don  (~(uni by con) edit)
  :: XX are these checks neccessary?
  :: if so, we need to introduce link field.
  ::
  =+  avatar=(~(get cy don) %avatar %text)
  ?:  ?&  ?=(^ avatar)
          =('data:' (end 3^5 u.avatar))
      ==
    ~|  "cannot add a data url to avatar"  !!
  =+  cover=(~(get cy don) %cover %text)
  ?:  ?&  ?=(^ cover)
          !=('data:' (end 3^5 u.cover))
      ==
    ~|  "cannot add a data url to cover"  !!
  ::
  don
::  +to-contact-1: convert contact-0
::
++  to-contact-1
  |=  c=contact-0
  ^-  contact-1
  ~&  contact-0-to-1+c
  =/  o=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    :~  nickname+text/nickname.c
        bio+text/bio.c
        status+text/status.c
        color+tint/color.c
    ==
  =?  o  ?=(^ avatar.c)
    (~(put by o) %avatar text/u.avatar.c)
  =?  o  ?=(^ cover.c)
    (~(put by o) %cover text/u.cover.c)
  =?  o  !?=(~ groups.c)
    %+  ~(put by o)  %groups
    :-  %set
    %-  ~(run in groups.c)
    |=  =flag:g
    cult/flag
  o
::  +to-contact-0: convert contact-1
::
++  to-contact-0
  |=  c=contact-1
  ^-  $@(~ contact-0)
  ?~  c  ~
  =|  o=contact-0
  %=  o
    nickname
      (~(gub cy c) %nickname %text)
    bio
      (~(gut cy c) %bio text/'')
    status
      (~(gut cy c) %status text/'')
    color
      (~(gut cy c) %color tint/0x0)
    avatar
      :: XX prohibit data: link
      (~(get cy c) %avatar %text)
    cover
      :: XX prohibit data: link
      (~(get cy c) %cover %text)
    groups
      =/  groups
        (~(get cy c) %groups %set)
      ?~  groups  ~
      ^-  (set flag:g)
      %-  ~(run in u.groups)
      |=  val=value-1
      ?>  ?=(%cult -.val)
      p.val
  ==
::  +contact-mod: merge contacts
::
++  contact-mod
  |=  [c=contact-1 mod=contact-1]
  (~(uni by c) mod)
::  +to-profile-1: convert profile-0
::
++  to-profile-1
  |=  o=profile-0
  ^-  profile-1
  [wen.o ?~(con.o ~ (to-contact-1 con.o))]
::  +to-profile-0: convert profile-1
::
++  to-profile-0
  |=  p=profile-1
  ^-  profile-0
  [wen.p (to-contact-0 con.p)]
::
++  to-profile-0-mod
  |=  [p=profile-1 mod=contact-1]
  ^-  profile-0
  [wen.p (to-contact-0 (contact-mod con.p mod))]
::
++  to-foreign-0
  |=  f=foreign-1
  ^-  foreign-0
  [?~(for.f ~ (to-profile-0 for.f)) sag.f]
::  +to-foreign-0-mod: convert foreign-1 with contact overlay
::
++  to-foreign-0-mod
  |=  [f=foreign-1 mod=contact-1]
  ^-  foreign-0
  [?~(for.f ~ (to-profile-0-mod for.f mod)) sag.f]
::  +foreign-mod: fuse peer contact with overlay
::
++  foreign-mod
  |=  [far=foreign-1 mod=contact-1]
  ^-  foreign-1
  ?~  for.far
    far
  far(con.for (contact-mod con.for.far mod))
::  +foreign-contact: grab foreign contact
::
++  foreign-contact
  |=  far=foreign-1
  ^-  contact-1
  ?~(for.far ~ con.for.far)
::  +to-rolodex-1: convert rolodex-0
::
:: ++  to-rolodex-1
::   |=  [eny=@uvJ r=rolodex-0]
::   ^-  rolodex-1
::   %-  ~(rep by r)
::   |=  $:  [=ship raf=foreign-0]
::           acc=rolodex-1
::       ==
::   =+  cid=(gen-cid eny book.acc)
::   =/  far=foreign-1
::     ?~  for.raf
::       [~ sag.raf]
::     [(some cid) sag.raf]
::   %_  acc
::     book
::       ?~  for.raf  book.acc
::       ?~  con.for.raf
::         (~(put by book.acc) cid *page)
::       %+  ~(put by book.acc)
::         cid
::       ^-  page
::       [[wen.for.raf (to-contact-1 con.for.raf)] ~]
::     net
::       (~(put by net.acc) ship far)
::   ==
::
++  to-edit-1
  |=  edit-0=(list field-0)
  ^-  (map @tas value-1)
  =;  [edit-1=(map @tas value-1) groups=(set $>(%cult value-1))]
    ?~  groups
      edit-1
    (~(put by edit-1) %groups set/groups)
  ::
  %+  roll  edit-0
    |=  $:  fed=field-0
            acc=(map @tas value-1)
            gan=(set $>(%cult value-1))
        ==
    ::
    ^+  [acc gan]
    ::  XX improve this by taking out :_ gan
    ::  outside
    ?-  -.fed
        ::
        %nickname
      :_  gan
      %+  ~(put by acc)
        %nickname
      text/nickname.fed
        ::
        %bio
      :_  gan
      %+  ~(put by acc)
        %bio
      text/bio.fed
        ::
        %status
      :_  gan
      %+  ~(put by acc)
        %status
      text/status.fed
        ::
        %color
      :_  gan
      %+  ~(put by acc)
        %color
      tint/color.fed
        ::
        %avatar
      ?~  avatar.fed  [acc gan]
      :_  gan
      %+  ~(put by acc)
        %avatar
      look/u.avatar.fed
        ::
        %cover
      ?~  cover.fed  [acc gan]
      :_  gan
      %+  ~(put by acc)
        %cover
      look/u.cover.fed
        ::
        %add-group
      :-  acc
      (~(put in gan) [%cult flag.fed])
        ::
        %del-group
      :-  acc
      (~(del in gan) [%cult flag.fed])
    ==

++  to-action-1
  ::  o=$<(%meet action-0)
  |=  o=action-0
  ^-  action-1
  ?-  -.o
    %anon  [%anon ~]
    %edit  [%self (to-edit-1 p.o)]
    ::
    :: old %meet is now a no-op
    %meet  [%meet ~]
    %heed  [%meet p.o]
    %drop  [%drop p.o]
    %snub  [%snub p.o]
  ==
::
++  mono
  |=  [old=@da new=@da]
  ^-  @da
  ?:  (lth old new)  new
  (add old ^~((rsh 3^2 ~s1)))
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
        :: =/  peer=foreign-1
        ::   ~|  unknown-peer+u.who
        ::   (~(got by peers) kip)
        ::
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
      =.  cor
        %+  p-news-0  who
          (to-contact-0 (~(uni by con) mod))
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
          %live  =.  peers  (~(put by peers) who [for sag])
                 ::  NB: this assumes con.for is only set in +si-hear
                 ::
                 ?.  new  cor
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
               ::  update peer contact
               ::
               =/  page=(unit page)  (~(get by book) who)
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
      ?-  -.act
        %anon  p-anon:pub
        %self  (p-self:pub p.act)
        %page  (p-page:pub p.act q.act)
        %spot  (p-spot:pub p.act q.act)
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
  ::  /x/v1/peer/her=@p -> $foreign-1
  ::  /x/v1/contact/her=@p -> $contact-1
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
        ::
        [%x %v1 %peer her=@p ~]
      ?~  who=`(unit @p)`(slaw %p her.pat)
        [~ ~]
      ?~  far=(~(get by peers) u.who)
        [~ ~]
      ``foreign-1+!>(u.far)
        ::
        [%x %v1 %contact her=@p ~]
      ?~  who=`(unit @p)`(slaw %p her.pat)
        [~ ~]
      =/  page=(unit page)
        (~(get by book) u.who)
      ::
      ::  peer not in the contact book
      ?~  page
        [~ ~]
      ``contact-1+!>((contact-mod u.page))
    ==
  ::
  ++  peer
    |=  pat=(pole knot)
    ^+  cor
    ?+  pat  ~|(bad-watch-path+pat !!)
      ::
      [%contact ~]  (p-init-0:pub ~)
      [%contact %at wen=@ ~]  (p-init-0:pub `(slav %da wen.pat))
      [%news ~]  ~|(local-news+src.bowl ?>(=(our src):bowl cor))
      ::  XX confirm that giving a fact in a gall agent on ~ outside of
      ::  on-watch does nothing (subs returns ~ on empty subscriber)
      ::
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
