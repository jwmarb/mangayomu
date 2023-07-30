import Highlight from '@app/(root)/settings/components/highlight';
import Text from '@app/components/Text';
import { useDarkMode } from '@app/context/darkmode';
import React from 'react';
import { useButton } from 'react-aria';
import { MdCheck, MdCheckCircle } from 'react-icons/md';
import { shallow } from 'zustand/shallow';

interface ThemePreviewProps {
  value: 'light' | 'dark' | null;
  title: string;
  default?: boolean;
  selected?: boolean;
}

function ThemePreview(props: ThemePreviewProps) {
  const { value, title, default: isDefault, selected } = props;
  const { reset, set } = useDarkMode(
    (store) => ({ reset: store.toSystemDefault, set: store.toggleDarkMode }),
    shallow,
  );
  const dark =
    value === 'dark' ||
    (value == null &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  const ref = React.useRef<HTMLButtonElement>(null);
  const handleOnPress = () => {
    if (value == null) reset();
    else set(value === 'dark');
  };
  const paper = dark ? 'bg-paper-dark' : 'bg-paper-light';
  const skeleton = dark ? 'bg-gray-700' : 'bg-gray-300';
  const primary = dark ? 'bg-primary-dark' : 'bg-primary-light';
  const secondary = dark ? 'bg-secondary-dark' : 'bg-secondary-light';
  const border = dark ? 'bg-border-dark' : 'bg-border-light';
  return (
    <Highlight className="flex flex-col gap-1 relative" selected={selected}>
      <Highlight.Bounds
        ref={ref}
        onPress={handleOnPress}
        className={`min-w-[9rem] h-[13.3333rem] md:w-[16rem] md:h-[9rem] overflow-hidden ${paper} rounded-xl grid gap-1`}
      >
        <div className={`w-16 h-2 ${skeleton} rounded-b-lg mx-auto`} />
        <div className={`w-20 h-1 ${skeleton} rounded-full mx-auto`} />
        <div className={`w-12 h-1 ${skeleton} rounded-full mx-auto`} />
        <div className="flex flex-row items-center mx-auto gap-1">
          <div className={`w-16 h-2 ${primary} rounded-sm mx-auto`} />
          <div className={`w-4 h-2 ${secondary} rounded-sm mx-auto`} />
        </div>
        <div className="p-0.5" />
        <div className={`w-20 h-1 ${skeleton} rounded-full mx-auto`} />
        <div className={`w-20 h-1 ${skeleton} rounded-full mx-auto`} />
        <div className={`w-20 h-1 ${skeleton} rounded-full mx-auto`} />
        <div className="w-20 mx-auto">
          <div className={`${skeleton} rounded-full w-12 h-1`} />
        </div>
        <div className={`w-20 h-0.5 ${border} mx-auto`} />
        <div className="w-20 flex flex-row justify-between mx-auto">
          <div className={`w-4 h-1 ${skeleton} rounded-full`} />
          <div className={`w-2 h-1 ${skeleton} rounded-full`} />
        </div>
        <div className="w-20 flex flex-row justify-between mx-auto">
          <div className={`w-5 h-1 ${skeleton} rounded-full`} />
          <div className={`w-2 h-1 ${skeleton} rounded-full`} />
        </div>
        <div className="w-20 flex flex-row justify-between mx-auto">
          <div className={`w-3 h-1 ${skeleton} rounded-full`} />
          <div className={`w-3 h-1 ${skeleton} rounded-full`} />
        </div>
        <div className="w-20 flex flex-row justify-between mx-auto">
          <div className={`w-5 h-1 ${skeleton} rounded-full`} />
          <div className={`w-6 h-1 ${skeleton} rounded-full`} />
        </div>
        <div className="p-0.5" />

        <div className={`w-20 h-0.5 ${border} mx-auto`} />
        <div className="w-20 flex flex-col gap-0.5 mx-auto">
          <div className={`w-3 h-1 ${skeleton} rounded-full`} />
          <div className={`w-6 h-1 ${skeleton} rounded-full`} />
        </div>
        <div className={`w-20 h-0.5 ${border} mx-auto`} />

        <div className="w-20 flex flex-col gap-0.5 mx-auto">
          <div className={`w-3 h-1 ${skeleton} rounded-full`} />
          <div className={`w-6 h-1 ${skeleton} rounded-full`} />
        </div>
        <div className={`w-20 h-0.5 ${border} mx-auto`} />

        <div className="w-20 flex flex-col gap-0.5 mx-auto">
          <div className={`w-3 h-1 ${skeleton} rounded-full`} />
          <div className={`w-6 h-1 ${skeleton} rounded-full`} />
        </div>
        <div className={`w-20 h-0.5 ${border} mx-auto`} />

        <div className="w-20 flex flex-col gap-0.5 mx-auto">
          <div className={`w-3 h-1 ${skeleton} rounded-full`} />
          <div className={`w-6 h-1 ${skeleton} rounded-full`} />
        </div>
        <div className={`w-20 h-0.5 ${border} mx-auto`} />
      </Highlight.Bounds>
      <div className="flex flex-row items-center gap-1">
        <Text>{title} </Text>
        {isDefault && (
          <Text variant="sm-label" color="text-secondary">
            (Default)
          </Text>
        )}
      </div>
    </Highlight>
  );
}

export default React.memo(ThemePreview);
