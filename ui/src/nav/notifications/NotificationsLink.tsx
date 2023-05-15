import classNames from 'classnames';
import React, { useCallback } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Cross } from '../../components/icons/Cross';
import { useAppSearchStore } from '../Nav';
import BellIcon from '../../components/icons/BellIcon';
import { useNotifications } from './useNotifications';
import { useDisplay } from '@/state/settings';

type NotificationsState = 'empty' | 'unread' | 'attention-needed' | 'open';

function getNotificationsState(
  isOpen: boolean,
  count: number,
  dnd: boolean
): NotificationsState {
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

export const NotificationsLink = ({
  navOpen,
  notificationsOpen,
}: NotificationsLinkProps) => {
  const { doNotDisturb } = useDisplay();
  const { count } = useNotifications();
  const state = getNotificationsState(notificationsOpen, count, doNotDisturb);
  const select = useAppSearchStore((s) => s.select);
  const clearSelection = useCallback(() => select(null), [select]);

  return (
    <Link
      to={state === 'open' ? '/' : '/notifications'}
      className={classNames(
        'circle-button h4 default-ring relative z-50 flex-none',
        navOpen && 'text-opacity-60',
        state === 'open' && 'bg-gray-50',
        state === 'empty' && 'bg-gray-50 text-gray-100',
        state === 'unread' && 'bg-blue-400 text-white dark:text-black'
      )}
      onClick={clearSelection}
    >
      {state === 'empty' && <BellIcon className="h-6 w-6" />}
      {state === 'unread' && <BellIcon className="h-6 w-6 -rotate-12" />}
      {state === 'open' && (
        <>
          <Cross className="h-3 w-3 fill-current" />
          <span className="sr-only">Close</span>
        </>
      )}
    </Link>
  );
};
