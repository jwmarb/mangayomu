'use client';
import Button from '@app/components/Button';
import React from 'react';
import { MdBook, MdBookmarkAdd } from 'react-icons/md';

export default function Action() {
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
        variant="contained"
        color="secondary"
        size="large"
        icon={<MdBookmarkAdd />}
      >
        Save
      </Button>
    </div>
  );
}
