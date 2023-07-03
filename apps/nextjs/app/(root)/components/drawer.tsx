'use client';
import { useSafeArea } from '@app/context/safearea';
import useBoolean from '@app/hooks/useBoolean';
import useClassName, { OverrideClassName } from '@app/hooks/useClassName';
import { animated, easings, useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import React from 'react';

export interface DrawerMethods {
  open: () => void;
  close: () => void;
}

type DrawerProps = React.HTMLProps<HTMLDivElement> & OverrideClassName;

const Drawer: React.ForwardRefRenderFunction<
  DrawerMethods,
  React.PropsWithChildren<DrawerProps>
> = ({ children, ...rest }, ref) => {
  const [drawerActive, toggle] = useBoolean();
  const isMobile = useSafeArea((store) => store.mobile);
  const setDrawerWidth = useSafeArea((store) => store.setDrawerWidth);

  React.useLayoutEffect(() => {
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
    `fixed bg-paper h-screen touch-pan-y ${
      !drawerActive && isMobile ? 'pointer-events-none' : ''
    }`,
    rest,
  );
  const [{ transform }, api] = useSpring(() => ({
    transform: -1000,
    delay: 0,
    config: { duration: 100, easing: easings.linear },
  }));
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
        api.start({
          transform: val,
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
        api.start({
          transform: reachedThreshold ? -divRef.current.offsetWidth : 0,
        });
        toggle(!reachedThreshold);
      }
    },
  });
  const drawerDrag = useGesture({
    onDrag: (s) => {
      const [x] = s.delta;
      const [vX] = s.velocity;
      const [symbol] = s.direction;
      velocityX.current = symbol !== 0 ? symbol * vX : velocityX.current;
      drawerPanRef.current = Math.min(transform.get() + x, 0);
      api.start({
        transform: drawerPanRef.current,
        immediate: true,
      });
    },
    onPointerUp: () => {
      if (drawerPanRef.current != null && divRef.current != null) {
        const reachedThreshold =
          0.5 * -divRef.current.offsetWidth > drawerPanRef.current;

        if (velocityX.current <= -0.5) {
          api.start({
            transform: -divRef.current.offsetWidth,
          });
          toggle(false);
        } else {
          api.start({
            transform: reachedThreshold ? -divRef.current.offsetWidth : 0,
          });
          toggle(!reachedThreshold);
        }
        velocityX.current = 0;
      }
    },
  });
  const onToggle = () => toggle();
  React.useEffect(() => {
    if (divRef.current != null)
      if (drawerActive) {
        document.body.style.overflow = 'hidden';
        api.start({ transform: 0 });
      } else {
        document.body.style.overflow = 'unset';
        api.start({
          transform: -divRef.current.offsetWidth,
        });
      }
  }, [drawerActive, api]);
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
        onClick={onToggle}
        style={{
          opacity: transform.to(
            [0, -(divRef.current?.offsetWidth ?? 1)],
            [1, 0],
          ),
        }}
        className={`h-full w-screen bg-black/[.3] fixed transition duration-250 touch-none ${
          !drawerActive ? 'pointer-events-none' : ''
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
            [0, -(divRef.current?.offsetWidth ?? 1)],
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
