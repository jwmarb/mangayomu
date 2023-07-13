import React from 'react';
import Form from '@app/(login)/login/components/form';
import { nanoid } from 'nanoid';
import env from '@mangayomu/vercel-env';
import Text from '@app/components/Text';
import DarkMode from '@app/components/DarkMode';
import { redirect } from 'next/navigation';

export default function Login() {
  return (
    <div className="max-w-md w-full mx-auto">
      <Text
        className="text-text-primary text-center pb-4"
        variant="header-emphasized"
      >
        Sign into your account
      </Text>
      <Form clientId={env().GOOGLE_OAUTH2_ID} />
    </div>
  );
}
