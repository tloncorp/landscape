import { Pike } from '@/gear';
import clipboardCopy from 'clipboard-copy';
import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { PillButton } from './Button';
import { DocketHeader } from './DocketHeader';
import { Spinner } from './Spinner';
import { PikeMeta } from './PikeMeta';
import { App, useInstallStatus, useRemoteDesk, useTreaty } from '../state/docket';
import { getAppHref, getAppName } from '@/logic/utils';
import { addRecentApp } from '../nav/search/Home';
import { TreatyMeta } from './TreatyMeta';
import { useHistory, useParams } from 'react-router-dom';

interface AppInfoProps {
  docket: App;
  pike?: Pike;
  treatyInfoShip?: string;
  className?: string;
}

export const AppInfo: FC<AppInfoProps> = ({
  docket,
  pike,
  className,
  treatyInfoShip,
}) => {
  const [ship, desk] = useRemoteDesk(docket, pike, treatyInfoShip);
  const publisher = pike?.sync?.ship ?? ship;
  const [copied, setCopied] = useState(false);
  const treaty = useTreaty(ship, desk);
  const { push } = useHistory();
  const installStatus = useInstallStatus(docket);
  const { host } = useParams<{ host: string }>();

  const copyApp = useCallback(() => {
    setCopied(true);
    clipboardCopy(`/1/desk/${publisher}/${desk}`);

    setTimeout(() => {
      setCopied(false);
    }, 1250);
  }, [publisher, desk]);

  const installing = installStatus === 'installing';

  if (!docket) {
    // TODO: maybe replace spinner with skeletons
    return (
      <div className="dialog-inner-container flex justify-center text-black">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className={cn('text-black', className)}>
      <DocketHeader docket={docket}>
        <div className="col-span-2 flex items-center space-x-4 md:col-span-1">
          {installStatus === 'installed' && (
            <PillButton
              variant="alt-primary"
              as="a"
              href={getAppHref(docket.href)}
              target="_blank"
              rel="noreferrer"
              onClick={() => addRecentApp(docket.desk)}
            >
              Open App
            </PillButton>
          )}
          {installStatus !== 'installed' && (
            <PillButton variant='alt-primary' onClick={() => push(`/search/${ship}/apps/${host}/${desk}/permissions`)}>
              Get &ldquo;{getAppName(docket)}&rdquo;
            </PillButton>
          )}
          <PillButton variant="alt-secondary" onClick={copyApp}>
            {!copied && 'Copy App Link'}
            {copied && 'copied!'}
          </PillButton>
        </div>
      </DocketHeader>
      <div className="space-y-6">
        {pike ? (
          <>
            <hr className="-mx-5 border-gray-50 sm:-mx-8" />
            <PikeMeta pike={pike} />
          </>
        ) : null}
        {!treaty ? null : (
          <>
            <hr className="-mx-5 border-gray-50 sm:-mx-8" />
            <TreatyMeta treaty={treaty} />
          </>
        )}
      </div>
    </div>
  );
};
