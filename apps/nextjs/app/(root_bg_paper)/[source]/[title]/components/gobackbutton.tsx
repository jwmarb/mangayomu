'use client';
import Button from '@app/components/Button';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function GoBackButton() {
  const router = useRouter();
  function handleOnPress() {
    router.back();
  }
  return (
    <Button variant="contained" color="primary" onPress={handleOnPress}>
      Go back
    </Button>
  );
}
