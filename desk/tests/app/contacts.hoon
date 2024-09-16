/-  *contacts
/+  *test-agent
/+  c=contacts
/=  contacts-agent  /app/contacts
=*  agent  contacts-agent
::  XX consider structuring tests better
::  with functional 'micro' strands
|%
+|  %help
++  tick  ^~((rsh 3^2 ~s1))
++  mono
  |=  [old=@da new=@da]
  ^-  @da
  ?:  (lth old new)  new
  (add old tick)
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
  ::  foreign subscriber to /v1/contact
  ::
  ;<  ~  b  (set-src ~sun)
  ;<  caz=(list card)  b  (do-watch /v1/contact)
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
  :~  (ex-fact ~[/news] contact-news+!>([our.bowl ~]))
      (ex-fact ~[/v1/news] contact-news-1+!>([%self ~]))
      (ex-fact ~[/v1/contact] contact-update-1+!>(upd-1))
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
  ::  foreign subscriber to /v1/contact
  ::
  ;<  ~  b  (set-src ~sun)
  ;<  caz=(list card)  b  (do-watch /v1/contact)
  ::  local subscriber to /news
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-watch /news)
  ::  local subscriber to /v1/news
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-watch /v1/news)
  ::
  ;<  ~  b  (set-src our.bowl)
  ::  action-0 profile %edit
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action !>([%edit edit-0]))
  %+  ex-cards  caz
  :~  (ex-fact ~[/news] contact-news+!>([our.bowl con-0]))
      (ex-fact ~[/v1/news] contact-news-1+!>([%self con-1]))
      (ex-fact ~[/v1/contact] contact-update-1+!>([%full now.bowl con-1]))
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
    :~  (ex-fact ~[/news] contact-news+!>([our.bowl ~]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%self ~]))
        (ex-fact ~[/v1/contact] contact-update-1+!>([%full (add now.bowl tick) ~]))
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
  :~  (ex-fact ~[/news] contact-news+!>([our.bowl con-0]))
      (ex-fact ~[/v1/news] contact-news-1+!>([%self con-1]))
      (ex-fact ~[/v1/contact] contact-update-1+!>(upd-1))
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
    :~  (ex-fact ~[/v1/news] contact-news-1+!>(news-1))
    ==
  ::  peek page in the book: new contact page is found
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/book/id/0v1)
  =/  =cage  (need (need peek))
  %+  ex-equal
  !>  [%contact-page-1 q.cage]
  !>  [%contact-page-1 !>(mypage)]
::
++  test-poke-meet
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
    :~  (ex-fact ~[/news] contact-news+!>([~sun (to-contact-0:c con-sun)]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%peer ~sun con-sun]))
    ==
  ::  ~sun appears in peers
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  cag
    !>  contact-foreign-1+!>(`foreign-1`[[now.bowl con-sun] %want])
  ;<  ~  b  (set-src ~sun)
  ::  meet ~sun a second time: a no-op
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%meet ~[~sun]]))
  (ex-cards caz ~)
