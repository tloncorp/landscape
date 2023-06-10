import { useEffect } from 'react';
import { useAsyncCall } from '../logic/useAsyncCall';
import { fakeRequest } from './util';

const api = {
  forceUpdate() {
    return fakeRequest(null, 1000);
  },
  async getAzimuthState() {
    return fakeRequest(
      {
        block: '16.514.728',
        stale: false,
      },
      1000
    );
  },
};

export const useAzimuthState = () => {
  const {
    status: stateLoadStatus,
    call: loadState,
    error: stateLoadError,
    result: state,
  } = useAsyncCall(api.getAzimuthState);

  const {
    status: forceUpdateStatus,
    call: forceUpdate,
    error: forceUpdateError,
  } = useAsyncCall(api.forceUpdate);

  // attempt to load initial State on mount
  useEffect(() => {
    loadState();
  }, []);

  return {
    state,
    stateLoadStatus,
    stateLoadError,
    forceUpdate,
    forceUpdateStatus,
    forceUpdateError,
  };
};
[];
