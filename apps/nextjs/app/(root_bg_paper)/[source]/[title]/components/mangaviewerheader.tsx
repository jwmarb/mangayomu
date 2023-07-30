'use client';
import IconButton from '@app/components/IconButton';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';

interface MangaViewerHeaderProps {
  title: string;
}

export default function MangaViewerHeader(props: MangaViewerHeaderProps) {
  const { title } = props;
  const router = useRouter();
  const onBack = () => {
    router.back();
  };
  return (
    <Screen.Header className="z-20 pb-2 flex flex-row gap-2 items-center">
      <IconButton onPress={onBack} icon={<MdArrowBack />} />
      <Text className="font-medium">{title}</Text>
    </Screen.Header>
  );
}
