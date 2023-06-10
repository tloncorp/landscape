import { useAsyncCall } from '../logic/useAsyncCall';
import { fakeRequest } from './util';

const pack = () => {
  return fakeRequest(null, 1000);
};

export const useLoom = () => {
  const {
    call: runPack,
    status: isPacking,
    error: packError,
  } = useAsyncCall(() => {
    return pack();
  });

  return {
    free: 3000000,
    total: 4096000,
    pack: runPack,
    isPacking,
    packError,
  };
};
