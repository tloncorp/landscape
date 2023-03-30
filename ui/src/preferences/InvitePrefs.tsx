import React from 'react';
import { useForm } from 'react-hook-form';
import useInviteState from '../state/invites';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
import cn from 'classnames';

export const InvitePrefs = () => {
  const {baitURL, setBaitURL, loaded, save} = useInviteState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, isValid, isSubmitSuccessful },
  } = useForm<{url: string}>({
    mode: 'onChange',
  });

  return (
    <div className="inner-section space-y-8">
      <h2 className="h4">Invite Links</h2>
      <form onSubmit={handleSubmit(save)}>
        <div className="mb-8 flex flex-col space-y-2">
          <label className="font-semibold" htmlFor="endpoint">
            Invite Server URL
          </label>
          <input
            disabled={!loaded}
            id="url"
            type="text"
            defaultValue={baitURL}
            {...register('url', { pattern: /^http.*$/ })}
            className="input default-ring bg-gray-50"
          />
        </div>
        <Button
          type="submit"
          disabled={!isDirty || !isValid}
          className={cn(
            !isDirty || !isValid || isSubmitSuccessful
            ? 'cursor-not-allowed bg-gray-200 text-gray-100'
            : ''
          )}
        >
          {isSubmitting ? <Spinner /> : 'Save'}
          {isSubmitSuccessful && ' Successful'}
        </Button>
      </form>
    </div>
  );
};
