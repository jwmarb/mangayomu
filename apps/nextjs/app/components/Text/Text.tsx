import React from 'react';
import { TextComponentType, TextProps } from './Text.interfaces';
import useClassName from '@app/hooks/useClassName';
import { ButtonColor, ButtonContrastColors, TextColor } from '@app/theme';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';
const config = resolveConfig(tailwindConfig);

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
  }
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
    `text-variant-${variant} text-${color}`,
    props,
  );
  return (
    <DynamicTextComponent {...rest} type={component} className={className}>
      {children}
    </DynamicTextComponent>
  );
}
