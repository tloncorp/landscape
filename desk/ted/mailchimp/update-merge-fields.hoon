::  -mailchimp-update-merge-fields: set/update merge field(s) for an email
::
::    produces a success flag (whether response status was 200 or not) and
::    either the response body, or some error string in case of local failure.
::
::  > -bark!mailchimp-update-merge-fields 'apikey' 'list-id' 'sampel@example.com' fields
::  where fields is a (map cord json)
::  and the list-id is most easily discovered through the /lists api:
::  curl -X GET 'https://us14.api.mailchimp.com/3.0/lists?count=99&offset=0' --user "anystring:${apikey}"
::
/-  spider
/+  *strandio
=,  strand=strand:spider
=,  dejs:format
=/  m  (strand ,vase)
|^  ted
++  api-post
  |=  [[apik=@t list-id=@t] mail=@t vars=(map cord json)]
  %:  send-request
    method=%'PATCH'
    url=(url list-id mail)
  ::
    ^=  header-list
    :~  ['content-type' 'application/json']
        (basic-auth-header 'anystring' apik)
    ==
  ::
    ^=  body
    %-  some
    %-  as-octs:mimes:html
    %-  en:json:html
    %-  pairs:enjs:format
    ['merge_fields' o+vars]~
  ==
::
++  url
  |=  [list-id=@t email=@t]
  ^-  @t
  %+  rap  3
  ::NOTE  us14 is the datacenter for our account, hardcoded
  :~  'https://us14.api.mailchimp.com/3.0/lists/'
      list-id
      '/members/'
      email  ::TODO  force lowercase?
      '?skip_merge_validation=false'
  ==
::
++  basic-auth-header  ::TODO  into http auth library
  |=  [user=@t pass=@t]
  ^-  [key=@t value=@t]
  :-  'authorization'
  =+  full=(rap 3 user ':' pass ~)
  %^  cat  3  'Basic '
  (en:base64:mimes:html (met 3 full) full)
::
++  ted
  ^-  thread:spider
  |=  arg=vase
  =/  m  (strand ,vase)  ::  [gud=? res=@t]
  ^-  form:m
  =/  arg-mold
    $:  api=[key=cord list-id=cord]
        to-email=cord
        vars=(map cord json)
    ==
  =/  args  !<((unit arg-mold) arg)
  ?~  args  (pure:m !>(|^%bad-args))
  ;<  ~  bind:m
    (api-post u.args)
  ;<  rep=client-response:iris  bind:m
    take-client-response
  ?>  ?=(%finished -.rep)
  %-  pure:m
  !>  ^-  [gud=? res=@t]
  :-  =(200 status-code.response-header.rep)
  ?~  full-file.rep  %empty-body
  q.data.u.full-file.rep
--
