::  Mailchimp/Send Template
::  send an email template via the Mailchimp Transactional API
::
::  > -bark!mailchimp-send-template "[MANDRILL_API_KEY]" "someone@example.com" "template-name" vars :: vars is a (map cord cord)
::
/-  spider
/+  *strandio
=,  strand=strand:spider
=,  dejs:format
=/  m  (strand ,vase)
|^  ted
++  var-json
  |=  [k=cord v=cord]
  (pairs:enjs:format ~[['name' s+k] ['content' s+v]])
++  vars-json
  |=  vars=(map cord cord)
  [%a (turn ~(tap by vars) |=([p=cord q=cord] (var-json p q)))]
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
                [%a ~[(pairs:enjs:format ~[['rcpt' s+(crip to-email)] ['vars' (vars-json vars)]])]]
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
  ?~  args
    (pure:m !>(~))
  ;<  ~  bind:m  (api-post api-key.u.args to-email.u.args template-name.u.args vars.u.args)
  ;<  rep=client-response:iris  bind:m
    take-client-response
  ?>  ?=(%finished -.rep)
  ?~  full-file.rep  !!
  =/  body=cord  q.data.u.full-file.rep
  %-  pure:m
  !>  `body
--
