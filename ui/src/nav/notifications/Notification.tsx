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
      {content.emph}
    </span>
  );
}

function NotificationContent(content: Array<YarnContent>) {
  return <p>{_.map(content, (c) => getContent(c))}</p>;
}

function makePrettyTime(date: Date) {
  return format(date, 'HH:mm');
}

function getNotificationType(rope: Rope) {
  if (rope.channel) {
    return 'channel';
  }

  if (rope.group) {
    return 'group';
  }

  return 'desk';
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
          {ship && (
            // && (type === 'group' || type === 'channel')
            <Avatar shipName={ship} size="default" />
          )}
        </div>
        <div className="flex-col space-y-2">
          {(type === 'channel' || type === 'group') && rope.group && (
            <div className="flex items-center">
              {charge && groups?.[rope.group]?.meta?.image ? (
                <GroupAvatar
                  image={groups?.[rope.group]?.meta?.image}
                  className="mr-2"
                />
              ) : (
                <DocketImage {...charge} size="xs" />
              )}
              <span className="font-bold text-gray-400">
                {app} &bull; {groups?.[rope.group]?.meta?.title}
              </span>
            </div>
          )}
          {type === 'desk' &&
            (ship ? (
              <div className="flex items-center text-gray-400">
                {charge && (
                  <>
                    <DocketImage {...charge} size="xs" />
                    <span className="font-bold">{app}</span>
                  </>
                )}
              </div>
            ) : (
              <span className="font-bold text-gray-400">
                {charge?.title || ''}
              </span>
            ))}

          <div className="">
            {bin.topYarn && <NotificationContent {...bin.topYarn.con} />}
          </div>

          {moreCount > 1 ? (
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Latest of {moreCount} new {pluralize('message', moreCount)}
                {bin.shipCount > 1 && ` from ${bin.shipCount} people`}
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
          {bin.unread ? (
            <Bullet16Icon className="h-4 w-4 text-blue-500" />
          ) : null}
          <span className="font-semibold text-gray-400">
            {makePrettyTime(new Date(bin.time))}
          </span>
        </div>
      </div>
    </div>
  );
}
