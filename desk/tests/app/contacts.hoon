/-  *contacts
/+  *test-agent
/=  contacts-agent  /app/contacts
=*  agent  contacts-agent
::
|%
+|  %help
++  mono
  |=  [old=@da new=@da]
  ^-  @da
  ?:  (lth old new)  new
  (add old ^~((rsh 3^2 ~s1)))
++  tick  ^~((rsh 3^2 ~s1))
+|  %poke-0
::
::  +test-poke-anon-0: v0 delete the profile
::
++  test-poke-anon-0
  %-  eval-mare
  =/  m  (mare ,~)
  =*  b  bind:m
  ^-  form:m
  ;<  caz=(list card)  b  (do-init %contacts contacts-agent)
  ;<  =bowl  b  get-bowl
  ::
  =|  con-0=contact-0
  =.  nickname.con-0  'Zod'
  =.  bio.con-0  'The first of the galaxies'
  ::
  =/  con-1=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Zod' bio+text/'The first of the galaxies']
  =/  edit-0=(list field-0)
    ^-  (list field-0)
    :~  nickname+'Zod'
        bio+'The first of the galaxies'
    ==
  ::  foreign subscriber to /contact
  ::
  ;<  ~  b  (set-src ~sun)
  ;<  caz=(list card)  b  (do-watch /contact)
  ::  local subscriber to /news
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-watch /news)
  ::
  ;<  ~  b  (set-src our.bowl)
  ::  action-0 profile %edit
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action !>([%edit edit-0]))
  ::
  =/  upd-0=update-0
    [%full (mono now.bowl now.bowl) ~]
  =/  upd-1=update-1
    [%full (mono now.bowl now.bowl) ~]
  ;<  caz=(list card)  b  (do-poke %contact-action !>([%anon ~]))
  %+  ex-cards  caz
  :~  (ex-fact ~[/contact] %contact-update !>(upd-0))
      (ex-fact ~ %contact-update-1 !>(upd-1))
      (ex-fact ~[/news] %contact-news !>([our.bowl ~]))
      (ex-fact ~[/v1/news] %contact-news-1 !>([%self ~]))
  ==
::  +test-poke-edit-0: v0 edit the profile
::
++  test-poke-edit-0
  %-  eval-mare
  =/  m  (mare ,~)
  =*  b  bind:m
  ^-  form:m
  ;<  caz=(list card)  b  (do-init %contacts contacts-agent)
  ;<  =bowl  b  get-bowl
  ::
  =|  con-0=contact-0
  =.  nickname.con-0  'Zod'
  =.  bio.con-0  'The first of the galaxies'
  ::
  =/  con-1=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Zod' bio+text/'The first of the galaxies']
  ::
  =/  upd-0=update-0
    [%full now.bowl con-0]
  =/  upd-1=update-1
    [%full now.bowl con-1]
  =/  edit-0=(list field-0)
    ^-  (list field-0)
    :~  nickname+'Zod'
        bio+'The first of the galaxies'
    ==
  ::  foreign subscriber to /contact
  ::
  ;<  ~  b  (set-src ~sun)
  ;<  caz=(list card)  b  (do-watch /contact)
  ::  local subscriber to /news
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-watch /news)
  ::
  ;<  ~  b  (set-src our.bowl)
  ::  action-0 profile %edit
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action !>([%edit edit-0]))
  %+  ex-cards  caz
  :~  (ex-fact ~[/contact] %contact-update !>(upd-0))
      (ex-fact ~ %contact-update-1 !>(upd-1))
      (ex-fact ~[/news] %contact-news !>([our.bowl con-0]))
      (ex-fact ~[/v1/news] %contact-news-1 !>([%self con-1]))
  ==
::  +test-poke-meet-0: v0 meet a peer
::
:: ++  test-poke-meet-0
::   %-  eval-mare
::   =/  m  (mare ,~)
::   =*  b  bind:m
::   ^-  form:m
::   ;<  caz=(list card)  b  (do-init %contacts contacts-agent)
::   ;<  =bowl  b  get-bowl
::   ::  v0 %meet is no-op
::   ::
::   ;<  caz=(list card)  b  (do-poke %contact-action !>([%meet ~[~sun]]))
::   (ex-cards caz ~)
::
+|  %poke
::  +test-poke-self: change the profile
::
++  test-poke-self
  %-  eval-mare
  =/  m  (mare ,~)
  =*  b  bind:m
  ^-  form:m
  ;<  caz=(list card)  b  (do-init %contacts contacts-agent)
  ;<  =bowl  b  get-bowl
  ::
  =|  con-0=contact-0
  =.  nickname.con-0  'Zod'
  =.  bio.con-0  'The first of the galaxies'
  ::
  =/  con-1=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Zod' bio+text/'The first of the galaxies']
  ::
  =/  upd-0=update-0
    [%full now.bowl con-0]
  =/  upd-1=update-1
    [%full now.bowl con-1]
  =/  edit-1  con-1
  ::  foreign subscriber to /contact
  ::
  ;<  ~  b  (set-src ~sun)
  ;<  caz=(list card)  b  (do-watch /v1/contact)
  ::  local subscriber to /news
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-watch /v1/news)
  ::
  ;<  ~  b  (set-src our.bowl)
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%self con-1]))
  %+  ex-cards  caz
  :~  (ex-fact ~ %contact-update !>(upd-0))
      (ex-fact ~[/v1/contact] %contact-update-1 !>(upd-1))
      (ex-fact ~[/news] %contact-news !>([our.bowl con-0]))
      (ex-fact ~[/v1/news] %contact-news-1 !>([%self con-1]))
  ==
