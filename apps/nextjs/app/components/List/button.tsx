import React from 'react';

export interface ListButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: React.ReactElement;
  active?: boolean;
  textProps?: TextProps<'p'>;
}

import Text, { TextProps } from '@app/components/Text';

export default function ListButton(props: ListButtonProps) {
  const {
    children,
    active,
    icon,
    textProps = { color: active ? 'primary' : 'text-primary' },
    ...rest
  } = props;
  return (
    <button
      {...(rest as React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >)}
      className={`transition outline-none focus:border-primary/[.3] border-2 border-transparent duration-250 w-full flex flex-row items-center space-x-3.5 px-2.5 py-1.5 rounded-md overflow-auto ${
        active ? 'hover:bg-primary/[0.15]' : 'hover:bg-hover'
      }`}
    >
      {icon &&
        React.cloneElement(icon, {
          className: `w-6 h-6 text-hint ${
            active ? 'text-primary' : 'text-text-primary'
          }`,
        })}
      <Text {...textProps}>{children}</Text>
    </button>
  );
}
