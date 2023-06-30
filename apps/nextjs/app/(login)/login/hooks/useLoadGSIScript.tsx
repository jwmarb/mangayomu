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
  React.useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://accounts.google.com/gsi/client';
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.onload = () => {
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

  React.useEffect(() => {
    if (loaded) {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          console.log(response);
        },
        ux_mode: 'redirect',
      });
      const placeholder = document.getElementById('__google_sign_in_button__');
      if (placeholder != null)
        window.google?.accounts.id.renderButton(placeholder, {
          text: 'signin_with',
          type: 'standard',
          theme: 'outline',
          size: 'large',
          logo_alignment: 'left',
          width: '100',
        });
    }
  }, [clientId, loaded]);

  return [loaded, error, button] as const;
}
