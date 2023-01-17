import classNames from 'classnames';
import React, { useMemo } from 'react';
import { sigil, reactRenderer } from '@tlon/sigil-js';
import { deSig, Contact } from '@urbit/api';
import { darken, lighten, parseToHsla } from 'color2k';
import { useCurrentTheme } from '../state/local';
import { normalizeUrbitColor } from '../state/util';
import { useContact } from '../state/contact';

export type AvatarSizes = 'xs' | 'small' | 'nav' | 'default';

interface AvatarProps {
  shipName: string;
  size: AvatarSizes;
  className?: string;
  adjustBG?: boolean;
}

interface AvatarMeta {
  classes: string;
  size: number;
}

const sizeMap: Record<AvatarSizes, AvatarMeta> = {
  xs: { classes: 'w-6 h-6 rounded', size: 12 },
  small: { classes: 'w-8 h-8 rounded-lg', size: 16 },
  nav: { classes: 'w-9 h-9 rounded-lg', size: 18 },
  default: { classes: 'w-12 h-12 rounded-lg', size: 24 },
};

export const foregroundFromBackground = (
  background: string
): 'black' | 'white' => {
  const rgb = {
    r: parseInt(background.slice(1, 3), 16),
    g: parseInt(background.slice(3, 5), 16),
    b: parseInt(background.slice(5, 7), 16),
  };
  const brightness = (299 * rgb.r + 587 * rgb.g + 114 * rgb.b) / 1000;
  const whiteBrightness = 255;

  return whiteBrightness - brightness < 50 ? 'black' : 'white';
};

const emptyContact: Contact = {
  nickname: '',
  bio: '',
  status: '',
  color: '#000000',
  avatar: null,
  cover: null,
  groups: [],
  'last-updated': 0,
};

function themeAdjustColor(color: string, theme: 'light' | 'dark'): string {
  const hsla = parseToHsla(color);
  const lightness = hsla[2];

  if (lightness <= 0.1 && theme === 'dark') {
    return lighten(color, 0.1 - lightness);
  }

  if (lightness >= 0.9 && theme === 'light') {
    return darken(color, lightness - 0.9);
  }

  return color;
}

export const Avatar = ({
  shipName,
  size,
  className,
  adjustBG = true,
}: AvatarProps) => {
  const currentTheme = useCurrentTheme();
  const contact = useContact(shipName);
  const { color, avatar } = { ...emptyContact, ...contact };
  const { classes, size: sigilSize } = sizeMap[size];
  const adjustedColor = adjustBG
    ? themeAdjustColor(normalizeUrbitColor(color), currentTheme)
    : color;
  const foregroundColor = foregroundFromBackground(adjustedColor);
  const sigilElement = useMemo(() => {
    if (shipName.match(/[_^]/) || shipName.length > 14) {
      return null;
    }

    return sigil({
      patp: deSig(shipName) || 'zod',
      renderer: reactRenderer,
      size: sigilSize,
      icon: true,
      colors: [adjustedColor, foregroundColor],
    });
  }, [shipName, adjustedColor, foregroundColor]);

  if (avatar) {
    return (
      <img
        className={classNames('object-cover', classes)}
        src={avatar}
        alt=""
      />
    );
  }

  return (
    <div
      className={classNames(
        'relative flex-none rounded-lg bg-black',
        classes,
        size === 'xs' && 'p-1.5',
        size === 'small' && 'p-2',
        size === 'nav' && 'p-[9px]',
        size === 'default' && 'p-3',
        className
      )}
      style={{ backgroundColor: adjustedColor }}
    >
      {sigilElement}
    </div>
  );
};
