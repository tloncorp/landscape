import React, { useCallback, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import fuzzy from 'fuzzy';
import { Treaty } from '@/gear';
import { ShipName } from '../../components/ShipName';
import { useAllyTreaties } from '../../state/docket';
import { useAppSearchStore } from '../Nav';
import { AppList } from '../../components/AppList';
import { addRecentDev } from './Home';
import { Spinner } from '../../components/Spinner';
import { ShipConnection } from '@/components/ShipConnection';
import { pluralize } from '@/logic/utils';

type AppsProps = RouteComponentProps<{ ship: string }>;

export const Apps = ({ match }: AppsProps) => {
  const { searchInput, selectedMatch, select } = useAppSearchStore((state) => ({
    searchInput: state.searchInput,
    select: state.select,
    selectedMatch: state.selectedMatch,
  }));
  const provider = match?.params.ship;
  const { treaties, status, connection, awaiting } = useAllyTreaties(provider);
  console.log(status);
  const [showConnection, setShowConnection] = React.useState(false);

  useEffect(() => {
    if (provider) {
      addRecentDev(provider);
    }
  }, [provider]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowConnection(true);
    }, 700);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const results = useMemo(() => {
    if (!treaties) {
      return undefined;
    }
    const values = Object.values(treaties);
    return fuzzy
      .filter(
        searchInput,
        values.map((v) => v.title)
      )
      .sort((a, b) => {
        const left = a.string.startsWith(searchInput) ? a.score + 1 : a.score;
        const right = b.string.startsWith(searchInput) ? b.score + 1 : b.score;

        return right - left;
      })
      .map((result) => values[result.index]);
  }, [treaties, searchInput]);
  const count = results?.length;

  const getAppPath = useCallback(
    (app: Treaty) =>
      `${match?.path.replace(':ship', provider)}/${app.ship}/${app.desk}`,
    [match]
  );

  useEffect(() => {
    select(
      <>
        Apps by <ShipName name={provider} className="font-mono" />
      </>
    );
  }, [provider]);

  useEffect(() => {
    if (results) {
      useAppSearchStore.setState({
        matches: results.map((r) => ({
          url: getAppPath(r),
          openInNewTab: false,
          value: r.desk,
          display: r.title,
        })),
      });
    }
  }, [results]);

  const showLoader =
    status === 'loading' || status === 'initial' || status === 'awaiting';

  return (
    <div className="dialog-inner-container h4 text-gray-400 md:px-6 md:py-8">
      {showLoader && (
        <div className="mb-3 flex items-start">
          <Spinner className="mr-3 h-7 w-7 flex-none" />
          <div className="flex flex-1 flex-col">
            <span>
              {status === 'awaiting'
                ? `${awaiting} ${pluralize(
                    'app',
                    awaiting
                  )} found, waiting for entries...`
                : 'Finding software...'}
            </span>
            {showConnection && (
              <ShipConnection ship={provider} status={connection?.status} />
            )}
          </div>
        </div>
      )}
      {(status === 'partial' || status === 'finished') &&
        results &&
        (results.length > 0 ? (
          <>
            <div id="developed-by">
              <h2 className="mb-3">
                Software developed by{' '}
                <ShipName name={provider} className="font-mono" />
              </h2>
              <p>
                {count} result{count === 1 ? '' : 's'}
              </p>
            </div>
            <AppList
              apps={results}
              labelledBy="developed-by"
              matchAgainst={selectedMatch}
              to={getAppPath}
            />
            {status === 'finished' ? (
              <p>That&apos;s it!</p>
            ) : (
              <p>Awaiting {awaiting} more</p>
            )}
          </>
        ) : (
          <div id="developed-by">
            <h2 className="mb-3">
              Software developed by{' '}
              <ShipName name={provider} className="font-mono" />
            </h2>
            <p>No apps found</p>
          </div>
        ))}
      {status === 'error' && (
        <h2>
          Unable to connect to{' '}
          <ShipName name={provider} className="font-mono" />
        </h2>
      )}
    </div>
  );
};
