import React, { useEffect, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouteComponentProps } from 'react-router-dom';
import { ErrorAlert } from '../../components/ErrorAlert';
import useHarkState from '../../state/hark';
import { groupStore } from './groups';
import Notification from './Notification';
import { useNotifications } from './useNotifications';

export const Notifications = ({ history }: RouteComponentProps) => {
  const { notifications, count } = useNotifications();
  const { groups, retrieve } = groupStore();

  let timeout = 0 as unknown as NodeJS.Timeout;
  function visibilitychange() {
    if (document.visibilityState === 'visible') {
      timeout = setTimeout(() => {
        useHarkState.getState().sawSeam({ all: null });
      }, 3000);
    } else {
      clearTimeout(timeout);
    }
  }

  useEffect(() => {
    retrieve();
  }, [retrieve]);

  useEffect(() => {
    visibilitychange();
    document.addEventListener('visibilitychange', visibilitychange);

    return () => {
      document.removeEventListener('visibilitychange', visibilitychange);
      clearTimeout(timeout);
    };
  }, []);

  const markAllRead = useCallback(() => {
    useHarkState.getState().sawSeam({ all: null });
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorAlert}
      onReset={() => history.push('/leap/notifications')}
    >
      <div className="grid h-full grid-rows-[1fr,auto] overflow-y-auto p-4 sm:grid-rows-[auto,1fr] md:p-9">
        <div className="flex w-full items-center justify-between">
          <h2 className="mb-4 text-xl font-semibold">All Notifications</h2>
          {count > 0 && (
            <button
              className="button bg-blue-900 text-white"
              onClick={markAllRead}
            >
              Mark All as Read
            </button>
          )}
        </div>
        <section className="w-full rounded-xl bg-gray-50 p-4">
          {notifications.map((grouping) => (
            <div key={grouping.date}>
              <h2 className="mb-4 text-lg font-bold text-gray-400">
                {grouping.date}
              </h2>
              <ul className="space-y-2">
                {grouping.bins.map((b) => (
                  <li key={b.time}>
                    <Notification bin={b} groups={groups} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </ErrorBoundary>
  );
};
