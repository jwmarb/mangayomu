'use client';
import IconButton from '@app/components/IconButton';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';

export default function BackButton() {
  const router = useRouter();
  const handleOnPress = () => {
    router.back();
  };
  return <IconButton icon={<MdArrowBack />} onPress={handleOnPress} />;
}
