import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { useDrag } from 'react-dnd';
import * as Tooltip from '@radix-ui/react-tooltip';
import { TileMenu } from './TileMenu';
import { getAppHref } from '@/logic/utils';
import { useRecentsStore } from '../nav/search/Home';
import { ChargeWithDesk } from '../state/docket';
import { useTileColor } from './useTileColor';
import { usePike } from '../state/kiln';
import { Bullet } from '../components/icons/Bullet';
import { dragTypes } from './TileGrid';
import { useHasInviteToGroup } from '@/state/hark';
import { useGroups } from '@/nav/notifications/groups';
import { TileStatusIndicator, getTileStatus } from './TileStatusIndicator';

type TileProps = {
  charge: ChargeWithDesk;
  desk: string;
  disabled?: boolean;
};

export const Tile: FunctionComponent<TileProps> = ({
  charge,
  desk,
  disabled = false,
}) => {
  const groups = useGroups(desk === 'groups');
  const hasGroups = groups && Object.entries(groups).length > 0;
  const invite = useHasInviteToGroup();
  const inviteGroupName =
    invite &&
    typeof invite.top.con[2] === 'object' &&
    'emph' in invite.top.con[2]
      ? invite.top.con[2].emph
      : 'a group';
  const addRecentApp = useRecentsStore((state) => state.addRecentApp);
  const { title, image, color, chad, href } = charge;
  const pike = usePike(desk);
  const { lightText, tileColor, menuColor, suspendColor, suspendMenuColor } =
    useTileColor(color);
  if (desk === 'canvas') {
    debugger;
  }
  const status = getTileStatus(chad, pike, disabled);
  const suspended = status === 'inactive';
  const active = status === 'active';
  const link = getAppHref(href);
  const backgroundColor = suspended
    ? suspendColor
    : active
    ? tileColor || 'purple'
    : suspendColor;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: dragTypes.TILE,
    item: { desk },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <a
      ref={drag}
      href={active ? link : undefined}
      target="_blank"
      rel="noreferrer"
      className={classNames(
        'default-ring group absolute h-full w-full overflow-hidden rounded-3xl font-semibold focus-visible:ring-4',
        suspended && 'opacity-50 grayscale',
        isDragging && 'opacity-0',
        lightText && active ? 'text-gray-200' : 'text-gray-800',
        !active && 'cursor-default'
      )}
      style={{ backgroundColor }}
      onClick={() => addRecentApp(desk)}
      onAuxClick={() => addRecentApp(desk)}
    >
      <div>
        {desk === 'groups' && !hasGroups && (
          <Tooltip.Root>
            <Tooltip.Trigger className="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
              <div className="absolute h-[42px] w-[42px] animate-pulse rounded-full bg-indigo opacity-10 sm:top-0 sm:right-0" />
              <Bullet className="h-[42px] w-[42px] text-indigo" />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="right"
                sideOffset={16}
                className="z-40 w-[216px] rounded-lg bg-indigo p-4"
              >
                <p className="text-white">
                  {invite ? (
                    <>You have an invitation to join {inviteGroupName}.</>
                  ) : (
                    <>
                      Open Groups to create, join, and accept invitations to
                      communities.
                    </>
                  )}
                </p>
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        )}
        <TileStatusIndicator
          status={status}
          devShip={pike?.sync?.ship}
          className="absolute top-4 left-4 z-10 sm:top-6 sm:left-6"
        />
        {desk === 'groups' && !hasGroups ? null : (
          <TileMenu
            desk={desk}
            chad={chad}
            menuColor={active ? menuColor : suspendMenuColor}
            lightText={lightText}
            className="absolute top-3 right-3 z-10 opacity-0 focus:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100 hover-none:opacity-100 sm:top-5 sm:right-5"
          />
        )}
        {title && (
          <div
            className="h4 absolute bottom-[8%] left-[5%] z-10 rounded-lg py-1 px-3 sm:bottom-7 sm:left-5"
            style={{ backgroundColor }}
          >
            <h3 className="mix-blend-hard-light">{title}</h3>
          </div>
        )}
        {image && status !== 'installing' && (
          <img
            className="absolute top-0 left-0 h-full w-full object-cover"
            src={image}
            alt=""
          />
        )}
      </div>
    </a>
  );
};
