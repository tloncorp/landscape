import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import fuzzy from 'fuzzy';
import classNames from 'classnames';
import MagnifyingGlassIcon from '../components/icons/MagnifyingGlassIcon';
import BellIcon from '../components/icons/BellIcon';
import { Interface } from '../components/icons/Interface';
import BurstIcon from '../components/icons/BurstIcon';
import HelpIcon from '../components/icons/HelpIcon';
import TlonIcon from '../components/icons/TlonIcon';
import LogoutIcon from '../components/icons/LogoutIcon';
import PencilIcon from '../components/icons/PencilIcon';
import ForwardSlashIcon from '../components/icons/ForwardSlashIcon';

type NavOption = {
  route: string;
  title: string;
  icon: React.ReactElement;
};

const navOptions: NavOption[] = [
  {
    route: 'help',
    title: 'Help and Support',
    icon: <HelpIcon className="h-4 w-4 text-gray-600" />,
  },
  {
    route: 'interface',
    title: 'Interface Settings',
    icon: <Interface className="h-4 w-4 text-gray-600" />,
  },
  {
    route: 'notifications',
    title: 'Notifications',
    icon: <BellIcon className="h-4 w-4 text-gray-600" />,
  },
  {
    route: 'appearance',
    title: 'Appearance',
    icon: <PencilIcon className="h-4 w-4 text-gray-600" />,
  },
  {
    route: 'shortcuts',
    title: 'Shortcuts',
    icon: <ForwardSlashIcon className="h-4 w-4 text-gray-600" />,
  },
  {
    route: 'privacy',
    title: 'Attention & Privacy',
    icon: <BurstIcon className="h-4 w-4 text-gray-600" />,
  },
  {
    route: 'security',
    title: 'Log Out...',
    icon: <LogoutIcon className="h-4 w-4 text-gray-600" />,
  },
  {
    route: 'system-updates',
    title: 'About System',
    icon: <TlonIcon className="h-4 w-4 text-gray-600" />,
  },
];

export default function SearchSystemPreferences() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [matchingNavOptions, setMatchingNavOptions] = useState<NavOption[]>([]);
  const [highlightNavOption, setHighlightNavOption] = useState<number>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const value = input.value.trim();

    setSearchInput(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;

    if (searchInput === '') {
      setHighlightNavOption(undefined);
    }

    if (key === 'Escape') {
      setSearchInput('');
      setHighlightNavOption(undefined);
    }

    if (
      key === 'ArrowDown' &&
      searchInput !== '' &&
      matchingNavOptions.length > 0 &&
      highlightNavOption !== matchingNavOptions.length - 1
    ) {
      if (highlightNavOption === undefined) {
        setHighlightNavOption(0);
      } else {
        setHighlightNavOption((prevState) => prevState! + 1);
      }
    }

    if (
      key === 'ArrowUp' &&
      searchInput !== '' &&
      matchingNavOptions.length > 0 &&
      highlightNavOption !== undefined &&
      highlightNavOption !== 0
    ) {
      setHighlightNavOption((prevState) => prevState! - 1);
    }

    if (
      key === 'Enter' &&
      searchInput !== '' &&
      highlightNavOption !== undefined
    ) {
      navigate(matchingNavOptions[highlightNavOption].route);
      setHighlightNavOption(undefined);
    }
  };

  const handleBlur = () => {
    setSearchInput('');
  };

  useEffect(() => {
    const results = fuzzy.filter(searchInput, navOptions, {
      extract: (obj) => obj.title,
    });
    const matches = results.map((el) => el.string);
    const matchedNavOptions = navOptions.filter((navOpt) =>
      matches.includes(navOpt.title)
    );

    setMatchingNavOptions(matchedNavOptions);
  }, [searchInput]);

  return (
    <>
      <label className="relative flex items-center">
        <span className="sr-only">Search Prefences</span>
        <span className="absolute inset-y-1 left-0 flex h-8 w-8 items-center pl-2 text-gray-400">
          <MagnifyingGlassIcon />
        </span>
        <input
          className="input mb-5 h-10 bg-gray-50 pl-8 placeholder:font-semibold"
          placeholder="Search Preferences"
          value={searchInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </label>
      <div className="relative">
        {matchingNavOptions.length > 0 && searchInput !== '' ? (
          <div className="absolute -top-3 flex w-full flex-col space-y-2 rounded-2xl bg-white py-3 shadow-md">
            {matchingNavOptions.map((opt, index) => {
              const matchingNavOption = navOptions.find(
                (navOpt) => navOpt.title === opt.title
              );
              if (matchingNavOption !== undefined) {
                return (
                  <Link
                    className={classNames(
                      'flex items-center space-x-2 px-2 py-3 hover:bg-gray-50 hover:text-black',
                      {
                        'bg-gray-50': highlightNavOption === index,
                      }
                    )}
                    to={matchingNavOption.route}
                  >
                    {matchingNavOption.icon}
                    <span className="text-gray-900">
                      {matchingNavOption?.title}
                    </span>
                  </Link>
                );
              }
              return null;
            })}
          </div>
        ) : null}
      </div>
    </>
  );
}
