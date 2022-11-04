import { kilnBump, Pike } from '@urbit/api';
import { partition, pick } from 'lodash';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../state/api';
import { useCharges } from '../state/docket';
import useKilnState, { usePike } from '../../state/kiln';

function pikeIsBlocked(newKelvin: number, pike: Pike) {
  return !pike.wefts?.find(({ kelvin }) => kelvin === newKelvin);
}

export function useSystemUpdate() {
  const { push } = useHistory();
  const basePike = usePike('base');
  const update = base?.arak?.rail?.next?.[0];
  const newKelvin = basePike?.wefts[0]?.kelvin ?? 418;
  const charges = useCharges();
  const [blocked] = useKilnState((s) => {
    const [b, u] = partition(Object.entries(s.pikes), ([, pike]) => pikeIsBlocked(newKelvin, pike));
    return [b.map(([d]) => d), u.map(([d]) => d)] as const;
  });

  const systemBlocked = update && blocked;
  const blockedCharges = Object.values(pick(charges, blocked));
  const blockedCount = blockedCharges.length;

  const freezeApps = useCallback(async () => {
    api.poke(kilnBump());
    push('/leap/upgrading');
  }, []);

  return {
    base,
    update,
    systemBlocked,
    blockedCharges,
    blockedCount,
    freezeApps
  };
}
