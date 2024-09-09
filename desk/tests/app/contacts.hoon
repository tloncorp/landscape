/-  *contacts
/+  *test-agent
/+  c=contacts
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
::  +test-poke-0-anon: v0 delete the profile
::
++  test-poke-0-anon
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
::  +test-poke-0-edit: v0 edit the profile
::
++  test-poke-0-edit
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
++  test-poke-0-meet
  %-  eval-mare
  =/  m  (mare ,~)
  =*  b  bind:m
  ^-  form:m
  ;<  caz=(list card)  b  (do-init %contacts contacts-agent)
  ;<  =bowl  b  get-bowl
  ::  v0 %meet is no-op
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action !>([%meet ~[~sun]]))
  (ex-cards caz ~)
::  +test-poke-heed-0: v0 heed a peer
::
++  test-poke-0-heed
  %-  eval-mare
  =/  m  (mare ,~)
  =*  b  bind:m
  ^-  form:m
  ;<  caz=(list card)  b  (do-init %contacts contacts-agent)
  ;<  =bowl  b  get-bowl
  ::  v0 %heed is the new %meet
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action !>([%heed ~[~sun]]))
  %+  ex-cards  caz
  :~  (ex-task /contact [~sun %contacts] %watch /v1/contact)
      (ex-fact ~[/news] contact-news+!>([~sun ~]))
      (ex-fact ~[/v1/news] contact-news-1+!>([%peer ~sun ~]))
  ==
+|  %poke
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
::  +test-poke-page: create new contact page
::
++  test-poke-page
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
    [%page id+0v1 ~ con-1]
  =/  mypage=^page
    [p=~ q=con-1]
  ::  local subscriber to /news
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-watch /v1/news)
  ::
  ;<  ~  b  (set-src our.bowl)
  ::  create new contact page
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%page 0v1 con-1]))
  ::  news is published on /v1/news
  ::
  ;<  ~  b  %+  ex-cards  caz
    :~  (ex-fact ~[/v1/news] %contact-news-1 !>(news-1))
    ==
  ::  peek page in the book: new contact page is found
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/book/id/0v1)
  =/  =cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  [%contact-page-1 q.cage]
    !>  [%contact-page-1 !>(mypage)]
  ::  fail to create duplicate page
  ::
  %-  ex-fail  (do-poke %contact-action-1 !>([%page 0v1 con-1]))
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
    [%page id+0v1 ~ con-1]
  =/  mypage=^page
    [p=~ q=con-1]
  =/  edit-1  con-1
  ::  local subscriber to /news
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-watch /v1/news)
  ::
  ;<  ~  b  (set-src our.bowl)
  ::  create new contact page
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%page 0v1 con-1]))
  ::  news is published on /v1/news
  ::
  ;<  ~  b  %+  ex-cards  caz
    :~  (ex-fact ~[/v1/news] %contact-news-1 !>(news-1))
    ==
  ::  peek page in the book: new contact page is found
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/book/id/0v1)
  =/  =cage  (need (need peek))
  %+  ex-equal
  !>  [%contact-page-1 q.cage]
  !>  [%contact-page-1 !>(mypage)]
