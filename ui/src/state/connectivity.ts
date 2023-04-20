import { useCallback, useEffect, useState } from 'react';
import { fakeRequest } from './util';

export type AvailabilityStatus = 'initial' | 'available' | 'unavailable';

const api = {
  checkShipAvailability(shipName: string) {
    return fakeRequest({
      status: 'available',
    });
  },
  getPeerDiscoveryShips() {
    return fakeRequest(['~zod', '~nus', '~bus'], 1000);
  },
};

const checkShipAvailability = async (
  shipName: string
): Promise<{ status: AvailabilityStatus }> => {
  return fakeRequest({
    status: 'available',
  });
};

export const useShipAvailability = (shipName: string) => {
  const [availabilityStatus, setAvailabilityStatus] =
    useState<AvailabilityStatus>('initial');
  const [isChecking, setIsChecking] = useState(false);

  const checkAvailability = useCallback(async () => {
    setIsChecking(true);
    const { status } = await checkShipAvailability(shipName);
    setAvailabilityStatus(status);
    setIsChecking(false);
  }, []);

  useEffect(() => {
    checkAvailability();
  }, []);

  return { isChecking, availabilityStatus, refresh: checkAvailability };
};

export const usePeerDiscoveryShips = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [peerDiscoveryShips, setPeerDiscoverShips] = useState<string[] | null>(
    null
  );

  const getShips = useCallback(async () => {
    setIsLoading(true);
    const ships = await api.getPeerDiscoveryShips();
    setPeerDiscoverShips(ships);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getShips();
  }, []);

  return { isLoading, peerDiscoveryShips, getShips };
};