::  +test-poke-anon: delete the profile
::
++  test-poke-anon
  %-  eval-mare
  =/  m  (mare ,~)
  =*  b  bind:m
  ^-  form:m
  ;<  caz=(list card)  b  (do-init %contacts contacts-agent)
  ;<  =bowl  b  get-bowl
  ::
  =/  con-1=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Zod' bio+text/'The first of the galaxies']
  ::
  =/  edit-1  con-1
  ::  foreign subscriber to /contact
  ::
  ;<  ~  b  (set-src ~sun)
  ;<  caz=(list card)  b  (do-watch /v1/contact)
  ::  local subscriber to /news
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-watch /v1/news)
  ::
  ;<  ~  b  (set-src our.bowl)
  ::  edit the profile
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%self con-1]))
  ::  delete the profile
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%anon ~]))
  ::  contact update is published on /v1/contact
  ::  news is published on /news, /v1/news
  ::
  ;<  ~  b  %+  ex-cards  caz
    :~  (ex-fact ~ %contact-update !>([%full (add now.bowl tick) ~]))
        (ex-fact ~[/v1/contact] %contact-update-1 !>([%full (add now.bowl tick) ~]))
        (ex-fact ~[/news] %contact-news !>([our.bowl ~]))
        (ex-fact ~[/v1/news] %contact-news-1 !>([%self ~]))
    ==
  ::  v0 profile is empty
  ::
  ;<  peek=(unit (unit cage))  b
    (get-peek /x/contact/(scot %p our.bowl))
  ;<  ~  b
    %+  ex-equal
    !>((need peek))
    !>(~)
  ::  profile is empty
  ::
  ;<  peek=(unit (unit cage))  b
    (get-peek /x/v1/self)
  %+  ex-equal
  !>((need peek))
  !>(~)
::  +test-poke-edit: edit the contact book
::
++  test-poke-edit
  %-  eval-mare
  =/  m  (mare ,~)
  =*  b  bind:m
  ^-  form:m
  ;<  caz=(list card)  b  (do-init %contacts contacts-agent)
  ;<  =bowl  b  get-bowl
  ::
  =/  con-1=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Sun' bio+text/'It is bright today']
  ::
  =/  =news-1
    [%page 0v1 con-1]
  =/  mypage=^page
    [p=~ q=con-1]
  =/  edit-1  con-1
  ::  local subscriber to /news
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-watch /v1/news)
  ::
  ;<  ~  b  (set-src our.bowl)
  ::  %edit new contact page
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%edit 0v1 con-1]))
  ::  news is published on /v1/news
  ::
  ;<  ~  b  %+  ex-cards  caz
    :~  (ex-fact ~[/v1/news] %contact-news-1 !>(news-1))
    ==
  ::  peek page in the book: new contact page is found
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/book/0v1)
  =/  cage  (need (need peek))
  ?>  ?=(%contact-page-1 p.cage)
  %+  ex-equal
  q.cage
  !>(mypage)
::
+|  %peek-0
::  +test-peek-0-all: v0 scry /all
::
:: ++  test-peek-0-all  (eval-mare (ex-equal !>(2) !>(2)))
::  +test-peek-0-contact: v0 scry /contact
::
:: ++  test-peek-0-contact  (eval-mare (ex-equal !>(2) !>(2)))
::  +test-poke-spot-edit: spot a peer
::
:: ++  test-poke-spot
::   %-  eval-mare
::   =/  m  (mare ,~)
::   =*  b  bind:m
::   ^-  form:m
::   ;<  caz=(list card)  b  (do-init %contacts contacts-agent)
::   ;<  =bowl  b  get-bowl
::   ::
::   =/  con-1=contact-1
::     %-  malt
::     ^-  (list (pair @tas value-1))
::     ~[nickname+text/'Sun' bio+text/'It is bright today']
::   ::
::   =/  =news-1
::     [%page 0v1 con-1]
::   =/  edit-1  con-1
::   ::  local subscriber to /news
::   ::
::   ;<  ~  b  (set-src our.bowl)
::   ;<  caz=(list card)  b  (do-watch /v1/news)
::   ::
::   ;<  ~  b  (set-src our.bowl)
::   ::
::   ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%edit 0v1 con-1]))
::   ;<  caz=(list card)  b  (do-poke %contact-action-1 %meet)
::   %+  ex-cards  caz
::   :~  (ex-fact ~[/v1/news] %contact-news-1 !>(news-1))
::   ==
--
