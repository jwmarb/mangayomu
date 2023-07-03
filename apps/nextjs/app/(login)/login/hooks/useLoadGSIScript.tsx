import * as Realm from 'realm-web';
import { useRealm, useUserSetter } from '@app/context/realm';
import useBoolean from '@app/hooks/useBoolean';
import React from 'react';

const button: React.FC = () => <div id="__google_sign_in_button__" />;

/**
 * Loads Google's GSI script for account authorization. This script is required to call `window.google`
 * @returns Returns two states indicating if the script has been loaded and the error
 */
export function useLoadGSIScript(clientId: string) {
  const [loaded, toggle] = useBoolean();
  const [error, setError] = React.useState<string>('');
  React.useInsertionEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://accounts.google.com/gsi/client';
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (response.credential != null) {
            // const googleCredentials = Realm.Credentials.google({
            //   idToken: response.credential,
            // });
            // const user = await realm.logIn(googleCredentials);
            /**
             * Store id in localStorage
             */
            // console.log(user.profile.);
            // setUser(user);
          }
        },
        ux_mode: 'popup',
      });
      const placeholder = document.getElementById('__google_sign_in_button__');
      if (placeholder != null)
        window.google?.accounts.id.renderButton(placeholder, {
          text: 'signin_with',
          type: 'standard',
          theme: 'filled_blue',
          size: 'large',
          logo_alignment: 'left',
          width: '100',
        });
      toggle(true);
    };
    scriptTag.onerror = (e) => {
      toggle(false);
      setError(e.toString());
    };
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, [toggle, setError]);

  return [loaded, error, button] as const;
}
