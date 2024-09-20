/-  *contacts, g=groups
/+  *test
/+  c=contacts, j=contacts-json-1, mark-warmer
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
++  jen-equal
  |=  [jon=json txt=@t]
  %+  ex-equal
  !>  (en:json:html jon)
  !>  txt
::
++  test-ship
  %+  jen-equal
  (ship:enjs:j ~sampel-palnet)
  '"~sampel-palnet"'
++  test-cid
  %+  jen-equal
  (cid:enjs:j 0v11abc)
  '"0v11abc"'
++  test-kip
  ;:  weld
    %+  jen-equal
    (kip:enjs:j ~sampel-palnet)
    '"~sampel-palnet"'
    ::
    %+  jen-equal
    (kip:enjs:j id+0v11abc)
    '"0v11abc"'
  ==
++  test-value
  ;:  weld
    ::
    %+  jen-equal
    (value:enjs:j text+'the lazy fox')
    '{"type":"text","value":"the lazy fox"}'
    ::
    %+  jen-equal
    (value:enjs:j numb+42)
    '{"type":"numb","value":42}'
    ::
    %+  jen-equal
    (value:enjs:j date+~2024.9.11)
    '{"type":"date","value":"~2024.9.11"}'
    ::
    %+  jen-equal
    (value:enjs:j [%tint 0xcafe.babe])
    '{"type":"tint","value":"cafe.babe"}'
    ::
    %+  jen-equal
    (value:enjs:j [%ship ~sampel-palnet])
    '{"type":"ship","value":"~sampel-palnet"}'
    ::
    %+  jen-equal
    (value:enjs:j [%look 'https://ship.io/avatar.png'])
    '{"type":"look","value":"https://ship.io/avatar.png"}'
    ::
    %+  jen-equal
    (value:enjs:j [%flag [~sampel-palnet %circle]])
    '{"type":"flag","value":"~sampel-palnet/circle"}'
    ::
    %+  jen-equal
    %-  value:enjs:j 
      [%set (silt `(list value)`~[flag/[~sampel-palnet %circle] flag/[~sampel-pardux %square]])]
    '{"type":"set","value":[{"type":"flag","value":"~sampel-palnet/circle"},{"type":"flag","value":"~sampel-pardux/square"}]}'
  ==
++  test-contact
  %+  jen-equal
  %-  contact:enjs:j
    %-  malt
    ^-  (list [@tas value])
    :~  name+text/'Sampel'
        surname+text/'Palnet'
    ==
  '{"name":{"type":"text","value":"Sampel"},"surname":{"type":"text","value":"Palnet"}}'
--
