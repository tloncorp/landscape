import api from '../state/api';
import { useState, useEffect } from 'react';

export default function useInviteState() {
  const [baitURL, setBaitURL] = useState('');
  const [baitShip, setBaitShip] = useState('');
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.scry<{url: string, ship: string}>({
      app: 'reel',
      path: '/bait'
    }).then(({url, ship}) => {
      setBaitURL(url);
      setBaitShip(ship);
      setLoaded(true);
    });
  }, []);

  return {
    baitURL: baitURL,
    setBaitURL: setBaitURL,
    baitShip: baitShip,
    setBaitShip: setBaitShip,
    loaded: loaded,
    save: async (data: {url: string, ship: string}) => {
      await api.poke({
        app: 'reel',
        mark: 'reel-command',
        json: {
          url: data.url,
          ship: data.ship
        }
      })
    }
  }
}
