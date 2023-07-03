'use client';
import WeatherNightIcon from 'mdi-react/WeatherNightIcon';
import WeatherSunnyIcon from 'mdi-react/WeatherSunnyIcon';
import { AriaButtonProps, useToggleButton } from 'react-aria';
import { useToggleState } from 'react-stately';
import React from 'react';
import { useDarkMode } from '@app/context/darkmode';
import { shallow } from 'zustand/shallow';

export default function DarkMode(props: AriaButtonProps<'button'>) {
  const [isDark, toggle] = useDarkMode(
    (store) => [store.isDarkMode, store.toggleDarkMode],
    shallow,
  );
  const state = useToggleState();
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps } = useToggleButton(
    {
      ...props,
      onPress: () => {
        toggle();
      },
    },
    state,
    ref,
  );
  return (
    <button
      {...(buttonProps as any)}
      ref={ref}
      className="w-9 h-9 transition duration-250 active:bg-black/[0.22] active:dark:bg-white/[0.3] hover:dark:bg-white/[0.2] hover:bg-black/[0.15] bg-black/[.07] dark:bg-white/10 text-black dark:text-white p-1.5 outline outline-1 outline-default rounded focus:ring-4 focus:ring-primary/[0.3]"
    >
      {isDark ? <WeatherSunnyIcon /> : <WeatherNightIcon />}
    </button>
  );
}
