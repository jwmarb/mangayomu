'use client';
import { useDrawer } from '@app/context/drawer';
import { useSafeArea } from '@app/context/safearea';
import useClassName, { OverrideClassName } from '@app/hooks/useClassName';
import {
  animated,
  easings,
  useSpring,
  useSpringValue,
} from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import React from 'react';
import { shallow } from 'zustand/shallow';

export interface DrawerMethods {
  open: () => void;
  close: () => void;
}

type DrawerProps = React.HTMLProps<HTMLDivElement> & OverrideClassName;

const Drawer: React.ForwardRefRenderFunction<
  DrawerMethods,
  React.PropsWithChildren<DrawerProps>
> = ({ children, ...rest }, ref) => {
  const { active, toggle, setVisible } = useDrawer(
    (store) => ({
      active: store.active,
      toggle: store.toggle,
      setVisible: store.setVisible,
    }),
    shallow,
  );
  const isMobile = useSafeArea((store) => store.mobile);
  const setDrawerWidth = useSafeArea((store) => store.setDrawerWidth);

  React.useEffect(() => {
    if (divRef.current) setDrawerWidth(divRef.current.offsetWidth);

    const listener = () => {
      if (divRef.current) setDrawerWidth(divRef.current.offsetWidth);
    };
    divRef.current?.addEventListener('resize', listener);
    return () => {
      divRef.current?.removeEventListener('resize', listener);
    };
  }, [setDrawerWidth]);

  const className = useClassName(
    `fixed bg-paper h-screen touch-pan-y lg:border-r-2 border-default ${
      !active && isMobile ? 'pointer-events-none' : ''
    }`,
    rest,
  );
  const transform = useSpringValue(-1000, {
    delay: 0,
    config: { duration: 100, easing: easings.linear },
    onChange: (result) => {
      setVisible(
        (result as unknown as number) > -(divRef.current?.offsetWidth ?? 0),
      );
    },
  });
  const open = () => {
    toggle(true);
  };
  const close = () => {
    toggle(false);
  };

  React.useImperativeHandle(ref, () => ({ open, close }));
  const divRef = React.useRef<HTMLDivElement>(null);

  const panRef = React.useRef<number>(0);
  const drawerPanRef = React.useRef<number>(0);
  const velocityX = React.useRef<number>(0);

  const backdropDrag = useGesture({
    onDrag: (s) => {
      const [x] = s.xy;
      panRef.current = x;
      if (divRef.current) {
        const val =
          Math.min(divRef.current.offsetWidth, x) - divRef.current.offsetWidth;
        transform.start({
          to: val,
          immediate: true,
        });
        if (val <= -divRef.current.offsetWidth) toggle(false);
      }
    },
    onPointerUp: () => {
      if (divRef.current) {
        const reachedThreshold =
          0.5 * divRef.current.offsetWidth > panRef.current;
        // setWidth(reachedThreshold ? containerWidth : 0);
        transform.start(reachedThreshold ? -divRef.current.offsetWidth : 0);
        toggle(!reachedThreshold);
      }
    },
  });
  const drawerDrag = useGesture(
    {
      onDrag: (s) => {
        const [x] = s.delta;
        const [vX] = s.velocity;
        const [symbol] = s.direction;
        velocityX.current = symbol !== 0 ? symbol * vX : velocityX.current;
        drawerPanRef.current = Math.min(transform.get() + x, 0);
        console.log(drawerPanRef.current);
        transform.start({
          to: drawerPanRef.current,
          immediate: true,
        });
      },
      onPointerUp: () => {
        if (drawerPanRef.current != null && divRef.current != null) {
          const reachedThreshold =
            0.5 * -divRef.current.offsetWidth > drawerPanRef.current;

          if (velocityX.current <= -0.5) {
            transform.start(-divRef.current.offsetWidth);
            toggle(false);
          } else {
            transform.start(reachedThreshold ? -divRef.current.offsetWidth : 0);
            toggle(!reachedThreshold);
          }
          velocityX.current = 0;
        }
      },
    },
    { drag: { preventDefault: false, filterTaps: false } },
  );
  React.useEffect(() => {
    if (divRef.current != null)
      if (active) {
        document.body.style.overflow = 'hidden';
        transform.start(0);
      } else {
        document.body.style.overflow = 'unset';
        transform.start(-divRef.current.offsetWidth);
      }
  }, [active, transform]);
  React.useEffect(() => {
    if (!isMobile) toggle(false);
  }, [isMobile, toggle]);
  if (!isMobile)
    return (
      <div {...rest} ref={divRef} className={className}>
        {children}
      </div>
    );
  return (
    <>
      <animated.div
        {...backdropDrag()}
        onClick={() => toggle(false)}
        style={{
          opacity: transform.to(
            [0, -(divRef.current?.offsetWidth ?? 1)],
            [1, 0],
          ),
        }}
        className={`h-full w-screen bg-overlay fixed transition duration-250 touch-none ${
          !active ? 'pointer-events-none' : ''
        }`}
      />
      <animated.div
        {...rest}
        {...drawerDrag()}
        ref={divRef}
        className={className}
        style={{
          transform: transform.to((value) => `translateX(${value}px)`),
          opacity: transform.to(
            [0, -(divRef.current?.offsetWidth ?? 0)],
            [1, 0],
          ),
        }}
      >
        {children}
      </animated.div>
    </>
  );
};

export default React.forwardRef(Drawer);
