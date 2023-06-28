import React from 'react';
import env from '@mangayomu/vercel-env';

const scope = encodeURIComponent('openid email profile');

const Login: React.FC = () => {
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${
    env().GOOGLE_OAUTH2_ID
  }&scope=${scope}&redirect_uri=${encodeURIComponent(
    env().VERCEL_URL.clone().join('api', 'v1', 'oauth2', 'google').toString(),
  )}&response_type=code&state=1234zyx`;
  return (
    <div>
      <form>
        <a href={authUrl}>{authUrl}</a>
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
