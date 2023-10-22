'use client';
import DeleteAccount from '@app/(root)/account/components/deleteaccount';
import SaveChanges from '@app/(root)/account/components/savechanges';
import IconButton from '@app/components/IconButton';
import Progress from '@app/components/Progress';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import TextField from '@app/components/TextField';
import { useUser } from '@app/context/realm';
import useBoolean from '@app/hooks/useBoolean';
import useMongoClient from '@app/hooks/useMongoClient';
import UserSchema, { IUserSchema } from '@app/realm/User';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MdArrowBack, MdEdit } from 'react-icons/md';

let existingData: IUserSchema | null = null;

export default function Page() {
  const router = useRouter();
  const [edit, toggle] = useBoolean();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const handleOnBack = () => {
    router.back();
  };
  const user = useUser();
  const [data, setData] = React.useState<IUserSchema | null>(existingData);
  const [email, setEmail] = React.useState<string | undefined>(
    existingData?.email,
  );
  const [changes, toggleChanges] = useBoolean();
  const [loading, toggleLoading] = useBoolean();
  const userCollection = useMongoClient(UserSchema);
  React.useEffect(() => {
    if (data == null)
      userCollection
        .findOne({ _id: user.id }, { projection: { password: 0 } })
        .then((s) => {
          setEmail(s?.email);
          existingData = s;
          setData(s);
        });
  }, [data, user.id, userCollection]);
  const handleOnChangeEmail = (s: string) => {
    setEmail(s);
  };
  const handleOnReset = () => {
    if (emailRef.current != null) emailRef.current.value = data?.email ?? '';
    setEmail(data?.email);
  };
  const handleOnSave = () => {
    toggleLoading(true);
    setTimeout(() => {
      if (email != null)
        setData((s) => {
          if (s != null) return { ...s, email };
          return s;
        });
      toggleLoading(false);
      toggleChanges(false);
    }, 1000);
  };
  React.useEffect(() => {
    if (data != null) toggleChanges(email !== data.email);
  }, [email, data, toggleChanges]);
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
            {data != null ? (
              <div className="flex flex-row">
                <TextField
                  ref={emailRef}
                  onChange={handleOnChangeEmail}
                  defaultValue={data?.email}
                  disabled={!edit}
                  className={edit ? '' : 'cursor-disabled'}
                />
              </div>
            ) : (
              <div className="flex flex-row">
                <TextField
                  disabled
                  className="cursor-wait"
                  adornment={<Progress size={2} />}
                />
              </div>
            )}
          </div>
        </div>
        <DeleteAccount />
        <SaveChanges
          loading={loading}
          onReset={handleOnReset}
          onSave={handleOnSave}
          show={changes}
        />
      </Screen.Content>
    </Screen>
  );
}
