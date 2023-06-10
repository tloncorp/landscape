import { useEffect } from 'react';
import { useAsyncCall } from '../logic/useAsyncCall';
import { fakeRequest } from './util';

export type AvailabilityStatus = 'initial' | 'available' | 'unavailable';

const api = {
  checkShipAvailability(
    shipName: string
  ): Promise<{ status: AvailabilityStatus }> {
    return fakeRequest({
      status: 'available',
    });
  },
  getPeerDiscoveryShips() {
    return fakeRequest(['~zod', '~nus', '~bus'], 1000);
  },
};

export const useShipAvailability = (shipName: string) => {
  const {
    call: checkAvailability,
    result: availability,
    status,
    error,
  } = useAsyncCall(api.checkShipAvailability);

  useEffect(() => {
    checkAvailability(shipName);
  }, []);

  return { status, availability, error, checkAvailability };
};

export const usePeerDiscoveryShips = () => {
  const {
    call: getShips,
    result: peerDiscoveryShips,
    status,
    error,
  } = useAsyncCall(api.getPeerDiscoveryShips);

  useEffect(() => {
    getShips();
  }, []);

  return { status, error, peerDiscoveryShips, getShips };
};
