'use client';
import Button from '@app/components/Button';
import Text from '@app/components/Text';
import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import { MdBook, MdBookmarkAdd, MdOutlineBookmarkRemove } from 'react-icons/md';

export interface ActionProps {
  inLibrary: boolean;
  onToggleLibrary: () => void;
  currentlyReadingChapter?: MangaChapter;
  loading: boolean;
}

export default function Action(props: ActionProps) {
  const { inLibrary, onToggleLibrary, currentlyReadingChapter, loading } =
    props;
  return (
    <div className="flex flex-row space-x-2 justify-center items-center">
      <Button
        disabled={loading}
        size="large"
        variant="contained"
        icon={!loading && <MdBook />}
        className="flex-grow max-w-screen-sm"
      >
        {loading ? (
          <Text.Skeleton width="100%" variant="button" />
        ) : currentlyReadingChapter != null ? (
          currentlyReadingChapter.name
        ) : (
          'Read'
        )}
      </Button>
      <Button
        disabled={loading}
        onPress={onToggleLibrary}
        variant={inLibrary ? 'outline' : 'contained'}
        color="secondary"
        size="large"
        icon={
          !loading &&
          (inLibrary ? <MdOutlineBookmarkRemove /> : <MdBookmarkAdd />)
        }
      >
        {loading ? (
          <Text.Skeleton width="100%" variant="button" />
        ) : inLibrary ? (
          'Remove'
        ) : (
          'Save'
        )}
      </Button>
    </div>
  );
}
