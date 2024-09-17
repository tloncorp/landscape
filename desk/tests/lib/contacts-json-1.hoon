/-  *contacts, g=groups
/+  *test
/+  c=contacts, j=contacts-json-1
::
/=  c0  /mar/contact-0
/=  c1  /mar/contact
/~  mar  *  /mar/contact
::
|%
::
++  ex-equal
  |=  [a=vase b=vase]
  (expect-eq b a)
::
++  jex-equal
  |=  [jon=json txt=@t]
  %+  ex-equal
  !>  (en:json:html jon)
  !>  txt
::
++  test-ship
  %+  jex-equal
  (ship:enjs:j ~sampel-palnet)
  '"~sampel-palnet"'
++  test-cid
  %+  jex-equal
  (cid:enjs:j 0v11abc)
  '"0v11abc"'
++  test-kip
  ;:  weld
    %+  jex-equal
    (kip:enjs:j ~sampel-palnet)
    '"~sampel-palnet"'
    ::
    %+  jex-equal
    (kip:enjs:j id+0v11abc)
    '"0v11abc"'
  ==
++  test-value
  ;:  weld
    ::
    %+  jex-equal
    (value:enjs:j [%text 'the lazy fox'])
    '{"type":"text","value":"the lazy fox"}'
    ::
    %+  jex-equal
    (value:enjs:j [%date ~2024.9.11])
    '{"type":"date","value":"~2024.9.11"}'
    ::
    %+  jex-equal
    (value:enjs:j [%tint 0xcafe.babe])
    '{"type":"tint","value":"cafe.babe"}'
    ::
    %+  jex-equal
    (value:enjs:j [%ship ~sampel-palnet])
    '{"type":"ship","value":"~sampel-palnet"}'
    ::
    %+  jex-equal
    (value:enjs:j [%look 'https://ship.io/avatar.png'])
    '{"type":"look","value":"https://ship.io/avatar.png"}'
    ::
    %+  jex-equal
    (value:enjs:j [%cult [~sampel-palnet %circle]])
    '{"type":"cult","value":"~sampel-palnet/circle"}'
    ::
    %+  jex-equal
    %-  value:enjs:j 
      [%set (silt `(list value)`~[cult/[~sampel-palnet %circle] cult/[~sampel-pardux %square]])]
    '{"type":"set","value":[{"type":"cult","value":"~sampel-palnet/circle"},{"type":"cult","value":"~sampel-pardux/square"}]}'
  ==
++  test-contact
  %+  jex-equal
  %-  contact:enjs:j
    %-  malt
    ^-  (list [@tas value])
    :~  name+text/'Sampel'
        surname+text/'Palnet'
    ==
  '{"name":{"type":"text","value":"Sampel"},"surname":{"type":"text","value":"Palnet"}}'
--
