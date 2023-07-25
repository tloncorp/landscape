::  Mailchimp/Ping
::  a health check endpoint for the Mailchimp Transactional API
::
:: > -bark!mailchimp-ping "[API_KEY]"
:: "PONG!"
::
/-  spider
/+  *strandio
=,  strand=strand:spider
=,  dejs:format
=/  m  (strand ,vase)
|^  ted
++  api-post
  |=  api-key=tape
  %:  send-request
    method=%'POST'
    url=url
    header-list=['Content-Type'^'application/json' ~]
    ^=  body
    %-  some  %-  as-octt:mimes:html
    %-  en-json:html
    %-  pairs:enjs:format
      :~  ['key' s+(crip api-key)]
    ==
  ==
++  url  'https://mandrillapp.com/api/1.0/users/ping'
++  ted
  ^-  thread:spider
  |=  arg=vase
  =/  m  (strand ,vase)
  ^-  form:m
  =/  arg-mold
    $:  api-key=tape
    ==
  =/  args  !<((unit arg-mold) arg)
  ?~  args
    (pure:m !>(~))
  ;<  ~  bind:m  (api-post api-key.u.args)
  ;<  rep=client-response:iris  bind:m
    take-client-response
  ?>  ?=(%finished -.rep)
  ?~  full-file.rep  !!
  =/  body=cord  q.data.u.full-file.rep
  %-  pure:m
  !>  [body ~]
--
