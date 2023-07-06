import { Providers } from '@app/context';
import { EmbeddedResponseStatus } from '@mangayomu/request-handler';
import env from '@mangayomu/vercel-env';
import { StatusCodes } from 'http-status-codes';
import { cookies } from 'next/headers';
import '../globals.css';
import Text from '@app/components/Text';
import Navbar from '@app/(root)/components/navbar';
import SafeArea from '@app/(root)/components/safearea';

type AuthTokenResponse =
  | { type: 'INVALID_TOKEN' }
  | { type: 'TOKEN_NOT_PROVIDED' }
  | { type: 'TOKEN_VALID'; idToken: string };

const authenticate = async (): Promise<AuthTokenResponse> => {
  const nextCookies = cookies();
  const id_token = nextCookies.get('id_token');
  if (id_token) {
    const body = JSON.stringify({ id_token: id_token.value });
    const response = await fetch(env().VERCEL_URL + 'api/v1/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      next: { revalidate: 0 },
    });
    const data: { response: EmbeddedResponseStatus } = await response.json();
    switch (data.response.status_code) {
      case StatusCodes.OK:
        return { type: 'TOKEN_VALID', idToken: id_token.value };
      case StatusCodes.UNAUTHORIZED:
        return { type: 'INVALID_TOKEN' };
    }
  }
  return { type: 'TOKEN_NOT_PROVIDED' };
};

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
