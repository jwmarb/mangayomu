'use client';
import Button from '@app/components/Button';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import { useRouter } from 'next/navigation';
import React from 'react';
import { GiBookshelf } from 'react-icons/gi';

export default function NoSelectedSources() {
  const router = useRouter();
  return (
    <Screen.Content className="flex flex-col items-center justify-center gap-4">
      <div>
        <GiBookshelf className="text-primary w-20 h-20 mx-auto" />
        <Text className="text-center" variant="header">
          No sources selected
        </Text>
        <Text className="text-center" color="text-secondary">
          Selected sources will have their updates shown here
        </Text>
      </div>
      <Button
        variant="contained"
        color="primary"
        onPress={() => {
          router.push('/sources');
        }}
      >
        Open Source Selector
      </Button>
    </Screen.Content>
  );
}
