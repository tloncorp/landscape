|%
+$  command
  $%  [%set-service vic=@t]
      [%set-ship civ=@p]
  ==
::
+$  bite
  $%  [%bite-0 token=@ta ship=@p]
      [%bite-1 token=@ta joiner=@p inviter=@p]
      [%bite-2 token=cord joiner=@p =metadata]
  ==
::
+$  metadata  [tag=term fields=(map cord cord)]
+$  confirmation  [nonce=cord token=cord]
--
