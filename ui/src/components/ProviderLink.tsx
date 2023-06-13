import classNames from 'classnames';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Provider } from '@/gear';
import { ShipName } from './ShipName';
import { Avatar, AvatarSizes } from './Avatar';
import { Contact } from '@/gear';

export type ProviderLinkProps = Omit<LinkProps, 'to'> & {
  provider: { shipName: string } & Contact;
  size?: AvatarSizes;
  selected?: boolean;
  to?: (p: Provider) => LinkProps['to'];
  adjustBG?: boolean;
};

export const ProviderLink = ({
  provider,
  to,
  selected = false,
  size = 'default',
  className,
  adjustBG,
  ...props
}: ProviderLinkProps) => {
  const small = size === 'small' || size === 'xs';
  return (
    <Link
      to={(to && to(provider)) || `/leap/search/${provider.shipName}/apps`}
      className={classNames(
        'default-ring flex items-center space-x-3 rounded-lg p-2',
        !small && 'ring-offset-2',
        selected && 'bg-blue-200',
        className
      )}
      {...props}
    >
      <Avatar size={size} shipName={provider.shipName} adjustBG={adjustBG} />
      <div className="flex-1 text-black">
        <div className="flex space-x-4 font-mono">
          <ShipName name={provider.shipName} />
          <span className="text-gray-500">{provider.nickname}</span>
        </div>
        {provider.status && size === 'default' && (
          <p className="font-normal">{provider.status}</p>
        )}
      </div>
    </Link>
  );
};
