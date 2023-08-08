import { Providers } from '@app/context';
import '../globals.css';
import Navbar from '@app/(root)/components/navbar';
import SafeArea from '@app/(root)/components/safearea';
import React from 'react';

export interface RootLayoutProps extends React.PropsWithChildren {
  paper?: boolean;
}

function RootLayout({ children, paper }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${paper ? 'bg-paper' : 'bg-default'} flex`}>
        <Providers>
          <div id="__modal__" />
          <Navbar />
          <SafeArea>{children}</SafeArea>
        </Providers>
      </body>
    </html>
  );
}

export default function generateLayout(layout?: RootLayoutProps) {
  async function Layout(props: React.PropsWithChildren) {
    return <RootLayout {...props} {...layout} />;
  }

  return Layout;
}
