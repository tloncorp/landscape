import React, { useCallback } from 'react';
import cn from 'classnames';
import { format } from 'date-fns';
import _ from 'lodash';
import useHarkState from '../../state/hark';
import { pluralize, getAppName } from '../../state/util';
import { isYarnShip, Rope, YarnContent } from '../../state/hark-types';
import { useCharge } from '../../state/docket';
import { Groups } from './groups';
import { Bin } from './useNotifications';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { ShipName } from '../../components/ShipName';
import { DeskLink } from '../../components/DeskLink';
import { DocketImage } from '../../components/DocketImage';
import GroupAvatar from '../../components/GroupAvatar';

interface NotificationProps {
  bin: Bin;
  groups?: Groups;
}

type NotificationType = 'group-meta' | 'channel' | 'group' | 'desk';

function makePrettyTime(date: Date) {
  return format(date, 'HH:mm');
}

function getNotificationType(rope: Rope): NotificationType {
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

function NotificationContent({ type, content }: any) {
  const mentionRe = new RegExp('mentioned');
  const replyRe = new RegExp('replied');

  const isMention = type === 'channel' && mentionRe.test(content[1]);
  const isReply = type === 'channel' && replyRe.test(content[1]);

  function renderContent(c: any) {
    if (typeof c === 'string') {
      return <span key={c}>{c}</span>;
    }

    if ('ship' in c) {
      return (
        <ShipName
          key={c.ship}
          name={c.ship}
          className="font-semibold text-gray-800"
          showAlias={true}
        />
      );
    }

    return <span key={c.emph}>&ldquo;{c.emph}&rdquo;</span>;
  }

  if (isMention) {
    return (
      <>
        <p className="mb-2 leading-5 text-gray-400 line-clamp-2">
          {_.map(_.slice(content, 0, 2), (c: YarnContent) => renderContent(c))}
        </p>
        <p className="leading-5 text-gray-800 line-clamp-2">
          {_.map(_.slice(content, 2), (c: YarnContent) => renderContent(c))}
        </p>
      </>
    );
  }

  if (isReply) {
    return (
      <>
        <p className="mb-2 leading-5 text-gray-400 line-clamp-2">
          {_.map(_.slice(content, 0, 4), (c: YarnContent) => renderContent(c))}
        </p>
        <p className="leading-5 text-gray-800 line-clamp-2">
          {_.map(_.slice(content, 6), (c: YarnContent) => renderContent(c))}
        </p>
      </>
    );
  }

  return (
    <p className="leading-5 text-gray-800 line-clamp-2">
      {_.map(content, (c: YarnContent) => renderContent(c))}
    </p>
  );
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
            <NotificationContent type={type} content={bin.topYarn?.con} />
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
