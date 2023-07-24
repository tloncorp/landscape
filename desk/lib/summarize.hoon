::  summarize: utilities for summarizing groups/chat state in various ways
::
/-  chat, groups
::
|_  [our=@p now=@da]
::  +range: period of time to summarize over
::  +limit: max amount of msgs to count per channel
::
++  range  ~d7
++  limit  9.999
::
++  scry-path
  |=  [=term =spur]
  [(scot %p our) term (scot %da now) spur]
::
++  summarize-activity
  ^-  $:  sent=@ud
          received=@ud
          most-sent-group=@t
      ==
  =-  :+  s  r
      =/  g=flag:chat
        =<  -
        ::TODO  crashes if no groups
        %+  snag  0
        %+  sort  ~(tap by g)
        |=([[* a=@ud] [* b=@ud]] (gth a b))
      =<  title.meta
      .^  group:groups
        %gx
        (scry-path %groups /groups/(scot %p p.g)/[q.g]/group)
      ==
  %+  roll
    %~  tap  in
    .^  (map flag:chat chat:chat)
      %gx
      (scry-path %chat /chats/chats)
    ==
  =*  onn  ((on time writ:chat) lte)
  |=  [[c=flag:chat chat:chat] g=(map flag:chat @ud) s=@ud r=@ud]
  =+  .^  log=((mop time writ:chat) lte)
        %gx
        %+  scry-path  %chat
        /chat/(scot %p p.c)/[q.c]/writs/newer/(scot %ud (sub now range))/(scot %ud limit)/chat-writs
      ==
  :-  %+  ~(put by g)  group.perm
      (add (~(gut by g) group.perm 0) (wyt:onn log))
  %+  roll  (tap:onn log)
  |=  [[time writ:chat] s=_s r=_r]
  ?:(=(our author) [+(s) r] [s +(r)])
::
++  summarize-inactivity
  ^-  $:  unread-dms=@ud  ::  unread dm count
          unread-etc=@ud  ::  unread chats count
          top-group=@t    ::  most active group
          top-channel=@t  ::  most active channel
      ==
  =+  .^  =briefs:chat
        %gx
        (scry-path %chat /briefs/chat-briefs)
      ==
  ::  accumulate unread counts
  ::
  =/  [dum=@ud duc=@ud]
    %-  ~(rep by briefs)
    |=  [[w=whom:chat brief:briefs:chat] n=@ud m=@ud]
    ?:  ?=(%flag -.w)  [n (add m count)]
    [(add n count) m]
  :+  dum  duc
  ::  gather all chat channels & their groups & unread counts
  ::
  =/  faz=(list [g=flag:chat c=flag:chat n=@ud])
    %+  turn
      %~  tap  in
      .^  (map flag:chat chat:chat)
        %gx
        (scry-path %chat /chats/chats)
      ==
    |=  [c=flag:chat chat:chat]
    :+  group.perm  c
    count:(~(gut by briefs) flag+c *brief:briefs:chat)
  =.  faz  (sort faz |=([[* * a=@ud] [* * b=@ud]] (gth a b)))
  ::  get display titles of most active channel and its group
  ::
  ::NOTE  in rare cases, we might not know of the existence of the associated
  ::      group. simply skip past it and try the next one...
  =+  .^  =groups:groups
        %gx
        =-  ~&  [%scrying -]  -
        (scry-path %groups /groups/groups)
      ==
  |-
  ?~  faz  ['???' '???']  ::TODO  better copy
  ?.  (~(has by groups) g.i.faz)
    $(faz t.faz)
  =/  =group:^groups  (~(got by groups) g.i.faz)
  :-  title.meta.group
  title.meta:(~(got by channels.group) %chat c.i.faz)
--