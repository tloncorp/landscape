import React, { useCallback } from 'react';
import { Setting } from '../components/Setting';
import { useCalm, usePutEntryMutation } from '../state/settings';

export const AttentionAndPrivacy = () => {
  const {
    disableAppTileUnreads,
    disableAvatars,
    disableNicknames,
    disableSpellcheck,
    disableRemoteContent,
  } = useCalm();
  const { mutate: tileUnreads } = usePutEntryMutation({
    bucket: 'calmEngine',
    key: 'disableAppTileUnreads',
  });
  const { mutate: avatars } = usePutEntryMutation({
    bucket: 'calmEngine',
    key: 'disableAvatars',
  });
  const { mutate: nicknames } = usePutEntryMutation({
    bucket: 'calmEngine',
    key: 'disableNicknames',
  });
  const { mutate: spellcheck } = usePutEntryMutation({
    bucket: 'calmEngine',
    key: 'disableSpellcheck',
  });
  const { mutate: remote } = usePutEntryMutation({
    bucket: 'calmEngine',
    key: 'disableRemoteContent',
  });
  const toggle = useCallback((fn: typeof tileUnreads) => {
    return async (val: boolean) => fn({ val });
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <div className="inner-section relative space-y-8">
        <h2 className="h4">CalmEngine</h2>
        <span className="font-semibold leading-5 text-gray-400">
          Modulate attention-hacking interfaces. Note: apps vary in their
          implementation of these settings.
        </span>
        <Setting
          on={disableAvatars}
          toggle={toggle(avatars)}
          name="Disable avatars"
        >
          <p className="leading-5 text-gray-600">
            Turn user-set visual avatars off and only display sigils across all
            of your apps.
          </p>
        </Setting>
        <Setting
          on={disableNicknames}
          toggle={toggle(nicknames)}
          name="Disable nicknames"
        >
          <p className="leading-5 text-gray-600">
            Turn user-set nicknames off and only display Urbit IDs across all of
            your apps.
          </p>
        </Setting>
      </div>
      <div className="inner-section relative space-y-8">
        <h2 className="h4">Privacy</h2>
        <span className="font-semibold leading-5 text-gray-400">
          Limit your ability to be read or tracked by clearnet services. Note:
          apps vary in their implementation of these settings.
        </span>
        <Setting
          on={disableSpellcheck}
          toggle={toggle(spellcheck)}
          name="Disable spell-check"
        >
          <p className="leading-5 text-gray-600">
            Turn spell-check off across all text inputs in installed software.
            Spell-check reads your keyboard input, which may be undesirable.
          </p>
        </Setting>
        <Setting
          on={disableRemoteContent}
          toggle={toggle(remote)}
          name="Disable remote content"
        >
          <p className="leading-5 text-gray-600">
            Turn off automatically-displaying media embeds across all of your
            installed software. This may result in some software appearing to
            have content missing.
          </p>
        </Setting>
      </div>
    </div>
  );
};
