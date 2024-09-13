/-  c=contacts, g=groups
/+  gj=groups-json
|%
++  enjs
  =,  enjs:format
  |%
  ::  XX shadowed for compat, +ship:enjs removes the ~
  ::
  ++  ship
    |=(her=@p n+(rap 3 '"' (scot %p her) '"' ~))
  ::
  ++  cid
    |=  =cid:c
    ^-  json
    s+(scot %uv cid)
  ::
  ++  kip
    |=  =kip:c
    ^-  json
    ?@  kip
      (ship kip)
    (cid +.kip)
  ::
  ++  value
    |=  val=value-1:c
    ^-  json
    ?-  -.val
      %text  (pairs type+s/%text value+s/p.val ~)
      %date  (pairs type+s/%date value+s/(scot %da p.val) ~)
      %tint  (pairs type+s/%tint value+s/(rsh 3^2 (scot %ux p.val)) ~)
      %ship  (pairs type+s/%ship value+(ship p.val) ~)
      %look  (pairs type+s/%look value+s/p.val ~)
      %cult  (pairs type+s/%cult value+s/(flag:enjs:gj p.val) ~)
      %set   (pairs type+s/%set value+a/(turn ~(tap in p.val) value) ~)
    ==
  ::
  ++  contact
    |=  c=contact-1:c
    ^-  json
    o+(~(run by c) value)
  ::
  ++  page
    |=  =page:c
    ^-  json
    a+[(contact p.page) (contact q.page) ~]
  ::  +$  kip $@(@p [%id cid])
  ::  +$  book  (map kip page)
  ++  book
    |=  =book:c
    ^-  json
    =|  kob=(map @ta json)
    :-  %o
    %-  ~(rep by book)
    |=  [[=kip:c =page:c] acc=_kob]
    ?^  kip
      (~(put by acc) (scot %uv +.kip) (^page page))
    (~(put by acc) (scot %p kip) (^page page))
  ::
  ++  directory
    |=  =directory:c
    ^-  json
    =|  dir=(map @ta json)
    :-  %o
    %-  ~(rep by directory)
    |=  [[who=@p con=contact-1:c] acc=_dir]
    (~(put by acc) (scot %p who) (contact con))
  ::
  ++  news
    |=  n=news-1:c
    ^-  json
    ?-  -.n
      %self  (frond self+(contact con.n))
      %page  %-  pairs
             :~  kip+(kip kip.n)
                 con+(contact con.n)
                 mod+(contact mod.n)
             ==
      %wipe  (frond kip+(kip kip.n))
      %peer  %-  pairs
             :~  who+(ship who.n)
                 con+(contact con.n)
             ==
    ==
  --
::
++  dejs
  =,  dejs:format
  |%
  ::
  ++  ship  (se %p)
  ::
  ++  cid
    |=  jon=json
    ^-  cid:c
    ?>  ?=(%s -.jon)
    (slav %uv p.jon)
  ::
  ++  kip
    |=  jon=json
    ^-  kip:c
    ?>  ?=(%s -.jon)
    ?:  =('~' (end [3 1] p.jon))
      (ship jon)
    id+(cid jon)
  ::
  ++  ta
    |*  [mas=@tas wit=fist]
    |=  jon=json
    [mas (wit jon)]
  ::
  ++  value
    ^-  $-(json value-1:c)
    |=  jon=json
    ::  XX is there a way to do it in one go?
    ::
    =/  [type=@tas val=json]
      %.  jon
      (ot text+(se %tas) value+json ~)
    ?+  type  !!
      %text  %.  val  (ta %text so)
      %date  %.  val  (ta %date (se %da))
      ::  XX invert arguments in +cu: arguments likely
      ::  to be heavy should always be at the back
      ::
      %tint  %.  val
             %+  ta  %tint
             %+  cu
             |=(s=@t (slav %ux (cat 3 '0x' s)))
             so
      %ship  %.  val  (ta %ship ship)
      %look  %.  val  (ta %look so)
      %cult  %.  val  (ta %cult flag:dejs:gj)
      %set   %.  val  (ta %set (as value))
    ==
  ++  contact
    ^-  $-(json contact-1:c)
    (om value)
  ++  action
    ^-  $-(json action-1:c)
    %-  of
    :~  anon+ul
        self+contact
        page+(ot cid+cid contact+contact ~)
        spot+(ot ship+ship contact+contact ~)
        edit+(ot kip+kip contact+contact ~)
        wipe+(ar kip)
        meet+(ar ship)
        drop+(ar ship)
        snub+(ar ship)
    ==
  --
--