import classNames from 'classnames';
import React, {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  KeyboardEvent,
  HTMLAttributes,
  useCallback,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from 'react';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { Cross } from '../components/icons/Cross';
import { useDebounce } from '../logic/useDebounce';
import { useErrorHandler } from '../logic/useErrorHandler';
import { useMedia } from '../logic/useMedia';
import { MenuState, useAppSearchStore } from './Nav';

function normalizePathEnding(path: string) {
  const end = path.length - 1;
  return path[end] === '/' ? path.substring(0, end - 1) : path;
}

export function createPreviousPath(current: string): string {
  const parts = normalizePathEnding(current).split('/');
  parts.pop();

  if (parts[parts.length - 1] === 'leap') {
    parts.push('search');
  }

  return parts.join('/');
}

type LeapProps = {
  menu: MenuState;
  dropdown: string;
  navOpen: boolean;
} & HTMLAttributes<HTMLDivElement>;

function normalizeMatchString(match: string, keepAltChars: boolean): string {
  let normalizedString = match.toLocaleLowerCase().trim();

  if (!keepAltChars) {
    normalizedString = normalizedString.replace(/[^\w]/, '');
  }

  return normalizedString;
}

export const AppSearch = React.forwardRef(
  ({ menu, dropdown, navOpen, className }: LeapProps, ref) => {
    const { push } = useHistory();
    const deskMatch = useRouteMatch<{
      menu?: MenuState;
      query?: string;
      desk?: string;
    }>(`/${menu}/:query?/(apps)?/:desk?`);
    const appsMatch = useRouteMatch(`/${menu}/${deskMatch?.params.query}/apps`);
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current);
    const { rawInput, selectedMatch, matches, selection, select } =
      useAppSearchStore();
    const handleError = useErrorHandler();

    useEffect(() => {
      const onTreaty = appsMatch && !appsMatch.isExact;
      if (selection && rawInput === '' && !onTreaty) {
        inputRef.current?.focus();
      } else if (selection && onTreaty) {
        inputRef.current?.blur();
      }
    }, [selection, rawInput, appsMatch]);

    useEffect(() => {
      const newMatch = getMatch(rawInput);
      if (newMatch && rawInput) {
        useAppSearchStore.setState({ selectedMatch: newMatch });
      }
    }, [rawInput, matches]);

    useEffect(() => {
      if (menu === 'search') {
        inputRef.current?.focus();
      } else {
        inputRef.current?.blur();
      }
    }, [menu]);

    const toggleSearch = useCallback(() => {
      if (selection || menu === 'search') {
        return;
      }

      push('/search');
    }, [selection, menu]);

    const onFocus = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        // refocusing tab with input focused is false trigger
        const windowFocus = e.nativeEvent.currentTarget === document.body;
        if (windowFocus) {
          return;
        }

        toggleSearch();
      },
      [toggleSearch]
    );

    const getMatch = useCallback(
      (value: string) => {
        const onlySymbols = !value.match(/[\w]/g);
        const normValue = normalizeMatchString(value, onlySymbols);
        return matches.find((m) =>
          normalizeMatchString(m.value, onlySymbols).startsWith(normValue)
        );
      },
      [matches]
    );

    const navigateByInput = useCallback(
      (input: string) => {
        const normalizedValue = input
          .trim()
          .replace('%', '')
          .replace(/(~?[\w^_-]{3,56})\//, '$1/apps/$1/');
        push(`/${menu}/${normalizedValue}`);
      },
      [menu]
    );

    const debouncedSearch = useDebounce(
      (input: string) => {
        if (!deskMatch || appsMatch) {
          return;
        }

        useAppSearchStore.setState({ searchInput: input });
        navigateByInput(input);
      },
      300,
      { leading: true }
    );

    const handleSearch = useCallback(debouncedSearch, [deskMatch]);

    const onChange = useCallback(
      handleError((e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const value = input.value.trim();
        const isDeletion =
          (e.nativeEvent as InputEvent).inputType === 'deleteContentBackward';
        const inputMatch = getMatch(value);
        const matchValue = inputMatch?.value;

        if (matchValue && inputRef.current && !isDeletion) {
          inputRef.current.value = matchValue;
          const start = matchValue.startsWith(value)
            ? value.length
            : matchValue.substring(0, matchValue.indexOf(value)).length +
              value.length;
          inputRef.current.setSelectionRange(start, matchValue.length);
          useAppSearchStore.setState({
            rawInput: matchValue,
            selectedMatch: inputMatch,
          });
        } else {
          useAppSearchStore.setState({
            rawInput: value,
            selectedMatch: matches[0],
          });
        }

        handleSearch(value);
      }),
      [matches]
    );

    const onSubmit = useCallback(
      handleError((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const value = inputRef.current?.value.trim();
        const currentMatch = selectedMatch || (value && getMatch(value));

        if (!currentMatch) {
          return;
        }

        if (currentMatch?.openInNewTab) {
          window.open(currentMatch.url, currentMatch.value);
          return;
        }

        push(currentMatch.url);
        useAppSearchStore.setState({ rawInput: '' });
      }),
      [deskMatch, selectedMatch]
    );

    const onKeyDown = useCallback(
      handleError((e: KeyboardEvent<HTMLDivElement>) => {
        const deletion = e.key === 'Backspace' || e.key === 'Delete';
        const arrow = e.key === 'ArrowDown' || e.key === 'ArrowUp';

        if (deletion && !rawInput && selection) {
          e.preventDefault();
          select(
            null,
            appsMatch && !appsMatch.isExact
              ? undefined
              : deskMatch?.params.query
          );
          const pathBack = createPreviousPath(deskMatch?.url || '');
          push(pathBack);
        }

        if (arrow) {
          e.preventDefault();
          if (matches.length === 0) {
            return;
          }

          const currentIndex = selectedMatch
            ? matches.findIndex((m) => {
                const matchValue = m.value;
                const searchValue = selectedMatch.value;
                return matchValue === searchValue;
              })
            : 0;
          const unsafeIndex =
            e.key === 'ArrowUp' ? currentIndex - 1 : currentIndex + 1;
          const index = (unsafeIndex + matches.length) % matches.length;

          const newMatch = matches[index];
          useAppSearchStore.setState({
            rawInput: newMatch.value,
            // searchInput: matchValue,
            selectedMatch: newMatch,
          });
        }
      }),
      [selection, rawInput, deskMatch, matches, selectedMatch]
    );

    return (
      <div className="relative z-50 w-full">
        <form
          className={classNames(
            'default-ring flex h-9 w-full items-center rounded-lg bg-white px-2 focus-within:ring-2',
            !navOpen ? 'bg-gray-50' : '',
            menu === 'upgrading' ? 'bg-orange-500' : '',
            className
          )}
          onSubmit={onSubmit}
        >
          <label
            htmlFor="leap"
            className={classNames(
              'h4 inline-block flex-none p-2 ',
              menu === 'upgrading'
                ? 'text-white'
                : !selection
                ? 'sr-only'
                : 'text-blue-400'
            )}
          >
            {menu === 'upgrading'
              ? 'Your Urbit is being updated, this page will update when ready'
              : selection || 'Search'}
          </label>
          {menu !== 'upgrading' ? (
            <input
              id="leap"
              type="text"
              ref={inputRef}
              placeholder={selection ? '' : 'e.g., ~paldev or ~paldev/pals'}
              // TODO: style placeholder text with 100% opacity.
              // Not immediately clear how to do this within tailwind.
              className="outline-none h-full w-full flex-1 bg-transparent px-2 text-lg text-gray-800 sm:text-base"
              value={rawInput}
              onClick={toggleSearch}
              onFocus={onFocus}
              onChange={onChange}
              onKeyDown={onKeyDown}
              autoComplete="off"
              aria-autocomplete="both"
              aria-controls={dropdown}
              aria-activedescendant={selectedMatch?.value}
            />
          ) : null}
        </form>
        {menu === 'search' && (
          <Link
            to="/get-apps"
            className="circle-button default-ring absolute top-1/2 right-2 h-8 w-8 flex-none -translate-y-1/2 text-gray-600"
            onClick={() => select(null)}
          >
            <Cross className="h-3 w-3" />
            <span className="sr-only">Close</span>
          </Link>
        )}
      </div>
    );
  }
);
