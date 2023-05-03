::  Mailchimp/Send Template
::  send an email template via the Mailchimp Transactional API
::
::  > -bark!mailchimp-send-template "[API_KEY]" "someone@example.com" "template-name" :: TODO: how to pass in vars map?
::
/-  spider
/+  *strandio
=,  strand=strand:spider
=,  dejs:format
=/  m  (strand ,vase)
|^  ted
++  vars-json
  |=  vars=(map cord cord)
  %-  ~(rut by vars)
  |=  [k=cord v=cord]
  [s+k s+v]
++  api-post
  |=  [api-key=tape to-email=tape template-name=tape vars=(map cord cord)]
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
          ['template_name' s+(crip template-name)]
          :: null template_content is fine for now; but in the future, if we
          :: need to inject complex HTML, this thread should be updated to
          :: support it
          ['template_content' ~]
          :-  'message'
          %-  pairs:enjs:format
          :~  
              ['merge_language' s+'handlebars']
              :-  'to'
                [%a ~[(pairs:enjs:format ~[['email' s+(crip to-email)] ['type' s+'to']])]]
              :-  'merge_vars'
                :: TODO: handle passed vars
                [%a ~[(pairs:enjs:format ~[['rcpt' s+(crip to-email)] ['vars' ~]])]]
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
        template-name=tape
        vars=(map cord cord)
    ==
  =/  args  !<((unit arg-mold) arg)
  ~&  args
  ?~  args
    (pure:m !>(~))
  ;<  ~  bind:m  (api-post api-key.u.args to-email.u.args template-name.u.args vars.u.args)
  ;<  rep=client-response:iris  bind:m
    take-client-response
  ?>  ?=(%finished -.rep)
  ?~  full-file.rep  !!
  =/  body=cord  q.data.u.full-file.rep
  ~&  rep
  %-  pure:m
  !>  [body ~]
--
