import React, { PropsWithChildren, useCallback } from 'react';
import {
  Link,
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import classNames from 'classnames';
import { NotificationPrefs } from './NotificationPrefs';
import { AboutSystem } from './about-system/AboutSystem';
import { InterfacePrefs } from './InterfacePrefs';
import { SecurityPrefs } from './SecurityPrefs';
import { AppearancePrefs } from './AppearancePrefs';
import { useCharges } from '../state/docket';
import { AppPrefs } from './AppPrefs';
import { StoragePrefs } from './StoragePrefs';
import { InvitePrefs } from './InvitePrefs';
import { DocketImage } from '../components/DocketImage';
import { ErrorAlert } from '../components/ErrorAlert';
import { useMedia } from '../logic/useMedia';
import { LeftArrow } from '../components/icons/LeftArrow';
import { getAppName } from '../state/util';
import { Help } from '../nav/Help';
import TlonIcon from '../components/icons/TlonIcon';
import HelpIcon from '../components/icons/HelpIcon';
import LogoutIcon from '../components/icons/LogoutIcon';
import BellIcon from '../components/icons/BellIcon';
import BurstIcon from '../components/icons/BurstIcon';
import PencilIcon from '../components/icons/PencilIcon';
import ForwardSlashIcon from '../components/icons/ForwardSlashIcon';
import SlidersIcon from '../components/icons/SlidersIcon';
import Sig16Icon from '../components/icons/Sig16Icon';
import InvitesIcom from '../components/icons/InvitesIcon';
import { useSystemUpdate } from '../logic/useSystemUpdate';
import { Bullet } from '../components/icons/Bullet';
import SearchSystemPreferences from './SearchSystemPrefences';
import { ShortcutPrefs } from './ShortcutPrefs';
import { AttentionAndPrivacy } from './AttentionAndPrivacy';
import { useReelInstalled } from "../state/invites"

interface SystemPreferencesSectionProps {
  url: string;
  active: boolean;
  visible?: boolean;
}

function SystemPreferencesSection({
  url,
  active,
  children,
  visible=true,
}: PropsWithChildren<SystemPreferencesSectionProps>) {
  return (
    <li>
      <Link
        to={url}
        className={classNames(
          'flex items-center rounded-lg px-2 py-2 hover:bg-gray-50 hover:text-black',
          active && 'bg-gray-50 text-black',
          !visible && 'hidden'
        )}
      >
        {children}
      </Link>
    </li>
  );
}

export const SystemPreferences = (
  props: RouteComponentProps<{ submenu: string }>
) => {
  const { match, history } = props;
  const subMatch = useRouteMatch<{ submenu: string; desk?: string }>(
    `${match.url}/:submenu/:desk?`
  );
  const { systemBlocked } = useSystemUpdate();
  const charges = useCharges();
  const filteredCharges = Object.values(charges)
    .filter((charge) => charge.desk !== 'landscape');
  const isMobile = useMedia('(max-width: 639px)');
  const settingsPath = isMobile ? `${match.url}/:submenu` : '/';
  const reelInstalled = useReelInstalled();

  const matchSub = useCallback(
    (target: string, desk?: string) => {
      if (isMobile) {
        return false;
      }

      if (!subMatch && target === 'system-updates') {
        return true;
      }

      if (desk && subMatch?.params.desk !== desk) {
        return false;
      }

      return subMatch?.params.submenu === target;
    },
    [match, subMatch]
  );

  const subUrl = useCallback(
    (submenu: string) => `${match.url}/${submenu}`,
    [match]
  );

  return (
    <ErrorBoundary
      FallbackComponent={ErrorAlert}
      onReset={() => history.push('/leap/system-preferences')}
    >
      <div className="system-preferences-grid bg-gray-50">
        <Route exact={isMobile} path={match.url}>
          <aside className="system-preferences-aside min-h-fit flex max-h-[calc(100vh-6.25rem)] w-full min-w-60 flex-col border-r-2 border-gray-50 bg-white py-4 font-semibold text-black sm:w-auto sm:py-8 sm:text-gray-600">
            <nav className="flex flex-col px-2 sm:px-6">
              <SearchSystemPreferences subUrl={subUrl} />
              <span className="pt-1 pl-2 pb-3 text-sm font-semibold text-gray-400">
                Landscape
              </span>
              <ul className="space-y-1">
                <SystemPreferencesSection
                  url={subUrl('system-updates')}
                  active={matchSub('system-updates')}
                >
                  <TlonIcon className="mr-3 h-6 w-6 rounded-md text-gray-600" />
                  About System
                  {systemBlocked && (
                    <Bullet className="ml-auto h-5 w-5 text-orange-500" />
                  )}
                </SystemPreferencesSection>
                <SystemPreferencesSection
                  url={subUrl('help')}
                  active={matchSub('help')}
                >
                  <HelpIcon className="mr-3 h-6 w-6 rounded-md text-gray-600" />
                  Help and Support
                </SystemPreferencesSection>
                <SystemPreferencesSection
                  url={subUrl('security')}
                  active={matchSub('security')}
                >
                  <LogoutIcon className="mr-3 h-6 w-6 rounded-md text-gray-600" />
                  Log Out...
                </SystemPreferencesSection>
              </ul>
            </nav>
            <nav className="flex flex-col px-2 sm:px-6">
              <span className="pt-5 pl-2 pb-3 text-sm font-semibold text-gray-400">
                Settings
              </span>
              <ul className="space-y-1">
                <SystemPreferencesSection
                  url={subUrl('notifications')}
                  active={matchSub('notifications')}
                >
                  <BellIcon className="mr-3 h-6 w-6 rounded-md text-gray-600" />
                  Notifications
                </SystemPreferencesSection>
                <SystemPreferencesSection
                  url={subUrl('privacy')}
                  active={matchSub('privacy')}
                >
                  <BurstIcon className="mr-3 h-6 w-6 rounded-md text-gray-600" />
                  Attention &amp; Privacy
                </SystemPreferencesSection>
                <SystemPreferencesSection
                  url={subUrl('appearance')}
                  active={matchSub('appearance')}
                >
                  <PencilIcon className="mr-3 h-6 w-6 rounded-md text-gray-600" />
                  Appearance
                </SystemPreferencesSection>
                <SystemPreferencesSection
                  url={subUrl('shortcuts')}
                  active={matchSub('shortcuts')}
                >
                  <ForwardSlashIcon className="mr-3 h-6 w-6 rounded-md text-gray-600" />
                  Shortcuts
                </SystemPreferencesSection>
                <SystemPreferencesSection
                  url={subUrl('interface')}
                  active={matchSub('interface')}
                >
                  <Sig16Icon className="mr-3 h-6 w-6 rounded-md text-gray-600" />
                  Interface Settings
                </SystemPreferencesSection>
                <SystemPreferencesSection
                  url={subUrl('storage')}
                  active={matchSub('storage')}
                >
                  <SlidersIcon className="mr-3 h-6 w-6 rounded-md text-gray-600" />
                  Remote Storage
                </SystemPreferencesSection>
                <SystemPreferencesSection
                  url={subUrl('invites')}
                  active={matchSub('invites')}
                  visible={reelInstalled}
                >
                  <InvitesIcom className="mr-3 h-6 w-6 rounded-md text-gray-600" />
                  Invite Links
                </SystemPreferencesSection>
              </ul>
            </nav>
            <nav className="flex flex-col px-2 sm:px-6">
              <span className="pt-5 pl-2 pb-3 text-sm font-semibold text-gray-400">
                Installed App Settings
              </span>
              <ul className="space-y-1">
                {filteredCharges
                  .sort((a, b) => getAppName(a).localeCompare(getAppName(b)))
                  .map((charge) => (
                    <SystemPreferencesSection
                      key={charge.desk}
                      url={subUrl(`apps/${charge.desk}`)}
                      active={matchSub('apps', charge.desk)}
                    >
                      <DocketImage size="small" className="mr-3" {...charge} />
                      {getAppName(charge)}
                    </SystemPreferencesSection>
                ))}
              </ul>
            </nav>
          </aside>
        </Route>
        <Route path={settingsPath}>
          <section className="system-preferences-content min-h-fit max-h-[calc(100vh-6.25rem)] flex-1 flex-col bg-gray-50 p-4 text-gray-800 sm:p-8">
            <Switch>
              <Route path={`${match.url}/apps/:desk`} component={AppPrefs} />
              <Route path={`${match.url}/help`} component={Help} />
              <Route
                path={`${match.url}/interface`}
                component={InterfacePrefs}
              />
              <Route
                path={`${match.url}/appearance`}
                component={AppearancePrefs}
              />
              <Route
                path={`${match.url}/shortcuts`}
                component={ShortcutPrefs}
              />
              <Route
                path={`${match.url}/notifications`}
                component={NotificationPrefs}
              />
              <Route
                path={`${match.url}/privacy`}
                component={AttentionAndPrivacy}
              />
              <Route path={[`${match.url}/storage`]} component={StoragePrefs} />
              <Route path={`${match.url}/security`} component={SecurityPrefs} />
              <Route path={[`${match.url}/invites`]} component={InvitePrefs} />
              <Route
                path={[`${match.url}/system-updates`, match.url]}
                component={AboutSystem}
              />
            </Switch>
            <Link
              to={match.url}
              className="sm:none h4 mt-auto inline-flex items-center pt-4 text-gray-400 sm:hidden"
            >
              <LeftArrow className="mr-2 h-3 w-3" /> Back
            </Link>
          </section>
        </Route>
      </div>
    </ErrorBoundary>
  );
};
