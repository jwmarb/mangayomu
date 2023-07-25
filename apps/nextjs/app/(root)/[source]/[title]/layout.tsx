import Navbar from '@app/(root)/components/navbar';
import SafeArea from '@app/(root)/components/safearea';
import { Providers } from '@app/context';
import authenticate from '@app/helpers/authenticate';
import React from 'react';

export default async function Layout({ children }: React.PropsWithChildren) {
  const auth = await authenticate();
  const idToken = auth.type === 'TOKEN_VALID' ? auth.idToken : undefined;
  return (
    <body className="bg-paper flex">
      <Providers
        idToken={idToken}
        idTokenInvalid={auth.type === 'INVALID_TOKEN'}
      >
        <Navbar />
        <SafeArea>{children}</SafeArea>
      </Providers>
    </body>
  );
}
