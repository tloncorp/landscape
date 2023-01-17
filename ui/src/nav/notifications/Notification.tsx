import cn from 'classnames';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import Bullet16Icon from '../../components/icons/Bullet16Icon';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { ShipName } from '../../components/ShipName';
import { DeskLink } from '../../components/DeskLink';
import { Bin } from './useNotifications';
import useHarkState from '../../state/hark';
import { pluralize, getAppName } from '../../state/util';
import { isYarnShip, Rope, YarnContent } from '../../state/hark-types';
import { DocketImage } from '../../components/DocketImage';
import { useCharge } from '../../state/docket';
import { Groups } from './groups';
import GroupAvatar from '../../components/GroupAvatar';
import _ from 'lodash';
import ColorBoxIcon from '../../components/icons/ColorBoxIcon';

interface NotificationProps {
  bin: Bin;
  groups?: Groups;
}

function getContent(content: YarnContent) {
  if (typeof content === 'string') {
    return (
      <span className="text-gray-800" key={content}>
        {content}
      </span>
    );
  }

  if ('ship' in content) {
    return (
      <ShipName
        key={content.ship}
        name={content.ship}
        className="font-semibold text-gray-800"
      />
    );
  }

  return (
    <span key={content.emph} className="text-gray-800">
      &ldquo;{content.emph}&rdquo;
    </span>
  );
}

function NotificationContent(content: Array<YarnContent>) {
  return <p className="leading-5">{_.map(content, (c) => getContent(c))}</p>;
}

function makePrettyTime(date: Date) {
  return format(date, 'HH:mm');
}

function getNotificationType(rope: Rope) {
  if (
    rope.thread.endsWith('/channel/edit') ||
    rope.thread.endsWith('/channel/add') ||
    rope.thread.endsWith('/channel/del') ||
    rope.thread.endsWith('/joins') ||
    rope.thread.endsWith('/leaves')
  ) {
    return 'group-meta';
  }

  if (rope.channel) {
    return 'channel';
  }

  if (rope.group) {
    return 'group';
  }

  return 'desk';
}

function NotificationTrigger({ type, groups, rope, ship }: any) {
  switch (type) {
    case 'group-meta':
      return (
        <GroupAvatar
          image={groups?.[rope.group]?.meta?.image}
          size="default w-12 h-12"
        />
      );
    case 'desk':
    case 'group':
    case 'channel':
      return <Avatar shipName={ship} size="default" />;
    default:
      return null;
  }
}

function NotificationContext({ type, groups, rope, charge, app }: any) {
  switch (type) {
    case 'channel':
      return (
        <div className="flex items-center space-x-2 text-gray-400">
          <GroupAvatar image={groups?.[rope.group]?.meta?.image} />
          <span className="font-bold text-gray-400">
            {app} • {groups?.[rope.group]?.meta?.title}:{' '}
            {groups?.[rope.group]?.channels?.[rope.channel]?.meta?.title}
          </span>
        </div>
      );
    case 'group':
      return (
        <div className="flex items-center space-x-2 text-gray-400">
          <GroupAvatar image={groups?.[rope.group]?.meta?.image} />
          <span className="font-bold text-gray-400">
            {app} • {groups?.[rope.group]?.meta?.title}
          </span>
        </div>
      );
    case 'group-meta':
      return (
        <div className="flex items-center text-gray-400">
          <DocketImage {...charge} size="xs" />
          <span className="font-bold text-gray-400">
            {app}: {groups?.[rope.group]?.meta?.title}
          </span>
        </div>
      );
    case 'desk':
    default:
      return (
        <div className="flex items-center text-gray-400">
          <DocketImage {...charge} size="xs" />
          <span className="font-bold text-gray-400">{app}</span>
        </div>
      );
  }
}

export default function Notification({ bin, groups }: NotificationProps) {
  const moreCount = bin.count;
  const rope = bin.topYarn?.rope;
  const charge = useCharge(rope?.desk);
  const app = getAppName(charge);
  const type = getNotificationType(rope);
  const ship = bin.topYarn?.con.find(isYarnShip)?.ship;

  const onClick = useCallback(() => {
    console.log('clearing notification', rope);
    useHarkState.getState().sawRope(rope);
  }, [rope]);

  return (
    <div
      className={cn(
        'flex space-x-3 rounded-xl p-3 text-gray-600 transition-colors duration-1000',
        bin.unread ? 'bg-blue-50 mix-blend-multiply' : 'bg-white'
      )}
    >
      <DeskLink
        onClick={onClick}
        to={`?grid-note=${encodeURIComponent(bin.topYarn?.wer || '')}`}
        desk={bin.topYarn?.rope.desk || ''}
        className="flex flex-1 space-x-3"
      >
        <div className="relative flex-none self-start">
          <NotificationTrigger
            type={type}
            groups={groups}
            rope={rope}
            ship={ship}
          />
        </div>
        <div className="w-full flex-col space-y-2">
          <NotificationContext
            groups={groups}
            type={type}
            rope={rope}
            charge={charge}
            app={app}
          />
          <div className="">
            <NotificationContent {...bin.topYarn?.con} />
          </div>
          {moreCount > 1 ? (
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Latest of {moreCount} new {pluralize('message', moreCount)}
              </p>
            </div>
          ) : null}
          {bin.topYarn.but?.title && (
            <Button variant="secondary">{bin.topYarn.but.title}</Button>
          )}
        </div>
      </DeskLink>
      <div className="flex-none">
        <div className="flex items-center">
          <span className="font-semibold text-gray-400">
            {makePrettyTime(new Date(bin.time))}
          </span>
        </div>
      </div>
    </div>
  );
}
