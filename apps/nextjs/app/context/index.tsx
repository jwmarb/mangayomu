import SafeAreaProvider from '@app/components/SafeAreaProvider';
import ContextWrapper from '@app/context/contextwrapper';
import { DarkModeInitializer } from '@app/context/darkmode';
import ImageResolver from '@app/context/imageresolver';
import MangaLibraryInitializer from '@app/context/library';
import MangaProxyProvider from '@app/context/proxy';
import { ClientRealmProvider } from '@app/context/realm';
import env from '@mangayomu/vercel-env';
import { cookies } from 'next/headers';

type ProvidersProps = React.PropsWithChildren & { paper?: boolean };

/**
 * Wraps all context to be consumed for client components
 */
export function Providers({ children, paper }: ProvidersProps) {
  const nextCookies = cookies();
  const id_token = nextCookies.get('id_token');
  return (
    <ClientRealmProvider
      appId={env().REACT_APP_REALM_ID}
      authToken={id_token?.value}
    >
      <MangaProxyProvider proxy={env().PROXY_URL}>
        <DarkModeInitializer>
          <MangaLibraryInitializer>
            <SafeAreaProvider>
              <ImageResolver>
                <ContextWrapper paper={paper}>{children}</ContextWrapper>
              </ImageResolver>
            </SafeAreaProvider>
          </MangaLibraryInitializer>
        </DarkModeInitializer>
      </MangaProxyProvider>
    </ClientRealmProvider>
  );
}
