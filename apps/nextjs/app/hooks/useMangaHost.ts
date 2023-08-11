import { useMangaProxy } from '@app/context/proxy';
import getMangaHost from '@app/helpers/getMangaHost';
import React from 'react';

export default function useMangaHost(payload: string) {
  const proxy = useMangaProxy();
  return React.useMemo(() => {
    const host = getMangaHost(payload);
    host.proxy = proxy;
    return host;
  }, [payload, proxy]);
}
