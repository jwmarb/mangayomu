'use client';
import Button from '@app/components/Button';
import Text from '@app/components/Text';
import useBoolean from '@app/hooks/useBoolean';
import React from 'react';
import { IoMdBookmarks } from 'react-icons/io';
import { MdBookmarkAdd, MdOutlineBookmarkRemove } from 'react-icons/md';

export default function NoMangasInLibrary() {
  const [toggled, toggle] = useBoolean();
  const [hasToggledOnce, toggleToggledOnce] = useBoolean();
  React.useEffect(() => {
    if (toggled) toggleToggledOnce(true);
  }, [toggleToggledOnce, toggled]);
  return (
    <div className="flex flex-col items-center justify-center">
      <IoMdBookmarks className="w-20 h-20 text-primary" />
      <Text variant="header" className="text-center">
        Your library is empty
      </Text>
      <div className="flex flex-row gap-2 justify-center flex-wrap">
        <Text color="text-secondary" className="text-center">
          To add a manga to your library, navigate to a manga and press
        </Text>
        <Button
          onPress={() => toggle()}
          variant={toggled ? 'outline' : 'contained'}
          color="secondary"
          icon={toggled ? <MdOutlineBookmarkRemove /> : <MdBookmarkAdd />}
        >
          {toggled ? 'Remove' : 'Add'}
        </Button>
      </div>
      {hasToggledOnce && (
        <Text color="secondary" className="py-4">
          You just pressed a non-functional button!
        </Text>
      )}
    </div>
  );
}
