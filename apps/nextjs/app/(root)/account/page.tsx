'use client';
import DeleteAccount from '@app/(root)/account/components/deleteaccount';
import IconButton from '@app/components/IconButton';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import TextField from '@app/components/TextField';
import { useUser } from '@app/context/realm';
import useBoolean from '@app/hooks/useBoolean';
import useMongoClient from '@app/hooks/useMongoClient';
import useObject from '@app/hooks/useObject';
import UserSchema, { IUserSchema } from '@app/realm/User';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MdArrowBack, MdEdit } from 'react-icons/md';

export default function Page() {
  const router = useRouter();
  const [edit, toggle] = useBoolean();
  const handleOnBack = () => {
    router.back();
  };
  const user = useUser();
  const [data, setData] = React.useState<IUserSchema | null>(null);
  const userCollection = useMongoClient(UserSchema);
  React.useEffect(() => {
    userCollection
      .findOne({ _id: user.id }, { projection: { password: 0 } })
      .then(setData);
  }, [data]);
  return (
    <Screen>
      <Screen.Header className="z-20 pb-2 flex flex-row gap-2 items-center">
        <IconButton onPress={handleOnBack} icon={<MdArrowBack />} />
        <Text className="font-medium">Account</Text>
      </Screen.Header>
      <Screen.Content overrideClassName="flex flex-col gap-4 py-4 max-w-screen-lg mx-auto">
        <Text variant="header">Account Information</Text>
        <div className="rounded border-2 border-default bg-paper p-4 flex flex-col gap-4">
          <div>
            <Text className="font-bold">User ID</Text>
            <Text color="text-secondary">{user.id}</Text>
          </div>
          <div className="flex flex-col">
            <Text className="font-bold">Username</Text>
            <Text color="text-secondary">{user.profile.name}</Text>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <Text className="font-bold">Email address</Text>
              <IconButton
                size="small"
                icon={<MdEdit />}
                onPress={() => toggle(true)}
                className={edit ? 'opacity-0 pointer-events-none' : ''}
              />
            </div>
            {data != null && (
              <div className="flex flex-row">
                <TextField
                  defaultValue={data?.email}
                  disabled={!edit}
                  className={edit ? '' : 'cursor-disabled'}
                />
              </div>
            )}
          </div>
        </div>
        <DeleteAccount />
      </Screen.Content>
    </Screen>
  );
}