::
++  test-poke-spot-wipe
  %-  eval-mare
  =/  m  (mare ,~)
  =*  b  bind:m
  ^-  form:m
  ;<  caz=(list card)  b  (do-init %contacts contacts-agent)
  ;<  =bowl  b  get-bowl
  ::
  =/  con-sun=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Sun' bio+text/'It is bright today']
  ::  local subscriber to /news
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-watch /news)
  ::  meet ~sun
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%meet ~[~sun]]))
  ::  ~sun publishes his contact
  ::
  ;<  ~  b  (set-src ~sun)
  ;<  caz=(list card)  b
    (do-agent /contact [~sun %contacts] %fact %contact-update-1 !>([%full now.bowl con-sun]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-fact ~[/news] %contact-news !>([~sun (to-contact-0:c con-sun)]))
        (ex-fact ~[/v1/news] %contact-news-1 !>([%peer ~sun con-sun]))
    ==
  ::  ~sun appears in peers
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  [%contact-1 q.cag]
    !>  [%contact-1 !>(con-sun)]
  ;<  ~  b  (set-src ~sun)
  ::  ~sun is added to contacts
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%spot ~sun ~]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-fact ~[/v1/news] %contact-news-1 !>([%page ~sun con-sun ~]))
    ==
  ::  ~sun contact page is edited
  ::
  =/  con-mod=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Bright Sun' avatar+text/'https://sun.io/sun.png']
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%edit ~sun con-mod]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-fact ~[/news] %contact-news !>([~sun (to-contact-0:c (~(uni by con-sun) con-mod))]))
        (ex-fact ~[/v1/news] %contact-news-1 !>([%page ~sun con-sun con-mod]))
    ==
  ::  despite the edit, ~sun peer contact is unchanged
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  [%contact-1 q.cag]
    !>  [%contact-1 !>(con-sun)]
  ::  however, ~sun's contact book page is changed
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/book/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  [%contact-page-1 q.cag]
    !>  [%contact-page-1 !>(`page:c`[con-sun con-mod])]
  ::  ~sun contact page is deleted
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%wipe ~[~sun]]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-fact ~[/news] %contact-news !>([~sun (to-contact-0:c con-sun)]))
        (ex-fact ~[/v1/news] %contact-news-1 !>([%wipe ~sun]))
    ==
  ::  ~sun contact page is removed
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/book/~sun)
  ;<  ~  b  (ex-equal !>(peek) !>([~ ~]))
  :: (ex-equal !>(2) !>(2))
  ::  despite the removal, ~sun peer contact is unchanged
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  =/  cag=cage  (need (need peek))
  %+  ex-equal
  !>  [%contact-1 q.cag]
  !>  [%contact-1 !>(con-sun)]
::
++  test-poke-drop
  %-  eval-mare
  =/  m  (mare ,~)
  =*  b  bind:m
  ^-  form:m
  ;<  caz=(list card)  b  (do-init %contacts contacts-agent)
  ;<  =bowl  b  get-bowl
  ::
  =/  con-sun=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Sun' bio+text/'It is bright today']
  ::  local subscriber to /news
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-watch /news)
  ::  meet ~sun
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%meet ~[~sun]]))
  ::  ~sun publishes his contact
  ::
  ;<  ~  b  (set-src ~sun)
  ;<  caz=(list card)  b
    (do-agent /contact [~sun %contacts] %fact %contact-update-1 !>([%full now.bowl con-sun]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-fact ~[/news] %contact-news !>([~sun (to-contact-0:c con-sun)]))
        (ex-fact ~[/v1/news] %contact-news-1 !>([%peer ~sun con-sun]))
    ==
  ::  ~sun appears in peers
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  [%contact-1 q.cag]
    !>  [%contact-1 !>(con-sun)]
  ;<  ~  b  (set-src ~sun)
  ::  ~sun is added to contacts
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%spot ~sun ~]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-fact ~[/v1/news] %contact-news-1 !>([%page ~sun con-sun ~]))
    ==
  ::  ~sun contact page is edited
  ::
  =/  con-mod=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Bright Sun' avatar+text/'https://sun.io/sun.png']
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%edit ~sun con-mod]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-fact ~[/news] %contact-news !>([~sun (to-contact-0:c (~(uni by con-sun) con-mod))]))
        (ex-fact ~[/v1/news] %contact-news-1 !>([%page ~sun con-sun con-mod]))
    ==
  ::  ~sun is dropped
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%drop ~[~sun]]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-task /contact [~sun %contacts] %leave ~)
        (ex-fact ~[/news] %contact-news !>([~sun ~]))
        (ex-fact ~[/v1/news] %contact-news-1 !>([%page ~sun ~ con-mod]))
        (ex-fact ~[/v1/news] %contact-news-1 !>([%peer ~sun ~]))
    ==
  ::  ~sun is not found in peers
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  %+  ex-equal
  !>  peek
  !>  [~ ~]
::  XX test spot of two different pages to the same ship
:: +|  %peek-0
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
