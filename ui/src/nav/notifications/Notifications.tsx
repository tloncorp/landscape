import React, { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouteComponentProps } from 'react-router-dom';
import { ErrorAlert } from '../../components/ErrorAlert';
import useHarkState from '../../state/hark';
import { groupStore } from './groups';
import Notification from './Notification';
import { useNotifications } from './useNotifications';

export const Notifications = ({ history }: RouteComponentProps) => {
  const { notifications } = useNotifications();
  const { groups, retrieve } = groupStore();

  useEffect(() => {
    retrieve();
  }, [retrieve]);

  useEffect(() => {
    let timeout = 0 as unknown as NodeJS.Timeout;
    function visibilitychange() {
      if (document.visibilityState === 'visible') {
        timeout = setTimeout(() => {
          useHarkState.getState().sawSeam({ all: null });
        }, 5000);
      } else {
        clearTimeout(timeout);
      }
    }
    document.addEventListener('visibilitychange', visibilitychange);

    return () => {
      document.removeEventListener('visibilitychange', visibilitychange);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorAlert}
      onReset={() => history.push('/leap/notifications')}
    >
      <div className="grid grid-rows-[1fr,auto] sm:grid-rows-[auto,1fr] h-full p-4 md:p-9 overflow-y-auto">
        <h2 className="font-semibold text-xl">All Notifications</h2>
        <section className="w-full">
          {notifications.map((grouping) => (
            <div key={grouping.date}>
              <h2 className="mt-8 mb-4 text-lg font-bold text-gray-400">{grouping.date}</h2>
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
