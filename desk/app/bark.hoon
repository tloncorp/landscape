::  bark: gathers summaries from ships, sends emails to their owners
::
::    general flow is that bark gets configured with api keys and recipient
::    ships. on-demand, bark asks either all or a subset of recipients for
::    an activity summary (through the growl agent on their ships), and upon
::    receiving responses, uses the mailchimp api to upload the received
::    deets for that ship, and/or triggers an email send.
::
/-  hark
/+  default-agent, verb, dbug
::
|%
+$  card  card:agent:gall
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 tlon-api-key=tape mailchimp-api-key=tape recipients=(set ship)]
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
      %set-tlon-api-key
    `this(tlon-api-key !<(tape vase))
    ::
      %set-mailchimp-api-key
    `this(mailchimp-api-key !<(tape vase))
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
      %bark-target-summaries
    ?>  =(src.bowl our.bowl)
    :_  this
    %+  turn
      (skim !<((list ship) vase) ~(has in recipients))
    |=  =ship
    ^-  card
    [%pass /request-summary %agent [ship %growl] %poke %growl-summarize !>(now.bowl)]
    ::
      %bark-receive-summary
    =/  result
      !<  %-  unit
          $:  requested=time
          $=  summary
          $^  carpet:hark
          ::NOTE  see also /lib/summarize
          $%  [%life active=[s=@ud r=@ud g=@t] inactive=[d=@ud c=@ud g=@t c=@t]]
          ==  ==
      vase
    ?~  result
      `this(recipients (~(del in recipients) src.bowl))
    ::TODO  maybe drop the result (or re-request) if the timestamp is too old?
    :_  this
    :~  :*  %pass  /save-summary/(scot %p src.bowl)/(scot %da requested.u.result)
        %arvo  %k  %fard
        %bark  %save-summary  %noun
        =;  summary
          !>(`[tlon-api-key mailchimp-api-key src.bowl summary])
        ?@  -.summary.u.result
          summary.u.result
        [%hark summary.u.result]
      ==
    ==
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
