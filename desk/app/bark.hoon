/-  hark
/+  default-agent, verb, dbug
::
|%
+$  card  card:agent:gall
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 mailchimp-api-key=cord hosting-api-key=cord recipients=(set ship)]
--
::
=|  state-0
=*  state  -
%-  agent:dbug
%+  verb  |
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
++  on-init  `this
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+  mark  (on-poke:def mark vase)
      %set-api-key
    `this(mailchimp-api-key !<(cord vase))
    ::
      %bark-add-recipient
    =+  !<(=ship vase)
    ?>  =(src.bowl ship)
    `this(recipients (~(put in recipients) ship))
    ::
      %bark-remove-recipient
    =+  !<(=ship vase)
    ?>  =(src.bowl ship)
    `this(recipients (~(del in recipients) ship))
    ::
      %bark-generate-summaries
    ?>  =(src.bowl our.bowl)
    :_  this
    =-  ~(tap in -)
    ^-  (set card)
    %-  ~(run in recipients)
      |=  =ship
      ^-  card
      [%pass /request-summary %agent [ship %growl] %poke %growl-summarize !>(now.bowl)]
    ::
      %bark-receive-summary
    =/  result  !<((unit [requested=time =carpet:hark]) vase)
    ?~  result
      `this(recipients (~(del in recipients) src.bowl))
    ~&  >>>  carpet.u.result
    ::  TODO create thread that calls the "get email address" thread (to be written)
    ::  and the "send email" thread and call it here
    `this
  ==
++  on-watch  on-watch:def
++  on-agent  on-agent:def
++  on-fail
  |=  [=term =tang]
  (mean ':sub +on-fail' term tang)
++  on-leave
  |=  =path
  `this
++  on-save  !>(state)
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
      %0
    `this(state old)
  ==
++  on-arvo  on-arvo:def
++  on-peek  on-peek:def
--
