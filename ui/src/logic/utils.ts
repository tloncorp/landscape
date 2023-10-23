import {
  Yarn,
  isYarnEmph,
  isYarnShip,
  Docket,
  DocketHref,
  Treaty,
} from '@/gear';
import { findLast } from 'lodash';
import { hsla, parseToHsla, parseToRgba } from 'color2k';
import _ from 'lodash';
import { differenceInDays, endOfToday, format } from 'date-fns';
import { useCopyToClipboard } from 'usehooks-ts';
import { useCallback, useState } from 'react';

export const useMockData = import.meta.env.MODE === 'mock';

export const isStagingHosted =
  import.meta.env.DEV ||
  import.meta.env.VITE_SHIP_URL.endsWith('.test.tlon.systems') ||
  window.location.hostname.endsWith('.test.tlon.systems');
export const isHosted =
  isStagingHosted ||
  import.meta.env.VITE_SHIP_URL.endsWith('.tlon.network') ||
  window.location.hostname.endsWith('.tlon.network');

export const hostingUploadURL = isStagingHosted
  ? 'https://memex.test.tlon.systems'
  : isHosted
  ? 'https://memex.tlon.network'
  : '';

export async function fakeRequest<T>(data: T, time = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, time);
  });
}

export function getAppHref(href: DocketHref) {
  return 'site' in href ? href.site : `/apps/${href.glob.base}/`;
}

export function getAppName(
  app: (Docket & { desk: string }) | Treaty | undefined
): string {
  if (!app) {
    return '';
  }

  return app.title || app.desk;
}

export function disableDefault<T extends Event>(e: T): void {
  e.preventDefault();
}

// hack until radix-ui fixes this behavior
export function handleDropdownLink(
  setOpen?: (open: boolean) => void
): (e: Event) => void {
  return (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(() => setOpen?.(false), 15);
  };
}

export function normalizeUrbitColor(color: string): string {
  if (color.startsWith('#')) {
    return color;
  }

  const colorString = color.slice(2).replace('.', '').toUpperCase();
  const lengthAdjustedColor = _.padStart(colorString, 6, '0');
  return `#${lengthAdjustedColor}`;
}

export function getDarkColor(color: string): string {
  const hslaColor = parseToHsla(color);
  return hsla(hslaColor[0], hslaColor[1], 1 - hslaColor[2], 1);
}

export function pluralize(word: string, count: number): string {
  if (count === 1) {
    return word;
  }

  return `${word}s`;
}

export function createStorageKey(name: string): string {
  return `~${window.ship}/${window.desk}/${name}`;
}

// for purging storage with version updates
export function clearStorageMigration<T>() {
  return {} as T;
}

export function isColor(color: string): boolean {
  try {
    parseToRgba(color);
    return true;
  } catch (error) {
    return false;
  }
}

export const makeBrowserNotification = (yarn: Yarn) => {
  const rope = yarn.rope;
  // need to capitalize desk name
  const app = rope
    ? rope?.desk.slice(0, 1).toUpperCase() + rope?.desk.slice(1)
    : '';
  const { con } = yarn;
  const ship = con.find(isYarnShip)?.ship || '';
  const emph = con.find(isYarnEmph)?.emph || '';
  const emphLast = findLast(con, isYarnEmph)?.emph || '';
  const content = isYarnEmph(con[2]) ? '' : con[2] || '';

  try {
    new Notification(`Landscape: ${app}`, {
      body: `${ship ? ship : emph}${con[1]}${emphLast} ${content}`,
    });
  } catch (error) {
    console.error(error);
  }
};

export function isNewNotificationSupported() {
  if (!window.Notification || !Notification.requestPermission) return false;
  return true;
}

export function makePrettyDay(date: Date) {
  const diff = differenceInDays(endOfToday(), date);
  switch (diff) {
    case 0:
      return 'Today';
    case 1:
      return 'Yesterday';
    default:
      return `${format(date, 'LLLL')} ${format(date, 'do')}`;
  }
}

export function randomElement<T>(a: T[]) {
  return a[Math.floor(Math.random() * a.length)];
}

export function randomIntInRange(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export async function asyncWithDefault<T>(
  cb: () => Promise<T>,
  def: T
): Promise<T> {
  try {
    return await cb();
  } catch (error) {
    return def;
  }
}

export function useCopy(copied: string) {
  const [didCopy, setDidCopy] = useState(false);
  const [, copy] = useCopyToClipboard();

  const doCopy = useCallback(async () => {
    let success = false;
    success = await copy(copied);
    setDidCopy(success);

    let timeout: NodeJS.Timeout;
    if (success) {
      timeout = setTimeout(() => {
        setDidCopy(false);
      }, 2000);
    }

    return () => {
      setDidCopy(false);
      clearTimeout(timeout);
    };
  }, [copied, copy]);

  return { doCopy, didCopy };
}
