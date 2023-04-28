::  Mailchimp/Send Template
::  send an email template via the Mailchimp Transactional API
::
::  > -bark!mailchimp-send-template "[API_KEY]" "someone@example.com" "message subject" "message body"  TODO
::
/-  spider
/+  *strandio
=,  strand=strand:spider
=,  dejs:format
=/  m  (strand ,vase)
|^  ted
++  api-post
  :: TODO: the template_content argument should be a list of k:v pairs, which
  :: can then be mapped over to create the template_content body item below
  |=  [api-key=tape to-email=tape subject=tape body=tape template-name=tape template-content=tape]
  %:  send-request
    method=%'POST'
    url=url
    header-list=['Content-Type'^'application/json' ~]
    ^=  body
    %-  some  %-  as-octt:mimes:html
    %-  en-json:html
    %-  pairs:enjs:format
      :~  ['key' s+(crip api-key)]
          ['template_name' s+(crip template-name)]
          :-  'message'
          %-  pairs:enjs:format
          :~  ['subject' s+(crip subject)]
              ['html' s+(crip body)]
              ['from_email' s+'no-reply@tlon.io']
              ['from_name' s+'Tlon Local']
              :-  'to'
                [%a ~[(pairs:enjs:format ~[['email' s+(crip to-email)] ['type' s+'to']])]]
          ==
          :-  'template_content'
            [%a ~[(pairs:enjs:format ~[['name' s+'main'] ['content' s+(crip body)]])]]
          ==
      ==
  ==
++  url  'https://mandrillapp.com/api/1.0/messages/send-template'
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
  ;<  ~  bind:m  (api-post api-key.u.args to-email.u.args subject.u.args body.u.args template-name.u.args)
    take-response
  ;<  rep=client-response:iris  bind:m
    take-client-response
  ?>  ?=(%finished -.rep)
  ?~  full-file.rep  !!
  =/  body=cord  q.data.u.full-file.rep
  ~&  rep
  %-  pure:m
  !>  [body ~]
--
