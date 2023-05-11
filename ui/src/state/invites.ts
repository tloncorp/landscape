import api from '../api';
import { useState, useEffect } from 'react';

export default function useInviteState() {
  const [baitURL, setBaitURL] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .scry<{ url: string }>({
        app: 'reel',
        path: '/bait',
      })
      .then(({ url }) => {
        setBaitURL(url);
        setLoaded(true);
      });
  }, []);

  return {
    baitURL: baitURL,
    setBaitURL: setBaitURL,
    loaded: loaded,
    save: async (data: { url: string }) => {
      const fixedUrl = data.url.substr(-1) === '/' ? data.url : data.url + '/';

      await api.poke({
        app: 'reel',
        mark: 'reel-command',
        json: {
          url: fixedUrl,
        },
      });
    },
  };
}
