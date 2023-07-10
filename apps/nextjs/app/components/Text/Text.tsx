import React from 'react';
import { TextComponentType, TextProps } from './';
import useClassName from '@app/hooks/useClassName';
import {
  ButtonColor,
  ButtonContrastColors,
  TextColor,
  TextVariant,
} from '@app/theme';
import Link from 'next/link';

const DynamicTextComponent: React.FC<
  React.PropsWithChildren<{ type: TextComponentType } & Record<string, unknown>>
> = (props) => {
  const { children, type: variant, ...rest } = props;
  switch (variant) {
    case 'label':
      return <label {...rest}>{children}</label>;
    case 'p':
      return <p {...rest}>{children}</p>;
    case 'span':
      return <span {...rest}>{children}</span>;
    case 'h1':
      return <h1 {...rest}>{children}</h1>;
    case 'h2':
      return <h2 {...rest}>{children}</h2>;
    case 'h3':
      return <h3 {...rest}>{children}</h3>;
    case 'h4':
      return <h4 {...rest}>{children}</h4>;
    case 'h5':
      return <h5 {...rest}>{children}</h5>;
    case 'h6':
      return <h6 {...rest}>{children}</h6>;
    case 'a':
      if (rest.href != null)
        return (
          <Link href={rest.href} {...rest}>
            {children}
          </Link>
        );
      return <a {...rest}>{children}</a>;
  }
};

const TextVariants: Record<TextVariant, string> = {
  body: 'text-variant-body',
  button: 'text-variant-button',
  header: 'text-variant-header',
  'sm-label': 'text-variant-sm-label',
  'header-emphasized': 'text-variant-header-emphasized',
  'list-header': 'text-variant-list-header',
  'sm-badge': 'text-variant-sm-badge',
  'book-title': 'text-variant-book-title',
};
const TextColors: Record<
  TextColor | ButtonContrastColors | ButtonColor,
  string
> = {
  error: 'text-error',
  'text-primary': 'text-text-primary',
  'text-secondary': 'text-text-secondary',
  'primary-contrast': 'text-primary-contrast',
  'secondary-contrast': 'text-secondary-contrast',
  primary: 'text-primary',
  secondary: 'text-secondary',
  'error-contrast': 'text-error-contrast',
  hint: 'text-hint',
  'icon-button-contrast': 'text-icon-button-contrast',
};

export default function Text<T extends TextComponentType>(
  props: React.PropsWithChildren<TextProps<T>>,
) {
  const {
    variant = 'body',
    color = 'text-primary',
    component = 'p',
    children,
    ...rest
  } = props;
  const className = useClassName(
    `${TextVariants[variant]} ${TextColors[color]}`,
    props,
  );
  return (
    <DynamicTextComponent {...rest} type={component} className={className}>
      {children}
    </DynamicTextComponent>
  );
}
