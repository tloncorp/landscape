import React, { ReactComponentElement, useCallback } from 'react';
import cn from 'classnames';
import { format } from 'date-fns';
import _ from 'lodash';
import { pluralize, getAppName } from '@/logic/utils';
import { isYarnShip, Rope, Skein, YarnContent } from '@/types/hark';
import { useCharge } from '../../state/docket';
import { Groups } from './groups';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { ShipName } from '../../components/ShipName';
import { DeskLink } from '../../components/DeskLink';
import { DocketImage } from '../../components/DocketImage';
import GroupAvatar from '../../components/GroupAvatar';
import { Charge } from '@urbit/api';
import { useSawRopeMutation } from '@/state/hark';

interface NotificationProps {
  bin: Skein;
  groups?: Groups;
}

type NotificationType = 'group-meta' | 'channel' | 'group' | 'desk';

interface NotificationContent {
  type: NotificationType;
  content: YarnContent[];
}

interface NotificationContext {
  type: NotificationType;
  groups: Groups | null;
  rope: Record<string | number | symbol, any>;
  charge: Charge;
  app: string;
}

interface NotificationTrigger {
  type: NotificationType;
  groups: Groups | undefined;
  rope: Record<string | number | symbol, any>;
  ship: string | undefined;
}

function makePrettyTime(date: Date) {
  return format(date, 'HH:mm');
}

function getNotificationType(rope: Rope): NotificationType {
  if (
    ['/channel/edit', '/channel/add', '/channel/del', '/joins', '/leaves'].some(
      (thread) => rope.thread.endsWith(thread)
    )
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

const NotificationTrigger: React.FC<NotificationTrigger> = ({
  type,
  groups,
  rope,
  ship,
}) => {
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
      return ship ? <Avatar shipName={ship} size="default" /> : <></>;
    default:
      return <></>;
  }
};

const NotificationContext: React.FC<NotificationContext> = ({
  type,
  groups,
  rope,
  charge,
  app,
}) => {
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
            {app}
            {groups?.[rope.group]?.meta?.title &&
              `: ${groups?.[rope.group]?.meta?.title}`}
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
};

const NotificationContent: React.FC<NotificationContent> = ({
  type,
  content,
}) => {
  const con = content;
  const mentionRe = new RegExp('mentioned');
  const replyRe = new RegExp('replied');

  const isMention = type === 'channel' && mentionRe.test(content[1].toString());
  const isReply = type === 'channel' && replyRe.test(content[1].toString());

  function renderContent(c: YarnContent) {
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
};

export default function Notification({ bin, groups }: NotificationProps) {
  const moreCount = bin.count;
  const { rope, con, wer, but } = bin.top;
  const charge = useCharge(rope.desk);
  const app = getAppName(charge);
  const type = getNotificationType(rope);
  const ship = con.find(isYarnShip)?.ship;
  const { mutate: sawRope } = useSawRopeMutation();

  const onClick = useCallback(() => {
    console.log('clearing notification', rope);
    sawRope({ rope });
  }, [rope]);

  return (
    <div
      className={cn(
        'flex space-x-3 rounded-xl p-3 text-gray-600 transition-colors duration-1000',
        bin.unread
          ? 'bg-blue-50 mix-blend-multiply dark:mix-blend-screen'
          : 'bg-white'
      )}
    >
      <DeskLink
        onClick={onClick}
        to={`?grid-note=${encodeURIComponent(wer || '')}`}
        desk={rope.desk || ''}
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
            groups={groups ? groups : null}
            type={type}
            rope={rope}
            charge={charge}
            app={app}
          />
          <div className="">
            <NotificationContent type={type} content={con} />
          </div>
          {moreCount > 1 ? (
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Latest of {moreCount} new {pluralize('message', moreCount)}
              </p>
            </div>
          ) : null}
          {but?.title && <Button variant="secondary">{but.title}</Button>}
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
