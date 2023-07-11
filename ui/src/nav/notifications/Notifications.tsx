import cn from 'classnames';
import React, { useEffect, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../../components/ErrorAlert';
import { useGroups } from './groups';
import Notification from './Notification';
import { useNotifications } from './useNotifications';
import { useSawSeamMutation } from '@/state/hark';
import { Spinner } from '@/components/Spinner';
import { useIsMobile } from '@/logic/useMedia';
import { randomIntInRange } from '@/logic/utils';

interface MarkAsReadProps {
  unreads: boolean;
}

function MarkAsRead({ unreads }: MarkAsReadProps) {
  const isMobile = useIsMobile();
  const { mutate: sawSeam, isLoading } = useSawSeamMutation();
  const markAllRead = useCallback(() => {
    sawSeam({ seam: { all: null } });
  }, []);

  return (
    <button
      disabled={isLoading || !unreads}
      className={cn(
        'whitespace-nowrap text-sm',
        isMobile ? 'small-button' : 'button',
        {
          'bg-gray-400 text-gray-800': isLoading || !unreads,
          'bg-blue text-white': !isLoading && unreads,
        }
      )}
      onClick={markAllRead}
    >
      {isLoading ? <Spinner className="h-4 w-4" /> : 'Mark All Read'}
    </button>
  );
}

function NotificationPlaceholder() {
  const isMobile = useIsMobile();
  return (
    <div className="flex w-full animate-pulse flex-col rounded-lg">
      <div className="flex w-full flex-1 space-x-3 rounded-lg p-2">
        <div className="flex h-6 w-24 justify-center rounded-md bg-gray-100 text-sm" />
      </div>
      <div className="flex w-full flex-1 space-x-3 rounded-lg p-2">
        <div
          className="h-12 w-full rounded-md bg-gray-200"
          style={{
            width: `${randomIntInRange(300, isMobile ? 300 : 900)}px`,
          }}
        />
      </div>
    </div>
  );
}

export const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, count, loaded } = useNotifications();
  const groups = useGroups();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorAlert}
      onReset={() => navigate('/leap/notifications')}
    >
      <div className="h-full overflow-y-scroll p-4 pr-2 md:p-9 md:pr-7">
        <div className="mb-4 flex w-full items-center justify-between">
          <h2 className="text-xl font-semibold">All Notifications</h2>
          <MarkAsRead unreads={count > 0} />
        </div>
        <section className="w-full">
          {loaded ? (
            notifications.length === 0 ? (
              <div className="mt-3 flex w-full items-center justify-center">
                <span className="text-base font-semibold text-gray-400">
                  No notifications
                </span>
              </div>
            ) : (
              notifications.map((grouping) => (
                <div
                  className="mb-4 rounded-xl bg-gray-50 p-4"
                  key={grouping.date}
                >
                  <h2 className="mb-4 text-lg font-bold text-gray-400">
                    {grouping.date}
                  </h2>
                  <ul className="space-y-2">
                    {grouping.skeins.map((b) => (
                      <li key={b.time}>
                        <Notification bin={b} groups={groups} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )
          ) : (
            new Array(15)
              .fill(true)
              .map((_, i) => <NotificationPlaceholder key={i} />)
          )}
        </section>
      </div>
    </ErrorBoundary>
  );
};
