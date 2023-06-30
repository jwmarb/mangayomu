import { ClientRealmProvider } from '@app/context/realm';
import env from '@mangayomu/vercel-env';

/**
 * Wraps all context to be consumed for client components
 * @returns
 */
export function Providers({ children }: React.PropsWithChildren) {
  return (
    <ClientRealmProvider appId={env().REACT_APP_REALM_ID}>
      {children}
    </ClientRealmProvider>
  );
}
