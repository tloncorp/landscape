import React from 'react';
import { Button } from '../components/Button';

export const Hosting = () => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="inner-section space-y-8">
        <h2 className="text-lg font-bold">Tlon Hosting</h2>
        <div>
          <h3 className="text-md mb-2 font-bold">Service Account Dashboard</h3>
          <p className="leading-5">
            View your hosted urbits, their current status, and account info.
          </p>
        </div>
        <Button
          variant="primary"
          as="a"
          href="https://tlon.network/login"
          target="_blank"
        >
          Open Service Account Dashboard
        </Button>
      </div>
    </div>
  );
};
