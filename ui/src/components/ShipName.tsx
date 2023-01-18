import { cite } from '@urbit/api';
import React, { HTMLAttributes } from 'react';
import { useCalm } from '../state/settings';
import { useContact } from '../state/contact';

type ShipNameProps = {
  name: string;
  truncate?: boolean;
  showAlias?: boolean;
} & HTMLAttributes<HTMLSpanElement>;

export function ShipName({
  name,
  showAlias = false,
  truncate = true,
  ...props
}: ShipNameProps) {
  const contact = useContact(name);
  const separator = /([_^-])/;
  const citedName = truncate ? cite(name) : name;
  const calm = useCalm();

  if (!citedName) {
    return null;
  }

  const parts = citedName.replace('~', '').split(separator);
  const first = parts.shift();

  return (
    <span {...props}>
      {contact?.nickname && !calm.disableNicknames && showAlias ? (
        <span title={citedName}>{contact.nickname}</span>
      ) : (
        <>
          <span aria-hidden>~</span>
          <span>{first}</span>
          {parts.length > 1 && (
            <>
              {parts.map((piece, index) => (
                <span
                  key={`${piece}-${index}`}
                  aria-hidden={separator.test(piece)}
                >
                  {piece}
                </span>
              ))}
            </>
          )}
        </>
      )}
    </span>
  );
}
