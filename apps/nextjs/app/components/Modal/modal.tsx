'use client';
import Text from '@app/components/Text';
import useBoolean from '@app/hooks/useBoolean';
import {
  animated,
  easings,
  useSpring,
  useSpringValue,
} from '@react-spring/web';
import React from 'react';
import { useButton } from 'react-aria';
import { createPortal } from 'react-dom';
import { Freeze } from 'react-freeze';
import useClassName from '@app/hooks/useClassName';
import { ModalMethods, ModalProps } from './';

function Modal(props: ModalProps, forwardedRef: React.Ref<ModalMethods>) {
  const { children, title, open: isOpen, onClose } = props;
  const [visible, toggleVisible] = useBoolean();

  const className = useClassName(
    'bg-paper mx-4 rounded-lg border-default border-2 overflow-hidden overflow-y-auto max-h-96',
    props,
  );
  const ref = React.useRef<HTMLDivElement>(null);
  const opacity = useSpringValue(0, {
    config: { duration: 100, easing: easings.linear },
    onChange: (result) => {
      toggleVisible((result as unknown as number) > 0);
    },
  });
  const { buttonProps } = useButton(
    {
      onPress: () => close(),
      elementType: 'div',
    },
    ref,
  );

  const close = () => {
    onClose && onClose();
    opacity.start(0);
  };
  const open = () => {
    opacity.start(1);
  };

  React.useImperativeHandle(forwardedRef, () => ({
    close,
    open,
  }));

  const [modalEl, setModalEl] = React.useState<HTMLElement | null>(null);
  React.useInsertionEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [visible]);
  React.useLayoutEffect(() => {
    setModalEl(document.getElementById('__modal__'));
  }, []);
  React.useEffect(() => {
    if (isOpen) open();
    else close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (modalEl == null) return null;

  return (
    <>
      {createPortal(
        <Freeze freeze={!visible}>
          <animated.div
            {...(buttonProps as React.ComponentProps<typeof animated.div>)}
            style={{ opacity }}
            ref={ref}
            className={
              'bg-overlay z-50 fixed top-0 left-0 right-0 bottom-0 w-full h-full cursor-default'
            }
          ></animated.div>
          <animated.div
            style={{ opacity }}
            className="z-50 fixed left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] top-[50%] w-full max-w-screen-lg"
          >
            <div className={className}>
              {title && (
                <>
                  <div className="p-4">
                    <Text variant="header">{title}</Text>
                  </div>
                  <div className="h-0.5 w-full bg-border" />
                </>
              )}
              {children}
            </div>
          </animated.div>
        </Freeze>,
        modalEl,
      )}
    </>
  );
}

export default React.forwardRef(Modal);
