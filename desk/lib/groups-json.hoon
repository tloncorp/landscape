|%
++  enjs
  =,  enjs:format
  |%
  ++  flag
    |=  f=flag:h
    (rap 3 (scot %p p.f) '/' q.f ~)
  ::
  ++  nest
    |=  n=nest:h
    (rap 3 p.n '/' (flag q.n) ~)
  --
++  dejs
  =,  dejs:format
  |%
  ++  flag  (su ;~((glue fas) ;~(pfix sig fed:ag) ^sym))
  ++  nest  (su ;~((glue fas) ^sym ;~(pfix sig fed:ag)
  --
--