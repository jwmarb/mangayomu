'use client';
import { MdSunny, MdDarkMode } from 'react-icons/md';
import React from 'react';
import { useDarkMode } from '@app/context/darkmode';
import { shallow } from 'zustand/shallow';
import IconButton from '@app/components/IconButton';

export default function DarkMode() {
  const [isDark, toggle] = useDarkMode(
    (store) => [store.isDarkMode, store.toggleDarkMode],
    shallow,
  );

  return (
    <IconButton
      onPress={() => toggle()}
      icon={isDark ? <MdSunny /> : <MdDarkMode />}
    />
  );
}
