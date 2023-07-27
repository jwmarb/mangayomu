import { Providers } from '@app/context';
import '../globals.css';
import Navbar from '@app/(root)/components/navbar';
import SafeArea from '@app/(root)/components/safearea';
import authenticate from '@app/helpers/authenticate';
import React from 'react';

export interface RootLayoutProps extends React.PropsWithChildren {
  paper?: boolean;
  idToken?: string;
  idTokenInvalid?: boolean;
}

function RootLayout({
  children,
  paper,
  idToken,
  idTokenInvalid,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${paper ? 'bg-paper' : 'bg-default'} flex`}>
        <Providers idToken={idToken} idTokenInvalid={idTokenInvalid}>
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
    const auth = await authenticate();
    const idToken = auth.type === 'TOKEN_VALID' ? auth.idToken : undefined;
    return (
      <RootLayout
        {...props}
        {...layout}
        idToken={idToken}
        idTokenInvalid={auth.type === 'INVALID_TOKEN'}
      />
    );
  }

  return Layout;
}
