import DarkMode from '@app/components/DarkMode';
import IconButton from '@app/components/IconButton';
import Text from '@app/components/Text';
import { useUser } from '@app/context/realm';
import { useSafeArea } from '@app/context/safearea';
import React from 'react';
import { MdChevronLeft, MdPerson, MdSettings } from 'react-icons/md';

interface UserProps {
  onDrawerClose: () => void;
}

export default function User(props: UserProps) {
  const { onDrawerClose } = props;
  const user = useUser();
  const mobile = useSafeArea((store) => store.mobile);
  return (
    <div className="flex flex-row justify-between gap-2">
      <div className="flex flex-row gap-2 items-center">
        <div className="w-10 h-10 bg-default rounded-lg items-center justify-center flex">
          <MdPerson className="text-text-primary" />
        </div>
        <Text>{user.profile.name ?? 'Guest'}</Text>
      </div>
      <div className="flex flex-row">
        <DarkMode />
        <IconButton icon={<MdSettings />} onPress={onDrawerClose} />
        {mobile && (
          <IconButton icon={<MdChevronLeft />} onPress={onDrawerClose} />
        )}
      </div>
    </div>
  );
}
