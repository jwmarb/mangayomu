type AriaProps<T extends HTMLElement, ReactAriaProps> = ReactAriaProps &
  Omit<
    React.DetailedHTMLProps<React.HTMLAttributes<T>, T>,
    keyof ReactAriaProps
  >;
