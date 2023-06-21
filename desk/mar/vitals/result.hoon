/-  *vitals
=,  format
|_  =result
++  grab
  |%
  ++  noun  result
  --
++  grow
  |%
  ++  noun  result
  ++  json
    %-  pairs:enjs
    :~
      ['timestamp' (time:enjs timestamp.result)]
    ::
      :-  'status'
      %-  pairs:enjs
      ?-    -.status.result
          %pending
        :-  ['pending' [%s -.p.status.result]]
        ?+  -.p.status.result  ~
            %trying-sponsor  ['ship' (ship:enjs ship.p.status.result)]~
        ==
      ::
          %complete
        :-  ['complete' [%s -.p.status.result]]
        ?+  -.p.status.result  ~
           %no-our-planet    ['last-contact' (time:enjs last-contact.p.status.result)]~
            %no-our-galaxy    ['last-contact' (time:enjs last-contact.p.status.result)]~
            %no-sponsor-hit   ['ship' (ship:enjs ship.p.status.result)]~
            %no-sponsor-miss  ['ship' (ship:enjs ship.p.status.result)]~
            %no-their-galaxy  ['last-contact' (time:enjs last-contact.p.status.result)]~
            %crash            ['crash' a+(turn tang.p.status.result tank:enjs)]~
        ==
      ==
    ==
  --
++  grad  %noun
--
