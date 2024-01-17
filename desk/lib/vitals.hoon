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
  ::  a ship is not guaranteed by %ames to know itself, so we fake it
  ?:  =(ship peer)
    [%live time]
  ::  .^(* %ax /=//=/peers/[peer]) crashes if the peer is unknown, so we
  ::  check the source map beforehand and fake an %unborn if we can see
  ::  a crash coming
  =/  peers  .^((map ^ship ?(%alien %known)) ~[%ax %$ %peers])
  ?.  (~(has by peers) peer)
    [%unborn time]
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