::
++  test-poke-spot-unknown
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
  ::  spot ~sun to contact boook: he also becomes our peer
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%spot ~sun ~]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-task /contact [~sun %contacts] %watch /v1/contact)
        (ex-fact ~[/news] contact-news+!>([~sun ~]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%peer ~sun ~]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%page ~sun `page:c`[~ ~]]))
    ==
  ::  ~sun appears in peers
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  cag
    !>  contact-foreign-1+!>(`foreign-1`[~ %want])
  ::  ~sun publishes his contact
  ::
  ;<  ~  b  (set-src ~sun)
  ;<  caz=(list card)  b
    (do-agent /contact [~sun %contacts] %fact %contact-update-1 !>([%full now.bowl con-sun]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-fact ~[/news] contact-news+!>([~sun (to-contact-0:c con-sun)]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%page ~sun con-sun ~]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%peer ~sun con-sun]))
    ==
  ::  ~sun contact page is edited
  ::
  ;<  ~  b  (set-src our.bowl)
  =/  con-mod=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Bright Sun' avatar+text/'https://sun.io/sun.png']
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%edit ~sun con-mod]))
  ::  ~sun's contact book page is updated 
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/book/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  cag
    !>  [%contact-page-1 !>(`page:c`[con-sun con-mod])]
  ::  and his effective contact is changed
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/contact/~sun)
  =/  cag=cage  (need (need peek))
  %+  ex-equal
  !>  cag
  !>  [%contact-1 !>((contact-mod:c con-sun con-mod))]
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
    :~  (ex-fact ~[/news] contact-news+!>([~sun (to-contact-0:c con-sun)]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%peer ~sun con-sun]))
    ==
  ::  ~sun appears in peers
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  cag
    !>  contact-foreign-1+!>(`foreign-1`[[now.bowl con-sun] %want])
  ;<  ~  b  (set-src ~sun)
  ::  ~sun is added to contacts
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%spot ~sun ~]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-fact ~[/v1/news] contact-news-1+!>([%page ~sun con-sun ~]))
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
    :~  :: (ex-fact ~[/news] contact-news+!>([~sun (to-contact-0:c (~(uni by con-sun) con-mod))]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%page ~sun con-sun con-mod]))
    ==
  ::  despite the edit, ~sun peer contact is unchanged
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  cag
    !>  contact-foreign-1+!>(`foreign-1`[[now.bowl con-sun] %want])
  ::  however, ~sun's contact book page is changed
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/book/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  cag
    !>  [%contact-page-1 !>(`page:c`[con-sun con-mod])]
  ::  and his effective contact is changed
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/contact/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  cag
    !>  [%contact-1 !>((contact-mod:c con-sun con-mod))]
  ::  ~sun contact page is deleted
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%wipe ~[~sun]]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  :: (ex-fact ~[/news] contact-news+!>([~sun (to-contact-0:c con-sun)]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%wipe ~sun]))
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
  !>  cag
  !>  contact-foreign-1+!>(`foreign-1`[[now.bowl con-sun] %want])
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
    :~  (ex-fact ~[/news] contact-news+!>([~sun (to-contact-0:c con-sun)]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%peer ~sun con-sun]))
    ==
  ::  ~sun appears in peers
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  =/  cag=cage  (need (need peek))
  ;<  ~  b
    %+  ex-equal
    !>  cag
    !>  contact-foreign-1+!>(`foreign-1`[[now.bowl con-sun] %want])
  ;<  ~  b  (set-src ~sun)
  ::  ~sun is added to contacts
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%spot ~sun ~]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-fact ~[/v1/news] contact-news-1+!>([%page ~sun con-sun ~]))
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
    :~  :: (ex-fact ~[/news] contact-news+!>([~sun (to-contact-0:c (~(uni by con-sun) con-mod))]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%page ~sun con-sun con-mod]))
    ==
  ::  ~sun is dropped
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%drop ~[~sun]]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-task /contact [~sun %contacts] %leave ~)
        (ex-fact ~[/news] contact-news+!>([~sun ~]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%peer ~sun ~]))
    ==
  ::  ~sun is not found in peers
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  ;<  ~  b
    %+  ex-equal
    !>  peek
    !>  [~ ~]
  ::  but his contact is not modified
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/book/~sun)
  =/  cag=cage  (need (need peek))
  %+  ex-equal
  !>  cag
  !>  contact-page-1+!>(`page:c`[con-sun con-mod])
::
++  test-poke-snub
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
    :~  (ex-fact ~[/news] contact-news+!>([~sun (to-contact-0:c con-sun)]))
        (ex-fact ~[/v1/news] contact-news-1+!>([%peer ~sun con-sun]))
    ==
  ::  ~sun is added to contacts
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%spot ~sun ~]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-fact ~[/v1/news] contact-news-1+!>([%page ~sun con-sun ~]))
    ==
  ::  ~sun is snubbed
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke contact-action-1+!>([%snub ~[~sun]]))
  ;<  ~  b
    %+  ex-cards  caz
    :~  (ex-task /contact [~sun %contacts] %leave ~)
    ==
  ::  ~sun modifies his contact
  ::
  =/  con-mod=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Bright Sun' avatar+text/'https://sun.io/sun.png']
  ;<  ~  b  (set-src ~sun)
  ::  fact fails: no subscription
  ::  XX extend test-agent to allow this test
  :: ;<  ~  b  %-  ex-fail
  ::   %-  do-agent
  ::   :*  /contact
  ::       [~sun %contacts]
  ::       %fact
  ::       %contact-update-1
  ::       !>([%full now.bowl (~(uni by con-sun) con-mod)])
  ::   ==
  ::  ~sun is still found in peers
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/peer/~sun)
  =/  cag=cage  (need (need peek))
  %+  ex-equal
  !>  cag
  !>  contact-foreign-1+!>(`foreign-1`[[now.bowl con-sun] ~])
