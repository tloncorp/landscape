import api from '../api';
import { useState, useEffect } from 'react';
import { deSig } from '@urbit/aura';

export default function useAccessKey() {
  const [code, setCode] = useState('');

  useEffect(() => {
    (
      api.thread({
        inputMark: 'noun',
        outputMark: 'ship',
        desk: 'base',
        threadName: 'code',
        body: '',
      }) as Promise<string>
    )
      .then((res) => {
        const result = deSig(res);
        setCode(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return {
    code: code,
  };
}
