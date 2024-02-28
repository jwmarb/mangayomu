import { DialogMethods } from './';
import Dialog from './Dialog';
import React from 'react';
import { DialogContext } from '@hooks/useDialog';

const DialogProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const ref = React.useRef<DialogMethods>(null);
  // const [methods, setMethods] = React.useState<DialogMethods>({
  //   open: () => void 0,
  // });

  // React.useEffect(() => {
  //   if (ref.current) setMethods(ref.current);
  // }, []);

  return (
    <>
      <Dialog ref={ref} />
      <DialogContext.Provider value={ref}>{children}</DialogContext.Provider>
    </>
  );
};

export default DialogProvider;
