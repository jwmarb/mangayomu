'use client';
import IconButton from '@app/components/IconButton';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';

interface BackHeader extends React.PropsWithChildren {
  title?: React.ReactNode;
  headerRight?: React.ReactNode;
}

export default function BackHeader(props: BackHeader) {
  const { title, headerRight, children } = props;
  const router = useRouter();
  const onBack = () => {
    router.back();
  };
  const count = React.Children.count(children);
  if (count > 0)
    return (
      <Screen.Header className="z-20 pb-2 gap-2 flex flex-col">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <IconButton onPress={onBack} icon={<MdArrowBack />} />
            {typeof title === 'string' ? (
              <Text className="font-medium">{title}</Text>
            ) : (
              title
            )}
          </div>
          {headerRight}
        </div>

        {children}
      </Screen.Header>
    );
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
