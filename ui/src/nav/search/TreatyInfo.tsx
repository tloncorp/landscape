import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppInfo } from '../../components/AppInfo';
import { Spinner } from '../../components/Spinner';
import { useCharge, useTreaty } from '../../state/docket';
import { usePike } from '../../state/kiln';
import { getAppName } from '@/logic/utils';
import { useAppSearchStore } from '../Nav';

export const TreatyInfo = () => {
  const select = useAppSearchStore((state) => state.select);
  const { host, desk } = useParams<{ host: string; desk: string }>();
  const treaty = useTreaty(host, desk);
  const pike = usePike(desk);
  const charge = useCharge(desk);
  const name = getAppName(treaty);

  useEffect(() => {
    select(<>{name}</>);
    useAppSearchStore.setState({ matches: [] });
  }, [name]);

  if (!treaty) {
    // TODO: maybe replace spinner with skeletons
    return (
      <div className="dialog-inner-container flex justify-center text-black">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }
  return (
    <AppInfo
      treatyInfoShip={treaty.ship}
      className="dialog-inner-container"
      docket={charge || treaty}
      pike={pike}
    />
  );
};
