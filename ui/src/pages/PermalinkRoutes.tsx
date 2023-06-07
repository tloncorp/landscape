import { Pikes } from '@urbit/api';
import React, { useEffect } from 'react';
import { Route, Navigate, Routes, useParams } from 'react-router-dom';
import { Spinner } from '../components/Spinner';
import { useQuery } from '../logic/useQuery';
import { useCharge } from '../state/docket';
import { useKilnLoaded, usePikes } from '../state/kiln';
import { getAppHref } from '@/logic/utils';

function getDeskByForeignRef(
  pikes: Pikes,
  ship: string,
  desk: string
): string | undefined {
  const found = Object.entries(pikes).find(
    ([, pike]) => pike.sync?.ship === ship && pike.sync?.desk === desk
  );
  return found ? found[0] : undefined;
}

function AppLink() {
  const {
    ship = '',
    desk = '',
    link = '',
  } = useParams<{ ship: string; desk: string; link: string }>();
  const pikes = usePikes();
  const ourDesk = getDeskByForeignRef(pikes, ship, desk);

  if (ourDesk) {
    return <AppLinkNavigate desk={ourDesk} link={link} />;
  }
  return <AppLinkNotFound />;
}

function AppLinkNotFound() {
  const { ship, desk } = useParams<{ ship: string; desk: string }>();
  return <Navigate to={`/leap/search/direct/apps/${ship}/${desk}`} />;
}

function AppLinkInvalid() {
  return (
    <div>
      <h4>Link was malformed</h4>
      <p>The link you tried to follow was invalid</p>
    </div>
  );
}
function AppLinkNavigate({ desk, link }: { desk: string; link: string }) {
  const charge = useCharge(desk);

  useEffect(() => {
    if (!charge) {
      return;
    }

    const query = new URLSearchParams({
      'grid-link': encodeURIComponent(`/${link}`),
    });

    const url = `${getAppHref(charge.href)}?${query.toString()}`;
    window.open(url, desk);
  }, [charge]);

  return <Navigate to="/" />;
}

const LANDSCAPE_DESK = 'landscape';
const LANDSCAPE_HOST = '~lander-dister-dozzod-dozzod';

function LandscapeLink() {
  const { link } = useParams<{ link: string }>();

  return (
    <Navigate to={`/perma/${LANDSCAPE_HOST}/${LANDSCAPE_DESK}/group/${link}`} />
  );
}

export function PermalinkRoutes() {
  const loaded = useKilnLoaded();

  const { query } = useQuery();

  if (query.has('ext')) {
    const ext = query.get('ext')!;
    const url = `/perma${ext.slice(16)}`;
    return <Navigate to={url} />;
  }

  if (!loaded) {
    return <Spinner />;
  }

  return (
    <Routes>
      <Route path="perma/group/:link+" element={<LandscapeLink />} />
      <Route path="perma/:ship/:desk/:link*" element={<AppLink />} />
      <Route index element={<AppLinkInvalid />} />
    </Routes>
  );
}
