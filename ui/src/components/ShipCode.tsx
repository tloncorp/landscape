import React, { FunctionComponent, useState } from 'react';
import useAccessKey from '@/state/code';
import { useCopy } from '@/logic/utils';

export const ShipCode: FunctionComponent = () => {
  const { code } = useAccessKey();
  const [show, setShow] = useState(false);

  const { didCopy, doCopy } = useCopy(code);

  return show ? (
    <div className="flex items-center justify-between rounded bg-gray-100 p-3">
      <pre>{code}</pre>
      <button className="small-button" onClick={doCopy}>
        {didCopy ? 'Copied!' : 'Copy'}
      </button>
    </div>
  ) : (
    <button className="button" onClick={() => setShow(true)}>
      Show Access Key
    </button>
  );
};
