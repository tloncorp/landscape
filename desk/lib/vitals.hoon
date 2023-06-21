/-  vitals
|%
++  simplify-qos
  |=  =ship-state:ames
  ^-  qos:ames
  ?-  -.ship-state
    %alien  [%dead *@da]
    %known  ?+  -.qos.ship-state  qos.ship-state
              %unborn   [%dead last-contact.qos.ship-state]
  ==        ==
++  scry-qos
  |=  [=ship =time peer=ship]
  ^-  qos:ames
  %-  simplify-qos
  .^  ship-state:ames
      %ax
      (scot %p ship)
      %$
      (scot %da time)
      %peers
      (scot %p peer)
      ~
  ==
--
