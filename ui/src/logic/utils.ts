import { isYarnEmph, isYarnShip } from '../state/hark-types';
import { findLast } from 'lodash';
import { Bin } from '../nav/notifications/useNotifications';

export const makeBrowserNotification = (bin: Bin) => {
  const rope = bin.topYarn?.rope;
  // need to capitalize desk name
  const app = rope?.desk.slice(0, 1).toUpperCase() + rope?.desk.slice(1);
  const ship = bin.topYarn?.con.find(isYarnShip)?.ship || '';
  const emph = bin.topYarn?.con.find(isYarnEmph)?.emph || '';
  const emphLast = findLast(bin.topYarn?.con, isYarnEmph)?.emph || '';

  new Notification(`Landscape: ${app}`, {
    body: `${ship}${emph}${bin.topYarn.con[1]}${emphLast}`,
  });
};
