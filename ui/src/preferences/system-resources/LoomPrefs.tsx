import React from 'react';
import { Button } from '../../components/Button';
import { useLoom } from '../../state/loom';

export const LoomPrefs = () => {
  const { free, total, pack } = useLoom();

  return (
    <div className="inner-section mt-4 space-y-8 leading-5">
      <h2 className="h4">Loom</h2>
      <div className="space-y-3">
        <div className="overflow-hidden rounded-full rounded bg-green-200 ">
          <div
            className="h-2 bg-green-300"
            style={{ width: (free / total) * 100 + '%' }}
          ></div>
        </div>
        <label className="flex flex-row items-center justify-between text-sm font-semibold">
          {Math.round(free / 1000)}/{Math.round(total / 1000)}mb free
        </label>
      </div>

      <div>
        <h3 className="font-semibold">Optimize Your Urbit's Loom</h3>
        <p className="text-gray-400">
          Deduplicate objects in storage to free up space using |pack.{' '}
          <a
            href="https://operators.urbit.org/manual/running/vere#pack"
            target="_blank"
            className="underline"
          >
            Learn more
          </a>
        </p>
        <Button variant="primary" className="mt-4" onClick={pack}>
          Pack Loom
        </Button>
      </div>
    </div>
  );
};
