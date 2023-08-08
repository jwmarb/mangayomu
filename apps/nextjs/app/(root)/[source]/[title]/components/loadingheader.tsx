'use client';

import IconButton from '@app/components/IconButton';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import usePaperBackground from '@app/hooks/usePaperBackground';
import { useRouter } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';

export default function LoadingHeader() {
  usePaperBackground();
  const router = useRouter();
  const onBack = () => {
    router.back();
  };
  return (
    <Screen.Header className="z-20 pb-2 flex flex-row gap-2 items-center">
      <IconButton onPress={onBack} icon={<MdArrowBack />} />
      <Text.Skeleton classNames={['max-w-96 w-full']} />
    </Screen.Header>
  );
}
