'use client';
import IconButton from '@app/components/IconButton';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';

interface BackHeader {
  title?: React.ReactNode;
  headerRight?: React.ReactNode;
}

export default function BackHeader(props: BackHeader) {
  const { title, headerRight } = props;
  const router = useRouter();
  const onBack = () => {
    router.back();
  };
  return (
    <Screen.Header className="z-20 pb-2 flex flex-row gap-2 items-center justify-between">
      <div className="flex flex-row gap-2 items-center">
        <IconButton onPress={onBack} icon={<MdArrowBack />} />
        {typeof title === 'string' ? (
          <Text className="font-medium">{title}</Text>
        ) : (
          title
        )}
      </div>
      {headerRight}
    </Screen.Header>
  );
}
