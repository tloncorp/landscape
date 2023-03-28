/-  reel
/+  default-agent, verb, dbug, server, *reel
|%
+$  card  card:agent:gall
+$  versioned-state
  $%  state-0
      state-1
  ==
::
+$  state-0
  $:  %0
      todd=(map [inviter=ship token=cord] description=cord)
  ==
+$  state-1
  $:  %1
      token-metadata=(map [inviter=ship token=cord] metadata:reel)
  ==
--
::
|%
++  landing-page
  |=  =metadata:reel
  ^-  manx
  =/  description
    ?.  =(tag.metadata 'groups-0')  ""
    (trip (~(got by fields.metadata) 'description'))
  ;html
    ;head
      ;title:"Lure"
    ==
    ;body
      ;p: {description}
      Enter your @p:
      ;form(method "post")
        ;input(type "text", name "ship", id "ship", placeholder "~sampel");
        ;button(type "submit"):"Request invite"
      ==
      ;script: ship = document.cookie.split("; ").find((row) => row.startsWith("ship="))?.split("=")[1]; document.getElementById("ship").value=(ship || "~sampel-palnet")
    ==
  ==
::
++  sent-page
  |=  invitee=ship
  ^-  manx
  ;html
    ;head
      ;title:"Lure"
    ==
    ;body
      Your invite has been sent!  Go to your ship to accept it.
      ;script: document.cookie="ship={(trip (scot %p invitee))}"
    ==
  ==
--
::
=|  state-1
=*  state  -
::
%-  agent:dbug
%+  verb  |
|_  =bowl:gall
+*  this       .
    def        ~(. (default-agent this %|) bowl)
::
++  on-init
  ^-  (quip card _this)
  [[%pass /eyre/connect %arvo %e %connect [~ /lure] dap.bowl]~ this]
::
++  on-save  !>(state)
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
      %1
    `this(state old)
      %0
    `this(state *state-1)
  ==
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+    mark  (on-poke:def mark vase)
      %handle-http-request
    =+  !<([id=@ta inbound-request:eyre] vase)
    |^
    :_  this
    =/  full-line=request-line:server  (parse-request-line:server url.request)
    =/  line
      ?:  ?=([%lure @ @ *] site.full-line)
        t.site.full-line
      ?:  ?=([@ @ *] site.full-line)
        site.full-line
      !!
    ?+    method.request  (give not-found:gen:server)
        %'GET'
      ?:  ?=([%bait %who ~] line)
        (give (json-response:gen:server s+(scot %p our.bowl)))
      =/  inviter  (slav %p i.line)
      =/  token  i.t.line
      =/  =metadata:reel  (fall (~(get by token-metadata) [inviter token]) *metadata:reel)
      ?:  ?=([@ @ %metadata ~] line)
        (give (json-response:gen:server (enjs-metadata metadata)))
      (give (manx-response:gen:server (landing-page metadata)))
        %'POST'
      =/  inviter  (slav %p i.line)
      =/  token  i.t.line
      ?~  body.request
        (give not-found:gen:server)
      ?.  =('ship=%7E' (end [3 8] q.u.body.request))
        (give not-found:gen:server)
      =/  joiner  (slav %p (cat 3 '~' (rsh [3 8] q.u.body.request)))
      :*  :*  %pass  /bite  %agent  [inviter %reel]
              %poke  %reel-bite  !>([%bite-1 token joiner inviter])
          ==
          :*  %pass  /bite  %agent  [our.bowl %reel]
              %poke  %reel-bite  !>([%bite-1 token joiner inviter])
          ==
          (give (manx-response:gen:server (sent-page joiner)))
      ==
    ==
    ::
    ++  give
      |=  =simple-payload:http
      (give-simple-payload:app:server id simple-payload)
    --
      %bait-describe
    =+  !<([token=cord =metadata:reel] vase)
    `this(token-metadata (~(put by token-metadata) [src.bowl token] metadata))
  ::
      %bait-undescribe
    =+  !<(token=cord vase)
    `this(token-metadata (~(del by token-metadata) [src.bowl token]))
      %bind-slash
    :_  this
    ~[[%pass /eyre/connect %arvo %e %connect [~ /] dap.bowl]]
      %unbind-slash
    :_  this
    ~[[%pass /eyre/connect %arvo %e %connect [~ /] %docket]]
  ==
::
++  on-agent  on-agent:def
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?>  =(our.bowl src.bowl)
  ?+  path  (on-watch:def path)
    [%http-response *]  `this
  ==
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  ?+    sign-arvo  (on-arvo:def wire sign-arvo)
      [%eyre %bound *]
    ~?  !accepted.sign-arvo
      [dap.bowl 'eyre bind rejected!' binding.sign-arvo]
    [~ this]
  ==
::
++  on-fail   on-fail:def
--
