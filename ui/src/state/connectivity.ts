import { useCallback, useEffect, useState } from 'react';
import { fakeRequest } from './util';

export type AvailabilityStatus = 'initial' | 'available' | 'unavailable';

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

  return { isChecking, availabilityStatus, checkAvailability };
};
