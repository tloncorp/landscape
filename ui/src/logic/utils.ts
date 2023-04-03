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
  const content = isYarnEmph(bin.topYarn?.con[2])
    ? ''
    : bin.topYarn.con[2] || '';

  try {
    new Notification(`Landscape: ${app}`, {
      body: `${ship ? ship : emph}${bin.topYarn.con[1]}${emphLast} ${content}`,
    });
  } catch (error) {
    console.error(error);
  }
};

export function isNewNotificationSupported() {
  if (!window.Notification || !Notification.requestPermission) return false;
  return true;
}
