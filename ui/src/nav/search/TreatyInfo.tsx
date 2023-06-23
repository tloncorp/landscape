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
  const name = treaty ? getAppName(treaty) : `${host}/${desk}`;
  const { data, showConnection } = useConnectivityCheck(host);
  // TODO replace with checking alliance to determine if still available
  const [unavailable, setUnavailable] = React.useState(false);
  const treatyNotFound =
    !treaty && unavailable && data && 'complete' in data.status;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setUnavailable(true);
    }, 20 * 1000); // matches timeout in requestTreaty
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!charge) {
      useDocketState.getState().requestTreaty(host, desk);
    }
  }, [host, desk]);

  useEffect(() => {
    select(<>{name}</>);
    useAppSearchStore.setState({ matches: [] });
  }, [name]);

  return (
    <div className="flex h-full w-full flex-col p-4">
      <AppSearch />
      {treaty ? (
        <AppInfo
          treatyInfoShip={treaty.ship}
          className="dialog-inner-container"
          docket={charge || treaty}
          pike={pike}
        />
      ) : !treatyNotFound ? (
        <div className="mt-3 flex items-center space-x-3">
          <Spinner className="h-6 w-6" />
          {showConnection && (
            <ShipConnection
              ship={host}
              status={data?.status}
              showBullet={false}
            />
          )}
        </div>
      ) : (
        <div className="mt-3 text-gray-600">
          <strong>{name}</strong> is not available.
        </div>
      )}
    </div>
  );
};
