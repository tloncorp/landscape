import MagnifyingGlass16Icon from '@/components/icons/MagnifyingGlass16Icon';
import classNames from 'classnames';
import React, {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom';
import { Cross } from '../components/icons/Cross';
import { useDebounce } from '../logic/useDebounce';
import { useErrorHandler } from '../logic/useErrorHandler';
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

function normalizeMatchString(match: string, keepAltChars: boolean): string {
  let normalizedString = match.toLocaleLowerCase().trim();

  if (!keepAltChars) {
    normalizedString = normalizedString.replace(/[^\w]/, '');
  }

  return normalizedString;
}

export const AppSearch = () => {
  const params = useParams<{ menu: MenuState }>();
  const { menu } = params;
  const menuState = menu || 'closed';
  const isOpen =
    menuState !== 'upgrading' && menuState !== 'closed' && menuState !== 'app';
  const navigate = useNavigate();
  const deskMatch = useMatch(`/${menuState}/:query?/(apps)?/:desk?`);
  console.log({ deskMatch, menuState, menu });
  const appsMatch = useMatch(`/${menuState}/${deskMatch?.params.query}/apps`);
  const inputRef = useRef<HTMLInputElement>(null);
  const { rawInput, selectedMatch, matches, selection, select } =
    useAppSearchStore();
  const handleError = useErrorHandler();

  useEffect(() => {
    const onTreaty = appsMatch && !appsMatch.pattern.end;
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
    if (menuState === 'search') {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [menuState]);

  const toggleSearch = useCallback(() => {
    if (selection || menuState === 'search') {
      return;
    }

    navigate('/search');
  }, [selection, menuState]);

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
      navigate(`/${menuState}/${normalizedValue}`);
    },
    [menuState]
  );

  const debouncedSearch = useDebounce(
    (input: string) => {
      console.log({ deskMatch, appsMatch });
      if (!deskMatch || appsMatch) {
        console.log('no desk match');
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

      console.log({ value });
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

      navigate(currentMatch.url);
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
          appsMatch && !appsMatch.pattern.end
            ? undefined
            : deskMatch?.params.query
        );
        const pathBack = createPreviousPath(deskMatch?.pathname || '');
        navigate(pathBack);
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
          !isOpen ? 'bg-gray-50' : '',
          menuState === 'upgrading' ? 'bg-orange-500' : ''
        )}
        onSubmit={onSubmit}
      >
        <label
          htmlFor="leap"
          className={classNames(
            'h4 inline-block flex-none p-2 ',
            menuState === 'upgrading'
              ? 'text-white'
              : !selection
              ? 'sr-only'
              : 'text-blue-400'
          )}
        >
          {menuState === 'upgrading'
            ? 'Your Urbit is being updated, this page will update when ready'
            : selection || 'Search'}
        </label>
        {menuState === 'search' ? (
          <MagnifyingGlass16Icon className="ml-2 mt-1 h-4 w-4 text-gray-600" />
        ) : null}
        {menuState !== 'upgrading' ? (
          <input
            id="leap"
            type="text"
            ref={inputRef}
            placeholder={selection ? '' : 'e.g., ~paldev or ~paldev/pals'}
            // TODO: style placeholder text with 100% opacity.
            // Not immediately clear how to do this within tailwind.
            className="outline-none h-full w-full flex-1 rounded-md bg-gray-50 px-2 text-lg text-gray-800 sm:text-base"
            value={rawInput}
            onClick={toggleSearch}
            onFocus={onFocus}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoFocus
            autoComplete="off"
            aria-autocomplete="both"
            aria-controls="search-items"
            aria-activedescendant={selectedMatch?.value}
          />
        ) : null}
      </form>
      {menuState === 'search' && (
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
};
