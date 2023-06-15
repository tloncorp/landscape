/-  v=vitals
/+  default-agent
^-  agent:gall
=>
  |%
  +$  card      card:agent:gall
  --
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
++  on-init   on-init:def
++  on-save   on-save:def
++  on-load   on-load:def
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+  mark  (on-poke:def mark vase)
      %sub
    ?>  =(our.bowl src.bowl)
    =+  !<(=ship vase)
    :_  this
    :~  :*  %pass  /updates
            %agent  [our.bowl %vitals]
            %watch  /status/(scot %p ship)
    ==  ==
  ==
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?+  wire  (on-agent:def wire sign)
      [%updates ~]
    ?+  -.sign  (on-agent:def wire sign)
        %fact
      ?+  p.cage.sign  (on-agent:def wire sign)
          %vitals-result
        =/  =result:v  !<(result:v q.cage.sign)
        ~&  result
        `this
      ==
    ==
  ==
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
