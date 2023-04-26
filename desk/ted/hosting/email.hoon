::  Hosting/Email
::  Query the Hosting backend for a customer's email address
::
::  > -bark!hosting-email "[API_KEY]" "~sampel-palnet" 
::
:: API Response:
:: {
::   "ship": "dovmer-davmet",
::   "email": "james.muturi+t17@tlon.io"
:: }
::
:: Output:
:: james.muturi+t17@tlon.io
::
/-  spider
/+  *strandio
=,  strand=strand:spider
=,  dejs:format
|^  ted
++  build-headers
  |=  api-key=tape
  ^-  header-list:http
  :~  ['Content-Type' 'application/json']  
      ['APIKey' (crip api-key)]
  ==
++  api-get
  |=  [api-key=tape ship=@p]
  %:  send-request
    method=%'GET'
    url=(crip "https://tlon.network/v1/ships/{<ship>}/email")
    header-list=(build-headers api-key)
    body=~
  ==
++  mine-json
  %-  ot
  :~  ship+so
      email+so
  ==
++  ted
  ^-  thread:spider
  |=  arg=vase
  =/  m  (strand ,vase)
  ^-  form:m
  =/  arg-mold
    $:  api-key=tape
        ship=@p
    ==
  =/  args  !<((unit arg-mold) arg)
  ?~  args
    (pure:m !>(~))
  ;<  ~  bind:m  (api-get api-key.u.args ship.u.args)
  ;<  rep=client-response:iris  bind:m
    take-client-response
  ?>  ?=(%finished -.rep)
  ?~  full-file.rep  
    (pure:m !>(~))
  =/  body=cord  q.data.u.full-file.rep
  =/  parsed=(unit json)  (de-json:html body)
  ?~  parsed
    (pure:m !>(~))
  ?~  u.parsed
    (pure:m !>(~))
  =/  mined  (mine-json u.parsed)
  (pure:m !>(+.mined))
--
