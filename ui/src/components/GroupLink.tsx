import React from 'react';
import cn from 'classnames';
import { Button } from './Button';

interface GroupLinkProps {
  title: string;
  description?: string;
  icon: string;
  color: string;
  link: string;
}

export const GroupLink = ({
  title,
  description,
  icon,
  color,
  link,
}: GroupLinkProps) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center space-x-2">
      {icon === '' ? (
        <div className={cn('h-8 w-8 rounded', color)} />
      ) : (
        <img className="h-8 w-8 rounded" src={icon} alt={`${title} icon`} />
      )}
      <div className="flex flex-col">
        <span className="font-semibold">{title}</span>
        {description && (
          <span className="text-sm font-semibold text-gray-400">
            {description}
          </span>
        )}
      </div>
    </div>
    <Button variant="alt-primary" as="a" href={link} target="_blank">
      Open in Groups
    </Button>
  </div>
);
