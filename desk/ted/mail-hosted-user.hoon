/-  spider, hark
/+  *strandio
=,  strand=strand:spider
=,  dejs:format
|^  ted
++  template-vars
  |=  [=ship =carpet:hark]
  ^-  (map cord cord)
  %-  malt
  :~  ['name' (scot %p ship)]
      ['notifications' (crip (a-co:co ~(wyt by yarns.carpet)))]
  ==
++  ted
  ^-  thread:spider
  |=  arg=vase
  =/  m  (strand ,vase)
  ^-  form:m
  =/  arg-mold
    $:  tlon-api-key=tape
        mandrill-api-key=tape
        =ship
        =carpet:hark
    ==
  =/  args  !<((unit arg-mold) arg)
  ?~  args  !!
  ;<  ~  bind:m
    %-  send-raw-card
    :*  %pass  /check-email/(scot %p ship.u.args)
        %arvo  %k  %fard
        %garden  %hosting-email  %noun
        !>(`[tlon-api-key.u.args ship.u.args])
    ==
  ;<  [mire=wire mine=sign-arvo]  bind:m  take-sign-arvo
  ?>  ?=([%check-email @ *] mire)
  ?>  =(i.t.mire (scot %p ship.u.args))
  ?>  ?=([%khan %arow %.y %noun *] mine)
  ::
  =/  [%khan %arow %.y %noun vs=vase]  mine
  =+  !<((unit cord) vs)
  ?~  -  !!
  =/  email  u.-
  ;<  ~  bind:m
    %-  send-raw-card
    :*  %pass  /send-mailchimp-email/(scot %p ship.u.args)
        %arvo  %k  %fard
        %garden  %mailchimp-send-template  %noun
        !>(`[mandrill-api-key.u.args (trip email) "landscape-weekly-digest" (template-vars ship.u.args carpet.u.args)])
    ==
  ;<  [wimp=wire simp=sign-arvo]  bind:m  take-sign-arvo
  ?>  ?=([%send-mailchimp-email @ *] wimp)
  ?>  =(i.t.wimp (scot %p ship.u.args))
  ?>  ?=([%khan %arow %.y %noun *] simp)
  ::
  =/  [%khan %arow %.y %noun vs=vase]  simp
  =+  !<((unit cord) vs)
  ?~  -  !!
  %-  pure:m
  !>  u.-
--
