import { kilnBump, Pike } from '@/gear';
import { partition, pick } from 'lodash';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useCharges } from '../state/docket';
import useKilnState, { usePike } from '../state/kiln';

function pikeIsBlocked(newKelvin: number, pike: Pike) {
  return (
    pike.zest === 'live' &&
    !pike.wefts?.find(({ kelvin }) => kelvin === newKelvin)
  );
}

export function useSystemUpdate() {
  const navigate = useNavigate();
  const base = usePike('base');
  const nextUpdate = base?.wefts[0];
  const newKelvin = base?.wefts[0]?.kelvin ?? 417;
  const charges = useCharges();
  const [blocked] = useKilnState((s) => {
    const [b, u] = partition(Object.entries(s.pikes), ([, pike]) =>
      pikeIsBlocked(newKelvin, pike)
    );
    return [b.map(([d]) => d), u.map(([d]) => d)] as const;
  });

  const systemBlocked = nextUpdate && blocked;
  const blockedCharges = Object.values(pick(charges, blocked));
  const blockedCount = blockedCharges.length;

  const freezeApps = useCallback(async () => {
    await api.poke(kilnBump());
    navigate('/leap/upgrading');
  }, []);

  return {
    nextUpdate,
    systemBlocked,
    blockedCharges,
    blockedCount,
    freezeApps,
  };
}
