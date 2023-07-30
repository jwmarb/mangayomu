import React from 'react';
import { useUser } from '@app/context/realm';
import Text from '@app/components/Text';
import Image from 'next/image';
import { MdChevronRight, MdPerson } from 'react-icons/md';
import IconButton from '@app/components/IconButton';

export default function Account() {
  const user = useUser();
  return (
    <>
      <div className="mx-4">
        <Text variant="header">Account</Text>
        <Text color="text-secondary">Manage your MangaYomu account</Text>
      </div>
      <button className="mx-4 flex border-default border-2 transition duration-250 bg-paper rounded-xl p-4 gap-2 items-center justify-between hover:bg-hover active:bg-pressed">
        <div className="flex gap-3 items-center">
          {user.profile.pictureUrl ? (
            <Image src={user.profile.pictureUrl} alt="profile pic" />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-full items-center justify-center flex">
              <MdPerson className="text-text-primary" />
            </div>
          )}
          <div className="flex flex-col items-start">
            <Text>{user.profile.name}</Text>
            <Text color="text-secondary" variant="sm-label">
              {user.id}
            </Text>
          </div>
        </div>
        <IconButton icon={<MdChevronRight />} />
      </button>
    </>
  );
}
