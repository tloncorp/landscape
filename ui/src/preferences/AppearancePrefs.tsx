import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useDisplay, usePutEntryMutation } from '@/state/settings';

type prefType = 'auto' | 'dark' | 'light';

interface RadioOptionProps {
  value: string;
  label: string;
  selected: boolean;
}

interface AppearanceOption {
  value: prefType;
  label: string;
}

const appearanceOptions: AppearanceOption[] = [
  { value: 'auto', label: 'System Theme' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const RadioOption = ({ value, label, selected }: RadioOptionProps) => (
  <div className="flex space-x-3 ">
    <RadioGroup.Item
      className={classNames(
        'flex h-4 w-4 items-center rounded-full border-gray-200',
        {
          'border-2': !selected,
        }
      )}
      value={value}
      id={value}
    >
      <RadioGroup.Indicator className="flex h-full w-full items-center rounded-full border-4 border-gray-800" />
    </RadioGroup.Item>
    <label className="font-semibold" htmlFor={value}>
      {label}
    </label>
  </div>
);

export const AppearancePrefs = () => {
  const { theme } = useDisplay();
  const [pref, setPref] = useState<prefType>(theme || 'auto');
  const { mutate } = usePutEntryMutation({ bucket: 'display', key: 'theme' });

  useEffect(() => {
    // useSettingsState.getState().set((draft) => {
    //   draft.display.theme = pref;
    // });
    mutate({ val: pref });
  }, [pref]);

  const handleChange = (value: string) => {
    setPref(value as prefType);
  };

  return (
    <div className="inner-section space-y-8">
      <h2 className="h4">Landscape Appearance</h2>
      <RadioGroup.Root
        className="flex flex-col space-y-3"
        value={pref}
        onValueChange={handleChange}
      >
        {appearanceOptions.map((option) => (
          <RadioOption
            key={`radio-option-${option.value}`}
            value={option.value}
            label={option.label}
            selected={pref === option.value}
          />
        ))}
      </RadioGroup.Root>
    </div>
  );
};
