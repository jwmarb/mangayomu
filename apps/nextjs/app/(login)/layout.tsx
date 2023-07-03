import DarkMode from '@app/components/DarkMode';
import { Providers } from '@app/context';
import '@app/globals.css';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
export const metadata: Metadata = {
  viewport: {
    initialScale: 1,
    maximumScale: 1,
  },
};
export default function LoginLayout(props: React.PropsWithChildren) {
  const { children } = props;
  const nextCookies = cookies();
  const idToken = nextCookies.get('id_token');
  if (idToken != null) {
    return redirect('/');
  }
  return (
    <html lang="en">
      <body className="bg-default w-screen flex container:md items-center flex-row">
        <div className="xl:w-full"></div>
        <div className="grid gap-4 flex-grow bg-paper min-h-screen py-4 w-full px-8">
          <div className="justify-self-end">
            <DarkMode />
          </div>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
