import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogContent } from '../components/Dialog';
import { AppInfo } from '../components/AppInfo';
import { useCharge } from '../state/docket';
import { usePike } from '../state/kiln';

export const TileInfo = () => {
  const { desk = '' } = useParams<{ desk: string }>();
  const navigate = useNavigate();
  const charge = useCharge(desk);
  const pike = usePike(desk);

  if (!charge) {
    return null;
  }

  return (
    <Dialog open onOpenChange={(open) => !open && navigate('/')}>
      <DialogContent>
        <AppInfo pike={pike} docket={charge} />
      </DialogContent>
    </Dialog>
  );
};
