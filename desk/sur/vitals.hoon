|%
+|  %constants
::
++  info-timeout  ~s30
::
++  target-timeout  ~s10
::
+|  %types
::
+$  result
  $:  timestamp=@da
      =status
  ==
::
+$  status
  $%  [%complete p=complete]
      [%pending p=pending]
  ==
::
+$  complete
  $%  [%yes ~]
      [%no-data ~]                          ::  yet to test connectivity for ship
      [%no-dns ~]                           ::  can't even talk to example.com
      [%no-our-planet last-contact=@da]     ::  can't reach our own planet (moon only)
      [%no-our-galaxy last-contact=@da]     ::  can't reach our own galaxy
      [%no-sponsor-hit =ship]               ::  their sponsor can reach their ship
      [%no-sponsor-miss =ship]              ::  their sponsor can't reach their ship
      [%no-their-galaxy last-contact=@da]   ::  can't reach their galaxy
      [%crash =tang]                        ::  check crashed
  ==
::
+$  pending
  $%  [%setting-up ~]
      [%trying-dns ~]
      [%trying-local ~]
      [%trying-target ~]
      [%trying-sponsor =ship]
  ==
::
+$  update
  $:  =ship
      =result
  ==
::
+$  ship-state
  $%  [%idle ~]
      [%poking ~]
      [%http until=@da]
      [%waiting until=@da]
  ==
::
+$  ping
  $%  [%0 ships=(map ship [=rift =ship-state])]
      $:  %1
          ships=(set ship)
          nonce=@ud
          $=  plan
          $~  [%nat ~]
          $%  [%nat ~]
              [%pub ip=(unit @t)]
          ==
      ==
    ::
      $:  %2
          ships=(set ship)
          nonce=@ud
          $=  plan
          $~  [%nat ~]
          $%  [%nat ~]
              [%pub ip=(unit @t)]
              [%off ~]
              [%one ~]
          ==
      ==
    ::
     $:  %3
         mode=?(%formal %informal)
         pokes=@ud
         timer=(unit [=wire date=@da])
         galaxy=@p
     ==
  ==
--
