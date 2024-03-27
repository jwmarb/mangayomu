import React from 'react';
import { BackHandler, View } from 'react-native';
import { Freeze } from 'react-freeze';
import useBoolean from '@/hooks/useBoolean';

export type Modal = {
  show(): void;
  hide(): void;
};

function ModalComponent(
  { children }: React.PropsWithChildren,
  ref: React.ForwardedRef<Modal>,
) {
  const [show, toggle] = useBoolean();

  React.useImperativeHandle(ref, () => ({
    show() {
      toggle(true);
    },
    hide() {
      toggle(false);
    },
  }));

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (show) {
          toggle(false);
          return true;
        }
        return false;
      },
    );
    return () => {
      subscription.remove();
    };
  }, [show]);

  return (
    <Freeze freeze={!show}>
      <View style={{ backgroundColor: 'red', position: 'absolute', bottom: 0 }}>
        {children}
      </View>
    </Freeze>
  );
}

export const Modal = React.forwardRef(ModalComponent);
