'use client';
import Account from '@app/(root)/settings/components/account';
import InterfaceTheme from '@app/(root)/settings/components/interfacetheme';
import Reader from '@app/(root)/settings/components/reader';
import IconButton from '@app/components/IconButton';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import { useRouter } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';

export default function Page() {
  const router = useRouter();
  const handleOnBack = () => {
    router.back();
  };
  return (
    <Screen>
      <Screen.Header className="z-20 pb-2 flex flex-row gap-2 items-center">
        <IconButton onPress={handleOnBack} icon={<MdArrowBack />} />
        <Text className="font-medium">Settings</Text>
      </Screen.Header>
      <Screen.Content overrideClassName="flex flex-col gap-4 py-4 max-w-screen-lg mx-auto">
        <Account />
        <InterfaceTheme />
        <Reader />
      </Screen.Content>
    </Screen>
  );
}
