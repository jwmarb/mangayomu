import { DarkModeInitializer } from '@app/context/darkmode';
import { ClientRealmProvider } from '@app/context/realm';
import env from '@mangayomu/vercel-env';

/**
 * Wraps all context to be consumed for client components
 * @returns
 */

interface ProvidersProps extends React.PropsWithChildren {
  idToken?: string;
  idTokenInvalid?: boolean;
}

export function Providers({
  children,
  idToken,
  idTokenInvalid,
}: ProvidersProps) {
  return (
    <ClientRealmProvider
      appId={env().REACT_APP_REALM_ID}
      idToken={idToken}
      idTokenInvalid={idTokenInvalid}
    >
      <DarkModeInitializer>{children}</DarkModeInitializer>
    </ClientRealmProvider>
  );
}
