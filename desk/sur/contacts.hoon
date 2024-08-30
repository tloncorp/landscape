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
      color=@ux
      avatar=(unit @t)
      cover=(unit @t)
      groups=(set flag:g)
  ==
::
+$  foreign-0  [for=$@(~ profile-0) sag=$@(~ saga)]
+$  profile-0  [wen=@da con=$@(~ contact-0)]
+$  rolodex-0  (map ship foreign-0)
::
::
+$  value-type-1
  $?  %text
      %date
      %tint
      %look
      %cult
      %set
  ==
++  unis 
  |=  set=(set value-1)
  ^-  ?
  ?~  set  &
  =/  typ  -.n.set
  |-
  ?^  l.set
    ?.  =(typ -.n.l.set)
      |
    $(set l.set)
  ?^  r.set
    ?.  =(typ -.n.r.set)
      |
    $(set r.set)
  ?.  =(typ -.n.set)
    |
  &
::    $value-1: contact field value
::
+$  value-1 
  $+  contact-value-1
  $@  ~
  $%  [%text p=@t]
      [%date p=@da]
      ::
      ::  color
      [%tint p=@ux]
      [%ship p=ship]
      ::
      ::  picture
      [%look p=@ta]
      ::
      ::  group
      [%cult p=flag:g]
      ::
      ::  uniform set
      [%set $|(p=(set value-1) unis)]
  ==
::    $contact-1: contact data
::
+$  contact-1  (map @tas value-1)
::    $foreign-1: foreign profile
::
::  .for: profile
::  .con: optional contact id
::  .sag: connection status
::
+$  foreign-1  [for=$@(~ profile-1) cid=(unit cid) sag=$@(~ saga)]
::    $cid: contact page id
::
::  generated from entropy and guaranteed non-zero
::  
::
+$  cid  @uvF
::    $profile-1: contact profile
::
::  .wen: last updated
::  .con: contact
::
+$  profile-1  [wen=@da con=contact-1]
::    $page: contact book page
::
+$  page  (pair (unit ship) $@(~ profile-1))
::    $book: contact book
::  
+$  book  (map cid page)
::    $rolodex-1: rolodex
::
::  .book: contact book
::  .peers: network contacts
::  .block: network blacklist
::
+$  rolodex-1
  $:  =book
      peers=(map ship foreign-1)
      block=(set ship)
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
::  %anon: delete the profile
::  %page: create a new contact page
::  %edit: edit the profile or a contact page
::  %wipe: delete a page
::  %spot: associate a page
::  %meet: track a peer
::  %drop: discard a peer
::  %snub: unfollow a peer
::
+$  action-1
  $%  [%anon ~]
      [%page p=(list (pair @tas value-1))]
      ::
      ::  .p=~ edit the profile
      [%edit p=(unit cid) q=(list (pair @tas value-1))]
      [%spot p=(list (pair ship cid))]
      [%wipe p=(list cid)]
      [%meet p=(list ship)]
      [%drop p=(list ship)]
      [%snub p=(list ship)]
  ==
::  network
::  
::  %full: deliver full profile
::
+$  update-1
  $%  [%full $@(~ profile-1)]
  ==
::  local
::
::  user-modified fields take priority
::
+$  news-1
  $%  [%full who=ship con=$@(~ contact-1)]
  ==
+|  %version
++  foreign  foreign-0
++  rolodex  rolodex-0
++  contact  contact-0
++  action  action-0
++  profile  profile-0
++  news  news-0
++  update  update-0
++  field  field-0
--
