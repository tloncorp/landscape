::  -save-summary: unpack growl summary, store in mailchimp merge fields
::
::    crashes on failure. on success, produces the result message from the
::    -mailchimp-update-merge-fields thread.
::
/-  spider
/+  *strandio
=,  strand=strand:spider
=,  dejs:format
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=/  arg-mold
  $:  tlon-api-key=cord
      mailchimp=[key=cord list-id=cord]
      =ship
    ::
      $=  summary
      $%  [%life [sen=@ud rec=@ud gro=@t] [dms=@ud etc=@ud group=@t chat=@t]]
      ==
  ==
=/  args  !<([~ arg-mold] arg)
;<  ~  bind:m
  %-  send-raw-card
  :*  %pass  /check-email/(scot %p ship.args)
      %arvo  %k  %fard
      %garden  %hosting-email  %noun
      !>(`[(trip tlon-api-key.args) ship.args])
  ==
;<  [mire=wire mine=sign-arvo]  bind:m  take-sign-arvo
?>  ?=([%check-email @ *] mire)
?>  =(i.t.mire (scot %p ship.args))
?>  ?=([%khan %arow %.y %noun *] mine)
::
=/  [%khan %arow %.y %noun vs=vase]  mine
=+  !<(mail=(unit cord) vs)
?~  mail
  (pure:m !>('no-mail'))
;<  ~  bind:m
  %-  send-raw-card
  :*  %pass  /update-merge-fields/(scot %p ship.args)
      %arvo  %k  %fard
      %garden  %mailchimp-update-merge-fields  %noun
      =;  vars=(map @t json)
        !>(`[mailchimp.args u.mail vars])
      %-  ~(gas by *(map @t json))
      =,  summary.args
      :~  ['MSGS_SENT' (numb:enjs:format sen)]
          ['MSGS_RECD' (numb:enjs:format rec)]
          ['GROUP_SENT' s+gro]
        ::
          ['UNREAD_DMS' (numb:enjs:format dms)]
          ['UNREAD_MSG' (numb:enjs:format etc)]
          ['GROUP_NAME' s+group]
          ['CHNL_NAME' s+chat]
      ==
  ==
;<  [wimp=wire simp=sign-arvo]  bind:m  take-sign-arvo
?>  ?=([%update-merge-fields @ *] wimp)
?>  =(i.t.wimp (scot %p ship.args))
?>  ?=([%khan %arow %.y %noun *] simp)
::
=/  [%khan %arow %.y %noun vs=vase]  simp
=+  !<([gud=? msg=@t] vs)
?.  gud  ~|(msg !!)
(pure:m !>(msg))
