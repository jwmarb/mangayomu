import '@mangayomu/mangascraper';
import { Handler, Route } from '@mangayomu/request-handler';
import { getListMangas, mongodb } from '@main';
import type { UpdatesParams } from '@main';

const get: Route = async (req, res) => {
  const query = req.query<UpdatesParams>();
  if (!Array.isArray(query.source)) query.source = [query.source];
  const data = await getListMangas(
    query.source,
    'recent_updates',
    'listRecentlyUpdatedManga',
  );

  res.json(data);
};

export default Handler.builder()
  .middleware(mongodb())
  .route('GET', get)
  .build();
