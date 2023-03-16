import React, { FC } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import classNames from 'classnames';

interface DialogProps extends DialogPrimitive.DialogProps {
  portal?: boolean;
}

export const Dialog: FC<DialogProps> = ({
  children,
  portal = true,
  ...props
}) => {
  return (
    <DialogPrimitive.Root {...props}>
      {portal ? (
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed top-0 bottom-0 left-0 right-0 z-30 transform-gpu bg-black opacity-30" />
          {children}
        </DialogPrimitive.Portal>
      ) : (
        <>
          <DialogPrimitive.Overlay className="fixed top-0 bottom-0 left-0 right-0 z-30 transform-gpu bg-black opacity-30" />
          {children}
        </>
      )}
    </DialogPrimitive.Root>
  );
};

interface DialogContentProps extends DialogPrimitive.DialogContentProps {
  containerClass?: string;
  showClose?: boolean;
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(
  (
    { showClose = true, containerClass, children, className, ...props },
    forwardedRef
  ) => (
    <DialogPrimitive.Content asChild {...props} ref={forwardedRef}>
      <section className={classNames('dialog-container', containerClass)}>
        <div className={classNames('dialog', className)}>
          {children}
          {showClose && (
            <DialogPrimitive.Close className="default-ring absolute top-4 right-4 rounded-full bg-gray-100 p-2 sm:top-7 sm:right-7">
              <svg
                className="h-3.5 w-3.5 stroke-current text-gray-500"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 4L20 20" strokeWidth="3" strokeLinecap="round" />
                <path d="M20 4L4 20" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </DialogPrimitive.Close>
          )}
        </div>
      </section>
    </DialogPrimitive.Content>
  )
);

export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
