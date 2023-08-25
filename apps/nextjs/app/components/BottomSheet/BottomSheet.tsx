import { BottomSheetMethods } from '@app/components/BottomSheet';
import useBoolean from '@app/hooks/useBoolean';
import { animated, useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import React from 'react';
import { createPortal } from 'react-dom';
import { Freeze } from 'react-freeze';

function BottomSheet(
  props: React.PropsWithChildren,
  ref: React.ForwardedRef<BottomSheetMethods>,
) {
  const { children } = props;
  const [modalEl, setModalEl] = React.useState<HTMLElement | null>(null);
  const drag = useGesture({
    onDragEnd: (s) => {
      const [_, y] = s.delta;
      const [__, velocity_y] = s.velocity;
      const sign = s.direction[1] > 0 ? 1 : -1;
      const val = Math.min(
        window.innerHeight,
        Math.max(0, top.get() + y + velocity_y * 50 * sign),
      );

      if (val / window.innerHeight > 0.75) close();
      else
        apiDrag.start({
          top: val,
        });
    },
    onDrag: (s) => {
      const [_, y] = s.delta;
      const val = Math.min(window.innerHeight, Math.max(0, top.get() + y));
      apiDrag.start({
        top: val,
        immediate: true,
      });
    },
  });
  const [visible, toggleVisible] = useBoolean();
  const [{ opacity }, api] = useSpring(() => ({
    opacity: 0,
    config: {
      duration: 150,
    },
    onChange(result) {
      toggleVisible(result.value.opacity > 0);
    },
  }));
  const [{ top }, apiDrag] = useSpring(() => ({
    top: window.innerHeight,
    // onChange: (r) => {
    //   console.log(r.value.top);
    // },
  }));
  function open() {
    api.start({ opacity: 1 });
    apiDrag.start({ top: window.innerHeight / 2 });
  }
  function close() {
    api.start({ opacity: 0 });
    apiDrag.start({ top: window.innerHeight });
  }
  React.useImperativeHandle(ref, () => ({
    open,
    close,
  }));
  React.useLayoutEffect(() => {
    setModalEl(document.getElementById('__modal__'));
  }, []);

  if (modalEl == null) return null;

  return createPortal(
    <Freeze freeze={!visible}>
      <animated.div
        style={{ opacity }}
        className={`z-50 fixed bottom-0 left-0 right-0 top-0 w-full h-full bg-black/[.3] ${
          !visible ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        <div className="z-50 fixed left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] top-[50%] w-full max-w-screen-lg" />
        <animated.div
          style={{ top }}
          {...drag()}
          className="touch-none absolute bg-paper top-0 right-0 bottom-0 left-0"
        >
          {children}
        </animated.div>
      </animated.div>
    </Freeze>,
    modalEl,
  );
}

export default React.forwardRef(BottomSheet);
