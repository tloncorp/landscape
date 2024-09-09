/-  *contacts
|%
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
--
