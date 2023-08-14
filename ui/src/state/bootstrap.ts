import api from '@/api';
import queryClient from '@/query-client';
import {
  AllyUpdateIni,
  ChargeUpdateInitial,
  scryAllies,
  scryCharges,
  scryDefaultAlly,
} from '@/gear';
import { ChargesWithDesks, ChargeWithDesk, normalizeDocket } from './docket';

const fetchCharges = async () => {
  const charg = (await api.scry<ChargeUpdateInitial>(scryCharges)).initial;

  const charges = Object.entries(charg).reduce(
    (obj: ChargesWithDesks, [key, value]) => {
      // eslint-disable-next-line no-param-reassign
      obj[key] = normalizeDocket(value as ChargeWithDesk, key);
      return obj;
    },
    {}
  );

  queryClient.setQueryData(['charges'], charges);
};

const fetchDefaultAlly = async () => {
  const defaultAlly = await api.scry<string>(scryDefaultAlly);

  queryClient.setQueryData(['defaultAlly'], defaultAlly);
};

const fetchAllies = async () => {
  const allies = (await api.scry<AllyUpdateIni>(scryAllies)).ini;

  queryClient.setQueryData(['allies'], allies);
};

export default function bootstrap() {
  fetchCharges();
  fetchDefaultAlly();
  fetchAllies();
}
