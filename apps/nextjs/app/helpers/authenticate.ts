import { EmbeddedResponseStatus } from '@mangayomu/request-handler';
import env from '@mangayomu/vercel-env';
import { StatusCodes } from 'http-status-codes';
import { cookies } from 'next/headers';

type AuthTokenResponse =
  | { type: 'INVALID_TOKEN' }
  | { type: 'TOKEN_NOT_PROVIDED' }
  | { type: 'TOKEN_VALID'; idToken: string };

const authenticate = async (): Promise<AuthTokenResponse> => {
  const nextCookies = cookies();
  const id_token = nextCookies.get('id_token');
  if (id_token) {
    const body = JSON.stringify({ id_token: id_token.value });
    const response = await fetch(env().VERCEL_URL + '/api/v1/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      next: { revalidate: false },
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

export default authenticate;
