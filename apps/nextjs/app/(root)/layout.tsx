import { Providers } from '@app/context';
import '../globals.css';
import Navbar from '@app/(root)/components/navbar';
import SafeArea from '@app/(root)/components/safearea';
import authenticate from '@app/helpers/authenticate';

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const auth = await authenticate();
  const idToken = auth.type === 'TOKEN_VALID' ? auth.idToken : undefined;

  return (
    <html lang="en">
      <body className="bg-default flex">
        <Providers
          idToken={idToken}
          idTokenInvalid={auth.type === 'INVALID_TOKEN'}
        >
          <Navbar />
          <SafeArea>{children}</SafeArea>
        </Providers>
      </body>
    </html>
  );
}
