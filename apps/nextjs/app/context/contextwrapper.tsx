'use client';

import Navbar from '@app/(root)/components/navbar';
import SafeArea from '@app/(root)/components/safearea';
import { useParams, usePathname } from 'next/navigation';

export default function ContextWrapper(
  props: React.PropsWithChildren<{ paper?: boolean }>,
) {
  const { children, paper } = props;
  const params = useParams();

  if ('chapter' in params)
    return (
      <>
        {props.children}
        <div id="overlay" />
        <div id="__modal__" />
      </>
    );

  return (
    <>
      <div id="__modal__" />
      <Navbar />
      <SafeArea>{children}</SafeArea>
    </>
  );
}
