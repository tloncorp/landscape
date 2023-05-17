import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { uniq } from 'lodash';
import { ChargeWithDesk, useCharges } from '../state/docket';
import { Tile } from './Tile';
import { MenuState } from '../nav/Nav';
import { usePutEntryMutation, useTiles } from '../state/settings';
import { TileContainer } from './TileContainer';
import { useMedia } from '../logic/useMedia';
import { Spinner } from '@/components/Spinner';

export interface TileData {
  desk: string;
  charge: ChargeWithDesk;
  position: number;
  dragging: boolean;
}

interface TileGridProps {
  menu?: MenuState;
}

export const dragTypes = {
  TILE: 'tile',
};

export const TileGrid = ({ menu }: TileGridProps) => {
  const charges = useCharges();
  const chargesLoaded = Object.keys(charges).length > 0;
  const { order, loaded } = useTiles();
  const isMobile = useMedia('(pointer: coarse)');
  const { mutate } = usePutEntryMutation({ bucket: 'tiles', key: 'order' });

  useEffect(() => {
    const hasKeys = order && !!order.length;
    const chargeKeys = Object.keys(charges);
    const hasChargeKeys = chargeKeys.length > 0;

    if (!loaded || !hasChargeKeys) {
      return;
    }

    // Correct order state, fill if none, remove duplicates, and remove
    // old uninstalled app keys
    if (!hasKeys && hasChargeKeys) {
      mutate({ val: chargeKeys });
    } else if (order.length < chargeKeys.length) {
      mutate({ val: uniq(order.concat(chargeKeys)) });
    } else if (order.length > chargeKeys.length && hasChargeKeys) {
      mutate({
        val: uniq(order.filter((key) => key in charges).concat(chargeKeys)),
      });
    }
  }, [charges, order, loaded]);

  if (!chargesLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner aria-label="Loading..." />
      </div>
    );
  }

  return (
    <DndProvider
      backend={isMobile ? TouchBackend : HTML5Backend}
      options={
        isMobile
          ? {
              delay: 50,
              scrollAngleRanges: [
                { start: 30, end: 150 },
                { start: 210, end: 330 },
              ],
            }
          : undefined
      }
    >
      <div
        // This version of tailwind does not have h-fit
        style={{ height: 'fit-content' }}
        className="grid w-full max-w-6xl grid-cols-2 justify-center gap-4 px-4 pb-4 sm:grid-cols-[repeat(auto-fit,minmax(auto,250px))] md:px-8 md:pb-10"
      >
        {order
          .filter((d) => d !== window.desk && d in charges)
          .filter((d) => d !== 'landscape')
          .map((desk) => (
            <TileContainer key={desk} desk={desk}>
              <Tile
                charge={charges[desk]}
                desk={desk}
                disabled={menu === 'upgrading'}
              />
            </TileContainer>
          ))}
      </div>
    </DndProvider>
  );
};
