import Search from '@screens/Home/screens/MangaLibrary/components/Search';
import React from 'react';
import { TextInput } from 'react-native';

export default function useSearchBar(options?: {
  focusCondition?: boolean;
  additionalButtons?: React.ReactElement<any>;
}) {
  const defaultOptions = { ...options, focusCondition: true };
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
        setQuery={setQuery}
        setShowSearchBar={setShowSearchBar}
        showSearchBar={showSearchBar}
        additionalButtons={defaultOptions.additionalButtons}
      />
    ),
    query,
  };
}
