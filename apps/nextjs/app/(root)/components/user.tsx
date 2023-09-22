import Button from '@app/components/Button';
import DarkMode from '@app/components/DarkMode';
import IconButton from '@app/components/IconButton';
import Text from '@app/components/Text';
import { useUser } from '@app/context/realm';
import { useSafeArea } from '@app/context/safearea';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MdChevronLeft, MdPerson, MdSettings } from 'react-icons/md';

interface UserProps {
  onDrawerClose: () => void;
}

export default function User(props: UserProps) {
  const { onDrawerClose } = props;
  const user = useUser();
  const mobile = useSafeArea((store) => store.mobile);
  const router = useRouter();
  const onSettings = () => {
    onDrawerClose();
    router.push('/settings');
  };
  return (
    <div className="flex flex-col gap-1 items-center">
      {user.profile.name == null && (
        <div className="flex flex-row gap-1">
          <Link href="/login">
            <Text color="primary" variant="sm-label">
              Login
            </Text>
          </Link>
          <Text variant="sm-label" color="text-secondary">
            or
          </Text>
          <Link href="/register">
            <Text color="primary" variant="sm-label">
              Create an account
            </Text>
          </Link>
        </div>
      )}
      <div className="flex flex-row justify-between gap-2 w-full">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-10 h-10 bg-default rounded-lg items-center justify-center flex">
            <MdPerson className="text-text-primary" />
          </div>
          <Text className="break-all">{user.profile.name ?? 'Guest'}</Text>
        </div>
        <div className="flex flex-row">
          {/* <DarkMode /> */}
          <IconButton icon={<MdSettings />} onPress={onSettings} />
          {mobile && (
            <IconButton icon={<MdChevronLeft />} onPress={onDrawerClose} />
          )}
        </div>
      </div>
    </div>
  );
}
