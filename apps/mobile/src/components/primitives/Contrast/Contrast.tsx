import React from 'react';

export const ContrastContext = React.createContext<boolean | undefined>(
  undefined,
);

export type ContrastProps = React.PropsWithChildren<{
  contrast?: boolean;
}>;

/**
 * A HOC that passes `contrast` to all of its children, preventing the need to pass `contrast` to each component individually
 */
export default function Contrast(props: ContrastProps) {
  return (
    <ContrastContext.Provider value={props.contrast}>
      {props.children}
    </ContrastContext.Provider>
  );
}
