import classNames from 'classnames';
import React, { useCallback } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Cross } from '../../components/icons/Cross';
import { useLeapStore } from '../Nav';
import { SettingsState, useSettingsState } from '../../state/settings';
import BellIcon from '../../components/icons/BellIcon';
import { useNotifications } from './useNotifications';

type NotificationsState = 'empty' | 'unread' | 'attention-needed' | 'open';

function getNotificationsState(isOpen: boolean, count: number, dnd: boolean): NotificationsState {
  if (isOpen) {
    return 'open';
  }

  if (dnd || count === 0) {
    return 'empty';
  }

  return 'unread';
}

type NotificationsLinkProps = Omit<LinkProps<HTMLAnchorElement>, 'to'> & {
  navOpen: boolean;
  notificationsOpen: boolean;
};

const selDnd = (s: SettingsState) => s.display.doNotDisturb;

export const NotificationsLink = ({ navOpen, notificationsOpen }: NotificationsLinkProps) => {
  const dnd = useSettingsState(selDnd);
  const { count } = useNotifications();
  const state = getNotificationsState(notificationsOpen, count, dnd);
  const select = useLeapStore((s) => s.select);
  const clearSelection = useCallback(() => select(null), [select]);

  return (
    <Link
      to={state === 'open' ? '/' : '/leap/notifications'}
      className={classNames(
        'relative z-50 flex-none circle-button h4 default-ring',
        navOpen && 'text-opacity-60',
        state === 'open' && 'bg-gray-50',
        state === 'empty' && 'text-gray-100 bg-gray-50',
        state === 'unread' && 'bg-blue-400 text-white dark:text-black'
      )}
      onClick={clearSelection}
    >
      {state === 'empty' && <BellIcon className="w-6 h-6" />}
      {state === 'unread' && <BellIcon className="w-6 h-6 -rotate-12" />}
      {state === 'open' && (
        <>
          <Cross className="w-3 h-3 fill-current" />
          <span className="sr-only">Close</span>
        </>
      )}
    </Link>
  );
};