::
+|  %peek
++  test-peek-0-all
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
  =/  con-mur=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Mur' bio+text/'Murky waters']
  ::  meet ~sun and ~mur
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%meet ~[~sun ~mur]]))
  ::  ~sun publishes his contact
  ::
  ;<  ~  b  (set-src ~sun)
  ;<  caz=(list card)  b
    (do-agent /contact [~sun %contacts] %fact %contact-update-1 !>([%full now.bowl con-sun]))
  ::  ~mur publishes his contact
  ::
  ;<  ~  b  (set-src ~mur)
  ;<  caz=(list card)  b
    (do-agent /contact [~mur %contacts] %fact %contact-update-1 !>([%full now.bowl con-mur]))
  ::  peek all: two peers are found
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/all)
  =/  cag=cage  (need (need peek))
  ?>  ?=(%contact-rolodex p.cag)
  =/  rol  !<(rolodex-0 q.cag)
  ;<  ~  b
    %+  ex-equal
    !>  (~(got by rol) ~sun)
    !>  [[now.bowl (to-contact-0:c con-sun)] %want]
  %+  ex-equal
  !>  (~(got by rol) ~mur)
  !>  [[now.bowl (to-contact-0:c con-mur)] %want]
  :: (ex-equal !>(2) !>(2))
::
++  test-peek-book
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
  =/  con-2=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Mur' bio+text/'Murky waters']
  ::
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%page 0v1 con-1]))
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%page 0v2 con-2]))
  ::  peek book: two contacts are found
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/book)
  =/  cag=cage  (need (need peek))
  ?>  ?=(%contact-book-1 p.cag)
  =/  =book  !<(book q.cag)
  ;<  ~  b
    %+  ex-equal
    !>  q:(~(got by book) id+0v1)
    !>  con-1
  %+  ex-equal
  !>  q:(~(got by book) id+0v2)
  !>  con-2
++  test-peek-all
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
  =/  con-mur=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[nickname+text/'Mur' bio+text/'Murky waters']
  =/  con-mod=contact-1
    %-  malt
    ^-  (list (pair @tas value-1))
    ~[avatar+text/'https://sun.io/sun.png']
  ::  meet ~sun and ~mur
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%meet ~[~sun ~mur]]))
  ::  ~sun publishes his contact
  ::
  ;<  ~  b  (set-src ~sun)
  ;<  caz=(list card)  b
    (do-agent /contact [~sun %contacts] %fact %contact-update-1 !>([%full now.bowl con-sun]))
  ::  ~sun is added to the contact book with user overlay
  ::
  ;<  ~  b  (set-src our.bowl)
  ;<  caz=(list card)  b  (do-poke %contact-action-1 !>([%spot ~sun con-mod]))
  ::  ~mur publishes his contact
  ::
  ;<  ~  b  (set-src ~mur)
  ;<  caz=(list card)  b
    (do-agent /contact [~mur %contacts] %fact %contact-update-1 !>([%full now.bowl con-mur]))
  ::  peek all: two contacts are found
  ::
  ;<  peek=(unit (unit cage))  b  (get-peek /x/v1/all)
  =/  cag=cage  (need (need peek))
  ?>  ?=(%contact-directory-1 p.cag)
  =/  dir  !<(directory q.cag)
  ;<  ~  b
    %+  ex-equal
    !>  (~(got by dir) ~sun)
    !>  (contact-mod:c con-sun con-mod)
  %+  ex-equal
  !>  (~(got by dir) ~mur)
  !>  con-mur
--
