'use client';
import Button from '@app/components/Button';
import React from 'react';
import { MdBook, MdBookmarkAdd, MdOutlineBookmarkRemove } from 'react-icons/md';

export interface ActionProps {
  inLibrary?: boolean;
  onToggleLibrary: () => void;
}

export default function Action(props: ActionProps) {
  const { inLibrary, onToggleLibrary } = props;
  return (
    <div className="flex flex-row space-x-2 justify-center items-center">
      <Button
        size="large"
        variant="contained"
        icon={<MdBook />}
        className="flex-grow max-w-screen-sm"
      >
        Read
      </Button>
      <Button
        onPress={onToggleLibrary}
        variant={inLibrary ? 'outline' : 'contained'}
        color="secondary"
        size="large"
        icon={inLibrary ? <MdOutlineBookmarkRemove /> : <MdBookmarkAdd />}
      >
        {inLibrary ? 'Remove' : 'Save'}
      </Button>
    </div>
  );
}
