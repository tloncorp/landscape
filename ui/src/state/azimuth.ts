import { useCallback, useEffect, useState } from 'react';
import { fakeRequest } from './util';

const api = {
  forceUpdate() {
    return fakeRequest(null, 1000);
  },
  async getAzimuthBlock() {
    return fakeRequest('16.514.728', 1000);
  },
};

export const useAzimuthBlock = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(true);
  const [block, setBlock] = useState<string | null>(null);

  const loadBlock = useCallback(async () => {
    setIsLoading(true);
    const block = await api.getAzimuthBlock();
    setBlock(block);
    setIsLoading(false);
  }, []);

  const forceUpdate = useCallback(async () => {
    setIsLoading(true);
    setIsStale(false);
    await api.forceUpdate();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // attempt to load initial block on mount
    loadBlock();
  }, []);

  return {
    isLoading,
    isStale,
    block,
    forceUpdate,
  };
};
[];
