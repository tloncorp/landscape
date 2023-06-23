import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppInfo } from '../../components/AppInfo';
import { Spinner } from '../../components/Spinner';
import useDocketState, { useCharge, useTreaty } from '../../state/docket';
import { usePike } from '../../state/kiln';
import { getAppName } from '@/logic/utils';
import { useAppSearchStore } from '../Nav';
import { useConnectivityCheck } from '@/state/vitals';
import { ShipConnection } from '@/components/ShipConnection';
import { AppSearch } from '../AppSearch';

export const TreatyInfo = () => {
  const select = useAppSearchStore((state) => state.select);
  const { host = '', desk = '' } = useParams<{ host: string; desk: string }>();
  const treaty = useTreaty(host, desk);
  const pike = usePike(desk);
  const charge = useCharge(desk);
  const name = getAppName(treaty);
  const { data, showConnection } = useConnectivityCheck(host);

  useEffect(() => {
    if (!charge) {
      useDocketState.getState().requestTreaty(host, desk);
    }
  }, [host, desk]);

  useEffect(() => {
    select(<>{name}</>);
    useAppSearchStore.setState({ matches: [] });
  }, [name]);

  if (!treaty) {
    // TODO: maybe replace spinner with skeletons
    return (
      <div className="dialog-inner-container flex items-center space-x-3 space-y-0">
        {!data || ('pending' in data.status && <Spinner className="h-6 w-6" />)}
        {showConnection && <ShipConnection ship={host} status={data?.status} />}
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col p-4">
      <AppSearch />
      <AppInfo
        treatyInfoShip={treaty.ship}
        className="dialog-inner-container"
        docket={charge || treaty}
        pike={pike}
      />
    </div>
  );
};
