import Search from '@screens/Home/screens/MangaLibrary/components/Search';
import React from 'react';
import { TextInput } from 'react-native';

type SearchBarOptions = {
  /**
   * Condition to have to focus on the text field when the user clicks the button
   */
  focusCondition?: boolean;

  /**
   * Buttons next to the search bar
   */
  additionalButtons?: React.ReactElement<any>;

  /**
   * The event where the state change should be performed on query
   */
  event?: 'onChangeText' | 'onSubmitEditing';
};

/**
 * Use a search bar for the header
 * @param options Options to provide for the search bar
 * @returns Returns a generated header with a search bar
 */
export default function useSearchBar(options?: SearchBarOptions) {
  const defaultOptions: SearchBarOptions = { focusCondition: true, event: 'onChangeText', ...options };
  const [query, setQuery] = React.useState<string>('');
  const [showSearchBar, setShowSearchBar] = React.useState<boolean>(false);
  const textRef = React.useRef<TextInput>();
  React.useEffect(() => {
    if (defaultOptions.focusCondition)
      setTimeout(() => {
        if (showSearchBar) textRef.current?.focus();
        else setQuery('');
      }, 100);
  }, [showSearchBar]);

  return {
    header: (
      <Search
        ref={textRef}
        setShowSearchBar={setShowSearchBar}
        showSearchBar={showSearchBar}
        additionalButtons={defaultOptions.additionalButtons}
        {...(defaultOptions.event === 'onChangeText' ? { onChangeText: setQuery } : { onSubmitEditing: setQuery })}
      />
    ),
    query,
  };
}
