import axios from 'axios';
import MangaHost from '../scraper/scraper.abstract';
import '../MangaSee';
import '../MangaPark_v5';

interface DomainErrorException {
  error: unknown;
  source: string;
}

describe('Connection tests', () => {
  const hosts = MangaHost.sourcesMap;
  const hostCollection: MangaHost[] = [];
  for (const x of Object.values(hosts)) {
    hostCollection.push(x);
  }

  it('Resolves all domains', async () => {
    function toURL(link: string) {
      return `https://${link}/`;
    }
    const resolved = await Promise.allSettled(
      hostCollection.map(
        (x) =>
          new Promise<{ source: string; error?: unknown }>((res, rej) => {
            axios
              .get(toURL(x.getLink()))
              .then(() => {
                res({ source: x.name });
              })
              .catch((e) => {
                rej({ error: e, source: x.name } as DomainErrorException);
              });
          }),
      ),
    );
    const failed: DomainErrorException[] = [];
    for (const result of resolved) {
      switch (result.status) {
        case 'rejected':
          failed.push(result.reason as DomainErrorException);
          break;
      }
    }
    if (failed.length > 0) {
      throw new Error(
        `${failed.length} source${
          failed.length === 1 ? '' : 's'
        } failed to GET request.\nHere are the list of sources that failed and their exceptions:\n${failed
          .map(
            ({ source, error }, i) =>
              `[${i}] ${source} -> ${error}\n\tGET -> ${toURL(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                hosts.get(source)!.getLink(),
              )}`,
          )
          .join('\n')}`,
      );
    }
  });
});
