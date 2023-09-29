'use client';
import Navbar from '@app/(root)/components/navbar';
import SafeArea from '@app/(root)/components/safearea';
import { useParams } from 'next/navigation';

export default function RouteLayout(props: React.PropsWithChildren) {
  const { children } = props;
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
