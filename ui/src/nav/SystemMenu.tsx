import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import classNames from 'classnames';
import clipboardCopy from 'clipboard-copy';
import React, { HTMLAttributes, useCallback, useState } from 'react';
import { Link, Route, useHistory } from 'react-router-dom';
import { Pike } from '@/gear';
import { Adjust } from '../components/icons/Adjust';
import { usePike } from '../state/kiln';
import { disableDefault, handleDropdownLink } from '@/logic/utils';
import { useMedia } from '../logic/useMedia';
import { Cross } from '../components/icons/Cross';
import { useAppSearchStore } from './Nav';

type SystemMenuProps = HTMLAttributes<HTMLButtonElement> & {
  open: boolean;
  subMenuOpen: boolean;
  shouldDim: boolean;
};

function getHash(pike: Pike): string {
  const parts = pike.hash.split('.');
  return parts[parts.length - 1];
}

export const SystemMenu = ({
  className,
  open,
  subMenuOpen,
  shouldDim,
}: SystemMenuProps) => {
  const { push } = useHistory();
  const [copied, setCopied] = useState(false);
  const garden = usePike(window.desk);
  const hash = garden ? getHash(garden) : null;
  const isMobile = useMedia('(max-width: 639px)');
  const select = useAppSearchStore((s) => s.select);
  const clearSelection = useCallback(() => select(null), [select]);

  const copyHash = useCallback(
    (event: Event) => {
      event.preventDefault();
      if (!hash) {
        return;
      }

      setCopied(true);
      clipboardCopy(hash);

      setTimeout(() => {
        setCopied(false);
      }, 1250);
    },
    [hash]
  );

  const preventFlash = useCallback((e) => {
    const target = e.target as HTMLElement;

    if (target.id !== 'system-menu-overlay') {
      e.preventDefault();
    }
  }, []);

  return (
    <>
      <div className="z-40">
        <DropdownMenu.Root
          modal={false}
          open={open}
          onOpenChange={(isOpen) => setTimeout(() => !isOpen && push('/'), 15)}
        >
          <Link
            to={open || subMenuOpen ? '/' : '/system-menu'}
            className={classNames(
              'circle-button default-ring relative appearance-none',
              open && 'text-gray-300',
              shouldDim && 'opacity-60',
              className
            )}
            onClick={clearSelection}
          >
            {!open && !subMenuOpen && (
              <>
                <Adjust className="text-gray h-6 w-6 fill-current" />
                <span className="sr-only">System Menu</span>
              </>
            )}
            {(open || subMenuOpen) && (
              <>
                <Cross className="h-3 w-3 fill-current" />
                <span className="sr-only">Close</span>
              </>
            )}
            {/* trigger here just for anchoring the dropdown */}
            <DropdownMenu.Trigger className="sr-only top-0 left-0 sm:top-auto sm:left-auto sm:bottom-0" />
          </Link>
          <Route path="/system-menu">
            <DropdownMenu.Content
              onCloseAutoFocus={disableDefault}
              onInteractOutside={preventFlash}
              onFocusOutside={preventFlash}
              onPointerDownOutside={preventFlash}
              side={isMobile ? 'top' : 'bottom'}
              sideOffset={12}
              className="dropdown relative z-40 min-w-64 bg-white p-4 font-semibold text-gray-500"
            >
              <DropdownMenu.Group>
                <DropdownMenu.Item onSelect={handleDropdownLink()}>
                  <Link
                    to="/leap/system-preferences"
                    className="focus:outline-none mb-2 flex items-center space-x-2 rounded p-2 focus:bg-blue-200"
                  >
                    <span className="h-5 w-5 rounded-full bg-gray-100" />
                    <span className="h4">System Preferences</span>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild onSelect={handleDropdownLink()}>
                  <Link
                    to="/leap/help-and-support"
                    className="focus:outline-none mb-2 flex items-center space-x-2 rounded p-2 focus:bg-blue-200"
                  >
                    <span className="h-5 w-5 rounded-full bg-gray-100" />
                    <span className="h4">Help and Support</span>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild onSelect={handleDropdownLink()}>
                  <Link
                    to={`/app/${window.desk}`}
                    className="focus:outline-none mb-2 flex items-center space-x-2 rounded p-2 focus:bg-blue-200"
                  >
                    <span className="h-5 w-5 rounded-full bg-gray-100" />
                    <span className="h4">About</span>
                  </Link>
                </DropdownMenu.Item>
                {hash && (
                  <DropdownMenu.Item asChild onSelect={copyHash}>
                    <button className="h4 focus:outline-none m-2 inline-flex items-center rounded bg-gray-100 py-2 px-3 text-black focus:bg-blue-200">
                      <span className="sr-only">Base Hash</span>
                      <code>
                        {!copied && (
                          <span aria-label={hash.split('').join('-')}>
                            {hash}
                          </span>
                        )}
                        {copied && 'copied!'}
                      </code>
                    </button>
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </Route>
        </DropdownMenu.Root>
      </div>
      <Route path="/system-menu">
        <div
          id="system-menu-overlay"
          className="fixed right-0 bottom-0 z-30 h-screen w-screen bg-black opacity-30"
        />
      </Route>
    </>
  );
};
