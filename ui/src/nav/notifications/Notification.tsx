import cn from 'classnames';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import Bullet16Icon from '../../components/icons/Bullet16Icon';
import { ShipName } from '../../components/ShipName';
import { DeskLink } from '../../components/DeskLink';
import { Bin } from './useNotifications';
import useHarkState from '../../state/hark';
import { pluralize } from '../../state/util';
import { isYarnShip, Rope, YarnContent } from '../../state/hark-types';
import { DocketImage } from '../../components/DocketImage';
import { useCharge } from '../../state/docket';
import { Groups } from './groups';

interface NotificationProps {
  bin: Bin;
  groups?: Groups;
}

function getContent(content: YarnContent) {
  if (typeof content === 'string') {
    return <span>{content}</span>;
  }

  if ('ship' in content) {
    return <ShipName name={content.ship} className="font-semibold text-gray-800" />;
  }

  return <strong className="text-gray-800">{content.emph}</strong>;
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
  const moreCount = bin.count - 1;
  const rope = bin.topYarn?.rope;
  const charge = useCharge(rope?.desk);
  const type = getNotificationType(rope);
  const ship = bin.topYarn?.con.find(isYarnShip)?.ship;
  const invite = type === 'group' && bin.topYarn.wer === '/groups/find';

  const onClick = useCallback(() => {
    console.log('clearing notification', rope);
    useHarkState.getState().sawRope(rope);
  }, [rope]);

  return (
    <div
      className={cn(
        'flex space-x-3 rounded-xl p-3 text-gray-600 transition-colors duration-1000',
        bin.unread ? 'bg-blue-50' : 'bg-gray-50'
      )}
    >
      {invite ? (
        <a
          onClick={onClick}
          className="flex flex-1 space-x-3"
          href={`/apps/${rope.desk}${bin.topYarn?.wer}`}
          target="_blank"
          rel="noreferrer"
        >
          <div className="relative flex-none self-start">
            <DocketImage {...charge} size="default" />
          </div>
          <div className="space-y-2 p-1">
            <p>{bin.topYarn && bin.topYarn.con.map(getContent)}</p>
            {moreCount > 0 ? (
              <p className="text-sm font-semibold">
                {moreCount} more {pluralize('message', moreCount)} from{' '}
                {bin.shipCount > 1 ? `${bin.shipCount} people` : '1 person'}
              </p>
            ) : (
              <p className="text-sm">&nbsp;</p>
            )}
          </div>
        </a>
      ) : (
        <DeskLink
          onClick={onClick}
          to={invite ? bin.topYarn.wer : `?grid-note=${encodeURIComponent(bin.topYarn?.wer || '')}`}
          desk={bin.topYarn?.rope.desk || ''}
          className="flex flex-1 space-x-3"
        >
          <div className="relative flex-none self-start">
            <DocketImage {...charge} size="default" />
          </div>
          <div className="space-y-2 p-1">
            {(type === 'channel' || type === 'group') && rope.group && (
              <>
                <strong>{groups?.[rope.group]?.meta?.title}</strong>
              </>
            )}
            {type === 'desk' &&
              (ship ? (
                <ShipName name={ship} className="font-semibold" />
              ) : (
                <strong>{charge?.title || ''}</strong>
              ))}
            <p>{bin.topYarn && bin.topYarn.con.map(getContent)}</p>
            {moreCount > 0 ? (
              <p className="text-sm font-semibold">
                {moreCount} more {pluralize('message', moreCount)} from{' '}
                {bin.shipCount > 1 ? `${bin.shipCount} people` : '1 person'}
              </p>
            ) : (
              <p className="text-sm">&nbsp;</p>
            )}
          </div>
        </DeskLink>
      )}
      <div className="flex-none p-1">
        <div className="flex items-center">
          {bin.unread ? <Bullet16Icon className="h-4 w-4 text-blue-500" /> : null}
          <span className="font-semibold">{makePrettyTime(new Date(bin.time))}</span>
        </div>
      </div>
    </div>
  );
}
