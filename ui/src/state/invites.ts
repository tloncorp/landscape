import api from '../state/api';
import { useState, useEffect } from 'react';

export function useReelInstalled() {
  const [reelInstalled, setReelInstalled] = useState(false);

  useEffect(() => {
    api.scry<{url: string}>({
      app: 'reel',
      path: '/bait'
    }).then(({url}) => {
      setReelInstalled(true);
    });
  }, []);

  return reelInstalled
}

export default function useInviteState() {
  const [baitURL, setBaitURL] = useState('');
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.scry<{url: string}>({
      app: 'reel',
      path: '/bait'
    }).then(({url}) => {
      setBaitURL(url);
      setLoaded(true);
    });
  }, []);

  return {
    baitURL: baitURL,
    setBaitURL: setBaitURL,
    loaded: loaded,
    save: async (data: {url: string}) => {
      const fixedUrl = data.url.substr(-1) === '/' ? data.url : data.url + '/';

      await api.poke({
        app: 'reel',
        mark: 'reel-command',
        json: {
          url: fixedUrl,
        }
      })
    }
  }
}
