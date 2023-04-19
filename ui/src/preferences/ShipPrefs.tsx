import classNames from 'classnames';
import clipboardCopy from 'clipboard-copy';
import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { useAzimuthBlock } from '../state/azimuth';

export const ShipPrefs = () => {
  const { block, isLoading, isStale, forceUpdate } = useAzimuthBlock();

  return (
    <div className="inner-section space-y-8">
      <h2 className="h4">Identity</h2>
      <div className="flex flex-row items-center">
        <Avatar shipName={window.ship} size="default" />
        <div className="ml-2 flex-grow">
          <h3 className="mb-1 font-semibold">~{window.ship}</h3>
          {!isLoading && (
            <div className="flex flex-row items-center justify-start">
              <span
                className={classNames('font-semibold', {
                  'text-orange-400': isStale,
                  'text-gray-400': !isStale,
                })}
              >
                Azimuth block: {block}{' '}
              </span>
              {!isLoading && isStale && (
                <span className="ml-1 rounded border border-solid border-orange-400 px-1.5 text-xs font-semibold uppercase text-orange-400">
                  Stale
                </span>
              )}
            </div>
          )}
        </div>
        <div>
          {block && (
            <CopyButton
              type="submit"
              variant="secondary"
              className="py-1 px-3 text-sm"
              label="Copy Info"
              content={block}
            ></CopyButton>
          )}
          {!isLoading && isStale && (
            <Button
              type="submit"
              className="ml-1 bg-orange-400 py-1 px-3 text-sm"
              onClick={forceUpdate}
            >
              Update
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

type CopyButtonProps = Omit<
  ComponentProps<typeof Button>,
  'children' | 'onClick'
>;

const CopyButton = ({
  label = 'copy',
  content,
  ...buttonProps
}: {
  label: string;
  content: string;
} & CopyButtonProps) => {
  const [successMessageActive, setSuccessMesageActive] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(() => {
    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    clipboardCopy(content);
    setSuccessMesageActive(true);
    copyTimeout.current = setTimeout(() => setSuccessMesageActive(false), 1000);
  }, []);

  // ensure timeout is cleared when component unmounts
  useEffect(() => {
    () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  return (
    <Button {...buttonProps} onClick={copy}>
      {successMessageActive ? 'Copied' : label}
    </Button>
  );
};
