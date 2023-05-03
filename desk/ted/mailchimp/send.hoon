::  Mailchimp/Send
::  send an email via the Mailchimp Transactional API
::
::  > -bark!mailchimp-send "[API_KEY]" "someone@example.com" "message subject" "message body" 
::
/-  spider
/+  *strandio
=,  strand=strand:spider
=,  dejs:format
=/  m  (strand ,vase)
|^  ted
++  api-post
  |=  [api-key=tape to-email=tape subject=tape body=tape]
  %:  send-request
    method=%'POST'
    url=url
    header-list=['Content-Type'^'application/json' ~]
    ^=  body
    %-  some
    %-  as-octt:mimes:html
    %-  en-json:html
    %-  pairs:enjs:format
      :~  ['key' s+(crip api-key)]
          :-  'message'
          %-  pairs:enjs:format
          :~  ['subject' s+(crip subject)]
              ['html' s+(crip body)]
              ['from_email' s+'no-reply@tlon.io']
              ['from_name' s+'Tlon Local']
              :-  'to'
                [%a ~[(pairs:enjs:format ~[['email' s+(crip to-email)] ['type' s+'to']])]]
          ==
      ==
  ==
++  url  'https://mandrillapp.com/api/1.0/messages/send'
++  ted
  ^-  thread:spider
  |=  arg=vase
  =/  m  (strand ,vase)
  ^-  form:m
  =/  arg-mold
    $:  api-key=tape
        to-email=tape
        subject=tape
        body=tape
    ==
  =/  args  !<((unit arg-mold) arg)
  ~&  args
  ?~  args
    (pure:m !>(~))
  ;<  ~  bind:m  (api-post api-key.u.args to-email.u.args subject.u.args body.u.args)
  ;<  rep=client-response:iris  bind:m
    take-client-response
  ?>  ?=(%finished -.rep)
  ?~  full-file.rep  !!
  =/  body=cord  q.data.u.full-file.rep
  ~&  rep
  %-  pure:m
  !>  [body ~]
--
