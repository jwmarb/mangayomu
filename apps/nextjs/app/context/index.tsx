import { DarkModeInitializer } from '@app/context/darkmode';
import ImageResolver from '@app/context/imageresolver';
import MangaLibraryInitializer from '@app/context/library';
import { ClientRealmProvider } from '@app/context/realm';
import env from '@mangayomu/vercel-env';

type ProvidersProps = React.PropsWithChildren;

/**
 * Wraps all context to be consumed for client components
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ClientRealmProvider appId={env().REACT_APP_REALM_ID}>
      <DarkModeInitializer>
        <MangaLibraryInitializer>
          <ImageResolver>{children}</ImageResolver>
        </MangaLibraryInitializer>
      </DarkModeInitializer>
    </ClientRealmProvider>
  );
}
