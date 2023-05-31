import classNames from 'classnames';
import React, { FunctionComponent, useState } from 'react';
import { useDrag } from 'react-dnd';
import * as Popover from '@radix-ui/react-popover';
import { chadIsRunning } from '@urbit/api';
import { TileMenu } from './TileMenu';
import { Spinner } from '../components/Spinner';
import { getAppHref } from '@/logic/utils';
import { useRecentsStore } from '../nav/search/Home';
import { ChargeWithDesk } from '../state/docket';
import { useTileColor } from './useTileColor';
import { usePike } from '../state/kiln';
import { Bullet } from '../components/icons/Bullet';
import { dragTypes } from './TileGrid';
import { useHasInviteToGroup } from '@/state/hark';
import { useGroups } from '@/nav/notifications/groups';

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
  const [showGroupsPopover, setShowGroupsPopover] = useState(false);
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
  const loading = !disabled && 'install' in chad;
  const suspended = disabled || 'suspend' in chad;
  const hung = 'hung' in chad;
  // TODO should held zest be considered inactive? suspended? also, null sync?
  const active = !disabled && chadIsRunning(chad);
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
        lightText && active && !loading ? 'text-gray-200' : 'text-gray-800',
        !active && 'cursor-default'
      )}
      style={{ backgroundColor }}
      onClick={() => addRecentApp(desk)}
      onAuxClick={() => addRecentApp(desk)}
    >
      <div>
        {desk === 'groups' && !hasGroups && (
          <Popover.Root
            open={showGroupsPopover}
            onOpenChange={(o) => setShowGroupsPopover(o)}
          >
            <div
              className="absolute top-4 right-4 z-10 sm:top-6 sm:right-6"
              onMouseOver={() => setShowGroupsPopover(true)}
              onMouseOut={() => setShowGroupsPopover(false)}
            >
              <Popover.Trigger>
                <>
                  <div className="absolute h-[42px] w-[42px] animate-pulse rounded-full bg-indigo opacity-10 sm:top-0 sm:right-0" />
                  <Bullet className="h-[42px] w-[42px] text-indigo" />
                </>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="right"
                  sideOffset={16}
                  className="z-40 w-[216px] rounded-lg bg-indigo p-4"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onCloseAutoFocus={(e) => e.preventDefault()}
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
                </Popover.Content>
              </Popover.Portal>
            </div>
          </Popover.Root>
        )}
        <div className="absolute top-4 left-4 z-10 flex items-center sm:top-6 sm:left-6">
          {pike?.zest === 'held' && !disabled && (
            <Bullet className="h-4 w-4 text-orange-500 dark:text-black" />
          )}
          {!active && (
            <>
              {loading && <Spinner className="mr-2 h-6 w-6" />}
              <span className="text-gray-500">
                {suspended
                  ? 'Suspended'
                  : loading
                  ? 'Installing'
                  : hung
                  ? 'Errored'
                  : null}
              </span>
            </>
          )}
        </div>
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
        {image && !loading && (
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
