'use client';
import useClassName from '@app/hooks/useClassName';
import React from 'react';

const HeaderHeightContext = React.createContext<number | undefined>(undefined);
const SetHeaderHeightContext = React.createContext<React.Dispatch<
  React.SetStateAction<number | undefined>
> | null>(null);

export const useHeaderHeight = () => React.useContext(HeaderHeightContext);
export const useSetHeaderHeight = () => {
  const ctx = React.useContext(SetHeaderHeightContext);
  if (ctx == null)
    throw new Error(
      'Tried to consume SetHeaderHeightContext but the component is not a child of its provider',
    );
  return ctx;
};

interface ScreenBaseProps
  extends React.PropsWithChildren,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {}

const ScreenBase: React.FC<ScreenBaseProps> = (props) => {
  const { children, ...rest } = props;
  const className = useClassName('w-full relative', props);
  const [headerHeight, setHeaderHeight] = React.useState<number | undefined>();
  return (
    <div {...rest} className={className}>
      <HeaderHeightContext.Provider value={headerHeight}>
        <SetHeaderHeightContext.Provider value={setHeaderHeight}>
          {children}
        </SetHeaderHeightContext.Provider>
      </HeaderHeightContext.Provider>
    </div>
  );
};

export default ScreenBase;
