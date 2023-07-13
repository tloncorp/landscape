/-  g=groups
|%
++  enjs
  =,  enjs:format
  |%
  ++  flag
    |=  f=flag:g
    (rap 3 (scot %p p.f) '/' q.f ~)
  ::
  ++  nest
    |=  n=nest:g
    (rap 3 p.n '/' (flag q.n) ~)
  --
++  dejs
  =,  dejs:format
  |%
  ++  ship  (se %p)
  ++  flag  (su ;~((glue fas) ;~(pfix sig fed:ag) sym))
  ++  nest  (su ;~((glue fas) sym ;~(pfix sig fed:ag)))
  --
--