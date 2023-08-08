import MangaListCategory from '@app/(root)/components/mangalistcategory';
import BackHeader from '@app/components/BackHeader';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import TextField from '@app/components/TextField';
import React from 'react';
import { MdSearch } from 'react-icons/md';

interface ViewAllUpdatesProps {
  type: 'recent' | 'trending';
}

export default function ViewAllUpdates(props: ViewAllUpdatesProps) {
  const { type } = props;
  const [query, setQuery] = React.useState<string>('');
  const [isPending, setTransition] = React.useTransition();
  return (
    <>
      <BackHeader
        title={type[0].toUpperCase() + type.substring(1) + ' updates'}
      >
        <TextField
          onChange={(e) =>
            setTransition(() => {
              setQuery(e);
            })
          }
          className="flex-grow w-full"
          placeholder={`Search within ${type} updates...`}
          adornment={<MdSearch />}
        />
      </BackHeader>
      <Screen.Content>
        <MangaListCategory category={type} limitless query={query} />
      </Screen.Content>
    </>
  );
}
