/-  e=epic, g=groups
|%
::  [compat] protocol-versioning scheme
::
::    adopted from :groups, slightly modified.
::
::    for our action/update marks, we
::      - *must* support our version (+okay)
::      - *should* support previous versions (especially actions)
::      - but *can't* support future versions
::
::    in the case of updates at unsupported protocol versions,
::    we backoff and subscribe for version changes (/epic).
::    (this alone is unlikely to help with future versions,
::    but perhaps our peer will downgrade. in the meantime,
::    we wait to be upgraded.)
::
+|  %compat
++  okay  `epic`1
++  mar
  |%
  ++  base
    |%
    +$  act  %contact-action
    +$  upd  %contact-update
    --
  ::
  ++  act  `mark`^~((rap 3 *act:base '-' (scot %ud okay) ~))
  ++  upd  `mark`^~((rap 3 *upd:base '-' (scot %ud okay) ~))
  --
::
+|  %types
+$  contact-0
  $:  nickname=@t
      bio=@t
      status=@t
      color=@uxF
      avatar=(unit @t)
      cover=(unit @t)
      groups=(set flag:g)
  ==
::
+$  foreign-0  [for=$@(~ profile-0) sag=$@(~ saga)]
+$  profile-0  [wen=@da con=$@(~ contact-0)]
+$  rolodex-0  (map ship foreign-0)
::
+$  contact  contact-0
+$  foreign  foreign-0
+$  profile  profile-0
+$  rolodex  rolodex-0
+$  field  field-0
+$  action  action-0
+$  news  news-0
+$  update  update-0
::
+$  field-1
  $%  [%text p=@t]
      [%date p=@da]
      [%quot p=@ud]
      [%frac p=@rd]
      ::
      ::  color
      [%tint p=@ux]
      [%ship p=ship]
      ::
      ::  picture
      [%look p=@ta]
      ::
      ::  network resource
      [%link p=@ta]
      ::
      ::  geocode (XX introduce @x aura to Hoon)
      [%geos @x]
      [%tags p=(set @t)]
      ::  XX typechecker could be smarter here?
      [%rows p=$@(~ (list field-1))]
      [%set p=$@(~ (set field-1))]
  ==
+$  contact-1  (map @tas field-1)
+$  foreign-1  [for=$@(~ profile-1) sag=$@(~ saga)]
::  .wen: date
::  .con: contact
::  .mod: user modified
::
+$  profile-1  [wen=@da con=(unit contact-1) mod=(unit contact-1)]
::
::  contact id
+$  cid  @uvF
+$  rolodex-1
  $%  rox=(map cid @ta)
      net=(map ship cid)
  ==
::
+$  epic  epic:e
+$  saga
  $@  $?  %want    ::  subscribing
          %fail    ::  %want failed
          %lost    ::  epic %fail
          ~        ::  none intended
      ==
  saga:e
::
+$  field-0
  $%  [%nickname nickname=@t]
      [%bio bio=@t]
      [%status status=@t]
      [%color color=@uxF]
      [%avatar avatar=(unit @t)]
      [%cover cover=(unit @t)]
      [%add-group =flag:g]
      [%del-group =flag:g]
  ==
::
+$  action-0
  ::  %anon: delete our profile
  ::  %edit: change our profile
  ::  %meet: track a peer
  ::  %heed: follow a peer
  ::  %drop: discard a peer
  ::  %snub: unfollow a peer
  ::
  $%  [%anon ~]
      [%edit p=(list field-0)]
      [%meet p=(list ship)]
      [%heed p=(list ship)]
      [%drop p=(list ship)]
      [%snub p=(list ship)]
  ==
::  network
::
+$  update-0
  $%  [%full profile-0]
  ==
::  local
::
+$  news-0
  [who=ship con=$@(~ contact-0)]
::  %anon: delete our profile
::  %edit: change profile
::  %meet: track a peer
::  %heed: follow a peer
::  %spot: discover contact peer
::  %drop: discard a peer
::  %snub: unfollow a peer
::
+$  action-1
  $%  [%anon ~]
      [%edit p=ship q=(list (pair @t field-1))]
      [%meet p=(list ship)]
      [%heed p=(list ship)]
      [%spot p=(list (pair ship cid))]
      [%drop p=(list ship)]
      [%snub p=(list ship)]
  ==
::  network
::
+$  update-1
  $%  [%full profile-1]
      [%field (pair @tas (unit field-1))]
  ==
::  local
::
+$  news-1
  $%  [%full who=ship con=(unit contact-1)]
      [%field who=ship fil=(pair @tas (unit field-1))]
  ==
--
