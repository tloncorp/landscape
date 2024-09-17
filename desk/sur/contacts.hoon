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
::
+$  value-type
  $?  %text
      %date
      %tint
      %look
      %cult
      %set
  ==
::    $value: contact field value
::
+$  value
  $+  contact-value
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
      [%set p=$|((set value) unis)]
  ==
::  +unis: whether set is uniformly typed
::
++  unis
  |=  set=(set value)
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
::    $contact: contact data
::
+$  contact  (map @tas value)
::    $profile: contact profile
::
::  .wen: last updated
::  .con: contact
::
+$  profile  [wen=@da con=contact]
::    $foreign: foreign profile
::
::  .for: profile
::  .sag: connection status
::
+$  foreign  [for=$@(~ profile) sag=$@(~ saga)]
::    $page: contact page
::
::  .p: peer contact
::  .q: user overlay
::
+$  page  (pair contact contact)
::    $cid: contact page id
::
+$  cid  @uvF
::    $kip: contact book key
::
+$  kip  $@(ship [%id cid])
::    $book: contact book
::
+$  book  (map kip page)
::    $directory: merged contacts
::
+$  directory  (map ship contact)
::    $peers: network peers
::
+$  peers  (map ship foreign)
::
+$  epic  epic:e
::
+$  saga
  $?  %want    ::  subscribing
      ~        ::  none intended
  ==
::  %anon: delete the profile
::  %self: edit the profile
::  %page: create a new contact page
::  %spot: add peer as a contact
::  %edit: edit a contact overlay
::  %wipe: delete a contact page
::  %meet: track a peer
::  %drop: discard a peer
::  %snub: unfollow a peer
::
+$  action
  $%  [%anon ~]
      [%self p=contact]
      [%page p=cid q=contact]
      [%spot p=ship q=contact]
      [%edit p=kip q=contact]
      [%wipe p=(list kip)]
      [%meet p=(list ship)]
      [%drop p=(list ship)]
      [%snub p=(list ship)]
  ==
::  network update
::
::  %full: our profile
::
+$  update
  $%  [%full profile]
  ==
::    $news: local update
::
::  %self: profile update
::  %page: contact page update
::  %wipe: contact page delete
::  %peer: peer update
::
+$  news
  $%  [%self con=contact]
      [%page =kip con=contact mod=contact]
      [%wipe =kip]
      [%peer who=ship con=contact]
  ==
+|  %legacy
::
++  legacy
  |%
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
  +$  foreign-0  [for=$@(~ profile-0) sag=$@(~ saga-0)]
  +$  profile-0  [wen=@da con=$@(~ contact-0)]
  +$  rolodex-0  (map ship foreign-0)
  ::
  +$  saga-0
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
        [%color color=@ux]
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
  --
--
